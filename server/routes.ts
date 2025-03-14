import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Server as SocketIOServer } from "socket.io";

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

import { Server as SocketIOServer } from "socket.io";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`WebSocket connected: ${socket.id}`);

    socket.on("toggleCompletion", async (data) => {
      const { userId, date } = data;
      if (!userId || !date) {
        return socket.emit("error", { message: "Missing required fields" });
      }
      const completion = await storage.toggleCompletion(userId, new Date(date));
      io.emit("completionUpdated", completion);
    });

    socket.on("disconnect", () => {
      console.log(`WebSocket disconnected: ${socket.id}`);
    });
  });

  app.get("/api/users/:id", async (req, res) => {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}