"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { apiClient } from "../../../lib/api-client";
import { ROUTES } from "@/config/routes";

const passwordValidation = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const resetSchema = z.object({
  newPassword: passwordValidation,
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [globalError, setGlobalError] = useState<string | undefined>();
  const [globalSuccess, setGlobalSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    if (!token) {
      setGlobalError("Invalid or missing reset token. Please request a new password reset.");
    }
  }, [token]);

  const onSubmit = async (data: ResetFormValues) => {
    if (!token) return;

    try {
      setIsLoading(true);
      setGlobalError(undefined);
      
      const response = await apiClient.post("/auth/reset-password", {
        token,
        newPassword: data.newPassword
      });
      
      setGlobalSuccess(response.data.data.message);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 2000);
      
    } catch (error: any) {
      const apiError = error?.response?.data?.error;
      const message = apiError?.message || error?.response?.data?.message || "An unexpected error occurred. Please try again.";
      setGlobalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-[100dvh] overflow-hidden bg-[#F8F9FF] selection:bg-[#6C5CE7]/20 text-[#1B1D35] font-sans relative">
      
      {/* HOME BUTTON */}
      <Link 
        href={ROUTES.LOGIN} 
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_-10px_rgba(108,92,231,0.1)] text-[#1B1D35] font-semibold text-[14px] hover:bg-white/80 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 text-[#6C5CE7] group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
        Back to Login
      </Link>

      {/* GLOBAL DREAMY MESH BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[#F8F9FF] z-0" />
        <motion.div 
          animate={{ x: [0, 100, -50, 0], y: [0, -50, 100, 0], scale: [1, 1.2, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[#E5E1FF] blur-[140px] opacity-60 mix-blend-multiply z-0" 
        />
      </div>

      <div className="flex w-full h-full relative z-10 flex-col items-center justify-center p-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px] bg-white/70 backdrop-blur-2xl border border-white/80 p-8 sm:p-10 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(108,92,231,0.05),0_0_20px_0_rgba(108,92,231,0.02)] relative flex flex-col"
        >
          
          <div className="flex flex-col mb-8 text-center items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center shadow-md mb-4 text-white">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-[28px] font-medium tracking-tight text-[#1B1D35] mb-2">
              Reset Password
            </h1>
            <p className="text-[#6B7280] text-[15px] leading-relaxed max-w-[320px]">
              Enter your new password below to regain access to your account.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {globalError && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#FFF5F5] text-[#E53E3E] text-[14px] px-4 py-3 rounded-[16px] mb-6 flex items-center gap-3 overflow-hidden border border-[#FED7D7]"
              >
                <AlertCircle className="w-5 h-5 shrink-0" strokeWidth={2} />
                <p className="font-medium">{globalError}</p>
              </motion.div>
            )}
            {globalSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#F0FFF4] text-[#48BB78] text-[14px] px-4 py-3 rounded-[16px] mb-6 flex items-center gap-3 overflow-hidden border border-[#C6F6D5]"
              >
                <CheckCircle className="w-5 h-5 shrink-0" strokeWidth={2} />
                <p className="font-medium">{globalSuccess}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className="text-[13px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full h-[52px] bg-white/80 backdrop-blur-md border rounded-[18px] px-5 pr-12 text-[15px] outline-none transition-all duration-200 hover:bg-white hover:border-[#A29BFE]/60 focus:bg-white focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.newPassword ? "border-[#FC8181]" : "border-[#E2E8F0]"}`}
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[14px] text-[#A0AEC0] hover:text-[#1B1D35] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-[13px] text-[#E53E3E] font-medium mt-1 ml-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-[13px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full h-[52px] bg-white/80 backdrop-blur-md border rounded-[18px] px-5 pr-12 text-[15px] outline-none transition-all duration-200 hover:bg-white hover:border-[#A29BFE]/60 focus:bg-white focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.confirmPassword ? "border-[#FC8181]" : "border-[#E2E8F0]"}`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-[14px] text-[#A0AEC0] hover:text-[#1B1D35] transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[13px] text-[#E53E3E] font-medium mt-1 ml-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="mt-2 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] rounded-[22px] blur-[10px] opacity-30 group-hover:opacity-40 transition duration-300" />
              <button 
                type="submit" 
                disabled={isLoading || !token}
                className="w-full h-[56px] relative rounded-[18px] bg-gradient-to-b from-[#7F71F5] to-[#6C5CE7] text-white font-medium text-[16px] tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden flex items-center justify-center disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : "Update Password"}
              </button>
            </div>
          </form>

        </motion.div>
      </div>
    </div>
  );
}


