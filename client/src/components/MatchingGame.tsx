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
import { Progress } from '@/components/ui/progress';
import { ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type WordWithProgress, type Category } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MatchingGameProps {
  words: WordWithProgress[];
  userId: number;
  categories: Category[];
}

type MatchingCard = {
  id: string;
  wordId: number;
  text: string;
  isOttoman: boolean;
  isSelected: boolean;
  isMatched: boolean;
};

const MatchingGame: React.FC<MatchingGameProps> = ({ words, userId, categories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [cards, setCards] = useState<MatchingCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<MatchingCard | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  
  const { toast } = useToast();

  const filteredWords = words.filter(word => {
    if (selectedCategoryId !== 'all') {
      return word.categoryId === parseInt(selectedCategoryId);
    }
    return true;
  });

  // Number of pairs based on difficulty
  const getPairCount = () => {
    switch (difficulty) {
      case 'easy': return 5;
      case 'medium': return 8;
      case 'hard': return 12;
      default: return 5;
    }
  };

  const initializeGame = () => {
    if (filteredWords.length < getPairCount()) {
      toast({
        title: "Yetersiz Kelime",
        description: `Seçili kategoride yeterli kelime bulunmamaktadır. En az ${getPairCount()} kelime gerekli.`,
        variant: "destructive"
      });
      return;
    }

    // Stop existing timer
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }

    // Reset game state
    setSelectedCard(null);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(true);
    setGameCompleted(false);
    setTimer(0);

    // Start timer
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval as unknown as number);

    // Create cards
    const gameWords = [...filteredWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, getPairCount());

    const gameCards: MatchingCard[] = [];

    gameWords.forEach(word => {
      gameCards.push({
        id: `ottoman-${word.id}`,
        wordId: word.id,
        text: word.ottoman,
        isOttoman: true,
        isSelected: false,
        isMatched: false
      });

      gameCards.push({
        id: `turkish-${word.id}`,
        wordId: word.id,
        text: word.turkish,
        isOttoman: false,
        isSelected: false,
        isMatched: false
      });
    });

    // Shuffle cards
    setCards(gameCards.sort(() => Math.random() - 0.5));
  };

  const handleCardClick = (card: MatchingCard) => {
    if (!gameStarted || card.isMatched || card.isSelected || (selectedCard?.id === card.id)) {
      return;
    }

    // Update the selected state of the clicked card
    setCards(prevCards => 
      prevCards.map(c => 
        c.id === card.id ? { ...c, isSelected: true } : c
      )
    );

    if (!selectedCard) {
      // First card selection
      setSelectedCard(card);
    } else {
      // Second card selection - check for match
      setMoves(prev => prev + 1);
      
      if (selectedCard.wordId === card.wordId && selectedCard.isOttoman !== card.isOttoman) {
        // Match found
        setCards(prevCards => 
          prevCards.map(c => 
            c.wordId === card.wordId ? { ...c, isMatched: true } : c
          )
        );
        setMatchedPairs(prev => prev + 1);
        
        // Record successful match
        recordProgress(card.wordId, true);
        
        if (matchedPairs + 1 === getPairCount()) {
          // Game completed
          handleGameCompletion();
        }
      } else {
        // No match - record unsuccessful attempt for both words
        recordProgress(selectedCard.wordId, false);
        if (selectedCard.wordId !== card.wordId) {
          recordProgress(card.wordId, false);
        }
        
        // Hide cards after a delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(c => 
              (c.id === card.id || c.id === selectedCard.id) && !c.isMatched 
                ? { ...c, isSelected: false } 
                : c
            )
          );
        }, 1000);
      }
      
      // Reset selection for next turn
      setSelectedCard(null);
    }
  };

  const recordProgress = async (wordId: number, correct: boolean) => {
    try {
      await apiRequest('POST', '/api/progress', {
        userId,
        wordId,
        correctCount: correct ? 1 : 0,
        incorrectCount: correct ? 0 : 1,
        lastPracticed: new Date().toISOString(),
        isMastered: false
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/words-with-progress/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/stats/${userId}`] });
    } catch (error) {
      console.error('Error recording progress:', error);
    }
  };

  const handleGameCompletion = () => {
    setGameCompleted(true);
    
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    toast({
      title: "Tebrikler!",
      description: `Oyunu ${formatTime(timer)} sürede ve ${moves} hamlede tamamladınız!`,
    });
  };

  // Format the timer as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return (
    <div className="space-y-6">
      {!gameStarted || gameCompleted ? (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4">
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
              value={difficulty}
              onValueChange={(value) => setDifficulty(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Zorluk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Kolay (5 Çift)</SelectItem>
                <SelectItem value="medium">Orta (8 Çift)</SelectItem>
                <SelectItem value="hard">Zor (12 Çift)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={initializeGame}
            className="bg-[#2c5282] hover:bg-blue-700"
          >
            {gameCompleted ? 'Yeni Oyun' : 'Oyunu Başlat'}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <div className="text-center">
              <p className="text-sm text-gray-600">Süre</p>
              <p className="text-xl font-bold">{formatTime(timer)}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Hamleler</p>
              <p className="text-xl font-bold">{moves}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Eşleşmeler</p>
              <p className="text-xl font-bold">{matchedPairs}/{getPairCount()}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => {
              if (timerInterval !== null) {
                clearInterval(timerInterval);
              }
              setGameStarted(false);
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Yeni Oyun
          </Button>
        </div>
      )}
      
      {gameStarted && !gameCompleted && (
        <Progress 
          value={(matchedPairs / getPairCount()) * 100} 
          className="mb-6 h-2"
        />
      )}
      
      {gameStarted ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={cn(
                "flex items-center justify-center p-4 rounded-lg h-24 cursor-pointer transition-all duration-300",
                card.isMatched 
                  ? "bg-green-100 border-2 border-green-300" 
                  : card.isSelected 
                    ? "bg-blue-100 border-2 border-blue-300" 
                    : "bg-white border-2 border-gray-200 hover:border-gray-300",
              )}
              onClick={() => handleCardClick(card)}
            >
              {card.isSelected || card.isMatched ? (
                <span className={cn(
                  "text-center", 
                  card.isOttoman ? "font-ottoman text-lg" : "text-base"
                )}>
                  {card.text}
                </span>
              ) : (
                <span className="text-xl font-bold text-gray-300">?</span>
              )}
            </div>
          ))}
        </div>
      ) : gameCompleted ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 text-[#ecc94b] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tebrikler!</h2>
            <p className="text-gray-600 mb-6">
              Tüm eşleşmeleri başarıyla tamamladınız.
            </p>
            <div className="flex justify-center gap-8 mb-6">
              <div>
                <p className="text-sm text-gray-600">Toplam Süre</p>
                <p className="text-xl font-bold">{formatTime(timer)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Hamle</p>
                <p className="text-xl font-bold">{moves}</p>
              </div>
            </div>
            <Button 
              onClick={initializeGame}
              className="bg-[#2c5282] hover:bg-blue-700"
            >
              Yeni Oyun Başlat <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl font-medium mb-4">Eşleştirme Oyunu</p>
          <p className="text-gray-600 mb-6">
            Osmanlıca kelimeleri modern Türkçe karşılıklarıyla eşleştirin.
          </p>
          <Button 
            onClick={initializeGame}
            className="bg-[#2c5282] hover:bg-blue-700"
          >
            Oyunu Başlat <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MatchingGame;
