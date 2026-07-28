import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function WelcomeStep({ user, onNext, isSaving }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center text-center mt-10"
    >
      <div className="w-20 h-20 bg-[#F0E6FF] text-[#6C5CE7] rounded-full flex items-center justify-center mb-8 shadow-sm">
        <Sparkles className="w-10 h-10" />
      </div>
      
      <h1 className="text-4xl font-semibold mb-4 text-[#1B1D35]">
        Welcome, {user?.fullName?.split(' ')[0] || 'Learner'}!
      </h1>
      
      <p className="text-lg text-[#6B7280] max-w-lg mx-auto mb-12 leading-relaxed">
        Let's personalize your Tatvam experience. We'll ask a few questions to tailor your AI Mentor, study plans, and learning materials perfectly to your needs.
      </p>

      <button
        onClick={onNext}
        disabled={isSaving}
        className="flex items-center gap-2 px-8 py-4 bg-[#6C5CE7] hover:bg-[#5A4FCF] text-white rounded-[16px] font-medium text-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span>Let's Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
