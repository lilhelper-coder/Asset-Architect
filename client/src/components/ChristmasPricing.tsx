import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Users, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 text-red-400 text-sm font-medium mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4" />
          Limited Holiday Offer
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Give the Gift of Crystal
        </h2>
        <p className="text-zinc-400">
          A companion that's always there for your loved one
        </p>
      </div>

      <div className="rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Lifetime Edition</h3>
            <p className="text-sm text-zinc-400">One-time purchase</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-white">$99</span>
            <p className="text-xs text-zinc-500 line-through">$199</p>
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-sm text-zinc-300"
            >
              <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <Button
            onClick={handleSinglePurchase}
            className="w-full min-h-14 text-lg bg-teal-600 hover:bg-teal-700"
            data-testid="button-single-purchase"
          >
            <Gift className="w-5 h-5 mr-2" />
            Purchase as Gift
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowFamilySplit(!showFamilySplit)}
            className="w-full min-h-12 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            data-testid="button-family-split"
          >
            <Users className="w-5 h-5 mr-2" />
            Split with Family
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
              className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6"
              role="dialog"
              aria-label="Split payment with family"
              data-testid="family-split-modal"
            >
              <div className="flex items-center justify-between mb-4">
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
                    className="p-3 rounded-lg bg-zinc-800/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        Contributor {index + 1}
                      </span>
                      {contributors.length > 1 && (
                        <button
                          onClick={() => removeContributor(index)}
                          className="text-zinc-500 hover:text-red-400"
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
                        className="bg-zinc-900 border-zinc-700"
                        data-testid={`input-contributor-name-${index}`}
                      />
                      <Input
                        placeholder="Amount ($)"
                        type="number"
                        value={contributor.amount}
                        onChange={(e) => updateContributor(index, "amount", e.target.value)}
                        className="bg-zinc-900 border-zinc-700"
                        data-testid={`input-contributor-amount-${index}`}
                      />
                    </div>
                    <Input
                      placeholder="Email"
                      type="email"
                      value={contributor.email}
                      onChange={(e) => updateContributor(index, "email", e.target.value)}
                      className="bg-zinc-900 border-zinc-700"
                      data-testid={`input-contributor-email-${index}`}
                    />
                  </div>
                ))}
              </div>

              {contributors.length < 5 && (
                <Button
                  variant="outline"
                  onClick={addContributor}
                  className="w-full mb-4 border-dashed border-zinc-700 text-zinc-400"
                  data-testid="button-add-contributor"
                >
                  + Add Another Contributor
                </Button>
              )}

              <Button
                onClick={handleFamilySplit}
                className="w-full min-h-12 bg-teal-600 hover:bg-teal-700"
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
