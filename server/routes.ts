import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/completions", async (req, res) => {
    const userId = Number(req.query.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const completions = await storage.getCompletions(userId);
    res.json(completions);
  });

  app.post("/api/completions/toggle", async (req, res) => {
    const { userId, date } = req.body;
    if (!userId || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const completion = await storage.toggleCompletion(userId, new Date(date));
    res.json(completion);
  });

  const httpServer = createServer(app);
  return httpServer;
}
