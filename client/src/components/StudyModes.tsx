import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Gamepad, Pen, ArrowRight } from 'lucide-react';

const StudyModes = () => {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-xl font-bold text-[#2d3748] mb-6">Çalışma Modları</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/practice?mode=flashcards">
          <a className="block">
            <Card className="border-l-4 border-[#2c5282] hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-blue-100 text-[#2c5282] mr-4">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Kelime Kartları</h3>
                    <p className="text-gray-600 text-sm">Kelime kartları ile hızlı tekrar ve öğrenme.</p>
                    <p className="text-sm mt-3 font-medium text-[#2c5282] flex items-center">
                      Başla <ArrowRight className="ml-1" size={14} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        </Link>
        
        <Link href="/practice?mode=matching">
          <a className="block">
            <Card className="border-l-4 border-[#ecc94b] hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-yellow-100 text-[#ecc94b] mr-4">
                    <Gamepad size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Eşleştirme Oyunu</h3>
                    <p className="text-gray-600 text-sm">Osmanlıca ve modern Türkçe kelimeleri eşleştir.</p>
                    <p className="text-sm mt-3 font-medium text-[#ecc94b] flex items-center">
                      Başla <ArrowRight className="ml-1" size={14} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        </Link>
        
        <Link href="/practice?mode=writing">
          <a className="block">
            <Card className="border-l-4 border-green-500 hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <Pen size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Yazma Alıştırması</h3>
                    <p className="text-gray-600 text-sm">Osmanlıca kelimeleri yazarak öğren.</p>
                    <p className="text-sm mt-3 font-medium text-green-600 flex items-center">
                      Başla <ArrowRight className="ml-1" size={14} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        </Link>
      </div>
    </section>
  );
};

export default StudyModes;
