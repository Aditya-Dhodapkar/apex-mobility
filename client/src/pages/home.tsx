import { CalendarView } from "@/components/CalendarView";

export default function Home() {
  // TODO: Replace with actual user ID from auth
  const userId = 1;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">Mobility Tracker</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Track Your Progress</h2>
          <CalendarView userId={userId} />
        </div>
      </main>
    </div>
  );
}
