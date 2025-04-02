// Import Shared Schema Directly
import type { Word, WordWithProgress, User, Category, Progress } from 'shared/schema';

// Make these available globally
declare global {
  type AppWord = Word;
  type AppWordWithProgress = WordWithProgress;
  type AppUser = User;
  type AppCategory = Category;
  type AppProgress = Progress;
}

export {};