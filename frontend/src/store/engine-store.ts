import { create } from 'zustand';
import { ConceptState, LearningDNA, TeachingStrategy } from '@/lib/engine/types';
import { ConfidenceEngine } from '@/lib/engine/ConfidenceEngine';
import { LearningProfileEngine } from '@/lib/engine/LearningProfileEngine';
import { TeachingStrategyEngine } from '@/lib/engine/TeachingStrategyEngine';
import { apiClient } from '@/lib/api-client';
import { queryClient } from '@/components/providers/QueryProvider';

// ─── Types ──────────────────────────────────────────────────────────────

export interface Note {
  id: string;
  text: string;
  title?: string;
  summary?: string;
  tags?: string[];
  folder?: string;
  isDraft?: boolean;
  isPinned?: boolean;
  versionCount?: number;
  updatedAt?: string;
}

export interface Bookmark {
  id: string;
  type: "concept" | "example" | "formula" | "question";
  content: string;
  note?: string;
  sectionId?: string;
  folder?: string;
  tags?: string[];
  color?: string;
  isPinned?: boolean;
  isFavorite?: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  status: string;
  deck?: string;
  tags?: string[];
  nextReviewAt?: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface TimelineItem {
  id: string;
  label: string;
  status: "completed" | "current" | "upcoming";
}

export interface Activity {
  id: string;
  type: string;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: Record<string, any>;
}

// ─── Store Interface ────────────────────────────────────────────────────

interface EngineState {
  // Global state (user-scoped, survives lesson switches)
  dna: LearningDNA;
  readingMode: "balanced" | "focused" | "revision";
  language: string;

  // Lesson-scoped state (disposed on lesson switch)
  currentLessonId: string | null;
  concepts: Record<string, ConceptState>;
  currentStrategy: TeachingStrategy;
  notes: Note[];
  bookmarks: Bookmark[];
  flashcards: Flashcard[];
  timeline: TimelineItem[];
  activities: Activity[];
  activeSectionId: string;
  visibleSections: Record<string, boolean>;
  isWorkspaceLoading: boolean;

  // Global actions
  setReadingMode: (mode: "balanced" | "focused" | "revision") => void;
  setLanguage: (lang: string) => void;

  // Lesson lifecycle
  initializeLesson: (lessonId: string, timelineItems: TimelineItem[]) => Promise<void>;
  disposeLesson: () => void;

  // Concept tracking
  initializeConcept: (id: string, title: string) => void;
  recordInteraction: (conceptId: string, type: "mastered" | "confused" | "analogy" | "challenge") => Promise<void>;
  determineStrategy: (requestType: string) => TeachingStrategy;

  // Workspace actions (lesson-scoped)
  addNote: (text: string, folder?: string, tags?: string[], isDraft?: boolean) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  removeNote: (id: string) => void;
  
  addBookmark: (type: Bookmark["type"], content: string, sectionId?: string, folder?: string, tags?: string[], color?: string) => void;
  updateBookmark: (id: string, data: Partial<Bookmark>) => void;
  removeBookmark: (id: string) => void;
  
