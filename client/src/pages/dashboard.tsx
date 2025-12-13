import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { GiftPoolCard } from "@/components/dashboard/GiftPoolCard";
import { SessionHistory } from "@/components/dashboard/SessionHistory";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SeniorConfigCard } from "@/components/dashboard/SeniorConfigCard";
import { Activity, Gift, Video, MessageSquare, QrCode } from "lucide-react";
import { motion } from "framer-motion";
import { getQueryFn } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import QRCode from "react-qr-code";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  const updateSeniorConfigMutation = useMutation({
    mutationFn: async (config: any) => {
      const res = await apiRequest("PATCH", "/api/senior-config", config);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });

  const { data: giftPools = [] } = useQuery<any[]>({
    queryKey: ["gift-pools"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: isAuthenticated,
  });

  const { data: sessions = [] } = useQuery<any[]>({
    queryKey: ["mirror-sessions"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const activeSessions = sessions?.filter((s: any) => s.active).length || 0;
  const totalGiftPools = giftPools?.length || 0;
  const totalRaised = giftPools?.reduce((sum: number, pool: any) => sum + pool.currentRaised, 0) || 0;
  const totalMessages = sessions?.reduce((sum: number, session: any) => sum + (session.transcript?.length || 0), 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.fullName?.split(" ")[0] || "Friend"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your Crystal account
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Sessions"
            value={activeSessions}
            description="Currently active video sessions"
            icon={Activity}
          />
          <StatsCard
            title="Gift Pools"
            value={totalGiftPools}
            description={user?.role === "gifter" ? "Pools you've created" : "Pools contributing to you"}
            icon={Gift}
          />
          <StatsCard
            title="Total Raised"
            value={`$${(totalRaised / 100).toFixed(0)}`}
            description="Across all gift pools"
            icon={Video}
          />
          <StatsCard
            title="Messages"
            value={totalMessages}
            description="Total conversation messages"
            icon={MessageSquare}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <ProfileCard />
            
            {user?.role === "senior" && user.seniorConfig && (
              <SeniorConfigCard
                config={user.seniorConfig}
                onUpdate={(config) => updateSeniorConfigMutation.mutate(config)}
              />
            )}
            
            {giftPools && giftPools.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Gift Pools</h2>
                {giftPools.slice(0, 2).map((pool: any) => (
                  <GiftPoolCard
                    key={pool.id}
                    pool={{
                      ...pool,
                      contributorsCount: pool.contributors?.length || 0,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Ghost Mode QR Code Card */}
            {user?.id && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <QrCode className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg font-semibold">Ghost Mode (Family Link)</h3>
                </div>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QRCode
                    value={`${window.location.origin}/ghost/${user.id}`}
                    size={200}
                    level="M"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  <strong>Scan this with your phone</strong> to join this session and help in real-time
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Family members can see your conversation and send messages to help you
                </p>
              </Card>
            )}

            {sessions && (
              <SessionHistory
                sessions={sessions.map((s: any) => ({
                  ...s,
                  transcriptCount: s.transcript?.length || 0,
                }))}
                onViewSession={(id) => {
                  console.log("View session:", id);
                }}
              />
            )}

            <SettingsPanel />
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-lg border border-border bg-card"
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => setLocation("/")}
              className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
            >
              <Activity className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-medium">Talk to Crystal</h3>
              <p className="text-sm text-muted-foreground">Start a voice conversation</p>
            </button>
            <button
              onClick={() => setLocation("/mirror")}
              className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
            >
              <Video className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-medium">Start Mirror Session</h3>
              <p className="text-sm text-muted-foreground">Video call with helper</p>
            </button>
            <button
              onClick={() => setLocation("/dashboard/gifts")}
              className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
            >
              <Gift className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-medium">Manage Gifts</h3>
              <p className="text-sm text-muted-foreground">View and share gift pools</p>
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

