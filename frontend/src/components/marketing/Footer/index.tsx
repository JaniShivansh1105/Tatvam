"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/config/routes";
import { MarketingContainer } from "../shared/MarketingContainer";
import { Globe, MessageCircle, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-[rgba(108,92,231,0.08)]">
      <MarketingContainer>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col items-start">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 group outline-none mb-4">
              <div className="relative w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center flex-shrink-0">
                <Image src="/logos/tatvam-logo.png" alt="Tatvam" fill sizes="32px" className="object-contain p-1.5 filter brightness-0 invert" />
              </div>
              <span className="text-[20px] font-extrabold tracking-tight text-[#1B1D35]">Tatvam</span>
            </Link>
            <p className="text-[#6B7280] text-[14px] leading-relaxed max-w-sm mb-6">
              An AI-first personalized learning platform focused on deep understanding over rote memorization.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#F8F9FF] border border-[rgba(108,92,231,0.1)] flex items-center justify-center text-[#A0AEC0] hover:text-[#6C5CE7] hover:border-[#6C5CE7]/30 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#F8F9FF] border border-[rgba(108,92,231,0.1)] flex items-center justify-center text-[#A0AEC0] hover:text-[#6C5CE7] hover:border-[#6C5CE7]/30 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#F8F9FF] border border-[rgba(108,92,231,0.1)] flex items-center justify-center text-[#A0AEC0] hover:text-[#1B1D35] hover:border-[#1B1D35]/30 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[14px] font-bold text-[#1B1D35] tracking-wider uppercase mb-2">Platform</h4>
            <Link href={ROUTES.HOME} className="text-[14px] text-[#6B7280] hover:text-[#6C5CE7] transition-colors">Home</Link>
            <Link href={ROUTES.LOGIN} className="text-[14px] text-[#6B7280] hover:text-[#6C5CE7] transition-colors">Log in</Link>
            <Link href={ROUTES.REGISTER} className="text-[14px] text-[#6B7280] hover:text-[#6C5CE7] transition-colors">Sign up</Link>
            <a href="mailto:hello@tatvam.ai" className="text-[14px] text-[#6B7280] hover:text-[#6C5CE7] transition-colors">Contact</a>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[14px] font-bold text-[#1B1D35] tracking-wider uppercase mb-2">Legal</h4>
            <Link href={ROUTES.PRIVACY} className="text-[14px] text-[#6B7280] hover:text-[#6C5CE7] transition-colors">Privacy Policy</Link>
            <Link href={ROUTES.TERMS} className="text-[14px] text-[#6B7280] hover:text-[#6C5CE7] transition-colors">Terms & Conditions</Link>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#E2E8F0] gap-4 text-center md:text-left">
          <p className="text-[13px] text-[#A0AEC0]">
            © {new Date().getFullYear()} Tatvam. All rights reserved.
          </p>
          <p className="text-[13px] font-semibold text-[#6C5CE7]">
            Built for Understanding.
          </p>
        </div>
      </MarketingContainer>
    </footer>
  );
}
