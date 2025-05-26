import { LucideIcon } from "lucide-react";

export interface PerformanceKPI {
  metric: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  period?: string;
  icon: LucideIcon; // ✅ Esto es lo que te faltaba
}

export type UserRole = "admin" | "new-hire" | null;

export interface User {
  id: string;
  email: string | null;
  role: UserRole;
  displayName?: string | null;
  photoURL?: string | null;
}

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
  roles?: UserRole[]; // Roles that can see this nav item
  children?: NavItem[]; // For nested navigation
}

export interface TrainingMaterial {
  id: string;
  name: string;
  type: string; // e.g., 'pdf', 'docx', 'video_url'
  url?: string; // for external links or stored file paths
  uploadedAt: Date;
  status?: 'pending' | 'processed' | 'failed';
}

export interface GeneratedQuestion {
  id: string;
  questionText: string;
  options?: string[];
  correctAnswer?: string;
  topic: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  status: 'pending' | 'approved' | 'rejected';
  createdBy: 'ai' | 'human';
  createdAt: Date;
}

export interface OnboardingModule {
  id: string;
  title: string;
  description: string;
  estimatedTime: string; // e.g., "30 mins"
  completed: boolean;
  subModules?: OnboardingModule[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
}

export interface AdaptiveQuiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  score?: number;
  status: 'not-started' | 'in-progress' | 'completed';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  timestamp: Date;
  link?: string;
}
