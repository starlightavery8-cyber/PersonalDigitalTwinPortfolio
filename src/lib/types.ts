export interface ProjectTranslations {
  zh?: {
    title?: string;
    description?: string;
    long_description?: string;
    impact_stats?: { label: string; value: string }[];
  };
}

export interface ExperienceTranslations {
  zh?: {
    role?: string;
    company?: string;
    achievements?: string;
  };
}

export interface SkillTranslations {
  zh?: {
    name?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  category: 'AI Agents' | 'Hardware' | 'Spatial Design';
  description: string;
  long_description: string;
  logic_map: { type: string; definition: string } | null;
  media_urls: string[];
  impact_stats: { label: string; value: string }[];
  tech_tags: string[];
  is_featured: boolean;
  sort_order: number;
  translations: ProjectTranslations | null;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  achievements: string;
  is_academic: boolean;
  year_start: number;
  year_end: number | null;
  location: string;
  category: 'AI_Tech' | 'Architecture' | 'Education';
  is_milestone: boolean;
  translations: ExperienceTranslations | null;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: 'Build' | 'Think' | 'Connect';
  icon_slug: string;
  translations: SkillTranslations | null;
  created_at: string;
}

export interface Contact {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at'>>;
      };
      experience: {
        Row: Experience;
        Insert: Omit<Experience, 'id' | 'created_at'>;
        Update: Partial<Omit<Experience, 'id' | 'created_at'>>;
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, 'id' | 'created_at'>;
        Update: Partial<Omit<Skill, 'id' | 'created_at'>>;
      };
      contacts: {
        Row: Contact;
        Insert: Omit<Contact, 'id' | 'created_at'>;
        Update: Partial<Omit<Contact, 'id' | 'created_at'>>;
      };
    };
  };
};
