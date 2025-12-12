import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type SupportedLanguage = "en" | "es" | "fr" | "de" | "ar";

interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
  voiceName?: string;
  crystalTone: string;
}

export const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "US",
    direction: "ltr",
    voiceName: "en-US",
    crystalTone: "wise, warm, and encouraging like a trusted mentor",
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Espanol",
    flag: "ES",
    direction: "ltr",
    voiceName: "es-ES",
    crystalTone: "warm like an abuela, patient and full of carino",
  },
  fr: {
    code: "fr",
    name: "French",
    nativeName: "Francais",
    flag: "FR",
    direction: "ltr",
    voiceName: "fr-FR",
    crystalTone: "elegant and refined, with gentle patience",
  },
  de: {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "DE",
    direction: "ltr",
    voiceName: "de-DE",
    crystalTone: "precise and thorough, yet warm and reassuring",
  },
  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "SA",
    direction: "rtl",
    voiceName: "ar-SA",
    crystalTone: "respectful and wise like a trusted elder, with traditional warmth",
  },
};

interface Translations {
  touchToSpeak: string;
  listening: string;
  speaking: string;
  oneSecond: string;
  loginSignup: string;
  begin: string;
  lifetimeEdition: string;
  oneTimePurchase: string;
  purchaseAsGift: string;
  splitWithFamily: string;
  limitedHolidayOffer: string;
  giveTheGift: string;
  alwaysThere: string;
  faq: string;
  helperGuiding: string;
  helperHighlighting: string;
  cameraOn: string;
  cameraOff: string;
  turnOnCamera: string;
  turnOffCamera: string;
}

