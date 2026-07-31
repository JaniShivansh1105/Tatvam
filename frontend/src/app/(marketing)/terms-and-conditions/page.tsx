import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#1B1D35] font-sans selection:bg-[#6C5CE7] selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-[#4A5568] hover:text-[#6C5CE7] transition-colors mb-12 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E2E8F0]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#F0EEFF] text-[#6C5CE7] rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Terms & Conditions</h1>
              <p className="text-[#4A5568] mt-1">Last updated: July 2026</p>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none prose-headings:text-[#1B1D35] prose-headings:font-bold prose-p:text-[#4A5568] prose-p:leading-relaxed prose-a:text-[#6C5CE7] prose-a:no-underline hover:prose-a:underline">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By creating an account, accessing, or using the Tatvam educational platform ("Service"), you agree to be bound by these Terms & Conditions. If you disagree with any part of the terms, you may not access the Service.
            </p>

            <h2>2. Eligibility</h2>
            <p>
              You must be at least 13 years old to use this Service. If you are under the age of majority in your jurisdiction, you must have your parent or legal guardian's permission to use the Service.
            </p>

            <h2>3. AI-Generated Content Disclaimer</h2>
            <p>
              Tatvam utilizes advanced Artificial Intelligence to generate study notes, flashcards, quizzes, and conversational tutoring. Please be aware of the following:
            </p>
            <ul>
              <li><strong>Accuracy:</strong> AI responses may occasionally be incorrect, incomplete, or lack nuance. Students should always verify important academic information against primary sources.</li>
              <li><strong>Supplementary Tool:</strong> Tatvam is designed to *assist* learning through Active Recall and Socratic methods. It does not replace human teachers, accredited universities, official examinations, or professional educational advice.</li>
            </ul>

            <h2>4. Uploaded Content Ownership & Intellectual Property</h2>
            <p>
              <strong>You Retain Ownership:</strong> You retain all intellectual property rights to the educational materials (PDFs, notes, text) that you upload to the platform. Tatvam does not claim ownership of your user-generated documents.
              <br /><br />
              <strong>Processing License:</strong> By uploading content, you grant Tatvam a limited, non-exclusive license to process, parse, chunk, vector-embed, and temporarily store this content solely for the purpose of providing the platform's learning features (e.g., RAG pipelines) directly back to you.
            </p>

            <h2>5. Acceptable Use & Prohibited Activities</h2>
            <p>
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul>
              <li>Uploading copyrighted material for which you do not hold a license or fair-use justification.</li>
              <li>Attempting to bypass the AI orchestrator's system prompts via prompt injection or malicious hacking.</li>
              <li>Using the Service to generate prohibited, illegal, or abusive content.</li>
              <li>Attempting to reverse-engineer the API, scrape the platform, or bypass JWT authentication layers.</li>
            </ul>

            <h2>6. Suspension & Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms. Upon termination, your right to use the Service will cease immediately, and your associated learning data will be purged.
            </p>

            <h2>7. Service Availability & Limitation of Liability</h2>
            <p>
              Tatvam is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for maximum uptime, we do not guarantee uninterrupted or error-free operation. 
              <br /><br />
              In no event shall Tatvam, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with applicable laws, without regard to its conflict of law provisions.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at legal@tatvam-ai.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
