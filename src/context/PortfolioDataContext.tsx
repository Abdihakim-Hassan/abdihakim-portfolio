import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  IdTokenResult,
} from 'firebase/auth';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
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

interface LoginResult {
  success: boolean;
  error?: string;
}

interface PortfolioContextType {
  owner: PortfolioOwnerData;
  projects: Project[];
  inquiries: Inquiry[];
  currentUser: User | null;
  isAdminLoggedIn: boolean;
  isAuthChecking: boolean;
  isSignInModalOpen: boolean;
  isDashboardModalOpen: boolean;
  isEmailModalOpen: boolean;
  setIsSignInModalOpen: (open: boolean) => void;
  setIsDashboardModalOpen: (open: boolean) => void;
  setIsEmailModalOpen: (open: boolean) => void;
  login: (email: string, pass: string) => Promise<LoginResult>;
  loginWithGoogle: () => Promise<LoginResult>;
  logout: () => Promise<void>;
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
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

/**
 * Checks whether an authenticated Firebase User has administrator authorization.
 * Strictly uses server-minted Firebase Custom Claims (`token.admin === true`) as the single
 * authoritative source of truth. Does not accept client-side emails or unverified records.
 */
async function verifyAdminAuthorization(user: User): Promise<boolean> {
  try {
    // Force refresh the token to obtain latest server-minted claims
    const idTokenResult: IdTokenResult = await user.getIdTokenResult(true);
    return Boolean(idTokenResult.claims && idTokenResult.claims.admin === true);
  } catch (err) {
    console.error('Security verification check failed:', err);
    return false;
  }
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [owner, setOwner] = useState<PortfolioOwnerData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DB);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.owner) return { ...PORTFOLIO_OWNER, ...parsed.owner };
      }
    } catch (e) {
      console.warn('Failed to load owner data from cache', e);
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
      console.warn('Failed to load projects from cache', e);
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
      console.warn('Failed to load inquiries from cache', e);
    }
    return INITIAL_INQUIRIES;
  });

  // Authoritative Firebase Authentication & Authorization State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpenState] = useState<boolean>(() => {
    try {
      return (
        sessionStorage.getItem('portfolio_dashboard_open') === 'true' ||
        window.location.hash === '#dashboard'
      );
    } catch {
      return false;
    }
  });
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Synchronized dashboard modal state that survives page refresh
  const setIsDashboardModalOpen = useCallback((open: boolean) => {
    setIsDashboardModalOpenState(open);
    try {
      if (open) {
        sessionStorage.setItem('portfolio_dashboard_open', 'true');
        if (window.location.hash !== '#dashboard') {
          window.location.hash = 'dashboard';
        }
      } else {
        sessionStorage.removeItem('portfolio_dashboard_open');
        if (window.location.hash === '#dashboard') {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Authoritative Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthChecking(true);
      if (user) {
        setCurrentUser(user);
        const authorized = await verifyAdminAuthorization(user);
        if (authorized) {
          setIsAdminLoggedIn(true);
          // Restore open dashboard state on page refresh if previously open
          try {
            const wasOpen =
              sessionStorage.getItem('portfolio_dashboard_open') === 'true' ||
              window.location.hash === '#dashboard';
            if (wasOpen) {
              setIsDashboardModalOpenState(true);
            }
          } catch {
            // ignore
          }
        } else {
          // User is authenticated but NOT authorized as an admin
          setIsAdminLoggedIn(false);
          setIsDashboardModalOpenState(false);
          try {
            sessionStorage.removeItem('portfolio_dashboard_open');
          } catch {
            // ignore
          }
        }
      } else {
        setCurrentUser(null);
        setIsAdminLoggedIn(false);
        setIsDashboardModalOpenState(false);
        try {
          sessionStorage.removeItem('portfolio_dashboard_open');
        } catch {
          // ignore
        }
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for genuine contact submissions when admin is authenticated
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    try {
      const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const liveInquiries: Inquiry[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let timeStr = 'Just now';
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
              const d = data.createdAt.toDate();
              timeStr = d.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
            }
            return {
              id: docSnap.id,
              name: data.name || 'Anonymous',
              email: data.email || '',
              subject: data.subject || 'Portfolio Inquiry',
              message: data.message || '',
              timestamp: timeStr,
              read: Boolean(data.read),
            };
          });
          setInquiries(liveInquiries);
        },
        (err) => {
          console.warn('Real-time inquiries sync warning:', err);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Failed to attach real-time inquiries listener:', err);
    }
  }, [isAdminLoggedIn]);

  // Save cached content for offline resilience
  const persistState = (newOwner: PortfolioOwnerData, newProjects: Project[], newInquiries: Inquiry[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.DB,
        JSON.stringify({ owner: newOwner, projects: newProjects, inquiries: newInquiries })
      );
    } catch (e) {
      console.error('Failed to persist portfolio data cache', e);
    }
  };

  /**
   * Secure Firebase Authentication login.
   * Authenticates user via Firebase and validates admin authorization.
   */
  const login = async (email: string, pass: string): Promise<LoginResult> => {
    const cleanEmail = email.trim();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    try {
      // 1. Authenticate with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const user = userCredential.user;

      // 2. Authoritative Admin Authorization Check
      const isAuthorizedAdmin = await verifyAdminAuthorization(user);

      if (!isAuthorizedAdmin) {
        // Sign out unauthorized user immediately
        await signOut(auth);
        setCurrentUser(null);
        setIsAdminLoggedIn(false);
        return {
          success: false,
          error: 'Access Denied: This account is authenticated but does not have administrator privileges.',
        };
      }

      // 3. Authorized Admin Access Granted
      setCurrentUser(user);
      setIsAdminLoggedIn(true);
      setIsSignInModalOpen(false);
      setIsDashboardModalOpen(true);
      return { success: true };
    } catch (err: any) {
      console.error('Firebase authentication error:', err);
      let errorMessage = 'Authentication failed. Please verify your email and password.';

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  /**
   * Google Sign-In via Firebase Authentication.
   * Identity comes from Google; administrator privileges come ONLY from the
   * server-assigned Custom Claim (`admin === true`). No email comparison is done here.
   */
  const loginWithGoogle = async (): Promise<LoginResult> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const isAuthorizedAdmin = await verifyAdminAuthorization(user);
      if (!isAuthorizedAdmin) {
        await signOut(auth);
        setCurrentUser(null);
        setIsAdminLoggedIn(false);
        return {
          success: false,
          error: 'Access Denied: This account is authenticated but does not have administrator privileges.',
        };
      }

      setCurrentUser(user);
      setIsAdminLoggedIn(true);
      setIsSignInModalOpen(false);
      setIsDashboardModalOpen(true);
      return { success: true };
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      let errorMessage = 'Google sign-in failed. Please try again.';
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by the browser. Please allow popups for this site.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google sign-in in Firebase Authentication settings.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Secure Logout - Tears down Firebase authentication session
   */
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setCurrentUser(null);
      setIsAdminLoggedIn(false);
      setIsDashboardModalOpen(false);
      try {
        sessionStorage.removeItem('portfolio_dashboard_open');
        if (window.location.hash === '#dashboard') {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } catch {
        // ignore
      }
    }
  };

  const updateOwner = (updated: Partial<PortfolioOwnerData>) => {
    if (!isAdminLoggedIn) {
      console.warn('Unauthorized operation attempted: updateOwner');
      return;
    }
    setOwner((prev) => {
      const next = { ...prev, ...updated };
      persistState(next, projects, inquiries);
      return next;
    });
  };

  const addProject = (project: Project) => {
    if (!isAdminLoggedIn) {
      console.warn('Unauthorized operation attempted: addProject');
      return;
    }
    setProjects((prev) => {
      const next = [project, ...prev];
      persistState(owner, next, inquiries);
      return next;
    });
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    if (!isAdminLoggedIn) {
      console.warn('Unauthorized operation attempted: updateProject');
      return;
    }
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updated } : p));
      persistState(owner, next, inquiries);
      return next;
    });
  };

  const deleteProject = (id: string) => {
    if (!isAdminLoggedIn) {
      console.warn('Unauthorized operation attempted: deleteProject');
      return;
    }
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

  const deleteInquiry = async (id: string) => {
    if (!isAdminLoggedIn) {
      console.warn('Unauthorized operation attempted: deleteInquiry');
      return;
    }
    setInquiries((prev) => {
      const next = prev.filter((i) => i.id !== id);
      persistState(owner, projects, next);
      return next;
    });

    // Sync deletion to Cloud Firestore for genuine submissions
    try {
      const docRef = doc(db, 'contactMessages', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore doc deletion note:', err);
    }
  };

  const markInquiryRead = async (id: string) => {
    if (!isAdminLoggedIn) {
      return;
    }
    setInquiries((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, read: true } : i));
      persistState(owner, projects, next);
      return next;
    });

    // Sync read flag to Cloud Firestore for genuine submissions
    try {
      const docRef = doc(db, 'contactMessages', id);
      await updateDoc(docRef, { read: true });
    } catch (err) {
      console.warn('Firestore doc read update note:', err);
    }
  };

  const importDatabase = (jsonString: string): boolean => {
    if (!isAdminLoggedIn) {
      console.warn('Unauthorized operation attempted: importDatabase');
      return false;
    }
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
    if (!isAdminLoggedIn) {
      console.warn('Unauthorized operation attempted: resetToDefaults');
      return;
    }
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
        currentUser,
        isAdminLoggedIn,
        isAuthChecking,
        isSignInModalOpen,
        isDashboardModalOpen,
        isEmailModalOpen,
        setIsSignInModalOpen,
        setIsDashboardModalOpen,
        setIsEmailModalOpen,
        login,
        loginWithGoogle,
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
