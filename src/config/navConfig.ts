import type { NavItem } from "@/types";
import { 
  LayoutDashboard, 
  Users, 
  UploadCloud, 
  ClipboardList, 
  FileText, 
  GraduationCap, 
  Bot, 
  ClipboardCheck, 
  BarChart3,
  BookOpenCheck,
  ShieldCheck,
  ListChecks
} from "lucide-react";

export const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "new-hire"],
  },
  // Admin Routes
  {
    href: "/dashboard/admin/file-upload",
    label: "Upload Materials",
    icon: UploadCloud,
    roles: ["admin"],
  },
  {
    href: "/dashboard/admin/user-management",
    label: "User Management",
    icon: Users,
    roles: ["admin"],
  },
  {
    href: "/dashboard/admin/test-generation",
    label: "Generate Tests",
    icon: BookOpenCheck,
    roles: ["admin"],
  },
  {
    href: "/dashboard/admin/review-module",
    label: "Review Questions",
    icon: ListChecks,
    roles: ["admin"],
  },
  {
    href: "/dashboard/admin/performance",
    label: "Performance",
    icon: BarChart3,
    roles: ["admin"],
  },
  // New Hire Routes
  {
    href: "/dashboard/new-hire/journey",
    label: "My Journey",
    icon: ClipboardList,
    roles: ["new-hire"],
  },
  {
    href: "/dashboard/new-hire/ai-tutor",
    label: "AI Tutor",
    icon: Bot,
    roles: ["new-hire"],
  },
  {
    href: "/dashboard/new-hire/adaptive-test",
    label: "Adaptive Tests",
    icon: GraduationCap,
    roles: ["new-hire"],
  },
  {
    href: "/dashboard/new-hire/documents",
    label: "My Documents",
    icon: FileText,
    roles: ["new-hire"],
  },
  // Common or other routes
  {
    href: "/dashboard/compliance",
    label: "GDPR Compliance",
    icon: ShieldCheck,
    roles: ["admin"], // Or all if it's informational for everyone
  },
];
