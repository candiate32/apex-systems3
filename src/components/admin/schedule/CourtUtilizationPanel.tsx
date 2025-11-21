import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface CourtUtilizationPanelProps {
  utilization: { [courtId: string]: number };
  courts: Array<{ id: string; name: string }>;
}

export function CourtUtilizationPanel({ utilization, courts }: CourtUtilizationPanelProps) {
  const getUtilizationColor = (percent: number) => {
    if (percent >= 80) return "text-green-500";
    if (percent >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const courtUtilizationData = courts.map(court => ({
    id: court.id,
    name: court.name,
    percentage: utilization[court.id] || 0,
  }));

  const averageUtilization = 
    Object.values(utilization).reduce((sum, val) => sum + val, 0) / Object.keys(utilization).length || 0;

  return (
    <div className="glass-card p-6 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Court Utilization
        </h3>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Average</div>
          <div className={`text-2xl font-bold ${getUtilizationColor(averageUtilization)}`}>
            {averageUtilization.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {courtUtilizationData.map((court) => (
          <div key={court.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{court.name}</span>
              <span className={`font-semibold ${getUtilizationColor(court.percentage)}`}>
                {court.percentage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={court.percentage} 
              className="h-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
