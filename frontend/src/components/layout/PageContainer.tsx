"use client";

import { cn } from "@/lib/utils";

export function PageContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col flex-1 h-full w-full overflow-hidden max-w-[1600px] mx-auto", className)}>
      {children}
    </div>
  );
}
