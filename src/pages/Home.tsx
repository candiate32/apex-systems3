import { Link } from "react-router-dom";
import { Users, Building2, Calendar, Trophy, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Player Registration",
    description: "Quick sign-up with smart validation & duplicate checking",
    path: "/register",
    color: "text-neon-cyan",
  },
  {
    icon: Calendar,
    title: "Live Courts",
    description: "Real-time court updates & match progression",
    path: "/courts",
    color: "text-neon-green",
  },
  {
    icon: Trophy,
    title: "Umpire Panel",
    description: "Secure match scoring with code validation",
    path: "/umpire",
    color: "text-primary",
  },
  {
    icon: BarChart3,
    title: "Leaderboard",
    description: "Track rankings, results & tournament standings",
    path: "/leaderboard",
    color: "text-accent",
  },
  {
    icon: Building2,
    title: "Community & Clubs",
    description: "Explore clubs, book courts & connect with players",
    path: "/community",
    color: "text-neon-purple",
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12 animate-slide-up">
        <div className="inline-flex items-center space-x-2 px-4 py-2 glass-card rounded-full">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            AI-Powered Tournament Management
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold">
          <span className="glow-text">SportSync</span>
          <br />
          <span className="text-foreground">Next-Gen Scheduling</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Ultra-modern tournament control system with real-time updates,
          intelligent scheduling, and seamless match management
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/register">
            <Button size="lg" className="neon-border smooth-transition hover:scale-105">
              <Users className="w-5 h-5 mr-2" />
              Register as Player
            </Button>
          </Link>
          <Link to="/community">
            <Button size="lg" variant="secondary" className="smooth-transition hover:scale-105">
              <Building2 className="w-5 h-5 mr-2" />
              Explore Community
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link
              key={index}
              to={feature.path}
              className="glass-card p-6 rounded-xl smooth-transition hover:neon-border hover:scale-105 group"
            >
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-primary/20 smooth-transition",
                  feature.color
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary smooth-transition">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="glass-card p-8 rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold glow-text mb-2">
              500+
            </div>
            <div className="text-sm text-muted-foreground">Players Registered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
              150+
            </div>
            <div className="text-sm text-muted-foreground">Matches Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-neon-purple mb-2">
              12
            </div>
            <div className="text-sm text-muted-foreground">Active Courts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-neon-green mb-2">
              98%
            </div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
