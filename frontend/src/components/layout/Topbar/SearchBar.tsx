"use client";

import { Search, Mic } from "lucide-react";

export function SearchBar() {
  return (
    <div className="hidden md:flex relative group w-full max-w-[400px]">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-[#A0AEC0] group-hover:text-[#6C5CE7] transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Search concepts, lessons, mentors..."
        className="w-full h-11 bg-white/50 backdrop-blur-md border border-[rgba(108,92,231,0.1)] rounded-full pl-11 pr-12 text-[14px] text-[#1B1D35] placeholder:text-[#A0AEC0] outline-none transition-all duration-300 hover:bg-white/80 hover:border-[rgba(108,92,231,0.2)] focus:bg-white focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 shadow-sm"
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
        <button className="p-1 hover:bg-[#F0EEFF] rounded-full transition-colors text-[#A0AEC0] hover:text-[#6C5CE7]">
          <Mic className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
