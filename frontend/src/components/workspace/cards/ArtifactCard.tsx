import React from 'react';
import { FileText, Download, Share2 } from 'lucide-react';

export const ArtifactCard = ({ artifact }: { artifact: any }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden group hover:border-indigo-500/30 transition-all">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <FileText size={16} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-200">{artifact.title}</h4>
            <p className="text-xs text-slate-500">{artifact.type}</p>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800">
            <Share2 size={14} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800">
            <Download size={14} />
          </button>
        </div>
      </div>
      <div className="p-4 text-xs text-slate-400">
        {artifact.description || "Generated from your latest learning session."}
      </div>
    </div>
  );
};
