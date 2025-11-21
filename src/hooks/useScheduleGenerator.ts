import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tournamentApi } from "@/api";
import { GenerateSchedulePayload, SchedulingResponse } from "@/api/tournamentApi";
import { toast } from "sonner";

export function useScheduleGenerator() {
  const queryClient = useQueryClient();

  const generateSchedule = useMutation({
    mutationFn: (payload: GenerateSchedulePayload) => 
      tournamentApi.generateSchedule(payload),
    onSuccess: (data) => {
      toast.success("Schedule Generated!", {
        description: `${data.scheduled_matches.length} matches scheduled successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error: Error) => {
      toast.error("Schedule Generation Failed", {
        description: error.message || "Unable to generate schedule",
      });
    },
  });

  const saveSchedule = useMutation({
    mutationFn: (schedule: SchedulingResponse) =>
      tournamentApi.saveSchedule(schedule),
    onSuccess: () => {
      toast.success("Schedule Saved!", {
        description: "Schedule has been saved to the database",
      });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error: Error) => {
      toast.error("Save Failed", {
        description: error.message || "Unable to save schedule",
      });
    },
  });

  return {
    generateSchedule: generateSchedule.mutate,
    saveSchedule: saveSchedule.mutate,
    isGenerating: generateSchedule.isPending,
    isSaving: saveSchedule.isPending,
    error: generateSchedule.error || saveSchedule.error,
    scheduleData: generateSchedule.data,
  };
}
