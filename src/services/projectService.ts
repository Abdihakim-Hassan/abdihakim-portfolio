import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  Unsubscribe,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Project } from '../types';

/**
 * Strict whitelist of keys permitted on a Firestore Project document.
 * Matches firestore.rules validProjectBase() keys().hasOnly(...) exactly.
 * IMPORTANT: Neither 'createdAt' nor 'updatedAt' is permitted by the security rules.
 */
export const ALLOWED_PROJECT_KEYS = [
  'id',
  'index',
  'title',
  'tagline',
  'category',
  'categoryLabel',
  'stackLabel',
  'image',
  'year',
  'client',
  'featured',
  'technologies',
  'metrics',
  'overview',
  'architecture',
  'challenge',
  'solution',
  'demoUrl',
  'liveAppUrl',
  'githubUrl',
] as const;

export type AllowedProjectKey = typeof ALLOWED_PROJECT_KEYS[number];

export interface ProjectConflictSummary {
  isIdentical: boolean;
  localCount: number;
  cloudCount: number;
  onlyInLocal: string[];
  onlyInCloud: string[];
  differentContent: string[];
}

export interface ProjectsBackupEnvelope {
  format: 'abdihakim_portfolio_projects_backup';
  version: '1.0';
  exportedAt: string;
  count: number;
  projects: Project[];
}

/**
 * Validates whether an incoming project object meets all Firestore security rule constraints
 * prior to dispatching network calls, providing instant and safe local feedback.
 */
export function validateProjectForFirestore(project: Project): { valid: boolean; error?: string } {
  if (!project) return { valid: false, error: 'Project data is required.' };
  if (!project.id || typeof project.id !== 'string' || project.id.length > 60) {
    return { valid: false, error: 'Project ID is invalid or exceeds 60 characters.' };
  }
  if (!project.index || typeof project.index !== 'string' || project.index.length > 10) {
    return { valid: false, error: 'Project index is required (max 10 characters).' };
  }
  if (!project.title || typeof project.title.en !== 'string' || project.title.en.trim().length === 0 || project.title.en.length > 200) {
    return { valid: false, error: 'English project title is required (1-200 characters).' };
  }
  if (typeof project.title.so !== 'string' || project.title.so.length > 200) {
    return { valid: false, error: 'Somali project title exceeds 200 characters.' };
  }
  if (!project.tagline || typeof project.tagline.en !== 'string' || typeof project.tagline.so !== 'string' || project.tagline.en.length > 400 || project.tagline.so.length > 400) {
    return { valid: false, error: 'Project tagline (EN/SO) exceeds 400 characters.' };
  }
  const validCategories = ['web', 'ecommerce', 'cloud', 'design', 'ai', 'mobile', 'desktop'];
  if (!project.category || !validCategories.includes(project.category)) {
    return { valid: false, error: `Invalid category: "${project.category}".` };
  }
  if (!project.categoryLabel || typeof project.categoryLabel.en !== 'string' || project.categoryLabel.en.trim().length === 0 || project.categoryLabel.en.length > 60 || project.categoryLabel.so.length > 60) {
    return { valid: false, error: 'Category label (EN/SO) exceeds 60 characters.' };
  }
  if (typeof project.stackLabel !== 'string' || project.stackLabel.length > 150) {
    return { valid: false, error: 'Stack label exceeds 150 characters.' };
  }
  if (!project.image || typeof project.image !== 'string' || project.image.length > 2000) {
    return { valid: false, error: 'Project image path/URL is required (max 2000 characters).' };
  }
  if (typeof project.year !== 'string' || project.year.length > 10) {
    return { valid: false, error: 'Project year exceeds 10 characters.' };
  }
  if (typeof project.client !== 'string' || project.client.length > 100) {
    return { valid: false, error: 'Project client exceeds 100 characters.' };
  }
  if (typeof project.featured !== 'boolean') {
    return { valid: false, error: 'Project featured status must be boolean.' };
  }
  if (!Array.isArray(project.technologies) || project.technologies.length > 6) {
    return { valid: false, error: 'Technologies must be an array of at most 6 items.' };
  }
  for (const tech of project.technologies) {
    if (typeof tech !== 'string' || tech.trim().length === 0 || tech.length > 40) {
      return { valid: false, error: `Invalid technology tag: "${tech}". Must be 1-40 characters.` };
    }
  }
  if (!Array.isArray(project.metrics) || project.metrics.length > 3) {
    return { valid: false, error: 'Metrics must be an array of at most 3 items.' };
  }
  for (const metric of project.metrics) {
    if (!metric || !metric.label || typeof metric.label.en !== 'string' || typeof metric.label.so !== 'string' || typeof metric.value !== 'string') {
      return { valid: false, error: 'Each metric must have a bilingual label {so, en} and a value.' };
    }
    if (metric.label.en.length > 60 || metric.label.so.length > 60 || metric.value.length > 40) {
      return { valid: false, error: 'Metric label exceeds 60 characters or value exceeds 40 characters.' };
    }
  }
  const checkBi3k = (field: { so: string; en: string }, name: string) => {
    if (!field || typeof field.en !== 'string' || typeof field.so !== 'string') {
      return `${name} must contain { so: string, en: string }.`;
    }
    if (field.en.length > 3000 || field.so.length > 3000) {
      return `${name} exceeds the 3000-character bilingual limit.`;
    }
    return null;
  };
  const overviewErr = checkBi3k(project.overview, 'Overview');
  if (overviewErr) return { valid: false, error: overviewErr };
  const archErr = checkBi3k(project.architecture, 'Architecture');
  if (archErr) return { valid: false, error: archErr };
  const chalErr = checkBi3k(project.challenge, 'Challenge');
  if (chalErr) return { valid: false, error: chalErr };
  const solErr = checkBi3k(project.solution, 'Solution');
  if (solErr) return { valid: false, error: solErr };

  return { valid: true };
}

