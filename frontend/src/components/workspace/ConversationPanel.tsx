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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userText = input.trim();
    setInput('');
    addMessage({ id: Date.now().toString(), role: 'user', content: userText });
    setGenerating(true);

    const assistantId = (Date.now() + 1).toString();
    addMessage({ id: assistantId, role: 'assistant', content: '', isStreaming: true });

    try {
      // Simulate typing for demo
      let fakeText = "Based on your Learning DNA, I suggest we break this down into smaller visual chunks. Let's explore Graph Traversal step-by-step.";
      let current = "";
      for (let i = 0; i < fakeText.length; i++) {
        current += fakeText[i];
        updateMessage(assistantId, current, true);
        await new Promise(r => setTimeout(r, 15));
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

  return (
    <div className="flex-1 flex flex-col bg-slate-950 h-full relative">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/10 flex items-center justify-center mb-2 shadow-lg shadow-indigo-500/5">
                <Sparkles className="text-indigo-400" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">How can I help you learn today?</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                I'm your personalized AI mentor. We can review concepts, practice problems, or explore entirely new subjects.
              </p>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
        </AnimatePresence>
        
        <AIActionBar />
        
        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-500/20 text-indigo-400">
               <Sparkles size={16} />
            </div>
            <div className="flex-1 py-1">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </motion.div>
        )}
        
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className="p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-10">
        <div className="max-w-3xl mx-auto relative group">
          <form onSubmit={handleSend} className="relative flex items-center shadow-2xl shadow-indigo-500/5 rounded-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-slate-900 border border-slate-700/50 rounded-full py-4 pl-6 pr-14 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="absolute right-2 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center mt-3">
             <span className="text-[11px] font-medium text-slate-500">AI can make mistakes. Verify important academic information.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ message }: { message: any }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-4 max-w-3xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-slate-800' : 'bg-indigo-500/20 text-indigo-400'}`}>
        {isUser ? <span className="text-xs font-bold text-slate-300">U</span> : <Sparkles size={16} />}
      </div>
      
      <div className={`flex-1 space-y-2 ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-4 rounded-2xl ${isUser ? 'bg-slate-800 text-white rounded-tr-sm' : 'bg-transparent text-slate-200'}`}>
          {isUser ? (
            <p className="text-[15px]">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-slate-800 max-w-none text-[15px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content || '...'}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 bg-indigo-400 ml-1 animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>
        {!isUser && !message.isStreaming && (
          <MessageActions messageId={message.id} content={message.content} />
        )}
      </div>
    </motion.div>
  );
};
