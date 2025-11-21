import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SchedulingPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [formData, setFormData] = useState({
    courtCount: 4,
    matchDuration: 25,
    restTime: 5,
    startTime: "09:00",
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
    setShowSchedule(true);
    toast.success("Schedule Generated!", {
      description: "Match timetable has been created successfully",
    });
  };

  // Generate sample schedule
  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = formData.startTime;
    
    for (let i = 0; i < 12; i++) {
      const [hours, minutes] = currentTime.split(":").map(Number);
      const endMinutes = minutes + formData.matchDuration;
      const endHours = hours + Math.floor(endMinutes / 60);
      const finalMinutes = endMinutes % 60;
      
      const endTime = `${String(endHours).padStart(2, "0")}:${String(finalMinutes).padStart(2, "0")}`;
      
      slots.push({
        id: i + 1,
        startTime: currentTime,
        endTime,
        court: (i % formData.courtCount) + 1,
        match: `Match ${i + 1}`,
        players: `Player ${i * 2 + 1} vs Player ${i * 2 + 2}`,
      });
      
      // Add rest time
      const nextMinutes = finalMinutes + formData.restTime;
      const nextHours = endHours + Math.floor(nextMinutes / 60);
      currentTime = `${String(nextHours).padStart(2, "0")}:${String(nextMinutes % 60).padStart(2, "0")}`;
    }
    
    return slots;
  };

  return (
    <div className="space-y-6">
      {/* Scheduling Form */}
      <div className="glass-card p-6 rounded-xl space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="courtCount">Number of Courts</Label>
            <Input
              id="courtCount"
              type="number"
              min="1"
              max="12"
              value={formData.courtCount}
              onChange={(e) => setFormData({ ...formData, courtCount: parseInt(e.target.value) })}
            />
          </div>

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

      {/* Generated Schedule */}
      {showSchedule && (
        <div className="glass-card p-6 rounded-xl animate-fade-in">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            Match Timetable
          </h3>

          <div className="space-y-3">
            {generateTimeSlots().map((slot, index) => (
              <div
                key={slot.id}
                className="bg-secondary/30 p-4 rounded-lg border border-border/50 smooth-transition hover:border-primary/50 animate-slide-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">C{slot.court}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{slot.match}</div>
                      <div className="text-sm text-muted-foreground">{slot.players}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formData.matchDuration} mins
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
