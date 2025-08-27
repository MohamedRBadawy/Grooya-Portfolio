

import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import type { User, Project, Skill, Portfolio, PortfolioBlock, Resume, Page, AIFeature, PortfolioTemplate } from '../types';
import { mockUser, initialProjects, masterSkillsList, initialPortfolios, initialResumes } from '../services/mockData';
import { portfolioTemplates as initialTemplates } from '../services/templates';
import toast from 'react-hot-toast';

const STARTER_PLAN_CREDITS = { text: 50, image: 10 };
const PRO_PLAN_CREDITS = { text: 150, image: 30 };
const PREMIUM_PLAN_CREDITS = { text: 500, image: 100 };

const FREE_PLAN = { 
    tier: 'free' as const, 
    status: 'active' as const,
    freeFeaturesUsed: {},
    credits: { text: 0, image: 0 }
};
const STARTER_PLAN = { 
    tier: 'starter' as const, 
    status: 'active' as const,
    renewsAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    freeFeaturesUsed: {},
    credits: STARTER_PLAN_CREDITS
};
const PRO_PLAN = { 
    tier: 'pro' as const, 
    status: 'active' as const,
    renewsAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    freeFeaturesUsed: {},
    credits: PRO_PLAN_CREDITS
};
const PREMIUM_PLAN = { 
    tier: 'premium' as const, 
    status: 'active' as const,
    renewsAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    freeFeaturesUsed: {},
    credits: PREMIUM_PLAN_CREDITS
};


const ENTITLEMENTS = {
    free: {
        maxPortfolios: 1,
        maxResumes: 1,
        canRemoveBranding: false,
        canUseCustomDomains: false,
        atsOptimization: false,
        advancedAnalytics: false,
        bilingualSites: false,
    },
    starter: {
        maxPortfolios: 3,
        maxResumes: 3,
        canRemoveBranding: true,
        canUseCustomDomains: false,
        atsOptimization: false,
        advancedAnalytics: false,
        bilingualSites: false,
    },
    pro: {
        maxPortfolios: 10,
        maxResumes: 999, // Unlimited
        canRemoveBranding: true,
        canUseCustomDomains: true,
        atsOptimization: true,
        advancedAnalytics: true,
        bilingualSites: false,
    },
    premium: {
        maxPortfolios: 999, // Unlimited
        maxResumes: 999, // Unlimited
        canRemoveBranding: true,
        canUseCustomDomains: true,
        atsOptimization: true,
        advancedAnalytics: true,
        bilingualSites: true,
    }
};

type Entitlements = typeof ENTITLEMENTS.free;

