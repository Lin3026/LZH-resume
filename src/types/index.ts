export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  tags: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Skill {
  name: string;
  icon: string;
  level: number; // 1-5
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  videoUrl?: string;
  imageUrl?: string;
  link?: string;
  markdownContent?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  github?: string;
  linkedin?: string;
  website?: string;
  bio: string;
}
