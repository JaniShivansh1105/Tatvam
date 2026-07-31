"use client";

import { useEffect } from "react";
import { useEngineStore } from "@/store/engine-store";

// Map full language names to Google Translate codes
const langCodeMap: Record<string, string> = {
  "English": "en",
  "Hindi": "hi",
  "Gujarati": "gu",
  "Marathi": "mr",
  "Tamil": "ta",
  "Telugu": "te",
  "Bengali": "bn",
  "Spanish": "es",
  "French": "fr"
};

export function GoogleTranslate() {
  const language = useEngineStore(s => s.language);

  useEffect(() => {
    // Add the Google Translate script if it doesn't exist
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      // Define the callback
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    }
  }, []);

  useEffect(() => {
    // Update the googtrans cookie and reload if needed, or trigger translation
    const targetCode = langCodeMap[language] || "en";
    const currentCookie = document.cookie.split("; ").find(row => row.startsWith("googtrans="));
    const targetCookieVal = `/en/${targetCode}`;
    
    if (currentCookie !== `googtrans=${targetCookieVal}`) {
      // Set for all possible paths/domains to ensure it applies
      document.cookie = `googtrans=${targetCookieVal}; path=/`;
      document.cookie = `googtrans=${targetCookieVal}; domain=.${window.location.hostname}; path=/`;
      
      // We must reload the page for the Google Translate script to apply the new cookie
      // unless we want to do a complex iframe hack. The requirement says "No reload."
      // BUT Google Translate CAN apply without reload if we trigger the select event.
      
      const applyTranslation = () => {
        const iframe = document.querySelector("iframe.skiptranslate") as HTMLIFrameElement;
        if (!iframe) {
          // If the widget hasn't loaded yet, try again shortly
          setTimeout(applyTranslation, 500);
          return;
        }
        
        const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!innerDoc) return;
        
        // Find the select element in the google translate iframe
        const selects = innerDoc.getElementsByTagName("select");
        if (selects && selects.length > 0) {
          const select = selects[0];
          select.value = targetCode;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      };
      
      applyTranslation();
    }
  }, [language]);

  return (
    <div id="google_translate_element" style={{ display: "none" }}></div>
  );
}
