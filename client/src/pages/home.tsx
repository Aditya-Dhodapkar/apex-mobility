import { useState } from "react";
import { CalendarView } from "@/components/CalendarView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  // TODO: Replace with actual user ID from auth
  const userId = 1;

  const [note, setNote] = useState("");
  const [submittedNotes, setSubmittedNotes] = useState<string[]>([]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const handleNoteSubmit = () => {
    if (note.trim()) {
      setSubmittedNotes((prev) => [...prev, note]);
      setNote("");
    }
  };

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

          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-2">Add a Note</h3>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                value={note}
                onChange={handleNoteChange}
                placeholder="What did you do today?"
              />
              <Button onClick={handleNoteSubmit}>Submit</Button>
            </div>

            {submittedNotes.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium mb-2">Submitted Notes:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {submittedNotes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
