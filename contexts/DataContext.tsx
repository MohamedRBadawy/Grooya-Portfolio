/**
 * DataContext now hydrates from the backend session/profile/catalog APIs and
 * uses typed repositories for server-owned portfolio and resume documents.
 */
import React, { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

import type {
  AIFeature,
  FeatureFlags,
  Portfolio,
  PortfolioTemplate,
  Project,
  PromoCode,
  Resume,
  Skill,
  User,
} from '../types';
import { masterSkillsList, mockPromoCodes } from '../services/mockData';
import { portfolioTemplates as initialTemplates } from '../services/templates';
import { defaultFeatureFlags } from '../services/platform/featureFlags';
import { fetchSession, updateProfile as updateProfileRecord } from '../services/platform/auth';
import {
  createPortfolioRecord,
  deletePortfolioRecord,
  listPortfolios,
  updatePortfolioRecord,
} from '../services/platform/portfolioRepository';
import {
  createResumeRecord,
  deleteResumeRecord,
  listResumes,
  updateResumeRecord,
} from '../services/platform/resumeRepository';

const SESSION_EVENT = 'grooya:session-changed';

const ENTITLEMENTS = {
  free: {
    maxPortfolios: 1,
    maxResumes: 1,
    canRemoveBranding: false,
    canUseCustomDomains: false,
    atsOptimization: false,
    advancedAnalytics: false,
    bilingualSites: false,
    hasProDesignTools: false,
    hasProBlocks: false,
  },
  starter: {
    maxPortfolios: 3,
    maxResumes: 3,
    canRemoveBranding: true,
    canUseCustomDomains: false,
    atsOptimization: false,
    advancedAnalytics: false,
    bilingualSites: false,
    hasProDesignTools: false,
    hasProBlocks: false,
  },
  pro: {
    maxPortfolios: 10,
    maxResumes: 999,
    canRemoveBranding: true,
    canUseCustomDomains: true,
    atsOptimization: true,
    advancedAnalytics: true,
    bilingualSites: false,
    hasProDesignTools: true,
    hasProBlocks: true,
  },
  premium: {
    maxPortfolios: 999,
    maxResumes: 999,
    canRemoveBranding: true,
    canUseCustomDomains: true,
    atsOptimization: true,
    advancedAnalytics: true,
    bilingualSites: true,
    hasProDesignTools: true,
    hasProBlocks: true,
  },
};

type Entitlements = typeof ENTITLEMENTS.free;

interface DataContextType {
  user: User | null;
  featureFlags: FeatureFlags;
  projects: Project[];
  skills: Skill[];
  portfolios: Portfolio[];
  resumes: Resume[];
  templates: PortfolioTemplate[];
  promoCodes: PromoCode[];
  entitlements: Entitlements;
  getPortfolioById: (id: string) => Portfolio | undefined;
  updatePortfolio: (updatedPortfolio: Portfolio) => Promise<void>;
  createPortfolio: (newPortfolio: Omit<Portfolio, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => Promise<Portfolio>;
  deletePortfolio: (portfolioId: string) => Promise<void>;
  duplicatePortfolio: (portfolioId: string) => Promise<Portfolio | undefined>;
  createProject: (newProjectData: Omit<Project, 'id'>) => Project;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (projectId: string) => void;
  createSkill: (newSkillData: Omit<Skill, 'id'>) => Skill;
  updateUser: (updatedUser: User) => Promise<void>;
  getResumeById: (id: string) => Resume | undefined;
  updateResume: (updatedResume: Resume) => Promise<void>;
  createResume: (newResume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Resume>;
  deleteResume: (resumeId: string) => Promise<void>;
  getTemplateById: (id: string) => PortfolioTemplate | undefined;
  updateTemplate: (updatedTemplate: PortfolioTemplate) => void;
  createTemplate: (newTemplateData: Omit<PortfolioTemplate, 'id'>) => PortfolioTemplate;
  deleteTemplate: (templateId: string) => void;
  createPromoCode: (newPromoCodeData: Omit<PromoCode, 'id' | 'createdAt' | 'timesUsed'>) => PromoCode;
  deletePromoCode: (promoCodeId: string) => void;
  upgradeToStarter: () => void;
  upgradeToPro: () => void;
  upgradeToPremium: () => void;
  switchToFree: () => void;
  consumeAiFeature: (feature: AIFeature) => boolean;
  applyPromoCode: (code: string) => void;
  cancelSubscription: () => void;
  renewSubscription: () => void;
  makeOneTimePurchase: (purchaseId: 'proLifetime' | 'creditsTextTier1' | 'creditsImageTier1') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const createPortfolioSlug = (title: string) =>
  `${title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')}-${Math.random().toString(36).slice(2, 8)}`;

const applyServerFlags = (
  featureFlags: Record<string, boolean> | undefined,
): FeatureFlags => ({
  ...defaultFeatureFlags,
  aiEnabled: featureFlags?.ai_enabled ?? defaultFeatureFlags.aiEnabled,
  aiGuidedBuildEnabled: featureFlags?.ai_guided_build_enabled ?? defaultFeatureFlags.aiGuidedBuildEnabled,
  aiPortfolioReviewEnabled: featureFlags?.ai_portfolio_review_enabled ?? defaultFeatureFlags.aiPortfolioReviewEnabled,
  advancedAnalyticsEnabled: featureFlags?.advanced_analytics_enabled ?? defaultFeatureFlags.advancedAnalyticsEnabled,
  customDomainsEnabled: featureFlags?.custom_domains_enabled ?? defaultFeatureFlags.customDomainsEnabled,
  billingCheckoutEnabled: featureFlags?.billing_checkout_enabled ?? defaultFeatureFlags.billingCheckoutEnabled,
  leadCaptureEnabled: featureFlags?.lead_capture_enabled ?? defaultFeatureFlags.leadCaptureEnabled,
});

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(defaultFeatureFlags);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>(masterSkillsList);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [templates, setTemplates] = useState<PortfolioTemplate[]>(initialTemplates);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(mockPromoCodes);
  const seededSkillCatalog = useRef(false);

  const hydrateServerState = async () => {
    try {
      const session = await fetchSession();
      setFeatureFlags(applyServerFlags(session.feature_flags));

      if (!session.authenticated || !session.user) {
        setUser(null);
        setProjects([]);
        setSkills(masterSkillsList);
        setPortfolios([]);
        setResumes([]);
        return;
      }

      setUser(session.user);
      const serverProjects = session.catalog?.projects || [];
      const serverSkills = session.catalog?.skills?.length ? session.catalog.skills : masterSkillsList;
      setProjects(serverProjects);
      setSkills(serverSkills);

      const [serverPortfolios, serverResumes] = await Promise.all([listPortfolios(), listResumes()]);
      setPortfolios(serverPortfolios);
      setResumes(serverResumes);

      if (!session.catalog?.skills?.length && !seededSkillCatalog.current) {
        seededSkillCatalog.current = true;
        void updateProfileRecord({ skill_catalog: masterSkillsList }).catch((error) => {
          console.warn('Failed to seed the default skill catalog.', error);
        });
      }
    } catch (error) {
      console.warn('Backend hydration failed; leaving the app in signed-out mode.', error);
      setUser(null);
      setProjects([]);
      setPortfolios([]);
      setResumes([]);
    }
  };

  useEffect(() => {
    void hydrateServerState();

    const handleSessionChanged = () => {
      void hydrateServerState();
    };

    window.addEventListener(SESSION_EVENT, handleSessionChanged);
    return () => window.removeEventListener(SESSION_EVENT, handleSessionChanged);
  }, []);

  const entitlements = useMemo(() => {
    if (!user) return ENTITLEMENTS.free;
    return ENTITLEMENTS[user.subscription.tier] || ENTITLEMENTS.free;
  }, [user]);

  const persistCatalog = async (nextProjects: Project[], nextSkills: Skill[]) => {
    if (!user) return;
    try {
      const response = await updateProfileRecord({
        project_catalog: nextProjects,
        skill_catalog: nextSkills,
      });
      setUser(response.user);
      setProjects(response.catalog.projects);
      setSkills(response.catalog.skills.length ? response.catalog.skills : masterSkillsList);
      setFeatureFlags(applyServerFlags(response.feature_flags));
    } catch (error) {
      console.error('Failed to persist the user catalog.', error);
      toast.error('Could not sync your project catalog to the backend.');
    }
  };

  const getPortfolioById = (id: string) => portfolios.find((portfolio) => portfolio.id === id);

  const updatePortfolio = async (updatedPortfolio: Portfolio) => {
    const previousPortfolios = portfolios;
    setPortfolios((current) =>
      current.map((portfolio) =>
        portfolio.id === updatedPortfolio.id
          ? { ...updatedPortfolio, updatedAt: Date.now(), projectCatalog: projects, skillCatalog: skills }
          : portfolio,
      ),
    );

    try {
      const savedPortfolio = await updatePortfolioRecord(updatedPortfolio);
      setPortfolios((current) => current.map((portfolio) => (portfolio.id === savedPortfolio.id ? savedPortfolio : portfolio)));
    } catch (error) {
      console.error('Failed to update portfolio.', error);
      setPortfolios(previousPortfolios);
      toast.error('Could not save your portfolio to the backend.');
      throw error;
    }
  };

  const createPortfolio = async (
    newPortfolioData: Omit<Portfolio, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
  ): Promise<Portfolio> => {
    const now = Date.now();
    const draftPortfolio: Portfolio = {
      ...newPortfolioData,
      id: `pending-${now}`,
      slug: createPortfolioSlug(newPortfolioData.title),
      status: newPortfolioData.status || (newPortfolioData.isPublished ? 'published' : 'draft'),
      publishedAt: newPortfolioData.isPublished ? newPortfolioData.publishedAt || now : undefined,
      createdAt: now,
      updatedAt: now,
      userId: user?.id || newPortfolioData.userId,
      assets: newPortfolioData.assets || [],
      track: newPortfolioData.track || 'jobSeeker',
      seoTitle: newPortfolioData.seoTitle || newPortfolioData.title,
      seoDescription: newPortfolioData.seoDescription || `A portfolio for ${newPortfolioData.title}.`,
      projectCatalog: projects,
      skillCatalog: skills,
    };

    const savedPortfolio = await createPortfolioRecord(draftPortfolio);
    setPortfolios((current) => [...current, savedPortfolio]);
    return savedPortfolio;
  };

  const deletePortfolio = async (portfolioId: string) => {
    const previousPortfolios = portfolios;
    setPortfolios((current) => current.filter((portfolio) => portfolio.id !== portfolioId));
    try {
      await deletePortfolioRecord(portfolioId);
    } catch (error) {
      console.error('Failed to delete portfolio.', error);
      setPortfolios(previousPortfolios);
      toast.error('Could not delete the portfolio on the backend.');
      throw error;
    }
  };

  const duplicatePortfolio = async (portfolioId: string) => {
    const portfolioToDuplicate = portfolios.find((portfolio) => portfolio.id === portfolioId);
    if (!portfolioToDuplicate) return undefined;

    const duplicatedPortfolio = await createPortfolio({
      ...JSON.parse(JSON.stringify(portfolioToDuplicate)),
      title: `${portfolioToDuplicate.title} (Copy)`,
      isPublished: false,
      status: 'draft',
      publishedAt: undefined,
    });
    toast.success('Portfolio duplicated!');
    return duplicatedPortfolio;
  };

  const createProject = (newProjectData: Omit<Project, 'id'>) => {
    const newProject: Project = { ...newProjectData, id: `proj-${Date.now()}` };
    const nextProjects = [...projects, newProject];
    setProjects(nextProjects);
    void persistCatalog(nextProjects, skills);
    return newProject;
  };

  const updateProject = (updatedProject: Project) => {
    const nextProjects = projects.map((project) => (project.id === updatedProject.id ? updatedProject : project));
    setProjects(nextProjects);
    void persistCatalog(nextProjects, skills);
  };

  const deleteProject = (projectId: string) => {
    const nextProjects = projects.filter((project) => project.id !== projectId);
    setProjects(nextProjects);
    void persistCatalog(nextProjects, skills);
  };

  const createSkill = (newSkillData: Omit<Skill, 'id'>) => {
    const newSkill: Skill = { ...newSkillData, id: `skill-${Date.now()}` };
    const nextSkills = [...skills, newSkill];
    setSkills(nextSkills);
    void persistCatalog(projects, nextSkills);
    return newSkill;
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const response = await updateProfileRecord({
        name: updatedUser.name,
        email: updatedUser.email,
        title: updatedUser.title,
        bio: updatedUser.bio,
        avatar_url: updatedUser.avatarUrl,
      });
      setUser(response.user);
      setProjects(response.catalog.projects);
      setSkills(response.catalog.skills.length ? response.catalog.skills : masterSkillsList);
      toast.success('Profile updated.');
    } catch (error) {
      console.error('Failed to update user profile.', error);
      toast.error('Could not save your profile changes.');
      throw error;
    }
  };

  const getResumeById = (id: string) => resumes.find((resume) => resume.id === id);

  const updateResume = async (updatedResume: Resume) => {
    const previousResumes = resumes;
    setResumes((current) =>
      current.map((resume) => (resume.id === updatedResume.id ? { ...updatedResume, updatedAt: Date.now() } : resume)),
    );
    try {
      const savedResume = await updateResumeRecord(updatedResume);
      setResumes((current) => current.map((resume) => (resume.id === savedResume.id ? savedResume : resume)));
    } catch (error) {
      console.error('Failed to update resume.', error);
      setResumes(previousResumes);
      toast.error('Could not save your resume to the backend.');
      throw error;
    }
  };

  const createResume = async (
    newResumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Resume> => {
    const draftResume: Resume = {
      ...newResumeData,
      id: `pending-resume-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: user?.id || newResumeData.userId,
    };
    const savedResume = await createResumeRecord(draftResume);
    setResumes((current) => [...current, savedResume]);
    return savedResume;
  };

  const deleteResume = async (resumeId: string) => {
    const previousResumes = resumes;
    setResumes((current) => current.filter((resume) => resume.id !== resumeId));
    try {
      await deleteResumeRecord(resumeId);
    } catch (error) {
      console.error('Failed to delete resume.', error);
      setResumes(previousResumes);
      toast.error('Could not delete the resume on the backend.');
      throw error;
    }
  };

  const getTemplateById = (id: string) => templates.find((template) => template.id === id);
  const updateTemplate = (updatedTemplate: PortfolioTemplate) =>
    setTemplates((current) => current.map((template) => (template.id === updatedTemplate.id ? updatedTemplate : template)));
  const createTemplate = (newTemplateData: Omit<PortfolioTemplate, 'id'>) => {
    const newTemplate: PortfolioTemplate = { ...newTemplateData, id: `template-${Date.now()}` };
    setTemplates((current) => [...current, newTemplate]);
    return newTemplate;
  };
  const deleteTemplate = (templateId: string) =>
    setTemplates((current) => current.filter((template) => template.id !== templateId));

  const createPromoCode = (newPromoCodeData: Omit<PromoCode, 'id' | 'createdAt' | 'timesUsed'>) => {
    const newCode: PromoCode = {
      ...newPromoCodeData,
      id: `promo-${Date.now()}`,
      createdAt: Date.now(),
      timesUsed: 0,
    };
    setPromoCodes((current) => [...current, newCode]);
    return newCode;
  };

  const deletePromoCode = (promoCodeId: string) =>
    setPromoCodes((current) => current.filter((promoCode) => promoCode.id !== promoCodeId));

  const upgradeMessage = 'Checkout is now backend-owned and will be enabled once Stripe is connected.';
  const upgradeToStarter = () => toast(upgradeMessage);
  const upgradeToPro = () => toast(upgradeMessage);
  const upgradeToPremium = () => toast(upgradeMessage);
  const switchToFree = () => toast('Plan changes are managed through the upcoming billing portal.');
  const applyPromoCode = (_code: string) =>
    toast('Promo codes will be redeemed through backend billing when Stripe is connected.');
  const cancelSubscription = () => toast('Subscription cancellation will be handled by the backend billing portal.');
  const renewSubscription = () => toast('Renewal will be handled through backend billing once enabled.');
  const makeOneTimePurchase = (_purchaseId: 'proLifetime' | 'creditsTextTier1' | 'creditsImageTier1') =>
    toast('One-time AI purchases were removed from the production pricing model.');

  const consumeAiFeature = (feature: AIFeature) => {
    if (!user) return false;
    if (!featureFlags.aiEnabled) {
      toast.error('AI is currently disabled for this environment.');
      return false;
    }

    if (feature === 'imageGeneration') {
      toast.error('AI image generation is not included in this release.');
      return false;
    }

    const allowance = user.subscription.ai?.allowanceByFeature?.[feature];
    if (allowance && (!allowance.enabled || allowance.remaining <= 0)) {
      toast.error('You have reached the limit for this AI action on your current plan.');
      return false;
    }

    return true;
  };

  return (
    <DataContext.Provider
      value={{
        user,
        featureFlags,
        projects,
        skills,
        portfolios,
        resumes,
        templates,
        promoCodes,
        entitlements,
        getPortfolioById,
        updatePortfolio,
        createPortfolio,
        deletePortfolio,
        duplicatePortfolio,
        createProject,
        updateProject,
        deleteProject,
        createSkill,
        updateUser,
        getResumeById,
        updateResume,
        createResume,
        deleteResume,
        getTemplateById,
        updateTemplate,
        createTemplate,
        deleteTemplate,
        createPromoCode,
        deletePromoCode,
        upgradeToStarter,
        upgradeToPro,
        upgradeToPremium,
        switchToFree,
        consumeAiFeature,
        applyPromoCode,
        cancelSubscription,
        renewSubscription,
        makeOneTimePurchase,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
