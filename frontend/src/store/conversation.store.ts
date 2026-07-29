import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming?: boolean;
}

interface ConversationState {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  createNewSession: () => void;

  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string, isStreaming?: boolean) => void;
  clearMessages: () => void;

  isGenerating: boolean;
  setGenerating: (generating: boolean) => void;
  
  contextData: any | null;
  setContextData: (data: any) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  sessionId: null,
  setSessionId: (id) => set({ sessionId: id }),
  createNewSession: () => set({ sessionId: null, messages: [] }),

  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  updateMessage: (id, content, isStreaming) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, content, isStreaming: isStreaming ?? m.isStreaming } : m)
  })),
  clearMessages: () => set({ messages: [] }),

  isGenerating: false,
  setGenerating: (generating) => set({ isGenerating: generating }),

  contextData: null,
  setContextData: (data) => set({ contextData: data })
}));
