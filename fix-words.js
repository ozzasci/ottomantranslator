import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as storage from './server/storage.js';
import * as schema from './shared/schema.js';

// Bu script doğrudan storage modülünü kullanarak kelime ekler

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kelimeler.json dosyasının yolu
const jsonPath = path.join(__dirname, 'all-words.json');

try {
  // Dosyayı okuyalım
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const words = JSON.parse(jsonContent);
  
  console.log(`${words.length} kelime işlenecek...`);
  
  function addWordsToStorage() {
    // MemStorage sınıfına erişim
    const memStorage = storage.storage;
    
    // Kategorileri alalım
    memStorage.getAllCategories().then(categories => {
      const basicCategoryId = categories.find(c => c.level === 'basic').id;
      console.log(`Temel kategori ID: ${basicCategoryId}`);
      
      // Mevcut kelimeleri alalım
      memStorage.getAllWords().then(existingWords => {
        console.log(`Mevcut kelime sayısı: ${existingWords.length}`);
        
        // İçeri aktarılacak kelimeler
        let importCount = 0;
        let skipCount = 0;
        
        // Her kelimeyi ekleyelim
        const promises = words.map(word => {
          // Kelimenin zaten var olup olmadığını kontrol et
          const exists = existingWords.some(w => 
            w.turkish.toLowerCase() === word.turkish.toLowerCase() ||
            w.ottoman.toLowerCase() === word.ottoman.toLowerCase()
          );
          
          if (!exists) {
            importCount++;
            return memStorage.createWord({
              ottoman: word.ottoman,
              turkish: word.turkish,
              meaning: word.meaning || null,
              categoryId: basicCategoryId,
              difficulty: 'basic',
              etymology: "Osmanlıca kelime",
              exampleOttoman: null,
              exampleTurkish: null,
              audioUrl: null
            });
          } else {
            skipCount++;
            return Promise.resolve(null);
          }
        });
        
        // Tüm işlemlerin tamamlanmasını bekleyelim
        Promise.all(promises).then(() => {
          // Son durumu kontrol et
          memStorage.getAllWords().then(finalWords => {
            console.log(`İşlem tamamlandı!`);
            console.log(`Eklenen kelime sayısı: ${importCount}`);
            console.log(`Atlanan kelime sayısı: ${skipCount}`);
            console.log(`Son toplam kelime sayısı: ${finalWords.length}`);
          });
        });
      });
    });
  }
  
  // Kelime ekleme işlemini başlat
  addWordsToStorage();
  
} catch (error) {
  console.error('Hata:', error);
}