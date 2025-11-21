import { ScheduledMatch } from "@/api/tournamentApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface ScheduleMatchesTableProps {
  matches: ScheduledMatch[];
}

export function ScheduleMatchesTable({ matches }: ScheduleMatchesTableProps) {
  const formatTime = (isoString: string) => {
    try {
      return format(new Date(isoString), "HH:mm");
    } catch {
      return isoString;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return format(new Date(isoString), "MMM dd, yyyy");
    } catch {
      return "";
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Scheduled Matches
        </h3>
        <Badge variant="secondary" className="text-sm">
          {matches.length} Matches
        </Badge>
      </div>

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30">
              <TableHead className="font-semibold">Court</TableHead>
              <TableHead className="font-semibold">Player 1</TableHead>
              <TableHead className="font-semibold">Player 2</TableHead>
              <TableHead className="font-semibold">Start Time</TableHead>
              <TableHead className="font-semibold">End Time</TableHead>
              <TableHead className="font-semibold">Penalty</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((scheduled, index) => (
              <TableRow 
                key={scheduled.id || index}
                className="smooth-transition hover:bg-secondary/20"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {scheduled.court.name.substring(0, 2)}
                      </span>
                    </div>
                    <span>{scheduled.court.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{scheduled.match.player1.name}</div>
                    <div className="text-xs text-muted-foreground">{scheduled.match.player1.club}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{scheduled.match.player2.name}</div>
                    <div className="text-xs text-muted-foreground">{scheduled.match.player2.club}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {formatTime(scheduled.scheduled_start_time)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {formatTime(scheduled.scheduled_end_time)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={scheduled.match.penalty > 0 ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {scheduled.match.penalty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={scheduled.status === "scheduled" ? "default" : "secondary"}
                    className="text-xs capitalize"
                  >
                    {scheduled.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
