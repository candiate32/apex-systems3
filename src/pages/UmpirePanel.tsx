import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { matchCodeSchema, scoreSchema } from "@/lib/validators";
import { mockMatches } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

type MatchCodeData = z.infer<typeof matchCodeSchema>;
type ScoreData = z.infer<typeof scoreSchema>;

export default function UmpirePanel() {
  const [validatedMatch, setValidatedMatch] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    register: registerCode,
    handleSubmit: handleSubmitCode,
    formState: { errors: codeErrors },
  } = useForm<MatchCodeData>({
    resolver: zodResolver(matchCodeSchema),
  });

  const {
    register: registerScore,
    handleSubmit: handleSubmitScore,
    formState: { errors: scoreErrors, isSubmitting },
  } = useForm<ScoreData>({
    resolver: zodResolver(scoreSchema),
  });

  const onValidateCode = (data: MatchCodeData) => {
    const match = mockMatches.find((m) => m.code === data.code);
    
    if (match) {
      setValidatedMatch(match);
      toast.success("Match Code Validated!", {
        description: `${match.player1} vs ${match.player2}`,
        icon: <CheckCircle2 className="text-accent" />,
      });
    } else {
      toast.error("Invalid Match Code", {
        description: "Please check the code and try again.",
      });
    }
  };

  const onSubmitScore = async (data: ScoreData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsCompleted(true);
    toast.success("Match Completed!", {
      description: "Score has been recorded successfully.",
      icon: <CheckCircle2 className="text-accent" />,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8 animate-slide-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3 glow-text">Umpire Panel</h1>
        <p className="text-muted-foreground">
          Validate match code and submit scores
        </p>
      </div>

      {!validatedMatch ? (
        /* Match Code Validation */
        <form
          onSubmit={handleSubmitCode(onValidateCode)}
          className="glass-card p-8 rounded-xl space-y-6 animate-fade-in"
        >
          <div className="space-y-2">
            <Label htmlFor="code">Enter Match Code</Label>
            <Input
              id="code"
              {...registerCode("code")}
              placeholder="e.g., SPT2024001"
              className={`text-center text-lg font-mono ${
                codeErrors.code ? "border-destructive" : ""
              }`}
              autoComplete="off"
            />
            {codeErrors.code && (
              <p className="text-sm text-destructive animate-slide-up">
                {codeErrors.code.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-center">
              Match code must be uppercase letters and numbers
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full neon-border smooth-transition hover:scale-105"
          >
            <Shield className="w-5 h-5 mr-2" />
            Validate Code
          </Button>
        </form>
      ) : (
        /* Score Entry Form */
        <div className="space-y-6 animate-fade-in">
          {/* Match Info */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Match Details</h3>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-muted-foreground">Live</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Code:</span>
                <span className="font-mono font-semibold">{validatedMatch.code}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Event:</span>
                <span>{validatedMatch.eventType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Round:</span>
                <span>{validatedMatch.round}</span>
              </div>
            </div>
          </div>

          {/* Score Form */}
          {!isCompleted ? (
            <form
              onSubmit={handleSubmitScore(onSubmitScore)}
              className="glass-card p-8 rounded-xl space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="player1Score">{validatedMatch.player1}</Label>
                  <Input
                    id="player1Score"
                    type="number"
                    {...registerScore("player1Score", { valueAsNumber: true })}
                    placeholder="Score"
                    min="0"
                    className={scoreErrors.player1Score ? "border-destructive" : ""}
                  />
                  {scoreErrors.player1Score && (
                    <p className="text-sm text-destructive">
                      {scoreErrors.player1Score.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="player2Score">{validatedMatch.player2}</Label>
                  <Input
                    id="player2Score"
                    type="number"
                    {...registerScore("player2Score", { valueAsNumber: true })}
                    placeholder="Score"
                    min="0"
                    className={scoreErrors.player2Score ? "border-destructive" : ""}
                  />
                  {scoreErrors.player2Score && (
                    <p className="text-sm text-destructive">
                      {scoreErrors.player2Score.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full neon-border smooth-transition hover:scale-105"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Submit Result
                  </>
                )}
              </Button>
            </form>
          ) : (
            /* Completed State */
            <div className="glass-card p-12 rounded-xl text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-4">
                <Lock className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Match Completed</h3>
              <p className="text-muted-foreground">
                The score has been recorded and the match is now closed.
              </p>
              <Button
                onClick={() => {
                  setValidatedMatch(null);
                  setIsCompleted(false);
                }}
                variant="secondary"
                className="mt-4"
              >
                Validate Another Match
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
