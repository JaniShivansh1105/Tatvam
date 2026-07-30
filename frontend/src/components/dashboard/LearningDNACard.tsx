"use client";

import React from "react";
import dynamic from "next/dynamic";
import { BrainCircuit, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const RadarChart = dynamic(() => import("recharts").then(mod => mod.RadarChart), { ssr: false });
const Radar = dynamic(() => import("recharts").then(mod => mod.Radar), { ssr: false });
const PolarGrid = dynamic(() => import("recharts").then(mod => mod.PolarGrid), { ssr: false });
const PolarAngleAxis = dynamic(() => import("recharts").then(mod => mod.PolarAngleAxis), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });

interface DNAData {
  visualPreference: number;
  pacePreference: number;
  detailPreference: number;
  audioPreference: number;
  readingPreference: number;
  animationPreference: number;
  examplePreference: number;
  analogyPreference: number;
}

export function LearningDNACard({ dna }: { dna?: any }) {
  if (!dna) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin" />
      </div>
    );
  }

  const chartData = [
    { subject: "Visual", A: (dna.visualScore || 0) * 100, fullMark: 100 },
    { subject: "Analytical", A: (dna.analyticalScore || 0) * 100, fullMark: 100 },
    { subject: "Reading", A: (dna.readingScore || 0) * 100, fullMark: 100 },
    { subject: "Auditory", A: (dna.auditoryScore || 0) * 100, fullMark: 100 },
    { subject: "Pace", A: 50, fullMark: 100 },
    { subject: "Detail", A: 60, fullMark: 100 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-[#6C5CE7]/30 transition-colors">
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center">
          <BrainCircuit className="w-5 h-5 text-[#6C5CE7]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Learning DNA</h2>
          <p className="text-sm font-medium text-slate-500">Your unique cognitive profile</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#718096', fontSize: 11, fontWeight: 600 }} />
            <Radar
              name="DNA"
              dataKey="A"
              stroke="#6C5CE7"
              strokeWidth={2}
              fill="#6C5CE7"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Decorative Blur */}
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#6C5CE7] rounded-full blur-[80px] pointer-events-none"
      />
    </div>
  );
}
