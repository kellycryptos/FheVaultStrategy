import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Strategy table - stores encrypted trading strategies
export const strategies = pgTable("strategies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Original parameters (for demo purposes - in production these would never be stored)
  riskLevel: integer("risk_level").notNull(), // 1-10
  allocation: integer("allocation").notNull(), // percentage 0-100
  timeframe: integer("timeframe").notNull(), // days
  // Encrypted data
  encryptedData: text("encrypted_data").notNull(),
  encryptedHash: text("encrypted_hash").notNull(),
  // Computation results
  encryptedScore: text("encrypted_score"),
  decryptedScore: integer("decrypted_score"),
  // Metadata
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, computing, completed, failed
  createdAt: timestamp("created_at").notNull().defaultNow(),
  computedAt: timestamp("computed_at"),
});

export const insertStrategySchema = createInsertSchema(strategies).omit({
  id: true,
  createdAt: true,
  computedAt: true,
  encryptedScore: true,
  decryptedScore: true,
  status: true,
});

export const submitStrategySchema = z.object({
  riskLevel: z.number().int().min(1).max(10),
  allocation: z.number().int().min(0).max(100),
  timeframe: z.number().int().min(1).max(365),
});

export type InsertStrategy = z.infer<typeof insertStrategySchema>;
export type Strategy = typeof strategies.$inferSelect;
export type SubmitStrategy = z.infer<typeof submitStrategySchema>;

// FHE Key types (client-side only, not stored in DB)
export type FHEPublicKey = string;
export type FHEPrivateKey = string;

export interface FHEKeyPair {
  publicKey: FHEPublicKey;
  privateKey: FHEPrivateKey;
}

// Encrypted data structure
export interface EncryptedStrategyData {
  riskLevel: string; // encrypted
  allocation: string; // encrypted
  timeframe: string; // encrypted
  timestamp: number;
}

// API Response types
export interface EncryptionResult {
  encryptedData: string;
  hash: string;
}

export interface ComputationResponse {
  strategyId: string;
  encryptedScore: string;
  status: "completed" | "failed";
}

export interface DecryptionResult {
  score: number;
  percentile: number;
  recommendation: string;
}
