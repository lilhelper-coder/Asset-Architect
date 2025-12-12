import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessibilityProvider } from "@/context/accessibility-context";
import { LanguageProvider } from "@/context/language-context";
import { CaptionOverlay } from "@/components/CaptionOverlay";
import { A11yToolbar } from "@/components/A11yToolbar";
import NotFound from "@/pages/not-found";
import SeniorInterface from "@/pages/senior-interface";
import MirrorPage from "@/pages/mirror";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SeniorInterface} />
      <Route path="/senior" component={SeniorInterface} />
      <Route path="/claim/:code" component={SeniorInterface} />
      <Route path="/mirror" component={MirrorPage} />
      <Route component={NotFound} />
    </Switch>
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
