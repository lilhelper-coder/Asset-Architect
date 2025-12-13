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
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
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
              className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="signin-modal"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
                data-testid="button-close-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 
                className="text-center text-2xl font-semibold text-gray-800 mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {emailSent ? "Check your email! 📧" : "Welcome to LilHelper"}
              </h2>

              {emailSent ? (
                <div className="text-center space-y-4 py-6">
                  <Mail className="w-20 h-20 mx-auto text-teal-600" />
                  <p className="text-lg text-gray-700 font-medium">
                    We sent a link to:
                  </p>
                  <p className="text-xl text-teal-600 font-semibold">
                    {email}
                  </p>
                  <p className="text-sm text-gray-600 px-4">
                    Click the link in your email to sign in instantly. 
                    You can close this window and come back anytime.
                  </p>
                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="mt-4"
                    style={{ minHeight: "48px" }}
                  >
                    Use different email
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-center text-base text-gray-600 mb-6 px-2">
                    Enter your email. We'll send you a magic link to sign in instantly.
                  </p>

                  <form onSubmit={handleMagicLinkLogin} className="space-y-5">
                    <div>
                      <label 
                        htmlFor="email-input" 
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email-input"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-4 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-lg"
                        data-testid="input-email"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-4 rounded-lg text-white font-semibold text-lg hover:bg-teal-700 transition-colors"
                      style={{ 
                        backgroundColor: "#0d9488",
                        minHeight: "56px",
                      }}
                      data-testid="button-login"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Magic Link ✨"}
                    </Button>
                  </form>

                  <p className="text-center text-xs text-gray-500 mt-6 px-4">
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
