import { useState } from "react";
import { Trophy, Award, Loader2 } from "lucide-react";
import { BracketMatch, TournamentBracket } from "@/api/bracketApi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface KnockoutBracketProps {
  bracket: TournamentBracket;
  onUpdateScore?: (matchId: string, score1: number, score2: number) => Promise<void>;
}

export default function KnockoutBracket({ bracket, onUpdateScore }: KnockoutBracketProps) {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleScoreUpdate = async (matchId: string) => {
    if (!onUpdateScore) return;
    
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    
    if (isNaN(s1) || isNaN(s2)) {
      toast.error("Please enter valid scores");
      return;
    }

    setUpdating(true);
    try {
      await onUpdateScore(matchId, s1, s2);
      setEditingMatch(null);
      setScore1("");
      setScore2("");
    } catch (error) {
      // Error handled in API
    } finally {
      setUpdating(false);
    }
  };

  const MatchCard = ({ match }: { match: BracketMatch }) => {
    const isEditing = editingMatch === match.id;
    const isWinner1 = match.winner?.id === match.player1?.id;
    const isWinner2 = match.winner?.id === match.player2?.id;

    return (
      <Card className="p-4 space-y-3 bg-secondary/30 border-border/50 hover:border-primary/30 transition-all">
        {/* Match Header */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            Round {match.round}
          </Badge>
          {match.status === "completed" && (
            <Trophy className="w-4 h-4 text-accent" />
          )}
        </div>

        {match.bye ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Bye Round
          </div>
        ) : (
          <div className="space-y-2">
            {/* Player 1 */}
            <div
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                isWinner1 ? "bg-accent/20 border border-accent/50" : "bg-background/50"
              }`}
            >
              <div className="flex items-center gap-2">
                {match.player1_seed && (
                  <Badge variant="secondary" className="w-6 h-6 flex items-center justify-center p-0">
                    {match.player1_seed}
                  </Badge>
                )}
                <span className={`font-medium ${isWinner1 ? "text-accent" : ""}`}>
                  {match.player1?.name || "TBD"}
                </span>
              </div>
              {match.status === "completed" && (
                <span className="font-bold">{match.score1}</span>
              )}
            </div>

            {/* VS Divider */}
            <div className="text-center text-xs text-muted-foreground">vs</div>

            {/* Player 2 */}
            <div
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                isWinner2 ? "bg-accent/20 border border-accent/50" : "bg-background/50"
              }`}
            >
              <div className="flex items-center gap-2">
                {match.player2_seed && (
                  <Badge variant="secondary" className="w-6 h-6 flex items-center justify-center p-0">
                    {match.player2_seed}
                  </Badge>
                )}
                <span className={`font-medium ${isWinner2 ? "text-accent" : ""}`}>
                  {match.player2?.name || "TBD"}
                </span>
              </div>
              {match.status === "completed" && (
                <span className="font-bold">{match.score2}</span>
              )}
            </div>

            {/* Score Input for pending matches */}
            {match.status === "pending" && match.player1 && match.player2 && onUpdateScore && (
              <div className="pt-2 space-y-2">
                {!isEditing ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingMatch(match.id)}
                    className="w-full"
                  >
                    Enter Score
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Score 1"
                        value={score1}
                        onChange={(e) => setScore1(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Score 2"
                        value={score2}
                        onChange={(e) => setScore2(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleScoreUpdate(match.id)}
                        disabled={updating}
                        className="flex-1"
                      >
                        {updating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingMatch(null);
                          setScore1("");
                          setScore2("");
                        }}
                        disabled={updating}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    );
  };

  const getRoundName = (roundIndex: number) => {
    const roundsFromEnd = bracket.rounds - roundIndex;
    if (roundsFromEnd === 0) return "Final";
    if (roundsFromEnd === 1) return "Semi Finals";
    if (roundsFromEnd === 2) return "Quarter Finals";
    return `Round ${roundIndex + 1}`;
  };

  return (
    <div className="space-y-8">
      {/* Tournament Header */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold glow-text">{bracket.name}</h2>
            <p className="text-muted-foreground">
              {bracket.total_players} Players • {bracket.rounds} Rounds
            </p>
          </div>
          {bracket.is_complete && bracket.winner && (
            <div className="flex items-center gap-3 glass-card p-4 rounded-lg border-2 border-accent/50">
              <Award className="w-8 h-8 text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">Champion</div>
                <div className="font-bold text-accent">{bracket.winner.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bracket Grid */}
      <div className="space-y-8">
        {bracket.matches.map((roundMatches, roundIndex) => (
          <div key={roundIndex} className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {getRoundName(roundIndex)}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {roundMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
