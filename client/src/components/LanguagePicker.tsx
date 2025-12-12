import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLanguage, LANGUAGES, type SupportedLanguage } from "@/context/language-context";

export function LanguagePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const languageOptions = Object.values(LANGUAGES);
  const currentLang = LANGUAGES[language];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 transition-colors"
        style={{ color: "rgba(94, 234, 212, 0.7)" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "rgba(94, 234, 212, 1)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(94, 234, 212, 0.7)"}
        aria-label={`Current language: ${currentLang.name}. Click to change.`}
        data-testid="button-language-picker"
      >
        <Globe className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-full mt-2 z-50 min-w-[200px] rounded-xl overflow-hidden"
              style={{
                background: "rgba(15, 23, 28, 0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(94, 234, 212, 0.15)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              role="menu"
              aria-label="Language selection"
              data-testid="language-picker-menu"
            >
              {languageOptions.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as SupportedLanguage);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                  style={{
                    fontFamily: "'Poppins', system-ui, sans-serif",
                    borderTop: index > 0 ? "1px solid rgba(94, 234, 212, 0.08)" : "none",
                    background: language === lang.code ? "rgba(94, 234, 212, 0.1)" : "transparent",
                    color: language === lang.code ? "rgb(94, 234, 212)" : "rgba(255, 255, 255, 0.8)",
                  }}
                  onMouseEnter={(e) => {
                    if (language !== lang.code) {
                      e.currentTarget.style.background = "rgba(94, 234, 212, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== lang.code) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                  role="menuitem"
                  data-testid={`button-language-${lang.code}`}
                >
                  <span 
                    className="text-xs font-medium uppercase tracking-wider opacity-60"
                    style={{ minWidth: "24px" }}
                  >
                    {lang.code}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">
                      {lang.nativeName}
                    </span>
                  </span>
                  {language === lang.code && (
                    <Check className="w-4 h-4" style={{ color: "rgb(94, 234, 212)" }} />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
