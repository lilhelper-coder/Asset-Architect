import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";

interface SubscriptionGateProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

const VALID_FOUNDER_CODES = ["FOUNDER2025", "CHRISTMAS2025", "FAMILY", "GIFT"];

export function SubscriptionGate({ isOpen, onClose, userEmail }: SubscriptionGateProps) {
  const monthlyPriceId = import.meta.env.VITE_LILHELPER_MONTHLY_PRICE_ID;
  const lifetimePriceId = import.meta.env.VITE_CRYSTAL_LIFETIME_PRICE_ID;
  const [showRedemption, setShowRedemption] = useState(false);
  const [redemptionCode, setRedemptionCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSelectPlan = (tier: 'monthly' | 'lifetime') => {
    // Redirect to Stripe payment page
    const priceId = tier === 'monthly' ? monthlyPriceId : lifetimePriceId;
    const baseUrl = 'https://buy.stripe.com';
    
    // NOTE: Replace with actual Stripe payment links when available
    const stripeUrl = `${baseUrl}/${priceId}?prefilled_email=${encodeURIComponent(userEmail || '')}`;
    
    window.open(stripeUrl, '_blank');
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleRedeemCode = async () => {
    if (!redemptionCode.trim()) {
      toast({
        title: "Enter a code",
        description: "Please enter your Founder's Club access code.",
        variant: "destructive",
      });
      return;
    }

    const codeUpperCase = redemptionCode.trim().toUpperCase();
    
    if (!VALID_FOUNDER_CODES.includes(codeUpperCase)) {
      toast({
        title: "Invalid code",
        description: "That code isn't recognized. Please check your gift certificate.",
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(true);

    try {
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user logged in");
      }

      // Update profile to grant subscription
      const { error } = await supabase
        .from('profiles')
        .update({
          is_subscriber: true,
          subscription_tier: 'founders_club',
          stripe_subscription_id: 'founders_club_gift',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Trigger confetti celebration
      triggerConfetti();

      // Show success toast
      toast({
        title: "🎉 Welcome to the Founder's Club!",
        description: "Your lifetime access has been activated. Redirecting to dashboard...",
        className: "bg-gradient-to-r from-teal-500 to-emerald-500 text-white",
      });

      // Redirect to dashboard after celebration
      setTimeout(() => {
        setLocation('/dashboard');
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Redemption error:', error);
      toast({
        title: "Activation failed",
        description: "We couldn't activate your membership. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-br from-teal-50 to-white p-8 shadow-2xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {!showRedemption ? (
                <>
                  <div className="text-center mb-8">
                    <Sparkles className="w-12 h-12 mx-auto text-teal-600 mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      Choose Your Plan
                    </h2>
                    <p className="text-gray-600">
                      Crystal is ready to become your digital companion
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Monthly Plan */}
                    <motion.div
                      className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-teal-500 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectPlan('monthly')}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Monthly</h3>
                        <div className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                          Flexible
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-gray-900">$9.99</span>
                        <span className="text-gray-600">/month</span>
                      </div>

                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2 text-gray-700">
                          <span className="text-teal-600 mt-1">✓</span>
                          <span>Unlimited voice conversations</span>
                        </li>
                        <li className="flex items-start gap-2 text-gray-700">
                          <span className="text-teal-600 mt-1">✓</span>
                          <span>Family Ghost Mode access</span>
                        </li>
                        <li className="flex items-start gap-2 text-gray-700">
                          <span className="text-teal-600 mt-1">✓</span>
                          <span>Cancel anytime</span>
                        </li>
                      </ul>

                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={() => handleSelectPlan('monthly')}
                      >
                        Get Started
                      </Button>
                    </motion.div>

                    {/* Lifetime Plan */}
                    <motion.div
                      className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border-2 border-amber-400 hover:border-amber-500 transition-colors cursor-pointer relative"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectPlan('lifetime')}
                    >
                      <div className="absolute -top-3 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        <Crown className="w-4 h-4 inline mr-1" />
                        Best Value
                      </div>

                      <div className="flex items-center justify-between mb-4 mt-2">
                        <h3 className="text-xl font-semibold text-gray-800">Lifetime</h3>
                      </div>
                      
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-gray-900">$99</span>
                        <span className="text-gray-600"> one-time</span>
                        <p className="text-sm text-gray-500 mt-1">Save $20+ per year</p>
                      </div>

                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2 text-gray-700">
                          <span className="text-amber-600 mt-1">✓</span>
                          <span className="font-medium">Everything in Monthly, plus:</span>
                        </li>
                        <li className="flex items-start gap-2 text-gray-700">
                          <span className="text-amber-600 mt-1">✓</span>
                          <span>Lifetime access (pay once, use forever)</span>
                        </li>
                        <li className="flex items-start gap-2 text-gray-700">
                          <span className="text-amber-600 mt-1">✓</span>
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-start gap-2 text-gray-700">
                          <span className="text-amber-600 mt-1">✓</span>
                          <span>Future premium features included</span>
                        </li>
                      </ul>

                      <Button
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                        onClick={() => handleSelectPlan('lifetime')}
                      >
                        Get Lifetime Access
                      </Button>
                    </motion.div>
                  </div>

                  {/* Founder's Code Redemption Button */}
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowRedemption(true)}
                      className="inline-flex items-center gap-2 text-sm text-teal-700 hover:text-teal-800 font-medium transition-colors group"
                    >
                      <Gift className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Have a Founder's Code? Redeem here
                    </button>
                  </div>

                  <p className="text-center text-xs text-gray-500 mt-6">
                    Secure payment powered by Stripe • 30-day money-back guarantee
                  </p>
                </>
              ) : (
                <>
                  {/* Redemption View */}
                  <button
                    onClick={() => setShowRedemption(false)}
                    className="absolute left-4 top-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Back to plans"
                  >
                    ← Back
                  </button>

                  <div className="text-center mb-8 mt-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <Gift className="w-16 h-16 mx-auto text-teal-600 mb-4" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      Welcome to the Founder's Club
                    </h2>
                    <p className="text-gray-600">
                      Enter your exclusive access code below
                    </p>
                  </div>

                  <motion.div
                    className="max-w-md mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div 
                      className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/40 shadow-xl"
                      style={{
                        background: "rgba(255, 255, 255, 0.4)",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                      }}
                    >
                      <label htmlFor="founder-code" className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Access Code
                      </label>
                      <Input
                        id="founder-code"
                        type="text"
                        placeholder="FOUNDER2025"
                        value={redemptionCode}
                        onChange={(e) => setRedemptionCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRedeemCode()}
                        className="mb-4 text-center text-lg font-mono uppercase tracking-wider border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                        disabled={isRedeeming}
                      />

                      <Button
                        onClick={handleRedeemCode}
                        disabled={isRedeeming}
                        className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-lg py-6 shadow-lg"
                      >
                        {isRedeeming ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                              ⚡
                            </motion.div>
                            Activating...
                          </span>
                        ) : (
                          <>Activate Membership 🚀</>
                        )}
                      </Button>

                      <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                        <p className="text-xs text-teal-800 text-center">
                          <strong>💎 Founder's Club Benefits:</strong><br />
                          Lifetime access • Priority support • All future features
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

