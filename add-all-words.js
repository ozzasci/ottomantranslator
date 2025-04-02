import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kelimeler.json dosyasının yolu
const jsonPath = path.join(__dirname, 'all-words.json');

// Dosyayı okuyalım
const jsonContent = fs.readFileSync(jsonPath, 'utf8');
const words = JSON.parse(jsonContent);

// Server dosyasını içe aktar (async/await kullanabilmek için)
import('./server/storage.js').then(async ({ storage }) => {
  console.log(`${words.length} kelime ekleniyor...`);
  
  // Kategori ID'sini almak için
  const categories = await storage.getAllCategories();
  const basicCategoryId = categories.find(c => c.level === 'basic').id;
  
  // Her kelimeyi ekleyelim
  let count = 0;
  for (const word of words) {
    try {
      // Kelimenin zaten var olup olmadığını kontrol et
      const existingWords = await storage.searchWords(word.turkish);
      const alreadyExists = existingWords.some(w => 
        w.turkish.toLowerCase() === word.turkish.toLowerCase() ||
        w.ottoman.toLowerCase() === word.ottoman.toLowerCase()
      );
      
      if (!alreadyExists) {
        await storage.createWord({
          ottoman: word.ottoman,
          turkish: word.turkish,
          meaning: word.meaning,
          categoryId: basicCategoryId,
          difficulty: "basic",
          etymology: "Osmanlıca kelime",
          audioUrl: ""
        });
        count++;
      }
    } catch (error) {
      console.error(`Kelime eklenirken hata: ${word.turkish}`, error);
    }
  }
  
  console.log(`Toplam ${count} yeni kelime eklendi.`);
  console.log('İşlem tamamlandı.');
  
  // Kelimelerin toplam sayısını gösterelim
  const allWords = await storage.getAllWords();
  console.log(`Veritabanındaki toplam kelime sayısı: ${allWords.length}`);
}).catch(error => {
  console.error('İşlem sırasında hata oluştu:', error);
});