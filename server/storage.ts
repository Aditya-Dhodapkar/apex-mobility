import { completions, type Completion, type InsertCompletion } from "@shared/schema";

export interface IStorage {
  getCompletions(): Promise<Completion[]>;
  addCompletion(completion: InsertCompletion): Promise<Completion>;
  toggleCompletion(date: Date): Promise<Completion>;
  deleteCompletion(date: Date): Promise<boolean>;
  updateCompletion(date: Date, updates: Partial<Completion>): Promise<Completion | null>;
  getCompletionsInRange(start: Date, end: Date): Promise<Completion[]>;
  clearAll(): Promise<void>;
  countCompleted(): Promise<number>;
}

export class MemStorage implements IStorage {
  private completions: Map<string, Completion>;
  private currentId: number;

  constructor() {
    this.completions = new Map();
    this.currentId = 1;
  }

  async getCompletions(): Promise<Completion[]> {
    return Array.from(this.completions.values());
  }

  async addCompletion(insertCompletion: InsertCompletion): Promise<Completion> {
    const id = this.currentId++;
    const completion: Completion = {
      ...insertCompletion,
      id,
      completed: insertCompletion.completed ?? false,
    };
    this.completions.set(completion.date.toISOString(), completion);
    return completion;
  }

  async toggleCompletion(date: Date): Promise<Completion> {
    const dateStr = date.toISOString();
    const existing = this.completions.get(dateStr);

    if (existing) {
      const updated = { ...existing, completed: !existing.completed };
      this.completions.set(dateStr, updated);
      return updated;
    }

    return this.addCompletion({ date, completed: true });
  }

  async deleteCompletion(date: Date): Promise<boolean> {
    const dateStr = date.toISOString();
    return this.completions.delete(dateStr);
  }

  async updateCompletion(
    date: Date,
    updates: Partial<Completion>
  ): Promise<Completion | null> {
    const dateStr = date.toISOString();
    const existing = this.completions.get(dateStr);
    if (!existing) return null;

    const updated: Completion = { ...existing, ...updates };
    this.completions.set(dateStr, updated);
    return updated;
  }

  async getCompletionsInRange(start: Date, end: Date): Promise<Completion[]> {
    return Array.from(this.completions.values()).filter((comp) => {
      const time = new Date(comp.date).getTime();
      return time >= start.getTime() && time <= end.getTime();
    });
  }

  async clearAll(): Promise<void> {
    this.completions.clear();
    this.currentId = 1;
  }

  async countCompleted(): Promise<number> {
    return Array.from(this.completions.values()).filter((c) => c.completed).length;
  }
}

export const storage = new MemStorage();