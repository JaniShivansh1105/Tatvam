"use client";

import { useAuthStore } from "@/store/auth-store";
import { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/lib/api-client";
import { useSubjects } from "@/hooks/dashboard/useSubjects";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Check, 
  Loader2,
  User as UserIcon,
  Settings,
  Mail,
  Calendar,
  MapPin,
  GraduationCap,
  Globe,
  Trash2,
  Plus,
  Briefcase,
  X,
  Save,
  Library
} from "lucide-react";

const VALID_BACKEND_FIELDS = [
  "fullName", "email",
  "bio", "dateOfBirth", "country", "state", "city", "timezone", 
  "gender", "board", "medium", "gradeClass", "stream", "schoolName", 
  "preferredLanguage", "parentName", "relationship", "phone", 
  "alternatePhone", "occupation", "alternateEmail", "emergencyContact", 
  "socialLinks", "learningInterests", "careerGoal"
];

function buildFormData(user: any): Record<string, any> {
  return {
    fullName: user.fullName || "",
    email: user.email || "",
    accountType: user.accountType || "",
    ...user.profile,
    learningInterests: user.profile?.learningInterests || [],
    careerGoal: user.profile?.careerGoal || "",
  };
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { subjects, addSubject, removeSubject, isAdding, isRemoving } = useSubjects();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [originalData, setOriginalData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState("");

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      const data = buildFormData(user);
      setFormData(data);
      setOriginalData(data);
    }
  }, [user]);

  // Detect dirty state
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // Build payload with only changed and valid fields
      const payload: Record<string, any> = {};
      for (const key of Object.keys(formData)) {
        if (VALID_BACKEND_FIELDS.includes(key) && formData[key] !== originalData[key]) {
          payload[key] = formData[key];
        }
      }

      // Handle fullName separately (it's a user field, not profile)
      if (formData.fullName !== originalData.fullName) {
        payload.fullName = formData.fullName;
      }

      if (Object.keys(payload).length === 0) return;

      const res = await apiClient.post("/auth/profile/onboarding", payload);
      setUser(res.data.data.user);

      const updatedData = buildFormData(res.data.data.user);
      setFormData(updatedData);
      setOriginalData(updatedData);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      setSaveError(error?.response?.data?.message || "Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubject = async () => {
    const name = newSubject.trim();
    if (!name) return;
    await addSubject(name);
    setNewSubject("");
  };

  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative p-6 md:p-10 max-w-5xl mx-auto w-full">
      
      <header className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#1B1D35] tracking-tight">Your Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal and academic information.</p>
        </div>
      </header>

      {/* FLOATING SAVE BAR */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-lg border border-gray-200"
          >
            <span className="text-sm text-gray-600 font-medium">Unsaved changes</span>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 text-sm font-medium text-white bg-[#6C5CE7] hover:bg-[#5A4FCF] rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SAVE SUCCESS TOAST */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-6 py-3 shadow-lg"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Changes saved successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SAVE ERROR TOAST */}
      <AnimatePresence>
        {saveError && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-3 shadow-lg"
          >
            <X className="w-4 h-4" />
            <span className="text-sm font-medium">{saveError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-10">
        
        {/* AVATAR SECTION */}
        <section className="flex items-center gap-6 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] p-[2px] shadow-sm">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#6C5CE7] font-semibold text-3xl">{user.fullName?.charAt(0)}</span>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user.fullName}</h3>
            <p className="text-gray-500 text-sm mb-3">{user.accountType} Account • ID: {user.id.substring(0,8).toUpperCase()}</p>
            <div className="flex gap-3">
              <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors">Upload Photo</button>
              {user.avatarUrl && (
                <button className="px-4 py-1.5 text-red-500 hover:bg-red-50 text-sm font-medium rounded-full transition-colors">Remove</button>
              )}
            </div>
          </div>
        </section>

        {/* REGISTRATION INFO */}
        <section className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <UserIcon className="w-5 h-5 text-[#6C5CE7]" />
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Full Name</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] focus-within:ring-[3px] focus-within:ring-[#6C5CE7]/15 transition-all">
                <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  value={formData.fullName || ""} 
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Email Address (Read-only)</label>
              <div className="flex items-center bg-gray-100 border border-gray-200 rounded-[12px] px-4 cursor-not-allowed">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  value={formData.email || ""} 
                  disabled
                  className="w-full h-12 bg-transparent outline-none text-[15px] text-gray-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PERSONAL DETAILS */}
        <section className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-[#6C5CE7]" />
            <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Date of Birth</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="date" 
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ""} 
                  onChange={(e) => handleChange("dateOfBirth", new Date(e.target.value).toISOString())}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Gender</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <select 
                  value={formData.gender || ""} 
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px] appearance-none"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">State</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <input 
                  type="text" 
                  value={formData.state || ""} 
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">City / District</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <input 
                  type="text" 
                  value={formData.city || ""} 
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ACADEMIC DETAILS */}
        <section className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-[#6C5CE7]" />
            <h2 className="text-lg font-semibold text-gray-900">Academic Background</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Board / University</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <input 
                  type="text" 
                  value={formData.board || ""} 
                  onChange={(e) => handleChange("board", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Class / Grade</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <input 
                  type="text" 
                  value={formData.gradeClass || ""} 
                  onChange={(e) => handleChange("gradeClass", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Medium of Instruction</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <Globe className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  value={formData.medium || ""} 
                  onChange={(e) => handleChange("medium", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">School / Institution</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <input 
                  type="text" 
                  value={formData.schoolName || ""} 
                  onChange={(e) => handleChange("schoolName", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Stream</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <input 
                  type="text" 
                  value={formData.stream || ""} 
                  onChange={(e) => handleChange("stream", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                  placeholder="e.g. Science, Commerce, Arts"
                />
              </div>
            </div>

          </div>
        </section>

        {/* SUBJECTS — DYNAMIC ENGINE */}
        <section className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Library className="w-5 h-5 text-[#6C5CE7]" />
            <h2 className="text-lg font-semibold text-gray-900">Your Subjects</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center gap-2 bg-[#F0EEFF] text-[#6C5CE7] px-4 py-2 rounded-full text-sm font-medium group"
              >
                <span>{subject.name}</span>
                <button
                  onClick={() => removeSubject(subject.id)}
                  disabled={isRemoving}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[#6C5CE7]/60 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {subjects.length === 0 && (
              <p className="text-gray-400 text-sm">No subjects selected yet. Add your first subject below.</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
                placeholder="Type a subject name..."
                className="w-full h-12 bg-transparent outline-none text-[15px]"
              />
            </div>
            <button
              onClick={handleAddSubject}
              disabled={isAdding || !newSubject.trim()}
              className="h-12 px-5 bg-[#6C5CE7] text-white rounded-[12px] font-medium text-sm hover:bg-[#5A4FCF] transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-[#6C5CE7]" />
            <h2 className="text-lg font-semibold text-gray-900">Preferences & Goals</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 relative md:col-span-2">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Career Goal</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  value={formData.careerGoal || ""} 
                  onChange={(e) => handleChange("careerGoal", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                  placeholder="e.g. Software Engineer, Doctor, etc."
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative md:col-span-2">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Bio</label>
              <div className="flex items-start bg-gray-50 border border-gray-200 rounded-[12px] px-4 py-3 focus-within:border-[#6C5CE7] transition-all">
                <textarea 
                  value={formData.bio || ""} 
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="w-full h-24 bg-transparent outline-none text-[15px] resize-none"
                  placeholder="Write a short bio about yourself..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Emergency Contact</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <input 
                  type="text" 
                  value={formData.emergencyContact || ""} 
                  onChange={(e) => handleChange("emergencyContact", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">Alternate Email</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] px-4 focus-within:border-[#6C5CE7] transition-all">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="email" 
                  value={formData.alternateEmail || ""} 
                  onChange={(e) => handleChange("alternateEmail", e.target.value)}
                  className="w-full h-12 bg-transparent outline-none text-[15px]"
                  placeholder="backup@email.com"
                />
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Bottom spacer for floating save bar */}
      <div className="h-24" />
    </div>
  );
}
