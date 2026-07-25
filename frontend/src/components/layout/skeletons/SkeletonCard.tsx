"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <GlassCard className={cn("p-6 flex flex-col gap-4 animate-pulse", className)}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[rgba(108,92,231,0.06)]" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 bg-[rgba(108,92,231,0.06)] rounded-full w-1/3" />
          <div className="h-3 bg-[rgba(108,92,231,0.04)] rounded-full w-1/4" />
        </div>
      </div>
      <div className="h-20 bg-[rgba(108,92,231,0.04)] rounded-[16px] w-full mt-2" />
    </GlassCard>
  );
}
