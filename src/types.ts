export type ServiceCategory = 
  | 'website'
  | 'gaming-topup'
  | 'social-topup'
  | 'graphic-design'
  | 'video-editing';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: ServiceCategory;
  tagline: string;
  description: string;
  deliverables: string[];
  iconName: string;
}

export type ProjectCategory = 
  | 'ALL'
  | 'WEBSITES'
  | 'GRAPHIC DESIGN'
  | 'VIDEO EDITING'
  | 'SOCIAL MEDIA'
  | 'DIGITAL PROJECTS';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  tags: string[];
  features?: string[];
  linkText?: string;
  demoUrl?: string;
}

export interface SkillItem {
  name: string;
  category: 'Code & Web' | 'Design & Visuals' | 'Video & Motion' | 'Digital Growth';
  icon: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  companyOrHandle: string;
  content: string;
  serviceType: string;
  rating: number;
}

export interface TopUpGame {
  id: string;
  name: string;
  category: 'Mobile' | 'PC' | 'Console';
  popularItem: string;
  badge?: string;
}

export interface TopUpSocial {
  id: string;
  platform: string;
  type: string;
  highlight: string;
}
