import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Rahul Sharma", club: "Delhi Sports Club", wins: 8, losses: 0, points: 24 },
  { rank: 2, name: "Priya Patel", club: "Mumbai Racquet Club", wins: 7, losses: 1, points: 21 },
  { rank: 3, name: "Arjun Kumar", club: "Bangalore Sports Academy", wins: 6, losses: 2, points: 18 },
  { rank: 4, name: "Ananya Singh", club: "Mumbai Racquet Club", wins: 5, losses: 3, points: 15 },
  { rank: 5, name: "Vikram Shah", club: "Delhi Sports Club", wins: 4, losses: 4, points: 12 },
];

const tournamentProgress = [
  { round: "Round 1", completed: 16, total: 16, status: "completed" },
  { round: "Round 2", completed: 8, total: 8, status: "completed" },
  { round: "Quarter Finals", completed: 4, total: 4, status: "completed" },
  { round: "Semi Finals", completed: 2, total: 2, status: "ongoing" },
  { round: "Final", completed: 0, total: 1, status: "pending" },
];

export default function Leaderboard() {
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 glow-text">Leaderboard & Results</h1>
        <p className="text-muted-foreground">
          Tournament standings and match progression
        </p>
      </div>

      <Tabs defaultValue="leaderboard" className="space-y-6">
        <TabsList className="glass-card p-1">
          <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Rankings</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Progress</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-6 animate-fade-in">
          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {leaderboardData.slice(0, 3).map((player, index) => (
              <div
                key={player.rank}
                className={`glass-card p-6 rounded-xl text-center smooth-transition hover:scale-105 ${
                  player.rank === 1 ? "neon-border order-first md:order-2" : ""
                } ${player.rank === 2 ? "order-2 md:order-1" : ""} ${
                  player.rank === 3 ? "order-3 md:order-3" : ""
                }`}
              >
                <div className="flex justify-center mb-4">
                  {getMedalIcon(player.rank)}
                </div>
                <div className="text-3xl font-bold mb-2">{player.rank}</div>
                <div className="font-semibold mb-1">{player.name}</div>
                <div className="text-sm text-muted-foreground mb-3">{player.club}</div>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div>
                    <div className="text-accent font-bold">{player.wins}</div>
                    <div className="text-muted-foreground">Wins</div>
                  </div>
                  <div>
                    <div className="text-destructive font-bold">{player.losses}</div>
                    <div className="text-muted-foreground">Losses</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Leaderboard Table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold">Rank</th>
                  <th className="text-left p-4 font-semibold">Player</th>
                  <th className="text-left p-4 font-semibold">Club</th>
                  <th className="text-center p-4 font-semibold">Wins</th>
                  <th className="text-center p-4 font-semibold">Losses</th>
                  <th className="text-center p-4 font-semibold">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((player, index) => (
                  <tr
                    key={player.rank}
                    className="border-b border-border/50 hover:bg-secondary/30 smooth-transition animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getMedalIcon(player.rank)}
                        <span className="font-bold">{player.rank}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{player.name}</td>
                    <td className="p-4 text-muted-foreground">{player.club}</td>
                    <td className="p-4 text-center">
                      <Badge className="bg-accent/20 text-accent border-accent/50">
                        {player.wins}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant="outline" className="text-destructive border-destructive/50">
                        {player.losses}
                      </Badge>
                    </td>
                    <td className="p-4 text-center font-bold text-primary">
                      {player.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="animate-fade-in">
          <div className="glass-card p-6 rounded-xl space-y-6">
            <h3 className="text-xl font-semibold mb-4">Tournament Progress</h3>
            
            <div className="space-y-4">
              {tournamentProgress.map((round, index) => (
                <div
                  key={round.round}
                  className="bg-secondary/30 p-5 rounded-lg animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          round.status === "completed"
                            ? "bg-accent"
                            : round.status === "ongoing"
                            ? "bg-primary animate-pulse"
                            : "bg-muted"
                        }`}
                      />
                      <h4 className="font-semibold">{round.round}</h4>
                    </div>
                    <Badge
                      variant={round.status === "completed" ? "default" : "outline"}
                      className={
                        round.status === "completed"
                          ? "bg-accent/20 text-accent border-accent/50"
                          : round.status === "ongoing"
                          ? "border-primary text-primary"
                          : ""
                      }
                    >
                      {round.status === "completed"
                        ? "Completed"
                        : round.status === "ongoing"
                        ? "Ongoing"
                        : "Pending"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full smooth-transition ${
                          round.status === "completed"
                            ? "bg-accent"
                            : round.status === "ongoing"
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                        style={{
                          width: `${(round.completed / round.total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {round.completed}/{round.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
