import { useState } from "react";
import { useRoute } from "wouter";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function WhisperPage() {
  const [, params] = useRoute("/whisper/:userId");
  const userId = params?.userId || "";
  const [whisper, setWhisper] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const { toast } = useToast();

  const handleSendWhisper = async () => {
    if (!whisper.trim() || !supabase) return;

    setIsSending(true);

    try {
      // Broadcast the whisper to the channel
      const channel = supabase.channel(`room:${userId}`);
      
      await channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.send({
            type: 'broadcast',
            event: 'WHISPER_MSG',
            payload: { text: whisper },
          });

          // Show success
          setDelivered(true);
          toast({
            title: "💝 Whisper Delivered",
            description: "Your love note is being spoken right now...",
            className: "bg-gradient-to-r from-gold to-ember text-white",
          });

          // Clear input after delay
          setTimeout(() => {
            setWhisper("");
            setDelivered(false);
          }, 2000);

          // Cleanup
          await channel.unsubscribe();
        }
      });
    } catch (error) {
      console.error('Whisper send error:', error);
      toast({
        title: "Delivery Failed",
        description: "Couldn't send your whisper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(180deg, #0a0e0f 0%, #0d1613 100%)",
      }}
    >
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-3xl md:text-4xl font-whisper tracking-luxury text-white mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Whispering to Mom
          </motion.h1>
          <p className="text-sm font-light tracking-breathe text-gray-400">
            Writing a love note, not an app.
          </p>
        </div>

        {/* Whisper Input */}
        <motion.div
          className="relative rounded-3xl p-8 backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            background: "rgba(250, 173, 20, 0.05)",
            border: "1px solid rgba(250, 173, 20, 0.2)",
            boxShadow: "0 8px 32px 0 rgba(212, 56, 13, 0.3)",
          }}
        >
          <Textarea
            value={whisper}
            onChange={(e) => setWhisper(e.target.value)}
            placeholder="Type your whisper..."
            disabled={isSending || delivered}
            className="min-h-[200px] text-lg font-light tracking-breathe bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500 resize-none"
            style={{
              fontSize: "1.125rem",
              lineHeight: "1.75rem",
            }}
          />

          {/* Character counter */}
          <div className="text-right text-xs text-gray-500 mt-2 font-light">
            {whisper.length} characters
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendWhisper}
            disabled={!whisper.trim() || isSending || delivered}
            className="w-full mt-6 py-6 text-base font-soft tracking-breathe relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #faad14 0%, #d4380d 100%)",
              border: "none",
            }}
          >
            <AnimatePresence mode="wait">
              {delivered ? (
                <motion.span
                  key="delivered"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Delivered
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  {isSending ? "Sending..." : "Send Love"}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Subtle shine effect on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              }}
            />
          </Button>

          {/* Decorative gradient overlay */}
          <div 
            className="absolute inset-0 opacity-10 rounded-3xl pointer-events-none"
            style={{
              background: "radial-gradient(circle at top right, #faad14 0%, transparent 60%)",
            }}
          />
        </motion.div>

        {/* Footer hint */}
        <motion.p
          className="text-center text-xs font-light tracking-breathe text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Your message will be spoken aloud through Crystal
        </motion.p>
      </motion.div>
    </div>
  );
}
