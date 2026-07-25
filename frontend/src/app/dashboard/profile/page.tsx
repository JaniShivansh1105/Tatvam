"use client";

import React, { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { User, Mail, Globe, Calendar, Clock, Edit2, Save, Loader2, Sparkles, Award, GraduationCap, BookOpen, Target, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { apiClient } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const profileData = (user as any)?.profile;

  // Keystroke live avatar preview state
  const [previewName, setPreviewName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(profileData?.bio || "Physics enthusiast preparing for competitive exams.");
  const [country, setCountry] = useState(profileData?.country || "India");
  const [timezone, setTimezone] = useState(profileData?.timezone || "Asia/Kolkata (IST)");
  const [language, setLanguage] = useState((user as any)?.preference?.language?.name || "English");

  // Synchronize when user state changes externally
  useEffect(() => {
    if (user?.fullName) {
      setPreviewName(user.fullName);
    }
  }, [user?.fullName]);

  // Fetch Achievements data for complete student identity
  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const res = await apiClient.get("/content/achievements");
      return res.data.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { fullName: string; bio: string; country: string; timezone: string }) => {
      const res = await apiClient.put("/auth/profile", payload);
      await apiClient.put("/auth/preferences", { preferredLanguageName: language });
      return res.data.data.user;
    },
    onMutate: async (newPayload) => {
      // Snapshot previous user for rollback
      const previousUser = user;
      setErrorMessage(null);
      
      // Optimistically update Zustand and React Query
      if (user) {
        setUser({
          ...user,
          fullName: newPayload.fullName,
        });
      }
      return { previousUser };
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      setIsEditing(false);
    },
    onError: (err: any, _newPayload, context) => {
      // Rollback on error
      if (context?.previousUser) {
        setUser(context.previousUser);
        setPreviewName(context.previousUser.fullName);
      }
      setErrorMessage("Failed to update profile. Changes have been rolled back.");
    },
  });

  const handleCancel = () => {
    // Revert form state and live avatar preview to original user values
    setPreviewName(user?.fullName || "");
    setBio(profileData?.bio || "Physics enthusiast preparing for competitive exams.");
    setCountry(profileData?.country || "India");
    setTimezone(profileData?.timezone || "Asia/Kolkata (IST)");
    setErrorMessage(null);
    setIsEditing(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ fullName: previewName, bio, country, timezone });
  };

  return (
    <PageContainer>
      <ContentArea>
        <DashboardShell>
          <div className="col-span-full xl:col-span-8 flex flex-col gap-6">
            
            {/* Header Title Bar */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[28px] font-bold text-[#1B1D35] tracking-tight">Student Identity</h1>
                <p className="text-[15px] text-[#A0AEC0] mt-1">Manage your academic profile, avatar, and learning preferences.</p>
              </div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E2E8F0] text-[#1B1D35] rounded-2xl hover:bg-[#F8F9FF] hover:border-[#6C5CE7]/40 transition-all shadow-sm font-semibold text-[14px]"
                >
                  <Edit2 className="w-4 h-4 text-[#6C5CE7]" />
                  <span>Edit Identity</span>
                </button>
              ) : (
                <button 
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#FFF5F5] border border-[#FED7D7] text-[#E53E3E] rounded-2xl hover:bg-[#FEEBC8] transition-all font-semibold text-[14px]"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {/* Error Rollback Banner */}
            {errorMessage && (
              <div className="p-4 bg-[#FFF5F5] border border-[#FED7D7] rounded-2xl text-[#E53E3E] text-[14px] font-medium flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Profile Card Shell */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden transition-all">
              
              {/* Premium Gradient Banner */}
              <div className="h-44 md:h-52 bg-gradient-to-r from-[#6C5CE7] via-[#8B7CF6] to-[#00C6FF] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]" />
                <div className="absolute bottom-4 right-6 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-[12px] font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" /> Adaptive DNA Active
                </div>
              </div>

              {/* Profile Body with Overlapping Avatar */}
              <div className="px-6 md:px-10 pb-10 relative">
                
                {/* Overlapping Live Avatar Preview */}
                <div className="absolute -top-16 left-6 md:left-10 z-10">
                  <div className="p-1.5 bg-white rounded-full shadow-xl">
                    <UserAvatar 
                      name={previewName} 
                      email={user?.email} 
                      userId={user?.id} 
                      size="2xl"
                    />
                  </div>
                </div>

                {/* Top Profile Summary Bar */}
                <div className="pt-16 md:pt-16 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-[26px] font-extrabold text-[#1B1D35] tracking-tight">{previewName || "Student User"}</h2>
                      <span className="px-3 py-1 bg-[#F0E6FF] text-[#6C5CE7] rounded-full text-[12px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Level {achievements?.level || 1} Student
                      </span>
                    </div>
                    <p className="text-[#A0AEC0] flex items-center gap-2 mt-1.5 text-[14px]">
                      <Mail className="w-4 h-4 text-[#A0AEC0]" /> {user?.email || "student@example.com"}
                    </p>
                  </div>
                </div>

                {/* Interactive Content View / Edit Mode */}
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.form 
                      key="edit-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSave} 
                      className="mt-8 space-y-6"
                    >
                      <div>
                        <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">
                          Display Name (Live Avatar Preview)
                        </label>
                        <input 
                          type="text"
                          value={previewName}
                          onChange={(e) => setPreviewName(e.target.value)}
                          placeholder="Enter your name..."
                          className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 outline-none transition-all text-[14px] font-medium text-[#1B1D35]"
                          required
                        />
                        <p className="text-[12px] text-[#6C5CE7] font-semibold mt-1.5">
                          Notice your SVG avatar preview updates live on every keystroke!
                        </p>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Bio & Academic Summary</label>
                        <textarea 
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 outline-none transition-all text-[14px] font-medium text-[#1B1D35] resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Country</label>
                          <input 
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all text-[14px] font-medium text-[#1B1D35]"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Timezone</label>
                          <input 
                            type="text"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all text-[14px] font-medium text-[#1B1D35]"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Language</label>
                          <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all text-[14px] font-medium text-[#1B1D35]"
                          >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Spanish">Spanish</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-5 py-2.5 rounded-2xl border border-[#E2E8F0] text-[#4A5568] font-bold text-[14px] hover:bg-[#F8F9FF] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          className="flex items-center gap-2 px-6 py-2.5 bg-[#6C5CE7] text-white rounded-2xl font-bold text-[14px] hover:bg-[#5A4BCC] transition-all shadow-md"
                        >
                          {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save Changes
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="view-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                      {/* Academic & Personal Overview */}
                      <div>
                        <h3 className="text-[12px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-5">Academic & Personal Profile</h3>
                        <div className="space-y-5">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#F8F9FF] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#6C5CE7]">
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[12px] text-[#A0AEC0] font-bold uppercase tracking-wide">Academic Summary</p>
                              <p className="text-[#1B1D35] font-medium text-[15px] mt-0.5 leading-relaxed">{profileData?.bio || bio}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#F8F9FF] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#6C5CE7]">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[12px] text-[#A0AEC0] font-bold uppercase tracking-wide">Language & Timezone</p>
                              <p className="text-[#1B1D35] font-medium text-[15px] mt-0.5">{language} • {profileData?.timezone || timezone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#F8F9FF] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#6C5CE7]">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[12px] text-[#A0AEC0] font-bold uppercase tracking-wide">Member Since</p>
                              <p className="text-[#1B1D35] font-medium text-[15px] mt-0.5">
                                {(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "August 2026"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Location & Learning Stats */}
                      <div>
                        <h3 className="text-[12px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-5">Learning Progress</h3>
                        <div className="space-y-5">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#F8F9FF] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#6C5CE7]">
                              <Globe className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[12px] text-[#A0AEC0] font-bold uppercase tracking-wide">Country</p>
                              <p className="text-[#1B1D35] font-medium text-[15px] mt-0.5">{profileData?.country || country}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#F8F9FF] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#6C5CE7]">
                              <Target className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[12px] text-[#A0AEC0] font-bold uppercase tracking-wide">Experience & Level</p>
                              <p className="text-[#1B1D35] font-medium text-[15px] mt-0.5">
                                Level {achievements?.level || 1} ({achievements?.xp || 0} XP)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </div>
        </DashboardShell>
      </ContentArea>
    </PageContainer>
  );
}
