import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We don't strictly need a DB for this static app, but defining schemas is good practice.
// These types will be used for our in-memory data processing.

export interface Flashcard {
  ru: string;
  la: string;
  lesson: number;
  globalIndex: number;
}

export interface Deck {
  id: number;
  title: string;
  cards: Flashcard[];
}

export interface QuizQuestion {
  question: string; // ru
  correctAnswer: string; // la
  wrongAnswers: string[]; // la
}

// Minimal DB schema to satisfy the template structure, even if unused
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
});

export const insertUserSchema = createInsertSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
