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

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
    SpeechRecognition: typeof SpeechRecognition;
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
  
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

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
  }, [stopListening]);

  const speakText = useCallback((text: string, isErrorMessage = false) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.name.includes("Samantha") || v.name.includes("Google") || v.lang.startsWith("en")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
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
      
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/voice`;
      
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

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        
        if (transcript && wsRef.current?.readyState === WebSocket.OPEN) {
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

      recognition.onerror = (event) => {
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
