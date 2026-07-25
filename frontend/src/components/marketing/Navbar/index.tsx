"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { MarketingContainer } from "../shared/MarketingContainer";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: ROUTES.HOME },
];

/**
 * Marketing Navbar
 * Responsible for public site navigation.
 * Features: Scroll-blur effect, active indicator, mobile drawer.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/70 backdrop-blur-md border-b border-[rgba(108,92,231,0.08)] py-3 shadow-sm" : "bg-transparent py-5"
        )}
      >
        <MarketingContainer className="flex items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 group outline-none">
            <div className="relative w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center shadow-[0_4px_12px_rgba(108,92,231,0.25)] flex-shrink-0 group-hover:shadow-[0_4px_16px_rgba(108,92,231,0.4)] transition-all">
              <Image src="/logos/tatvam-logo.png" alt="Tatvam" fill sizes="32px" className="object-contain p-1.5 filter brightness-0 invert" />
            </div>
            <span className="text-[18px] font-extrabold tracking-tight text-[#1B1D35]">Tatvam</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href} className="relative py-2 text-[14px] font-medium text-[#1B1D35] hover:text-[#6C5CE7] transition-colors group">
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="marketingNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6C5CE7] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link href={ROUTES.LOGIN} className="text-[14px] font-semibold text-[#1B1D35] hover:text-[#6C5CE7] transition-colors">
              Log in
            </Link>
            <Link href={ROUTES.REGISTER} className="h-10 px-5 bg-[#1B1D35] hover:bg-[#6C5CE7] text-white text-[14px] font-semibold rounded-full flex items-center transition-all duration-300 shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(108,92,231,0.5)]">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-[#1B1D35]" onClick={() => setMobileOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </MarketingContainer>
      </header>

      {/* Mobile Drawer */}
      <div className={cn("fixed inset-0 z-[60] bg-white transition-transform duration-300 ease-in-out md:hidden", mobileOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-[rgba(108,92,231,0.08)]">
            <span className="text-[18px] font-extrabold tracking-tight text-[#1B1D35]">Tatvam</span>
            <button onClick={() => setMobileOpen(false)} className="p-2 text-[#1B1D35]">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col p-6 gap-6 flex-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setMobileOpen(false)} className={cn("text-[18px] font-semibold", pathname === link.href ? "text-[#6C5CE7]" : "text-[#1B1D35]")}>
                {link.name}
              </Link>
            ))}
          </div>
          <div className="p-6 flex flex-col gap-4 border-t border-[rgba(108,92,231,0.08)]">
            <Link href={ROUTES.LOGIN} onClick={() => setMobileOpen(false)} className="h-12 w-full flex items-center justify-center rounded-[12px] bg-[#F8F9FF] text-[#1B1D35] font-semibold border border-[rgba(108,92,231,0.1)]">
              Log in
            </Link>
            <Link href={ROUTES.REGISTER} onClick={() => setMobileOpen(false)} className="h-12 w-full flex items-center justify-center rounded-[12px] bg-[#1B1D35] text-white font-semibold shadow-glowButton">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
