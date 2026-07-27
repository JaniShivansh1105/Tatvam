import React from 'react';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {children}
    </div>
  );
}
