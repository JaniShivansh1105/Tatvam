import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Target, Briefcase, GraduationCap, X } from "lucide-react";

const GOAL_OPTIONS = [
  "Improve School Grades",
  "Prepare for Board Exams",
  "Prepare for JEE",
  "Prepare for NEET",
  "Prepare for GATE",
  "Prepare for UPSC",
  "Prepare for Placements",
  "Master Programming",
  "Improve English",
  "Learn AI",
  "Career Switch",
  "Upskill for Work",
  "Study Abroad",
  "Higher Education",
  "Personal Growth"
];

const TIME_OPTIONS = [
  { value: "Less than 1 hour", label: "< 1h / day" },
  { value: "1 - 2 hours", label: "1-2h / day" },
  { value: "2 - 4 hours", label: "2-4h / day" },
  { value: "4+ hours", label: "4h+ / day" }
];

const STYLE_OPTIONS = [
  { value: "Visual", label: "Visual", desc: "Diagrams, Charts, Videos" },
  { value: "Auditory", label: "Auditory", desc: "Listening, Speaking, Podcasts" },
  { value: "Reading/Writing", label: "Reading", desc: "Text, Articles, Writing" },
  { value: "Kinesthetic", label: "Interactive", desc: "Practice, Doing, Experiments" }
];

