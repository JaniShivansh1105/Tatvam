"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff, AlertCircle, Map, Target, RefreshCcw, Award, ArrowLeft } from "lucide-react";
import { apiClient } from "../../../lib/api-client";
import { useAuthStore } from "../../../store/auth-store";
import { ROUTES } from "@/config/routes";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").trim(),
  username: z.string().min(3, "Username must be at least 3 characters").max(30).trim().optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address").trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  
  const [globalError, setGlobalError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = watch("password", "");
  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };
  const strength = calculateStrength(passwordValue);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setGlobalError(undefined);
      
      const payload = {
        ...data,
        username: data.username === "" ? undefined : data.username,
      };

      const response = await apiClient.post("/auth/register", payload);
      const { user, accessToken } = response.data.data;
      
      setToken(accessToken);
      setUser(user);
      
      router.push(ROUTES.DASHBOARD.HOME);
    } catch (error: any) {
      if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
        setGlobalError("Unable to connect to the server. Please check your internet connection.");
      } else if (error?.response?.data?.message) {
        setGlobalError(error.response.data.message);
      } else if (error?.response?.status === 401) {
        setGlobalError("Authentication failed. Please check your credentials.");
      } else if (error?.response?.status === 403) {
        setGlobalError("You do not have permission to perform this action.");
      } else if (error?.response?.status >= 500) {
        setGlobalError("Our servers are currently experiencing issues. Please try again later.");
      } else {
        setGlobalError("Registration failed due to a system error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerFeatures = [
    { icon: Map, title: "Smart Roadmap", subtitle: "Dynamic path" },
    { icon: Target, title: "Weakness Map", subtitle: "Targeted focus" },
    { icon: RefreshCcw, title: "Active Recall", subtitle: "Practice efficiently" },
    { icon: Award, title: "True Retention", subtitle: "Achieve your goals" },
  ];

  return (
    <div className="flex w-full h-[100dvh] overflow-hidden bg-[#F8F9FF] selection:bg-[#6C5CE7]/20 text-[#1B1D35] font-sans relative">
      
      {/* HOME BUTTON */}
      <Link 
        href={ROUTES.HOME} 
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_-10px_rgba(108,92,231,0.1)] text-[#1B1D35] font-semibold text-[14px] hover:bg-white/80 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 text-[#6C5CE7] group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
        Back to Home
      </Link>

      {/* GLOBAL DREAMY MESH BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[#F8F9FF] z-0" />
        <motion.div 
          animate={{ x: [0, -100, 50, 0], y: [0, 80, -50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] w-[70vw] h-[70vw] rounded-full bg-[#FFF0F7] blur-[140px] opacity-60 mix-blend-multiply z-0" 
        />
        <motion.div 
          animate={{ x: [0, 100, -50, 0], y: [0, -100, 50, 0], scale: [1, 1.2, 1.1, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#E5E1FF] blur-[150px] opacity-40 mix-blend-multiply z-0" 
        />
        <motion.div 
          animate={{ x: [0, -50, 100, 0], y: [0, 80, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[0%] left-[30%] w-[50vw] h-[50vw] rounded-full bg-[#F0E6FF] blur-[120px] opacity-30 mix-blend-multiply z-0" 
        />
      </div>

      <div className="flex w-full h-full relative z-10 flex-col md:flex-row">
        
        {/* LEFT PANEL - MINIMAL TYPOGRAPHY & PILLS */}
        <div className="hidden md:flex flex-col w-[50%] h-full relative justify-center px-10 lg:px-20 overflow-hidden">
          
          <div className="relative z-10 max-w-[480px]">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[44px] lg:text-[52px] font-medium tracking-tight leading-[1.05] text-[#1B1D35] mb-3 drop-shadow-sm"
            >
              Start learning smarter.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#6B7280] text-[17px] leading-relaxed max-w-[400px] mb-10"
            >
              Join a platform designed entirely around how the human mind actually processes and masters information.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-4"
            >
              {registerFeatures.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-[20px] bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 transition-colors duration-300 shadow-[0_4px_20px_-10px_rgba(108,92,231,0.1)]"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#6C5CE7] shadow-sm shrink-0">
                    <feature.icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-[#1B1D35] leading-tight mb-0.5">{feature.title}</span>
                    <span className="text-[12px] font-medium text-[#718096] leading-tight">{feature.subtitle}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* RIGHT PANEL - AUTH FORM */}
        <div className="flex flex-col w-full md:w-[50%] h-full relative items-center justify-center p-6 z-20">
          
          {/* Form Container (Contains everything including the link) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[440px] bg-white/70 backdrop-blur-2xl border border-white/80 p-8 sm:p-10 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(108,92,231,0.05),0_0_20px_0_rgba(108,92,231,0.02)] relative flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Mobile Header (Only visible on small screens) */}
            <div className="md:hidden flex flex-col mb-4">
              <h1 className="text-[28px] font-medium tracking-tight text-[#1B1D35] mb-1">Join Tatvam.</h1>
              <p className="text-[#6C5CE7] text-[16px]">Start learning smarter.</p>
            </div>

            <AnimatePresence mode="wait">
              {globalError && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#FFF5F5] text-[#E53E3E] text-[14px] px-4 py-3 rounded-[16px] mb-5 flex items-center gap-3 overflow-hidden border border-[#FED7D7]"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" strokeWidth={2} />
                  <p className="font-medium">{globalError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1">
                <label htmlFor="fullName" className="text-[12px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    className={`w-full h-[50px] bg-white/80 backdrop-blur-md border rounded-[16px] px-5 text-[14px] outline-none transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.015)] hover:bg-white hover:border-[#A29BFE]/60 focus:bg-white focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 placeholder:text-[#6B7280]/40 ${errors.fullName ? "border-[#FC8181] focus:border-[#E53E3E] focus:ring-[#E53E3E]/15" : "border-[#E2E8F0]"}`}
                    {...register("fullName")}
                  />
                </div>
                <AnimatePresence>
                  {errors.fullName && (
                    <motion.p initial={{ opacity: 0, height: 0, y: -5 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0 }} className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1">
                      {errors.fullName.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-[12px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    className={`w-full h-[50px] bg-white/80 backdrop-blur-md border rounded-[16px] px-5 text-[14px] outline-none transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.015)] hover:bg-white hover:border-[#A29BFE]/60 focus:bg-white focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 placeholder:text-[#6B7280]/40 ${errors.email ? "border-[#FC8181] focus:border-[#E53E3E] focus:ring-[#E53E3E]/15" : "border-[#E2E8F0]"}`}
                    {...register("email")}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, height: 0, y: -5 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0 }} className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1">
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between ml-1">
                  <label htmlFor="username" className="text-[12px] font-semibold text-[#1B1D35] uppercase tracking-wider opacity-80">
                    Username
                  </label>
                  <span className="text-[12px] text-[#A0AEC0] font-medium">Optional</span>
                </div>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="johndoe123"
                    className={`w-full h-[50px] bg-white/80 backdrop-blur-md border rounded-[16px] px-5 text-[14px] outline-none transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.015)] hover:bg-white hover:border-[#A29BFE]/60 focus:bg-white focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 placeholder:text-[#6B7280]/40 ${errors.username ? "border-[#FC8181] focus:border-[#E53E3E] focus:ring-[#E53E3E]/15" : "border-[#E2E8F0]"}`}
                    {...register("username")}
                  />
                </div>
                <AnimatePresence>
                  {errors.username && (
                    <motion.p initial={{ opacity: 0, height: 0, y: -5 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0 }} className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1">
                      {errors.username.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-[12px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={`w-full h-[50px] bg-white/80 backdrop-blur-md border rounded-[16px] px-5 pr-12 text-[14px] outline-none transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.015)] hover:bg-white hover:border-[#A29BFE]/60 focus:bg-white focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 placeholder:text-[#6B7280]/40 ${errors.password ? "border-[#FC8181] focus:border-[#E53E3E] focus:ring-[#E53E3E]/15" : "border-[#E2E8F0]"}`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[13px] text-[#A0AEC0] hover:text-[#1B1D35] transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/30"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Premium Animated Password Strength */}
                <AnimatePresence>
                  {passwordValue.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                      animate={{ opacity: 1, height: "auto", marginTop: 4 }} 
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="flex gap-1 px-1 overflow-hidden"
                    >
                      <div className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${strength >= 25 ? 'bg-[#FC8181]' : 'bg-[#EDF2F7]'}`} />
                      <div className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${strength >= 50 ? 'bg-[#F6AD55]' : 'bg-[#EDF2F7]'}`} />
                      <div className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${strength >= 75 ? 'bg-[#A29BFE]' : 'bg-[#EDF2F7]'}`} />
                      <div className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${strength >= 100 ? 'bg-[#6C5CE7]' : 'bg-[#EDF2F7]'}`} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, height: 0, y: -5 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0 }} className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1">
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-2 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] rounded-[22px] blur-[10px] opacity-30 group-hover:opacity-40 transition duration-300" />
                <motion.button 
                  type="submit" 
                  disabled={isLoading}
                  whileHover={{ y: -1 }} 
                  whileTap={{ scale: 0.98, y: 0 }} 
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-full h-[54px] relative rounded-[18px] bg-gradient-to-b from-[#7F71F5] to-[#6C5CE7] text-white font-medium text-[15px] tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_10px_rgba(108,92,231,0.2)] overflow-hidden flex items-center justify-center border-none disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      </motion.div>
                    ) : (
                      <motion.span key="text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="drop-shadow-sm z-10">
                        Create account
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[rgba(108,92,231,0.08)] text-center text-[13px] text-[#718096] font-medium">
              Already have an account?{" "}
              <Link href={ROUTES.LOGIN} className="font-semibold text-[#1B1D35] relative group inline-block ml-1">
                <span className="relative z-10 hover:text-[#6C5CE7] transition-colors duration-200">Sign in</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#6C5CE7] transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
