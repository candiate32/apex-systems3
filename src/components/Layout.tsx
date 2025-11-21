import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, Trophy, BarChart3, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/register", icon: Users, label: "Register" },
  { path: "/community", icon: Building2, label: "Community" },
  { path: "/courts", icon: Calendar, label: "Live Courts" },
  { path: "/umpire", icon: Trophy, label: "Umpire" },
  { path: "/leaderboard", icon: BarChart3, label: "Leaderboard" },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="glass-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold glow-text">SportSync AI</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg smooth-transition",
                      isActive
                        ? "bg-primary/20 text-primary neon-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="ml-4 smooth-transition hover:scale-105"
                >
                  Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4 smooth-transition hover:scale-105"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground"
              >
                <Home className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center space-y-1 p-2 smooth-transition",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
