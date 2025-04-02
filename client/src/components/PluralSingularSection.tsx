import { useState, useEffect } from 'react';
import PluralSingularCard from './PluralSingularCard';
import { pluralSingularPairs } from '@/data/pluralSingularPairs';

const PluralSingularSection = () => {
  // Kelime çiftlerini karıştırıp ilk 10 tanesini seçeceğiz
  const [selectedPairs, setSelectedPairs] = useState(pluralSingularPairs);
  
  useEffect(() => {
    // Kelime çiftlerini karıştırma
    const shufflePairs = () => {
      // Karıştırılmış yeni bir dizi oluştur
      const shuffled = [...pluralSingularPairs].sort(() => Math.random() - 0.5);
      
      // İlk 10 kelimeyi al (veya daha az varsa hepsini)
      const selected = shuffled.slice(0, 10);
      
      setSelectedPairs(selected);
    };
    
    shufflePairs();
    
    // 24 saatte bir yeni kelimeler göster (milisaniye cinsinden)
    const interval = setInterval(shufflePairs, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (selectedPairs.length === 0) {
    return <div>Kelimeler yükleniyor...</div>;
  }
  
  return <PluralSingularCard pairs={selectedPairs} />;
};

export default PluralSingularSection;