import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, X, Search, Check, Loader2, Trash2, HelpCircle, Book } from "lucide-react";
import { getSubjectsSuggestion } from "./constants";
import { apiClient } from "@/lib/api-client";

export default function SubjectsStep({ data, updateData, onNext, onBack, isSaving }: any) {
  const [suggestedSubjects, setSuggestedSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Generate suggestions based on profile
    const suggestions = getSubjectsSuggestion(data.stream || "", data.gradeClass || "");
    // Filter out already added ones
    const activeNames = data.subjects.map((s: any) => s.name.toLowerCase());
    setSuggestedSubjects(suggestions.filter(s => !activeNames.includes(s.toLowerCase())));
  }, [data.stream, data.gradeClass, data.subjects]);

  const handleAddSubject = async (name: string) => {
    if (!name.trim()) return;
    const isDuplicate = data.subjects.find((s: any) => s.name.toLowerCase() === name.trim().toLowerCase());
    if (isDuplicate) {
      setErrorMsg("Subject already added");
      return;
    }
    
    setErrorMsg("");
    try {
      setIsAdding(true);
      const res = await apiClient.post("/auth/profile/subjects", { name: name.trim() });
      const updatedSubjects = res.data.data.subjects;
      updateData({ subjects: updatedSubjects });
      setCustomSubject("");
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to add subject");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      setIsDeleting(id);
      const res = await apiClient.delete(`/auth/profile/subjects/${id}`);
      updateData({ subjects: res.data.data.subjects });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  const validateAndNext = () => {
    if (data.subjects.length === 0) {
      setErrorMsg("Please add at least one subject.");
      return;
    }
    onNext();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pb-10 relative">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-3xl font-semibold">Your Subjects</h2>
        <button onClick={() => setShowHelp(true)} className="flex items-center gap-1.5 text-sm text-[#6C5CE7] bg-[#E5E1FF]/50 px-3 py-1.5 rounded-full hover:bg-[#E5E1FF] transition-colors">
          <HelpCircle className="w-4 h-4" /> Need Help?
        </button>
      </div>
      <p className="text-[#6B7280] mb-8">Add the subjects you want to study. We've suggested a few based on your class.</p>

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
              <h3 className="text-2xl font-semibold mb-4 text-[#1B1D35]">Choosing Subjects</h3>
              <div className="space-y-4 text-gray-600">
                <p><strong className="text-gray-900">Suggestions:</strong> We recommend subjects based on the Board and Class you selected.</p>
                <p><strong className="text-gray-900">Custom Subjects:</strong> If you don't see a subject you want to learn (like "Web Development" or "Financial Literacy"), you can search or add it manually.</p>
                <p>You can always add or remove subjects later from your Dashboard.</p>
              </div>
              <button onClick={() => setShowHelp(false)} className="w-full mt-8 py-3 bg-[#6C5CE7] text-white rounded-[14px] font-medium">Got it</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMsg && <p className="text-red-500 mb-4 text-sm font-medium">{errorMsg}</p>}

      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Your Subjects</h3>
        
        <div className="flex flex-wrap gap-3 mb-6 min-h-[60px]">
          <AnimatePresence>
            {data.subjects.map((s: any) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 bg-[#6C5CE7] text-white px-4 py-2 rounded-full font-medium text-sm shadow-sm"
              >
                <Book className="w-4 h-4 opacity-70" />
                <span>{s.name}</span>
                <button onClick={() => handleDeleteSubject(s.id)} className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {data.subjects.length === 0 && (
            <div className="text-gray-400 text-sm flex items-center h-full">No subjects added yet.</div>
          )}
        </div>

        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Suggested</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {suggestedSubjects.map(s => (
            <button
              key={s}
              onClick={() => handleAddSubject(s)}
              disabled={isAdding}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-gray-400" /> {s}
            </button>
          ))}
          {suggestedSubjects.length === 0 && <span className="text-gray-400 text-sm">No new suggestions.</span>}
        </div>

        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Add Custom Subject</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Psychology"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubject(customSubject)}
            className="flex-1 h-[48px] rounded-[12px] bg-gray-50 border border-gray-200 px-4 outline-none focus:border-[#6C5CE7] focus:bg-white focus:ring-[3px] focus:ring-[#6C5CE7]/15 transition-all"
          />
          <button
            onClick={() => handleAddSubject(customSubject)}
            disabled={isAdding || !customSubject.trim()}
            className="h-[48px] px-6 bg-[#1B1D35] hover:bg-black text-white rounded-[12px] font-medium transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-10 border-t border-gray-100 pt-6">
        <button onClick={onBack} disabled={isSaving || isAdding} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={validateAndNext} disabled={isSaving || isAdding} className="flex items-center gap-2 px-6 py-3 bg-[#6C5CE7] hover:bg-[#5A4FCF] text-white rounded-[12px] font-medium transition-all shadow-sm">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
