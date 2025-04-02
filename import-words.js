// MemStorage'ı temizleyip tüm kelimeleri tek seferde ekleme scripti
import * as fs from 'fs';

// Çıkarılan kelime listesini oku
const words = JSON.parse(fs.readFileSync('./extracted-words.json', 'utf8'));

// Temel kategori ID'sini belirle
const categoryId = 1;

// Önce tüm mevcut kelimeleri sil
async function clearAndImportWords() {
  console.log(`Toplam ${words.length} kelime içe aktarılıyor...`);
  
  let successCount = 0;
  let errorCount = 0;

  try {
    // Mevcut veritabanını kontrol et
    const checkResponse = await fetch('http://localhost:5000/api/words');
    const currentWords = await checkResponse.json();
    console.log(`Mevcut kelime sayısı: ${currentWords.length}`);
    
    // Her kelime için ekle
    for (const word of words) {
      try {
        // Önceki silinmiş olsun ya da olmasın, kelimeyi eklemek için POST isteği gönder
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
            difficulty: 'basic', // Varsayılan zorluk seviyesi
            exampleOttoman: null,
            exampleTurkish: null,
            etymology: "Osmanlıca kelime",
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
      
      // Her istek arasında kısa bir süre bekle (sunucuyu aşırı yüklememek için)
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error('İşlem sırasında beklenmeyen bir hata oluştu:', error);
  }
  
  console.log(`
İçe aktarma tamamlandı:
- Başarılı: ${successCount}
- Hatalı: ${errorCount}
- Toplam: ${words.length}
  `);
  
  // Mevcut kelime sayısını kontrol et
  try {
    const finalCheckResponse = await fetch('http://localhost:5000/api/words');
    const finalWords = await finalCheckResponse.json();
    console.log(`İşlem sonrası toplam kelime sayısı: ${finalWords.length}`);
  } catch (error) {
    console.error('Son kontrol yapılamadı:', error);
  }
}

clearAndImportWords().catch(console.error);