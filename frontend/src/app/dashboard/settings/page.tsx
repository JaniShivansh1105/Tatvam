"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Settings, Bell, Lock, Shield, Moon, Eye, LogOut, Check, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useShallow } from "zustand/react/shallow";
import { useEngineStore } from "@/store/engine-store";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { useNotificationStore } from "@/store/notification.store";

export default function SettingsPage() {
  const { user, logout, setUser } = useAuthStore(useShallow(state => ({
    user: state.user,
    logout: state.logout,
    setUser: state.setUser
  })));
  const setEngineLanguage = useEngineStore(s => s.setLanguage);
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("general");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    (user as any)?.preference?.notificationsEnabled ?? true
  );
  const [preferredLanguage, setPreferredLanguage] = useState(
    (user as any)?.profile?.preferredLanguage || "English"
  );
  const [nativeLanguage, setNativeLanguage] = useState(
    (user as any)?.profile?.nativeLanguage || ""
  );
  const [secondaryLanguage, setSecondaryLanguage] = useState(
    (user as any)?.profile?.secondaryLanguage || ""
  );
  const [theme, setTheme] = useState(
    (user as any)?.preference?.theme || "LIGHT"
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const updatePreferencesMutation = useMutation({
    mutationFn: async (payload: { notificationsEnabled?: boolean; theme?: string }) => {
      const res = await apiClient.put("/auth/preferences", payload);
      return res.data.data.preference;
    },
    onSuccess: (updatedPreference) => {
      if (user) setUser({ ...user, preference: updatedPreference });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { preferredLanguage?: string; nativeLanguage?: string; secondaryLanguage?: string }) => {
      const res = await apiClient.put("/auth/profile", payload);
      return res.data.data.user.profile;
    },
    onSuccess: (updatedProfile) => {
      if (user) setUser({ ...user, profile: updatedProfile });
      if (updatedProfile.preferredLanguage) setEngineLanguage(updatedProfile.preferredLanguage);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    },
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const { addNotification } = useNotificationStore();

  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    updatePreferencesMutation.mutate({ notificationsEnabled: checked });
    if (checked) {
      addNotification(
        "Reminders Enabled",
        "You will now receive daily learning reminders to help you stay on track!"
      );
    }
  };

  const handleLanguageChange = (field: 'preferred' | 'native' | 'secondary', lang: string) => {
    if (field === 'preferred') {
      setPreferredLanguage(lang);
      updateProfileMutation.mutate({ preferredLanguage: lang });
    } else if (field === 'native') {
      setNativeLanguage(lang);
      updateProfileMutation.mutate({ nativeLanguage: lang });
    } else if (field === 'secondary') {
      setSecondaryLanguage(lang);
      updateProfileMutation.mutate({ secondaryLanguage: lang });
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    updatePreferencesMutation.mutate({ theme: newTheme });
  };

  const tabs = [
    { id: "general", label: "General", icon: <Settings className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "privacy", label: "Privacy & Security", icon: <Shield className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Moon className="w-4 h-4" /> },
  ];

  return (
    <PageContainer>
      <ContentArea>
        <DashboardShell>
          <div className="col-span-full xl:col-span-3">
            <h1 className="text-[28px] font-bold text-[#1B1D35] mb-6">Settings</h1>
            
            <div className="flex flex-col gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-medium text-[15px] ${
                    activeTab === tab.id 
                      ? "bg-[#6C5CE7] text-white shadow-md" 
                      : "bg-transparent text-[#4A5568] hover:bg-[#F8F9FF]"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              
              <div className="h-px bg-[#E2E8F0] my-2 mx-4" />
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-medium text-[15px] text-[#E53E3E] hover:bg-[#FFF5F5]"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="col-span-full xl:col-span-9 pt-0 xl:pt-[72px]">
            <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] min-h-[500px] relative">
              
              {savedSuccess && (
                <div className="absolute top-6 right-8 flex items-center gap-2 bg-[#F0FFF4] text-[#38A169] px-4 py-2 rounded-xl text-[13px] font-bold border border-[#C6F6D5] animate-in fade-in duration-300">
                  <Check className="w-4 h-4" /> Preferences saved!
                </div>
              )}

              {activeTab === "general" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-[20px] font-bold text-[#1B1D35] mb-6 border-b pb-4">General Settings</h2>
                  
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <label className="block text-[13px] font-bold text-[#4A5568] mb-2">Display Name</label>
                      <input 
                        type="text" 
                        value={user?.fullName || ""} 
                        disabled 
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-gray-50 text-[#4A5568] outline-none cursor-not-allowed text-[14px]" 
                      />
                      <p className="text-[12px] text-[#A0AEC0] mt-2">Edit display name in your Profile page.</p>
                    </div>
                    
                    <div>
                      <label className="block text-[13px] font-bold text-[#4A5568] mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={user?.email || ""} 
                        disabled 
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-gray-50 text-[#A0AEC0] outline-none cursor-not-allowed text-[14px]" 
                      />
                      <p className="text-[12px] text-[#A0AEC0] mt-2">Contact support to change your email address.</p>
                    </div>

                    <div className="pt-4 border-t border-[#E2E8F0]">
                      <h3 className="text-[16px] font-bold text-[#1B1D35] mb-4">Language Preferences</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[13px] font-bold text-[#4A5568] mb-2">Preferred Language (AI Explanations)</label>
                          <select 
                            value={preferredLanguage}
                            onChange={(e) => handleLanguageChange('preferred', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all text-[14px]"
                          >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Gujarati">Gujarati</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[13px] font-bold text-[#4A5568] mb-2">Native Language</label>
                            <select 
                              value={nativeLanguage}
                              onChange={(e) => handleLanguageChange('native', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all text-[14px]"
                            >
                              <option value="">None</option>
                              <option value="English">English</option>
                              <option value="Hindi">Hindi</option>
                              <option value="Gujarati">Gujarati</option>
                              <option value="Spanish">Spanish</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[13px] font-bold text-[#4A5568] mb-2">Secondary Language</label>
                            <select 
                              value={secondaryLanguage}
                              onChange={(e) => handleLanguageChange('secondary', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all text-[14px]"
                            >
                              <option value="">None</option>
                              <option value="English">English</option>
                              <option value="Hindi">Hindi</option>
                              <option value="Gujarati">Gujarati</option>
                              <option value="Spanish">Spanish</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-[20px] font-bold text-[#1B1D35] mb-6 border-b pb-4">Notification Preferences</h2>
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-xl">
                      <div>
                        <h4 className="font-bold text-[#1B1D35]">Daily Learning Reminders</h4>
                        <p className="text-[13px] text-[#A0AEC0]">Receive push notifications for daily study goals.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notificationsEnabled}
                          onChange={(e) => handleNotificationToggle(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#48BB78]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-[20px] font-bold text-[#1B1D35] mb-6 border-b pb-4">Privacy & Security</h2>
                  
                  <div className="space-y-6 max-w-2xl">
                    <div className="p-4 border border-[#E2E8F0] rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#F0E6FF] rounded-full flex items-center justify-center">
                          <Lock className="w-5 h-5 text-[#6C5CE7]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1B1D35]">Account Security</h4>
                          <p className="text-[13px] text-[#A0AEC0]">Your session is secured with JWT authorization and HTTP-only cookies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-[20px] font-bold text-[#1B1D35] mb-6 border-b pb-4">Appearance</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                    <button 
                      onClick={() => handleThemeChange("LIGHT")}
                      className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${
                        theme === "LIGHT" ? "border-[#6C5CE7] bg-[#F8F9FF]" : "border-[#E2E8F0] bg-white"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Eye className="w-6 h-6 text-[#6C5CE7]" />
                      </div>
                      <span className="font-bold text-[#1B1D35]">Light Mode</span>
                    </button>
                    
                    <button 
                      onClick={() => handleThemeChange("DARK")}
                      className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${
                        theme === "DARK" ? "border-[#6C5CE7] bg-[#1B1D35] text-white" : "border-[#E2E8F0] bg-[#1B1D35]/90 text-white"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#2D3748] flex items-center justify-center shadow-sm">
                        <Moon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-bold">Dark Mode</span>
                    </button>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </DashboardShell>
      </ContentArea>
    </PageContainer>
  );
}
