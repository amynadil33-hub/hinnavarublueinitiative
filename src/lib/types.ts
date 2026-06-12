import type { ProjectCategory } from './constants';

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  description: string;
  full_description?: string;
  cover_image?: string;
  gallery?: string[];
  videos?: { url: string; type?: string }[];
  impact_metrics?: { label: string; value: string }[];
  status?: string;
  location?: string;
  project_date?: string;
  sort_order?: number | null;
  featured?: boolean;
  published?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  category: string;
  image?: string;
  achievement_date?: string;
  metric_value?: string;
  metric_label?: string;
  published?: boolean;
}

export interface ImpactStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon?: string;
  sort_order?: number;
}

export interface Frame {
  id: string;
  frame_code: string;
  location?: string;
  status: string;
  photo?: string;
  donation_amount?: number;
  description?: string;
}

export interface FrameProgress {
  id: string;
  frame_id: string;
  note?: string;
  photo?: string;
  progress_date?: string;
}
