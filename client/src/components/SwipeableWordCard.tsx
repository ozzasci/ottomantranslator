import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Volume2, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { WordWithProgress } from 'shared/schema';
import { motion, PanInfo } from 'framer-motion';

interface SwipeableWordCardProps {
  words: WordWithProgress[];
  onNextWord?: () => void;
  onPrevWord?: () => void;
}

const SwipeableWordCard = ({ words, onNextWord, onPrevWord }: SwipeableWordCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const dragStartX = useRef(0);
  
  // Geçerli kelimeyi al
  const currentWord = words[currentIndex];
  
  if (!currentWord) {
    return <div>Kelime bulunamadı</div>;
  }
  
  // İlerleme bilgilerini hesapla
  const totalAttempts = currentWord.progress ? currentWord.progress.correctCount + currentWord.progress.incorrectCount : 0;
  const accuracy = totalAttempts > 0 
    ? Math.round((currentWord.progress!.correctCount / totalAttempts) * 100) 
    : 0;
  
  // Zorluk seviyesini metin olarak döndür
  const getDifficultyText = () => {
    switch (currentWord.difficulty) {
      case 'basic': return 'Temel';
      case 'intermediate': return 'Orta';
      case 'advanced': return 'İleri';
      default: return currentWord.difficulty;
    }
  };
  
  // Doğruluk oranı için renk belirle
  const getAccuracyColor = () => {
    if (totalAttempts === 0) return 'bg-gray-300';
    if (accuracy >= 80) return 'bg-green-500';
    if (accuracy >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Ses çalma fonksiyonu
  const handlePlayAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentWord.audioUrl) {
      const audio = new Audio(currentWord.audioUrl);
      audio.play();
    }
  };
  
  // Yer imi fonksiyonu
  const handleBookmark = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Yer imi fonksiyonu uygulanabilir
  };
  
  // Kartı çevir
  const flipCard = () => {
    setFlipped(!flipped);
  };
  
  // Sonraki kelimeye geç
  const goToNextWord = () => {
    if (currentIndex < words.length - 1) {
      setDirection('left');
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
      if (onNextWord) onNextWord();
    }
  };
  
  // Önceki kelimeye geç
  const goToPrevWord = () => {
    if (currentIndex > 0) {
      setDirection('right');
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setDirection(null);
      }, 300);
      if (onPrevWord) onPrevWord();
    }
  };
  
  // Sürükleme başlangıç işleyicisi
  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    if ('clientX' in event) {
      dragStartX.current = event.clientX;
    } else if (event.touches && event.touches[0]) {
      dragStartX.current = event.touches[0].clientX;
    }
  };
  
  // Sürükleme bitiş işleyicisi
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dragThreshold = 100; // kaydırma eşiği (px)
    
    if (info.offset.x < -dragThreshold && currentIndex < words.length - 1) {
      goToNextWord();
    } else if (info.offset.x > dragThreshold && currentIndex > 0) {
      goToPrevWord();
    }
  };
  
  return (
    <div className="relative w-full max-w-md mx-auto h-80">
      <motion.div
        className="w-full h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={{ x: direction === 'left' ? -200 : direction === 'right' ? 200 : 0, opacity: direction ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="card-flip w-full h-full cursor-pointer"
          onClick={flipCard}
        >
          <div className={cn(
            "card-inner h-full relative",
            flipped ? "rotate-y-180" : ""
          )}>
            {/* Front of card */}
            <Card className={cn(
              "absolute w-full h-full backface-hidden rounded-lg shadow-md flex flex-col justify-center items-center p-6",
              flipped ? "invisible" : "visible",
              currentWord.difficulty === 'basic' ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" :
              currentWord.difficulty === 'intermediate' ? "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" :
              "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200",
              "border-2"
            )}>
              <p className={cn(
                "text-sm mb-2 self-start font-semibold",
                currentWord.difficulty === 'basic' ? "text-blue-600" :
                currentWord.difficulty === 'intermediate' ? "text-purple-600" :
                "text-amber-600"
              )}>{getDifficultyText()}</p>
              <h3 className="font-ottoman text-4xl mb-2 text-[#2d3748]">{currentWord.ottoman}</h3>
              <p className="text-sm text-gray-600">Kartı çevirmek için tıklayın</p>
              <p className="text-xs text-gray-500 mt-2">Diğer kelimeler için sola veya sağa kaydırın</p>
              
              {totalAttempts > 0 && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <span className={`w-2 h-2 ${getAccuracyColor()} rounded-full`}></span>
                  <span className={`text-xs ${getAccuracyColor().replace('bg-', 'text-')}`}>%{accuracy}</span>
                </div>
              )}
            </Card>
            
            {/* Back of card */}
            <Card className={cn(
              "absolute w-full h-full backface-hidden rounded-lg shadow-md p-6 rotate-y-180",
              flipped ? "visible" : "invisible",
              currentWord.difficulty === 'basic' ? "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200" :
              currentWord.difficulty === 'intermediate' ? "bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200" :
              "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-200",
              "border-2"
            )}>
              <h3 className="font-medium text-lg mb-2">{currentWord.turkish}</h3>
              <p className="mb-3 text-sm">{currentWord.meaning}</p>
              
              {currentWord.exampleOttoman && (
                <p className="font-ottoman text-lg mb-1 text-[#2d3748]">{currentWord.exampleOttoman}</p>
              )}
              
              {currentWord.exampleTurkish && (
                <p className="text-sm italic mb-4">{currentWord.exampleTurkish}</p>
              )}
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button 
                  className="p-1 text-gray-500 hover:text-[#2c5282]"
                  onClick={(e) => handlePlayAudio(e)}
                >
                  <Volume2 size={16} />
                </button>
                <button 
                  className="p-1 text-gray-500 hover:text-[#ecc94b]"
                  onClick={(e) => handleBookmark(e)}
                >
                  <Bookmark size={16} />
                </button>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
      
      <div className="absolute -bottom-12 left-0 right-0 flex justify-between items-center mt-4">
        <Button 
          onClick={goToPrevWord} 
          disabled={currentIndex === 0}
          variant="outline"
          size="sm"
          className="px-3"
        >
          <ArrowLeft size={16} className="mr-1" /> Önceki
        </Button>
        
        <div className="text-xs text-gray-500">
          {currentIndex + 1} / {words.length}
        </div>
        
        <Button 
          onClick={goToNextWord} 
          disabled={currentIndex === words.length - 1}
          variant="outline"
          size="sm"
          className="px-3"
        >
          Sonraki <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default SwipeableWordCard;