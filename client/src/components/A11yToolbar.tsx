import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Type, Sun, Zap, Volume2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  useAccessibility, 
  type TextSize, 
  type CaptionSize, 
  type CaptionWeight,
  type CaptionStyle,
  type CaptionBg 
} from "@/context/accessibility-context";

const textSizes: TextSize[] = ["100%", "150%", "200%", "300%"];
const captionSizes: { value: CaptionSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];
const captionWeights: CaptionWeight[] = [300, 400, 500, 600, 700, 800, 900];
const captionStyles: { value: CaptionStyle; label: string }[] = [
  { value: "sans", label: "Sans-serif" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Monospace" },
];

export function A11yToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "captions">("general");
  const {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    autoRead,
    setAutoRead,
    captionSettings,
    setCaptionSize,
    setCaptionWeight,
    setCaptionStyle,
    setCaptionBg,
  } = useAccessibility();

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-40 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        style={{ 
          width: "64px", 
          height: "64px", 
          minWidth: "64px", 
          minHeight: "64px",
          color: "rgba(94, 234, 212, 0.6)",
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "rgba(94, 234, 212, 1)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(94, 234, 212, 0.6)"}
        onClick={() => setIsOpen(true)}
        aria-label="Open accessibility settings"
        data-testid="button-a11y-toolbar"
      >
        <Settings className="w-7 h-7" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              data-testid="a11y-backdrop"
            />

            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog"
              aria-label="Accessibility Settings"
              data-testid="a11y-panel"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-white">Accessibility Settings</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close settings"
                  data-testid="button-close-a11y"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </Button>
              </div>

              <div className="flex border-b border-zinc-800">
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === "general"
                      ? "text-teal-500 border-b-2 border-teal-500"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("general")}
                  data-testid="tab-general"
                >
                  General
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === "captions"
                      ? "text-teal-500 border-b-2 border-teal-500"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("captions")}
                  data-testid="tab-captions"
                >
                  Captions
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                        <Type className="w-4 h-4" />
                        Text Size
                      </label>
                      <div className="flex gap-2">
                        {textSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setTextSize(size)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              textSize === size
                                ? "bg-teal-600 text-white"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            }`}
                            data-testid={`button-textsize-${size}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        <Sun className="w-4 h-4" />
                        High Contrast
                      </label>
                      <button
                        role="switch"
                        aria-checked={highContrast}
                        onClick={() => setHighContrast(!highContrast)}
                        className={`w-12 h-7 rounded-full transition-colors ${
                          highContrast ? "bg-teal-600" : "bg-zinc-700"
                        }`}
                        data-testid="switch-high-contrast"
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                            highContrast ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        <Zap className="w-4 h-4" />
                        Reduce Motion
                      </label>
                      <button
                        role="switch"
                        aria-checked={reducedMotion}
                        onClick={() => setReducedMotion(!reducedMotion)}
                        className={`w-12 h-7 rounded-full transition-colors ${
                          reducedMotion ? "bg-teal-600" : "bg-zinc-700"
                        }`}
                        data-testid="switch-reduce-motion"
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                            reducedMotion ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        <Volume2 className="w-4 h-4" />
                        Auto-Read Aloud
                      </label>
                      <button
                        role="switch"
                        aria-checked={autoRead}
                        onClick={() => setAutoRead(!autoRead)}
                        className={`w-12 h-7 rounded-full transition-colors ${
                          autoRead ? "bg-teal-600" : "bg-zinc-700"
                        }`}
                        data-testid="switch-auto-read"
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                            autoRead ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "captions" && (
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                        <MessageSquare className="w-4 h-4" />
                        Caption Size
                      </label>
                      <div className="flex gap-2">
                        {captionSizes.map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => setCaptionSize(value)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              captionSettings.size === value
                                ? "bg-teal-600 text-white"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            }`}
                            data-testid={`button-caption-size-${value}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-300 mb-3 block">
                        Caption Weight
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {captionWeights.map((weight) => (
                          <button
                            key={weight}
                            onClick={() => setCaptionWeight(weight)}
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                              captionSettings.weight === weight
                                ? "bg-teal-600 text-white"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            }`}
                            style={{ fontWeight: weight }}
                            data-testid={`button-caption-weight-${weight}`}
                          >
                            {weight}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-300 mb-3 block">
                        Caption Font Style
                      </label>
                      <div className="flex gap-2">
                        {captionStyles.map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => setCaptionStyle(value)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              captionSettings.style === value
                                ? "bg-teal-600 text-white"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            }`}
                            data-testid={`button-caption-style-${value}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-300 mb-3 block">
                        Caption Background
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCaptionBg("solid")}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            captionSettings.background === "solid"
                              ? "bg-teal-600 text-white"
                              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          }`}
                          data-testid="button-caption-bg-solid"
                        >
                          Solid
                        </button>
                        <button
                          onClick={() => setCaptionBg("transparent")}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            captionSettings.background === "transparent"
                              ? "bg-teal-600 text-white"
                              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          }`}
                          data-testid="button-caption-bg-transparent"
                        >
                          Transparent
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-lg bg-zinc-800">
                      <p className="text-xs text-zinc-500 mb-2">Preview</p>
                      <p
                        className="text-white"
                        style={{
                          fontSize: { sm: "1rem", md: "1.25rem", lg: "1.5rem", xl: "2rem" }[captionSettings.size],
                          fontWeight: captionSettings.weight,
                          fontFamily: {
                            sans: "'Poppins', system-ui, sans-serif",
                            serif: "Georgia, 'Times New Roman', serif",
                            mono: "'Courier New', Consolas, monospace",
                          }[captionSettings.style],
                        }}
                        data-testid="caption-preview"
                      >
                        Hello, I'm Crystal. How can I help you today?
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
