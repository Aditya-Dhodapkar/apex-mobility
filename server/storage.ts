import { completions, type Completion, type InsertCompletion } from "@shared/schema";

export interface IStorage {
  getCompletions(): Promise<Completion[]>;
  addCompletion(completion: InsertCompletion): Promise<Completion>;
  toggleCompletion(date: Date): Promise<Completion>;
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
    const completion: Completion = { ...insertCompletion, id };
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
}

export const storage = new MemStorage();
