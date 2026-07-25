"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { AIMentorPanel } from "@/components/dashboard/learning/AIMentorPanel";

export default function MentorPage() {
  // Open the mentor panel in-page (always visible on the dedicated page)
  const [isOpen, setIsOpen] = useState(true);

  return (
    <PageContainer>
      <ContentArea>
        <div className="w-full h-full min-h-[700px] relative">
          <AIMentorPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
          {!isOpen && (
            <div className="flex flex-col items-center justify-center h-full min-h-[600px] bg-white rounded-3xl border border-[#E2E8F0]">
              <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] text-white rounded-xl font-bold text-[15px] hover:shadow-lg transition-all"
              >
                Open AI Mentor
              </button>
            </div>
          )}
        </div>
      </ContentArea>
    </PageContainer>
  );
}
