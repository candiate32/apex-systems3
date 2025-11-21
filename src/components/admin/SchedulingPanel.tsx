import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useScheduleGenerator } from "@/hooks/useScheduleGenerator";
import { ScheduleResultView } from "./schedule/ScheduleResultView";
import { Skeleton } from "@/components/ui/skeleton";
import { playerApi } from "@/api";
import { courtApi } from "@/api";

export default function SchedulingPanel() {
  const { generateSchedule, saveSchedule, isGenerating, isSaving, scheduleData } = useScheduleGenerator();
  const [players, setPlayers] = useState<Array<{ id: string; name: string }>>([]);
  const [courts, setCourts] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    matchDuration: 25,
    restTime: 5,
    startTime: "09:00",
    selectedPlayers: [] as string[],
    selectedCourts: [] as string[],
  });

  // Fetch players and courts on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersData, courtsData] = await Promise.all([
          playerApi.getPlayers(),
          courtApi.getCourts(),
        ]);
        setPlayers(playersData);
        setCourts(courtsData);
        
        // Auto-select first 8 players and 4 courts
        setFormData(prev => ({
          ...prev,
          selectedPlayers: playersData.slice(0, 8).map((p: any) => p.id),
          selectedCourts: courtsData.slice(0, 4).map((c: any) => c.id),
        }));
      } catch (error) {
        toast.error("Failed to load data", {
          description: "Could not fetch players or courts",
        });
      }
    };
    fetchData();
  }, []);

  const handleGenerate = () => {
    if (formData.selectedPlayers.length === 0) {
      toast.error("No Players Selected", {
        description: "Please select at least 2 players",
      });
      return;
    }

    if (formData.selectedCourts.length === 0) {
      toast.error("No Courts Selected", {
        description: "Please select at least 1 court",
      });
      return;
    }

    generateSchedule({
      player_ids: formData.selectedPlayers,
      court_ids: formData.selectedCourts,
      match_duration: formData.matchDuration,
      rest_time: formData.restTime,
      start_time: formData.startTime,
    });
  };

  const handleSave = () => {
    if (scheduleData) {
      saveSchedule(scheduleData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Scheduling Form */}
      <div className="glass-card p-6 rounded-xl space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="matchDuration">Match Duration (minutes)</Label>
            <Input
              id="matchDuration"
              type="number"
              min="15"
              max="60"
              value={formData.matchDuration}
              onChange={(e) => setFormData({ ...formData, matchDuration: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restTime">Rest Time (minutes)</Label>
            <Input
              id="restTime"
              type="number"
              min="0"
              max="30"
              value={formData.restTime}
              onChange={(e) => setFormData({ ...formData, restTime: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Selected Players</Label>
            <div className="text-sm text-muted-foreground">
              {formData.selectedPlayers.length} of {players.length} players selected
            </div>
          </div>

          <div className="space-y-2">
            <Label>Selected Courts</Label>
            <div className="text-sm text-muted-foreground">
              {formData.selectedCourts.length} of {courts.length} courts selected
            </div>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating || players.length === 0 || courts.length === 0}
          className="w-full neon-border smooth-transition hover:scale-105"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Schedule...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 mr-2" />
              Generate Schedule
            </>
          )}
        </Button>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      )}

      {/* Generated Schedule */}
      {scheduleData && !isGenerating && (
        <ScheduleResultView
          schedule={scheduleData}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {/* Empty State */}
      {!scheduleData && !isGenerating && (
        <div className="glass-card p-12 rounded-xl text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Schedule Generated Yet</h3>
          <p className="text-muted-foreground">
            Configure the settings above and click "Generate Schedule" to create a match timetable
          </p>
        </div>
      )}
    </div>
  );
}
