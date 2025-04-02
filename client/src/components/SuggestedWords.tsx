import { useState } from 'react';
import { useSuggestedWords } from '@/hooks/useSuggestedWords';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { ArrowRight, BookOpen, RefreshCw } from 'lucide-react';

interface SuggestedWordsProps {
  userId: number;
}

const SuggestedWords = ({ userId }: SuggestedWordsProps) => {
  const [count] = useState(5);
  const { data: suggestedWords, isLoading, refetch } = useSuggestedWords(userId, count);

  // Yenile butonuna tıklandığında yeni öneriler getir
  const handleRefresh = () => {
    refetch();
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
          <div className="space-y-4">
            {suggestedWords.map((word) => (
              <div key={word.id} className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium flex items-center gap-2">
                    {word.ottoman} 
                    <span className="text-muted-foreground text-sm">({word.turkish})</span>
                    {word.progress?.isMastered && (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Öğrenildi
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">{word.meaning || "Anlam bilgisi yok"}</p>
                </div>
                <Link href={`/practice?wordId=${word.id}`}>
                  <Button size="sm" variant="ghost" className="gap-1">
                    <span>Çalış</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
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