  generateFlashcard: (front: string, back: string, deck?: string) => void;
  reviewFlashcard: (id: string, difficulty: "again" | "hard" | "good" | "easy") => void;
  updateTimelineStatus: (id: string, status: TimelineItem["status"]) => void;
  setActiveSectionId: (id: string) => void;
  setVisibleSection: (id: string, isVisible: boolean) => void;
}

// ─── Store ──────────────────────────────────────────────────────────────

export const useEngineStore = create<EngineState>((set, get) => ({
  // Global defaults
  dna: LearningProfileEngine.generateInitialDNA(),
  readingMode: "balanced",
  language: "English",

  // Lesson-scoped defaults (empty until a lesson initializes)
  currentLessonId: null,
  concepts: {},
  currentStrategy: "Explain Normally",
  notes: [],
  bookmarks: [],
  flashcards: [],
  timeline: [],
  activities: [],
  activeSectionId: "",
  visibleSections: {},
  isWorkspaceLoading: false,

  // ─── Global Actions ───────────────────────────────────────────────────
  setReadingMode: (mode) => set({ readingMode: mode }),
  setLanguage: async (lang) => {
    set({ language: lang });
    try {
      await apiClient.put("/auth/preferences", { preferredLanguageName: lang });
    } catch (error) {
      console.error("Failed to persist language preference", error);
    }
  },

  // ─── Lesson Lifecycle ─────────────────────────────────────────────────
  initializeLesson: async (lessonId, timelineItems) => {
    const prev = get().currentLessonId;
    if (prev === lessonId && get().notes.length > 0) return; // Already loaded

    // Dispose previous lesson state and set loading
    set({
      currentLessonId: lessonId,
      concepts: {},
      notes: [],
      bookmarks: [],
      flashcards: [],
      activities: [],
      timeline: timelineItems,
      activeSectionId: timelineItems[0]?.id || "",
      visibleSections: {},
      isWorkspaceLoading: true,
    });

    try {
      const [notesRes, bookmarksRes, flashcardsRes, dnaRes, timelineRes] = await Promise.all([
        apiClient.get(`/workspace/lessons/${lessonId}/notes`),
        apiClient.get(`/workspace/lessons/${lessonId}/bookmarks`),
        apiClient.get(`/workspace/lessons/${lessonId}/flashcards`),
        apiClient.get('/progress/dna'),
        apiClient.get(`/progress/timeline?lessonId=${lessonId}`),
      ]);

      set({
        notes: notesRes.data.data.notes || [],
        bookmarks: bookmarksRes.data.data.bookmarks || [],
        flashcards: flashcardsRes.data.data.flashcards || [],
        dna: dnaRes.data.data.dna || get().dna,
        activities: timelineRes.data.data.timeline || [],
        isWorkspaceLoading: false,
      });
    } catch (e) {
      // Gracefully degrade — workspace works offline with empty state
      set({ isWorkspaceLoading: false });
    }
  },

  disposeLesson: () => {
    set({
      currentLessonId: null,
      concepts: {},
      notes: [],
      bookmarks: [],
      flashcards: [],
      activities: [],
      timeline: [],
      activeSectionId: "",
      visibleSections: {},
    });
  },

  // ─── Concept Tracking ────────────────────────────────────────────────
  initializeConcept: (id, title) => set((state) => {
    if (state.concepts[id]) return state;
    return {
      concepts: {
        ...state.concepts,
        [id]: { id, title, confidence: "Exploring", interactions: 0 },
      },
    };
  }),

  recordInteraction: async (conceptId, type) => {
    const state = get();
    const lessonId = state.currentLessonId;
    if (!lessonId) return;

    const concept = state.concepts[conceptId];
    if (!concept) return;

    // Optimistic UI update
    let newConcept = concept;
    if (type === "mastered" || type === "confused" || type === "analogy") {
      newConcept = ConfidenceEngine.evaluateUnderstandingCheck(type, concept);
    }
    const newDNA = LearningProfileEngine.adaptDNA(state.dna, type);

    set({
      concepts: { ...state.concepts, [conceptId]: newConcept },
      dna: newDNA,
    });

    try {
      await apiClient.post(`/progress/lessons/${lessonId}/mastery`, { conceptId, type });
      await apiClient.put('/progress/dna', newDNA);
      // Invalidate queries so the dashboard and roadmap reflect the updated mastery/DNA
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
    } catch {
      // Optimistic update already applied
    }
  },

  determineStrategy: (requestType) => {
    const state = get();
    const strategy = TeachingStrategyEngine.determineStrategy(state.dna, requestType);
    set({ currentStrategy: strategy });
    return strategy;
  },

  // ─── Workspace Actions (Lesson-Scoped) ────────────────────────────────
  addNote: async (text, folder, tags, isDraft) => {
    const lessonId = get().currentLessonId;
    if (!lessonId) return;

    const tempId = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      notes: [{ id: tempId, text, summary: "Saving...", tags: tags || [], folder, isDraft }, ...state.notes],
    }));

    try {
      const res = await apiClient.post(`/workspace/lessons/${lessonId}/notes`, { text, folder, tags, isDraft });
      set((state) => {
        if (state.currentLessonId !== lessonId) return state;
        return { notes: state.notes.map((n) => (n.id === tempId ? res.data.data.note : n)) };
      });
    } catch {
      // Keep optimistic entry
    }
  },

