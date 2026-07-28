"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff, AlertCircle, Map, Target, RefreshCcw, Award, ArrowLeft, User as UserIcon, Users, Check } from "lucide-react";
import { apiClient } from "../../../lib/api-client";
import { ROUTES } from "@/config/routes";
import { CountrySelector } from "@/components/auth/CountrySelector";
import { Controller } from "react-hook-form";

const passwordValidation = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const getMobileConfig = (code: string) => {
  switch (code) {
    case "+91": return { len: 10, msg: "Please enter a valid 10-digit mobile number.", ph: "XXXXXXXXXX" };
    case "+1": return { len: 10, msg: "Please enter a valid 10-digit mobile number.", ph: "XXXXXXXXXX" };
    case "+44": return { len: 10, msg: "Please enter a valid UK mobile number.", ph: "XXXXXXXXXX" };
    case "+61": return { len: 9, msg: "Please enter a valid Australian mobile number.", ph: "XXXXXXXXX" };
    case "+49": return { len: 11, msg: "Please enter a valid German mobile number.", ph: "XXXXXXXXXXX" };
    case "+81": return { len: 10, msg: "Please enter a valid Japanese mobile number.", ph: "XXXXXXXXXX" };
    case "": return { len: 7, msg: "Please select a country code first.", ph: "Mobile Number" };
    default: return { len: 7, msg: "Mobile number must be at least 7 digits.", ph: "Mobile Number" };
  }
};

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").trim(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").trim(),
  email: z.string().email("Please enter a valid email address").trim(),
  countryCode: z.string().min(1, "Country code is required").trim(),
  mobileNumber: z.string().trim(),
  password: passwordValidation,
  confirmPassword: z.string().min(8, "Confirm password is required"),
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
  }

  if (!data.mobileNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Mobile number is required",
      path: ["mobileNumber"],
    });
  } else {
    const config = getMobileConfig(data.countryCode);
    const numericOnly = data.mobileNumber.replace(/\D/g, "");
    if (numericOnly.length < config.len) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: config.msg,
        path: ["mobileNumber"],
      });
    }
  }
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<0 | 1>(0); // 0 = Select Type, 1 = Form
  const [accountType, setAccountType] = useState<"STUDENT" | "PARENT">("STUDENT");
  const [globalError, setGlobalError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState("CapsLock"));
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      countryCode: "",
    },
  });

  const handleAccountTypeChange = (type: "STUDENT" | "PARENT") => {
    setAccountType(type);
    setStep(1);
    reset({ countryCode: "" }); // Reset form state
    setGlobalError(undefined);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleBack = () => {
    setStep(0);
    reset({ countryCode: "" }); // Reset form state
    setGlobalError(undefined);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");
  const countryCodeValue = watch("countryCode", "");
  const isPasswordMatch = passwordValue.length > 0 && confirmPasswordValue === passwordValue;
  const mobileConfig = getMobileConfig(countryCodeValue);

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
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        password: data.password,
        accountType,
        countryCode: data.countryCode,
        mobileNumber: data.mobileNumber,
        termsAccepted: data.termsAccepted,
      };

      await apiClient.post("/auth/register", payload);
      
      // Phase 6: User MUST authenticate after registration. Redirect to Login.
      router.push(`${ROUTES.LOGIN}?registered=true`);
    } catch (error: any) {
      if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
        setGlobalError("Unable to connect to the server. Please check your internet connection.");
      } else {
        const apiError = error?.response?.data?.error;
        const fieldErrors = apiError?.fields ? Object.values(apiError.fields).flat().join(". ") : null;
        const errorMessage = fieldErrors || apiError?.message || error?.response?.data?.message || "Registration failed. Please check your details.";
        setGlobalError(errorMessage);
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
        
        {/* LEFT PANEL */}
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
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[480px] bg-white/70 backdrop-blur-2xl border border-white/80 p-8 sm:p-10 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(108,92,231,0.05),0_0_20px_0_rgba(108,92,231,0.02)] relative flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Mobile Header */}
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

            {step === 0 ? (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-[20px] font-semibold text-[#1B1D35] mb-2">Choose Account Type</h2>
                  <p className="text-[14px] text-[#718096]">Select how you will be using Tatvam to get started.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => handleAccountTypeChange("STUDENT")}
                    className="flex items-center gap-4 p-5 rounded-[20px] bg-white border border-[#E2E8F0] hover:border-[#6C5CE7] hover:shadow-[0_4px_20px_-10px_rgba(108,92,231,0.15)] transition-all group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/30"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#F0E6FF] flex items-center justify-center text-[#6C5CE7] group-hover:scale-110 transition-transform">
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B1D35] text-[16px]">Student</h3>
                      <p className="text-[13px] text-[#718096] mt-0.5">I want to learn and improve my skills.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleAccountTypeChange("PARENT")}
                    className="flex items-center gap-4 p-5 rounded-[20px] bg-white border border-[#E2E8F0] hover:border-[#6C5CE7] hover:shadow-[0_4px_20px_-10px_rgba(108,92,231,0.15)] transition-all group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/30"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#F0E6FF] flex items-center justify-center text-[#6C5CE7] group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B1D35] text-[16px]">Parent / Guardian</h3>
                      <p className="text-[13px] text-[#718096] mt-0.5">I want to track my child's progress.</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit(onSubmit)} 
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <button type="button" onClick={handleBack} className="text-[#A0AEC0] hover:text-[#1B1D35] transition-colors p-1">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-[18px] font-semibold text-[#1B1D35]">{accountType === "STUDENT" ? "Student Registration" : "Parent Registration"}</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                      First Name *
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      className={`w-full h-[50px] bg-white/80 backdrop-blur-md border rounded-[16px] px-5 text-[14px] outline-none transition-all duration-200 focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.firstName ? "border-[#FC8181]" : "border-[#E2E8F0]"}`}
                      {...register("firstName")}
                    />
                    {errors.firstName && <p className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1">{errors.firstName.message}</p>}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className={`w-full h-[50px] bg-white/80 backdrop-blur-md border rounded-[16px] px-5 text-[14px] outline-none transition-all duration-200 focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.lastName ? "border-[#FC8181]" : "border-[#E2E8F0]"}`}
                      {...register("lastName")}
                    />
                    {errors.lastName && <p className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full h-[50px] bg-white/80 backdrop-blur-md border rounded-[16px] px-5 text-[14px] outline-none transition-all duration-200 focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.email ? "border-[#FC8181]" : "border-[#E2E8F0]"}`}
                    {...register("email")}
                  />
                  {errors.email && <p className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <div className="flex flex-col gap-1 relative z-30">
                    <label className="text-[12px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80 whitespace-nowrap">
                      Code *
                    </label>
                    <Controller
                      control={control}
                      name="countryCode"
                      render={({ field }) => (
                        <CountrySelector
                          value={field.value}
                          onChange={field.onChange}
                          error={!!errors.countryCode}
                          ref={field.ref}
                        />
                      )}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1 z-10">
                    <label className="text-[12px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder={mobileConfig.ph}
                      className={`w-full h-[50px] bg-white/80 backdrop-blur-md border rounded-[16px] px-5 text-[14px] outline-none transition-all duration-200 focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.mobileNumber ? "border-[#FC8181]" : "border-[#E2E8F0]"}`}
                      {...register("mobileNumber")}
                    />
                  </div>
                </div>
                {(errors.countryCode || errors.mobileNumber) && <p className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1">{errors.countryCode?.message || errors.mobileNumber?.message}</p>}

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full h-[50px] bg-white/80 backdrop-blur-md border rounded-[16px] px-5 pr-12 text-[14px] outline-none transition-all duration-200 focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.password ? "border-[#FC8181]" : "border-[#E2E8F0]"}`}
                      {...register("password")}
                      onKeyUp={handleKeyUp}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[13px] text-[#A0AEC0] hover:text-[#1B1D35] p-1 rounded-md"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {passwordValue.length > 0 && (
                    <div className="flex gap-1 px-1 mt-1 overflow-hidden items-center">
                      <div className="flex flex-1 gap-1 h-[3px]">
                        <div className={`h-full flex-1 rounded-full transition-colors duration-500 ${strength >= 25 ? 'bg-[#FC8181]' : 'bg-[#EDF2F7]'}`} />
                        <div className={`h-full flex-1 rounded-full transition-colors duration-500 ${strength >= 50 ? 'bg-[#F6AD55]' : 'bg-[#EDF2F7]'}`} />
                        <div className={`h-full flex-1 rounded-full transition-colors duration-500 ${strength >= 75 ? 'bg-[#A29BFE]' : 'bg-[#EDF2F7]'}`} />
                        <div className={`h-full flex-1 rounded-full transition-colors duration-500 ${strength >= 100 ? 'bg-[#6C5CE7]' : 'bg-[#EDF2F7]'}`} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider min-w-[55px] text-right" style={{ color: strength < 50 ? '#FC8181' : strength < 100 ? '#A29BFE' : '#6C5CE7' }}>
                        {strength < 25 ? "Weak" : strength < 75 ? "Fair" : strength < 100 ? "Strong" : "Excellent"}
                      </span>
                    </div>
                  )}
                  {capsLockOn && <p className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Caps Lock is ON</p>}
                  {errors.password && <p className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1">{errors.password.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-[#1B1D35] ml-1 uppercase tracking-wider opacity-80">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full h-[50px] bg-white/80 backdrop-blur-md border rounded-[16px] px-5 pr-12 text-[14px] outline-none transition-all duration-200 focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 ${errors.confirmPassword ? "border-[#FC8181]" : "border-[#E2E8F0]"}`}
                      {...register("confirmPassword")}
                      onKeyUp={handleKeyUp}
                    />
                    {isPasswordMatch && <Check className="absolute right-10 top-[17px] w-4 h-4 text-[#48BB78]" />}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-[13px] text-[#A0AEC0] hover:text-[#1B1D35] p-1 rounded-md"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {capsLockOn && <p className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Caps Lock is ON</p>}
                  {errors.confirmPassword && <p className="text-[12px] text-[#E53E3E] font-medium mt-0.5 ml-1">{errors.confirmPassword.message}</p>}
                </div>

                <div className="mt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border-2 border-[#E2E8F0] rounded-[6px] checked:bg-[#6C5CE7] checked:border-[#6C5CE7] transition-all cursor-pointer"
                        {...register("termsAccepted")}
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                        <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-[13px] text-[#4A5568] leading-snug select-none">
                      {accountType === "STUDENT" 
                        ? <>I have read and agree to the <Link href="/terms" className="text-[#6C5CE7] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#6C5CE7] hover:underline">Privacy Policy</Link>. If I am under the minimum age required in my region, I confirm that I have permission from my parent or legal guardian to use Tatvam.</>
                        : <>I confirm that I am the parent or legal guardian of the learner and agree to the <Link href="/terms" className="text-[#6C5CE7] hover:underline">Terms of Service</Link>, <Link href="/privacy" className="text-[#6C5CE7] hover:underline">Privacy Policy</Link> and <Link href="/parent-responsibilities" className="text-[#6C5CE7] hover:underline">Parent Responsibilities</Link>.</>
                      }
                    </span>
                  </label>
                  {errors.termsAccepted && <p className="text-[12px] text-[#E53E3E] font-medium mt-1 ml-1">{errors.termsAccepted.message}</p>}
                </div>

                <div className="mt-4 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] rounded-[22px] blur-[10px] opacity-30 group-hover:opacity-40 transition duration-300" />
                  <motion.button 
                    type="submit" 
                    disabled={isLoading}
                    whileHover={{ y: -1 }} 
                    whileTap={{ scale: 0.98, y: 0 }} 
                    className="w-full h-[54px] relative rounded-[18px] bg-gradient-to-b from-[#7F71F5] to-[#6C5CE7] text-white font-medium text-[15px] tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_10px_rgba(108,92,231,0.2)] overflow-hidden flex items-center justify-center border-none disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <span className="drop-shadow-sm z-10">Create account</span>}
                  </motion.button>
                </div>
              </motion.form>
            )}

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
