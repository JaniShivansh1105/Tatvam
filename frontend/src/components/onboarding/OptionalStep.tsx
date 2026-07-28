import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, SkipForward, X, HelpCircle } from "lucide-react";

export default function OptionalStep({ data, updateData, onNext, onBack, isSaving }: any) {
  const [showHelp, setShowHelp] = useState(false);
  
  const handleNext = () => {
    // Send data directly, no validation errors blocking
    onNext({
      bio: data.bio,
      emergencyContact: data.emergencyContact,
      alternateEmail: data.alternateEmail,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-3xl font-semibold">Optional Information</h2>
        <button onClick={() => setShowHelp(true)} className="flex items-center gap-1.5 text-sm text-[#6C5CE7] bg-[#E5E1FF]/50 px-3 py-1.5 rounded-full hover:bg-[#E5E1FF] transition-colors">
          <HelpCircle className="w-4 h-4" /> Need Help?
        </button>
      </div>
      <p className="text-[#6B7280] mb-8">Feel free to skip this for now. You can always update it later.</p>

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
              <h3 className="text-2xl font-semibold mb-4 text-[#1B1D35]">Optional Information</h3>
              <div className="space-y-4 text-gray-600">
                <p><strong className="text-gray-900">Bio & Contact:</strong> A short bio helps mentors know you better. An emergency contact is useful if you're a minor.</p>
                <p>Everything on this page is optional. You can just hit "Skip" to start learning.</p>
              </div>
              <button onClick={() => setShowHelp(false)} className="w-full mt-8 py-3 bg-[#6C5CE7] text-white rounded-[14px] font-medium">Got it</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 mb-8">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Short Bio</label>
          <textarea
            placeholder="Tell us a little about yourself..."
            value={data.bio}
            onChange={(e) => updateData({ bio: e.target.value })}
            className="h-[100px] rounded-[14px] bg-white border border-gray-200 p-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Alternate Email</label>
          <input
            type="email"
            placeholder="e.g. backup@example.com"
            value={data.alternateEmail}
            onChange={(e) => updateData({ alternateEmail: e.target.value })}
            className="h-[52px] rounded-[14px] bg-white border border-gray-200 px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Emergency Contact</label>
          <input
            type="text"
            placeholder="Name & Phone Number"
            value={data.emergencyContact}
            onChange={(e) => updateData({ emergencyContact: e.target.value })}
            className="h-[52px] rounded-[14px] bg-white border border-gray-200 px-4 outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15"
          />
        </div>

      </div>

      <div className="flex justify-between items-center mt-10 border-t border-gray-100 pt-6">
        <button onClick={onBack} disabled={isSaving} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex gap-4">
          <button onClick={handleNext} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-[12px] font-medium transition-colors">
            Skip <SkipForward className="w-4 h-4" />
          </button>
          <button onClick={handleNext} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-[#6C5CE7] hover:bg-[#5A4FCF] text-white rounded-[12px] font-medium transition-all shadow-sm">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