// Define the shape of the data context
interface DataContextType {
  user: User | null;
  projects: Project[];
  skills: Skill[];
  portfolios: Portfolio[];
  resumes: Resume[];
  templates: PortfolioTemplate[];
  entitlements: Entitlements;
  getPortfolioById: (id: string) => Portfolio | undefined;
  updatePortfolio: (updatedPortfolio: Portfolio) => void;
  createPortfolio: (newPortfolio: Omit<Portfolio, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => Portfolio;
  deletePortfolio: (portfolioId: string) => void;
  duplicatePortfolio: (portfolioId: string) => void;
  createProject: (newProjectData: Omit<Project, 'id'>) => Project;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (projectId: string) => void;
  createSkill: (newSkillData: Omit<Skill, 'id'>) => Skill;
  updateUser: (updatedUser: User) => void;
  getResumeById: (id: string) => Resume | undefined;
  updateResume: (updatedResume: Resume) => void;
  createResume: (newResumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>) => Resume;
  deleteResume: (resumeId: string) => void;
  getTemplateById: (id: string) => PortfolioTemplate | undefined;
  updateTemplate: (updatedTemplate: PortfolioTemplate) => void;
  createTemplate: (newTemplateData: Omit<PortfolioTemplate, 'id'>) => PortfolioTemplate;
  deleteTemplate: (templateId: string) => void;
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

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Define keys for local storage to persist data across sessions
const USER_STORAGE_KEY = 'grooya_user';
const PORTFOLIOS_STORAGE_KEY = 'grooya_portfolios';
const PROJECTS_STORAGE_KEY = 'grooya_projects';
const SKILLS_STORAGE_KEY = 'grooya_skills';
const RESUMES_STORAGE_KEY = 'grooya_resumes';
const TEMPLATES_STORAGE_KEY = 'grooya_templates';

/**
 * The DataProvider component is a central place to manage all application data.
 * It initializes state from localStorage (or mock data if not available),
 * and provides functions to manipulate this data.
 */
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize user state from local storage or mock data
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = window.localStorage.getItem(USER_STORAGE_KEY);
      const parsedUser = stored ? JSON.parse(stored) : mockUser;
      // Ensure existing users have subscription data
      if (!parsedUser.subscription) {
        parsedUser.subscription = FREE_PLAN;
      }
      return parsedUser;
    } catch (error) {
      console.error("Error reading user from local storage", error);
      return mockUser;
    }
  });
  
  // Initialize portfolios state
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    try {
      const stored = window.localStorage.getItem(PORTFOLIOS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialPortfolios;
    } catch (error) {
      console.error("Error reading portfolios from local storage", error);
      return initialPortfolios;
    }
  });

  // Initialize projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialProjects;
    } catch (error) {
      console.error("Error reading projects from local storage", error);
      return initialProjects;
    }
  });
  
  // Initialize skills state
  const [skills, setSkills] = useState<Skill[]>(() => {
    try {
      const stored = window.localStorage.getItem(SKILLS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : masterSkillsList;
    } catch (error) {
      console.error("Error reading skills from local storage", error);
      return masterSkillsList;
    }
  });

  // Initialize resumes state
  const [resumes, setResumes] = useState<Resume[]>(() => {
    try {
      const stored = window.localStorage.getItem(RESUMES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialResumes;
    } catch (error) {
      console.error("Error reading resumes from local storage", error);
      return initialResumes;
    }
  });

  // Initialize templates state
  const [templates, setTemplates] = useState<PortfolioTemplate[]>(() => {
    try {
        const stored = window.localStorage.getItem(TEMPLATES_STORAGE_KEY);
        return stored ? JSON.parse(stored) : initialTemplates;
    } catch (error) {
        console.error("Error reading templates from local storage", error);
        return initialTemplates;
    }
  });

  // --- Effects to persist data to local storage ---
  useEffect(() => { window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)); }, [user]);
  useEffect(() => { window.localStorage.setItem(PORTFOLIOS_STORAGE_KEY, JSON.stringify(portfolios)); }, [portfolios]);
  useEffect(() => { window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects)); }, [projects]);
  useEffect(() => { window.localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(skills)); }, [skills]);
  useEffect(() => { window.localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(resumes)); }, [resumes]);
  useEffect(() => { window.localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates)); }, [templates]);
  
  // --- Entitlements Calculation ---
  const entitlements = useMemo(() => {
    if (!user) return ENTITLEMENTS.free;

    const hasProLifetime = user.oneTimePurchases?.includes('proLifetime');
    const tier = user.subscription?.tier || 'free';
    
    // User gets Pro entitlements if they have a Pro subscription OR a lifetime license.
    if (hasProLifetime) return ENTITLEMENTS.pro;
    
    return ENTITLEMENTS[tier];
  }, [user]);

  // --- Portfolio CRUD ---
  const getPortfolioById = (id: string) => portfolios.find(p => p.id === id);
  const updatePortfolio = (updatedPortfolio: Portfolio) => {
    const portfolioWithTimestamp = { ...updatedPortfolio, updatedAt: Date.now() };
    setPortfolios(prev => prev.map(p => p.id === portfolioWithTimestamp.id ? portfolioWithTimestamp : p));
  };
   const createPortfolio = (newPortfolioData: Omit<Portfolio, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    const slug = newPortfolioData.title.toLowerCase().replace(/\s+/g, '-') + `-${Math.random().toString(36).substring(2, 8)}`;
    const now = Date.now();
    const newPortfolio: Portfolio = {
        ...newPortfolioData,
        id: `port-${now}`,
        slug,
        createdAt: now,
        updatedAt: now,
    };
    setPortfolios(prev => [...prev, newPortfolio]);
    return newPortfolio;
  };
  const deletePortfolio = (portfolioId: string) => {
    setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
  };
  const duplicatePortfolio = (portfolioId: string) => {
      const portfolioToDuplicate = portfolios.find(p => p.id === portfolioId);
      if (portfolioToDuplicate) {
          const now = Date.now();
          const newPortfolio = {
              ...JSON.parse(JSON.stringify(portfolioToDuplicate)), // Deep copy
              id: `port-${now}`,
              title: `${portfolioToDuplicate.title} (Copy)`,
              slug: `${portfolioToDuplicate.slug}-copy`,
              createdAt: now,
              updatedAt: now,
              isPublished: false,
          };
          setPortfolios(prev => [...prev, newPortfolio]);
          toast.success('Portfolio duplicated!');
      }
  };


  // --- Project CRUD ---
  const createProject = (newProjectData: Omit<Project, 'id'>) => {
    const newProject: Project = { ...newProjectData, id: `proj-${Date.now()}` };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };
  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };
  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  // --- Skill CRUD ---
  const createSkill = (newSkillData: Omit<Skill, 'id'>) => {
    const newSkill: Skill = { ...newSkillData, id: `skill-${Date.now()}` };
    setSkills(prev => [...prev, newSkill]);
    return newSkill;
  };
  
  // --- Resume CRUD ---
  const getResumeById = (id: string) => resumes.find(r => r.id === id);
  const updateResume = (updatedResume: Resume) => {
    const resumeWithTimestamp = { ...updatedResume, updatedAt: Date.now() };
    setResumes(prev => prev.map(r => r.id === resumeWithTimestamp.id ? resumeWithTimestamp : r));
  };
  const createResume = (newResumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = Date.now();
      const newResume: Resume = {
          ...newResumeData,
          id: `resume-${now}`,
          createdAt: now,
          updatedAt: now,
      };
      setResumes(prev => [...prev, newResume]);
      return newResume;
  };
  const deleteResume = (resumeId: string) => {
      setResumes(prev => prev.filter(r => r.id !== resumeId));
  };
  
  // --- Template CRUD (Admin) ---
  const getTemplateById = (id: string) => templates.find(t => t.id === id);
  const updateTemplate = (updatedTemplate: PortfolioTemplate) => {
      setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };
  const createTemplate = (newTemplateData: Omit<PortfolioTemplate, 'id'>) => {
      const newTemplate: PortfolioTemplate = { ...newTemplateData, id: `template-${Date.now()}` };
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
  };
  const deleteTemplate = (templateId: string) => {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  // --- User Profile ---
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };
  
  // --- Subscription Management ---
  const upgradeToStarter = () => setUser(prev => prev ? { ...prev, subscription: STARTER_PLAN } : null);
  const upgradeToPro = () => setUser(prev => prev ? { ...prev, subscription: PRO_PLAN } : null);
  const upgradeToPremium = () => setUser(prev => prev ? { ...prev, subscription: PREMIUM_PLAN } : null);
  const switchToFree = () => setUser(prev => prev ? { ...prev, subscription: FREE_PLAN } : null);
  
  const cancelSubscription = () => {
    setUser(prev => {
        if (!prev || prev.subscription.tier === 'free') return prev;
        return {
            ...prev,
            subscription: {
                ...prev.subscription,
                status: 'canceled'
            }
        };
    });
    toast.success('Your subscription has been canceled and will expire at the end of the current period.');
  };

  const renewSubscription = () => {
        setUser(prev => {
        if (!prev || prev.subscription.tier === 'free') return prev;
        return {
            ...prev,
            subscription: {
                ...prev.subscription,
                status: 'active'
            }
        };
    });
    toast.success('Your subscription has been renewed!');
  };

  const applyPromoCode = (code: string) => {
      if (code.toUpperCase() === 'GROOYA-ALPHA') {
           setUser(prev => prev ? { ...prev, subscription: PREMIUM_PLAN, isEarlyAdopter: true } : null);
           toast.success('Promo code applied! Welcome, Early Adopter! You now have the Premium plan.');
      } else {
          toast.error('Invalid promo code.');
      }
  };

    const makeOneTimePurchase = (purchaseId: 'proLifetime' | 'creditsTextTier1' | 'creditsImageTier1') => {
        setUser(prev => {
            if (!prev) return null;
            let updatedUser = { ...prev };
            
            if (purchaseId === 'proLifetime') {
                updatedUser.oneTimePurchases = [...(updatedUser.oneTimePurchases || []), 'proLifetime'];
                toast.success('Pro Lifetime Access Unlocked!');
            }
            if (purchaseId === 'creditsTextTier1') {
                updatedUser.subscription.credits.text += 50;
                toast.success('50 AI Text Credits added!');
            }
             if (purchaseId === 'creditsImageTier1') {
                updatedUser.subscription.credits.image += 10;
                toast.success('10 AI Image Credits added!');
            }
            return updatedUser;
        });
    };

  // --- AI Credit Consumption ---
  const consumeAiFeature = (feature: AIFeature) => {
      if (!user) return false;
      const { tier, credits, freeFeaturesUsed } = user.subscription;

      const isTextFeature = feature !== 'imageGeneration';

      if (tier === 'free') {
          if (freeFeaturesUsed[feature]) {
              return false; // Free feature already used
          }
          setUser(prev => prev ? { ...prev, subscription: { ...prev.subscription, freeFeaturesUsed: { ...prev.subscription.freeFeaturesUsed, [feature]: true }}} : null);
          return true;
      }
      
      // Paid Tiers
      if (isTextFeature) {
          if (credits.text > 0) {
              setUser(prev => prev ? { ...prev, subscription: { ...prev.subscription, credits: { ...prev.subscription.credits, text: prev.subscription.credits.text - 1 }}} : null);
              return true;
          }
      } else {
          if (credits.image > 0) {
              setUser(prev => prev ? { ...prev, subscription: { ...prev.subscription, credits: { ...prev.subscription.credits, image: prev.subscription.credits.image - 1 }}} : null);
              return true;
          }
      }
      return false; // No credits left
  };


  return (
    <DataContext.Provider value={{
      user, projects, skills, portfolios, resumes, templates,
      entitlements,
      getPortfolioById, updatePortfolio, createPortfolio, deletePortfolio, duplicatePortfolio,
      createProject, updateProject, deleteProject,
      createSkill,
      getResumeById, updateResume, createResume, deleteResume,
      getTemplateById, updateTemplate, createTemplate, deleteTemplate,
      updateUser,
      upgradeToStarter, upgradeToPro, upgradeToPremium, switchToFree,
      consumeAiFeature,
      applyPromoCode,
      cancelSubscription,
      renewSubscription,
      makeOneTimePurchase,
    }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};