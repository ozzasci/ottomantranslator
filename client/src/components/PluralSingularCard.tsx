import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export interface PluralSingularPair {
  id: number;
  plural: string;  // çoğul (Arapça)
  singular: string; // tekil (Arapça)
  pluralMeaning?: string; // çoğul anlamı (Türkçe)
  singularMeaning?: string; // tekil anlamı (Türkçe)
}

interface PluralSingularCardProps {
  pairs: PluralSingularPair[];
}

const PluralSingularCard = ({ pairs }: PluralSingularCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  
  // Geçerli kelime çiftini al
  const currentPair = pairs[currentIndex];
  
  if (!currentPair) {
    return <div>Kelime çifti bulunamadı</div>;
  }
  
  // Kartı çevir
  const flipCard = () => {
    setFlipped(!flipped);
  };
  
  // Sonraki kelimeye geç
  const goToNextWord = () => {
    if (currentIndex < pairs.length - 1) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 200);
    }
  };
  
  // Önceki kelimeye geç
  const goToPrevWord = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
      }, 200);
    }
  };
  
  return (
    <div className="relative w-full max-w-md mx-auto h-52">
      <div className="card-flip w-full h-full cursor-pointer" onClick={flipCard}>
        <div className={cn(
          "card-inner h-full relative",
          flipped ? "rotate-y-180" : ""
        )}>
          {/* Front of card - Tekil */}
          <Card className={cn(
            "absolute w-full h-full backface-hidden rounded-lg shadow-md flex flex-col justify-center items-center p-6",
            flipped ? "invisible" : "visible",
            "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 border-2"
          )}>
            <p className="text-sm mb-2 self-start font-semibold text-emerald-600">Tekil</p>
            <h3 className="font-ottoman text-4xl mb-2 text-[#2d3748] text-center">{currentPair.singular}</h3>
            {currentPair.singularMeaning && (
              <p className="text-sm text-gray-600 text-center">{currentPair.singularMeaning}</p>
            )}
            <p className="text-xs text-gray-500 mt-4">Çoğul form için kartı çevirin</p>
          </Card>
          
          {/* Back of card - Çoğul */}
          <Card className={cn(
            "absolute w-full h-full backface-hidden rounded-lg shadow-md p-6 rotate-y-180",
            flipped ? "visible" : "invisible",
            "bg-gradient-to-br from-teal-100 to-teal-50 border-teal-200 border-2"
          )}>
            <p className="text-sm mb-2 self-start font-semibold text-teal-600">Çoğul</p>
            <h3 className="font-ottoman text-4xl mb-2 text-[#2d3748] text-center">{currentPair.plural}</h3>
            {currentPair.pluralMeaning && (
              <p className="text-sm text-gray-600 text-center">{currentPair.pluralMeaning}</p>
            )}
            <p className="text-xs text-gray-500 mt-4">Tekil form için kartı çevirin</p>
          </Card>
        </div>
      </div>
      
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
          {currentIndex + 1} / {pairs.length}
        </div>
        
        <Button 
          onClick={goToNextWord} 
          disabled={currentIndex === pairs.length - 1}
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

export default PluralSingularCard;