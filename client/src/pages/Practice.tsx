import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlashcardPractice from '@/components/FlashcardPractice';
import MatchingGame from '@/components/MatchingGame';
import WritingPractice from '@/components/WritingPractice';
import { useToast } from '@/hooks/use-toast';
import { useWordsWithProgress } from '@/hooks/useWords';
import { useCategories } from '@/hooks/useCategories';

const Practice = () => {
  const [activeTab, setActiveTab] = useState('flashcards');
  const [location] = useLocation();
  const { toast } = useToast();

  // Using a hardcoded userId for demo (in a real app, this would come from auth)
  const userId = 1;
  
  const { data: wordsWithProgress, isLoading } = useWordsWithProgress(userId);
  const { data: categories } = useCategories();

  // Set active tab based on URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const mode = params.get('mode');
    
    if (mode) {
      switch(mode) {
        case 'flashcards':
          setActiveTab('flashcards');
          break;
        case 'matching':
          setActiveTab('matching');
          break;
        case 'writing':
          setActiveTab('writing');
          break;
        default:
          setActiveTab('flashcards');
      }
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-serif text-2xl font-bold text-[#2d3748] mb-6">Pratik Yap</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-center py-8">Kelimeler yükleniyor...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!wordsWithProgress || wordsWithProgress.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-serif text-2xl font-bold text-[#2d3748] mb-6">Pratik Yap</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-center py-8">
              Henüz hiç kelime bulunmamaktadır. Lütfen önce kelime ekleyin.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-serif text-2xl font-bold text-[#2d3748] mb-6">Pratik Yap</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Öğrenme Modunu Seçin</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="flashcards" className="py-3 font-medium">
                Kelime Kartları
              </TabsTrigger>
              <TabsTrigger value="matching" className="py-3 font-medium">
                Eşleştirme Oyunu
              </TabsTrigger>
              <TabsTrigger value="writing" className="py-3 font-medium">
                Yazma Alıştırması
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="flashcards" className="mt-4">
              <FlashcardPractice 
                words={wordsWithProgress} 
                userId={userId} 
                categories={categories || []}
              />
            </TabsContent>
            
            <TabsContent value="matching" className="mt-4">
              <MatchingGame 
                words={wordsWithProgress} 
                userId={userId} 
                categories={categories || []}
              />
            </TabsContent>
            
            <TabsContent value="writing" className="mt-4">
              <WritingPractice 
                words={wordsWithProgress} 
                userId={userId} 
                categories={categories || []}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Practice;
