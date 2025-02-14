import { pgTable, text, serial, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const completions = pgTable("completions", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  completed: boolean("completed").notNull().default(false)
});

export const insertCompletionSchema = createInsertSchema(completions).pick({
  date: true,
  completed: true
});

export type InsertCompletion = z.infer<typeof insertCompletionSchema>;
export type Completion = typeof completions.$inferSelect;

export const routines = [
  { id: "A", name: "Upper Body Focus" },
  { id: "B", name: "Lower Body Flow" },
  { id: "C", name: "Full Body Mobility" },
  { id: "D", name: "Hip Opening" },
  { id: "E", name: "Shoulder Mobility" },
  { id: "F", name: "Spine Flexibility" },
  { id: "G", name: "Joint Health" },
  { id: "H", name: "Dynamic Stretching" },
  { id: "I", name: "Recovery Flow" },
  { id: "J", name: "Balance & Control" }
];
