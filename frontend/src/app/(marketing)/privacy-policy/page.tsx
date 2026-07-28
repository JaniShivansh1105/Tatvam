"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#1B1D35] selection:bg-[#6C5CE7]/20 relative overflow-hidden">
      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[40vw] h-[40vw] rounded-full bg-[#E5E1FF] blur-[100px] opacity-60 mix-blend-multiply" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] -left-[10%] w-[35vw] h-[35vw] rounded-full bg-[#FFD1E6] blur-[120px] opacity-40 mix-blend-multiply" 
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Link 
          href={ROUTES.HOME} 
          className="inline-flex items-center gap-2 px-4 py-2 mb-10 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-[#6B7280] hover:text-[#1B1D35] hover:bg-white transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Home</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(108,92,231,0.05)]"
        >
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-[#1B1D35]">Privacy Policy</h1>
          <p className="text-[#6B7280] mb-12">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-slate max-w-none prose-headings:text-[#1B1D35] prose-headings:font-medium prose-p:text-[#4A5568] prose-p:leading-relaxed prose-li:text-[#4A5568]">
            <section className="mb-10">
              <h2>1. Introduction</h2>
              <p>
                Welcome to Tatvam. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our website 
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="mb-10">
              <h2>2. The Data We Collect About You</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul>
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier, and date of birth.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                <li><strong>Profile Data:</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services (including learning progress and DNA).</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2>3. How We Use Your Personal Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul>
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
              <p>Specifically, your learning data is used exclusively to adapt and personalize your educational experience through our AI models.</p>
            </section>

            <section className="mb-10">
              <h2>4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section className="mb-10">
              <h2>5. Your Legal Rights</h2>
              <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
              <ul>
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </section>

            <section>
              <h2>6. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@tatvam.ai.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
