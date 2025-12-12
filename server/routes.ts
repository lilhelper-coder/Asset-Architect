import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupVoiceWebSocket } from "./voice";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Test endpoint
  app.get("/api/test", (_req, res) => {
    res.json({ message: "Crystal Backend is Connected" });
  });

  // Setup Voice WebSocket for Crystal AI
  setupVoiceWebSocket(httpServer);

  return httpServer;
}
