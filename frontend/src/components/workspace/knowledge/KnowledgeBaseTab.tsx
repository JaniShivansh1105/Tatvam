"use client";

import React, { useEffect, useState } from 'react';
import { Database, Lightbulb, Link as LinkIcon, FunctionSquare, LayoutDashboard } from 'lucide-react';

export const KnowledgeBaseTab = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const { useAuthStore } = await import('@/store/auth-store');
        const token = useAuthStore.getState().accessToken;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/knowledge/context`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKnowledge();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8F9FF] p-8">
        <div className="w-8 h-8 rounded-full border-2 border-[#6C5CE7] border-t-transparent animate-spin mb-4" />
        <p className="text-[#4A5568]">Synthesizing knowledge from documents...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8F9FF] p-8">
        <Database className="w-12 h-12 text-[#A0AEC0] mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-[#1B1D35]">No Knowledge Found</h3>
        <p className="text-sm text-[#718096] mt-2">Upload documents to automatically extract concepts and relationships.</p>
      </div>
    );
  }

  const hasData = (data.concepts?.length > 0) || (data.definitions?.length > 0) || (data.formulae?.length > 0);

  if (!hasData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8F9FF] p-8">
        <Database className="w-12 h-12 text-[#A0AEC0] mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-[#1B1D35]">Knowledge Base Empty</h3>
        <p className="text-sm text-[#718096] mt-2">Upload more educational documents to extract meaningful concepts.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F8F9FF] p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[16px] bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">
            <Database className="text-[#6C5CE7]" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1B1D35]">Knowledge Base</h2>
            <p className="text-[#718096]">Automatically extracted from your documents.</p>
          </div>
        </div>

        {data.concepts && data.concepts.length > 0 && (
          <section className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-bold text-[#1B1D35] flex items-center gap-2 mb-4">
              <Lightbulb className="text-[#F6AD55]" size={20} /> Key Concepts
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.concepts.map((c: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-[#F0E6FF] text-[#6C5CE7] rounded-lg text-sm font-bold border border-[#6C5CE7]/20">
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.definitions && data.definitions.length > 0 && (
          <section className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-bold text-[#1B1D35] flex items-center gap-2 mb-4">
              <LayoutDashboard className="text-[#38B2AC]" size={20} /> Definitions
            </h3>
            <div className="space-y-4">
              {data.definitions.map((def: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-[#F8F9FF] border border-[#E2E8F0]">
                  <h4 className="font-bold text-[#1B1D35] mb-1">{def.term}</h4>
                  <p className="text-[#4A5568] text-sm leading-relaxed">{def.definition}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.formulae && data.formulae.length > 0 && (
          <section className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-bold text-[#1B1D35] flex items-center gap-2 mb-4">
              <FunctionSquare className="text-[#E53E3E]" size={20} /> Formulae
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.formulae.map((f: string, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-[#FFF5F5] border border-[#FED7D7] text-[#C53030] font-mono text-sm overflow-x-auto">
                  {f}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.importantTopics && data.importantTopics.length > 0 && (
          <section className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-bold text-[#1B1D35] flex items-center gap-2 mb-4">
              <Lightbulb className="text-[#9F7AEA]" size={20} /> Important Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.importantTopics.map((t: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-[#FAF5FF] text-[#805AD5] rounded-lg text-sm font-bold border border-[#D6BCFA]">
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.relationships && data.relationships.length > 0 && (
          <section className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-bold text-[#1B1D35] flex items-center gap-2 mb-4">
              <LinkIcon className="text-[#4299E1]" size={20} /> Relationships
            </h3>
            <ul className="space-y-3">
              {data.relationships.map((r: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-[#4A5568]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4299E1] shrink-0 mt-2" />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.dependencies && data.dependencies.length > 0 && (
          <section className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-bold text-[#1B1D35] flex items-center gap-2 mb-4">
              <LinkIcon className="text-[#ED8936]" size={20} /> Prerequisites
            </h3>
            <ul className="space-y-3">
              {data.dependencies.map((d: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-[#4A5568]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ED8936] shrink-0 mt-2" />
                  <span className="leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.learningGraph && data.learningGraph.length > 0 && (
          <section className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-bold text-[#1B1D35] flex items-center gap-2 mb-4">
              <LayoutDashboard className="text-[#48BB78]" size={20} /> Knowledge Graph
            </h3>
            <div className="bg-[#F0FFF4] border border-[#C6F6D5] rounded-xl p-4 font-mono text-sm text-[#276749] overflow-x-auto">
              <ul className="space-y-2">
                {data.learningGraph.map((node: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 whitespace-nowrap">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#48BB78] shrink-0" />
                    {node}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
