import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Volume2, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type WordWithProgress } from '@shared/schema';

interface WordCardProps {
  word: WordWithProgress;
}

const WordCard = ({ word }: WordCardProps) => {
  const [flipped, setFlipped] = useState(false);
  
  // Calculate accuracy if progress exists
  const totalAttempts = word.progress ? word.progress.correctCount + word.progress.incorrectCount : 0;
  const accuracy = totalAttempts > 0 
    ? Math.round((word.progress!.correctCount / totalAttempts) * 100) 
    : 0;
  
  // Helper to determine accuracy indicator color
  const getAccuracyColor = () => {
    if (totalAttempts === 0) return 'bg-gray-300';
    if (accuracy >= 80) return 'bg-green-500';
    if (accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Helper to determine difficulty level text
  const getDifficultyText = () => {
    switch(word.difficulty) {
      case 'basic': return 'Temel';
      case 'intermediate': return 'Orta';
      case 'advanced': return 'İleri';
      default: return word.difficulty;
    }
  };
  
  // Handle card flip
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  // Handle audio playback (would be implemented in a real app)
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implementation would go here
    console.log('Play audio for', word.turkish);
  };
  
  // Handle bookmark (would be implemented in a real app)
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implementation would go here
    console.log('Bookmark', word.turkish);
  };
  
  return (
    <div className="h-60" onClick={handleFlip}>
      <div className={cn(
        "relative h-full w-full transition-transform duration-500 transform-style-preserve-3d",
        flipped ? "rotate-y-180" : ""
      )}>
        {/* Front of card */}
        <Card className={cn(
          "absolute w-full h-full backface-hidden bg-white rounded-lg shadow-md flex flex-col justify-center items-center p-6",
          flipped ? "invisible" : "visible"
        )}>
          <p className="text-sm text-gray-500 mb-2 self-start">{getDifficultyText()}</p>
          {/* Osmanlıca karakterleri gizlendi */}
          <h3 className="font-medium text-lg mb-2 text-[#2d3748]">{word.turkish}</h3>
          <p className="text-sm text-gray-600">Kartı çevirmek için tıklayın</p>
          
          {totalAttempts > 0 && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <span className={`w-2 h-2 ${getAccuracyColor()} rounded-full`}></span>
              <span className={`text-xs ${getAccuracyColor().replace('bg-', 'text-')}`}>%{accuracy}</span>
            </div>
          )}
        </Card>
        
        {/* Back of card */}
        <Card className={cn(
          "absolute w-full h-full backface-hidden bg-white rounded-lg shadow-md p-6 rotate-y-180",
          flipped ? "visible" : "invisible"
        )}>
          <h3 className="font-medium text-lg mb-2">{word.turkish}</h3>
          <p className="mb-3 text-sm">{word.meaning}</p>
          
          {/* Osmanlıca örnek gizlendi */}
          
          {word.exampleTurkish && (
            <p className="text-sm italic mb-4">{word.exampleTurkish}</p>
          )}
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button 
              className="p-1 text-gray-500 hover:text-[#2c5282]"
              onClick={handlePlayAudio}
            >
              <Volume2 size={16} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-[#ecc94b]"
              onClick={handleBookmark}
            >
              <Bookmark size={16} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WordCard;
