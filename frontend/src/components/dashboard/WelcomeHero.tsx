"use client";

import { motion, Variants } from "framer-motion";
import { Flame } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }
};

export function WelcomeHero({ streak = 0 }: { streak?: number }) {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "Student";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const hour = new Date().getHours();
  const greeting = !mounted 
    ? "Welcome back" 
    : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
      <div className="flex flex-col gap-1.5">
        <span className="text-[14px] font-medium text-[#6B7280]">{greeting}</span>
        <h1 className="text-[32px] md:text-[36px] font-medium tracking-tight text-[#1B1D35] leading-none">
          {firstName}
        </h1>
        <p className="text-[16px] text-[#A0AEC0] mt-1">
          Continue building understanding today.
        </p>
      </div>

      <div className="shrink-0 flex items-center justify-center gap-2 bg-white/70 backdrop-blur-md border border-white rounded-full px-4 py-2 shadow-sm">
        <Flame className="w-5 h-5 text-[#FC8181]" fill="#FC8181" />
        <span className="font-semibold text-[#1B1D35] text-[14px]">
          {streak} Day Streak
        </span>
      </div>
    </motion.div>
  );
}
