import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type TextSize = "100%" | "150%" | "200%" | "300%";
export type CaptionSize = "sm" | "md" | "lg" | "xl";
export type CaptionWeight = 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type CaptionStyle = "sans" | "serif" | "mono";
export type CaptionBg = "solid" | "transparent";

interface CaptionSettings {
  size: CaptionSize;
  weight: CaptionWeight;
  style: CaptionStyle;
  background: CaptionBg;
}

interface AccessibilityState {
  textSize: TextSize;
  highContrast: boolean;
  reducedMotion: boolean;
  autoRead: boolean;
  captionText: string;
  captionSettings: CaptionSettings;
  isSpeaking: boolean;
}

interface AccessibilityContextType extends AccessibilityState {
  setTextSize: (size: TextSize) => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setAutoRead: (enabled: boolean) => void;
  setCaptionSize: (size: CaptionSize) => void;
  setCaptionWeight: (weight: CaptionWeight) => void;
  setCaptionStyle: (style: CaptionStyle) => void;
  setCaptionBg: (bg: CaptionBg) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  clearCaption: () => void;
}

const defaultCaptionSettings: CaptionSettings = {
  size: "lg",
  weight: 500,
  style: "sans",
  background: "solid",
};

const defaultState: AccessibilityState = {
  textSize: "100%",
  highContrast: false,
  reducedMotion: false,
  autoRead: true,
  captionText: "",
  captionSettings: defaultCaptionSettings,
  isSpeaking: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const STORAGE_KEY = "crystal_accessibility_settings";

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return { ...defaultState, ...parsed, captionText: "", isSpeaking: false };
        } catch {
          return defaultState;
        }
      }
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      return { ...defaultState, reducedMotion: prefersReducedMotion };
    }
    return defaultState;
  });

  useEffect(() => {
    const { captionText, isSpeaking, ...settingsToStore } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToStore));
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    const sizeMap: Record<TextSize, string> = {
      "100%": "16px",
      "150%": "24px",
      "200%": "32px",
      "300%": "48px",
    };
    root.style.fontSize = sizeMap[state.textSize];
  }, [state.textSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [state.highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  }, [state.reducedMotion]);

  const speak = useCallback((text: string) => {
    setState((prev) => ({ ...prev, captionText: text, isSpeaking: true }));

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTimeout(() => {
        setState((prev) => ({ ...prev, isSpeaking: false }));
      }, 3000);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;

      const loadVoicesAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) => v.name.includes("Samantha") || v.name.includes("Google") || v.lang.startsWith("en")
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          setState((prev) => ({ ...prev, isSpeaking: false }));
        };

        utterance.onerror = () => {
          setState((prev) => ({ ...prev, isSpeaking: false }));
        };

        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoicesAndSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoicesAndSpeak;
        setTimeout(() => {
          if (window.speechSynthesis.getVoices().length === 0) {
            setState((prev) => ({ ...prev, isSpeaking: false }));
          }
        }, 2000);
      }
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setTimeout(() => {
        setState((prev) => ({ ...prev, isSpeaking: false }));
      }, 3000);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setState((prev) => ({ ...prev, isSpeaking: false }));
  }, []);

  const clearCaption = useCallback(() => {
    setState((prev) => ({ ...prev, captionText: "" }));
  }, []);

  const setTextSize = useCallback((size: TextSize) => {
    setState((prev) => ({ ...prev, textSize: size }));
  }, []);

  const setHighContrast = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, highContrast: enabled }));
  }, []);

  const setReducedMotion = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, reducedMotion: enabled }));
  }, []);

  const setAutoRead = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, autoRead: enabled }));
  }, []);

  const setCaptionSize = useCallback((size: CaptionSize) => {
    setState((prev) => ({
      ...prev,
      captionSettings: { ...prev.captionSettings, size },
    }));
  }, []);

  const setCaptionWeight = useCallback((weight: CaptionWeight) => {
    setState((prev) => ({
      ...prev,
      captionSettings: { ...prev.captionSettings, weight },
    }));
  }, []);

  const setCaptionStyle = useCallback((style: CaptionStyle) => {
    setState((prev) => ({
      ...prev,
      captionSettings: { ...prev.captionSettings, style },
    }));
  }, []);

  const setCaptionBg = useCallback((background: CaptionBg) => {
    setState((prev) => ({
      ...prev,
      captionSettings: { ...prev.captionSettings, background },
    }));
  }, []);

  const value: AccessibilityContextType = {
    ...state,
    setTextSize,
    setHighContrast,
    setReducedMotion,
    setAutoRead,
    setCaptionSize,
    setCaptionWeight,
    setCaptionStyle,
    setCaptionBg,
    speak,
    stopSpeaking,
    clearCaption,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
