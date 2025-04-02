import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Volume2, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, HelpCircle, RotateCcw } from 'lucide-react';
import { type WordWithProgress, type Category } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface WritingPracticeProps {
  words: WordWithProgress[];
  userId: number;
  categories: Category[];
}

const WritingPractice: React.FC<WritingPracticeProps> = ({ words, userId, categories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [mode, setMode] = useState<'ottoman-to-turkish' | 'turkish-to-ottoman'>('ottoman-to-turkish');
  const [filteredWords, setFilteredWords] = useState<WordWithProgress[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [session, setSession] = useState<{
    correct: number;
    incorrect: number;
    completed: number;
    total: number;
  }>({ correct: 0, incorrect: 0, completed: 0, total: 0 });
  
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
    setUserInput('');
    setSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
    setSession({
      correct: 0,
      incorrect: 0,
      completed: 0,
      total: filtered.length
    });
  }, [words, selectedCategoryId, mode]);

  const currentWord = filteredWords[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentWord || submitted) return;
    
    const correctAnswer = mode === 'ottoman-to-turkish' ? currentWord.turkish : currentWord.ottoman;
    const normalizedInput = userInput.trim().toLowerCase();
    const normalizedAnswer = correctAnswer.toLowerCase();
    
    // Check if the answer is correct (simple exact match check)
    // In a real app, you might want to implement more sophisticated comparison
    const correct = normalizedInput === normalizedAnswer;
    
    setIsCorrect(correct);
    setSubmitted(true);
    
    // Record progress
    recordProgress(correct);
    
    // Update session stats
    setSession(prev => ({
      ...prev,
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
      completed: prev.completed + 1
    }));
    
    // Show feedback
    toast({
      title: correct ? "Doğru!" : "Yanlış",
      description: correct 
        ? "Tebrikler, doğru yazdınız." 
        : `Doğru cevap: ${correctAnswer}`,
      variant: correct ? "default" : "destructive"
    });
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
      
    } catch (error) {
      toast({
        title: "Hata",
        description: "İlerleme kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const moveToNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setSubmitted(false);
      setIsCorrect(false);
      setShowHint(false);
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
      setUserInput('');
      setSubmitted(false);
      setIsCorrect(false);
      setShowHint(false);
    }
  };

  const resetSession = () => {
    // Shuffle the array for random presentation
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    setFilteredWords(shuffled);
    setCurrentIndex(0);
    setUserInput('');
    setSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
    setSession({
      correct: 0,
      incorrect: 0,
      completed: 0,
      total: shuffled.length
    });
  };

  const toggleHint = () => {
    setShowHint(!showHint);
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
        <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-0">
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
          
          <Select
            value={mode}
            onValueChange={(value) => setMode(value as typeof mode)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Mod" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ottoman-to-turkish">Osmanlıca → Türkçe</SelectItem>
              <SelectItem value="turkish-to-ottoman">Türkçe → Osmanlıca</SelectItem>
            </SelectContent>
          </Select>
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
          value={(session.completed / session.total) * 100} 
          className="mt-2 h-2"
        />
      </div>
      
      {currentWord && (
        <Card className="max-w-xl mx-auto">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  {categories.find(c => c.id === currentWord.categoryId)?.name || 'Bilinmeyen Kategori'}
                </p>
                <h3 className={mode === 'ottoman-to-turkish' ? 'font-ottoman text-3xl mb-2' : 'text-2xl font-medium mb-2'}>
                  {mode === 'ottoman-to-turkish' ? currentWord.ottoman : currentWord.turkish}
                </h3>
              </div>
              
              <button 
                className="p-2 text-gray-500 hover:text-[#2c5282]"
                onClick={handlePlayAudio}
              >
                <Volume2 size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  {mode === 'ottoman-to-turkish' ? 'Türkçe karşılığını yazın:' : 'Osmanlıca karşılığını yazın:'}
                </label>
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={submitted}
                  className={`text-xl ${mode === 'turkish-to-ottoman' ? 'font-ottoman' : ''} ${
                    submitted ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''
                  }`}
                  autoFocus
                />
              </div>
              
              {submitted && (
                <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="flex items-start">
                    {isCorrect ? (
                      <CheckCircle className="text-green-600 mr-2 flex-shrink-0 mt-1" size={16} />
                    ) : (
                      <AlertCircle className="text-red-600 mr-2 flex-shrink-0 mt-1" size={16} />
                    )}
                    <div>
                      <p className="font-medium">
                        {isCorrect ? 'Doğru cevap!' : 'Yanlış cevap'}
                      </p>
                      {!isCorrect && (
                        <p className="mt-1">
                          Doğru cevap: <span className={mode === 'turkish-to-ottoman' ? 'font-ottoman' : 'font-medium'}>
                            {mode === 'ottoman-to-turkish' ? currentWord.turkish : currentWord.ottoman}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {!submitted && (
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleHint}
                    className="text-gray-500"
                  >
                    <HelpCircle className="mr-1 h-4 w-4" /> İpucu Göster
                  </Button>
                </div>
              )}
              
              {showHint && !submitted && (
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">İpucu:</span> {currentWord.meaning}
                  </p>
                </div>
              )}
              
              {!submitted ? (
                <Button 
                  type="submit" 
                  className="w-full bg-[#2c5282] hover:bg-blue-700"
                  disabled={!userInput.trim()}
                >
                  Kontrol Et
                </Button>
              ) : (
                <Button 
                  type="button"
                  onClick={moveToNext}
                  className="w-full bg-[#2c5282] hover:bg-blue-700"
                >
                  Sonraki Kelime <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline"
          onClick={moveToPrevious}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Önceki
        </Button>
        
        <div className="flex space-x-6">
          <div className="text-green-500 flex items-center">
            <CheckCircle className="mr-1 h-4 w-4" />
            <span>{session.correct}</span>
          </div>
          <div className="text-red-500 flex items-center">
            <AlertCircle className="mr-1 h-4 w-4" />
            <span>{session.incorrect}</span>
          </div>
        </div>
        
        <Button 
          variant="outline"
          onClick={moveToNext}
          disabled={currentIndex === filteredWords.length - 1 && !submitted}
        >
          Sonraki <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WritingPractice;
