import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import AddWordDialog from '@/components/AddWordDialog';
import StatsSummary from '@/components/StatsSummary';
import DailyWord from '@/components/DailyWord';
import WordCard from '@/components/WordCard';
import SwipeableWordCard from '@/components/SwipeableWordCard';
import StudyModes from '@/components/StudyModes';
import SuggestedWords from '@/components/SuggestedWords';
import PluralSingularSection from '@/components/PluralSingularSection';
import { useWordsWithProgress } from '@/hooks/useWords';
import { LayoutGrid, List, GripHorizontal } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayGrid, setDisplayGrid] = useState(true);
  
  // Using a hardcoded userId for demo (in a real app, this would come from auth)
  const userId = 1;
  
  const { data: wordsWithProgress, isLoading: isLoadingWords } = useWordsWithProgress(userId);
  
  // Filter words based on search query only
  const filteredWords = wordsWithProgress?.filter(word => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return word.turkish.toLowerCase().includes(query) ||
        word.ottoman.includes(query) ||
        (word.meaning && word.meaning.toLowerCase().includes(query));
    }
    
    return true;
  });
  
  // Tüm kelimeler zaten yükleniyor, load more butonu göstermeyelim
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Dashboard Summary */}
      <StatsSummary userId={userId} />
      
      {/* Featured Word and Plural-Singular Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <DailyWord />
        <div>
          <h2 className="font-serif text-xl font-bold text-[#2d3748] mb-4">Çoğul-Tekil Alıştırması</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <PluralSingularSection />
          </div>
        </div>
      </div>
      
      {/* Suggested Words */}
      <SuggestedWords userId={userId} />
      
      {/* Word Cards */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-xl font-bold text-[#2d3748]">Kelimeleri Keşfet</h2>
          
          <div className="flex items-center gap-4">
            <SearchBar onSearch={setSearchQuery} />
            
            <AddWordDialog />
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Görünüm:</span>
              <Button 
                variant="ghost" 
                size="sm"
                className={displayGrid ? "text-[#2c5282]" : "text-gray-400"}
                onClick={() => setDisplayGrid(true)}
              >
                <LayoutGrid size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={!displayGrid ? "text-[#2c5282]" : "text-gray-400"}
                onClick={() => setDisplayGrid(false)}
              >
                <GripHorizontal size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        {isLoadingWords ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-60 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <>
            {displayGrid ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWords && filteredWords.length > 0 ? (
                  filteredWords.map(word => (
                    <WordCard key={word.id} word={word} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">Kelime bulunamadı.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-16">
                {filteredWords && filteredWords.length > 0 ? (
                  <SwipeableWordCard words={filteredWords} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Kelime bulunamadı.</p>
                  </div>
                )}
              </div>
            )}
            

          </>
        )}
      </section>
      
      {/* Study Mode Section */}
      <StudyModes />
    </div>
  );
};

export default Home;
