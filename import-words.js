// Tüm kelime listesini veritabanına aktaran script
import * as fs from 'fs';

// Çıkarılan kelime listesini oku
const words = JSON.parse(fs.readFileSync('./extracted-words.json', 'utf8'));

// Temel kategori ID'sini belirle (mevcut uygulamamızda 1 olduğunu varsayıyoruz)
const categoryId = 1;

// Her kelime için API çağrısı yap
async function importWords() {
  console.log(`Toplam ${words.length} kelime içe aktarılıyor...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const word of words) {
    try {
      // Kelimeyi eklemek için POST isteği gönder
      const response = await fetch('http://localhost:5000/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ottoman: word.ottoman,
          turkish: word.turkish,
          meaning: word.meaning || null,
          categoryId: categoryId,
          difficulty: 'basic', // Varsayılan zorluk
          exampleOttoman: null,
          exampleTurkish: null,
          etymology: null,
          audioUrl: null
        }),
      });
      
      if (response.ok) {
        successCount++;
        if (successCount % 10 === 0) {
          console.log(`${successCount} kelime başarıyla eklendi...`);
        }
      } else {
        const error = await response.json();
        console.error(`Kelime eklenemedi: ${word.ottoman} - ${word.turkish}`, error);
        errorCount++;
      }
    } catch (error) {
      console.error(`Hata oluştu: ${word.ottoman} - ${word.turkish}`, error);
      errorCount++;
    }
    
    // Her istek arasında kısa bir süre bekle
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log(`
İçe aktarma tamamlandı:
- Başarılı: ${successCount}
- Hatalı: ${errorCount}
- Toplam: ${words.length}
  `);
}

importWords().catch(console.error);