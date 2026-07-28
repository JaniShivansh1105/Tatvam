import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export default function CompletionStep({ user, onComplete, isSaving }: any) {
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleGoToDashboard = async () => {
    setHasCompleted(true);
    await onComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center justify-center text-center mt-6 relative"
    >
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-[#6C5CE7] rounded-full blur-[40px] opacity-20" />
        <div className="w-24 h-24 bg-gradient-to-tr from-[#6C5CE7] to-[#8B7CF6] text-white rounded-full flex items-center justify-center relative z-10 shadow-lg">
          <CheckCircle className="w-12 h-12" />
        </div>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-4xl font-semibold mb-3 text-[#1B1D35]"
      >
        Welcome to Tatvam, {user?.fullName?.split(' ')[0] || 'Learner'}.
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="text-lg text-[#6B7280] max-w-lg mx-auto mb-10 leading-relaxed"
      >
        Your personalized learning workspace is ready. From now on, Tatvam will personalize explanations, practice, revision, and recommendations based entirely on how <strong className="text-[#6C5CE7]">you</strong> learn.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="w-full max-w-sm flex flex-col gap-3 mb-10 text-left"
      >
        {[
          "Academic Profile Ready",
          "Learning Preferences Saved",
          "AI Personalization Complete",
          "Workspace Initialized"
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 p-4 rounded-[16px] shadow-sm">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            <span className="font-medium text-gray-800 text-[15px]">{item}</span>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        onClick={handleGoToDashboard}
        disabled={isSaving || hasCompleted}
        className="flex items-center justify-center w-full max-w-sm h-[56px] gap-2 px-8 bg-[#1B1D35] hover:bg-black text-white rounded-[16px] font-medium text-lg transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed group"
      >
        {isSaving || hasCompleted ? (
           <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
