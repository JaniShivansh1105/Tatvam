"use client";

import { cn } from "@/lib/utils";

export function PageHeader({ 
  title, 
  subtitle, 
  action,
  className 
}: { 
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-4 px-6 lg:px-10 pt-4 pb-6", className)}>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[32px] md:text-[36px] font-medium tracking-tight text-[#1B1D35] leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[16px] text-[#6B7280]">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
