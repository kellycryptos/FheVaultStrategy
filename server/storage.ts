import { type Strategy, type InsertStrategy } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for FHEVault
export interface IStorage {
  // Strategy operations
  createStrategy(strategy: InsertStrategy): Promise<Strategy>;
  getStrategy(id: string): Promise<Strategy | undefined>;
  getAllStrategies(): Promise<Strategy[]>;
  updateStrategyScore(id: string, encryptedScore: string, decryptedScore?: number): Promise<Strategy | undefined>;
  updateStrategyStatus(id: string, status: string): Promise<Strategy | undefined>;
}

export class MemStorage implements IStorage {
  private strategies: Map<string, Strategy>;

  constructor() {
    this.strategies = new Map();
  }

  async createStrategy(insertStrategy: InsertStrategy): Promise<Strategy> {
    const id = randomUUID();
    const strategy: Strategy = {
      ...insertStrategy,
      id,
      status: "pending",
      encryptedScore: null,
      decryptedScore: null,
      createdAt: new Date(),
      computedAt: null,
    };
    this.strategies.set(id, strategy);
    return strategy;
  }

  async getStrategy(id: string): Promise<Strategy | undefined> {
    return this.strategies.get(id);
  }

  async getAllStrategies(): Promise<Strategy[]> {
    return Array.from(this.strategies.values());
  }

  async updateStrategyScore(
    id: string,
    encryptedScore: string,
    decryptedScore?: number
  ): Promise<Strategy | undefined> {
    const strategy = this.strategies.get(id);
    if (!strategy) return undefined;

    const updated: Strategy = {
      ...strategy,
      encryptedScore,
      decryptedScore: decryptedScore ?? null,
      status: "completed",
      computedAt: new Date(),
    };

    this.strategies.set(id, updated);
    return updated;
  }

  async updateStrategyStatus(
    id: string,
    status: string
  ): Promise<Strategy | undefined> {
    const strategy = this.strategies.get(id);
    if (!strategy) return undefined;

    const updated: Strategy = {
      ...strategy,
      status,
    };

    this.strategies.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
