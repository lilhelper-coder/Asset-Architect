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
            {/* Pair Your Phone - Primary Element */}
            {user?.id && (
              <Card 
                className="p-8 border"
                style={{
                  background: "#000000",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <QrCode className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-light tracking-luxury text-white">Pair Your Phone</h3>
                </div>
                <p className="text-sm text-slate-400 font-light tracking-luxury mb-6">
                  Scan to enable Touch & Whisper
                </p>
                <div 
                  className="p-4 rounded-lg inline-block border mx-auto block"
                  style={{
                    background: "#000000",
                    borderColor: "rgba(34, 211, 238, 0.3)",
                    boxShadow: "0 0 20px rgba(34, 211, 238, 0.15)",
                  }}
                >
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=svg&color=22d3ee&bgcolor=000000&data=${encodeURIComponent(`${window.location.origin}/whisper/${user.id}`)}`}
                    alt="Scan to Pair"
                    className="rounded-lg"
                    width="200"
                    height="200"
                  />
                </div>
                <button
                  onClick={async () => {
                    const url = `${window.location.origin}/whisper/${user.id}`;
                    await navigator.clipboard.writeText(url);
                    alert('Link copied! Send it to your family.');
                  }}
                  className="mt-6 w-full backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full px-4 py-2 font-light tracking-luxury transition-all duration-300 text-sm"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(34, 211, 238, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 0 rgba(34, 211, 238, 0)";
                  }}
                >
                  Copy Link 🔗
                </button>
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

