// kelimeler.txt dosyasındaki Osmanlıca kelimeleri işleyip
// uygulamaya eklemek için basit bir script

const fs = require('fs');

// kelimeler.txt dosyasını oku
const fileContent = fs.readFileSync('./attached_assets/kelimeler.txt', 'utf8');

// Kelimeleri işle
const processWords = (content) => {
  const lines = content.split('\n');
  const words = [];
  
  // İlk satırı atlayalım (başlık satırı)
  let lineIndex = 1;
  
  while (lineIndex < lines.length) {
    const line = lines[lineIndex].trim();
    if (line) {
      // Satır formatı: "Kelime Anlamı" şeklinde
      const parts = line.split(' ');
      
      if (parts.length >= 2) {
        const ottoman = parts[0]; // Osmanlıca kelime
        
        // Satır formatı değişken olabilir, dolayısıyla geri kalan kısmı anlam olarak alalım
        const meaning = parts.slice(1).join(' ');
        
        // Sonraki satır (Anlamı) kısmını alalım
        if (lineIndex + 1 < lines.length) {
          const turkishLine = lines[lineIndex + 1].trim();
          if (turkishLine) {
            // Türkçe kelimeyi çıkarmaya çalışalım
            const turkishParts = turkishLine.split(' ');
            const turkish = turkishParts[0]; // Türkçe kelime
            
            if (ottoman && turkish && turkish.length > 0) {
              words.push({
                ottoman,
                turkish,
                meaning
              });
            }
          }
        }
      }
    }
    lineIndex += 1;
  }
  
  return words;
};

// Kelimeleri işle
const parsedWords = processWords(fileContent);

// Kelimeler için script çıktısı oluştur
const createWordsScript = (words) => {
  let script = `import { storage } from "./server/storage.js";\n\n`;
  script += `const importWords = async () => {\n`;
  script += `  // Orta (A2-B1) kategorisini kullanacağız\n`;
  script += `  const categories = await storage.getAllCategories();\n`;
  script += `  const categoryId = categories.find(c => c.name === "Orta (A2-B1)")?.id || 2;\n\n`;
  
  script += `  // Kelimeleri ekleyelim\n`;
  script += `  const words = [\n`;
  
  words.forEach(word => {
    script += `    {\n`;
    script += `      ottoman: "${word.ottoman}",\n`;
    script += `      turkish: "${word.turkish}",\n`;
    script += `      meaning: "${word.meaning}",\n`;
    script += `      categoryId: categoryId,\n`;
    script += `      difficulty: "intermediate",\n`;
    script += `      etymology: "",\n`;
    script += `      audioUrl: "",\n`;
    script += `    },\n`;
  });
  
  script += `  ];\n\n`;
  
  script += `  // Kelimeleri veritabanına ekle\n`;
  script += `  for (const word of words) {\n`;
  script += `    try {\n`;
  script += `      await storage.createWord(word);\n`;
  script += `      console.log(\`Kelime eklendi: \${word.turkish}\`);\n`;
  script += `    } catch (error) {\n`;
  script += `      console.error(\`Kelime eklenemedi: \${word.turkish}\`, error);\n`;
  script += `    }\n`;
  script += `  }\n`;
  script += `  console.log("Kelime ekleme işlemi tamamlandı.");\n`;
  script += `};\n\n`;
  script += `importWords();\n`;
  
  return script;
};

// Script dosyası oluştur
const script = createWordsScript(parsedWords);
fs.writeFileSync('./import-words-script.js', script);

console.log(`İşlem tamamlandı. ${parsedWords.length} kelime işlendi.`);
console.log("import-words-script.js dosyası oluşturuldu.");