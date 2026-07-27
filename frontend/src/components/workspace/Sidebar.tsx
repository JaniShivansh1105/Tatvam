"use client";

import React from 'react';
import { useWorkspaceStore } from '../../store/workspace.store';
import { BookOpen, MessagesSquare, LayoutDashboard, Settings, Library, PenTool } from 'lucide-react';
import Link from 'next/link';

export const Sidebar = () => {
  const { isSidebarOpen } = useWorkspaceStore();

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full text-slate-300">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <span className="text-xs font-bold">T</span>
          </div>
          Tatvam
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <NavItem icon={<LayoutDashboard size={18} />} label="Workspace" href="/workspace" active />
        <NavItem icon={<BookOpen size={18} />} label="Subjects" />
        <NavItem icon={<MessagesSquare size={18} />} label="Conversations" />
        <NavItem icon={<PenTool size={18} />} label="Study Tools" />
        <NavItem icon={<Library size={18} />} label="Knowledge Library" href="/workspace/knowledge" />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <NavItem icon={<Settings size={18} />} label="Settings" />
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false, href = "#" }: { icon: React.ReactNode, label: string, active?: boolean, href?: string }) => {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${active ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-900 hover:text-white'}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};
