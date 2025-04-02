import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kelimeler.json dosyasının yolu
const jsonPath = path.join(__dirname, 'all-words.json');

// Dosyayı okuyalım
const jsonContent = fs.readFileSync(jsonPath, 'utf8');
const words = JSON.parse(jsonContent);

// API'ye istek atarak kelimeleri ekleyelim
async function addWords() {
  console.log(`${words.length} kelime işleniyor...`);

  // Önce kategorileri alalım
  const categories = await fetch('http://localhost:3000/api/categories')
    .then(res => res.json())
    .catch(err => {
      console.error('Kategoriler alınırken hata:', err);
      return [];
    });

  if (!categories.length) {
    console.error('Kategoriler alınamadı!');
    return;
  }

  const basicCategoryId = categories.find(c => c.level === 'basic').id;
  console.log(`Temel kategori ID: ${basicCategoryId}`);

  // Kelimeleri ekleyelim
  let successCount = 0;
  let errorCount = 0;

  for (const word of words) {
    try {
      // Önce kelimenin zaten var olup olmadığını kontrol edelim
      const searchRes = await fetch(`http://localhost:3000/api/words?query=${encodeURIComponent(word.turkish)}`)
        .then(res => res.json());
      
      const exists = searchRes.some(w => 
        w.turkish.toLowerCase() === word.turkish.toLowerCase() || 
        w.ottoman.toLowerCase() === word.ottoman.toLowerCase()
      );
      
      if (!exists) {
        const response = await fetch('http://localhost:3000/api/words', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ottoman: word.ottoman,
            turkish: word.turkish,
            meaning: word.meaning || null,
            categoryId: basicCategoryId,
            difficulty: 'basic',
            etymology: "Osmanlıca kelime",
            exampleOttoman: null,
            exampleTurkish: null,
            audioUrl: null
          }),
        });
        
        if (response.ok) {
          successCount++;
          if (successCount % 10 === 0) {
            console.log(`${successCount} kelime eklendi...`);
          }
        } else {
          errorCount++;
          console.error(`Kelime eklenirken hata: ${word.turkish} - ${response.status}`);
        }
      } else {
        console.log(`Kelime zaten mevcut: ${word.turkish}`);
      }
    } catch (error) {
      errorCount++;
      console.error(`İşlem hatası: ${word.turkish}`, error.message);
    }
    
    // Her istek arasında kısa bir gecikme ekleyelim
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log(`İşlem tamamlandı!`);
  console.log(`Eklenen: ${successCount}`);
  console.log(`Hata: ${errorCount}`);
  console.log(`Mevcut: ${words.length - successCount - errorCount}`);
}

// Uygulamanın başlatılması için biraz bekleyelim
setTimeout(() => {
  addWords().catch(console.error);
}, 2000);