import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStats } from '@/hooks/useUserStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CalendarDays, TrendingUp, Award } from 'lucide-react';

const Statistics = () => {
  // Using a hardcoded userId for demo (in a real app, this would come from auth)
  const userId = 1;
  
  const { data: stats, isLoading } = useUserStats(userId);
  
  // Mock data for charts (in a real app, this would come from API)
  const weeklyActivityData = [
    { name: 'Pzt', words: 20 },
    { name: 'Sal', words: 15 },
    { name: 'Çar', words: 25 },
    { name: 'Per', words: 17 },
    { name: 'Cum', words: 30 },
    { name: 'Cmt', words: 5 },
    { name: 'Paz', words: 0 },
  ];
  
  const categoryProgressData = [
    { name: 'Temel', value: 35 },
    { name: 'Orta', value: 25 },
    { name: 'İleri', value: 15 },
    { name: 'Deyimler', value: 10 },
    { name: 'Günlük', value: 15 },
  ];
  
  const COLORS = ['#2c5282', '#c53030', '#ecc94b', '#38a169', '#9f7aea'];
  
  if (isLoading || !stats) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-serif text-2xl font-bold text-[#2d3748] mb-6">İstatistikler</h1>
        <div className="text-center py-8">
          <p className="text-gray-500">İstatistikler yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-serif text-2xl font-bold text-[#2d3748] mb-6">İstatistikler</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-4 rounded-full bg-blue-100 text-[#2c5282] mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Doğruluk Oranı</p>
              <h3 className="text-3xl font-bold text-[#2d3748]">{stats.accuracy}%</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-4 rounded-full bg-green-100 text-green-600 mr-4">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Öğrenilen Kelimeler</p>
              <h3 className="text-3xl font-bold text-[#2d3748]">{stats.learnedWords}/{stats.totalWords}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-4 rounded-full bg-yellow-100 text-[#ecc94b] mr-4">
              <CalendarDays size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Günlük Seri</p>
              <h3 className="text-3xl font-bold text-[#2d3748]">{stats.streak} gün</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Haftalık Aktivite</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyActivityData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="words" fill="#2c5282" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Kategorilere Göre İlerleme</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryProgressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name}: %${(percent * 100).toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Öğrenme Gelişimi</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { month: 'Oca', learned: 10, reviewed: 5 },
                { month: 'Şub', learned: 15, reviewed: 10 },
                { month: 'Mar', learned: 20, reviewed: 15 },
                { month: 'Nis', learned: 25, reviewed: 20 },
                { month: 'May', learned: 30, reviewed: 25 },
                { month: 'Haz', learned: 35, reviewed: 30 },
              ]}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="learned" name="Öğrenilen" fill="#2c5282" />
              <Bar dataKey="reviewed" name="Tekrar Edilen" fill="#ecc94b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
