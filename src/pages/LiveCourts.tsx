import { useEffect, useState } from "react";
import { mockCourts } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy } from "lucide-react";
import type { Court } from "@/lib/types";

export default function LiveCourts() {
  const [courts, setCourts] = useState<Court[]>(mockCourts);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In real app, would fetch from API
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-4xl font-bold glow-text">Live Court View</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Live • Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
        <p className="text-muted-foreground">
          Real-time updates from all active courts
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court, index) => (
          <div
            key={court.id}
            className="glass-card p-6 rounded-xl smooth-transition hover:neon-border animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Court Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {court.id}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">Court {court.id}</h3>
                  {court.currentMatch && (
                    <Badge className="bg-accent/20 text-accent border-accent/50 mt-1">
                      Live
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Current Match */}
            {court.currentMatch ? (
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Now Playing
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {court.currentMatch.player1}
                      </span>
                      <span className="text-xs text-muted-foreground">vs</span>
                      <span className="font-medium text-sm">
                        {court.currentMatch.player2}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-3 h-3" />
                        <span>{court.currentMatch.eventType}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {court.currentMatch.startTime} - {court.currentMatch.endTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 text-center py-8">
                <div className="text-muted-foreground text-sm">Court Available</div>
              </div>
            )}

            {/* Next Match */}
            {court.nextMatch && (
              <div>
                <div className="text-xs text-muted-foreground mb-2">Up Next</div>
                <div className="bg-secondary/30 p-4 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span>{court.nextMatch.player1}</span>
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{court.nextMatch.player2}</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-center mt-2">
                    {court.nextMatch.round}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Empty State for Additional Courts */}
        {[...Array(Math.max(0, 6 - courts.length))].map((_, i) => (
          <div
            key={`empty-${i}`}
            className="glass-card p-6 rounded-xl opacity-50"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-secondary/30 flex items-center justify-center">
                <span className="text-xl font-bold text-muted-foreground">
                  {courts.length + i + 1}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  Court {courts.length + i + 1}
                </h3>
              </div>
            </div>
            <div className="text-center py-12">
              <div className="text-muted-foreground text-sm">Not in use</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
