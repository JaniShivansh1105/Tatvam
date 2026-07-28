import { 
  Home, 
  BookOpen, 
  BrainCircuit, 
  Map, 
  RefreshCcw, 
  CheckSquare, 
  Settings,
  User
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
      { name: "Home", href: ROUTES.DASHBOARD.HOME, icon: Home, exact: true },
    ]
  },
  {
    label: "Learning",
    items: [
      { name: "Learn", href: ROUTES.DASHBOARD.LEARN, icon: BookOpen },
      { name: "Study Plans", href: ROUTES.DASHBOARD.PLANS, icon: Map },
    ]
  },
  {
    label: "Intelligence",
    items: [
      { name: "AI Mentor", href: "/dashboard/mentor", icon: BrainCircuit },
    ]
  },
  {
    label: "Progress",
    items: [
      { name: "Practice", href: ROUTES.DASHBOARD.PRACTICE, icon: RefreshCcw },
      { name: "Assessments", href: ROUTES.DASHBOARD.ASSESSMENTS, icon: CheckSquare },
    ]
  },
  {
    label: "Account",
    items: [
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "Settings", href: ROUTES.DASHBOARD.SETTINGS, icon: Settings },
    ]
  }
];
