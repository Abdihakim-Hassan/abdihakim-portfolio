import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
import {
  subscribeToProjects,
  saveProjectToFirestore,
  deleteProjectFromFirestore,
  fetchProjectsFromFirestore,
  downloadProjectsBackupFile,
  compareProjectsLocalVsCloud,
  sanitizeProjectForFirestore,
  ProjectConflictSummary,
} from '../services/projectService';

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
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addInquiry: (inquiry: { name: string; email: string; subject: string; message: string }) => void;
  deleteInquiry: (id: string) => void;
  markInquiryRead: (id: string) => void;
  importDatabase: (jsonString: string) => boolean;
  resetToDefaults: () => void;
  projectsSyncStatus: 'synced' | 'connecting' | 'offline' | 'error' | 'idle';
  projectsSyncError: string | null;
  exportProjectsBackup: () => void;
  compareLocalProjectsWithCloud: () => Promise<ProjectConflictSummary>;
}

const STORAGE_KEYS = {
  DB: 'abdihakim_portfolio_db_v2',
  LEGACY_DB: 'abdihakim_portfolio_db_v1',
};

const AUTHORIZED_ADMIN_UID = 'FwmKMpvsXiRbi0mPg9Tl9Q90W4M2';
const AUTHORIZED_ADMIN_EMAIL = 'ccakiincasan@gmail.com';

function safeString(val: unknown, fallback = ''): string {
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (val && typeof val === 'object') {
    const rec = val as Record<string, unknown>;
    if (typeof rec.en === 'string') return rec.en;
    if (typeof rec.so === 'string') return rec.so;
  }
  return fallback;
}

function sanitizeOwnerData(raw: unknown): PortfolioOwnerData {
  if (!raw || typeof raw !== 'object') return PORTFOLIO_OWNER;
  const r = raw as Record<string, unknown>;
  const rawRole = r.role && typeof r.role === 'object' ? (r.role as Record<string, unknown>) : null;
  return {
    ...PORTFOLIO_OWNER,
    fullName: safeString(r.fullName, PORTFOLIO_OWNER.fullName),
    name: safeString(r.name, PORTFOLIO_OWNER.name),
    shortBrand: safeString(r.shortBrand, PORTFOLIO_OWNER.shortBrand),
    monogram: safeString(r.monogram, PORTFOLIO_OWNER.monogram),
    role: {
      en: rawRole ? safeString(rawRole.en, PORTFOLIO_OWNER.role.en) : safeString(r.role, PORTFOLIO_OWNER.role.en),
      so: rawRole ? safeString(rawRole.so, PORTFOLIO_OWNER.role.so) : safeString(r.role, PORTFOLIO_OWNER.role.so),
    },
    university: safeString(r.university, PORTFOLIO_OWNER.university),
    location: safeString(r.location, PORTFOLIO_OWNER.location),
    email: safeString(r.email, PORTFOLIO_OWNER.email),
    whatsapp: safeString(r.whatsapp, PORTFOLIO_OWNER.whatsapp),
    whatsappLink: safeString(r.whatsappLink, PORTFOLIO_OWNER.whatsappLink),
    github: safeString(r.github, PORTFOLIO_OWNER.github),
    githubHandle: safeString(r.githubHandle, PORTFOLIO_OWNER.githubHandle),
    linkedin: safeString(r.linkedin, PORTFOLIO_OWNER.linkedin),
    tiktok: safeString(r.tiktok, PORTFOLIO_OWNER.tiktok),
    tiktokHandle: safeString(r.tiktokHandle, PORTFOLIO_OWNER.tiktokHandle),
    portrait: safeString(r.portrait, PORTFOLIO_OWNER.portrait),
  };
}

function sanitizeProjectsList(rawList: unknown): Project[] {
  if (!Array.isArray(rawList) || rawList.length === 0) return [];
  const cleaned: Project[] = [];
  for (const item of rawList) {
    if (!item || typeof item !== 'object') continue;
    try {
      const sanitized = sanitizeProjectForFirestore(item as unknown as Project) as unknown as Project;
      if (sanitized && typeof sanitized.id === 'string' && sanitized.id.trim()) {
        cleaned.push(sanitized);
      }
    } catch {
      // skip malformed legacy project entry
    }
  }
  return cleaned;
}

