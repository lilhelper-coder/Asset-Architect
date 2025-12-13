import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionGateProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export function SubscriptionGate({ isOpen, onClose, userEmail }: SubscriptionGateProps) {
  const monthlyPriceId = import.meta.env.VITE_LILHELPER_MONTHLY_PRICE_ID;
  const lifetimePriceId = import.meta.env.VITE_CRYSTAL_LIFETIME_PRICE_ID;

  const handleSelectPlan = (tier: 'monthly' | 'lifetime') => {
    // Redirect to Stripe payment page
    const priceId = tier === 'monthly' ? monthlyPriceId : lifetimePriceId;
    const baseUrl = 'https://buy.stripe.com';
    
    // NOTE: Replace with actual Stripe payment links when available
    const stripeUrl = `${baseUrl}/${priceId}?prefilled_email=${encodeURIComponent(userEmail || '')}`;
    
    window.open(stripeUrl, '_blank');
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

              <p className="text-center text-xs text-gray-500 mt-6">
                Secure payment powered by Stripe • 30-day money-back guarantee
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

