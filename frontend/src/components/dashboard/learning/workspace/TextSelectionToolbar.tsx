"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, BrainCircuit, Bookmark as BookmarkIcon, Edit3, Volume2, Globe2 } from "lucide-react";
import { useEngineStore } from "@/store/engine-store";

export function TextSelectionToolbar() {
  const [selection, setSelection] = useState<{ text: string, x: number, y: number } | null>(null);
  const { addNote, addBookmark } = useEngineStore();

  useEffect(() => {
    const handleSelection = () => {
      const activeSelection = window.getSelection();
      if (!activeSelection || activeSelection.isCollapsed) {
        setSelection(null);
        return;
      }
      
      const text = activeSelection.toString().trim();
      if (!text) {
        setSelection(null);
        return;
      }

      const range = activeSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelection({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);
    
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
    };
  }, []);

  if (!selection) return null;

  const handleAction = (action: () => void) => {
    action();
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  };

  return (
    <div 
      className="fixed z-[100] bg-[#1B1D35] text-white rounded-[12px] shadow-2xl border border-white/10 flex items-center p-1.5 gap-1 -translate-x-1/2 -translate-y-full animate-in fade-in slide-in-from-bottom-2"
      style={{ left: selection.x, top: selection.y }}
    >
      <button 
        onClick={() => handleAction(() => {
          window.dispatchEvent(new CustomEvent('open-ai-mentor', { detail: { query: selection.text, mode: 'Explain Simply' } }));
        })}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors group"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#E5E1FF]" />
        <span className="text-[12px] font-medium text-white/90">Explain Simply</span>
      </button>
      
      <div className="w-px h-4 bg-white/20 mx-1" />

      <button 
        onClick={() => handleAction(() => {
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(selection.text);
            window.speechSynthesis.speak(utterance);
          }
        })} 
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white" 
        title="Listen"
      >
        <Volume2 className="w-4 h-4" />
      </button>
      <button 
        onClick={() => handleAction(() => {
          window.dispatchEvent(new CustomEvent('open-ai-mentor', { detail: { query: selection.text, mode: 'Translate' } }));
        })} 
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white" 
        title="Translate"
      >
        <Globe2 className="w-4 h-4" />
      </button>

      <div className="w-px h-4 bg-white/20 mx-1" />

      <button 
        onClick={() => handleAction(() => addNote(selection.text))} 
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white" 
        title="Save to Notes"
      >
        <Edit3 className="w-4 h-4" />
      </button>
      <button 
        onClick={() => handleAction(() => addBookmark("concept", selection.text))} 
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white" 
        title="Bookmark"
      >
        <BookmarkIcon className="w-4 h-4" />
      </button>
      <button 
        onClick={() => handleAction(() => {
          window.dispatchEvent(new CustomEvent('open-ai-mentor', { detail: { query: selection.text, mode: 'Ask AI' } }));
        })}
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white" 
        title="Ask AI"
      >
        <BrainCircuit className="w-4 h-4" />
      </button>
    </div>
  );
}
