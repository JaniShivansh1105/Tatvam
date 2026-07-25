"use client";

import { SkeletonCard } from "@/components/layout/skeletons/SkeletonCard";

export function DashboardSkeletons() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start pb-4">
      {/* Main Content Column */}
      <div className="col-span-1 xl:col-span-8 flex flex-col gap-4">
        <div className="h-20 w-1/3 bg-[rgba(108,92,231,0.06)] rounded-lg animate-pulse mb-2" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard className="min-h-[220px]" />
          <SkeletonCard className="min-h-[220px]" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <SkeletonCard key={i} className="min-h-[100px]" />
          ))}
        </div>
        
        <SkeletonCard className="min-h-[160px]" />
      </div>

      {/* Sidebar Content Column */}
      <div className="col-span-1 xl:col-span-4 flex flex-col gap-4 pt-0 xl:pt-[84px]">
        <SkeletonCard className="min-h-[140px]" />
        <SkeletonCard className="min-h-[280px]" />
        <SkeletonCard className="min-h-[300px]" />
      </div>
    </div>
  );
}
