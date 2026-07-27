"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, BrainCircuit, Maximize2, Minimize2, Sparkles, HelpCircle, ArrowUpRight } from "lucide-react";
import { useEngineStore } from "@/store/engine-store";
import { useAuthStore } from "@/store/auth-store";
import { useShallow } from "zustand/react/shallow";
import dynamic from "next/dynamic";
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
import remarkGfm from "remark-gfm";

interface AIMentorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const STARTER_PROMPTS = [
  "Explain simply",
  "Use an analogy",
  "Real-world example",
  "Practice problem",
];

const FOLLOW_UPS = [
  "Can you elaborate?",
  "Give a real-world example",
  "Test me on this concept",
];

export function AIMentorPanel({ isOpen, onClose }: AIMentorPanelProps) {
  const [messages, setMessages] = useState<{ role: "ai" | "user", text: string, isStreaming?: boolean }[]>([
    { role: "ai", text: "Hello! I'm your Tatvam AI Mentor. How can I help you understand your current topic better?" }
  ]);
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { determineStrategy, dna, currentStrategy, currentLessonId } = useEngineStore(useShallow(state => ({
    determineStrategy: state.determineStrategy,
    dna: state.dna,
    currentStrategy: state.currentStrategy,
    currentLessonId: state.currentLessonId
  })));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/ai/mentor/history?lessonId=${currentLessonId || 'null'}`;
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${useAuthStore.getState().accessToken || ''}` }
        });
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          // Find the most recent active session
          const session = json.data[0];
          if (session.messages && session.messages.length > 0) {
            const historyMsgs = session.messages.map((m: any) => ({
              role: m.role === "assistant" ? "ai" : "user",
              text: m.content || m.text
            }));
            setMessages(historyMsgs);
          }
        }
      } catch (err) {
        console.error("Failed to load mentor history", err);
      }
    }
    if (isOpen) {
      loadHistory();
    }
  }, [currentLessonId, isOpen]);

  useEffect(() => {
    const handleOpenMentor = (e: CustomEvent) => {
      const { query, mode } = e.detail || {};
      if (query && mode === 'Explain Simply') {
        handleSend(`Explain simply: "${query}"`);
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
    
    const strategy = determineStrategy(text);
    setMessages(prev => [...prev, { role: "ai", text: "", isStreaming: true }]);
    
    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/ai/mentor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().accessToken || ''}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          context: {
            strategy,
            lessonId: currentLessonId || undefined,
            lessonTitle: "Current Lesson",
            learningState: dna
          }
        })
      });

      if (response.status === 401) {
        // Token might be expired, trigger apiClient to auto-refresh it
        try {
          const { apiClient } = await import("@/lib/api-client");
          await apiClient.get("/auth/me"); // Triggers interceptor and refresh
          
          // Retry the request with the new token
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/ai/mentor/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${useAuthStore.getState().accessToken || ''}`,
            },
            body: JSON.stringify({
              messages: newMessages,
              context: {
                strategy,
                lessonId: currentLessonId || undefined,
                lessonTitle: "Current Lesson",
                learningState: dna
              }
            })
          });
        } catch (refreshErr) {
          throw new Error("Authentication failed. Please log in again.");
        }
      }

      if (!response.ok || !response.body) {
        const errorText = await response.text().catch(() => "No error text available");
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorText}`);
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
              // ignore chunk parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error("AI chat error:", error);
      setMessages(prev => {
        const newMsgs = [...prev];
        const lastMsg = newMsgs[newMsgs.length - 1];
        lastMsg.text = "Sorry, I am having trouble connecting to the mentor service right now.";
        return newMsgs;
      });
    } finally {
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs.length > 0) {
          newMsgs[newMsgs.length - 1].isStreaming = false;
        }
        return newMsgs;
      });
    }
  };

  const isLastMessageAI = messages.length > 0 && messages[messages.length - 1].role === "ai" && !messages[messages.length - 1].isStreaming;
  const isCurrentlyStreaming = messages.some(m => m.isStreaming);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed z-50 flex flex-col bg-white shadow-[0_20px_60px_-15px_rgba(108,92,231,0.2)] border border-[rgba(108,92,231,0.15)] overflow-hidden transition-all duration-300 ${
            isExpanded 
              ? 'inset-0 md:inset-6 rounded-none md:rounded-[28px]' 
              : 'right-4 bottom-4 md:right-6 md:bottom-6 rounded-[28px] w-[calc(100vw-32px)] md:w-[440px] h-[520px] md:h-[620px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#F8F9FF] to-white border-b border-[rgba(108,92,231,0.08)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center shadow-md">
                <BrainCircuit className="w-5 h-5 text-white" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#48BB78] border-2 border-white rounded-full" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#1B1D35]">Tatvam AI Mentor</h4>
                <p className="text-[11px] text-[#6C5CE7] font-bold tracking-wider uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Adaptive Tutor
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="p-2 text-[#A0AEC0] hover:text-[#1B1D35] hover:bg-[#F8F9FF] rounded-xl transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={onClose} 
                className="p-2 text-[#A0AEC0] hover:text-[#1B1D35] hover:bg-[#F8F9FF] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-[#FAFAFC] custom-scrollbar">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col max-w-[90%] ${msg.role === "user" ? "self-end items-end" : "self-start items-start"}`}
              >
                <div className={`p-4 rounded-[22px] text-[14.5px] leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-[#1B1D35] text-white rounded-tr-sm" 
                    : "bg-white text-[#2D3748] border border-[rgba(108,92,231,0.12)] rounded-tl-sm"
                }`}>
                  
                  {msg.role === "ai" && !msg.isStreaming && idx > 0 ? (
                    <div className="flex flex-col gap-3">
                      <div className="prose prose-sm max-w-none text-current prose-p:leading-relaxed prose-pre:bg-[#F8F9FF] prose-pre:text-[#2D3748] prose-pre:border prose-pre:border-[#E2E8F0]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                      <div className="p-3 bg-[#F8F9FF] rounded-xl border border-[#E2E8F0] text-[12.5px] text-[#4A5568]">
                        <span className="font-bold text-[#6C5CE7]">Pedagogical Strategy:</span> {currentStrategy || "Adaptive Explanation"}
                      </div>
                    </div>
                  ) : (
                    <>
                      {msg.role === "ai" ? (
                        <div className="prose prose-sm max-w-none text-current prose-p:leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                      {msg.isStreaming && (
                        <span className="inline-flex items-center ml-2 gap-1 align-middle">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] animate-ping" />
                        </span>
                      )}
                    </>
                  )}
                  
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up suggestions */}
          {isLastMessageAI && (
            <div className="px-4 py-2 bg-[#F8F9FF] border-t border-[rgba(108,92,231,0.08)] flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
              <span className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider self-center mr-1 shrink-0">Suggested:</span>
              {FOLLOW_UPS.map((f, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(f)}
                  className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full text-[12px] font-semibold text-[#6C5CE7] hover:border-[#6C5CE7] hover:bg-[#F0E6FF] transition-all whitespace-nowrap shrink-0 flex items-center gap-1"
                >
                  {f} <ArrowUpRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Prompts */}
          <div className="px-4 py-2.5 bg-white border-t border-[rgba(108,92,231,0.08)] flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
            {STARTER_PROMPTS.map((mode, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(mode)}
                className="px-3 py-1.5 whitespace-nowrap rounded-full bg-[#F0E6FF] text-[#6C5CE7] text-[12px] font-bold hover:bg-[#6C5CE7] hover:text-white transition-all shadow-sm"
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-[rgba(108,92,231,0.08)] shrink-0 relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isCurrentlyStreaming && handleSend(input)}
              placeholder="Ask Tatvam AI anything..."
              className="w-full h-11 bg-[#F8F9FF] rounded-full border border-[#E2E8F0] pl-4 pr-12 text-[14px] outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 transition-all text-[#1B1D35]"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isCurrentlyStreaming}
              className="absolute right-7 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6C5CE7] hover:text-[#8B7CF6] disabled:opacity-30 disabled:hover:text-[#6C5CE7] transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
