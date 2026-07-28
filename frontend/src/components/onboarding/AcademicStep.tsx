import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, HelpCircle, X } from "lucide-react";
import { EDUCATION_LEVELS, BOARDS, MEDIUMS, STREAMS, getClassesForLevelAndBoard } from "./constants";

export default function AcademicStep({ data, updateData, onNext, onBack, isSaving }: any) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (data.educationLevel && data.board) {
      setAvailableClasses(getClassesForLevelAndBoard(data.educationLevel, data.board));
    }
  }, [data.educationLevel, data.board]);

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};
    if (!data.educationLevel) newErrors.educationLevel = "Required";
    if (!data.board) newErrors.board = "Required";
    if (!data.medium) newErrors.medium = "Required";
    if (!data.gradeClass) newErrors.gradeClass = "Required";
    
    // Stream is typically required for classes 11, 12, undergrad etc. if board demands it
    if ((data.gradeClass.includes("11") || data.gradeClass.includes("12") || data.educationLevel.includes("Undergraduate")) && !data.stream) {
      newErrors.stream = "Required";
    }

    if (!data.schoolName) newErrors.schoolName = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext({
      educationLevel: data.educationLevel,
      board: data.board,
      medium: data.medium,
      gradeClass: data.gradeClass,
      stream: data.stream,
      schoolName: data.schoolName,
      preferredLanguage: data.medium, // User mentioned Medium should be used as default preferred language
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-3xl font-semibold">Academic Profile</h2>
        <button onClick={() => setShowHelp(true)} className="flex items-center gap-1.5 text-sm text-[#6C5CE7] bg-[#E5E1FF]/50 px-3 py-1.5 rounded-full hover:bg-[#E5E1FF] transition-colors">
          <HelpCircle className="w-4 h-4" /> Need Help?
        </button>
      </div>
      <p className="text-[#6B7280] mb-8">Tell us about your educational background.</p>

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
              <h3 className="text-2xl font-semibold mb-4 text-[#1B1D35]">Understanding Academic Details</h3>
              <div className="space-y-4 text-gray-600">
                <p><strong className="text-gray-900">Education Level:</strong> Are you in school, college, or studying for a competitive exam? This changes all the following options.</p>
                <p><strong className="text-gray-900">Board:</strong> Central (CBSE/ICSE) and State boards have different books. Select yours so we fetch the right content.</p>
                <p><strong className="text-gray-900">Medium:</strong> The language you study in. Don't worry, the AI can still translate concepts to your native tongue anytime.</p>
              </div>
              <button onClick={() => setShowHelp(false)} className="w-full mt-8 py-3 bg-[#6C5CE7] text-white rounded-[14px] font-medium">Got it</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Education Level</label>
          <select
            value={data.educationLevel}
            onChange={(e) => {
              updateData({ educationLevel: e.target.value, gradeClass: "" });
            }}
            className={`h-[52px] rounded-[14px] bg-white border px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.educationLevel ? "border-red-400" : "border-gray-200"}`}
          >
            <option value="">Select Level</option>
            {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Board / University</label>
          <select
            value={data.board}
            onChange={(e) => {
              updateData({ board: e.target.value, gradeClass: "" });
            }}
            className={`h-[52px] rounded-[14px] bg-white border px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.board ? "border-red-400" : "border-gray-200"}`}
          >
            <option value="">Select Board</option>
            {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Medium (Mandatory)</label>
          <select
            value={data.medium}
            onChange={(e) => updateData({ medium: e.target.value })}
            className={`h-[52px] rounded-[14px] bg-white border px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.medium ? "border-red-400" : "border-gray-200"}`}
          >
            <option value="">Select Medium</option>
            {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Class / Grade</label>
          <select
            value={data.gradeClass}
            onChange={(e) => updateData({ gradeClass: e.target.value })}
            disabled={!data.board || !data.medium}
            className={`h-[52px] rounded-[14px] bg-white border px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.gradeClass ? "border-red-400" : "border-gray-200"} disabled:opacity-50`}
          >
            <option value="">Select Class</option>
            {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {(data.gradeClass?.includes("11") || data.gradeClass?.includes("12") || data.educationLevel?.includes("Undergraduate")) && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Stream</label>
            <select
              value={data.stream}
              onChange={(e) => updateData({ stream: e.target.value })}
              className={`h-[52px] rounded-[14px] bg-white border px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.stream ? "border-red-400" : "border-gray-200"}`}
            >
              <option value="">Select Stream</option>
              {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1.5 md:col-span-2 mt-2">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">School / College Name</label>
          <input
            type="text"
            placeholder="Type your institute name..."
            value={data.schoolName}
            onChange={(e) => updateData({ schoolName: e.target.value })}
            className={`h-[52px] rounded-[14px] bg-white border px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.schoolName ? "border-red-400" : "border-gray-200"}`}
          />
        </div>
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
