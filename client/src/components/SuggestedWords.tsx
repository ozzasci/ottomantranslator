import { useState, useEffect, useRef } from 'react';
import { useSuggestedWords } from '@/hooks/useSuggestedWords';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { ArrowRight, BookOpen, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface SuggestedWordsProps {
  userId: number;
}

const SuggestedWords = ({ userId }: SuggestedWordsProps) => {
  const [count] = useState(10); // Daha fazla kelime yükleyelim
  const { data: suggestedWords, isLoading, refetch } = useSuggestedWords(userId, count);
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsToShow] = useState(3); // Aynı anda gösterilecek kelime sayısı
  const carouselRef = useRef<HTMLDivElement>(null);

  // Otomatik kaydırma için zamanlayıcı
  useEffect(() => {
    const interval = setInterval(() => {
      if (suggestedWords && suggestedWords.length > itemsToShow) {
        handleNext();
      }
    }, 10000); // 10 saniyede bir otomatik kaydır
    
    return () => clearInterval(interval);
  }, [suggestedWords, activeIndex]);

  // Yenile butonuna tıklandığında yeni öneriler getir
  const handleRefresh = () => {
    refetch();
    setActiveIndex(0);
  };
  
  // Bir sonraki kelime grubuna geç
  const handleNext = () => {
    if (!suggestedWords) return;
    setActiveIndex((prev) => 
      prev + 1 >= suggestedWords.length - itemsToShow + 1 ? 0 : prev + 1
    );
  };
  
  // Bir önceki kelime grubuna geç
  const handlePrev = () => {
    if (!suggestedWords) return;
    setActiveIndex((prev) => 
      prev - 1 < 0 ? suggestedWords.length - itemsToShow : prev - 1
    );
  };

  return (
    <Card className="mb-8 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-xl text-primary">
          <span className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Sizin İçin Önerilen Kelimeler
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Yenile</span>
          </Button>
        </CardTitle>
        <CardDescription>
          Öğrenme seviyenize göre seçilmiş kelimeler
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
                <Skeleton className="h-8 w-[60px]" />
              </div>
            ))}
          </div>
        ) : suggestedWords && suggestedWords.length > 0 ? (
          <div className="relative">
            <div 
              ref={carouselRef}
              className="overflow-hidden"
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${activeIndex * 100 / itemsToShow}%)`,
                  width: `${Math.ceil(suggestedWords.length / itemsToShow) * 100}%` 
                }}
              >
                {suggestedWords.map((word) => (
                  <div 
                    key={word.id} 
                    className="p-2"
                    style={{ width: `${100 / suggestedWords.length}%` }}
                  >
                    <div className={`
                      p-4 h-full bg-white rounded-lg border-2 transition-all
                      ${word.difficulty === 'basic' ? "border-blue-200 hover:border-blue-300" :
                        word.difficulty === 'intermediate' ? "border-purple-200 hover:border-purple-300" :
                        "border-amber-200 hover:border-amber-300"}
                    `}>
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h4 className="text-base font-medium flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-ottoman text-xl">{word.ottoman}</span>
                            <span className="text-muted-foreground text-sm">({word.turkish})</span>
                            {word.progress?.isMastered && (
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                Öğrenildi
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">{word.meaning || "Anlam bilgisi yok"}</p>
                        </div>
                        <Link href={`/practice?wordId=${word.id}`} className="block mt-4">
                          <Button size="sm" className="w-full gap-1">
                            <span>Çalış</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {suggestedWords.length > itemsToShow && (
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-1">
                  {Array(Math.ceil(suggestedWords.length / itemsToShow))
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        className={`
                          w-2 h-2 rounded-full transition-colors
                          ${Math.floor(activeIndex / itemsToShow) === idx ? 'bg-primary' : 'bg-gray-300'}
                        `}
                      />
                    ))}
                </div>
                <Button
                  onClick={handleNext}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-3">
            Şu anda önerilen kelime bulunmuyor.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestedWords;