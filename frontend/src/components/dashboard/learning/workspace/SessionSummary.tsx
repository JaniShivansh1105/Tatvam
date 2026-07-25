"use client";

import React from "react";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export function SessionSummary() {
  return (
    <div className="mt-20 border-t border-[#E2E8F0] pt-12 pb-24">
      <h3 className="text-[24px] font-bold text-[#1B1D35] mb-8">Session Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mastered */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm">
          <h4 className="text-[14px] font-bold text-[#1B1D35] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#48BB78]" />
            Today you understood:
          </h4>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2 text-[15px] text-[#4A5568]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#48BB78]" />
              Newton&apos;s First Law
            </li>
            <li className="flex items-center gap-2 text-[15px] text-[#4A5568]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#48BB78]" />
              Inertia
            </li>
          </ul>
        </div>

        {/* Needs Review */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm">
          <h4 className="text-[14px] font-bold text-[#1B1D35] mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#FC8181]" />
            Needs one more review:
          </h4>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2 text-[15px] text-[#4A5568]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FC8181]" />
              Force Diagrams
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-[#F8F9FF] to-[#F0E6FF] border border-[#6C5CE7]/20 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-[14px] font-bold text-[#6C5CE7] uppercase tracking-wider mb-1">Suggested Next Step</h4>
          <p className="text-[18px] font-bold text-[#1B1D35]">Newton&apos;s Second Law (F = ma)</p>
        </div>
        <button className="px-6 py-3 bg-[#6C5CE7] text-white font-bold rounded-full hover:bg-[#5A4BDB] transition-colors flex items-center gap-2 shrink-0">
          Start Next Lesson
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
