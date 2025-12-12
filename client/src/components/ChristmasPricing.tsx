import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Users, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/language-context";

interface ContributorInfo {
  name: string;
  email: string;
  amount: string;
}

export function ChristmasPricing() {
  const [showFamilySplit, setShowFamilySplit] = useState(false);
  const [contributors, setContributors] = useState<ContributorInfo[]>([
    { name: "", email: "", amount: "" },
  ]);
  const { t } = useLanguage();

  const addContributor = () => {
    if (contributors.length < 5) {
      setContributors([...contributors, { name: "", email: "", amount: "" }]);
    }
  };

  const removeContributor = (index: number) => {
    if (contributors.length > 1) {
      setContributors(contributors.filter((_, i) => i !== index));
    }
  };

  const updateContributor = (index: number, field: keyof ContributorInfo, value: string) => {
    const updated = [...contributors];
    updated[index][field] = value;
    setContributors(updated);
  };

  const handleSinglePurchase = () => {
    console.log("Single purchase - $99");
  };

  const handleFamilySplit = () => {
    console.log("Family split purchase", contributors);
  };

  const features = [
    "Lifetime access to Crystal",
    "Unlimited voice conversations",
    "Family helper integration",
    "Ghost Touch guidance",
    "Magic Mirror video calls",
    "Priority support",
    "Free future updates",
  ];

  return (
    <section 
      className="w-full max-w-lg mx-auto px-4 py-12"
      aria-label="Christmas Pricing"
      data-testid="christmas-pricing"
    >
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
          style={{
            background: "linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(185, 28, 28, 0.2) 100%)",
            border: "1px solid rgba(220, 38, 38, 0.4)",
            boxShadow: "0 0 20px rgba(220, 38, 38, 0.2), inset 0 1px 1px rgba(255,255,255,0.1)",
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4 text-red-400" />
          <span className="text-red-300">{t.limitedHolidayOffer}</span>
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {t.giveTheGift}
        </h2>
        <p className="text-zinc-400">
          {t.alwaysThere}
        </p>
      </div>

      <div 
        className="rounded-2xl p-6 mb-6 relative overflow-visible"
        style={{
          background: "linear-gradient(135deg, rgba(20, 30, 35, 0.9) 0%, rgba(10, 20, 25, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(45, 212, 191, 0.15)",
          boxShadow: `
            0 0 40px rgba(20, 184, 166, 0.08),
            0 4px 30px rgba(0, 0, 0, 0.5),
            inset 0 1px 1px rgba(255, 255, 255, 0.05)
          `,
        }}
      >
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(45, 212, 191, 0.08) 0%, transparent 60%)",
          }}
        />

        <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <h3 className="text-xl font-semibold text-white">{t.lifetimeEdition}</h3>
            <p className="text-sm text-zinc-400">{t.oneTimePurchase}</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$99</span>
            </div>
            <p className="text-xs text-zinc-500 line-through">$199</p>
          </div>
        </div>

        <ul className="space-y-3 mb-6 relative z-10">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              className="flex items-center gap-3 text-sm text-zinc-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(20, 184, 166, 0.1) 100%)",
                  border: "1px solid rgba(20, 184, 166, 0.4)",
                }}
              >
                <Check className="w-3 h-3 text-teal-400" />
              </div>
              {feature}
            </motion.li>
          ))}
        </ul>

        <div className="space-y-3 relative z-10">
          <Button
            onClick={handleSinglePurchase}
            className="w-full min-h-14 text-lg font-semibold"
            style={{
              background: "linear-gradient(135deg, rgb(13, 148, 136) 0%, rgb(15, 118, 110) 100%)",
              boxShadow: "0 4px 20px rgba(20, 184, 166, 0.3), inset 0 1px 1px rgba(255,255,255,0.1)",
              border: "1px solid rgba(45, 212, 191, 0.3)",
            }}
            data-testid="button-single-purchase"
          >
            <Gift className="w-5 h-5 mr-2" />
            {t.purchaseAsGift}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowFamilySplit(!showFamilySplit)}
            className="w-full min-h-12"
            style={{
              background: "rgba(30, 40, 45, 0.5)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(100, 110, 120, 0.3)",
              color: "rgb(200, 210, 220)",
            }}
            data-testid="button-family-split"
          >
            <Users className="w-5 h-5 mr-2" />
            {t.splitWithFamily}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFamilySplit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, rgba(20, 30, 35, 0.95) 0%, rgba(10, 20, 25, 0.98) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(100, 110, 120, 0.2)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
              }}
              role="dialog"
              aria-label="Split payment with family"
              data-testid="family-split-modal"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Split Payment
                </h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowFamilySplit(false)}
                  aria-label="Close"
                  data-testid="button-close-split"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-zinc-400 mb-4">
                Invite family members to contribute. Each contributor receives a personalized thank you message.
              </p>

              <div className="space-y-4 mb-4">
                {contributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg space-y-2"
                    style={{
                      background: "rgba(30, 40, 45, 0.6)",
                      border: "1px solid rgba(80, 90, 100, 0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-zinc-500">
                        Contributor {index + 1}
                      </span>
                      {contributors.length > 1 && (
                        <button
                          onClick={() => removeContributor(index)}
                          className="text-zinc-500 hover:text-red-400 min-w-10 min-h-10 flex items-center justify-center"
                          aria-label={`Remove contributor ${index + 1}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Name"
                        value={contributor.name}
                        onChange={(e) => updateContributor(index, "name", e.target.value)}
                        className="min-h-11"
                        style={{
                          background: "rgba(20, 30, 35, 0.8)",
                          border: "1px solid rgba(80, 90, 100, 0.3)",
                        }}
                        data-testid={`input-contributor-name-${index}`}
                      />
                      <Input
                        placeholder="Amount ($)"
                        type="number"
                        value={contributor.amount}
                        onChange={(e) => updateContributor(index, "amount", e.target.value)}
                        className="min-h-11"
                        style={{
                          background: "rgba(20, 30, 35, 0.8)",
                          border: "1px solid rgba(80, 90, 100, 0.3)",
                        }}
                        data-testid={`input-contributor-amount-${index}`}
                      />
                    </div>
                    <Input
                      placeholder="Email"
                      type="email"
                      value={contributor.email}
                      onChange={(e) => updateContributor(index, "email", e.target.value)}
                      className="min-h-11"
                      style={{
                        background: "rgba(20, 30, 35, 0.8)",
                        border: "1px solid rgba(80, 90, 100, 0.3)",
                      }}
                      data-testid={`input-contributor-email-${index}`}
                    />
                  </div>
                ))}
              </div>

              {contributors.length < 5 && (
                <Button
                  variant="outline"
                  onClick={addContributor}
                  className="w-full min-h-11 mb-4 border-dashed"
                  style={{
                    background: "transparent",
                    borderColor: "rgba(100, 110, 120, 0.4)",
                    color: "rgb(160, 170, 180)",
                  }}
                  data-testid="button-add-contributor"
                >
                  + Add Another Contributor
                </Button>
              )}

              <Button
                onClick={handleFamilySplit}
                className="w-full min-h-12"
                style={{
                  background: "linear-gradient(135deg, rgb(13, 148, 136) 0%, rgb(15, 118, 110) 100%)",
                  boxShadow: "0 4px 20px rgba(20, 184, 166, 0.25)",
                  border: "1px solid rgba(45, 212, 191, 0.3)",
                }}
                data-testid="button-send-invites"
              >
                Send Invites
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
