import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Home, User, Settings, Gift, Video, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: Home, label: "Overview", path: "/dashboard" },
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    { icon: Gift, label: "Gift Pools", path: "/dashboard/gifts" },
    { icon: Video, label: "Sessions", path: "/dashboard/sessions" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 font-semibold text-xl"
            >
              <span className="text-primary">Crystal</span>
            </button>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setLocation(item.path)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-6 pb-20 md:pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

