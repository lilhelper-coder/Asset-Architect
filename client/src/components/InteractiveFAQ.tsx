import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useAccessibility } from "@/context/accessibility-context";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: "accessibility",
    question: "How do I use accessibility features?",
    answer: "Tap the gear icon in the bottom right corner to open accessibility settings. You can adjust text size, enable high contrast mode, reduce motion, and customize caption appearance.",
  },
  {
    id: "captions",
    question: "How do I customize captions?",
    answer: "In the accessibility settings, tap the Captions tab. You can change the size, font weight, font style, and background opacity of the captions. Captions will appear automatically when Crystal speaks.",
  },
  {
    id: "ghost-touch",
    question: "What is Ghost Touch?",
    answer: "Ghost Touch is a feature that allows a family helper to guide you on your screen from afar. When enabled, you'll see a glowing trail showing where they're pointing, helping you find buttons and navigate your device.",
  },
  {
    id: "family-share",
    question: "How do I share with family?",
    answer: "Crystal can be purchased as a family gift. Multiple family members can contribute to the purchase using the Split with Family option. Each contributor receives a special thank you message when the gift is delivered.",
  },
];

export function InteractiveFAQ() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const { speak, isSpeaking, autoRead } = useAccessibility();

  const handleToggle = (item: FAQItem) => {
    if (expandedId === item.id) {
      setExpandedId(null);
      setSpeakingId(null);
    } else {
      setExpandedId(item.id);
      if (autoRead) {
        setSpeakingId(item.id);
        speak(item.answer);
      }
    }
  };

  const handleSpeak = (item: FAQItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeakingId(item.id);
    speak(item.answer);
  };

  return (
    <section 
      className="w-full max-w-2xl mx-auto px-4 py-8"
      aria-label="Frequently Asked Questions"
      data-testid="faq-section"
    >
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Frequently Asked Questions
      </h2>

      <div className="space-y-3">
        {faqItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-zinc-900/80 border border-zinc-800 overflow-hidden"
            data-testid={`faq-item-${item.id}`}
          >
            <button
              className="w-full flex items-center gap-3 p-4 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/50"
              onClick={() => handleToggle(item)}
              aria-expanded={expandedId === item.id}
              aria-controls={`faq-answer-${item.id}`}
              data-testid={`button-faq-${item.id}`}
            >
              <div className="relative flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    expandedId === item.id ? "bg-teal-600" : "bg-zinc-800"
                  }`}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-400 to-teal-600"
                    animate={
                      speakingId === item.id && isSpeaking
                        ? { scale: [1, 1.3, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.6, repeat: speakingId === item.id && isSpeaking ? Infinity : 0 }}
                  />
                </div>
              </div>

              <span className="flex-1 text-base font-medium text-white">
                {item.question}
              </span>

              <motion.div
                animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  id={`faq-answer-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0">
                    <div className="pl-11">
                      <p className="text-zinc-300 text-sm leading-relaxed mb-3">
                        {item.answer}
                      </p>
                      
                      {!autoRead && (
                        <button
                          onClick={(e) => handleSpeak(item, e)}
                          className="inline-flex items-center gap-2 text-xs text-teal-500 hover:text-teal-400 transition-colors"
                          disabled={isSpeaking && speakingId === item.id}
                          data-testid={`button-speak-${item.id}`}
                        >
                          <motion.div
                            className="w-3 h-3 rounded-full bg-teal-500"
                            animate={
                              speakingId === item.id && isSpeaking
                                ? { scale: [1, 1.3, 1] }
                                : {}
                            }
                            transition={{ duration: 0.6, repeat: speakingId === item.id && isSpeaking ? Infinity : 0 }}
                          />
                          {speakingId === item.id && isSpeaking ? "Speaking..." : "Read aloud"}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
