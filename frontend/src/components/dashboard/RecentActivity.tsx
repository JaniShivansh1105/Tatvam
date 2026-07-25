"use client";

import { motion, Variants } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle2, MessageSquare, PlayCircle } from "lucide-react";
import { DASHBOARD_CONSTANTS } from "./constants";
import { NoActivity } from "./empty/DashboardEmptyStates";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: DASHBOARD_CONSTANTS.animations.spring }
};

const getIcon = (type: string) => {
  switch (type) {
    case "lesson": return <CheckCircle2 className="w-4 h-4 text-[#48BB78]" />;
    case "mentor": return <MessageSquare className="w-4 h-4 text-[#6C5CE7]" />;
    case "quiz": return <PlayCircle className="w-4 h-4 text-[#ED8936]" />;
    default: return <CheckCircle2 className="w-4 h-4 text-[#A0AEC0]" />;
  }
};

interface ActivityItem {
  id: number;
  title: string;
  type: string;
  time: string;
}

interface RecentActivityProps {
  data: ActivityItem[];
}

export function RecentActivity({ data }: RecentActivityProps) {
  if (!data || data.length === 0) {
    return (
      <motion.div variants={itemVariants} className="h-full">
        <NoActivity />
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="h-full">
      <GlassCard className="p-6 h-full bg-white/70">
        <h3 className="text-[16px] font-semibold text-[#1B1D35] mb-6">Recent Activity</h3>
        
        <div className="flex flex-col gap-5">
          {data.map((activity, index) => (
            <div key={activity.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center group-hover:border-[#6C5CE7] transition-colors shrink-0">
                  {getIcon(activity.type)}
                </div>
                {index !== data.length - 1 && (
                  <div className="w-px h-full bg-[#E2E8F0] mt-1" />
                )}
              </div>
              <div className="flex flex-col pt-1 pb-4">
                <span className="text-[14.5px] font-medium text-[#1B1D35] group-hover:text-[#6C5CE7] transition-colors">
                  {activity.title}
                </span>
                <span className="text-[12px] text-[#A0AEC0] mt-0.5">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
