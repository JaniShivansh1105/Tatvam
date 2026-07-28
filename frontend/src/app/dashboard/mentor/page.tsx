"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ConversationPanel } from "@/components/workspace/ConversationPanel";
import { ContextPanel } from "@/components/workspace/ContextPanel";
import KnowledgePageContent from "@/components/workspace/knowledge/KnowledgePageContent";
import ResourcesPageContent from "@/components/workspace/resources/ResourcesPageContent";
import { useWorkspaceStore } from "@/store/workspace.store";
import { MessageSquare, Library, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function MentorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = searchParams.get('tab') || 'chat';
  
  const { isRightPanelOpen } = useWorkspaceStore();

  const handleTabChange = (newTab: string) => {
    router.push(`${pathname}?tab=${newTab}`);
  };

  return (
    <PageContainer>
      <ContentArea className="flex flex-col h-[calc(100vh-5rem)]">
        <div className="flex flex-col bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-hidden h-full">
          {/* Unified Top Navigation for AI Mentor */}
          <div className="h-14 border-b border-[#E2E8F0] bg-[#F8F9FF] flex items-center px-4 shrink-0 shadow-sm z-10 gap-2">
            <button 
              onClick={() => handleTabChange('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all relative ${tab === 'chat' ? 'text-[#6C5CE7]' : 'text-[#718096] hover:text-[#1B1D35] hover:bg-white'}`}
            >
              <MessageSquare size={16} /> Chat
              {tab === 'chat' && <motion.div layoutId="mentor-tab" className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-[#6C5CE7] rounded-t-full" />}
            </button>
            
            <button 
              onClick={() => handleTabChange('knowledge')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all relative ${tab === 'knowledge' ? 'text-[#6C5CE7]' : 'text-[#718096] hover:text-[#1B1D35] hover:bg-white'}`}
            >
              <Library size={16} /> Knowledge Library
              {tab === 'knowledge' && <motion.div layoutId="mentor-tab" className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-[#6C5CE7] rounded-t-full" />}
            </button>
            
            <button 
              onClick={() => handleTabChange('resources')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all relative ${tab === 'resources' ? 'text-[#6C5CE7]' : 'text-[#718096] hover:text-[#1B1D35] hover:bg-white'}`}
            >
              <BookOpen size={16} /> Study Resources
              {tab === 'resources' && <motion.div layoutId="mentor-tab" className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-[#6C5CE7] rounded-t-full" />}
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 flex overflow-hidden relative bg-white">
            {tab === 'chat' && (
              <>
                <div className="flex-1 min-w-0 h-full relative">
                  <ConversationPanel />
                </div>
                {isRightPanelOpen && (
                  <div className="w-[30%] min-w-[320px] max-w-[400px] shrink-0 border-l border-[#E2E8F0] h-full overflow-hidden bg-[#F8F9FF]">
                    <ContextPanel />
                  </div>
                )}
              </>
            )}
            
            {tab === 'knowledge' && (
              <div className="w-full h-full overflow-hidden">
                <KnowledgePageContent />
              </div>
            )}

            {tab === 'resources' && (
              <div className="w-full h-full overflow-hidden">
                <ResourcesPageContent />
              </div>
            )}
          </div>
        </div>
      </ContentArea>
    </PageContainer>
  );
}
