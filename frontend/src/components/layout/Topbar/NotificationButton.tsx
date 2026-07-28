"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNotificationStore } from "@/store/notification.store";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, getUnreadCount, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const unreadCount = getUnreadCount();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors text-[#6B7280] hover:text-[#1B1D35]"
      >
        <Bell className="w-5 h-5" />
        {/* Active Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#FC8181] rounded-full border-2 border-[#F8F9FF]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAllAsRead()}
                    className="p-1.5 text-gray-500 hover:text-[#6C5CE7] hover:bg-[#F0E6FF] rounded-lg transition-colors"
                    title="Mark all as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={() => clearAll()}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Clear all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No notifications right now.
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => !n.read && markAsRead(n.id)}
                      className={`text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.read ? "bg-[#F8F9FF]" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-semibold ${!n.read ? "text-[#1B1D35]" : "text-gray-600"}`}>
                          {n.title}
                        </span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#6C5CE7] mt-1.5 shrink-0" />
                        )}
                      </div>
                      <p className={`text-xs ${!n.read ? "text-gray-600" : "text-gray-500"}`}>
                        {n.message}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-2 block">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
