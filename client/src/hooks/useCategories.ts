import { useQuery } from '@tanstack/react-query';
import { type Category } from '@shared/schema';

export const useCategories = () => {
  return useQuery<Category[]>({ 
    queryKey: ['/api/categories']
  });
};
