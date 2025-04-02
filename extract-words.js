// kelimeler.txt dosyasındaki tüm Osmanlıca kelimeleri işleyip
// daha düzenli bir formatta çıktı oluşturan script

import * as fs from 'fs';

// Kelimeler.txt dosyasını oku
const fileContent = fs.readFileSync('./attached_assets/kelimeler.txt', 'utf8');
const lines = fileContent.split('\n');

// Çıktı için kelime listesi
const words = [];

// ilk satırı atla (başlık satırı)
let i = 1;
while (i < lines.length - 1) {
  try {
    const line1 = lines[i].trim();
    
    // Özel formatları kontrol et - yeni satıra taşan açıklamalar
    if (line1.startsWith('işlemlerini yapan büro') || 
        line1.startsWith('Hazine-i hassa; padişah hazine') ||
        line1.startsWith('göstermek üzere verilen belge') ||
        line1.startsWith('gösteren yazılı emir')) {
      i++;
      continue;
    }
    
    // Eğer bu noktalara geldiysek, normal 2'li format kullanılıyor demektir
    const line2 = lines[i+1]?.trim();
    
    if (!line1 || !line2) {
      i += 2;
      continue;
    }
    
    // Kelime satırını işle (1. satır)
    const ottomanParts = line1.split(' ');
    if (ottomanParts.length < 1) {
      i += 2;
      continue;
    }
    
    const ottoman = ottomanParts[0]; // İlk kelime Osmanlıca
    const ottomanMeaning = ottomanParts.length > 1 ? ottomanParts.slice(1).join(' ') : ''; // Geri kalanı anlam
    
    // Türkçe karşılık satırını işle (2. satır)
    const turkishParts = line2.split(' ');
    if (turkishParts.length < 1) {
      i += 2;
      continue;
    }
    
    const turkish = turkishParts[0]; // İlk kelime Türkçe
    const turkishMeaning = turkishParts.length > 1 ? turkishParts.slice(1).join(' ') : ''; // Geri kalanı anlam
    
    // Birleştirilmiş anlam
    let meaning = '';
    if (ottomanMeaning && turkishMeaning) {
      meaning = `${ottomanMeaning} (${turkishMeaning})`;
    } else if (ottomanMeaning) {
      meaning = ottomanMeaning;
    } else if (turkishMeaning) {
      meaning = turkishMeaning;
    }
    
    // Kelime ve anlamı ekleyelim
    if (ottoman && turkish) {
      words.push({
        ottoman: ottoman,
        turkish: turkish,
        meaning: meaning
      });
    }
    
    i += 2;
  } catch (error) {
    console.error(`Satır ${i} işlenirken hata oluştu:`, error);
    i += 1; // Hata durumunda bir satır ilerle
  }
}

// Kelimeleri JSON formatında kaydet
fs.writeFileSync('./extracted-words.json', JSON.stringify(words, null, 2));

console.log(`İşlem tamamlandı. ${words.length} kelime başarıyla çıkarıldı ve 'extracted-words.json' dosyasına kaydedildi.`);