import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Gift, Users, DollarSign, Share2, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface GiftPoolCardProps {
  pool: {
    id: string;
    totalGoal: number;
    currentRaised: number;
    magicLinkCode: string;
    contributorsCount: number;
  };
}

export function GiftPoolCard({ pool }: GiftPoolCardProps) {
  const { toast } = useToast();
  const progress = (pool.currentRaised / pool.totalGoal) * 100;
  const remainingAmount = pool.totalGoal - pool.currentRaised;
  
  const magicLink = `${window.location.origin}/claim/${pool.magicLinkCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(magicLink);
    toast({
      title: "Link copied!",
      description: "Share this link with family and friends.",
    });
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Crystal gift pool",
          text: "Help me gift Crystal to someone special!",
          url: magicLink,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      copyLink();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Gift Pool</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {pool.contributorsCount} contributor{pool.contributorsCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Badge variant={progress >= 100 ? "default" : "secondary"}>
              {progress >= 100 ? "Completed" : "Active"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                ${(pool.currentRaised / 100).toFixed(2)} of ${(pool.totalGoal / 100).toFixed(2)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {progress >= 100 ? "Goal reached!" : `$${(remainingAmount / 100).toFixed(2)} remaining`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium">Contributors</span>
              </div>
              <p className="text-xl font-bold">{pool.contributorsCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium">Raised</span>
              </div>
              <p className="text-xl font-bold">${(pool.currentRaised / 100).toFixed(0)}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Magic Link
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 rounded bg-background text-xs truncate border">
                {magicLink}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={copyLink}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            onClick={shareLink}
            className="w-full gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Gift Pool
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

