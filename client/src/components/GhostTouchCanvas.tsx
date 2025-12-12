import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "@/context/accessibility-context";
import { useLanguage } from "@/context/language-context";
import { Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
  id: string;
  velocity?: number;
}

interface GhostTouchCanvasProps {
  enabled?: boolean;
  roomId?: string;
  showCameraOverlay?: boolean;
}

export function GhostTouchCanvas({ enabled = false, roomId, showCameraOverlay = false }: GhostTouchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointsRef = useRef<TouchPoint[]>([]);
  const lastPointRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastAnnouncementRef = useRef<number>(0);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isHelperActive, setIsHelperActive] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { speak } = useAccessibility();
  const { t } = useLanguage();

  const triggerHaptic = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate([30, 10, 30]);
    }
  }, []);

  const announceHelper = useCallback(() => {
    const now = Date.now();
    if (now - lastAnnouncementRef.current > 5000) {
      speak(t.helperHighlighting);
      lastAnnouncementRef.current = now;
    }
  }, [speak, t.helperHighlighting]);

  const addPoint = useCallback((x: number, y: number) => {
    const now = Date.now();
    let velocity = 0;

    if (lastPointRef.current) {
      const dx = x - lastPointRef.current.x;
      const dy = y - lastPointRef.current.y;
      const dt = now - lastPointRef.current.time;
      if (dt > 0) {
        velocity = Math.sqrt(dx * dx + dy * dy) / dt;
      }
    }

    lastPointRef.current = { x, y, time: now };

    const point: TouchPoint = {
      x,
      y,
      timestamp: now,
      id: `${now}-${Math.random()}`,
      velocity: Math.min(velocity, 2),
    };
    pointsRef.current.push(point);

    if (pointsRef.current.length > 80) {
      pointsRef.current = pointsRef.current.slice(-80);
    }

    triggerHaptic();
    announceHelper();
    setIsHelperActive(true);
  }, [triggerHaptic, announceHelper]);

  const drawCometTrail = useCallback((ctx: CanvasRenderingContext2D, now: number) => {
    const fadeTime = 2500;

    pointsRef.current = pointsRef.current.filter(
      (p) => now - p.timestamp < fadeTime
    );

    if (pointsRef.current.length === 0) {
      setIsHelperActive(false);
      return;
    }

    for (let i = 0; i < pointsRef.current.length; i++) {
      const point = pointsRef.current[i];
      const age = now - point.timestamp;
      const alpha = Math.max(0, 1 - age / fadeTime);
      const size = 35 + (point.velocity || 0) * 15;

      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, size
      );
      gradient.addColorStop(0, `rgba(20, 184, 166, ${alpha * 0.95})`);
      gradient.addColorStop(0.2, `rgba(45, 212, 191, ${alpha * 0.7})`);
      gradient.addColorStop(0.4, `rgba(20, 184, 166, ${alpha * 0.4})`);
      gradient.addColorStop(0.7, `rgba(15, 118, 110, ${alpha * 0.15})`);
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    if (pointsRef.current.length >= 2) {
      const recentPoints = pointsRef.current.slice(-15);
      
      for (let i = 1; i < recentPoints.length; i++) {
        const p1 = recentPoints[i - 1];
        const p2 = recentPoints[i];
        const age = now - p2.timestamp;
        const alpha = Math.max(0, 1 - age / fadeTime) * 0.7;

        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, `rgba(20, 184, 166, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(45, 212, 191, ${alpha * 0.6})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4 + (p2.velocity || 0) * 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();
    drawCometTrail(ctx, now);

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [drawCometTrail]);

  const toggleCamera = useCallback(async () => {
    if (cameraEnabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraEnabled(false);
      setCameraError(null);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraEnabled(true);
        setCameraError(null);
      } catch (err) {
        console.error("Camera access error:", err);
        setCameraError("Camera access denied");
      }
    }
  }, [cameraEnabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, draw]);

  useEffect(() => {
    if (!enabled || !roomId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/ghost-touch?room=${roomId}`;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "touch_move") {
            const x = data.x * window.innerWidth;
            const y = data.y * window.innerHeight;
            addPoint(x, y);
          }
        } catch (e) {
          console.error("Ghost touch parse error:", e);
        }
      };

      wsRef.current.onerror = () => {
        console.log("Ghost touch WebSocket error - helper may not be available");
      };
    } catch (e) {
      console.log("Ghost touch WebSocket not available");
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [enabled, roomId, addPoint]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {showCameraOverlay && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`fixed inset-0 w-full h-full object-cover z-40 ${
            cameraEnabled ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
          aria-hidden="true"
          data-testid="ghost-touch-camera"
        />
      )}

      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none"
        aria-hidden="true"
        data-testid="ghost-touch-canvas"
      />

      {showCameraOverlay && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="icon"
            variant={cameraEnabled ? "default" : "outline"}
            onClick={toggleCamera}
            className={`min-w-16 min-h-16 rounded-full ${
              cameraEnabled
                ? "bg-teal-600 hover:bg-teal-700"
                : "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
            }`}
            aria-label={cameraEnabled ? "Turn off camera" : "Turn on camera"}
            data-testid="button-toggle-camera"
          >
            {cameraEnabled ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </Button>
          {cameraError && (
            <p className="mt-2 text-xs text-red-400 text-center max-w-20">
              {cameraError}
            </p>
          )}
        </div>
      )}

      <AnimatePresence>
        {isHelperActive && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 text-white text-base font-medium shadow-xl border border-teal-500/30"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            data-testid="ghost-touch-indicator"
          >
            {t.helperGuiding}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
