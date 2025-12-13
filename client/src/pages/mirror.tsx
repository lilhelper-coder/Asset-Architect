import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GhostTouchCanvas } from "@/components/GhostTouchCanvas";
import { useAccessibility } from "@/context/accessibility-context";

export default function MirrorPage() {
  const [, setLocation] = useLocation();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("room") || `room-${Date.now()}`;
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { speak } = useAccessibility();

  const startCamera = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsCameraOn(true);
      setIsMicOn(true);
      setIsConnected(true);
      speak("Camera connected. Your family can now see you.");
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please check permissions.");
      speak("Camera access was denied. Please allow camera access in your browser settings.");
    } finally {
      setIsConnecting(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsMicOn(false);
    setIsConnected(false);
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        speak(audioTrack.enabled ? "Microphone on" : "Microphone muted");
      }
    }
  };

  const endSession = () => {
    stopCamera();
    speak("Session ended. Returning home.");
    setLocation("/");
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #0a1f24 0%, #050a0c 50%, #000000 100%)",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      data-testid="mirror-page"
    >
      <header className="flex items-center justify-between p-4 border-b border-zinc-800/50">
        <h1 className="text-lg font-medium text-white">Magic Mirror</h1>
        <Button
          size="icon"
          variant="ghost"
          className="text-zinc-400"
          aria-label="Settings"
          data-testid="button-mirror-settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <main className="flex-1 relative flex items-center justify-center p-4">
        {!isConnected ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
              <Video className="w-12 h-12 text-zinc-600" />
            </div>

            <h2 className="text-xl font-medium text-white mb-2">
              Start Video Session
            </h2>
            <p className="text-zinc-400 mb-6 max-w-sm">
              Connect with your family helper. They can see your screen and guide you.
            </p>

            {error && (
              <p className="text-red-400 text-sm mb-4" role="alert">
                {error}
              </p>
            )}

            <Button
              onClick={startCamera}
              disabled={isConnecting}
              className="min-h-16 px-8 text-lg bg-teal-600 hover:bg-teal-700"
              data-testid="button-start-camera"
            >
              {isConnecting ? "Connecting..." : "Start Camera"}
            </Button>
          </motion.div>
        ) : (
          <div className="relative w-full h-full max-w-2xl max-h-[70vh] rounded-2xl overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              data-testid="video-self"
            />

            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                <VideoOff className="w-16 h-16 text-zinc-600" />
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-4 p-2 rounded-full bg-black/60 backdrop-blur-sm">
                <span className="px-3 text-xs text-teal-400 font-medium">
                  Room: {roomId.slice(-6)}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {isConnected && (
        <footer className="p-6 flex items-center justify-center gap-6">
          <Button
            size="icon"
            variant="outline"
            className={`w-16 h-16 rounded-full ${
              isMicOn
                ? "bg-zinc-800 border-zinc-700"
                : "bg-red-600/20 border-red-600 text-red-400"
            }`}
            onClick={toggleMic}
            aria-label={isMicOn ? "Mute microphone" : "Unmute microphone"}
            data-testid="button-toggle-mic"
          >
            {isMicOn ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </Button>

          <Button
            size="icon"
            className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700"
            onClick={endSession}
            aria-label="End session"
            data-testid="button-end-session"
          >
            <PhoneOff className="w-8 h-8" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className={`w-16 h-16 rounded-full ${
              isCameraOn
                ? "bg-zinc-800 border-zinc-700"
                : "bg-red-600/20 border-red-600 text-red-400"
            }`}
            onClick={() => {
              if (streamRef.current) {
                const videoTrack = streamRef.current.getVideoTracks()[0];
                if (videoTrack) {
                  videoTrack.enabled = !videoTrack.enabled;
                  setIsCameraOn(videoTrack.enabled);
                  speak(videoTrack.enabled ? "Camera on" : "Camera off");
                }
              }
            }}
            aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
            data-testid="button-toggle-camera"
          >
            {isCameraOn ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </Button>
        </footer>
      )}

      <GhostTouchCanvas x={0.5} y={0.5} lastActive={0} />
    </div>
  );
}