const translations: Record<SupportedLanguage, Translations> = {
  en: {
    touchToSpeak: "touch to speak",
    listening: "Listening...",
    speaking: "Speaking",
    oneSecond: "One moment...",
    loginSignup: "Login / Signup",
    begin: "Begin",
    lifetimeEdition: "Lifetime Edition",
    oneTimePurchase: "One-time purchase",
    purchaseAsGift: "Purchase as Gift",
    splitWithFamily: "Split with Family",
    limitedHolidayOffer: "Limited Holiday Offer",
    giveTheGift: "Give the Gift of Crystal",
    alwaysThere: "A companion that's always there for your loved one",
    faq: "Frequently Asked Questions",
    helperGuiding: "Helper is guiding you",
    helperHighlighting: "Helper is highlighting screen",
    cameraOn: "Camera on",
    cameraOff: "Camera off",
    turnOnCamera: "Turn on camera",
    turnOffCamera: "Turn off camera",
  },
  es: {
    touchToSpeak: "toca para hablar",
    listening: "Escuchando...",
    speaking: "Hablando",
    oneSecond: "Un momento...",
    loginSignup: "Iniciar / Registrarse",
    begin: "Comenzar",
    lifetimeEdition: "Edicion de por vida",
    oneTimePurchase: "Compra unica",
    purchaseAsGift: "Comprar como regalo",
    splitWithFamily: "Dividir con familia",
    limitedHolidayOffer: "Oferta navidena limitada",
    giveTheGift: "Regala Crystal",
    alwaysThere: "Una companera que siempre esta para tu ser querido",
    faq: "Preguntas frecuentes",
    helperGuiding: "Tu ayudante te esta guiando",
    helperHighlighting: "Tu ayudante esta senalando la pantalla",
    cameraOn: "Camara encendida",
    cameraOff: "Camara apagada",
    turnOnCamera: "Encender camara",
    turnOffCamera: "Apagar camara",
  },
  fr: {
    touchToSpeak: "touchez pour parler",
    listening: "A l'ecoute...",
    speaking: "Je parle",
    oneSecond: "Un instant...",
    loginSignup: "Connexion / Inscription",
    begin: "Commencer",
    lifetimeEdition: "Edition a vie",
    oneTimePurchase: "Achat unique",
    purchaseAsGift: "Acheter en cadeau",
    splitWithFamily: "Partager en famille",
    limitedHolidayOffer: "Offre de Noel limitee",
    giveTheGift: "Offrez Crystal",
    alwaysThere: "Une compagne toujours presente pour votre proche",
    faq: "Questions frequentes",
    helperGuiding: "Votre assistant vous guide",
    helperHighlighting: "Votre assistant montre l'ecran",
    cameraOn: "Camera allumee",
    cameraOff: "Camera eteinte",
    turnOnCamera: "Allumer la camera",
    turnOffCamera: "Eteindre la camera",
  },
  de: {
    touchToSpeak: "beruhren zum Sprechen",
    listening: "Ich hore...",
    speaking: "Ich spreche",
    oneSecond: "Einen Moment...",
    loginSignup: "Anmelden / Registrieren",
    begin: "Beginnen",
    lifetimeEdition: "Lebenslange Ausgabe",
    oneTimePurchase: "Einmaliger Kauf",
    purchaseAsGift: "Als Geschenk kaufen",
    splitWithFamily: "Mit Familie teilen",
    limitedHolidayOffer: "Limitiertes Weihnachtsangebot",
    giveTheGift: "Verschenken Sie Crystal",
    alwaysThere: "Ein Begleiter, der immer fur Ihren Liebsten da ist",
    faq: "Haufig gestellte Fragen",
    helperGuiding: "Ihr Helfer fuhrt Sie",
    helperHighlighting: "Ihr Helfer zeigt auf den Bildschirm",
    cameraOn: "Kamera an",
    cameraOff: "Kamera aus",
    turnOnCamera: "Kamera einschalten",
    turnOffCamera: "Kamera ausschalten",
  },
  ar: {
    touchToSpeak: "المس للتحدث",
    listening: "أستمع...",
    speaking: "أتحدث",
    oneSecond: "لحظة واحدة...",
    loginSignup: "تسجيل الدخول",
    begin: "ابدأ",
    lifetimeEdition: "نسخة مدى الحياة",
    oneTimePurchase: "شراء لمرة واحدة",
    purchaseAsGift: "شراء كهدية",
    splitWithFamily: "المشاركة مع العائلة",
    limitedHolidayOffer: "عرض العطلة المحدود",
    giveTheGift: "قدم هدية كريستال",
    alwaysThere: "رفيق دائم لمن تحب",
    faq: "الأسئلة الشائعة",
    helperGuiding: "المساعد يرشدك",
    helperHighlighting: "المساعد يشير إلى الشاشة",
    cameraOn: "الكاميرا مفتوحة",
    cameraOff: "الكاميرا مغلقة",
    turnOnCamera: "تشغيل الكاميرا",
    turnOffCamera: "إيقاف الكاميرا",
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  config: LanguageConfig;
  t: Translations;
  setLanguage: (lang: SupportedLanguage) => void;
  getCrystalSystemPrompt: () => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "crystal_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored in LANGUAGES) {
        return stored as SupportedLanguage;
      }
      const browserLang = navigator.language.split("-")[0];
      if (browserLang in LANGUAGES) {
        return browserLang as SupportedLanguage;
      }
    }
    return "en";
  });

  const config = LANGUAGES[language];
  const t = translations[language];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = config.direction;
  }, [language, config.direction]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
  }, []);

  const getCrystalSystemPrompt = useCallback(() => {
    const langConfig = LANGUAGES[language];
    return `You are Crystal, an AI companion designed specifically for seniors. Your personality is ${langConfig.crystalTone}. You speak in ${langConfig.name}. Be patient, clear, and helpful. Use simple language and avoid technical jargon. When explaining technology, use relatable analogies. Always be encouraging and never condescending.`;
  }, [language]);

  const value: LanguageContextType = {
    language,
    config,
    t,
    setLanguage,
    getCrystalSystemPrompt,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
