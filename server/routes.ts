import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });

  // WebSocket logic
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

    socket.on("fetchCompletions", async ({ userId }) => {
      if (!userId) {
        return socket.emit("error", { message: "Missing userId" });
      }
      const completions = await storage.getCompletions(userId);
      socket.emit("completionsData", completions);
    });

    socket.on("newUser", async (user) => {
      if (!user || !user.name) {
        return socket.emit("error", { message: "Invalid user data" });
      }
      const createdUser = await storage.createUser(user);
      io.emit("userCreated", createdUser);
    });

    socket.on("disconnect", () => {
      console.log(`WebSocket disconnected: ${socket.id}`);
    });
  });

  // RESTful API routes
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

  app.post("/api/users", async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const newUser = await storage.createUser({ name, email });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Could not create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    const userId = Number(req.params.id);
    const updates = req.body;
    if (isNaN(userId) || !updates) {
      return res.status(400).json({ message: "Invalid input" });
    }

    try {
      const updatedUser = await storage.updateUser(userId, updates);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Could not update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      await storage.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Could not delete user" });
    }
  });

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

  return httpServer;
}