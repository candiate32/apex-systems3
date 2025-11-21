import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";

export default function FixtureGeneration() {
  const [format, setFormat] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBracket, setShowBracket] = useState(false);

  const handleGenerate = async () => {
    if (!format || !category) {
      toast.error("Missing Information", {
        description: "Please select both format and category",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    setShowBracket(true);
    
    toast.success("Fixtures Generated!", {
      description: `${format} fixtures created for ${category}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="glass-card p-6 rounded-xl space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Tournament Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="knockout">Knockout</SelectItem>
                <SelectItem value="round-robin">Round Robin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men-singles-u17">Men's Singles U17</SelectItem>
                <SelectItem value="men-singles-open">Men's Singles Open</SelectItem>
                <SelectItem value="women-singles-u17">Women's Singles U17</SelectItem>
                <SelectItem value="men-doubles-u17">Men's Doubles U17</SelectItem>
                <SelectItem value="mixed-doubles">Mixed Doubles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full neon-border smooth-transition hover:scale-105"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Fixtures...
            </>
          ) : (
            <>
              <Trophy className="w-5 h-5 mr-2" />
              Generate Fixtures
            </>
          )}
        </Button>
      </div>

      {/* Bracket View */}
      {showBracket && (
        <div className="glass-card p-6 rounded-xl animate-fade-in">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-primary" />
            Tournament Bracket - {category}
          </h3>
          
          {format === "knockout" ? (
            <div className="space-y-8">
              {/* Round 1 */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-4">Round 1</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((match) => (
                    <div key={match} className="bg-secondary/30 p-4 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Player {match * 2 - 1}</span>
                        <span className="text-xs text-muted-foreground">vs</span>
                        <span className="text-sm font-medium">Player {match * 2}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Match #{match}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semi Finals */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-4">Semi Finals</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2].map((match) => (
                    <div key={match} className="bg-secondary/30 p-4 rounded-lg border border-primary/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Winner M{match * 2 - 1}</span>
                        <span className="text-xs text-muted-foreground">vs</span>
                        <span className="text-sm font-medium">Winner M{match * 2}</span>
                      </div>
                      <div className="text-xs text-primary">SF-{match}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-4">Final</h4>
                <div className="bg-secondary/30 p-6 rounded-lg border-2 border-accent/50 max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Winner SF-1</span>
                    <Trophy className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium">Winner SF-2</span>
                  </div>
                  <div className="text-xs text-accent text-center mt-2">Championship Match</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-center">
                Round Robin format: All players will play against each other once
              </p>
              <div className="grid gap-3">
                {[1, 2, 3, 4, 5, 6].map((match) => (
                  <div key={match} className="bg-secondary/30 p-4 rounded-lg border border-border/50 flex items-center justify-between">
                    <span className="text-sm">Player {match} vs Player {match + 1}</span>
                    <span className="text-xs text-muted-foreground">Round {Math.ceil(match / 2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
