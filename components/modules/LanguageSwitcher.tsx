"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
    const [lang, setLang] = useState<"en" | "hi">("en");

    useEffect(() => {
        // Add Google Translate script
        const scriptId = "google-translate-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);

            // Add initialization function to window
            (window as any).googleTranslateElementInit = () => {
                new (window as any).google.translate.TranslateElement(
                    { pageLanguage: "en", includedLanguages: "en,hi", autoDisplay: false },
                    "google_translate_element"
                );
            };
        }

        // Check current cookie
        const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
        if (match && match[2]) {
            if (match[2] === "/en/hi") {
                setLang("hi");
            } else {
                setLang("en");
            }
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = lang === "en" ? "hi" : "en";

        // Find the Google Translate dropdown and trigger a change event
        const translateSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;

        if (translateSelect) {
            translateSelect.value = newLang;
            translateSelect.dispatchEvent(new Event('change'));
            setLang(newLang);
        } else {
            console.error("Google Translate script not loaded or dropdown not found.");
            // Fallback: Try setting the cookie directly if the dropdown isn't found
            const cookieValue = newLang === "hi" ? "/en/hi" : "/en/en";
            const domain = window.location.hostname;
            document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}`;
            document.cookie = `googtrans=${cookieValue}; path=/;`;
            setLang(newLang);
            window.location.reload();
        }
    };

    return (
        <>
            <div id="google_translate_element" className="hidden"></div>
            <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="w-full justify-start text-slate-700 hover:text-blue-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 border-slate-200 dark:border-slate-800"
            >
                <Languages className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">
                    {lang === "en" ? "हिन्दी (Hindi)" : "English"}
                </span>
            </Button>
        </>
    );
}
