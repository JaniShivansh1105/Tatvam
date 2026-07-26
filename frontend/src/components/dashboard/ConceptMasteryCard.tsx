"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Brain, Loader2, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface ConceptMastery {
  conceptId: string;
  confidence: number;
  trend: string;
  struggleCount: number;
}

export function ConceptMasteryCard({ lessonId }: { lessonId?: string }) {
  const [masteryData, setMasteryData] = useState<ConceptMastery[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMastery = async () => {
      if (!lessonId) {
        setMasteryData([]);
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get(`/progress/lessons/${lessonId}/mastery`);
        setMasteryData(res.data.data.mastery || []);
      } catch (error) {
        console.error("Failed to fetch concept mastery", error);
        setMasteryData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMastery();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin" />
      </div>
    );
  }

  if (!masteryData) return null;

  const mastered = masteryData.filter(m => m.confidence >= 0.7);
  const exploring = masteryData.filter(m => m.confidence < 0.7);

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/60 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#48BB78]/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-[#48BB78]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Concept Mastery</h2>
          <p className="text-sm font-medium text-slate-500">Mastered vs Exploring</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-[#F0FFF4] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-[#C6F6D5]">
          <span className="text-2xl font-bold text-[#2F855A]">{mastered.length}</span>
          <span className="text-[11px] font-bold text-[#48BB78] uppercase tracking-wider mt-1">Mastered</span>
        </div>
        <div className="flex-1 bg-[#FFF5F5] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-[#FED7D7]">
          <span className="text-2xl font-bold text-[#C53030]">{exploring.length}</span>
          <span className="text-[11px] font-bold text-[#E53E3E] uppercase tracking-wider mt-1">Exploring</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[250px]">
        {masteryData.length === 0 ? (
          <div className="text-center text-sm text-slate-500 mt-4">No concepts explored yet.</div>
        ) : (
          masteryData.sort((a, b) => b.confidence - a.confidence).map((concept) => (
            <div key={concept.conceptId} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">{concept.conceptId}</span>
                {concept.confidence >= 0.7 ? (
                  <CheckCircle2 className="w-4 h-4 text-[#48BB78]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#F6AD55]" />
                )}
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${concept.confidence * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${concept.confidence >= 0.7 ? "bg-[#48BB78]" : "bg-[#F6AD55]"}`}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-medium text-slate-500">
                  {Math.round(concept.confidence * 100)}% Confidence
                </span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  {concept.trend}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
