import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#1B1D35] font-sans selection:bg-[#6C5CE7] selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-[#4A5568] hover:text-[#6C5CE7] transition-colors mb-12 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E2E8F0]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#F0EEFF] text-[#6C5CE7] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
              <p className="text-[#4A5568] mt-1">Last updated: July 2026</p>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none prose-headings:text-[#1B1D35] prose-headings:font-bold prose-p:text-[#4A5568] prose-p:leading-relaxed prose-a:text-[#6C5CE7] prose-a:no-underline hover:prose-a:underline">
            <h2>1. Introduction</h2>
            <p>
              Tatvam ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our application and use our AI-driven educational services. We prioritize your privacy and strictly isolate your data to provide a safe, personalized learning experience.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              To provide you with a highly adaptive learning experience, we collect the following types of information:
            </p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, and encrypted passwords (hashed using Bcrypt).</li>
              <li><strong>Uploaded Documents:</strong> Educational materials (e.g., PDFs) that you upload for semantic processing.</li>
              <li><strong>Learning Preferences:</strong> Your selected primary, native, and secondary languages, as well as notification and theme settings.</li>
              <li><strong>AI Conversations:</strong> Chat transcripts with the AI Mentor and answers to generated quizzes, utilized solely to gauge your mastery of the subject matter.</li>
              <li><strong>Usage Analytics:</strong> Session durations, module completions, and interaction metrics to drive our adaptive progress engine.</li>
            </ul>

            <h2>3. How We Use Data</h2>
            <p>
              Your data is used strictly to power the core features of the Tatvam platform:
            </p>
            <ul>
              <li><strong>AI Processing:</strong> We extract and vector-embed the text from your uploaded documents to enable the Retrieval-Augmented Generation (RAG) pipeline. This allows the AI Mentor to accurately answer questions based on your specific curriculum.</li>
              <li><strong>Personalization:</strong> Your interactions help construct your "Learning DNA," allowing the system to adjust pedagogical pacing and difficulty.</li>
              <li><strong>Service Delivery:</strong> To generate smart notes, flashcards, and quizzes tailored to your uploaded context.</li>
            </ul>

            <h2>4. AI Processing & Third-Party Services</h2>
            <p>
              Tatvam utilizes advanced generative AI models (such as Google Gemini) to process learning materials. We utilize enterprise-tier API endpoints. <strong>Your personal data and uploaded documents are NOT used to train public LLM foundation models.</strong> Data sent to external AI providers is processed statelessly and discarded according to enterprise API retention policies.
            </p>

            <h2>5. Data Storage & Security Measures</h2>
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul>
              <li><strong>Owner Isolation:</strong> All vector embeddings, documents, and chat sessions are strictly hard-bound to your unique user ID. Data leakage between tenants is architecturally impossible.</li>
              <li><strong>JWT Authentication:</strong> Secure, stateless sessions using JSON Web Tokens.</li>
              <li><strong>Input Validation:</strong> Strict Zod validation on all API endpoints to prevent malicious data ingestion.</li>
            </ul>

            <h2>6. User Rights & Account Deletion</h2>
            <p>
              You maintain full ownership of all educational materials you upload. You have the right to access, modify, or delete your personal data. 
              <br /><br />
              <strong>Account Deletion:</strong> If you choose to delete your account, all associated user-generated learning data, including profile information, uploaded documents, vector embeddings, and chat histories, are permanently wiped from our active PostgreSQL databases in accordance with our current implementation architecture.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Tatvam is an educational platform intended for a wide audience. However, we do not knowingly collect personal information from children under the age of 13 without verifiable parental consent. If we learn we have collected such data without consent, we will delete it promptly.
            </p>

            <h2>8. Changes to Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy in the application.
            </p>

            <h2>9. Contact Information</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact our privacy team at privacy@tatvam-ai.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
