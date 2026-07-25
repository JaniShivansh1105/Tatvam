"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2, Circle, Bookmark as BookmarkIcon, Search, Filter, MoreVertical, Edit3, Trash2, Pin, Star, Archive, RefreshCw, Folder } from "lucide-react";
import { useEngineStore, Bookmark } from "@/store/engine-store";
import { motion, AnimatePresence } from "framer-motion";

export function StudySidebarLeft() {
  const { timeline, activities, bookmarks, activeSectionId, updateBookmark, removeBookmark } = useEngineStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // derived state for bookmarks
  const filteredBookmarks = useMemo(() => {
    let result = bookmarks;

    if (searchQuery) {
      result = result.filter(b => 
        b.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (b.note && b.note.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterType !== "all") {
      result = result.filter(b => {
        if (filterType === "favorites") return b.isFavorite;
        if (filterType === "pinned") return b.isPinned;
        return b.type === filterType;
      });
    }

    // Sort: Pinned first, then by date (assuming id represents insertion order roughly if no date)
    result = [...result].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    return result;
  }, [bookmarks, searchQuery, filterType]);

  const paginatedBookmarks = filteredBookmarks.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginatedBookmarks.length < filteredBookmarks.length;

  const handleEditSave = (id: string) => {
    updateBookmark(id, { note: editNoteText });
    setEditingId(null);
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 pr-4 overflow-y-auto custom-scrollbar pb-10">
      
      {/* Study Timeline */}
      <div className="flex flex-col gap-4">
        <h4 className="text-[13px] font-bold text-[#1B1D35] uppercase tracking-wider">Today&apos;s Journey</h4>
        <div className="flex flex-col gap-3 relative before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-[#E2E8F0] z-0">
          {timeline.map((item) => {
            const isCurrent = activeSectionId === item.id;
            const isCompleted = item.status === "completed";
            
            return (
              <button 
                key={item.id} 
                onClick={() => scrollToSection(item.id)}
                className="flex items-start gap-3 relative z-10 bg-[#F8F9FF] group text-left w-full"
              >
                <div className="mt-0.5 bg-[#F8F9FF] py-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-[#48BB78] bg-white rounded-full group-hover:scale-110 transition-transform" />
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-[#6C5CE7] border-4 border-[#F8F9FF] flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </div>
                  ) : (
                    <Circle className="w-6 h-6 text-[#CBD5E0] bg-white rounded-full group-hover:text-[#A0AEC0] transition-colors" />
                  )}
                </div>
                <span className={`text-[14px] mt-1 transition-colors ${
                  isCurrent ? "font-bold text-[#6C5CE7]" : 
                  isCompleted ? "text-[#4A5568] group-hover:text-[#1B1D35]" : 
                  "text-[#A0AEC0] group-hover:text-[#4A5568]"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex flex-col gap-4">
        <h4 className="text-[13px] font-bold text-[#1B1D35] uppercase tracking-wider">Recent Activity</h4>
        {activities.length === 0 ? (
          <p className="text-[13px] text-[#A0AEC0]">No activity recorded yet.</p>
        ) : (
          <div className="flex flex-col gap-3 border-l-2 border-[#E2E8F0] ml-2 pl-3">
            {activities.slice(0, 5).map(act => (
              <div key={act.id} className="flex flex-col gap-0.5">
                <span className="text-[12px] font-bold text-[#4A5568] capitalize">
                  {act.type.replace(/_/g, " ").toLowerCase()}
                </span>
                <span className="text-[10px] text-[#A0AEC0]">
                  {new Date(act.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarks Complete CRUD UI */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-[13px] font-bold text-[#1B1D35] uppercase tracking-wider">Your Bookmarks</h4>
          <span className="text-[11px] font-medium text-[#6C5CE7] bg-[#6C5CE7]/10 px-2 py-0.5 rounded-full">
            {bookmarks.length} Total
          </span>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
            <input 
              type="text" 
              placeholder="Search bookmarks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-[13px] bg-white border border-[#E2E8F0] rounded-lg outline-none focus:border-[#6C5CE7] transition-colors shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {["all", "favorites", "pinned", "concept", "example"].map(f => (
              <button 
                key={f}
                onClick={() => setFilterType(f)}
                className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0 transition-colors ${filterType === f ? "bg-[#1B1D35] text-white" : "bg-white border border-[#E2E8F0] text-[#718096] hover:bg-[#F8F9FF]"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#E2E8F0] rounded-xl bg-white/50">
            <BookmarkIcon className="w-8 h-8 text-[#CBD5E0] mb-2" />
            <p className="text-[13px] font-medium text-[#4A5568]">No bookmarks found</p>
            <p className="text-[11px] text-[#A0AEC0] mt-1">Highlight text in the lesson to save concepts.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {paginatedBookmarks.map((bm) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={bm.id} 
                  className={`p-3 bg-white border rounded-xl shadow-sm group transition-all relative ${bm.isPinned ? "border-[#6C5CE7]/40 ring-1 ring-[#6C5CE7]/10" : "border-[#E2E8F0] hover:border-[#6C5CE7]/60"}`}
                >
                  
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-[#6C5CE7] bg-[#6C5CE7]/10 px-1.5 py-0.5 rounded">
                        <BookmarkIcon className="w-3 h-3" />
                        {bm.type}
                      </span>
                      {bm.folder && (
                        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-[#4A5568] bg-[#F1F5F9] px-1.5 py-0.5 rounded">
                          <Folder className="w-3 h-3" />
                          {bm.folder}
                        </span>
                      )}
                    </div>
                    
                    {/* Action Menu Menu */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => updateBookmark(bm.id, { isFavorite: !bm.isFavorite })}
                        className={`p-1 rounded hover:bg-[#F8F9FF] transition-colors ${bm.isFavorite ? "text-[#ED8936]" : "text-[#CBD5E0] opacity-0 group-hover:opacity-100"}`}
                      >
                        <Star className="w-3.5 h-3.5" fill={bm.isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => updateBookmark(bm.id, { isPinned: !bm.isPinned })}
                        className={`p-1 rounded hover:bg-[#F8F9FF] transition-colors ${bm.isPinned ? "text-[#6C5CE7]" : "text-[#CBD5E0] opacity-0 group-hover:opacity-100"}`}
                      >
                        <Pin className="w-3.5 h-3.5" fill={bm.isPinned ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingId(bm.id);
                          setEditNoteText(bm.note || "");
                        }}
                        className="p-1 rounded hover:bg-[#F8F9FF] transition-colors text-[#CBD5E0] hover:text-[#1B1D35] opacity-0 group-hover:opacity-100"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => removeBookmark(bm.id)}
                        className="p-1 rounded hover:bg-[#FFF5F5] transition-colors text-[#CBD5E0] hover:text-[#E53E3E] opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[13px] text-[#2D3748] font-medium leading-relaxed mb-2">{bm.content}</p>
                  
                  {editingId === bm.id ? (
                    <div className="mt-3 flex flex-col gap-2">
                      <textarea
                        value={editNoteText}
                        onChange={(e) => setEditNoteText(e.target.value)}
                        placeholder="Add a personal note..."
                        className="w-full text-[12px] bg-[#F8F9FF] border border-[#E2E8F0] rounded p-2 outline-none focus:border-[#6C5CE7] min-h-[60px] resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="text-[11px] font-semibold text-[#718096] px-2 py-1">Cancel</button>
                        <button onClick={() => handleEditSave(bm.id)} className="text-[11px] font-semibold text-white bg-[#1B1D35] px-3 py-1 rounded">Save</button>
                      </div>
                    </div>
                  ) : (
                    bm.note && (
                      <div className="mt-2 bg-[#F8F9FF] p-2.5 rounded-lg border border-[#E2E8F0]/60 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#6C5CE7] rounded-l-lg" />
                        <p className="text-[12px] text-[#4A5568] italic">{bm.note}</p>
                      </div>
                    )
                  )}

                  {bm.tags && bm.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {bm.tags.map(t => (
                        <span key={t} className="text-[10px] font-medium text-[#718096] bg-[#EDF2F7] px-1.5 py-0.5 rounded">#{t}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        const { generateFlashcard } = useEngineStore.getState();
                        generateFlashcard(bm.content, bm.note || "Define this concept.");
                      }}
                      className="text-[10px] font-bold text-[#6C5CE7] hover:text-[#5A4BDB] uppercase tracking-wider bg-[#6C5CE7]/10 hover:bg-[#6C5CE7]/20 px-2 py-1 rounded transition-colors ml-auto"
                    >
                      Create Card
                    </button>
                  </div>
                  
                </motion.div>
              ))}
            </AnimatePresence>

            {hasMore && (
              <button 
                onClick={() => setPage(p => p + 1)}
                className="w-full py-2 bg-white border border-[#E2E8F0] rounded-xl text-[12px] font-semibold text-[#4A5568] hover:bg-[#F8F9FF] hover:border-[#CBD5E0] transition-colors"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
