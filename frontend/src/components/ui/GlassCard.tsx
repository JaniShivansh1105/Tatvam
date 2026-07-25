"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  border?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, border = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_40px_-15px_rgba(108,92,231,0.05),0_0_20px_0_rgba(108,92,231,0.02)] relative overflow-hidden",
          border && "border border-white/80",
          className
        )}
        {...props}
      >
        {/* Soft inner glow common in the design system */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
