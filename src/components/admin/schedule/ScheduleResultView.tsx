import { SchedulingResponse } from "@/api/algorithmsApi";
import { ScheduleMatchesTable } from "./ScheduleMatchesTable";
import { CourtUtilizationPanel } from "./CourtUtilizationPanel";
import { ConflictsPanel } from "./ConflictsPanel";
import { ScheduleSummary } from "./ScheduleSummary";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ScheduleResultViewProps {
  schedule: SchedulingResponse;
  onSave?: () => void;
  isSaving?: boolean;
}

export function ScheduleResultView({ schedule, onSave, isSaving }: ScheduleResultViewProps) {
  // Extract unique courts from scheduled matches
  const courts = Array.from(
    new Set(schedule.scheduled_matches.map(m => m.court.id))
  ).map(id => {
    const match = schedule.scheduled_matches.find(m => m.court.id === id);
    return match!.court;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Stats */}
      <ScheduleSummary
        totalScheduleTime={schedule.total_schedule_time}
        matchCount={schedule.scheduled_matches.length}
        courtCount={courts.length}
      />

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={onSave}
            disabled={isSaving}
            className="neon-border smooth-transition hover:scale-105"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? "Saving Schedule..." : "Save This Schedule"}
          </Button>
        </div>
      )}

      {/* Conflicts & Violations */}
      <ConflictsPanel
        violations={schedule.player_rest_violations}
        conflicts={schedule.scheduling_conflicts}
      />

      {/* Court Utilization */}
      <CourtUtilizationPanel
        utilization={schedule.court_utilization}
        courts={courts}
      />

      {/* Scheduled Matches Table */}
      <ScheduleMatchesTable matches={schedule.scheduled_matches} />
    </div>
  );
}
