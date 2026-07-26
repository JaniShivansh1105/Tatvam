"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FF] p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-[0_20px_60px_-15px_rgba(108,92,231,0.15)] border border-[rgba(108,92,231,0.08)]">
        <div className="w-16 h-16 bg-[#FFF5F5] rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-[#E53E3E]" />
        </div>
        
        <h2 className="text-[24px] font-extrabold text-[#1B1D35] mb-2">Something went wrong</h2>
        <p className="text-[15px] text-[#718096] mb-8 leading-relaxed">
          Tatvam encountered an unexpected error. We've been notified and are looking into it.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-3.5 bg-[#1B1D35] text-white rounded-xl text-[14px] font-bold hover:bg-[#2D3748] transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          
          <Link 
            href={ROUTES.DASHBOARD.HOME}
            className="w-full py-3.5 bg-[#F8F9FF] text-[#4A5568] border border-[#E2E8F0] rounded-xl text-[14px] font-bold hover:bg-[#F0E6FF] hover:border-[#6C5CE7] hover:text-[#6C5CE7] transition-all"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
