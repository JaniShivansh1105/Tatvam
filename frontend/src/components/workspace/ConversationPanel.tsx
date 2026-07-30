"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useConversationStore } from '../../store/conversation.store';
import { Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageActions } from './MessageActions';
import { AIActionBar } from './AIActionBar';
import { workspaceEvents, EVENTS } from '../../lib/workspace-events';

export const ConversationPanel = () => {
  const { messages, addMessage, isGenerating, setGenerating, updateMessage } = useConversationStore();
  const [input, setInput] = useState('');
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsScrolledToBottom(isAtBottom);
    }
  };

  useEffect(() => {
    if (isScrolledToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating]);

  useEffect(() => {
    const unsubTriggerChat = workspaceEvents.subscribe(EVENTS.TriggerChat, (payload: any) => {
      if (payload && payload.text) {
        sendMessage(payload.text, payload.context);
      }
    });
    return () => {
      unsubTriggerChat();
    };
  }, []);

  const sendMessage = async (text: string, additionalContext?: any) => {
    if (useConversationStore.getState().isGenerating) return;
    
    addMessage({ id: Date.now().toString(), role: 'user', content: text });
    setGenerating(true);

    const assistantId = (Date.now() + 1).toString();
    addMessage({ id: assistantId, role: 'assistant', content: '', isStreaming: true });

    try {
      const { useAuthStore } = await import('../../store/auth-store');
      const token = useAuthStore.getState().accessToken;
      const currentMessages = useConversationStore.getState().messages;
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/ai/mentor/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: currentMessages.filter(m => m.id !== assistantId), // Send all messages except the empty assistant placeholder
          context: {
            sessionId: useConversationStore.getState().sessionId,
            ...(additionalContext || {})
          }
        })
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let current = "";

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunkText = decoder.decode(value, { stream: true });
            const lines = chunkText.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const dataStr = line.slice(6);
                if (dataStr === "[DONE]") {
                  done = true;
                  break;
                }
                try {
                  const data = JSON.parse(dataStr);
                  if (data.text) {
                    if (data.text.startsWith('__META__:')) {
                      try {
                        const meta = JSON.parse(data.text.slice(9));
                        if (meta.sessionId) {
                          useConversationStore.getState().setSessionId(meta.sessionId);
                        }
                      } catch (e) {}
                      continue;
                    }
                    current += data.text;
                    updateMessage(assistantId, current, true);
                  } else if (data.error) {
                    updateMessage(assistantId, "Error: " + data.error, false);
                    done = true;
                  }
                } catch (err) {}
              }
            }
          }
        }
      }

      updateMessage(assistantId, current, false);
      workspaceEvents.emit(EVENTS.ConversationCompleted, { messageId: assistantId, content: current });
    } catch (e) {
      console.error(e);
      updateMessage(assistantId, "Error generating response.", false);
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isGenerating) return;
    const text = input.trim();
    setInput('');
    sendMessage(text);
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full relative border-r border-[#E2E8F0]">
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4"
            >
              <div className="w-16 h-16 rounded-[20px] bg-gradient-to-tr from-[#6C5CE7]/10 to-[#8B7CF6]/10 border border-[#6C5CE7]/20 flex items-center justify-center mb-2 shadow-sm">
                <Sparkles className="text-[#6C5CE7]" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-[#1B1D35] tracking-tight">How can I help you learn today?</h1>
              <p className="text-[#718096] text-[14px] leading-relaxed">
                I'm your personalized AI mentor. We can review concepts, practice problems, or explore entirely new subjects.
              </p>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} onAction={sendMessage} />
            ))
          )}

        </AnimatePresence>
        <AIActionBar onAction={(text: string) => { setInput(text); setTimeout(() => handleSend(), 50); }} />
        
        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#F0E6FF] text-[#6C5CE7] border border-[#6C5CE7]/20">
               <Sparkles size={16} />
            </div>
            <div className="flex-1 py-1">
              <span className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#6C5CE7] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#6C5CE7] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#6C5CE7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </motion.div>
        )}
        
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className="p-4 bg-gradient-to-t from-white via-white to-transparent pt-10">
        <div className="max-w-3xl mx-auto relative group">
          <form onSubmit={handleSend} className="relative flex items-center shadow-[0_4px_20px_-5px_rgba(108,92,231,0.15)] rounded-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-white border border-[#E2E8F0] rounded-full py-4 pl-6 pr-14 text-[#1B1D35] placeholder-[#A0AEC0] focus:outline-none focus:ring-[3px] focus:ring-[#6C5CE7]/15 focus:border-[#6C5CE7] transition-all"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="absolute right-2 p-2.5 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] hover:shadow-lg hover:shadow-[#6C5CE7]/30 text-white disabled:opacity-50 disabled:hover:shadow-none transition-all"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center mt-3">
             <span className="text-[11px] font-medium text-[#A0AEC0]">AI can make mistakes. Verify important academic information.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const MessageBubbleComponent = ({ message, onAction }: { message: any, onAction: (text: string) => void }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-4 max-w-3xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-[#EDF2F7] text-[#4A5568]' : 'bg-[#F0E6FF] text-[#6C5CE7] border border-[#6C5CE7]/20'}`}>
        {isUser ? <span className="text-xs font-bold">U</span> : <Sparkles size={14} />}
      </div>
      
      <div className={`flex-1 space-y-2 ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-4 rounded-[20px] shadow-sm ${isUser ? 'bg-[#1B1D35] text-white rounded-tr-sm' : 'bg-white text-[#2D3748] border border-[#E2E8F0] rounded-tl-sm'}`}>
          {isUser ? (
            <p className="text-[14.5px] font-medium">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none text-current prose-p:leading-relaxed prose-pre:bg-[#F8F9FF] prose-pre:text-[#2D3748] prose-pre:border prose-pre:border-[#E2E8F0]">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                {(typeof message.content === 'string' ? message.content : JSON.stringify(message.content, null, 2)) || '...'}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-1.5 h-3 bg-[#6C5CE7] ml-1 animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>
        {!isUser && !message.isStreaming && (
          <MessageActions messageId={message.id} content={message.content} onAction={onAction} />
        )}
      </div>
    </motion.div>
  );
};

const MessageBubble = React.memo(MessageBubbleComponent);
