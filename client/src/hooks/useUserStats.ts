import { useQuery } from '@tanstack/react-query';
import { type UserStats } from '@shared/schema';

export const useUserStats = (userId: number) => {
  return useQuery<UserStats>({ 
    queryKey: [`/api/stats/${userId}`],
    enabled: !!userId
  });
};
