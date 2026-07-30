"use client";
import React, { useEffect, useState } from "react";
import { useEngineStore } from "@/store/engine-store";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export function TranslatedContent({ html, text }: { html?: string, text?: string }) {
  const language = useEngineStore(state => state.language);
  const [content, setContent] = useState(html || text || "");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let active = true;
    if (language === "English") {
      setContent(html || text || "");
      return;
    }
    
    setIsTranslating(true);
    apiClient.post('/ai/translate', { 
      text: html || text || "", 
      targetLanguage: language, 
      format: html !== undefined ? 'html' : 'text' 
    }).then(res => {
      if (active && res.data.success) {
        setContent(res.data.data.translated);
      }
    }).catch(e => {
       console.error("Translation error", e);
       if (active) setContent(html || text || "");
    }).finally(() => {
       if (active) setIsTranslating(false);
    });

    return () => { active = false; };
  }, [language, html, text]);

  if (isTranslating) {
    return (
      <div className="animate-pulse text-[#6C5CE7] flex flex-col gap-2 p-4 rounded-xl bg-[#F8F9FF] border border-[#6C5CE7]/20">
        <div className="flex items-center gap-2 font-medium">
            <Loader2 className="w-5 h-5 animate-spin" /> Translating to {language}...
        </div>
      </div>
    );
  }

  if (html !== undefined) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <>{content}</>;
}
