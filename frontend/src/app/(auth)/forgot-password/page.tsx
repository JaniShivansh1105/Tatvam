"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, ArrowLeft, Mail, KeyRound } from "lucide-react";
import { apiClient } from "../../../lib/api-client";
import { ROUTES } from "@/config/routes";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim(),
});

const otpSchema = z.object({
  otp: z.string().length(5, "OTP must be exactly 5 digits").regex(/^\d+$/, "OTP must contain only numbers"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [globalError, setGlobalError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const onEmailSubmit = async (data: EmailFormValues) => {
    try {
      setIsLoading(true);
      setGlobalError(undefined);
      
      await apiClient.post("/auth/forgot-password", data);
      
      setEmail(data.email);
      setStep("otp");
    } catch (error: any) {
      const apiError = error?.response?.data?.error;
      const message = apiError?.message || error?.response?.data?.message || "An unexpected error occurred. Please try again.";
      setGlobalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onOTPSubmit = async (data: OTPFormValues) => {
    try {
      setIsLoading(true);
      setGlobalError(undefined);
      
      const response = await apiClient.post("/auth/verify-otp", {
        email,
        otp: data.otp
      });
      
      const { resetToken } = response.data.data;
      
      // Navigate to reset password with token
      router.push(`${ROUTES.RESET_PASSWORD}?token=${resetToken}`);
    } catch (error: any) {
      const apiError = error?.response?.data?.error;
      const message = apiError?.message || error?.response?.data?.message || "Invalid or expired OTP. Please try again.";
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
        <motion.div 
          animate={{ x: [0, -100, 50, 0], y: [0, 100, -50, 0], scale: [1, 1.1, 1.3, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#FFD1E6] blur-[150px] opacity-40 mix-blend-multiply z-0" 
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
              {step === "email" ? <Mail className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
            </div>
            <h1 className="text-[28px] font-medium tracking-tight text-[#1B1D35] mb-2">
              {step === "email" ? "Forgot Password" : "Check Your Email"}
            </h1>
            <p className="text-[#6B7280] text-[15px] leading-relaxed max-w-[320px]">
              {step === "email" 
                ? "Enter your email address and we'll send you a 5-digit code to reset your password."
                : `We sent a 5-digit code to ${email}. It expires in 2 minutes.`}
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
          </AnimatePresence>

          {step === "email" ? (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[13px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full h-[52px] bg-white/80 backdrop-blur-md border rounded-[18px] px-5 text-[15px] outline-none transition-all duration-200 hover:bg-white hover:border-[#A29BFE]/60 focus:bg-white focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${emailForm.formState.errors.email ? "border-[#FC8181]" : "border-[#E2E8F0]"}`}
                  {...emailForm.register("email")}
                />
                {emailForm.formState.errors.email && (
                  <p className="text-[13px] text-[#E53E3E] font-medium mt-1 ml-1">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="mt-2 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] rounded-[22px] blur-[10px] opacity-30 group-hover:opacity-40 transition duration-300" />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-[56px] relative rounded-[18px] bg-gradient-to-b from-[#7F71F5] to-[#6C5CE7] text-white font-medium text-[16px] tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden flex items-center justify-center disabled:opacity-80"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : "Send Code"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="otp" className="text-[13px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                  5-Digit Code
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={5}
                  placeholder="12345"
                  className={`w-full h-[52px] bg-white/80 backdrop-blur-md border rounded-[18px] px-5 text-[18px] tracking-widest text-center outline-none transition-all duration-200 hover:bg-white hover:border-[#A29BFE]/60 focus:bg-white focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${otpForm.formState.errors.otp ? "border-[#FC8181]" : "border-[#E2E8F0]"}`}
                  {...otpForm.register("otp")}
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-[13px] text-[#E53E3E] font-medium mt-1 text-center">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div className="mt-2 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] rounded-[22px] blur-[10px] opacity-30 group-hover:opacity-40 transition duration-300" />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-[56px] relative rounded-[18px] bg-gradient-to-b from-[#7F71F5] to-[#6C5CE7] text-white font-medium text-[16px] tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden flex items-center justify-center disabled:opacity-80"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : "Verify Code"}
                </button>
              </div>
              
              <div className="text-center mt-2">
                <button 
                  type="button" 
                  onClick={() => setStep("email")}
                  className="text-[14px] text-[#6C5CE7] font-medium hover:text-[#8B7CF6]"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}

        </motion.div>
      </div>
    </div>
  );
}
