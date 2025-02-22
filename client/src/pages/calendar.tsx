import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Completion } from "@shared/schema";
import { Check, X } from "lucide-react";

export default function Calendar() {
  const { toast } = useToast();

  const { data: completions } = useQuery<Completion[]>({
    queryKey: ["/api/completions"]
  });

  const mutation = useMutation({
    mutationFn: async (date: Date) => {
      const res = await apiRequest("POST", "/api/completions/toggle", { date });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/completions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update completion status",
        variant: "destructive"
      });
    }
  });

  const completionMap = new Map(
    completions?.map(c => [c.date, c.completed]) || []
  );

  const modifiers = {
    completed: (date: Date) => completionMap.get(date.toISOString()) === true,
    uncompleted: (date: Date) => completionMap.get(date.toISOString()) === false
  };

  const modifiersStyles = {
    completed: { color: "var(--primary)" },
    uncompleted: { color: "var(--destructive)" }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Progress Calendar</h1>
        <p className="text-muted-foreground">
          Track your daily mobility practice. Click on a date to toggle completion status.
        </p>
      </div>

      <div className="flex justify-center p-4 border rounded-lg bg-card">
        <CalendarComponent
          mode="single"
          selected={new Date()}
          onSelect={(date) => date && mutation.mutate(date)}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            DayContent: ({ date }) => (
              <div className="flex items-center justify-center w-full h-full">
                <span>{date.getDate()}</span>
                {completionMap.get(date.toISOString()) === true && (
                  <Check className="h-4 w-4 absolute bottom-0 right-0 text-primary" />
                )}
                {completionMap.get(date.toISOString()) === false && (
                  <X className="h-4 w-4 absolute bottom-0 right-0 text-destructive" />
                )}
              </div>
            )
          }}
        />
      </div>
    </div>
  );
}

const fetchCompletionsForMonth = async (month: number, year: number) => {
  try {
    const res = await apiRequest("GET", `/api/completions?month=${month}&year=${year}`);
    const data = await res.json();
    return new Map(data.map((c: Completion) => [c.date, c.completed]));
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load completion data",
      variant: "destructive"
    });
    return new Map();
  }
};


const toggleCompletion = async (date: Date) => {
  try {
    const response = await apiRequest("POST", "/api/completions/toggle", { date });
    const updatedCompletion = await response.json();
    if (!response.ok) {
      throw new Error("Failed to update completion status");
    }
    queryClient.setQueryData(["/api/completions"], (oldData: Completion[]) => {
      const updatedData = oldData.map((c) =>
        c.date === updatedCompletion.date ? updatedCompletion : c
      );
      return updatedData;
    });

    toast({
      title: "Success",
      description: `Completion status updated for ${date.toDateString()}`,
      variant: "success"
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update completion status",
      variant: "destructive"
    });
  }
};

const today = new Date();
const { data: completionMap } = useQuery({
  queryKey: [`/api/completions/${today.getMonth() + 1}/${today.getFullYear()}`],
  queryFn: () => fetchCompletionsForMonth(today.getMonth() + 1, today.getFullYear())
});