import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "@/context/accessibility-context";

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
  id: string;
}

interface GhostTouchCanvasProps {
  enabled?: boolean;
  roomId?: string;
}

export function GhostTouchCanvas({ enabled = false, roomId }: GhostTouchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<TouchPoint[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastAnnouncementRef = useRef<number>(0);
  const wsRef = useRef<WebSocket | null>(null);
  const [isHelperActive, setIsHelperActive] = useState(false);
  const { speak } = useAccessibility();

  const triggerHaptic = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }
  }, []);

  const announceHelper = useCallback(() => {
    const now = Date.now();
    if (now - lastAnnouncementRef.current > 5000) {
      speak("Helper is highlighting screen");
      lastAnnouncementRef.current = now;
    }
  }, [speak]);

  const addPoint = useCallback((x: number, y: number) => {
    const point: TouchPoint = {
      x,
      y,
      timestamp: Date.now(),
      id: `${Date.now()}-${Math.random()}`,
    };
    pointsRef.current.push(point);

    if (pointsRef.current.length > 50) {
      pointsRef.current = pointsRef.current.slice(-50);
    }

    triggerHaptic();
    announceHelper();
    setIsHelperActive(true);
  }, [triggerHaptic, announceHelper]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();
    const fadeTime = 2000;

    pointsRef.current = pointsRef.current.filter(
      (p) => now - p.timestamp < fadeTime
    );

    if (pointsRef.current.length === 0) {
      setIsHelperActive(false);
    }

    for (let i = 0; i < pointsRef.current.length; i++) {
      const point = pointsRef.current[i];
      const age = now - point.timestamp;
      const alpha = Math.max(0, 1 - age / fadeTime);

      const gradient = ctx.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        40
      );
      gradient.addColorStop(0, `rgba(20, 184, 166, ${alpha * 0.9})`);
      gradient.addColorStop(0.3, `rgba(20, 184, 166, ${alpha * 0.5})`);
      gradient.addColorStop(0.6, `rgba(20, 184, 166, ${alpha * 0.2})`);
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(point.x, point.y, 40, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
      ctx.fill();
    }

    if (pointsRef.current.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(20, 184, 166, 0.6)`;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const recentPoints = pointsRef.current.slice(-10);
      ctx.moveTo(recentPoints[0].x, recentPoints[0].y);

      for (let i = 1; i < recentPoints.length; i++) {
        ctx.lineTo(recentPoints[i].x, recentPoints[i].y);
      }
      ctx.stroke();
    }

    animationFrameRef.current = requestAnimationFrame(draw);
  }, []);

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

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none"
        aria-hidden="true"
        data-testid="ghost-touch-canvas"
      />

      <AnimatePresence>
        {isHelperActive && (
          <motion.div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-teal-600/90 text-white text-sm font-medium shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            data-testid="ghost-touch-indicator"
          >
            Helper is guiding you
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
