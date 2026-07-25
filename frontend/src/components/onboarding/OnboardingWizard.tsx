"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Check, BookOpen, GraduationCap, Target, Zap, Clock, ShieldCheck, Heart } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { apiClient } from "@/lib/api-client";
import { UserAvatar } from "@/components/ui/UserAvatar";

export function OnboardingWizard() {
  const { user, setUser, setHasCompletedOnboarding } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [age, setAge] = useState("20");
  const [gender, setGender] = useState("Prefer not to say");
  const [country, setCountry] = useState("India");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [language, setLanguage] = useState("English");

  const [academicLevel, setAcademicLevel] = useState("University");
  const [grade, setGrade] = useState("Undergraduate - Year 2");
  const [boardOrUniv, setBoardOrUniv] = useState("Central University");
  const [stream, setStream] = useState("Science / Engineering");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Physics", "Mathematics"]);

  const [learningModality, setLearningModality] = useState("Diagrams & Visuals");
  const [studyDuration, setStudyDuration] = useState("45 min");
  const [productiveTime, setProductiveTime] = useState("Evening");
  const [distractions, setDistractions] = useState("Phone & Notifications");

  const [selectedGoals, setSelectedGoals] = useState<string[]>(["Master concepts", "Improve grades"]);

  const [confidence, setConfidence] = useState(3); // 1-5 scale
  const [revisionFreq, setRevisionFreq] = useState("Weekly");
  const [enjoySolving, setEnjoySolving] = useState("Very Much");
  const [learningPace, setLearningPace] = useState("Understand Deeply");

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const bioText = `Age: ${age} | Level: ${academicLevel} (${stream}) | Goal: ${selectedGoals.join(", ")}`;
      
      const payload = {
        fullName,
        country,
        timezone,
        bio: bioText,
        dna: {
          visualPreference: learningModality.includes("Visual") ? 0.9 : 0.6,
          pacePreference: learningPace.includes("Deeply") ? 0.8 : 0.4,
          detailPreference: 0.7,
          analogyPreference: learningModality.includes("Analogies") ? 0.9 : 0.5,
          examplePreference: 0.8,
        },
      };

      const profileRes = await apiClient.put("/auth/profile", payload);
      await apiClient.put("/auth/preferences", { preferredLanguageName: language });

      setUser(profileRes.data.data.user);
      setHasCompletedOnboarding(true);
    } catch (err) {
      console.error("Onboarding submit error:", err);
      setHasCompletedOnboarding(true); // Fallback so user is not stuck
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#1B1D35]/60 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[760px] bg-white rounded-[32px] shadow-2xl border border-white/80 overflow-hidden my-auto flex flex-col min-h-[600px] relative"
      >
        {/* Progress Header */}
        <div className="px-8 py-6 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8F9FF] to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar name={fullName || "Student"} size="sm" />
            <div>
              <h3 className="font-extrabold text-[#1B1D35] text-[16px]">Tatvam Setup</h3>
              <p className="text-[12px] text-[#6C5CE7] font-bold uppercase tracking-wider">Step {step} of 6</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-[#6C5CE7]" : i < step ? "w-3 bg-[#48BB78]" : "w-3 bg-[#E2E8F0]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content Body */}
        <div className="p-8 md:p-10 flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-[26px] font-extrabold text-[#1B1D35] tracking-tight">Let&apos;s get to know you</h2>
                  <p className="text-[#A0AEC0] text-[14px] mt-1">First, tell us about yourself so we can personalize your workspace.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-full">
                    <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all font-medium text-[#1B1D35]" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Age</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all font-medium text-[#1B1D35]" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all font-medium text-[#1B1D35]">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Country</label>
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all font-medium text-[#1B1D35]" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Preferred Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none transition-all font-medium text-[#1B1D35]">
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Academic Profile */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-[26px] font-extrabold text-[#1B1D35] tracking-tight">Academic Background</h2>
                  <p className="text-[#A0AEC0] text-[14px] mt-1">This helps Tatvam tailor difficulty and curriculum depth.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Current Level</label>
                    <select value={academicLevel} onChange={(e) => setAcademicLevel(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none font-medium text-[#1B1D35]">
                      <option>School (K-12)</option>
                      <option>College / High School</option>
                      <option>University</option>
                      <option>Working Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Grade / Semester</label>
                    <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none font-medium text-[#1B1D35]" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Board / Institution</label>
                    <input type="text" value={boardOrUniv} onChange={(e) => setBoardOrUniv(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none font-medium text-[#1B1D35]" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Stream / Field</label>
                    <input type="text" value={stream} onChange={(e) => setStream(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] focus:bg-white focus:border-[#6C5CE7] outline-none font-medium text-[#1B1D35]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-3">Target Subjects</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "Artificial Intelligence"].map((subj) => (
                      <button
                        key={subj}
                        onClick={() => toggleSubject(subj)}
                        className={`px-4 py-2 rounded-2xl text-[13px] font-bold transition-all border ${
                          selectedSubjects.includes(subj)
                            ? "bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm"
                            : "bg-[#F8F9FF] text-[#4A5568] border-[#E2E8F0] hover:border-[#6C5CE7]"
                        }`}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Learning Style */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-[26px] font-extrabold text-[#1B1D35] tracking-tight">How Do You Learn Best?</h2>
                  <p className="text-[#A0AEC0] text-[14px] mt-1">Select your preferences so our Pedagogical Engine adapts instantly.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-3">Primary Modality</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["Diagrams & Visuals", "Real Analogies", "Practical Examples", "Text & Reading"].map((m) => (
                        <button
                          key={m}
                          onClick={() => setLearningModality(m)}
                          className={`p-4 rounded-2xl border text-center transition-all font-semibold text-[13px] ${
                            learningModality === m ? "bg-[#1B1D35] text-white border-[#1B1D35] shadow-md" : "bg-[#F8F9FF] text-[#4A5568] border-[#E2E8F0]"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Ideal Session Length</label>
                      <select value={studyDuration} onChange={(e) => setStudyDuration(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] font-medium text-[#1B1D35]">
                        <option>15 min</option>
                        <option>30 min</option>
                        <option>45 min</option>
                        <option>1 hour+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Most Productive Time</label>
                      <select value={productiveTime} onChange={(e) => setProductiveTime(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] font-medium text-[#1B1D35]">
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                        <option>Night</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Biggest Distraction</label>
                      <select value={distractions} onChange={(e) => setDistractions(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] font-medium text-[#1B1D35]">
                        <option>Phone & Notifications</option>
                        <option>Social Media</option>
                        <option>Background Noise</option>
                        <option>Overthinking</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Goals */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-[26px] font-extrabold text-[#1B1D35] tracking-tight">Your Primary Goals</h2>
                  <p className="text-[#A0AEC0] text-[14px] mt-1">Select all that apply to guide your study plans.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Master concepts deeply",
                    "Improve grades",
                    "Competitive Exam Prep (JEE/NEET)",
                    "Interview Preparation",
                    "Learn something new",
                    "Build daily study consistency",
                  ].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        selectedGoals.includes(goal)
                          ? "bg-[#F0E6FF] border-[#6C5CE7] text-[#6C5CE7] font-bold shadow-sm"
                          : "bg-[#F8F9FF] border-[#E2E8F0] text-[#4A5568]"
                      }`}
                    >
                      <span className="text-[14px]">{goal}</span>
                      {selectedGoals.includes(goal) && <Check className="w-5 h-5 text-[#6C5CE7]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Calibration DNA */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-[26px] font-extrabold text-[#1B1D35] tracking-tight">Learning DNA Calibration</h2>
                  <p className="text-[#A0AEC0] text-[14px] mt-1">A quick diagnostic to set your baseline Learning DNA.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Confidence in Physics (1 to 5)</label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => setConfidence(val)}
                          className={`flex-1 py-3 rounded-2xl border font-bold text-[16px] transition-all ${
                            confidence === val ? "bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-md" : "bg-[#F8F9FF] border-[#E2E8F0] text-[#4A5568]"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Revision Frequency</label>
                      <select value={revisionFreq} onChange={(e) => setRevisionFreq(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] font-medium text-[#1B1D35]">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Only before exams</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#4A5568] uppercase tracking-wider mb-2">Learning Preference</label>
                      <select value={learningPace} onChange={(e) => setLearningPace(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8F9FF] font-medium text-[#1B1D35]">
                        <option>Understand Deeply</option>
                        <option>Finish Fast & Practise</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Celebration & Completion */}
            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#00C6FF] flex items-center justify-center text-white shadow-lg animate-bounce">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-[32px] font-extrabold text-[#1B1D35] tracking-tight">You&apos;re All Set, {fullName.split(" ")[0]}!</h2>
                  <p className="text-[#A0AEC0] text-[15px] max-w-md mx-auto mt-2 leading-relaxed">
                    Your initial Learning DNA has been calibrated. Tatvam will now dynamically adapt every lesson, study plan, and mentor response to match your style.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-8 py-5 border-t border-[#E2E8F0] bg-white flex items-center justify-between shrink-0">
          {step > 1 && step < 6 ? (
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-[#E2E8F0] text-[#4A5568] font-bold text-[14px] hover:bg-[#F8F9FF]"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 && (
            <button
              onClick={() => setStep((s) => Math.min(6, s + 1))}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1B1D35] hover:bg-[#2D3748] text-white rounded-2xl font-bold text-[14px] transition-all shadow-md ml-auto"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 5 && (
            <button
              onClick={() => setStep(6)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#6C5CE7] hover:bg-[#5A4BCC] text-white rounded-2xl font-bold text-[14px] transition-all shadow-md ml-auto"
            >
              Finish Setup <Sparkles className="w-4 h-4" />
            </button>
          )}

          {step === 6 && (
            <button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00C6FF] text-white rounded-2xl font-bold text-[15px] hover:shadow-lg transition-all mx-auto"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
