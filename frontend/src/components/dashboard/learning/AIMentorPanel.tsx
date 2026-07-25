"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, BrainCircuit, Maximize2, Minimize2 } from "lucide-react";
import { useEngineStore } from "@/store/engine-store";
import { useAuthStore } from "@/store/auth-store";
import { orchestrator } from "@/lib/ai/orchestrator";

interface AIMentorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODES = ["Explain Simply", "Use Analogy", "Give Example", "Challenge Me"];

export function AIMentorPanel({ isOpen, onClose }: AIMentorPanelProps) {
  const [messages, setMessages] = useState<{ role: "ai" | "user", text: string, isStreaming?: boolean }[]>([
    { role: "ai", text: "I'm your AI Mentor. How can I help you understand this concept better?" }
  ]);
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { determineStrategy, dna, currentStrategy } = useEngineStore();

  useEffect(() => {
    const handleOpenMentor = (e: CustomEvent) => {
      const { query, mode } = e.detail;
      // Pre-fill query or handle mode immediately
      if (query && mode === 'Explain Simply') {
        const text = `Explain simply: "${query}"`;
        handleSend(text);
      } else if (query && mode === 'Translate') {
        const text = `Translate to ${useEngineStore.getState().language}: "${query}"`;
        handleSend(text);
      } else if (query && mode === 'Ask AI') {
        setInput(`Regarding "${query}": `);
      }
    };

    window.addEventListener('open-ai-mentor' as any, handleOpenMentor);
    return () => window.removeEventListener('open-ai-mentor' as any, handleOpenMentor);
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: "user" as const, text }];
    setMessages(newMessages);
    setInput("");
    
    // Engine decides strategy before AI generates
    const strategy = determineStrategy(text);
    
    setMessages(prev => [...prev, { role: "ai", text: "", isStreaming: true }]);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/ai/mentor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().accessToken || ''}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          context: {
            strategy,
            lessonTitle: "Current Lesson", // Can be dynamically injected if needed
            learningState: dna
          }
        })
      });

      if (!response.ok || !response.body) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let currentText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") {
              break;
            }
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                currentText += data.text;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  const lastMsg = newMsgs[newMsgs.length - 1];
                  lastMsg.text = currentText;
                  return newMsgs;
                });
              } else if (data.error) {
                currentText += "\n\n" + data.error;
              }
            } catch (e) {
              // ignore malformed JSON chunk
            }
          }
        }
      }
    } catch (error) {
      console.error("AI chat error:", error);
      setMessages(prev => {
        const newMsgs = [...prev];
        const lastMsg = newMsgs[newMsgs.length - 1];
        lastMsg.text = "Sorry, I am having trouble connecting to the mentor service.";
        return newMsgs;
      });
    } finally {
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].isStreaming = false;
        return newMsgs;
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed z-50 flex flex-col bg-white shadow-[0_20px_60px_-15px_rgba(108,92,231,0.2)] border border-[rgba(108,92,231,0.1)] overflow-hidden transition-all duration-300 ${isExpanded ? 'inset-0 md:inset-6 rounded-none md:rounded-[24px]' : 'right-4 bottom-4 md:right-6 md:bottom-6 rounded-[24px] w-[calc(100vw-32px)] md:w-[420px] h-[500px] md:h-[600px] max-h-[80vh]'}`}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#F8F9FF] to-white border-b border-[rgba(108,92,231,0.08)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full bg-[#6C5CE7] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-white" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#48BB78] border-2 border-white rounded-full" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#1B1D35]">Tatvam Mentor</h4>
                <p className="text-[11px] text-[#6C5CE7] font-medium tracking-wide uppercase">Context Aware</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-[#A0AEC0] hover:text-[#1B1D35] hover:bg-[#F8F9FF] rounded-lg transition-colors">
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={onClose} className="p-1.5 text-[#A0AEC0] hover:text-[#1B1D35] hover:bg-[#F8F9FF] rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-[#FAFAFC]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col max-w-[90%] ${msg.role === "user" ? "self-end items-end" : "self-start items-start"}`}>
                <div className={`p-4 rounded-[20px] text-[15px] leading-relaxed shadow-sm ${msg.role === "user" ? "bg-[#1B1D35] text-white rounded-tr-sm" : "bg-white text-[#4A5568] border border-[rgba(108,92,231,0.1)] rounded-tl-sm"}`}>
                  
                  {/* Mock rendering of rich markdown for AI responses */}
                  {msg.role === "ai" && !msg.isStreaming && idx > 0 ? (
                    <div className="flex flex-col gap-3">
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <div className="p-3 bg-[#F8F9FF] rounded-lg border border-[#E2E8F0] text-[14px]">
                        <strong>Engine Insights:</strong> Using strategy <em>{currentStrategy || "Explain Normally"}</em> based on DNA: <em>{dna.traits.join(", ")}</em>
                      </div>
                    </div>
                  ) : (
                    <>
                      {msg.text}
                      {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-[#6C5CE7] animate-pulse align-middle" />}
                    </>
                  )}
                  
                </div>
              </div>
            ))}
          </div>

          {/* Quick Modes */}
          <div className="px-4 py-3 bg-white border-t border-[rgba(108,92,231,0.08)] flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
            {MODES.map((mode, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(mode)}
                className="px-3 py-1.5 whitespace-nowrap rounded-full bg-[#F0E6FF] text-[#6C5CE7] text-[12px] font-semibold hover:bg-[#6C5CE7] hover:text-white transition-colors"
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[rgba(108,92,231,0.08)] shrink-0 relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Ask a question..."
              className="w-full h-11 bg-[#F8F9FF] rounded-full border border-[#E2E8F0] pl-4 pr-12 text-[14px] outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 transition-all"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="absolute right-7 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6C5CE7] hover:text-[#8B7CF6] disabled:opacity-40 disabled:hover:text-[#6C5CE7] transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