/**
 * Sanitizes a Project object into a plain record strictly containing only allowed keys.
 * Removes undefined or empty optional link fields so keys().hasOnly(...) passes.
 * STRICTLY PREVENTS 'createdAt' or 'updatedAt' from being attached.
 */
export function sanitizeProjectForFirestore(project: Project): Record<string, any> {
  const payload: Record<string, any> = {
    id: String(project.id).trim(),
    index: String(project.index || '01').trim(),
    title: {
      so: String(project.title?.so || '').trim(),
      en: String(project.title?.en || '').trim(),
    },
    tagline: {
      so: String(project.tagline?.so || '').trim(),
      en: String(project.tagline?.en || '').trim(),
    },
    category: project.category || 'web',
    categoryLabel: {
      so: String(project.categoryLabel?.so || '').trim(),
      en: String(project.categoryLabel?.en || '').trim(),
    },
    stackLabel: String(project.stackLabel || '').trim(),
    image: String(project.image || '').trim(),
    year: String(project.year || '').trim(),
    client: String(project.client || '').trim(),
    featured: Boolean(project.featured),
    technologies: (project.technologies || []).slice(0, 6).map((t) => String(t).trim()),
    metrics: (project.metrics || []).slice(0, 3).map((m) => ({
      label: {
        so: String(m.label?.so || '').trim(),
        en: String(m.label?.en || '').trim(),
      },
      value: String(m.value || '').trim(),
    })),
    overview: {
      so: String(project.overview?.so || '').trim(),
      en: String(project.overview?.en || '').trim(),
    },
    architecture: {
      so: String(project.architecture?.so || '').trim(),
      en: String(project.architecture?.en || '').trim(),
    },
    challenge: {
      so: String(project.challenge?.so || '').trim(),
      en: String(project.challenge?.en || '').trim(),
    },
    solution: {
      so: String(project.solution?.so || '').trim(),
      en: String(project.solution?.en || '').trim(),
    },
  };

  // Optional link fields: include ONLY if non-empty string to satisfy optLink() rule
  if (project.demoUrl && typeof project.demoUrl === 'string' && project.demoUrl.trim().length > 0) {
    payload.demoUrl = project.demoUrl.trim();
  }
  if (project.liveAppUrl && typeof project.liveAppUrl === 'string' && project.liveAppUrl.trim().length > 0) {
    payload.liveAppUrl = project.liveAppUrl.trim();
  }
  if (project.githubUrl && typeof project.githubUrl === 'string' && project.githubUrl.trim().length > 0) {
    payload.githubUrl = project.githubUrl.trim();
  }

  // Safety check: delete any prohibited keys that could accidentally exist
  delete payload.createdAt;
  delete payload.updatedAt;

  return payload;
}

/**
 * Subscribes to real-time updates from Firestore /projects collection.
 * Sorts emitted projects by index string ('01', '02', '03'...).
 */
