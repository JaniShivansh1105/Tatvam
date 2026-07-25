import React from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { Problem } from "@/components/marketing/Problem";
import { WhyTatvam } from "@/components/marketing/WhyTatvam";
import { AdaptiveIntelligence } from "@/components/marketing/AdaptiveIntelligence";
import { AIMentorDemo } from "@/components/marketing/AIMentorDemo";
import { CognitiveScience } from "@/components/marketing/CognitiveScience";
import { MarketingDashboardPreview } from "@/components/marketing/DashboardPreview";
import { LearnerTypes } from "@/components/marketing/LearnerTypes";
import { Comparison } from "@/components/marketing/Comparison";
import { Philosophy } from "@/components/marketing/Philosophy";
import { FAQ } from "@/components/marketing/FAQ";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Footer } from "@/components/marketing/Footer";
import { FloatingLogo } from "@/components/marketing/FloatingLogo";

export default function MarketingHomePage() {
  return (
    <>
      <FloatingLogo />
      <Navbar />
      <Hero />
      <Problem />
      <WhyTatvam />
      <AdaptiveIntelligence />
      <AIMentorDemo />
      <CognitiveScience />
      <MarketingDashboardPreview />
      <LearnerTypes />
      <Comparison />
      <Philosophy />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
