import { useState } from "react";
import { useTournament } from "@/contexts/TournamentContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Committee() {
  const { matches, courts, assignCourtToMatch, allocateCourtsToSession, availableCourts } = useTournament();
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [courtCount, setCourtCount] = useState(availableCourts.toString());

  const handleAssignCourt = () => {
    if (!selectedMatch || !selectedCourt || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields to assign a court",
        variant: "destructive",
      });
      return;
    }

    assignCourtToMatch(selectedMatch, parseInt(selectedCourt), startTime, endTime);
    toast({
      title: "Court Assigned Successfully!",
      description: `Match assigned to Court ${selectedCourt}`,
    });

    // Reset form
    setSelectedMatch("");
    setSelectedCourt("");
    setStartTime("");
    setEndTime("");
  };

  const handleAllocateCourts = () => {
    const count = parseInt(courtCount);
    if (isNaN(count) || count < 1 || count > 20) {
      toast({
        title: "Invalid Court Count",
        description: "Please enter a number between 1 and 20",
        variant: "destructive",
      });
      return;
    }

    allocateCourtsToSession(count);
    toast({
      title: "Courts Allocated!",
      description: `${count} courts have been allocated to this session`,
    });
  };

  const pendingMatches = matches.filter(m => m.status === "pending");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 glow-text">Committee Panel</h1>
        <p className="text-muted-foreground">
          Manage court allocations and assign matches to courts
        </p>
      </div>

      {/* Court Allocation Section */}
      <Card className="glass-card p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-neon-cyan" />
          <h2 className="text-2xl font-semibold">Allocate Courts to Session</h2>
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="courtCount">Number of Courts</Label>
            <Input
              id="courtCount"
              type="number"
              min="1"
              max="20"
              value={courtCount}
              onChange={(e) => setCourtCount(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleAllocateCourts} className="neon-border">
            Allocate Courts
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Currently allocated: <span className="text-neon-cyan font-semibold">{availableCourts}</span> courts
        </p>
      </Card>

      {/* Court Assignment Section */}
      <Card className="glass-card p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-neon-purple" />
          <h2 className="text-2xl font-semibold">Assign Match to Court</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="match">Select Match</Label>
            <Select value={selectedMatch} onValueChange={setSelectedMatch}>
              <SelectTrigger id="match" className="mt-1">
                <SelectValue placeholder="Choose a pending match" />
              </SelectTrigger>
              <SelectContent>
                {pendingMatches.map((match) => (
                  <SelectItem key={match.id} value={match.id}>
                    {match.code} - {match.player1} vs {match.player2}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="court">Select Court</Label>
            <Select value={selectedCourt} onValueChange={setSelectedCourt}>
              <SelectTrigger id="court" className="mt-1">
                <SelectValue placeholder="Choose a court" />
              </SelectTrigger>
              <SelectContent>
                {courts.map((court) => (
                  <SelectItem key={court.id} value={court.id.toString()}>
                    Court {court.id} {court.currentMatch ? "(In Use)" : "(Available)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <Button onClick={handleAssignCourt} className="w-full neon-border">
          <Clock className="w-4 h-4 mr-2" />
          Assign Court to Match
        </Button>
      </Card>

      {/* Current Court Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
        {courts.map((court) => (
          <Card key={court.id} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Court {court.id}</h3>
              <div className={`w-3 h-3 rounded-full ${court.currentMatch ? 'bg-red-500 pulse-glow' : 'bg-green-500'}`} />
            </div>
            {court.currentMatch ? (
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Now Playing:</p>
                <p className="font-semibold text-neon-cyan">
                  {court.currentMatch.player1} vs {court.currentMatch.player2}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {court.currentMatch.startTime} - {court.currentMatch.endTime}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Available</p>
            )}
          </Card>
        ))}
      </div>

      {/* Pending Matches List */}
      {pendingMatches.length > 0 && (
        <Card className="glass-card p-6 animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4">Pending Matches ({pendingMatches.length})</h2>
          <div className="space-y-2">
            {pendingMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 smooth-transition">
                <div>
                  <p className="font-semibold">{match.code}</p>
                  <p className="text-sm text-muted-foreground">
                    {match.player1} vs {match.player2}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{match.eventType}</p>
                  <p className="text-xs text-accent">{match.round}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
