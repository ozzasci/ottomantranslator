import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Volume2, Trash, Edit } from 'lucide-react';
import AddWordDialog from '@/components/AddWordDialog';
import { useWordsWithProgress } from '@/hooks/useWords';
import { useCategories } from '@/hooks/useCategories';
import { Badge } from '@/components/ui/badge';

const WordList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  
  // Using a hardcoded userId for demo (in a real app, this would come from auth)
  const userId = 1;
  
  const { data: wordsWithProgress, isLoading: isLoadingWords } = useWordsWithProgress(userId);
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  
  // Filter words based on search query, category, and difficulty
  const filteredWords = wordsWithProgress?.filter(word => {
    let matchesSearch = true;
    let matchesCategory = true;
    let matchesDifficulty = true;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch = 
        word.turkish.toLowerCase().includes(query) ||
        word.ottoman.includes(query) ||
        (word.meaning && word.meaning.toLowerCase().includes(query));
    }
    
    if (categoryFilter !== 'all') {
      matchesCategory = word.categoryId === parseInt(categoryFilter);
    }
    
    if (difficultyFilter !== 'all') {
      matchesDifficulty = word.difficulty === difficultyFilter;
    }
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Helper to get category name by id
  const getCategoryName = (categoryId: number) => {
    return categories?.find(c => c.id === categoryId)?.name || 'Bilinmeyen';
  };
  
  // Helper to format difficulty
  const formatDifficulty = (difficulty: string) => {
    switch(difficulty) {
      case 'basic': return 'Temel';
      case 'intermediate': return 'Orta';
      case 'advanced': return 'İleri';
      default: return difficulty;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Kelime Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-2/3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Kelime ara..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {categories?.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Zorluk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Zorluklar</SelectItem>
                  <SelectItem value="basic">Temel</SelectItem>
                  <SelectItem value="intermediate">Orta</SelectItem>
                  <SelectItem value="advanced">İleri</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <AddWordDialog />
          </div>
          
          {isLoadingWords || isLoadingCategories ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Kelimeler yükleniyor...</p>
            </div>
          ) : filteredWords && filteredWords.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Osmanlıca</TableHead>
                    <TableHead>Türkçe</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Zorluk</TableHead>
                    <TableHead>İlerleme</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWords.map(word => {
                    // Calculate progress
                    const totalAttempts = word.progress ? word.progress.correctCount + word.progress.incorrectCount : 0;
                    const progressPercentage = totalAttempts > 0 
                      ? Math.round((word.progress!.correctCount / totalAttempts) * 100) 
                      : 0;
                    
                    return (
                      <TableRow key={word.id}>
                        <TableCell className="font-ottoman text-lg">{word.ottoman}</TableCell>
                        <TableCell>{word.turkish}</TableCell>
                        <TableCell>{getCategoryName(word.categoryId)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            word.difficulty === 'basic' ? 'default' :
                            word.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                          }>
                            {formatDifficulty(word.difficulty)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {totalAttempts > 0 ? (
                            <span className={
                              progressPercentage >= 80 ? 'text-green-600' :
                              progressPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                            }>
                              %{progressPercentage}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Volume2 size={16} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Kelime bulunamadı.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WordList;
