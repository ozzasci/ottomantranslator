import { useQuery } from '@tanstack/react-query';
import { Book, CheckCircle, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { type UserStats } from '@shared/schema';

interface StatsSummaryProps {
  userId: number;
}

const StatsSummary = ({ userId }: StatsSummaryProps) => {
  const { data: stats, isLoading } = useQuery<UserStats>({ 
    queryKey: [`/api/stats/${userId}`] 
  });
  
  if (isLoading || !stats) {
    return (
      <section className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <Skeleton className="h-8 w-64 mb-4 md:mb-0" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }
  
  return (
    <section className="mb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="font-serif text-2xl font-bold text-[#2d3748] mb-4 md:mb-0">Hoş Geldiniz, <span>Öğrenci</span>!</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-[#2c5282] mr-4">
                <Book size={20} />
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Öğrenilen Kelimeler</h3>
                <p className="text-2xl font-bold text-[#2d3748]">
                  {stats.learnedWords}/{stats.totalWords}
                </p>
              </div>
            </div>
            <Progress 
              value={(stats.learnedWords / stats.totalWords) * 100} 
              className="mt-3 bg-gray-200 h-2"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <CheckCircle size={20} />
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Doğruluk Oranı</h3>
                <p className="text-2xl font-bold text-[#2d3748]">{stats.accuracy}%</p>
              </div>
            </div>
            <Progress 
              value={stats.accuracy} 
              className="mt-3 bg-gray-200 h-2"
              indicatorClassName="bg-green-500"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-[#ecc94b] mr-4">
                <Flame size={20} />
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Günlük Seri</h3>
                <p className="text-2xl font-bold text-[#2d3748]">{stats.streak} gün</p>
              </div>
            </div>
            <div className="mt-3 flex space-x-1">
              {stats.weekActivity.map((active, index) => (
                <div 
                  key={index}
                  className={`flex-1 h-6 ${active ? 'bg-[#ecc94b]' : 'bg-gray-200'} rounded-sm`}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default StatsSummary;
