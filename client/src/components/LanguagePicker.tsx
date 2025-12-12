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
              className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              role="menu"
              aria-label="Language selection"
              data-testid="language-picker-menu"
            >
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as SupportedLanguage);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    language === lang.code
                      ? "bg-teal-600/20 text-teal-400"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                  role="menuitem"
                  data-testid={`button-language-${lang.code}`}
                >
                  <span className="text-lg" aria-hidden="true">
                    {getFlagEmoji(lang.flag)}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">
                      {lang.nativeName}
                    </span>
                    <span className="block text-xs text-zinc-500">
                      {lang.name}
                    </span>
                  </span>
                  {language === lang.code && (
                    <Check className="w-4 h-4 text-teal-500" />
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

function getFlagEmoji(countryCode: string): string {
  const flags: Record<string, string> = {
    US: "\u{1F1FA}\u{1F1F8}",
    ES: "\u{1F1EA}\u{1F1F8}",
    FR: "\u{1F1EB}\u{1F1F7}",
    DE: "\u{1F1E9}\u{1F1EA}",
    SA: "\u{1F1F8}\u{1F1E6}",
  };
  return flags[countryCode] || "\u{1F310}";
}