function sanitizeInquiriesList(rawList: unknown): Inquiry[] {
  if (!Array.isArray(rawList) || rawList.length === 0) return INITIAL_INQUIRIES;
  return rawList
    .filter((item) => item && typeof item === 'object')
    .map((item, idx) => {
      const r = item as Record<string, unknown>;
      return {
        id: safeString(r.id, `inq-${idx + 1}`),
        name: safeString(r.name, 'Anonymous'),
        email: safeString(r.email, ''),
        subject: safeString(r.subject, 'Portfolio Inquiry'),
        message: safeString(r.message, ''),
        timestamp: safeString(r.timestamp, 'Recently'),
        read: Boolean(r.read),
      };
    });
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

/**
 * Checks whether an authenticated Firebase User has administrator authorization.
 * Uses server-minted Firebase Custom Claims (`token.admin === true`) as primary check,
 * with verified owner UID/email fallback so Google Sign-In never locks out the owner.
 */
async function verifyAdminAuthorization(user: User): Promise<boolean> {
  const isOwnerIdentity =
    user.uid === AUTHORIZED_ADMIN_UID ||
    (typeof user.email === 'string' && user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL);

  try {
    // Force refresh the token (with 3.5s safety timeout) to obtain latest server-minted claims
    const idTokenResult: IdTokenResult = await Promise.race([
      user.getIdTokenResult(true),
      new Promise<IdTokenResult>((resolve, reject) =>
        setTimeout(() => user.getIdTokenResult(false).then(resolve).catch(reject), 3500)
      ),
    ]);
    if (idTokenResult?.claims?.admin === true) {
      return true;
    }
    return isOwnerIdentity;
  } catch (err) {
    console.warn('Token refresh warning during admin check:', err);
    return isOwnerIdentity;
  }
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [owner, setOwner] = useState<PortfolioOwnerData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DB);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.owner) return sanitizeOwnerData(parsed.owner);
      }
    } catch (e) {
      console.warn('Failed to load owner data from cache', e);
    }
    return PORTFOLIO_OWNER;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      let deletedIds: string[] = [];
      try {
        const rawDeleted = localStorage.getItem('abdihakim_portfolio_deleted_ids');
        if (rawDeleted) deletedIds = JSON.parse(rawDeleted);
      } catch {
        // ignore
      }
      const deletedSet = new Set(deletedIds);

      const savedV2 = localStorage.getItem(STORAGE_KEYS.DB);
      if (savedV2) {
        const parsed = JSON.parse(savedV2);
        const sanitized = sanitizeProjectsList(parsed?.projects).filter((p) => !deletedSet.has(p.id));
        if (sanitized.length > 0) {
          return sanitized;
        }
      }

      // Migrate valid projects from legacy v1 cache if present, then purge v1 to prevent corrupted object crashes
      const savedV1 = localStorage.getItem(STORAGE_KEYS.LEGACY_DB);
      if (savedV1) {
        localStorage.removeItem(STORAGE_KEYS.LEGACY_DB);
        const parsedV1 = JSON.parse(savedV1);
        const v1Projects = sanitizeProjectsList(parsedV1?.projects).filter((p) => !deletedSet.has(p.id));
        if (v1Projects.length > 0) {
          const map = new Map<string, Project>();
          for (const baseProj of PROJECTS_DATA) {
            if (!deletedSet.has(baseProj.id)) map.set(baseProj.id, baseProj);
          }
          for (const p of v1Projects) {
            map.set(p.id, p);
          }
          const merged = Array.from(map.values()).sort((a, b) =>
            (a.index || '').localeCompare(b.index || '', undefined, { numeric: true })
          );
          localStorage.setItem(
            STORAGE_KEYS.DB,
            JSON.stringify({ owner: PORTFOLIO_OWNER, projects: merged, inquiries: INITIAL_INQUIRIES })
          );
          return merged;
        }
      }
    } catch (e) {
      console.warn('Failed to load projects from cache', e);
      try {
        localStorage.removeItem(STORAGE_KEYS.LEGACY_DB);
      } catch {
        // ignore
      }
    }
    return PROJECTS_DATA;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DB);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed?.inquiries) && parsed.inquiries.length > 0) {
          return sanitizeInquiriesList(parsed.inquiries);
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
      const h = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
      return h === '#dashboard' || h === '#admin';
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

  // Authoritative Firebase Auth State Listener with safety timeout against network hangs
  useEffect(() => {
    const authSafetyTimer = window.setTimeout(() => {
      setIsAuthChecking(false);
    }, 2500);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      window.clearTimeout(authSafetyTimer);
      setIsAuthChecking(true);
      try {
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
      } finally {
        setIsAuthChecking(false);
      }
    });

    return () => {
      window.clearTimeout(authSafetyTimer);
      unsubscribe();
    };
  }, []);

  // Synchronize URL hash with Auth & Dashboard modals
  useEffect(() => {
    const handleHash = () => {
      const h = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
      if (h === '#dashboard' || h === '#admin') {
        if (!isAuthChecking) {
          if (isAdminLoggedIn) {
            setIsDashboardModalOpenState(true);
            setIsSignInModalOpen(false);
          } else {
            setIsDashboardModalOpenState(false);
            setIsSignInModalOpen(true);
          }
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdminLoggedIn, isAuthChecking]);

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

  // Projects cloud sync & offline cache state
  const [projectsSyncStatus, setProjectsSyncStatus] = useState<
    'synced' | 'connecting' | 'offline' | 'error' | 'idle'
  >('idle');
  const [projectsSyncError, setProjectsSyncError] = useState<string | null>(null);

  // Authoritative reference and sequence counter guarding against rollback race conditions
  const latestProjectsRef = useRef<Project[]>(projects);
  const snapshotSeqRef = useRef<number>(0);

  // Keep latestProjectsRef aligned on direct projects updates
  useEffect(() => {
    latestProjectsRef.current = projects;
  }, [projects]);

  // Real-time Firestore synchronization for /projects collection
  useEffect(() => {
    setProjectsSyncStatus('connecting');

    const unsubscribe = subscribeToProjects(
      (rawLiveProjects) => {
        const liveProjects = sanitizeProjectsList(rawLiveProjects);
        if (liveProjects && liveProjects.length > 0) {
          // Merge live cloud projects with any unmigrated local projects so partial cloud writes never wipe out local projects
          const cloudMap = new Map(liveProjects.map((p) => [p.id, p]));
          let deletedIds: string[] = [];
          try {
            const rawDeleted = localStorage.getItem('abdihakim_portfolio_deleted_ids');
            if (rawDeleted) deletedIds = JSON.parse(rawDeleted);
          } catch {
            // ignore
          }
          const deletedSet = new Set(deletedIds);

          const mergedList: Project[] = [...liveProjects.filter((p) => !deletedSet.has(p.id))];
          for (const localProj of latestProjectsRef.current) {
            if (!cloudMap.has(localProj.id) && !deletedSet.has(localProj.id)) {
              mergedList.push(localProj);
            }
          }

          mergedList.sort((a, b) => {
            const idxA = a.index || '';
            const idxB = b.index || '';
            const cmp = idxA.localeCompare(idxB, undefined, { numeric: true });
            return cmp !== 0 ? cmp : a.id.localeCompare(b.id);
          });

          snapshotSeqRef.current += 1;
          latestProjectsRef.current = mergedList;
          setProjects(mergedList);
          setProjectsSyncStatus('synced');
          setProjectsSyncError(null);

          // Write-through cache to localStorage
          try {
            const saved = localStorage.getItem(STORAGE_KEYS.DB);
            const currentDb = saved ? JSON.parse(saved) : {};
            localStorage.setItem(
              STORAGE_KEYS.DB,
              JSON.stringify({ ...currentDb, projects: mergedList })
            );
          } catch (e) {
            console.warn('Failed to update projects cache in localStorage', e);
          }
        } else {
          // Cloud collection is currently empty: maintain local cached projects and register status as idle.
          setProjectsSyncStatus('idle');
        }
      },
      (error) => {
        console.warn('[PortfolioContext] Firestore projects subscription fallback:', error);
        setProjectsSyncStatus('offline');
        setProjectsSyncError(error.message || 'Offline or network failure');
      }
    );

    return () => unsubscribe();
  }, []);

  // Automatically synchronize local/baseline projects to Cloud Firestore once admin signs in if Cloud is empty
  const autoSeededRef = useRef(false);
  useEffect(() => {
    if (!isAdminLoggedIn || projectsSyncStatus !== 'idle' || autoSeededRef.current) return;
    autoSeededRef.current = true;
    (async () => {
      try {
        for (const p of latestProjectsRef.current) {
          await saveProjectToFirestore(p);
        }
        setProjectsSyncStatus('synced');
        setProjectsSyncError(null);
      } catch (err) {
        console.warn('[PortfolioContext] Initial cloud sync warning:', err);
      }
    })();
  }, [isAdminLoggedIn, projectsSyncStatus]);

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
      try {
        sessionStorage.setItem('portfolio_dashboard_open', 'true');
      } catch {
        // ignore
      }
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
   */
  const loginWithGoogle = async (): Promise<LoginResult> => {
    try {
      try {
        sessionStorage.setItem('portfolio_dashboard_open', 'true');
      } catch {
        // ignore
      }
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
          error: `Access Denied: "${user.email || 'This Google account'}" is not the administrator account (${AUTHORIZED_ADMIN_EMAIL}). Please select ${AUTHORIZED_ADMIN_EMAIL}.`,
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
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        errorMessage = `Domain "${currentHost}" is not in Firebase Authorized Domains yet. Add "${currentHost}" in Firebase Console -> Auth -> Settings -> Authorized domains, OR sign in with Email & Password above.`;
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

  const addProject = async (project: Project): Promise<void> => {
    if (!isAdminLoggedIn) {
      console.warn('Unauthorized operation attempted: addProject');
      throw new Error('Access Denied: Administrator authentication is required to add projects.');
    }

    // 1. Immediately update local state and localStorage so the new project is visible right away
    try {
      const rawDeleted = localStorage.getItem('abdihakim_portfolio_deleted_ids');
      if (rawDeleted) {
        const deletedIds: string[] = JSON.parse(rawDeleted);
        localStorage.setItem(
          'abdihakim_portfolio_deleted_ids',
          JSON.stringify(deletedIds.filter((dId) => dId !== project.id))
        );
      }
    } catch {
      // ignore
    }

    const existingList = latestProjectsRef.current.filter((p) => p.id !== project.id);
    const next = [...existingList, project].sort((a, b) => {
      const idxA = a.index || '';
      const idxB = b.index || '';
      const cmp = idxA.localeCompare(idxB, undefined, { numeric: true });
      return cmp !== 0 ? cmp : a.id.localeCompare(b.id);
    });

    latestProjectsRef.current = next;
    setProjects(next);
    persistState(owner, next, inquiries);

    try {
      // 2. Sync to Cloud Firestore (if cloud was empty/idle, also sync existing baseline projects so none are lost)
      if (projectsSyncStatus !== 'synced') {
        for (const p of next) {
          await saveProjectToFirestore(p);
        }
      } else {
        await saveProjectToFirestore(project);
      }
      setProjectsSyncStatus('synced');
      setProjectsSyncError(null);
    } catch (err: any) {
      console.warn('[PortfolioDataContext] Cloud sync warning on addProject (saved locally):', err);
      setProjectsSyncStatus('offline');
      setProjectsSyncError(err?.message || 'Saved locally (Cloud sync pending)');
    }
  };

  const updateProject = async (id: string, updated: Partial<Project>): Promise<void> => {
    if (!isAdminLoggedIn) {
      console.warn('Unauthorized operation attempted: updateProject');
      throw new Error('Access Denied: Administrator authentication is required to update projects.');
    }

    const target = latestProjectsRef.current.find((p) => p.id === id);
    if (!target) {
      throw new Error(`Target project "${id}" not found.`);
    }

    const mergedProject: Project = { ...target, ...updated, id };

    // 1. Immediately update local state and localStorage so edits appear right away
    const next = latestProjectsRef.current
      .map((p) => (p.id === id ? mergedProject : p))
      .sort((a, b) => {
        const idxA = a.index || '';
        const idxB = b.index || '';
        const cmp = idxA.localeCompare(idxB, undefined, { numeric: true });
        return cmp !== 0 ? cmp : a.id.localeCompare(b.id);
      });

    latestProjectsRef.current = next;
    setProjects(next);
    persistState(owner, next, inquiries);

    try {
      // 2. Sync to Cloud Firestore
      if (projectsSyncStatus !== 'synced') {
        for (const p of next) {
          await saveProjectToFirestore(p);
        }
      } else {
        await saveProjectToFirestore(mergedProject);
      }
      setProjectsSyncStatus('synced');
      setProjectsSyncError(null);
    } catch (err: any) {
      console.warn('[PortfolioDataContext] Cloud sync warning on updateProject (saved locally):', err);
      setProjectsSyncStatus('offline');
      setProjectsSyncError(err?.message || 'Saved locally (Cloud sync pending)');
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    if (!isAdminLoggedIn) {
      console.warn('Unauthorized operation attempted: deleteProject');
      throw new Error('Access Denied: Administrator authentication is required to delete projects.');
    }

    // 1. Record deleted ID and immediately remove from local state + localStorage
    try {
      const rawDeleted = localStorage.getItem('abdihakim_portfolio_deleted_ids');
      const deletedIds: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('abdihakim_portfolio_deleted_ids', JSON.stringify(deletedIds));
      }
    } catch {
      // ignore
    }

    const next = latestProjectsRef.current.filter((p) => p.id !== id);
    latestProjectsRef.current = next;
    setProjects(next);
    persistState(owner, next, inquiries);

    try {
      // 2. Attempt deletion from Cloud Firestore
      await deleteProjectFromFirestore(id);
    } catch (err: any) {
      console.warn('[PortfolioDataContext] Cloud sync warning on deleteProject (deleted locally):', err);
      setProjectsSyncStatus('offline');
      setProjectsSyncError(err?.message || 'Deleted locally (Cloud sync pending)');
    }
  };

  const exportProjectsBackup = () => {
    downloadProjectsBackupFile(projects);
  };

  const compareLocalProjectsWithCloud = async (): Promise<ProjectConflictSummary> => {
    const cloudProjects = await fetchProjectsFromFirestore();
    return compareProjectsLocalVsCloud(projects, cloudProjects);
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
      const nextOwner = parsed?.owner ? sanitizeOwnerData(parsed.owner) : owner;
      const sanitizedProjects = sanitizeProjectsList(parsed?.projects);
      const nextProjects = sanitizedProjects.length > 0 ? sanitizedProjects : projects;
      const nextInquiries = Array.isArray(parsed?.inquiries)
        ? sanitizeInquiriesList(parsed.inquiries)
        : inquiries;

      setOwner(nextOwner);
      setProjects(nextProjects);
      setInquiries(nextInquiries);
      persistState(nextOwner, nextProjects, nextInquiries);
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
      localStorage.removeItem(STORAGE_KEYS.LEGACY_DB);
      localStorage.removeItem('abdihakim_portfolio_deleted_ids');
    } catch (e) {
      console.error(e);
    }
    latestProjectsRef.current = PROJECTS_DATA;
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
        projectsSyncStatus,
        projectsSyncError,
        exportProjectsBackup,
        compareLocalProjectsWithCloud,
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
