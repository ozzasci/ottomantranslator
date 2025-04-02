import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CategorySelectorProps {
  onCategorySelect: (categoryId: number | null) => void;
  selectedCategoryId: number | null;
}

const CategorySelector = ({ onCategorySelect, selectedCategoryId }: CategorySelectorProps) => {
  const { data: categories, isLoading } = useCategories();
  
  if (isLoading) {
    return (
      <section className="mb-8">
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex flex-wrap gap-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-4">
          <h2 className="font-serif text-xl font-bold text-[#2d3748] mb-4">Kategoriler</h2>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategoryId === null ? "default" : "outline"}
              className={selectedCategoryId === null ? "bg-[#c53030] hover:bg-red-700" : ""}
              onClick={() => onCategorySelect(null)}
            >
              Tümü
            </Button>
            
            {categories?.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                className={
                  selectedCategoryId === category.id 
                    ? "bg-[#c53030] hover:bg-red-700" 
                    : "bg-white text-[#2d3748] border border-gray-300 hover:bg-gray-100"
                }
                onClick={() => onCategorySelect(category.id)}
              >
                {category.name}
              </Button>
            ))}
            
            <Button 
              variant="outline"
              className="bg-white text-[#2d3748] border border-gray-300 hover:bg-gray-100 flex items-center"
            >
              <PlusCircle className="mr-1" size={14} /> Ekle
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CategorySelector;