  updateNote: async (id, data) => {
    const lessonId = get().currentLessonId;
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    }));
    try {
      const res = await apiClient.put(`/workspace/notes/${id}`, data);
      set((state) => {
        if (state.currentLessonId !== lessonId) return state;
        return { notes: state.notes.map((n) => (n.id === id ? res.data.data.note : n)) };
      });
    } catch {
      // Silent failure
    }
  },

  removeNote: async (id) => {
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    }));
    try {
      await apiClient.delete(`/workspace/notes/${id}`);
    } catch {
      // Silent failure
    }
  },

  addBookmark: async (type, content, sectionId, folder, tags, color) => {
    const lessonId = get().currentLessonId;
    if (!lessonId) return;

    const tempId = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      bookmarks: [{ id: tempId, type, content, sectionId, folder, tags, color }, ...state.bookmarks],
    }));

    try {
      const res = await apiClient.post(`/workspace/lessons/${lessonId}/bookmarks`, { type, content, sectionId, folder, tags, color });
      set((state) => {
        if (state.currentLessonId !== lessonId) return state;
        return { bookmarks: state.bookmarks.map((b) => (b.id === tempId ? res.data.data.bookmark : b)) };
      });
    } catch {
      // Keep optimistic entry
    }
  },

  updateBookmark: async (id, data) => {
    const lessonId = get().currentLessonId;
    set((state) => ({
      bookmarks: state.bookmarks.map((b) => (b.id === id ? { ...b, ...data } : b)),
    }));
    try {
      const res = await apiClient.patch(`/workspace/bookmarks/${id}`, data);
      set((state) => {
        if (state.currentLessonId !== lessonId) return state;
        return { bookmarks: state.bookmarks.map((b) => (b.id === id ? res.data.data.bookmark : b)) };
      });
    } catch {
      // Silent failure
    }
  },

  removeBookmark: async (id) => {
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.id !== id),
    }));
    try {
      await apiClient.delete(`/workspace/bookmarks/${id}`);
    } catch {
      // Silent failure
    }
  },

  generateFlashcard: async (front, back, deck) => {
    const lessonId = get().currentLessonId;
    if (!lessonId) return;

    const tempId = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      flashcards: [...state.flashcards, { id: tempId, front, back, status: "new", deck, tags: [], easeFactor: 2.5, interval: 0, repetitions: 0 }],
    }));

    try {
      const res = await apiClient.post(`/workspace/lessons/${lessonId}/flashcards/generate`, { front, back, deck });
      set((state) => {
        if (state.currentLessonId !== lessonId) return state;
        return { flashcards: state.flashcards.map((f) => (f.id === tempId ? res.data.data.flashcard : f)) };
      });
    } catch {
      // Keep optimistic entry
    }
  },

  reviewFlashcard: async (id, difficulty) => {
    const lessonId = get().currentLessonId;
    try {
      const res = await apiClient.put(`/workspace/flashcards/${id}/review`, { difficulty });
      set((state) => {
        if (state.currentLessonId !== lessonId) return state;
        return { flashcards: state.flashcards.map((f) => (f.id === id ? res.data.data.flashcard : f)) };
      });
    } catch {
      // Silent failure
    }
  },

  updateTimelineStatus: (id, status) => set((state) => ({
    timeline: state.timeline.map((item) => (item.id === id ? { ...item, status } : item)),
  })),

  setActiveSectionId: (id) => set((state) => {
    const activeIndex = state.timeline.findIndex(item => item.id === id);
    const oldIndex = state.timeline.findIndex(item => item.id === state.activeSectionId);
    
    const newTimeline = state.timeline.map((item, index) => {
      if (activeIndex !== -1) {
        if (index === activeIndex) return { ...item, status: "current" as const };
        if (index < activeIndex) return { ...item, status: "completed" as const };
        if (index === oldIndex) return { ...item, status: "completed" as const };
      } else {
        if (index === oldIndex || item.id === state.activeSectionId) return { ...item, status: "completed" as const };
      }
      return item;
    });

    return { activeSectionId: id, timeline: newTimeline };
  }),

  setVisibleSection: (id, isVisible) => set((state) => {
    const newVisible = { ...state.visibleSections, [id]: isVisible };
    
    let newActiveId = state.activeSectionId;
    for (const item of state.timeline) {
      if (newVisible[item.id]) {
        newActiveId = item.id;
        break;
      }
    }
    
    if (newActiveId === state.activeSectionId) {
      return { visibleSections: newVisible };
    }

    const activeIndex = state.timeline.findIndex(item => item.id === newActiveId);
    const oldIndex = state.timeline.findIndex(item => item.id === state.activeSectionId);
    
    const newTimeline = state.timeline.map((item, index) => {
      if (activeIndex !== -1) {
        if (index === activeIndex) return { ...item, status: "current" as const };
        if (index < activeIndex) return { ...item, status: "completed" as const };
        if (index === oldIndex) return { ...item, status: "completed" as const };
      } else {
        if (index === oldIndex || item.id === state.activeSectionId) return { ...item, status: "completed" as const };
      }
      return item;
    });

    return { visibleSections: newVisible, activeSectionId: newActiveId, timeline: newTimeline };
  }),
}));
