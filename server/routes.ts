import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express) {
  app.get("/api/completions", async (_req, res) => {
    const completions = await storage.getCompletions();
    res.json(completions);
  });

  app.post("/api/completions/toggle", async (req, res) => {
    const date = new Date(req.body.date);
    const completion = await storage.toggleCompletion(date);
    res.json(completion);
  });

  return createServer(app);
}
