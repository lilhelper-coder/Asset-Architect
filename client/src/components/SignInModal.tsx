import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase, isSupabaseAvailable } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseAvailable() || !supabase) {
      toast({
        title: "Authentication unavailable",
        description: "Please contact support.",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Check your email! 📧",
        description: "We sent you a magic link to log in.",
      });
    } catch (error) {
      console.error("Magic link error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-testid="modal-backdrop"
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-sm rounded-2xl backdrop-blur-2xl p-8 shadow-2xl"
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                border: "0.5px solid rgba(255, 255, 255, 0.1)",
              }}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="signin-modal"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Close"
                data-testid="button-close-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 
                className="text-center text-2xl font-thin tracking-tight text-zinc-200 mb-2"
              >
                {emailSent ? "Check your email! 📧" : "Welcome to LilHelper"}
              </h2>

              {emailSent ? (
                <div className="text-center space-y-4 py-6">
                  <Mail className="w-20 h-20 mx-auto text-cyan-400" />
                  <p className="text-lg text-zinc-400 font-light">
                    We sent a link to:
                  </p>
                  <p className="text-xl text-cyan-400 font-light">
                    {email}
                  </p>
                  <p className="text-sm text-zinc-500 font-light px-4">
                    Click the link in your email to sign in instantly. 
                    You can close this window and come back anytime.
                  </p>
                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="mt-4 rounded-full text-zinc-400 hover:text-zinc-200 font-light"
                    style={{ 
                      minHeight: "48px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "0.5px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Use different email
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-center text-base text-zinc-400 font-light mb-6 px-2">
                    Enter your email. We'll send you a magic link to sign in instantly.
                  </p>

                  <form onSubmit={handleMagicLinkLogin} className="space-y-5">
                    <div>
                      <label 
                        htmlFor="email-input" 
                        className="block text-sm font-light text-zinc-500 mb-2 tracking-wide"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email-input"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-4 rounded-full text-zinc-200 font-light text-lg backdrop-blur-md transition-all"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "0.5px solid rgba(255, 255, 255, 0.1)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.5)";
                          e.currentTarget.style.boxShadow = "0 0 15px rgba(34, 211, 238, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                          e.currentTarget.style.boxShadow = "0 0 0 rgba(34, 211, 238, 0)";
                        }}
                        data-testid="input-email"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-4 rounded-full font-light text-lg tracking-wide transition-all duration-300"
                      style={{ 
                        background: "rgba(34, 211, 238, 0.1)",
                        border: "0.5px solid rgba(34, 211, 238, 0.3)",
                        color: "#22d3ee",
                        minHeight: "56px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(34, 211, 238, 0.2)";
                        e.currentTarget.style.boxShadow = "0 0 20px rgba(34, 211, 238, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(34, 211, 238, 0.1)";
                        e.currentTarget.style.boxShadow = "0 0 0 rgba(34, 211, 238, 0)";
                      }}
                      data-testid="button-login"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Magic Link ✨"}
                    </Button>
                  </form>

                  <p className="text-center text-xs text-zinc-600 font-light mt-6 px-4">
                    No password needed. We'll email you a secure link.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
