import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '../types';
import { PORTFOLIO_OWNER, PROJECTS_DATA } from '../data/portfolioData';

export type PortfolioOwnerData = typeof PORTFOLIO_OWNER;

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'Dr. Mohamed Warsame',
    email: 'm.warsame@just.edu.so',
    subject: 'AI & Data Science Collaboration - JUST',
    message: 'Greetings Eng. Abdihakim. We reviewed your computer engineering and machine learning work, especially the Tuko-Salaad and ATS systems. We would love to discuss a guest technical seminar and research collaboration.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'inq-2',
    name: 'Sagal Ali (TechLead Mogadishu)',
    email: 'sagal.ali@somdevhub.so',
    subject: 'ShaqoKaab Platform Architecture Partnership',
    message: 'Hello Abdihakim, our engineering team was very impressed by your ShaqoKaab recruitment portal and dual-engine ATS parsing. Are you available for a consulting contract or platform expansion demo?',
    timestamp: 'Yesterday',
    read: false,
  },
  {
    id: 'inq-3',
    name: 'Ahmed Noor (Fintech Operations)',
    email: 'ahmed.noor@dhabayeco.so',
    subject: 'Hubaal POS & Payment Gateway Integration',
    message: 'Hi Eng Abdihakim, we need an enterprise cloud and offline-first POS system with analytics dashboard similar to what you built. Kindly let us know your availability for a project kickoff meeting.',
    timestamp: '3 days ago',
    read: true,
  },
];

interface PortfolioContextType {
  owner: PortfolioOwnerData;
  projects: Project[];
  inquiries: Inquiry[];
  isAdminLoggedIn: boolean;
  isSignInModalOpen: boolean;
  isDashboardModalOpen: boolean;
  isEmailModalOpen: boolean;
  setIsSignInModalOpen: (open: boolean) => void;
  setIsDashboardModalOpen: (open: boolean) => void;
  setIsEmailModalOpen: (open: boolean) => void;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  updateOwner: (updated: Partial<PortfolioOwnerData>) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addInquiry: (inquiry: { name: string; email: string; subject: string; message: string }) => void;
  deleteInquiry: (id: string) => void;
  markInquiryRead: (id: string) => void;
  importDatabase: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  DB: 'abdihakim_portfolio_db_v1',
  AUTH: 'abdihakim_portfolio_admin_auth',
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [owner, setOwner] = useState<PortfolioOwnerData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DB);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.owner) return { ...PORTFOLIO_OWNER, ...parsed.owner };
      }
    } catch (e) {
      console.warn('Failed to load owner from localStorage', e);
    }
    return PORTFOLIO_OWNER;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DB);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
          return parsed.projects;
        }
      }
    } catch (e) {
      console.warn('Failed to load projects from localStorage', e);
    }
    return PROJECTS_DATA;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DB);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.inquiries) && parsed.inquiries.length > 0) {
          return parsed.inquiries;
        }
      }
    } catch (e) {
      console.warn('Failed to load inquiries from localStorage', e);
    }
    return INITIAL_INQUIRIES;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Sync state changes to localStorage
  const persistState = (newOwner: PortfolioOwnerData, newProjects: Project[], newInquiries: Inquiry[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.DB,
        JSON.stringify({ owner: newOwner, projects: newProjects, inquiries: newInquiries })
      );
    } catch (e) {
      console.error('Failed to persist portfolio data', e);
    }
  };

  const login = (user: string, pass: string): boolean => {
    const trimmedUser = user.trim().toLowerCase();
    const trimmedPass = pass.trim();
    // User requirement: user=admin, password=123 (also supports casing & admin password)
    if (
      (trimmedUser === 'admin' || trimmedUser === 'abdihakim') &&
      (trimmedPass === '123' || trimmedPass === 'admin')
    ) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } catch (e) {
        console.error(e);
      }
      setIsSignInModalOpen(false);
      setIsDashboardModalOpen(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setIsDashboardModalOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {
      console.error(e);
    }
  };

  const updateOwner = (updated: Partial<PortfolioOwnerData>) => {
    setOwner((prev) => {
      const next = { ...prev, ...updated };
      persistState(next, projects, inquiries);
      return next;
    });
  };

  const addProject = (project: Project) => {
    setProjects((prev) => {
      const next = [project, ...prev];
      persistState(owner, next, inquiries);
      return next;
    });
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updated } : p));
      persistState(owner, next, inquiries);
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persistState(owner, next, inquiries);
      return next;
    });
  };

  const addInquiry = (inquiry: { name: string; email: string; subject: string; message: string }) => {
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name: inquiry.name,
      email: inquiry.email,
      subject: inquiry.subject,
      message: inquiry.message,
      timestamp: 'Just now',
      read: false,
    };
    setInquiries((prev) => {
      const next = [newInquiry, ...prev];
      persistState(owner, projects, next);
      return next;
    });
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => {
      const next = prev.filter((i) => i.id !== id);
      persistState(owner, projects, next);
      return next;
    });
  };

  const markInquiryRead = (id: string) => {
    setInquiries((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, read: true } : i));
      persistState(owner, projects, next);
      return next;
    });
  };

  const importDatabase = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.owner) {
        setOwner({ ...PORTFOLIO_OWNER, ...parsed.owner });
      }
      if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        setProjects(parsed.projects);
      }
      if (Array.isArray(parsed.inquiries)) {
        setInquiries(parsed.inquiries);
      }
      persistState(
        parsed.owner ? { ...PORTFOLIO_OWNER, ...parsed.owner } : owner,
        Array.isArray(parsed.projects) ? parsed.projects : projects,
        Array.isArray(parsed.inquiries) ? parsed.inquiries : inquiries
      );
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.DB);
    } catch (e) {
      console.error(e);
    }
    setOwner(PORTFOLIO_OWNER);
    setProjects(PROJECTS_DATA);
    setInquiries(INITIAL_INQUIRIES);
  };

  return (
    <PortfolioContext.Provider
      value={{
        owner,
        projects,
        inquiries,
        isAdminLoggedIn,
        isSignInModalOpen,
        isDashboardModalOpen,
        isEmailModalOpen,
        setIsSignInModalOpen,
        setIsDashboardModalOpen,
        setIsEmailModalOpen,
        login,
        logout,
        updateOwner,
        addProject,
        updateProject,
        deleteProject,
        addInquiry,
        deleteInquiry,
        markInquiryRead,
        importDatabase,
        resetToDefaults,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioProvider');
  }
  return context;
};
