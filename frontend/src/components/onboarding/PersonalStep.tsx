import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, HelpCircle, X } from "lucide-react";

export default function PersonalStep({ data, updateData, onNext, onBack, isSaving }: any) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState(false);

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};
    if (!data.dateOfBirth) newErrors.dateOfBirth = "Required";
    if (!data.gender) newErrors.gender = "Required";
    if (!data.state) newErrors.state = "Required";
    if (!data.city) newErrors.city = "Required";
    // District is sometimes optional depending on country, but let's just make it required here based on user specs.
    if (!data.district) newErrors.district = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext({
      dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      gender: data.gender,
      state: data.state,
      city: data.district ? `${data.city}, ${data.district}` : data.city,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-3xl font-semibold">Personal Details</h2>
        <button onClick={() => setShowHelp(true)} className="flex items-center gap-1.5 text-sm text-[#6C5CE7] bg-[#E5E1FF]/50 px-3 py-1.5 rounded-full hover:bg-[#E5E1FF] transition-colors">
          <HelpCircle className="w-4 h-4" /> Need Help?
        </button>
      </div>
      <p className="text-[#6B7280] mb-8">We need a few details to set up your account properly.</p>

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
              <h3 className="text-2xl font-semibold mb-4 text-[#1B1D35]">Why do we need this?</h3>
              <div className="space-y-4 text-gray-600">
                <p><strong className="text-gray-900">Date of Birth:</strong> We use this to make sure the language and examples the AI Mentor uses are perfect for your age group.</p>
                <p><strong className="text-gray-900">Location (State/District):</strong> Education boards vary slightly by state. This helps us suggest the right curriculum and local exams.</p>
                <p>We keep all your personal information secure and never share it publicly.</p>
              </div>
              <button onClick={() => setShowHelp(false)} className="w-full mt-8 py-3 bg-[#6C5CE7] text-white rounded-[14px] font-medium">Got it</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Date of Birth</label>
          <input
            type="date"
            value={data.dateOfBirth ? data.dateOfBirth.split('T')[0] : ""}
            onChange={(e) => updateData({ dateOfBirth: e.target.value })}
            className={`h-[52px] rounded-[14px] bg-white border px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.dateOfBirth ? "border-red-400" : "border-gray-200"}`}
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Gender</label>
          <select
            value={data.gender}
            onChange={(e) => updateData({ gender: e.target.value })}
            className={`h-[52px] rounded-[14px] bg-white border px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.gender ? "border-red-400" : "border-gray-200"}`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">State</label>
          <input
            type="text"
            placeholder="e.g. Maharashtra"
            value={data.state}
            onChange={(e) => updateData({ state: e.target.value })}
            className={`h-[52px] rounded-[14px] bg-white border px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.state ? "border-red-400" : "border-gray-200"}`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">District</label>
          <input
            type="text"
            placeholder="e.g. Pune"
            value={data.district}
            onChange={(e) => updateData({ district: e.target.value })}
            className={`h-[52px] rounded-[14px] bg-white border px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.district ? "border-red-400" : "border-gray-200"}`}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">City</label>
          <input
            type="text"
            placeholder="e.g. Pune City"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            className={`h-[52px] rounded-[14px] bg-white border px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.city ? "border-red-400" : "border-gray-200"}`}
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
