"use client";

import { Clock, BookOpen, Flame, Target } from "lucide-react";
import { StatCard } from "./StatCard";

interface StatsGridProps {
  data: {
    learningTime: string;
    completedLessons: number;
    accuracy: string;
  };
  streak: number;
}

export function StatsGrid({ data, streak }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard 
        label="Learning Time" 
        value={data.learningTime} 
        icon={<Clock className="w-4 h-4" />} 
      />
      <StatCard 
        label="Completed Lessons" 
        value={data.completedLessons} 
        icon={<BookOpen className="w-4 h-4" />} 
      />
      <StatCard 
        label="Current Streak" 
        value={`${streak} days`} 
        icon={<Flame className="w-4 h-4" />} 
      />
      <StatCard 
        label="Accuracy" 
        value={data.accuracy} 
        icon={<Target className="w-4 h-4" />} 
      />
    </div>
  );
}
