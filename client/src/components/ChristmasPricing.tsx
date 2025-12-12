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
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-medium mb-4"
          style={{
            fontSize: "clamp(22px, 3.5vw, 26px)",
            fontFamily: "'Poppins', system-ui, sans-serif",
            background: "linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(13, 148, 136, 0.15) 100%)",
            border: "1px solid rgba(94, 234, 212, 0.3)",
            boxShadow: "0 0 20px rgba(20, 184, 166, 0.15), inset 0 1px 1px rgba(255,255,255,0.05)",
          }}
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5" style={{ color: "rgb(94, 234, 212)" }} />
          <span style={{ color: "rgb(94, 234, 212)" }}>{t.limitedHolidayOffer}</span>
        </motion.div>
        <h2 
          className="font-semibold text-white mb-2" 
          style={{ 
            fontSize: "clamp(28px, 5vw, 38px)",
            fontFamily: "'Poppins', system-ui, sans-serif",
          }}
        >
          {t.giveTheGift}
        </h2>
        <p 
          className="text-zinc-300" 
          style={{ 
            fontSize: "clamp(22px, 4vw, 26px)",
            fontFamily: "'Poppins', system-ui, sans-serif",
          }}
        >
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
            <h3 className="font-semibold text-white" style={{ fontSize: "clamp(26px, 4vw, 32px)" }}>{t.lifetimeEdition}</h3>
            <p className="text-zinc-300" style={{ fontSize: "clamp(24px, 3vw, 26px)" }}>{t.oneTimePurchase}</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-white" style={{ fontSize: "clamp(44px, 8vw, 56px)" }}>$99</span>
            </div>
            <p className="text-zinc-300 line-through" style={{ fontSize: "clamp(24px, 3.5vw, 28px)" }}>$199</p>
          </div>
        </div>

        <ul className="space-y-4 mb-6 relative z-10">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              className="flex items-center gap-3 text-zinc-200"
              style={{ fontSize: "clamp(24px, 3.5vw, 26px)", lineHeight: "1.4" }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(20, 184, 166, 0.1) 100%)",
                  border: "1px solid rgba(20, 184, 166, 0.4)",
                }}
              >
                <Check className="w-5 h-5 text-teal-400" />
              </div>
              {feature}
            </motion.li>
          ))}
        </ul>

        <div className="space-y-3 relative z-10">
          <Button
            onClick={handleSinglePurchase}
            className="w-full min-h-16 font-semibold"
            style={{
              fontSize: "clamp(24px, 4vw, 28px)",
              background: "linear-gradient(135deg, rgb(13, 148, 136) 0%, rgb(15, 118, 110) 100%)",
              boxShadow: "0 4px 20px rgba(20, 184, 166, 0.3), inset 0 1px 1px rgba(255,255,255,0.1)",
              border: "1px solid rgba(45, 212, 191, 0.3)",
            }}
            data-testid="button-single-purchase"
          >
            <Gift className="w-7 h-7 mr-2" />
            {t.purchaseAsGift}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowFamilySplit(!showFamilySplit)}
            className="w-full min-h-16"
            style={{
              fontSize: "clamp(24px, 3.5vw, 26px)",
              background: "rgba(30, 40, 45, 0.5)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(100, 110, 120, 0.3)",
              color: "rgb(200, 210, 220)",
            }}
            data-testid="button-family-split"
          >
            <Users className="w-7 h-7 mr-2" />
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
                <h3 className="font-semibold text-white" style={{ fontSize: "clamp(26px, 4vw, 30px)" }}>
                  Split Payment
                </h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowFamilySplit(false)}
                  aria-label="Close"
                  data-testid="button-close-split"
                  className="min-w-12 min-h-12"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <p className="text-zinc-300 mb-4" style={{ fontSize: "clamp(24px, 3.5vw, 26px)" }}>
                Invite family members to contribute. Each contributor receives a personalized thank you message.
              </p>

              <div className="space-y-4 mb-4">
                {contributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg space-y-3"
                    style={{
                      background: "rgba(30, 40, 45, 0.6)",
                      border: "1px solid rgba(80, 90, 100, 0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-zinc-200" style={{ fontSize: "clamp(24px, 3.5vw, 26px)" }}>
                        Contributor {index + 1}
                      </span>
                      {contributors.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeContributor(index)}
                          aria-label={`Remove contributor ${index + 1}`}
                          className="min-w-12 min-h-12"
                        >
                          <X className="w-5 h-5 text-zinc-400" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Name"
                        value={contributor.name}
                        onChange={(e) => updateContributor(index, "name", e.target.value)}
                        className="min-h-14"
                        style={{
                          fontSize: "clamp(24px, 3.5vw, 26px)",
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
                        className="min-h-14"
                        style={{
                          fontSize: "clamp(24px, 3.5vw, 26px)",
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
                      className="min-h-14"
                      style={{
                        fontSize: "clamp(24px, 3.5vw, 26px)",
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
                  className="w-full min-h-14 mb-4 border-dashed"
                  style={{
                    fontSize: "clamp(24px, 3.5vw, 26px)",
                    background: "transparent",
                    borderColor: "rgba(100, 110, 120, 0.4)",
                    color: "rgb(180, 190, 200)",
                  }}
                  data-testid="button-add-contributor"
                >
                  + Add Another Contributor
                </Button>
              )}

              <Button
                onClick={handleFamilySplit}
                className="w-full min-h-16"
                style={{
                  fontSize: "clamp(24px, 4vw, 28px)",
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
