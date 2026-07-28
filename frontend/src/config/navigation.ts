import { 
  Home, 
  BookOpen, 
  BrainCircuit, 
  Map, 
  RefreshCcw, 
  CheckSquare, 
  Settings,
  User,
  Database,
  FolderOpen,
  Trophy,
  TrendingUp
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROUTES } from "@/config/routes";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  {
    items: [
      { name: "Dashboard", href: ROUTES.DASHBOARD.HOME, icon: Home, exact: true },
    ]
  },
  {
    label: "LEARNING",
    items: [
      { name: "Learn", href: ROUTES.DASHBOARD.LEARN, icon: BookOpen },
      { name: "Study Plans", href: ROUTES.DASHBOARD.PLANS, icon: Map },
    ]
  },
  {
    label: "INTELLIGENCE",
    items: [
      { name: "AI Mentor", href: "/dashboard/mentor", icon: BrainCircuit },
      { name: "Knowledge", href: "/workspace/knowledge", icon: Database },
      { name: "Resources", href: "/workspace/resources", icon: FolderOpen },
    ]
  },
  {
    label: "PROGRESS",
    items: [
      { name: "Practice", href: ROUTES.DASHBOARD.PRACTICE, icon: RefreshCcw },
      { name: "Assessments", href: ROUTES.DASHBOARD.ASSESSMENTS, icon: CheckSquare },
      { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
      { name: "Progress", href: "/dashboard/progress", icon: TrendingUp },
    ]
  },
  {
    label: "ACCOUNT",
    items: [
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "Settings", href: ROUTES.DASHBOARD.SETTINGS, icon: Settings },
    ]
  }
];
