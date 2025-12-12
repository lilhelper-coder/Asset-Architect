import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SiGoogle, SiFacebook, SiApple } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email login:", email);
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
                className="text-center text-xl font-medium text-gray-800 mb-6"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Sign in
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  data-testid="button-google-login"
                >
                  <SiGoogle className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700 font-medium">Continue with Google</span>
                </button>

                <button
                  onClick={() => handleSocialLogin("facebook")}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  data-testid="button-facebook-login"
                >
                  <SiFacebook className="w-5 h-5 text-[#1877F2]" />
                  <span className="text-gray-700 font-medium">Continue with Facebook</span>
                </button>

                <button
                  onClick={() => handleSocialLogin("apple")}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  data-testid="button-apple-login"
                >
                  <SiApple className="w-5 h-5 text-black" />
                  <span className="text-gray-700 font-medium">Continue with Apple</span>
                </button>
              </div>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  data-testid="input-email"
                />

                <Input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  data-testid="input-password"
                />

                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg text-white font-medium"
                  style={{ 
                    backgroundColor: "#0d9488",
                    minHeight: "48px",
                  }}
                  data-testid="button-login"
                >
                  Login
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{" "}
                <button 
                  className="text-teal-600 hover:text-teal-700 font-medium"
                  data-testid="link-register"
                >
                  Register
                </button>
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
