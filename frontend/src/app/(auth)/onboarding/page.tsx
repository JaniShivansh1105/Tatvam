"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/config/routes";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { defaultOnboardingData, OnboardingData, OnboardingStep } from "@/components/onboarding/types";

import dynamic from "next/dynamic";

const WelcomeStep = dynamic(() => import("@/components/onboarding/WelcomeStep"), { ssr: false, loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-[20px]" /> });
const PersonalStep = dynamic(() => import("@/components/onboarding/PersonalStep"), { ssr: false, loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-[20px]" /> });
const AcademicStep = dynamic(() => import("@/components/onboarding/AcademicStep"), { ssr: false, loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-[20px]" /> });
const SubjectsStep = dynamic(() => import("@/components/onboarding/SubjectsStep"), { ssr: false, loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-[20px]" /> });
const PreferencesStep = dynamic(() => import("@/components/onboarding/PreferencesStep"), { ssr: false, loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-[20px]" /> });
const OptionalStep = dynamic(() => import("@/components/onboarding/OptionalStep"), { ssr: false, loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-[20px]" /> });
const CompletionStep = dynamic(() => import("@/components/onboarding/CompletionStep"), { ssr: false, loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-[20px]" /> });

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setHasCompletedOnboarding = useAuthStore((state) => state.setHasCompletedOnboarding);
  
  const [step, setStep] = useState<OnboardingStep>(1);
  const [data, setData] = useState<OnboardingData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tatvam_onboarding_data");
      if (saved) {
        try { return { ...defaultOnboardingData, ...JSON.parse(saved) }; } catch (e) {}
      }
    }
    return defaultOnboardingData;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Persist local state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tatvam_onboarding_data", JSON.stringify(data));
    }
  }, [data]);

  // Resume state from backend
  useEffect(() => {
    
    // Load from backend just in case
    apiClient.get("/auth/me").then((res) => {
      const u = res.data.data.user;
      setUser(u);
      
      let localData: Partial<OnboardingData> = {};
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("tatvam_onboarding_data");
        if (saved) {
          try { localData = JSON.parse(saved); } catch (e) {}
        }
      }

      const loadedData = { ...defaultOnboardingData, ...localData };
      
      if (u.profile) {
        Object.keys(defaultOnboardingData).forEach((key) => {
          // If backend has it and local doesn't, use backend
          if (u.profile[key] !== undefined && u.profile[key] !== null && !localData[key as keyof OnboardingData]) {
            // @ts-ignore
            loadedData[key] = u.profile[key];
          }
        });
      }
      if (u.preference?.preferredLanguage?.name && !localData.preferredLanguage) {
        loadedData.preferredLanguage = u.preference.preferredLanguage.name;
      }
      
      setData(loadedData);

      // Determine step
      if (u.onboardingCompleted) {
        router.replace(ROUTES.DASHBOARD.HOME);
        return;
      }
      
      if (u.onboardingStep) {
        const stepMap: Record<string, OnboardingStep> = {
          "WELCOME": 1,
          "PERSONAL": 2,
          "ACADEMIC": 3,
          "SUBJECTS": 4,
          "PREFERENCES": 5,
          "OPTIONAL": 6,
          "COMPLETION": 7
        };
        setStep(stepMap[u.onboardingStep] || 1);
      }
      if (u.userSubjects) {
         loadedData.subjects = u.userSubjects;
      }
      
      setData(loadedData);
      setIsLoading(false);
      
    }).catch((err) => {
      if (err.response?.status === 401) {
        router.replace(ROUTES.LOGIN);
      } else {
        setInitError("Failed to load your profile. Please check your connection and try again.");
        setIsLoading(false);
      }
    });
  }, []);

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = async (nextStep: OnboardingStep, stepName: string, fieldsToSave?: Partial<OnboardingData>) => {
    try {
      setIsSaving(true);
      const payload: any = { onboardingStep: stepName };
      
      if (fieldsToSave) {
        // ONLY send fields that are supported by the backend Profile schema to prevent 500 Prisma Validation Errors
        const validBackendFields = [
          "fullName", "email", // Handled for User
          "bio", "dateOfBirth", "country", "state", "city", "timezone", 
          "gender", "board", "medium", "gradeClass", "stream", "schoolName", 
          "preferredLanguage", "parentName", "relationship", "phone", 
          "alternatePhone", "occupation", "alternateEmail", "emergencyContact", 
          "socialLinks", "learningInterests", "careerGoal"
        ];
        
        Object.keys(fieldsToSave).forEach((key) => {
          if (validBackendFields.includes(key)) {
            // @ts-ignore
            payload[key] = fieldsToSave[key];
          }
        });

        // Map custom frontend fields to valid backend fields
        if (fieldsToSave.learningGoals) {
          payload.learningInterests = fieldsToSave.learningGoals;
        }
        if (fieldsToSave.careerInterests && fieldsToSave.careerInterests.length > 0) {
          payload.careerGoal = fieldsToSave.careerInterests.join(', ');
        }
      }
      
      if (nextStep === 7) {
         // It's the completion step, we just go to it and then complete there
      }

      const res = await apiClient.post("/auth/profile/onboarding", payload);
      setUser(res.data.data.user);
      
      setStep(nextStep);
    } catch (error) {
      console.error("Failed to save progress", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleComplete = async () => {
    try {
      setIsSaving(true);
      const res = await apiClient.post("/auth/profile/onboarding", { onboardingCompleted: true, onboardingStep: "COMPLETED" });
      setUser(res.data.data.user);
      setHasCompletedOnboarding(true);
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("tatvam_onboarding_data");
      }
      
      router.replace(ROUTES.DASHBOARD.HOME);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  if (initError) {
    return (
      <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-[#F8F9FF] gap-4">
        <p className="text-[#E53E3E] font-medium text-lg text-center max-w-md px-4">{initError}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-[#6C5CE7] text-white font-medium rounded-xl hover:bg-[#5A4FCF] transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-[100dvh] flex items-center justify-center bg-[#F8F9FF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />
      </div>
    );
  }

  const progressPercent = ((step - 1) / 6) * 100;

  return (
    <div className="w-full min-h-[100dvh] bg-[#F8F9FF] text-[#1B1D35] flex flex-col font-sans selection:bg-[#6C5CE7]/20 relative overflow-hidden">
      
      {/* BACKGROUND MESH */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[#E5E1FF] blur-[140px] opacity-60 mix-blend-multiply" 
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#FFD1E6] blur-[150px] opacity-40 mix-blend-multiply" 
        />
      </div>

      {/* TOP PROGRESS BAR */}
      <div className="w-full h-1.5 bg-gray-100 z-50 fixed top-0 left-0">
        <motion.div 
          className="h-full bg-[#6C5CE7]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex-1 flex flex-col relative z-10 w-full max-w-3xl mx-auto px-6 py-12 md:py-20">
        
        {/* STEP INDICATOR */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div key={s} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === s ? "bg-[#6C5CE7] text-white shadow-md" : 
                  s < step ? "bg-[#E5E1FF] text-[#6C5CE7]" : "bg-white text-gray-400 border border-gray-200"
                }`}
              >
                {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s !== 7 && (
                <div className={`w-8 h-[2px] mx-1 transition-colors ${s < step ? "bg-[#E5E1FF]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && <WelcomeStep key="s1" user={user} onNext={() => handleNext(2, "PERSONAL")} isSaving={isSaving} />}
          {step === 2 && <PersonalStep key="s2" data={data} updateData={updateData} onNext={(fields: any) => handleNext(3, "ACADEMIC", fields)} onBack={() => setStep(1)} isSaving={isSaving} />}
          {step === 3 && <AcademicStep key="s3" data={data} updateData={updateData} onNext={(fields: any) => handleNext(4, "SUBJECTS", fields)} onBack={() => setStep(2)} isSaving={isSaving} />}
          {step === 4 && <SubjectsStep key="s4" data={data} updateData={updateData} onNext={() => handleNext(5, "PREFERENCES")} onBack={() => setStep(3)} isSaving={isSaving} />}
          {step === 5 && <PreferencesStep key="s5" data={data} updateData={updateData} onNext={(fields: any) => handleNext(6, "OPTIONAL", fields)} onBack={() => setStep(4)} isSaving={isSaving} />}
          {step === 6 && <OptionalStep key="s6" data={data} updateData={updateData} onNext={(fields: any) => handleNext(7, "COMPLETION", fields)} onBack={() => setStep(5)} isSaving={isSaving} />}
          {step === 7 && <CompletionStep key="s7" user={user} onComplete={handleComplete} isSaving={isSaving} />}
        </AnimatePresence>

      </div>
    </div>
  );
}
