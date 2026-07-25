import React from "react";
import { cn } from "@/lib/utils";

interface MarketingContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  id?: string;
}

export function MarketingContainer({ children, className, as: Component = "section", id }: MarketingContainerProps) {
  return (
    <Component id={id} className={cn("w-full max-w-[1200px] mx-auto px-6 lg:px-12", className)}>
      {children}
    </Component>
  );
}
