import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep the original users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  // Additional user fields for our app
  dailyStreak: integer("daily_streak").default(0).notNull(),
  lastActivity: timestamp("last_activity"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Define categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  level: text("level").notNull(), // "basic", "intermediate", "advanced", "idioms", etc.
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  level: true,
});

// Define words table
export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  ottoman: text("ottoman").notNull(), // Ottoman Turkish script
  turkish: text("turkish").notNull(), // Modern Turkish
  meaning: text("meaning"), // Extended meaning/definition
  exampleOttoman: text("example_ottoman"), // Example in Ottoman Turkish
  exampleTurkish: text("example_turkish"), // Example in Modern Turkish
  categoryId: integer("category_id").notNull(), // Reference to category
  difficulty: text("difficulty").notNull(), // "basic", "intermediate", "advanced"
  etymology: text("etymology"), // Word origin information
  audioUrl: text("audio_url"), // URL to audio pronunciation
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWordSchema = createInsertSchema(words).pick({
  ottoman: true,
  turkish: true,
  meaning: true, 
  exampleOttoman: true,
  exampleTurkish: true,
  categoryId: true,
  difficulty: true,
  etymology: true,
  audioUrl: true,
});

// Define user word progress table
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  wordId: integer("word_id").notNull(),
  correctCount: integer("correct_count").default(0).notNull(),
  incorrectCount: integer("incorrect_count").default(0).notNull(),
  lastPracticed: timestamp("last_practiced"),
  isMastered: boolean("is_mastered").default(false).notNull(),
});

export const insertProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  wordId: true,
  correctCount: true,
  incorrectCount: true,
  lastPracticed: true,
  isMastered: true,
});

// Define related words
export const relatedWords = pgTable("related_words", {
  id: serial("id").primaryKey(),
  wordId: integer("word_id").notNull(),
  relatedWordId: integer("related_word_id").notNull(),
});

export const insertRelatedWordSchema = createInsertSchema(relatedWords).pick({
  wordId: true,
  relatedWordId: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Word = typeof words.$inferSelect;
export type InsertWord = z.infer<typeof insertWordSchema>;

export type Progress = typeof userProgress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

export type RelatedWord = typeof relatedWords.$inferSelect;
export type InsertRelatedWord = z.infer<typeof insertRelatedWordSchema>;

// Define app-specific types
export const levelOptions = ["basic", "intermediate", "advanced", "idioms", "daily"] as const;
export type Level = typeof levelOptions[number];

// Common response types
export type WordWithProgress = Word & {
  progress?: Progress;
};

export type WordWithRelated = Word & {
  related: Word[];
};

export type UserStats = {
  learnedWords: number;
  totalWords: number;
  accuracy: number;
  streak: number;
  weekActivity: boolean[];
};
