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


// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  joinedAt: date("joined_at").notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  joinedAt: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const userCompletions = pgTable("user_completions", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull(),
  completionId: serial("completion_id").notNull()
});

export const insertUserCompletionSchema = z.object({
  userId: z.number(),
  completionId: z.number()
});

export type InsertUserCompletion = z.infer<typeof insertUserCompletionSchema>;
export type UserCompletion = typeof userCompletions.$inferSelect;

export const extendedRoutines = [
  { id: "A", name: "Upper Body Focus", difficulty: "Intermediate" },
  { id: "B", name: "Lower Body Flow", difficulty: "Beginner" },
  { id: "C", name: "Full Body Mobility", difficulty: "Intermediate" },
  { id: "D", name: "Hip Opening", difficulty: "Beginner" },
  { id: "E", name: "Shoulder Mobility", difficulty: "Intermediate" },
  { id: "F", name: "Spine Flexibility", difficulty: "Advanced" },
  { id: "G", name: "Joint Health", difficulty: "Beginner" },
  { id: "H", name: "Dynamic Stretching", difficulty: "Intermediate" },
  { id: "I", name: "Recovery Flow", difficulty: "Beginner" },
  { id: "J", name: "Balance & Control", difficulty: "Advanced" }
];
 
export const difficultyLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export type Difficulty = (typeof difficultyLevels)[number];

export const routineSchema = z.object({
  id: z.string(),
  name: z.string(),
  difficulty: z.enum(difficultyLevels)
});

export type Routine = z.infer<typeof routineSchema>;