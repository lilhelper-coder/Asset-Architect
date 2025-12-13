import { useState, useCallback, useRef, useEffect } from "react";
import type { OrbState } from "@/components/MagicOrb";

interface VoiceConnectionOptions {
  seniorName?: string;
  gifterName?: string;
  bioContext?: string;
  onTranscript?: (text: string, role: "user" | "assistant") => void;
}

interface VoiceConnectionState {
  orbState: OrbState;
  isConnected: boolean;
  error: string | null;
  transcript: Array<{ role: "user" | "assistant"; text: string }>;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useVoiceConnection(options: VoiceConnectionOptions = {}) {
  const [state, setState] = useState<VoiceConnectionState>({
    orbState: "idle",
    isConnected: false,
    error: null,
    transcript: [],
  });

  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCleaningUpRef = useRef(false);
  const optionsRef = useRef(options);
  const fillerAudioRef = useRef<HTMLAudioElement | null>(null);
  const fillerSpeechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fillerSounds = useRef<string[]>([
    '/assets/sounds/thinking_1.mp3',
    '/assets/sounds/thinking_2.mp3',
    '/assets/sounds/thinking_3.mp3',
  ]);
  const audioAvailableRef = useRef<boolean | null>(null); // null = not tested yet
  
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const stopFillerAudio = useCallback(() => {
    // Stop audio file if playing
    if (fillerAudioRef.current) {
      fillerAudioRef.current.pause();
      fillerAudioRef.current.currentTime = 0;
    }
    
    // Stop speech synthesis fallback if playing
    if (fillerSpeechRef.current && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      fillerSpeechRef.current = null;
    }
  }, []);

  const playFillerAudioFallback = useCallback(() => {
    // Fallback: Use speech synthesis with a very short utterance
    if ("speechSynthesis" in window) {
      try {
        const utterance = new SpeechSynthesisUtterance("Hmm");
        utterance.rate = 1.5; // Faster
        utterance.pitch = 1.0;
        utterance.volume = 0.3; // Quiet
        
        fillerSpeechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        
        console.log("Using speech synthesis fallback for filler audio");
      } catch (err) {
        console.log("Filler audio fallback also failed:", err);
      }
    }
  }, []);

  const playFillerAudio = useCallback(() => {
    try {
      // Stop any existing filler audio
      stopFillerAudio();
      
      // If we've already determined audio files are unavailable, use fallback
      if (audioAvailableRef.current === false) {
        playFillerAudioFallback();
        return;
      }
      
      // Randomly select a thinking sound
      const randomSound = fillerSounds.current[Math.floor(Math.random() * fillerSounds.current.length)];
      
      // Create or reuse audio element
      if (!fillerAudioRef.current) {
        fillerAudioRef.current = new Audio();
        
        // Set up error handler to detect missing files
        fillerAudioRef.current.addEventListener('error', () => {
          console.log("Audio files not found, falling back to speech synthesis");
          audioAvailableRef.current = false;
          playFillerAudioFallback();
        });
      }
      
      fillerAudioRef.current.src = randomSound;
      fillerAudioRef.current.volume = 0.4;
      fillerAudioRef.current.loop = true; // Loop until response arrives
      
      // Try to play, but catch errors gracefully
      const playPromise = fillerAudioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Audio playback failed, using fallback:", err);
          audioAvailableRef.current = false;
          playFillerAudioFallback();
        });
      }
    } catch (err) {
      console.log("Filler audio error, using fallback:", err);
      audioAvailableRef.current = false;
      playFillerAudioFallback();
    }
  }, [stopFillerAudio, playFillerAudioFallback]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Recognition already stopped
      }
    }
  }, []);

  const startListeningInternal = useCallback(() => {
    if (!recognitionRef.current || isCleaningUpRef.current) return;
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Recognition already started or not available
    }
  }, []);

  const cleanup = useCallback(() => {
    isCleaningUpRef.current = true;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    stopListening();
    stopFillerAudio();
    
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      recognitionRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      if (wsRef.current.readyState === WebSocket.OPEN || 
          wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
    
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    
    isCleaningUpRef.current = false;
  }, [stopListening, stopFillerAudio]);

  const speakText = useCallback((text: string, isErrorMessage = false) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // TASK 3: Better voice selection for seniors
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.1; // Slightly higher/friendlier
      utterance.volume = 0.9;
      
      // Get all available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Priority 1: Google US English (Android/Chrome - most natural)
      let preferredVoice = voices.find(v => 
        v.name.includes("Google") && v.lang.includes("en-US")
      );
      
      // Priority 2: Samantha (iOS - warm and clear)
      if (!preferredVoice) {
        preferredVoice = voices.find(v => v.name.includes("Samantha"));
      }
      
      // Priority 3: Any US English voice
      if (!preferredVoice) {
        preferredVoice = voices.find(v => v.lang.includes("en-US"));
      }
      
      // Priority 4: Any English voice
      if (!preferredVoice) {
        preferredVoice = voices.find(v => v.lang.startsWith("en"));
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log("Using voice:", preferredVoice.name);
      }
      
      utterance.onend = () => {
        if (isErrorMessage) {
          return;
        }
        if (!isCleaningUpRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
          setState((prev) => ({ ...prev, orbState: "listening" }));
          startListeningInternal();
        }
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }, [startListeningInternal]);

  const handleError = useCallback((errorMessage: string) => {
    console.error("Voice connection error:", errorMessage);
    cleanup();
    
    setState((prev) => ({
      ...prev,
      orbState: "error",
      isConnected: false,
      error: errorMessage,
    }));
    
    speakText("I'm just resting for a moment. We're in no rush.", true);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        orbState: "idle",
        error: null,
      }));
    }, 8000);
  }, [speakText, cleanup]);

  const connect = useCallback(async () => {
    cleanup();
    
    setState((prev) => ({ ...prev, orbState: "listening", error: null }));

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      handleError("Voice recognition is not supported on this device. Let's try a different path.");
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      
      recognitionRef.current = recognition;
      
      // Use environment variable for API URL if set (for split deployment)
      const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL;
      let wsUrl: string;
      
      if (apiBaseUrl) {
        // Production: use separate backend URL
        wsUrl = apiBaseUrl.replace(/^http/, 'ws') + '/api/voice';
      } else {
        // Development: use same origin
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        wsUrl = `${protocol}//${window.location.host}/api/voice`;
      }
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setState((prev) => ({ ...prev, isConnected: true }));
        
        const currentOptions = optionsRef.current;
        wsRef.current?.send(JSON.stringify({
          type: "config",
          seniorName: currentOptions.seniorName || "Friend",
          gifterName: currentOptions.gifterName || "Someone who loves you",
          bioContext: currentOptions.bioContext || "",
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "transcript") {
            // Stop filler audio immediately when response arrives
            stopFillerAudio();
            
            setState((prev) => ({
              ...prev,
              transcript: [...prev.transcript, { role: data.role, text: data.text }],
            }));
            optionsRef.current.onTranscript?.(data.text, data.role);
            
            if (data.role === "assistant") {
              setState((prev) => ({ ...prev, orbState: "speaking" }));
              speakText(data.text, false);
            }
          } else if (data.type === "speaking") {
            setState((prev) => ({ ...prev, orbState: "speaking" }));
          } else if (data.type === "listening") {
            setState((prev) => ({ ...prev, orbState: "listening" }));
            startListeningInternal();
          } else if (data.type === "error") {
            stopFillerAudio();
            handleError(data.message || "Let's try a different path.");
          }
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      wsRef.current.onerror = () => {
        if (!isCleaningUpRef.current) {
          handleError("Connection interrupted. Let's try a different path.");
        }
      };

      wsRef.current.onclose = () => {
        if (!isCleaningUpRef.current) {
          setState((prev) => ({ 
            ...prev, 
            isConnected: false,
            orbState: prev.orbState === "error" ? "error" : "idle"
          }));
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        
        if (transcript && wsRef.current?.readyState === WebSocket.OPEN) {
          // CRITICAL: Play filler audio immediately BEFORE sending request
          playFillerAudio();
          
          setState((prev) => ({
            ...prev,
            transcript: [...prev.transcript, { role: "user", text: transcript }],
            orbState: "speaking",
          }));
          
          optionsRef.current.onTranscript?.(transcript, "user");
          
          wsRef.current.send(JSON.stringify({
            type: "text",
            text: transcript,
          }));
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.log("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          setTimeout(() => {
            if (!isCleaningUpRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
              startListeningInternal();
            }
          }, 500);
        } else if (event.error === "not-allowed") {
          handleError("I need your permission to hear you. Please allow microphone access.");
        }
      };

      recognition.onend = () => {
        if (!isCleaningUpRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
          setTimeout(() => startListeningInternal(), 300);
        }
      };

    } catch (error) {
      handleError("Let's try a different path. Please tap again.");
    }
  }, [handleError, cleanup, startListeningInternal, speakText]);

  const disconnect = useCallback(() => {
    cleanup();
    
    setState({
      orbState: "idle",
      isConnected: false,
      error: null,
      transcript: [],
    });
  }, [cleanup]);

  const toggleConnection = useCallback(() => {
    if (state.orbState === "idle" || state.orbState === "error") {
      connect();
    } else {
      disconnect();
    }
  }, [state.orbState, connect, disconnect]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    ...state,
    toggleConnection,
    connect,
    disconnect,
  };
}