export default function PreferencesStep({ data, updateData, onNext, onBack, isSaving }: any) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [customInterest, setCustomInterest] = useState("");

  const toggleGoal = (goal: string) => {
    const prev = data.learningGoals || [];
    if (prev.includes(goal)) {
      updateData({ learningGoals: prev.filter((g: string) => g !== goal) });
    } else {
      updateData({ learningGoals: [...prev, goal] });
    }
  };

  const toggleInterest = (interest: string) => {
    const prev = data.careerInterests || [];
    if (prev.includes(interest)) {
      updateData({ careerInterests: prev.filter((g: string) => g !== interest) });
    } else {
      updateData({ careerInterests: [...prev, interest] });
    }
  };

  const handleAddCustomInterest = () => {
    if (customInterest.trim() && !(data.careerInterests || []).includes(customInterest.trim())) {
      toggleInterest(customInterest.trim());
      setCustomInterest("");
    }
  };

  const updateConfidence = (subjectName: string, level: string) => {
    updateData({ 
      subjectConfidence: { 
        ...(data.subjectConfidence || {}), 
        [subjectName]: level 
      } 
    });
  };

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};
    if (!data.learningGoals || data.learningGoals.length === 0) newErrors.learningGoals = "Select at least one goal";
    if (!data.dailyStudyTime) newErrors.dailyStudyTime = "Required";
    if (!data.learningStyle) newErrors.learningStyle = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onNext({
      learningGoals: data.learningGoals,
      dailyStudyTime: data.dailyStudyTime,
      careerInterests: data.careerInterests,
      learningStyle: data.learningStyle,
      subjectConfidence: data.subjectConfidence
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pb-10 relative">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-3xl font-semibold">How Should Tatvam Teach You?</h2>
        <button onClick={() => setShowHelp(true)} className="flex items-center gap-1.5 text-sm text-[#6C5CE7] bg-[#E5E1FF]/50 px-3 py-1.5 rounded-full hover:bg-[#E5E1FF] transition-colors">
          <HelpCircle className="w-4 h-4" /> Need Help?
        </button>
      </div>
      <p className="text-[#6B7280] mb-8">Personalize your learning experience.</p>

      {/* HELP MODAL */}
      <AnimatePresence>
        {showHelp && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-semibold mb-4 text-[#1B1D35]">Choosing Your Preferences</h3>
              <div className="space-y-4 text-gray-600">
                <p><strong className="text-gray-900">Goals:</strong> Pick what matters most to you right now. If you're a student, 'Board Exams' or 'JEE' might be relevant. If you're a professional, 'Upskill' might be better.</p>
                <p><strong className="text-gray-900">Time:</strong> Be realistic! If you only have 30 minutes a day, tell us, and we will create shorter bite-sized lessons.</p>
                <p><strong className="text-gray-900">Learning Style:</strong> Visual learners like diagrams. Kinesthetic learners like interactive practice. Choose what feels right for you.</p>
                <p><strong className="text-gray-900">Confidence:</strong> We use this to decide whether to start you on basic concepts or jump straight into advanced topics for a subject.</p>
              </div>
              <button onClick={() => setShowHelp(false)} className="w-full mt-8 py-3 bg-[#6C5CE7] text-white rounded-[14px] font-medium">Got it</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-10">
        
        {/* GOALS */}
        <div>
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80 mb-3 block">What are your main goals? (Select multiple)</label>
          {errors.learningGoals && <p className="text-red-500 text-sm mb-3">{errors.learningGoals}</p>}
          <div className="flex flex-wrap gap-2">
            {GOAL_OPTIONS.map(goal => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${
                  (data.learningGoals || []).includes(goal) 
                    ? "bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-md shadow-[#6C5CE7]/20" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#6C5CE7]/50"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* STUDY TIME (Segment Control) */}
        <div>
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80 mb-3 block">Daily Study Time</label>
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 p-1 bg-gray-100 rounded-[16px] border ${errors.dailyStudyTime ? "border-red-400" : "border-transparent"}`}>
            {TIME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateData({ dailyStudyTime: opt.value })}
                className={`py-3 rounded-[12px] text-sm font-medium transition-all ${
                  data.dailyStudyTime === opt.value 
                    ? "bg-white text-[#6C5CE7] shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* LEARNING STYLE (Cards) */}
        <div>
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80 mb-3 block">Preferred Learning Style</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STYLE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateData({ learningStyle: opt.value })}
                className={`p-4 rounded-[16px] border text-left transition-all ${
                  data.learningStyle === opt.value 
                    ? "bg-[#F0E6FF] border-[#6C5CE7] shadow-sm" 
                    : "bg-white border-gray-200 hover:border-[#6C5CE7]/40"
                }`}
              >
                <div className="font-semibold text-[#1B1D35] mb-1">{opt.label}</div>
                <div className="text-xs text-gray-500">{opt.desc}</div>
              </button>
            ))}
          </div>
          {errors.learningStyle && <p className="text-red-500 text-sm mt-2">{errors.learningStyle}</p>}
        </div>

        {/* CAREER INTERESTS */}
        <div>
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80 mb-3 block">Career Interests / Dream Jobs</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(data.careerInterests || []).map((ci: string) => (
              <div key={ci} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1 border border-blue-100">
                {ci}
                <button onClick={() => toggleInterest(ci)} className="hover:bg-blue-200 rounded-full p-0.5 ml-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Data Scientist, Architect"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomInterest()}
              className="flex-1 h-[52px] rounded-[14px] bg-white border border-gray-200 px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15"
            />
            <button
              onClick={handleAddCustomInterest}
              disabled={!customInterest.trim()}
              className="h-[52px] px-6 bg-gray-900 hover:bg-black text-white rounded-[14px] font-medium disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        {/* SUBJECT CONFIDENCE */}
        {data.subjects && data.subjects.length > 0 && (
          <div>
            <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80 mb-4 block">How confident do you feel in your subjects?</label>
            <div className="space-y-3">
              {data.subjects.map((subj: any) => (
                <div key={subj.id} className="bg-white border border-gray-100 rounded-[16px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                  <div className="font-medium text-[#1B1D35] flex-1">{subj.name}</div>
                  <div className="flex gap-2">
                    {["Beginner", "Average", "Advanced"].map(level => {
                      const isSelected = (data.subjectConfidence || {})[subj.name] === level;
                      return (
                        <button
                          key={level}
                          onClick={() => updateConfidence(subj.name, level)}
                          className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition-colors ${
                            isSelected 
                              ? "bg-[#1B1D35] text-white" 
                              : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="flex justify-between items-center mt-10 border-t border-gray-100 pt-6">
        <button onClick={onBack} disabled={isSaving} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={validateAndNext} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-[#6C5CE7] hover:bg-[#5A4FCF] text-white rounded-[12px] font-medium transition-all shadow-sm">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
