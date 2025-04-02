import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kelimeler.txt dosyasının yolu
const filePath = path.join(__dirname, 'attached_assets', 'kelimeler.txt');

// Dosyayı okuyalım
const content = fs.readFileSync(filePath, 'utf8');

// Satırları ayıralım
const lines = content.split('\n').filter(line => line.trim() !== '');

// Kelimeleri toplayacağımız dizi
const words = [];

// İlk satırı atlayalım (başlık satırı)
for (let i = 1; i < lines.length; i++) {
  // Her satır iki kelime ve anlamı içerebilir
  const line = lines[i].trim();
  
  // Satırı boşluklara göre bölelim
  const parts = line.split(/\s+/);
  
  // İlk kelime ve anlamı
  if (parts.length >= 2) {
    const word1 = parts[0];
    
    // Anlamı için bir sonraki kelimeyi alıyoruz, ancak satırın yarısına kadar
    // Çünkü satırın ikinci yarısı başka bir kelime içerebilir
    let meaning1 = '';
    const midPoint = Math.floor(parts.length / 2);
    
    // İlk kelimenin anlamı satırın ortasına kadar olan kısım olabilir
    for (let j = 1; j < midPoint; j++) {
      meaning1 += parts[j] + ' ';
    }
    
    words.push({
      ottoman: word1,
      turkish: word1.toLowerCase(),
      meaning: meaning1.trim()
    });
    
    // İkinci kelime ve anlamı (eğer satırda ikinci bir kelime varsa)
    if (parts.length > midPoint) {
      const word2 = parts[midPoint];
      let meaning2 = '';
      
      // İkinci kelimenin anlamı satırın geri kalan kısmı
      for (let j = midPoint + 1; j < parts.length; j++) {
        meaning2 += parts[j] + ' ';
      }
      
      words.push({
        ottoman: word2,
        turkish: word2.toLowerCase(),
        meaning: meaning2.trim()
      });
    }
  }
}

// Elde edilen kelimeleri bir JSON dosyasına yazalım
fs.writeFileSync('all-words.json', JSON.stringify(words, null, 2));

console.log(`${words.length} kelime başarıyla çıkarıldı ve all-words.json dosyasına kaydedildi.`);