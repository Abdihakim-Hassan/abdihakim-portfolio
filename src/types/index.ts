export type Language = 'so' | 'en';

export interface Project {
  id: string;
  index: string;
  title: {
    so: string;
    en: string;
  };
  tagline: {
    so: string;
    en: string;
  };
  category: 'web' | 'ecommerce' | 'cloud' | 'design';
  categoryLabel: {
    so: string;
    en: string;
  };
  stackLabel: string;
  image: string;
  year: string;
  client: string;
  featured: boolean;
  technologies: string[];
  metrics: {
    label: { so: string; en: string };
    value: string;
  }[];
  overview: {
    so: string;
    en: string;
  };
  architecture: {
    so: string;
    en: string;
  };
  challenge: {
    so: string;
    en: string;
  };
  solution: {
    so: string;
    en: string;
  };
  demoUrl?: string;
  liveAppUrl?: string;
  githubUrl?: string;
}

export interface SkillProgress {
  id: string;
  name: {
    so: string;
    en: string;
  };
  percentage: number;
  category: 'Frontend' | 'Backend' | 'Tools';
  stage: {
    so: string;
    en: string;
  };
  description: {
    so: string;
    en: string;
  };
  topics: string[];
}

export interface ServiceItem {
  id: string;
  title: {
    so: string;
    en: string;
  };
  description: {
    so: string;
    en: string;
  };
  iconName: string;
  technologies: string[];
}

export interface EducationMilestone {
  id: string;
  title: {
    so: string;
    en: string;
  };
  institution: string;
  location: string;
  period: string;
  image: string;
  badgeText: {
    so: string;
    en: string;
  };
  description: {
    so: string;
    en: string;
  };
  skillsGained: string[];
}

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}
