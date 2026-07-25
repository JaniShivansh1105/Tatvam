"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ROUTES } from "@/config/routes";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-2 text-[13px] font-medium text-[#A0AEC0] px-6 lg:px-10 pt-4 pb-2">
      <Link href={ROUTES.DASHBOARD.HOME} className="hover:text-[#6C5CE7] transition-colors flex items-center">
        <Home className="w-3.5 h-3.5" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-3.5 h-3.5 text-[#E2E8F0]" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#6C5CE7] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#1B1D35]">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
