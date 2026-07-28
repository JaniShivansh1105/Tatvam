import React from 'react';
import { Target, Zap, TrendingUp } from 'lucide-react';

export const ProgressCard = () => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#F0FFF4] flex items-center justify-center text-[#38A169] border border-[#C6F6D5]">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-[#1B1D35]">Current Streak</h4>
            <p className="text-[11px] font-medium text-[#718096]">You're on fire!</p>
          </div>
          <div className="ml-auto text-2xl font-black text-[#38A169]">
            12
          </div>
        </div>
        
        <div className="h-2 w-full bg-[#EDF2F7] rounded-full overflow-hidden">
          <div className="h-full bg-[#38A169] w-3/4 rounded-full shadow-[0_0_10px_rgba(56,161,105,0.4)]" />
        </div>
        <p className="text-[10px] font-bold text-[#A0AEC0] mt-2 text-right uppercase tracking-wider">3 days to new badge</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-sm">
        <h4 className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-[#6C5CE7]" /> Learning Velocity
        </h4>
        <div className="flex items-end gap-2 h-16 mt-2">
          {[40, 65, 45, 80, 55, 90, 75].map((val, i) => (
            <div key={i} className="flex-1 bg-[#F0E6FF] rounded-t-md relative group overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#6C5CE7] to-[#8B7CF6] rounded-t-md transition-all duration-500"
                style={{ height: `${val}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
