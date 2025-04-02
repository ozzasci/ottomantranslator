import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Volume2, ArrowLeft, ArrowRight, Check, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type WordWithProgress, type Category } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface FlashcardPracticeProps {
  words: WordWithProgress[];
  userId: number;
  categories: Category[];
}

const FlashcardPractice: React.FC<FlashcardPracticeProps> = ({ words, userId, categories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showOttomanFirst, setShowOttomanFirst] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [filteredWords, setFilteredWords] = useState<WordWithProgress[]>([]);
  const [answered, setAnswered] = useState(false);
  const [session, setSession] = useState<{
    correct: number;
    incorrect: number;
    reviewed: number;
    total: number;
  }>({ correct: 0, incorrect: 0, reviewed: 0, total: 0 });
  
  const { toast } = useToast();

  // Filter words based on selected category
  useEffect(() => {
    let filtered = [...words];
    
    if (selectedCategoryId !== 'all') {
      filtered = words.filter(word => word.categoryId === parseInt(selectedCategoryId));
    }
    
    // Shuffle the array for random presentation
    filtered.sort(() => Math.random() - 0.5);
    
    setFilteredWords(filtered);
    setCurrentIndex(0);
    setFlipped(false);
    setAnswered(false);
    setSession({
      correct: 0,
      incorrect: 0,
      reviewed: 0,
      total: filtered.length
    });
  }, [words, selectedCategoryId]);

  const currentWord = filteredWords[currentIndex];

  const handleFlip = () => {
    if (!answered) {
      setFlipped(!flipped);
    }
  };

  const recordProgress = async (correct: boolean) => {
    if (!currentWord) return;
    
    try {
      // Record the answer result
      await apiRequest('POST', '/api/progress', {
        userId,
        wordId: currentWord.id,
        correctCount: correct ? 1 : 0,
        incorrectCount: correct ? 0 : 1,
        lastPracticed: new Date().toISOString(),
        isMastered: currentWord.progress?.isMastered || false
      });
      
      // Invalidate the words with progress to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/words-with-progress/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/stats/${userId}`] });
      
      // Update the session stats
      setSession(prev => ({
        ...prev,
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
        reviewed: prev.reviewed + 1
      }));
      
      // Show feedback
      toast({
        title: correct ? "Doğru!" : "Yanlış",
        description: correct 
          ? "Tebrikler, doğru bildiniz." 
          : `Doğru cevap: ${showOttomanFirst ? currentWord.turkish : currentWord.ottoman}`,
        variant: correct ? "default" : "destructive"
      });
      
    } catch (error) {
      toast({
        title: "Hata",
        description: "İlerleme kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleAnswer = (correct: boolean) => {
    recordProgress(correct);
    setAnswered(true);
  };

  const moveToNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
      setAnswered(false);
    } else {
      // End of practice
      toast({
        title: "Pratik Tamamlandı",
        description: `${session.correct} doğru, ${session.incorrect} yanlış cevapladınız.`,
      });
      
      // Reset to start a new session
      resetSession();
    }
  };

  const moveToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
      setAnswered(false);
    }
  };

  const resetSession = () => {
    // Shuffle the array for random presentation
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    setFilteredWords(shuffled);
    setCurrentIndex(0);
    setFlipped(false);
    setAnswered(false);
    setSession({
      correct: 0,
      incorrect: 0,
      reviewed: 0,
      total: shuffled.length
    });
  };

  const handlePlayAudio = () => {
    // Implementation would go here in a real app
    console.log('Play audio for', currentWord?.turkish);
  };

  if (filteredWords.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Bu kategoride kelime bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Select
            value={selectedCategoryId}
            onValueChange={(value) => setSelectedCategoryId(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="ottoman-first"
              checked={showOttomanFirst}
              onCheckedChange={setShowOttomanFirst}
            />
            <Label htmlFor="ottoman-first">Osmanlıca İlk</Label>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetSession}>
            <RotateCcw className="mr-2 h-4 w-4" /> Sıfırla
          </Button>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          {currentIndex + 1} / {filteredWords.length} Kelime
        </p>
        <Progress 
          value={(session.reviewed / session.total) * 100} 
          className="mt-2 h-2"
        />
      </div>
      
      {currentWord && (
        <div className="flex justify-center items-center h-full">
          <div 
            className="card-flip h-96 w-full max-w-2xl mx-auto cursor-pointer shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={handleFlip}
          >
            <div className={cn(
              "card-inner h-full relative",
              flipped ? "rotate-y-180" : ""
            )}>
              {/* Front of card */}
              <Card className={cn(
                "absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg flex flex-col justify-center items-center p-8",
                flipped ? "invisible" : "visible",
                "border-2 border-gray-200"
              )}>
                <p className="text-sm text-gray-500 mb-4 self-start">
                  {categories.find(c => c.id === currentWord.categoryId)?.name || 'Bilinmeyen Kategori'}
                </p>
                <h3 className={`${showOttomanFirst ? 'font-ottoman' : ''} text-6xl mb-6 text-[#2d3748] text-center`}>
                  {showOttomanFirst ? currentWord.ottoman : currentWord.turkish}
                </h3>
                <p className="text-sm text-gray-600 mt-6">Kartı çevirmek için tıklayın</p>
                
                <div className="absolute top-6 right-6">
                  <button 
                    className="p-2 text-gray-500 hover:text-[#2c5282] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayAudio();
                    }}
                  >
                    <Volume2 size={24} />
                  </button>
                </div>
              </Card>
              
              {/* Back of card */}
              <Card className={cn(
                "absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-8 rotate-y-180",
                flipped ? "visible" : "invisible",
                "border-2 border-gray-200"
              )}>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className={`${!showOttomanFirst ? 'font-ottoman' : ''} text-4xl mb-6 text-[#2d3748] text-center`}>
                      {showOttomanFirst ? currentWord.turkish : currentWord.ottoman}
                    </h3>
                    
                    <p className="mb-4 text-lg text-center">{currentWord.meaning}</p>
                    
                    {(currentWord.exampleOttoman && currentWord.exampleTurkish) && (
                      <div className="mb-4 p-6 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-md mb-2 text-center">Örnek:</p>
                        <p className="font-ottoman text-xl mb-2 text-[#2d3748] text-center">{currentWord.exampleOttoman}</p>
                        <p className="text-md italic text-center">{currentWord.exampleTurkish}</p>
                      </div>
                    )}
                  </div>
                  
                  {!answered ? (
                    <div className="flex justify-center space-x-6 mt-6">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnswer(false);
                        }}
                        variant="outline"
                        size="lg"
                        className="border-2 border-red-500 text-red-500 hover:bg-red-50 transition-colors font-bold"
                      >
                        <X className="mr-2 h-5 w-5" /> Bilmedim
                      </Button>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnswer(true);
                        }}
                        variant="outline"
                        size="lg"
                        className="border-2 border-green-500 text-green-500 hover:bg-green-50 transition-colors font-bold"
                      >
                        <Check className="mr-2 h-5 w-5" /> Bildim
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        moveToNext();
                      }}
                      size="lg"
                      className="mt-6 w-full bg-[#2c5282] hover:bg-blue-700 transition-colors font-bold py-6"
                    >
                      Sonraki Kelime <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline"
          onClick={moveToPrevious}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Önceki
        </Button>
        
        <div className="flex space-x-2">
          <div className="text-green-500 flex items-center">
            <Check className="mr-1 h-4 w-4" />
            <span>{session.correct}</span>
          </div>
          <div className="text-red-500 flex items-center">
            <X className="mr-1 h-4 w-4" />
            <span>{session.incorrect}</span>
          </div>
        </div>
        
        <Button 
          variant="outline"
          onClick={moveToNext}
          disabled={currentIndex === filteredWords.length - 1 && !answered}
        >
          Sonraki <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardPractice;
