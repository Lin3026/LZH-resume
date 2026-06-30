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

export interface VideoWork {
  id: string;
  title: string;
  company: string;
  role: string;           // 角色：创意策划 / 视频制作 / 后期合成 等
  period: string;         // 时间段
  thumbnail: string;      // 缩略图 URL（留空则显示占位）
  videoUrl?: string;      // 视频链接（详情页播放用）
  previewUrl?: string;    // 轻量预览视频（hover 自动播放用，200px宽无音频）
  description: string;    // 简介
  // 数据分析字段
  views?: string;         // 播放量 / 下载量
  cpi?: string;           // CPI / 转化成本
  ctr?: string;           // CTR 点击率
  roi?: string;           // ROI 投产比
  highlight: string;      // 核心亮点/成果
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
