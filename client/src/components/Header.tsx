import { Link, useLocation } from "wouter";
import { BookOpen } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <header className="bg-[#c53030] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <BookOpen className="text-[#ecc94b]" size={24} />
          <h1 className="font-serif text-2xl font-bold">Osmanlıca Öğrenme</h1>
        </div>
        
        <nav className="flex items-center space-x-1 md:space-x-4 text-sm md:text-base">
          <Link href="/">
            <a className={`px-2 md:px-3 py-2 rounded-md ${isActive('/') ? 'bg-[#2c5282]' : 'hover:bg-[#2c5282]/80'} transition`}>
              Ana Sayfa
            </a>
          </Link>
          <Link href="/words">
            <a className={`px-2 md:px-3 py-2 rounded-md ${isActive('/words') ? 'bg-[#2c5282]' : 'hover:bg-[#2c5282]/80'} transition`}>
              Kelimelerim
            </a>
          </Link>
          <Link href="/statistics">
            <a className={`px-2 md:px-3 py-2 rounded-md ${isActive('/statistics') ? 'bg-[#2c5282]' : 'hover:bg-[#2c5282]/80'} transition`}>
              İstatistikler
            </a>
          </Link>
          <Link href="/profile">
            <a className={`px-2 md:px-3 py-2 rounded-md ${isActive('/profile') ? 'bg-[#2c5282]' : 'hover:bg-[#2c5282]/80'} transition`}>
              Profil
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
