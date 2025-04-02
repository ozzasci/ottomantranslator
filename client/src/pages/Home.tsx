import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import AddWordDialog from '@/components/AddWordDialog';
import StatsSummary from '@/components/StatsSummary';
import CategorySelector from '@/components/CategorySelector';
import DailyWord from '@/components/DailyWord';
import WordCard from '@/components/WordCard';
import StudyModes from '@/components/StudyModes';
import { useWordsWithProgress } from '@/hooks/useWords';
import { LayoutGrid, List } from 'lucide-react';

const Home = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayGrid, setDisplayGrid] = useState(true);
  
  // Using a hardcoded userId for demo (in a real app, this would come from auth)
  const userId = 1;
  
  const { data: wordsWithProgress, isLoading: isLoadingWords } = useWordsWithProgress(userId);
  
  // Filter words based on category and search query
  const filteredWords = wordsWithProgress?.filter(word => {
    let matchesCategory = true;
    let matchesSearch = true;
    
    if (selectedCategoryId !== null) {
      matchesCategory = word.categoryId === selectedCategoryId;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch = 
        word.turkish.toLowerCase().includes(query) ||
        word.ottoman.includes(query) ||
        (word.meaning && word.meaning.toLowerCase().includes(query));
    }
    
    return matchesCategory && matchesSearch;
  });
  
  // Load more words handler (would be implemented in a real app)
  const handleLoadMore = () => {
    // Implementation would go here
    console.log('Load more words');
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Dashboard Summary */}
      <StatsSummary userId={userId} />
      
      {/* Category Selector */}
      <CategorySelector 
        onCategorySelect={setSelectedCategoryId}
        selectedCategoryId={selectedCategoryId}
      />
      
      {/* Featured Word */}
      <DailyWord />
      
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
                <List size={16} />
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
            <div className={displayGrid ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
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
            
            {filteredWords && filteredWords.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button 
                  className="bg-[#2c5282] hover:bg-blue-700"
                  onClick={handleLoadMore}
                >
                  Daha Fazla Kelime Yükle
                </Button>
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
