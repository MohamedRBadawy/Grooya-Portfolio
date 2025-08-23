
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import type { User, Project, Skill, Portfolio, PortfolioBlock, Resume, Page } from '../types';
import { mockUser, initialProjects, masterSkillsList, initialPortfolios, initialResumes } from '../services/mockData';

// Define the shape of the data context
interface DataContextType {
  user: User | null;
  projects: Project[];
  skills: Skill[];
  portfolios: Portfolio[];
  resumes: Resume[];
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
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Define keys for local storage to persist data across sessions
const USER_STORAGE_KEY = 'grooya_user';
const PORTFOLIOS_STORAGE_KEY = 'grooya_portfolios';
const PROJECTS_STORAGE_KEY = 'grooya_projects';
const SKILLS_STORAGE_KEY = 'grooya_skills';
const RESUMES_STORAGE_KEY = 'grooya_resumes';

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
      return stored ? JSON.parse(stored) : mockUser;
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

  // useEffect hooks to persist state changes to local storage
  useEffect(() => {
    if (user) {
        try {
            window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } catch (error) {
            console.error("Error writing user to local storage", error);
        }
    }
  }, [user]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PORTFOLIOS_STORAGE_KEY, JSON.stringify(portfolios));
    } catch (error) {
      console.error("Error writing portfolios to local storage", error);
    }
  }, [portfolios]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error("Error writing projects to local storage", error);
    }
  }, [projects]);
  
  useEffect(() => {
    try {
      window.localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(skills));
    } catch (error) {
      console.error("Error writing skills to local storage", error);
    }
  }, [skills]);
  
  useEffect(() => {
    try {
      window.localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(resumes));
    } catch (error) {
      console.error("Error writing resumes to local storage", error);
    }
  }, [resumes]);

  // --- Data Manipulation Methods ---

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const getPortfolioById = (id: string) => portfolios.find(p => p.id === id);

  const updatePortfolio = (updatedPortfolio: Portfolio) => {
    const portfolioWithTimestamp = { ...updatedPortfolio, updatedAt: Date.now() };
    setPortfolios(prev => 
      prev.map(p => p.id === portfolioWithTimestamp.id ? portfolioWithTimestamp : p)
    );
  };

  const createPortfolio = (newPortfolioData: Omit<Portfolio, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Portfolio => {
      const now = Date.now();
      const newId = `port-${now}`;
      const newSlug = `${newPortfolioData.title.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Ensure pages and blocks have unique IDs when created from a template
      const newPages = newPortfolioData.pages.map(page => ({
        ...JSON.parse(JSON.stringify(page)), // Deep copy for safety
        id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        blocks: page.blocks.map(block => ({
            ...JSON.parse(JSON.stringify(block)),
            id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        }))
      }));

      const newPortfolio: Portfolio = {
          ...newPortfolioData,
          id: newId,
          slug: newSlug,
          pages: newPages,
          createdAt: now,
          updatedAt: now,
      };
      setPortfolios(prev => [...prev, newPortfolio]);
      return newPortfolio;
  }

  const deletePortfolio = (portfolioId: string) => {
      setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
  }
  
  const duplicatePortfolio = (portfolioId: string) => {
    const portfolioToDuplicate = portfolios.find(p => p.id === portfolioId);
    if (!portfolioToDuplicate) return;

    const now = Date.now();
    const newTitle = `${portfolioToDuplicate.title} (Copy)`;
    
    // Deep copy to avoid reference issues
    const duplicatedPortfolioData = JSON.parse(JSON.stringify(portfolioToDuplicate));

    // Generate new unique IDs for pages and blocks
    const newPages: Page[] = duplicatedPortfolioData.pages.map((page: Page) => ({
        ...page,
        id: `page-${now}-${Math.random().toString(36).substring(2, 9)}`,
        blocks: page.blocks.map((block: PortfolioBlock) => ({
            ...block,
            id: `block-${now}-${Math.random().toString(36).substring(2, 9)}`
        }))
    }));

    const newPortfolio: Portfolio = {
        ...duplicatedPortfolioData,
        id: `port-${now}`,
        title: newTitle,
        slug: `${newTitle.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`,
        pages: newPages,
        createdAt: now,
        updatedAt: now,
        isPublished: false, // Duplicates are drafts by default
    };

    setPortfolios(prev => [...prev, newPortfolio]);
  }

  const createProject = (projectData: Omit<Project, 'id'>): Project => {
      const newProject: Project = {
          ...projectData,
          id: `proj-${Date.now()}`
      };
      setProjects(prev => [...prev, newProject]);
      return newProject;
  };

  const updateProject = (updatedProject: Project) => {
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };
  
  const deleteProject = (projectId: string) => {
      setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const createSkill = (skillData: Omit<Skill, 'id'>): Skill => {
    const newSkill: Skill = {
        ...skillData,
        id: `skill-${Date.now()}`
    };
    setSkills(prev => [...prev, newSkill]);
    return newSkill;
  };
  
  const getResumeById = (id: string) => resumes.find(r => r.id === id);

  const updateResume = (updatedResume: Resume) => {
      const resumeWithTimestamp = { ...updatedResume, updatedAt: Date.now() };
      setResumes(prev => prev.map(r => r.id === resumeWithTimestamp.id ? resumeWithTimestamp : r));
  };

  const createResume = (newResumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>): Resume => {
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


  // Expose state and methods to children components
  const value = {
    user,
    projects,
    skills,
    portfolios,
    resumes,
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
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/**
 * Custom hook to easily access the data context.
 * Throws an error if used outside of a DataProvider.
 */
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
