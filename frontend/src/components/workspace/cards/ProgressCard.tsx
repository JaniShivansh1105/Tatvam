import React from 'react';
import { Target, Zap, TrendingUp } from 'lucide-react';

export const ProgressCard = () => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-200">Current Streak</h4>
            <p className="text-xs text-slate-500">You're on fire!</p>
          </div>
          <div className="ml-auto text-2xl font-bold text-emerald-400">
            12
          </div>
        </div>
        
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
        </div>
        <p className="text-xs text-slate-500 mt-2 text-right">3 days to new badge</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp size={14} /> Learning Velocity
        </h4>
        <div className="flex items-end gap-2 h-16 mt-2">
          {[40, 65, 45, 80, 55, 90, 75].map((val, i) => (
            <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-sm relative group">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-sm transition-all duration-500"
                style={{ height: `${val}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
