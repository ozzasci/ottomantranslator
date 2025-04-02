import { useQuery } from '@tanstack/react-query';
import { type WordWithProgress } from '@shared/schema';

export const useSuggestedWords = (userId: number, count: number = 5) => {
  return useQuery<WordWithProgress[]>({
    queryKey: ['/api/suggested-words', userId, count],
    queryFn: async () => {
      const response = await fetch(`/api/suggested-words/${userId}?count=${count}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggested words');
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });
};