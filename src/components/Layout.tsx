import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, Trophy, BarChart3, Building2, Shield } from "lucide-react";
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

const adminNavItems = [
  { path: "/admin", icon: Shield, label: "Admin" },
  { path: "/committee", icon: Users, label: "Committee" },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="glass-card border-b sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center group-hover:scale-110 smooth-transition">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SportSync AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {/* Main Nav Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg smooth-transition text-sm font-medium",
                      isActive
                        ? "bg-primary/20 text-primary shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Admin Nav Items - with separator */}
              {isAdmin && (
                <>
                  <div className="h-8 w-px bg-border mx-2" />
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg smooth-transition text-sm font-medium",
                          isActive
                            ? "bg-accent/20 text-accent shadow-lg shadow-accent/20"
                            : "text-muted-foreground hover:text-accent hover:bg-accent/10"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </>
              )}

              {/* Auth Button */}
              <div className="ml-2">
                {isAuthenticated ? (
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="smooth-transition hover:scale-105 hover:shadow-lg"
                  >
                    Logout
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="smooth-transition hover:scale-105 hover:shadow-lg"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </div>
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
