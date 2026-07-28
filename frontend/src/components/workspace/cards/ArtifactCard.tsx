import React from 'react';
import { FileText, Download, Share2 } from 'lucide-react';

export const ArtifactCard = ({ artifact }: { artifact: any }) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden group hover:border-[#6C5CE7]/30 transition-all hover:shadow-md">
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8F9FF] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0E6FF] flex items-center justify-center text-[#6C5CE7] border border-[#6C5CE7]/20">
            <FileText size={16} />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-[#1B1D35]">{artifact.title}</h4>
            <p className="text-[11px] text-[#A0AEC0] uppercase font-bold tracking-wider">{artifact.type}</p>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-[#A0AEC0] hover:text-[#1B1D35] rounded-md hover:bg-white border border-transparent hover:border-[#E2E8F0] hover:shadow-sm">
            <Share2 size={14} />
          </button>
          <button className="p-1.5 text-[#A0AEC0] hover:text-[#1B1D35] rounded-md hover:bg-white border border-transparent hover:border-[#E2E8F0] hover:shadow-sm">
            <Download size={14} />
          </button>
        </div>
      </div>
      <div className="p-4 text-xs font-medium text-[#718096]">
        {artifact.description || "Generated from your latest learning session."}
      </div>
    </div>
  );
};
