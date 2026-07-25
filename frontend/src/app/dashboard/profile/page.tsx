"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { User, Mail, Globe, MapPin, Calendar, Clock, Edit2, Save, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const profileData = (user as any)?.profile;

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(profileData?.bio || "Physics enthusiast preparing for JEE.");
  const [country, setCountry] = useState(profileData?.country || "India");
  const [timezone, setTimezone] = useState(profileData?.timezone || "Asia/Kolkata (IST)");

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { fullName: string; bio: string; country: string; timezone: string }) => {
      const res = await apiClient.put("/auth/profile", payload);
      return res.data.data.user;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setIsEditing(false);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ fullName, bio, country, timezone });
  };

  return (
    <PageContainer>
      <ContentArea>
        <DashboardShell>
          <div className="col-span-full xl:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[28px] font-bold text-[#1B1D35]">My Profile</h1>
                <p className="text-[15px] text-[#A0AEC0] mt-1">Manage your personal information and learning identity.</p>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-[#4A5568] rounded-xl hover:bg-[#F8F9FF] transition-colors shadow-sm"
              >
                <Edit2 className="w-4 h-4" />
                <span className="font-semibold text-[14px]">{isEditing ? "Cancel" : "Edit Profile"}</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-[#6C5CE7] to-[#00C6FF]" />
              <div className="px-8 pb-8 relative">
                <div className="absolute -top-12 left-8 w-24 h-24 rounded-full border-4 border-white bg-[#F0E6FF] flex items-center justify-center shadow-md">
                  <span className="text-[36px] font-extrabold text-[#6C5CE7]">
                    {user?.fullName?.charAt(0) || "U"}
                  </span>
                </div>
                
                <div className="mt-16 flex justify-between items-start">
                  <div>
                    <h2 className="text-[24px] font-bold text-[#1B1D35]">{user?.fullName || "Student User"}</h2>
                    <p className="text-[#A0AEC0] flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" /> {user?.email || "student@example.com"}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-[#F0E6FF] text-[#6C5CE7] rounded-full text-[13px] font-bold uppercase tracking-wider">
                    Pro Learner
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="mt-8 space-y-6 border-t border-[#E2E8F0] pt-6">
                    <div>
                      <label className="block text-[13px] font-bold text-[#4A5568] mb-2">Display Name</label>
                      <input 
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all text-[14px]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-[#4A5568] mb-2">Bio</label>
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all text-[14px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-bold text-[#4A5568] mb-2">Country</label>
                        <input 
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all text-[14px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-[#4A5568] mb-2">Timezone</label>
                        <input 
                          type="text"
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all text-[14px]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-[#4A5568] font-bold text-[14px] hover:bg-[#F8F9FF]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#6C5CE7] text-white rounded-xl font-bold text-[14px] hover:bg-[#5A4BCC] transition-colors"
                      >
                        {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-[13px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-4">About</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F8F9FF] flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-[#4A5568]" />
                          </div>
                          <div>
                            <p className="text-[12px] text-[#A0AEC0]">Bio</p>
                            <p className="text-[#1B1D35] font-medium text-[14px]">{profileData?.bio || bio}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F8F9FF] flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-[#4A5568]" />
                          </div>
                          <div>
                            <p className="text-[12px] text-[#A0AEC0]">Joined</p>
                            <p className="text-[#1B1D35] font-medium text-[14px]">
                              {(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "August 2026"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[13px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-4">Location & Time</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F8F9FF] flex items-center justify-center shrink-0">
                            <Globe className="w-5 h-5 text-[#4A5568]" />
                          </div>
                          <div>
                            <p className="text-[12px] text-[#A0AEC0]">Country</p>
                            <p className="text-[#1B1D35] font-medium text-[14px]">{profileData?.country || country}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F8F9FF] flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-[#4A5568]" />
                          </div>
                          <div>
                            <p className="text-[12px] text-[#A0AEC0]">Timezone</p>
                            <p className="text-[#1B1D35] font-medium text-[14px]">{profileData?.timezone || timezone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </DashboardShell>
      </ContentArea>
    </PageContainer>
  );
}
