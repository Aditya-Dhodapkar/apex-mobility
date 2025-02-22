import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Completion } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

interface CalendarViewProps {
  userId: number;
}

export function CalendarView({ userId }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const today = new Date();

  const { data: completions, isLoading } = useQuery<Completion[]>({
    queryKey: ["/api/completions", { userId }],
  });

  const toggleMutation = useMutation({
    mutationFn: async (date: Date) => {
      return apiRequest("POST", "/api/completions/toggle", {
        userId,
        date: date.toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/completions", { userId }] });
    },
  });

  const completedDates = completions?.reduce((acc, completion) => {
    if (completion.completed) {
      acc[new Date(completion.date).toISOString().split("T")[0]] = true;
    }
    return acc;
  }, {} as Record<string, boolean>) ?? {};

  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    toggleMutation.mutate(date);
  };

  const todayStr = today.toISOString().split("T")[0];
  const isTodayCompleted = completedDates[todayStr];

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Today's Progress</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{format(today, 'MMMM d, yyyy')}</span>
          <Button 
            variant={isTodayCompleted ? "default" : "outline"}
            onClick={() => handleDateClick(today)}
            size="lg"
            className={`w-12 h-12 rounded-full ${isTodayCompleted ? 'bg-green-500 hover:bg-green-600' : 'border-2 border-gray-300 hover:border-gray-400'}`}
          >
            <Check className={`h-6 w-6 ${isTodayCompleted ? 'text-white' : 'text-gray-400'}`} />
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateClick}
          className="rounded-md"
          components={{
            DayContent: ({ date }) => {
              const dateStr = date.toISOString().split("T")[0];
              const isCompleted = completedDates[dateStr];

              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <span>{date.getDate()}</span>
                  {isCompleted && (
                    <Check
                      className="absolute bottom-0 right-0 h-3 w-3 text-green-500"
                      aria-label="Completed"
                    />
                  )}
                </div>
              );
            },
          }}
        />
      </div>
    </div>
  );
}