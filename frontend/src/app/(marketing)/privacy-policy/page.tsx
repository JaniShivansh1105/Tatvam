import React from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { MarketingContainer } from "@/components/marketing/shared/MarketingContainer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <div className="pt-32 pb-24 min-h-screen">
        <MarketingContainer>
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[24px] shadow-sm border border-[rgba(108,92,231,0.08)] prose prose-slate">
            <h1 className="text-[32px] font-extrabold text-[#1B1D35] mb-8">Privacy Policy</h1>
            <p className="text-[#6B7280]">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="text-[#6B7280] mt-4">
              This is a placeholder for the Tatvam Privacy Policy. 
              The platform respects user data and complies with modern privacy standards.
            </p>
          </div>
        </MarketingContainer>
      </div>
      <Footer />
    </>
  );
}