export function subscribeToProjects(
  onUpdate: (projects: Project[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  const projectsCol = collection(db, 'projects');
  return onSnapshot(
    projectsCol,
    (snapshot) => {
      const items: Project[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Project;
        if (data && data.id) {
          items.push(data);
        }
      });

      // Sort deterministically by index, then by id
      items.sort((a, b) => {
        const idxA = a.index || '';
        const idxB = b.index || '';
        const cmp = idxA.localeCompare(idxB, undefined, { numeric: true });
        return cmp !== 0 ? cmp : a.id.localeCompare(b.id);
      });

      onUpdate(items);
    },
    (error) => {
      console.error('[projectService] Firestore onSnapshot subscription error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * One-time read of all projects from Firestore /projects.
 */
export async function fetchProjectsFromFirestore(): Promise<Project[]> {
  const projectsCol = collection(db, 'projects');
  const snapshot = await getDocs(projectsCol);
  const items: Project[] = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as Project;
    if (data && data.id) {
      items.push(data);
    }
  });

  items.sort((a, b) => {
    const idxA = a.index || '';
    const idxB = b.index || '';
    const cmp = idxA.localeCompare(idxB, undefined, { numeric: true });
    return cmp !== 0 ? cmp : a.id.localeCompare(b.id);
  });

  return items;
}

/**
 * Saves (creates or updates) a Project in Firestore /projects/{projectId}.
 * Uses setDoc with deterministic document ID matching project.id.
 */
export async function saveProjectToFirestore(project: Project): Promise<void> {
  const validation = validateProjectForFirestore(project);
  if (!validation.valid) {
    throw new Error(validation.error || 'Project data validation failed.');
  }

  const payload = sanitizeProjectForFirestore(project);
  const docRef = doc(db, 'projects', payload.id);
  await setDoc(docRef, payload, { merge: false });
}

/**
 * Deletes a Project document from Firestore /projects/{projectId}.
 */
export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  if (!projectId || typeof projectId !== 'string') {
    throw new Error('Valid projectId is required for deletion.');
  }
  const docRef = doc(db, 'projects', projectId);
  await deleteDoc(docRef);
}

/**
 * Compares a local list of projects against cloud records.
 * Identifies additions, deletions, and content discrepancies.
 */
export function compareProjectsLocalVsCloud(
  local: Project[],
  cloud: Project[]
): ProjectConflictSummary {
  const localMap = new Map(local.map((p) => [p.id, p]));
  const cloudMap = new Map(cloud.map((p) => [p.id, p]));

  const onlyInLocal: string[] = [];
  const onlyInCloud: string[] = [];
  const differentContent: string[] = [];

  for (const [id, localProject] of localMap.entries()) {
    if (!cloudMap.has(id)) {
      onlyInLocal.push(id);
    } else {
      const cloudProject = cloudMap.get(id)!;
      // Stringified sanitized comparison
      const localClean = JSON.stringify(sanitizeProjectForFirestore(localProject));
      const cloudClean = JSON.stringify(sanitizeProjectForFirestore(cloudProject));
      if (localClean !== cloudClean) {
        differentContent.push(id);
      }
    }
  }

  for (const id of cloudMap.keys()) {
    if (!localMap.has(id)) {
      onlyInCloud.push(id);
    }
  }

  const isIdentical =
    onlyInLocal.length === 0 &&
    onlyInCloud.length === 0 &&
    differentContent.length === 0;

  return {
    isIdentical,
    localCount: local.length,
    cloudCount: cloud.length,
    onlyInLocal,
    onlyInCloud,
    differentContent,
  };
}

/**
 * Prepares a validated JSON export envelope of projects for backup.
 */
export function exportProjectsBackupJson(projects: Project[]): string {
  const envelope: ProjectsBackupEnvelope = {
    format: 'abdihakim_portfolio_projects_backup',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    count: projects.length,
    projects,
  };
  return JSON.stringify(envelope, null, 2);
}

/**
 * Triggers a browser file download for project backup.
 */
export function downloadProjectsBackupFile(projects: Project[]): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const jsonContent = exportProjectsBackupJson(projects);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.setAttribute('download', `abdihakim-projects-backup-${dateStr}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validates an imported JSON string for project backup restoration.
 */
export function validateProjectsBackupJson(
  jsonString: string
): { valid: boolean; projects?: Project[]; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    let candidateProjects: any[] = [];

    if (parsed && Array.isArray(parsed.projects)) {
      candidateProjects = parsed.projects;
    } else if (Array.isArray(parsed)) {
      candidateProjects = parsed;
    } else {
      return { valid: false, error: 'JSON does not contain a valid array of projects.' };
    }

    if (candidateProjects.length === 0) {
      return { valid: false, error: 'Backup contains zero projects.' };
    }

    const validated: Project[] = [];
    for (let i = 0; i < candidateProjects.length; i++) {
      const p = candidateProjects[i];
      const check = validateProjectForFirestore(p);
      if (!check.valid) {
        return {
          valid: false,
          error: `Project at index ${i} (${p?.id || 'unknown'}) is invalid: ${check.error}`,
        };
      }
      validated.push(p);
    }

    return { valid: true, projects: validated };
  } catch (err: any) {
    return { valid: false, error: `Invalid JSON syntax: ${err?.message || 'Parse error'}` };
  }
}
