"use client";

import { motion, Variants } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen, BrainCircuit, PlayCircle, Map, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DASHBOARD_CONSTANTS } from "./constants";
import { QuickActionData } from "@/types/dashboard";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: DASHBOARD_CONSTANTS.animations.spring }
};

interface QuickActionsProps {
  data: QuickActionData[];
}

const getIcon = (type: string, className: string) => {
  switch (type) {
    case "book": return <BookOpen className={className} />;
    case "brain": return <BrainCircuit className={className} />;
    case "play": return <PlayCircle className={className} />;
    case "map": return <Map className={className} />;
    default: return null;
  }
};

export function QuickActions({ data }: QuickActionsProps) {
  const primaryAction = data.find(a => a.isPrimary);
  const secondaryActions = data.filter(a => !a.isPrimary);

  return (
    <motion.div variants={itemVariants} className="h-full flex flex-col gap-4">
      <h3 className="text-[16px] font-semibold text-[#1B1D35] px-2">Quick Actions</h3>
      
      <div className="flex flex-col gap-3 h-full">
        {/* PRIMARY ACTION */}
        {primaryAction && (
          <Link href={primaryAction.href} className="block group">
            <GlassCard className={`p-4 flex items-center justify-between ${primaryAction.theme.bg} ${primaryAction.theme.hoverBorder} transition-all duration-300 group-hover:-translate-y-0.5 shadow-sm hover:shadow-md`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  {getIcon(primaryAction.iconType, "w-5 h-5")}
                </div>
                <div className="flex flex-col">
                  <h4 className={`text-[15px] font-semibold ${primaryAction.theme.text}`}>{primaryAction.title}</h4>
                  <p className={`text-[12px] ${primaryAction.theme.text} opacity-80 font-medium`}>{primaryAction.description}</p>
                </div>
              </div>
              <ArrowRight className={`w-5 h-5 ${primaryAction.theme.text} group-hover:translate-x-1 transition-transform`} />
            </GlassCard>
          </Link>
        )}

        {/* SECONDARY ACTIONS GRID */}
        <div className="grid grid-cols-1 gap-3">
          {secondaryActions.map((action, index) => (
            <Link key={index} href={action.href} className="block group">
              <GlassCard className={`p-3 flex items-center gap-4 bg-white/60 hover:bg-white transition-all duration-300 group-hover:-translate-y-0.5 ${action.theme.hoverBorder} hover:shadow-sm cursor-pointer border-transparent`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${action.theme.bg} ${action.theme.text}`}>
                  {getIcon(action.iconType, "w-4 h-4")}
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="text-[14px] font-semibold text-[#1B1D35] group-hover:text-inherit transition-colors" style={{ color: "var(--tw-prose-body)" /* fallback, handled by group hover typically but Tailwind needs explicit if not standard */}}>
                    <span className={`group-hover:${action.theme.text} text-[#1B1D35] transition-colors`}>{action.title}</span>
                  </h4>
                  <p className="text-[11px] text-[#A0AEC0]">{action.description}</p>
                </div>
                <ArrowRight className={`w-4 h-4 text-[#A0AEC0] group-hover:${action.theme.text} group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100`} />
              </GlassCard>
            </Link>
          ))}
        </div>

      </div>
    </motion.div>
  );
}
