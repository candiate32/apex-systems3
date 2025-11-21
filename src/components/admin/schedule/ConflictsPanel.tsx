import { AlertTriangle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ConflictsPanelProps {
  violations: string[];
  conflicts: string[];
}

export function ConflictsPanel({ violations, conflicts }: ConflictsPanelProps) {
  if (violations.length === 0 && conflicts.length === 0) {
    return (
      <Alert className="glass-card border-green-500/50">
        <AlertCircle className="h-5 w-5 text-green-500" />
        <AlertTitle className="text-green-500">No Issues Detected</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          The schedule has been generated successfully without any conflicts or violations.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {violations.length > 0 && (
        <Alert variant="destructive" className="glass-card">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Player Rest Violations ({violations.length})</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
              {violations.map((violation, index) => (
                <li key={index}>{violation}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {conflicts.length > 0 && (
        <Alert className="glass-card border-amber-500/50">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <AlertTitle className="text-amber-500">Scheduling Conflicts ({conflicts.length})</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
              {conflicts.map((conflict, index) => (
                <li key={index}>{conflict}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
