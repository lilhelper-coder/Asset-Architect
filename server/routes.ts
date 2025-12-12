import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertSeniorConfigSchema, insertGiftPoolSchema, insertContributorSchema } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/profiles", async (req, res) => {
    try {
      const data = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(data);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create profile" });
      }
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/senior-configs", async (req, res) => {
    try {
      const data = insertSeniorConfigSchema.parse(req.body);
      const config = await storage.createSeniorConfig(data);
      res.json(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid config data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create senior config" });
      }
    }
  });

  app.get("/api/senior-configs/:profileId", async (req, res) => {
    try {
      const config = await storage.getSeniorConfigByProfileId(req.params.profileId);
      if (!config) {
        return res.status(404).json({ message: "Config not found" });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch config" });
    }
  });

  app.post("/api/gift-pools", async (req, res) => {
    try {
      const magicLinkCode = uuidv4();
      const data = insertGiftPoolSchema.parse({
        ...req.body,
        magicLinkCode,
      });
      const pool = await storage.createGiftPool(data);
      res.json(pool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid gift pool data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create gift pool" });
      }
    }
  });

  app.get("/api/gift-pools/:code", async (req, res) => {
    try {
      const pool = await storage.getGiftPoolByMagicLink(req.params.code);
      if (!pool) {
        return res.status(404).json({ message: "Gift pool not found" });
      }
      const contributors = await storage.getContributorsByPoolId(pool.id);
      res.json({ ...pool, contributors });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gift pool" });
    }
  });

  app.post("/api/contributors", async (req, res) => {
    try {
      const data = insertContributorSchema.parse(req.body);
      const contributor = await storage.createContributor(data);
      
      const pool = await storage.getGiftPoolByMagicLink(req.body.poolCode);
      if (pool) {
        const newAmount = (pool.currentRaised || 0) + data.amountPledged;
        await storage.updateGiftPoolAmount(pool.id, newAmount);
      }
      
      res.json(contributor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid contributor data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to add contributor" });
      }
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
