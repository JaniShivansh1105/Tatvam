export interface UserStats {
  streak: number;
}

export interface ContinueLearningData {
  subject: string;
  lesson: string;
  progress: number;
  remainingTime: number;
}

export interface AIInsightData {
  observation: string;
  weakness: string;
  recommendation: string;
  confidence: string;
  basis: string;
  timestamp: string;
}

export interface GoalData {
  current: number;
  target: number;
}

export interface StatsData {
  learningTime: string;
  completedLessons: number;
  accuracy: string;
}

export interface ActivityItem {
  id: number;
  title: string;
  type: string;
  time: string;
}

export interface RoadmapNode {
  id: string;
  label: string;
  status: "completed" | "current" | "locked";
  progress?: number;
}

export interface QuickActionData {
  title: string;
  description: string;
  href: string;
  iconType: "book" | "brain" | "play" | "map";
  theme: {
    bg: string;
    text: string;
    hoverBorder: string;
  };
  isPrimary?: boolean;
}
