"use client";

import React from "react";
import { FunctionSquare, AlertTriangle, Lightbulb, Rocket } from "lucide-react";

interface Variable {
  symbol: string;
  name: string;
  unit: string;
}

interface FormulaCardProps {
  formula: string;
  meaning: string;
  variables: Variable[];
  realLife?: string;
  mistake?: string;
  memoryTrick?: string;
}

export function FormulaCard({ formula, meaning, variables, realLife, mistake, memoryTrick }: FormulaCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[13px] font-bold text-[#1B1D35] uppercase tracking-wider flex items-center gap-2">
        <FunctionSquare className="w-4 h-4 text-[#48BB78]" />
        Formula Sheet
      </h4>
      
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden shadow-sm">
        <div className="p-5 bg-gradient-to-br from-[#F8F9FF] to-white border-b border-[#E2E8F0] flex items-center justify-center">
          <span className="text-[32px] font-bold text-[#1B1D35] font-serif tracking-wider">{formula}</span>
        </div>
        <div className="p-4">
          <p className="text-[14px] text-[#4A5568] font-medium mb-4">{meaning}</p>
          <div className="space-y-2">
            {variables.map(v => (
              <div key={v.symbol} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#EDF2F7] text-[#1B1D35] font-bold font-serif flex items-center justify-center">{v.symbol}</span>
                  <span className="text-[#4A5568]">{v.name}</span>
                </div>
                <span className="text-[#A0AEC0] font-mono text-[11px] bg-[#F7FAFC] px-1.5 py-0.5 rounded">{v.unit}</span>
              </div>
            ))}
          </div>

          {(realLife || mistake || memoryTrick) && (
            <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex flex-col gap-3">
              {realLife && (
                <div className="flex gap-2">
                  <Rocket className="w-4 h-4 text-[#6C5CE7] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] font-bold text-[#1B1D35] block uppercase tracking-wider mb-0.5">Real Life</span>
                    <span className="text-[13px] text-[#4A5568]">{realLife}</span>
                  </div>
                </div>
              )}
              {mistake && (
                <div className="flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FC8181] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] font-bold text-[#1B1D35] block uppercase tracking-wider mb-0.5">Common Mistake</span>
                    <span className="text-[13px] text-[#4A5568]">{mistake}</span>
                  </div>
                </div>
              )}
              {memoryTrick && (
                <div className="flex gap-2">
                  <Lightbulb className="w-4 h-4 text-[#ED8936] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] font-bold text-[#1B1D35] block uppercase tracking-wider mb-0.5">Memory Trick</span>
                    <span className="text-[13px] text-[#4A5568]">{memoryTrick}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
