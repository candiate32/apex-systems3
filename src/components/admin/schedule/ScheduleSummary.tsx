import { Clock, Calendar, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ScheduleSummaryProps {
  totalScheduleTime: number;
  matchCount: number;
  courtCount: number;
}

export function ScheduleSummary({ totalScheduleTime, matchCount, courtCount }: ScheduleSummaryProps) {
  const hours = Math.floor(totalScheduleTime / 60);
  const minutes = Math.round(totalScheduleTime % 60);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="glass-card p-6 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-medium">Total Duration</span>
        </div>
        <div className="text-3xl font-bold text-primary">
          {hours > 0 && `${hours}h `}
          {minutes}m
        </div>
        <p className="text-xs text-muted-foreground">
          {totalScheduleTime.toFixed(1)} minutes total
        </p>
      </Card>

      <Card className="glass-card p-6 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-medium">Scheduled Matches</span>
        </div>
        <div className="text-3xl font-bold text-primary">
          {matchCount}
        </div>
        <p className="text-xs text-muted-foreground">
          Across {courtCount} court{courtCount !== 1 ? 's' : ''}
        </p>
      </Card>

      <Card className="glass-card p-6 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Status</span>
        </div>
        <div className="text-3xl font-bold text-green-500">
          Ready
        </div>
        <p className="text-xs text-muted-foreground">
          Schedule is complete
        </p>
      </Card>
    </div>
  );
}
