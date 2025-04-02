import { useQuery } from '@tanstack/react-query';
import { type Word, type WordWithProgress } from '@shared/schema';

export const useWords = (categoryId?: number | null, searchQuery?: string) => {
  let queryKey = ['/api/words'];
  
  if (categoryId) {
    queryKey.push(`category=${categoryId}`);
  }
  
  if (searchQuery) {
    queryKey.push(`query=${searchQuery}`);
  }
  
  return useQuery<Word[]>({ 
    queryKey,
    enabled: true
  });
};

export const useWordsWithProgress = (userId: number) => {
  return useQuery<WordWithProgress[]>({ 
    queryKey: [`/api/words-with-progress/${userId}`]
  });
};

export const useWordById = (id: number) => {
  return useQuery<Word>({ 
    queryKey: [`/api/words/${id}`],
    enabled: !!id 
  });
};
