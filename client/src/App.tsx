import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessibilityProvider } from "@/context/accessibility-context";
import { LanguageProvider } from "@/context/language-context";
import { CaptionOverlay } from "@/components/CaptionOverlay";
import { A11yToolbar } from "@/components/A11yToolbar";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import NotFound from "@/pages/not-found";
import SeniorInterface from "@/pages/senior-interface";
import MirrorPage from "@/pages/mirror";
import Dashboard from "@/pages/dashboard";
import HelperPage from "@/pages/helper";
import ConnectDemo from "@/pages/connect-demo";
import { supabase, isSupabaseAvailable } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

function Router() {
  const [location] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isSubscriber, setIsSubscriber] = useState<boolean | null>(null);
  const [showSubscriptionGate, setShowSubscriptionGate] = useState(false);
  const [loading, setLoading] = useState(true);

  // Monitor auth state
  useEffect(() => {
    if (!isSupabaseAvailable() || !supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSubscription(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSubscription(session.user.id);
      } else {
        setIsSubscriber(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check subscription status
  const checkSubscription = async (userId: string) => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_subscriber')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setIsSubscriber(data?.is_subscriber ?? false);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setIsSubscriber(false);
    } finally {
      setLoading(false);
    }
  };

  // Guard dashboard route
  useEffect(() => {
    if (loading) return;

    if (location.startsWith('/dashboard')) {
      if (!user) {
        // Not logged in - redirect handled by Dashboard component
        return;
      }

      if (isSubscriber === false) {
        // Logged in but not subscribed - show gate
        setShowSubscriptionGate(true);
      }
    }
  }, [location, user, isSubscriber, loading]);

  return (
    <>
      <Switch>
        <Route path="/" component={SeniorInterface} />
        <Route path="/senior" component={SeniorInterface} />
        <Route path="/claim/:code" component={SeniorInterface} />
        <Route path="/connect" component={ConnectDemo} />
        <Route path="/mirror" component={MirrorPage} />
        <Route path="/ghost/:userId" component={HelperPage} />
        <Route path="/whisper/:userId" component={HelperPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/dashboard/:section" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>

      <SubscriptionGate
        isOpen={showSubscriptionGate}
        onClose={() => setShowSubscriptionGate(false)}
        userEmail={user?.email}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AccessibilityProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <CaptionOverlay />
            <A11yToolbar />
          </TooltipProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
