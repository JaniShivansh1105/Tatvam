"use client";

import { cn } from "@/lib/utils";

export function ContentArea({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto custom-scrollbar px-6 lg:px-10 pb-20 pt-6", className)}>
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
        {children}
      </div>
    </div>
  );
}
