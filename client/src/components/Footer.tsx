import { Link } from "wouter";
import { BookOpen } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2d3748] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="text-[#ecc94b]" size={20} />
              <h2 className="font-serif text-xl">Osmanlıca Öğrenme</h2>
            </div>
            <p className="text-gray-400 max-w-md">
              Osmanlıca dilini modern teknoloji ile keşfedin. Zengin kelime hazinesi, 
              interaktif alıştırmalar ve kişiselleştirilmiş öğrenme deneyimi.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/"><a className="hover:text-white transition">Ana Sayfa</a></Link></li>
                <li><Link href="/words"><a className="hover:text-white transition">Kelimeler</a></Link></li>
                <li><Link href="/practice"><a className="hover:text-white transition">Alıştırmalar</a></Link></li>
                <li><Link href="/statistics"><a className="hover:text-white transition">İstatistikler</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Kaynaklar</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Osmanlıca Sözlük</a></li>
                <li><a href="#" className="hover:text-white transition">Gramer Rehberi</a></li>
                <li><a href="#" className="hover:text-white transition">El Yazısı Örnekleri</a></li>
                <li><a href="#" className="hover:text-white transition">Sesli Telaffuz</a></li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-medium text-lg mb-4">İletişim</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition">Destek</a></li>
                <li><a href="#" className="hover:text-white transition">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition">Geri Bildirim</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Osmanlıca Öğrenme Platformu. Tüm hakları saklıdır.
          </p>
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
