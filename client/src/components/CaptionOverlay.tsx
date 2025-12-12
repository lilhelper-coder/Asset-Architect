import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility, type CaptionSize, type CaptionStyle } from "@/context/accessibility-context";
import { useState, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";

const sizeMap: Record<CaptionSize, string> = {
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "2rem",
};

const fontFamilyMap: Record<CaptionStyle, string> = {
  sans: "'Poppins', system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "'Courier New', Consolas, monospace",
};

export function CaptionOverlay() {
  const { captionText, captionSettings, isSpeaking, clearCaption, stopSpeaking } = useAccessibility();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    stopSpeaking();
    clearCaption();
  }, [stopSpeaking, clearCaption]);

  useEffect(() => {
    if (!captionText) return;

    const timeout = setTimeout(() => {
      if (!isSpeaking) {
        clearCaption();
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [captionText, isSpeaking, clearCaption]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!captionText) return;

      if (e.key === "Escape") {
        handleClose();
        return;
      }

      const NUDGE_AMOUNT = 20;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setPosition((prev) => ({ ...prev, y: prev.y - NUDGE_AMOUNT }));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setPosition((prev) => ({ ...prev, y: prev.y + NUDGE_AMOUNT }));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPosition((prev) => ({ ...prev, x: prev.x - NUDGE_AMOUNT }));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPosition((prev) => ({ ...prev, x: prev.x + NUDGE_AMOUNT }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [captionText, handleClose]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    setPosition((prev) => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y,
    }));
    setIsDragging(false);
  };

  const bgStyle = captionSettings.background === "solid"
    ? "bg-black/90"
    : "bg-black/50 backdrop-blur-sm";

  return (
    <AnimatePresence>
      {captionText && (
        <motion.div
          ref={containerRef}
          className={`fixed z-50 pointer-events-auto ${bgStyle} rounded-lg shadow-lg max-w-[90vw] md:max-w-2xl`}
          style={{
            bottom: `calc(10vh + ${position.y}px)`,
            left: "50%",
            transform: `translateX(calc(-50% + ${position.x}px))`,
            padding: "1rem 1.5rem",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          drag
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.02 }}
          data-testid="caption-overlay"
        >
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors"
            aria-label="Close caption"
            data-testid="button-close-caption"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <span className="sr-only">
            Use arrow keys to reposition, Escape to close
          </span>

          <p
            className="text-white text-center leading-relaxed pr-4"
            style={{
              fontSize: sizeMap[captionSettings.size],
              fontWeight: captionSettings.weight,
              fontFamily: fontFamilyMap[captionSettings.style],
            }}
            role="status"
            aria-live="polite"
            data-testid="caption-text"
          >
            {captionText}
          </p>

          {isSpeaking && (
            <motion.div
              className="absolute -top-1 left-2 w-3 h-3 rounded-full bg-teal-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              aria-hidden="true"
            />
          )}

          {isDragging && (
            <p className="text-xs text-white/50 text-center mt-2">
              Drag to reposition
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
