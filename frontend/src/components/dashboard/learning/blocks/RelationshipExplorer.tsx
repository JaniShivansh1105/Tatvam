"use client";

import React from "react";
import { GitMerge, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEngineStore } from "@/store/engine-store";

interface Node {
  id: string;
  title: string;
  type: "prereq" | "current" | "future";
}

interface RelationshipExplorerProps {
  nodes: Node[];
}

export function RelationshipExplorer({ nodes }: RelationshipExplorerProps) {
  const { concepts } = useEngineStore();
  
  // Try to find the matching concept in the store, default to Exploring if not found
  const getConfidence = (id: string) => {
    return concepts[id]?.confidence || "Exploring";
  };

  return (
    <div className="my-12 p-8 rounded-[24px] bg-white/80 backdrop-blur-xl border border-[rgba(108,92,231,0.15)] shadow-[0_10px_40px_-15px_rgba(108,92,231,0.1)] text-[#1B1D35] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E5E1FF] to-transparent opacity-40 blur-[60px]" />
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <GitMerge className="w-5 h-5 text-[#6C5CE7]" />
        <h4 className="text-[16px] font-bold tracking-wider uppercase text-[#6C5CE7]">Knowledge Graph Context</h4>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {nodes.map((node, idx) => (
          <React.Fragment key={node.id}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`flex-1 p-4 rounded-[16px] border ${
                node.type === "current" 
                  ? "bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] border-[#6C5CE7] shadow-md" 
                  : "bg-[#F8F9FF] border-[#E2E8F0]"
              }`}
            >
              <span className={`text-[11px] uppercase tracking-wider mb-1 block font-semibold ${
                node.type === "current" ? "text-[#E5E1FF]" : "text-[#A0AEC0]"
              }`}>
                {node.type === "prereq" ? "Foundation" : node.type === "future" ? "Unlocks" : "You Are Here"}
              </span>
              <span className={`text-[15px] font-bold ${node.type === "current" ? "text-white" : "text-[#1B1D35]"}`}>
                {node.title}
              </span>
              
              {node.type === "current" && (
                <div className="mt-3 inline-block px-2.5 py-1 bg-white/20 rounded-md">
                  <span className="text-[12px] font-medium text-white tracking-wide">
                    Confidence: {getConfidence("newtons-laws")}
                  </span>
                </div>
              )}
            </motion.div>

            {idx < nodes.length - 1 && (
              <div className="hidden md:flex items-center justify-center px-2 text-[#A0AEC0]">
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
