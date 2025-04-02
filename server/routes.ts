import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCategorySchema, 
  insertWordSchema, 
  insertProgressSchema,
  insertRelatedWordSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const api = express.Router();
  
  // User routes
  api.post("/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  api.get("/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });
  
  api.patch("/users/:id/streak", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const { streak } = req.body;
      
      if (typeof streak !== 'number') {
        return res.status(400).json({ message: "Invalid streak value" });
      }
      
      const user = await storage.updateUserStreak(userId, streak);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user streak" });
    }
  });
  
  api.patch("/users/:id/activity", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await storage.updateLastActivity(userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user activity" });
    }
  });
  
  // Category routes
  api.get("/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get categories" });
    }
  });
  
  api.post("/categories", async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  
  // Word routes
  api.get("/words", async (req: Request, res: Response) => {
    try {
      const { category, query } = req.query;
      
      let words;
      if (category) {
        const categoryId = parseInt(category as string, 10);
        words = await storage.getWordsByCategory(categoryId);
      } else if (query) {
        words = await storage.searchWords(query as string);
      } else {
        words = await storage.getAllWords();
      }
      
      res.json(words);
    } catch (error) {
      res.status(500).json({ message: "Failed to get words" });
    }
  });
  
  api.get("/words/:id", async (req: Request, res: Response) => {
    try {
      const wordId = parseInt(req.params.id, 10);
      const word = await storage.getWordById(wordId);
      
      if (!word) {
        return res.status(404).json({ message: "Word not found" });
      }
      
      res.json(word);
    } catch (error) {
      res.status(500).json({ message: "Failed to get word" });
    }
  });
  
  api.post("/words", async (req: Request, res: Response) => {
    try {
      const wordData = insertWordSchema.parse(req.body);
      const word = await storage.createWord(wordData);
      res.status(201).json(word);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create word" });
    }
  });
  
  api.get("/words/:id/related", async (req: Request, res: Response) => {
    try {
      const wordId = parseInt(req.params.id, 10);
      const relatedWords = await storage.getRelatedWords(wordId);
      res.json(relatedWords);
    } catch (error) {
      res.status(500).json({ message: "Failed to get related words" });
    }
  });
  
  api.post("/words/related", async (req: Request, res: Response) => {
    try {
      const relationData = insertRelatedWordSchema.parse(req.body);
      await storage.addRelatedWord(relationData.wordId, relationData.relatedWordId);
      res.status(201).json({ message: "Related word added" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to add related word" });
    }
  });
  
  api.get("/daily-word", async (_req: Request, res: Response) => {
    try {
      const dailyWord = await storage.getDailyWord();
      
      if (!dailyWord) {
        return res.status(404).json({ message: "Daily word not found" });
      }
      
      res.json(dailyWord);
    } catch (error) {
      res.status(500).json({ message: "Failed to get daily word" });
    }
  });
  
  // Progress routes
  api.get("/progress/:userId/:wordId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const wordId = parseInt(req.params.wordId, 10);
      
      const progress = await storage.getUserProgress(userId, wordId);
      
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress" });
    }
  });
  
  api.post("/progress", async (req: Request, res: Response) => {
    try {
      const progressData = insertProgressSchema.parse(req.body);
      
      // Check if progress already exists
      const existingProgress = await storage.getUserProgress(
        progressData.userId, 
        progressData.wordId
      );
      
      if (existingProgress) {
        const updatedProgress = await storage.updateProgress(
          existingProgress.id,
          existingProgress.correctCount + (progressData.correctCount || 0),
          existingProgress.incorrectCount + (progressData.incorrectCount || 0)
        );
        return res.json(updatedProgress);
      }
      
      const progress = await storage.recordProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to record progress" });
    }
  });
  
  api.get("/stats/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user stats" });
    }
  });
  
  api.get("/words-with-progress/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const wordsWithProgress = await storage.getWordsWithProgress(userId);
      res.json(wordsWithProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get words with progress" });
    }
  });
  
  // Mount the API router
  app.use("/api", api);
  
  const httpServer = createServer(app);
  return httpServer;
}
