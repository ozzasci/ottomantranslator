import { useQuery } from '@tanstack/react-query';
import { Bookmark, Volume2, Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { type WordWithRelated } from '@shared/schema';

const DailyWord = () => {
  const { data: word, isLoading, error } = useQuery<WordWithRelated>({ 
    queryKey: ['/api/daily-word'] 
  });
  
  if (isLoading) {
    return (
      <div className="mb-10">
        <h2 className="font-serif text-xl font-bold text-[#2d3748] mb-4">Günün Kelimesi</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-6 md:mb-0 md:w-1/2">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-10 w-32 mb-2" />
                <Skeleton className="h-6 w-24 mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex flex-col space-y-4 md:w-2/5">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !word) {
    return (
      <div className="mb-10">
        <h2 className="font-serif text-xl font-bold text-[#2d3748] mb-4">Günün Kelimesi</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Günün kelimesi yüklenirken bir hata oluştu.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Helper to determine difficulty level text
  const getDifficultyText = () => {
    switch(word.difficulty) {
      case 'basic': return 'Temel';
      case 'intermediate': return 'Orta';
      case 'advanced': return 'İleri';
      default: return word.difficulty;
    }
  };
  
  return (
    <section className="mb-10">
      <h2 className="font-serif text-xl font-bold text-[#2d3748] mb-4">Günün Kelimesi</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <p className="text-sm text-gray-500 mb-1">Seviye: {getDifficultyText()}</p>
              <h3 className="font-ottoman text-4xl mb-2 text-[#2d3748]">{word.ottoman}</h3>
              <h4 className="text-xl font-medium mb-3">{word.turkish}</h4>
              
              <p className="mb-3"><span className="font-semibold">Anlam:</span> {word.meaning}</p>
              
              {(word.exampleOttoman && word.exampleTurkish) && (
                <div className="mb-4">
                  <p className="font-semibold mb-1">Örnek cümle:</p>
                  <p className="font-ottoman text-lg mb-1 text-[#2d3748]">{word.exampleOttoman}</p>
                  <p className="italic">{word.exampleTurkish}</p>
                </div>
              )}
              
              <button className="mt-2 flex items-center text-[#2c5282]">
                <Volume2 className="mr-2" size={16} /> Telaffuzu dinle
              </button>
            </div>
            
            <div className="flex flex-col space-y-4 md:w-2/5">
              {word.related && word.related.length > 0 && (
                <div className="bg-gray-100 p-4 rounded-md">
                  <h4 className="font-medium mb-2">İlişkili Kelimeler</h4>
                  <div className="flex flex-wrap gap-2">
                    {word.related.map((relatedWord) => (
                      <Badge key={relatedWord.id} variant="secondary" className="bg-gray-200 px-2 py-1 text-sm">
                        {relatedWord.turkish}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              

              
              <div className="mt-auto flex justify-end space-x-2">
                <Button variant="outline" className="bg-[#ecc94b] text-white hover:bg-yellow-500">
                  <Bookmark className="mr-1" size={14} /> Kaydet
                </Button>
                <Button className="bg-[#2c5282] text-white hover:bg-blue-700">
                  <Pen className="mr-1" size={14} /> Pratik Et
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DailyWord;
