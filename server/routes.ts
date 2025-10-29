import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStrategySchema, submitStrategySchema } from "@shared/schema";
import { z } from "zod";

// Simulated smart contract computation
// In production, this would call the actual FHEVault.sol contract
function simulateSmartContractComputation(encryptedData: string): string {
  // Simulate computation delay and return encrypted score
  // The encrypted score format matches what the client expects for decryption
  try {
    const decoded = atob(encryptedData);
    const data = JSON.parse(decoded);
    
    // Extract values for computation (in real FHE, this wouldn't be possible)
    const riskValue = extractValue(data.riskLevel);
    const allocValue = extractValue(data.allocation);
    const timeValue = extractValue(data.timeframe);
    
    // Simulated scoring algorithm (runs on encrypted data in production)
    const baseScore = 50;
    const riskBonus = (riskValue - 5) * 5;
    const allocBonus = allocValue / 5;
    const timeBonus = Math.min(timeValue / 10, 20);
    
    const score = Math.max(0, Math.min(100, baseScore + riskBonus + allocBonus + timeBonus));
    
    // Return encrypted result
    const encryptedResult = {
      value: Math.round(score),
      timestamp: Date.now(),
    };
    
    return btoa(JSON.stringify(encryptedResult));
  } catch (error) {
    console.error('Smart contract computation failed:', error);
    return btoa(JSON.stringify({ value: 0, timestamp: Date.now() }));
  }
}

function extractValue(encrypted: string): number {
  const match = encrypted.match(/_(\d+)_/);
  return match ? parseInt(match[1]) : 0;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/strategies/submit - Submit encrypted strategy
  app.post("/api/strategies/submit", async (req, res) => {
    try {
      const validatedData = insertStrategySchema.parse(req.body);
      
      // Create strategy in storage
      const strategy = await storage.createStrategy(validatedData);
      
      res.json({
        success: true,
        strategyId: strategy.id,
        message: "Strategy encrypted and submitted successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Invalid strategy data",
          details: error.errors,
        });
      }
      
      console.error("Strategy submission error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to submit strategy",
      });
    }
  });

  // POST /api/strategies/:id/compute - Trigger encrypted computation
  app.post("/api/strategies/:id/compute", async (req, res) => {
    try {
      const { id } = req.params;
      
      const strategy = await storage.getStrategy(id);
      if (!strategy) {
        return res.status(404).json({
          success: false,
          error: "Strategy not found",
        });
      }
      
      // Update status to computing
      await storage.updateStrategyStatus(id, "computing");
      
      // Simulate smart contract computation
      const encryptedScore = simulateSmartContractComputation(strategy.encryptedData);
      
      // Update strategy with encrypted score
      const updated = await storage.updateStrategyScore(id, encryptedScore);
      
      res.json({
        success: true,
        strategyId: id,
        encryptedScore,
        status: "completed",
      });
    } catch (error) {
      console.error("Computation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to compute strategy score",
      });
    }
  });

  // GET /api/strategies/:id - Get strategy details
  app.get("/api/strategies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const strategy = await storage.getStrategy(id);
      if (!strategy) {
        return res.status(404).json({
          success: false,
          error: "Strategy not found",
        });
      }
      
      res.json({
        success: true,
        strategy,
      });
    } catch (error) {
      console.error("Get strategy error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve strategy",
      });
    }
  });

  // GET /api/strategies - Get all strategies
  app.get("/api/strategies", async (req, res) => {
    try {
      const strategies = await storage.getAllStrategies();
      
      res.json({
        success: true,
        strategies,
        count: strategies.length,
      });
    } catch (error) {
      console.error("Get strategies error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve strategies",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
