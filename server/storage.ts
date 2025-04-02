import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  words, type Word, type InsertWord,
  userProgress, type Progress, type InsertProgress,
  relatedWords, type RelatedWord, type InsertRelatedWord,
  type WordWithProgress, type UserStats, type WordWithRelated
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStreak(userId: number, streak: number): Promise<User>;
  updateLastActivity(userId: number): Promise<User>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Word operations
  getAllWords(): Promise<Word[]>;
  getWordById(id: number): Promise<Word | undefined>;
  getWordsByCategory(categoryId: number): Promise<Word[]>;
  searchWords(query: string): Promise<Word[]>;
  createWord(word: InsertWord): Promise<Word>;
  getRelatedWords(wordId: number): Promise<Word[]>;
  addRelatedWord(wordId: number, relatedWordId: number): Promise<void>;
  getDailyWord(): Promise<WordWithRelated | undefined>;
  getSuggestedWords(userId: number, count?: number): Promise<WordWithProgress[]>;
  
  // Progress operations
  getUserProgress(userId: number, wordId: number): Promise<Progress | undefined>;
  recordProgress(progress: InsertProgress): Promise<Progress>;
  updateProgress(id: number, correctCount: number, incorrectCount: number): Promise<Progress>;
  getUserStats(userId: number): Promise<UserStats>;
  getWordsWithProgress(userId: number): Promise<WordWithProgress[]>;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private categoriesMap: Map<number, Category>;
  private wordsMap: Map<number, Word>;
  private progressMap: Map<string, Progress>;
  private relatedWordsMap: Map<string, RelatedWord>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentWordId: number;
  private currentProgressId: number;
  private currentRelatedWordId: number;

  constructor() {
    this.usersMap = new Map();
    this.categoriesMap = new Map();
    this.wordsMap = new Map();
    this.progressMap = new Map();
    this.relatedWordsMap = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentWordId = 1;
    this.currentProgressId = 1;
    this.currentRelatedWordId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create default categories
    const basicCategory = this.createCategory({
      name: "Temel (A1)",
      description: "Temel seviye Osmanlıca kelimeler",
      level: "basic"
    });
    
    const intermediateCategory = this.createCategory({
      name: "Orta (A2-B1)",
      description: "Orta seviye Osmanlıca kelimeler",
      level: "intermediate"
    });
    
    const advancedCategory = this.createCategory({
      name: "İleri (B2-C1)",
      description: "İleri seviye Osmanlıca kelimeler",
      level: "advanced"
    });
    
    const idiomsCategory = this.createCategory({
      name: "Deyimler",
      description: "Osmanlıca deyimler",
      level: "idioms"
    });
    
    const dailyCategory = this.createCategory({
      name: "Günlük Konuşma",
      description: "Günlük konuşmada kullanılan Osmanlıca kelimeler",
      level: "daily"
    });
    
    // Create sample words
    const word1 = this.createWord({
      ottoman: "كتاب",
      turkish: "kitap",
      meaning: "Basılı veya yazılı sayfalardan oluşan ciltli eser.",
      exampleOttoman: "كتابى اوقويورم",
      exampleTurkish: "Kitabı okuyorum.",
      categoryId: basicCategory.id,
      difficulty: "basic",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    const word2 = this.createWord({
      ottoman: "قلم",
      turkish: "kalem",
      meaning: "Yazı yazmaya yarayan araç.",
      exampleOttoman: "قلم ايله يازيورم",
      exampleTurkish: "Kalem ile yazıyorum.",
      categoryId: basicCategory.id,
      difficulty: "basic",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    const word3 = this.createWord({
      ottoman: "مكتب",
      turkish: "mektep",
      meaning: "Okul, öğretim kurumu.",
      exampleOttoman: "مكتبه كيديورم",
      exampleTurkish: "Mektebe gidiyorum.",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    const word4 = this.createWord({
      ottoman: "تشرين اول",
      turkish: "teşrinievvel",
      meaning: "Ekim ayı (Rumi takvimde).",
      exampleOttoman: "تشرين اول آيندا",
      exampleTurkish: "Teşrinievvel ayında.",
      categoryId: advancedCategory.id,
      difficulty: "advanced",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    const word5 = this.createWord({
      ottoman: "سو",
      turkish: "su",
      meaning: "İçilebilen sıvı madde, hayat kaynağı.",
      exampleOttoman: "صو ايچيورم",
      exampleTurkish: "Su içiyorum.",
      categoryId: basicCategory.id,
      difficulty: "basic",
      etymology: "Türkçe kökenli",
      audioUrl: ""
    });
    
    const word6 = this.createWord({
      ottoman: "طعام",
      turkish: "taam",
      meaning: "Yemek, aş, yiyecek.",
      exampleOttoman: "طعام يييورم",
      exampleTurkish: "Taam yiyorum.",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    const word7 = this.createWord({
      ottoman: "ساعت",
      turkish: "saat",
      meaning: "Zaman ölçme aracı, 60 dakikadan oluşan zaman birimi.",
      exampleOttoman: "ساعت قاچ؟",
      exampleTurkish: "Saat kaç?",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli kelime. ساعة (sāʿat) kelimesinden Osmanlı Türkçesine geçmiştir.",
      audioUrl: ""
    });
    
    // Kelimeler.txt dosyasından eklenen yeni kelimeler
    this.createWord({
      ottoman: "عزيمت",
      turkish: "azimet",
      meaning: "Gitmek",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "قيام",
      turkish: "kıyam",
      meaning: "Başlamak, harekete geçmek",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "بارو",
      turkish: "bârü",
      meaning: "Duvar, burç",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Farsça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "تقرب",
      turkish: "tekarrüb",
      meaning: "Yaklaşmak",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "مجال",
      turkish: "mecâl",
      meaning: "İmkânı olmamak",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "متانت",
      turkish: "metânet",
      meaning: "Sertlik, dayanıklılık",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "مأيوس",
      turkish: "me'yüs",
      meaning: "Üzgün, ümitsiz",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "نزول",
      turkish: "nüzül",
      meaning: "İnmek",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "جمله",
      turkish: "cümle",
      meaning: "Bütün, tamamı",
      categoryId: basicCategory.id,
      difficulty: "basic",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "امرا",
      turkish: "ümerâ",
      meaning: "Emirler, sancakbeyleri",
      categoryId: advancedCategory.id,
      difficulty: "advanced",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "مير مران",
      turkish: "mir-i mirân",
      meaning: "Beylerbeyi",
      categoryId: advancedCategory.id,
      difficulty: "advanced",
      etymology: "Farsça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "كبار",
      turkish: "kibâr",
      meaning: "Büyükler, önde gelenler",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "مختار",
      turkish: "muhtâr",
      meaning: "Seçilmiş, seçkin",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "اختيار",
      turkish: "ihtiyâr",
      meaning: "Kıdemli",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "مشاوره",
      turkish: "müşâvere",
      meaning: "Danışmak",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "جمع",
      turkish: "cem'",
      meaning: "Toplanmak",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "كمال مرتبه",
      turkish: "kemâl mertebe",
      meaning: "Aşırı derecede",
      categoryId: advancedCategory.id,
      difficulty: "advanced",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    this.createWord({
      ottoman: "صعوبت",
      turkish: "suübet",
      meaning: "Zorluk",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    });
    
    // Add related words
    this.addRelatedWord(word7.id, this.createWord({
      ottoman: "دقيقه",
      turkish: "dakika",
      meaning: "60 saniyeden oluşan zaman birimi.",
      exampleOttoman: "بر دقيقه بكله",
      exampleTurkish: "Bir dakika bekle.",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    }).id);
    
    this.addRelatedWord(word7.id, this.createWord({
      ottoman: "وقت",
      turkish: "vakit",
      meaning: "Zaman, çağ.",
      exampleOttoman: "وقت كلدي",
      exampleTurkish: "Vakit geldi.",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    }).id);
    
    this.addRelatedWord(word7.id, this.createWord({
      ottoman: "زمان",
      turkish: "zaman",
      meaning: "Süre, vakit.",
      exampleOttoman: "او زماندا",
      exampleTurkish: "O zamanda.",
      categoryId: intermediateCategory.id,
      difficulty: "intermediate",
      etymology: "Arapça kökenli",
      audioUrl: ""
    }).id);

    // Create a default user
    this.createUser({
      username: "demo",
      password: "password123"
    });
    
    // Add additional words from kelimeler.txt
    this.addAdditionalWords(basicCategory.id);
  }
  
  private addAdditionalWords(categoryId: number) {
    try {
      // Mevcut kelimeleri kontrol et
      const existingWords = Array.from(this.wordsMap.values());
      console.log(`Mevcut kelime sayısı: ${existingWords.length}`);
    
      // Kelimeleri gruplar halinde ekliyoruz, son eklediğimiz 19 kelimeye ek olarak 50 kelime daha
      
      // İlk grup - önceki eklenen kelimeler
      const group1Words = [
        { ottoman: "[Osmanlıca] توقف", turkish: "tevakkuf", meaning: "Durmak" },
        { ottoman: "[Osmanlıca] عواز", turkish: "avâz etmek", meaning: "Seslenmek" },
        { ottoman: "[Osmanlıca] سحر", turkish: "seher vakti", meaning: "Tan yeri ağarmadan önce" },
        { ottoman: "[Osmanlıca] محصور", turkish: "mahsür", meaning: "Kuşatılmış" },
        { ottoman: "[Osmanlıca] روزی", turkish: "rüzi", meaning: "Nasip, kısmet" },
        { ottoman: "[Osmanlıca] گرفتار", turkish: "giriftâr", meaning: "Girmek, düşmek" },
        { ottoman: "[Osmanlıca] آزاد", turkish: "azâd etmek", meaning: "Serbest bırakmak" },
        { ottoman: "[Osmanlıca] شکران", turkish: "şükrân", meaning: "Teşekkür etmek" },
        { ottoman: "[Osmanlıca] بکا", turkish: "bükâ", meaning: "Ağlamak" },
        { ottoman: "[Osmanlıca] ضایع", turkish: "zâyi' olmak", meaning: "Yok olmak, kaybolmak" },
        { ottoman: "[Osmanlıca] چورباجی", turkish: "çorbacı", meaning: "Yeniçeri ocağı zabiti" },
        { ottoman: "[Osmanlıca] میری", turkish: "miri", meaning: "Devlete ait (hatta devlet)" },
        { ottoman: "[Osmanlıca] یساقچی", turkish: "yasakçı", meaning: "Bekçi, gözetleyici" },
        { ottoman: "[Osmanlıca] سکر", turkish: "sükker", meaning: "Şeker" },
        { ottoman: "[Osmanlıca] مربع", turkish: "murabba'", meaning: "Kare şeklinde" },
        { ottoman: "[Osmanlıca] تفصیل", turkish: "tafsil", meaning: "Ayrıntılı anlatma" },
        { ottoman: "[Osmanlıca] آستانه", turkish: "asitâne", meaning: "İstanbul" },
        { ottoman: "[Osmanlıca] مقید", turkish: "mukayyed olmak", meaning: "İlgilenmek" },
        { ottoman: "[Osmanlıca] پیدا", turkish: "peydâ etmek", meaning: "Elde etmek" }
      ];
      
      // İkinci grup - önceki eklenen 50 kelime (kelimeler.txt'den alınmıştır)
      const group2Words = [
        { ottoman: "[Osmanlıca] حالیا", turkish: "hâliyâ", meaning: "Hâlen, şu anda" },
        { ottoman: "[Osmanlıca] متقاعد", turkish: "mütekâid", meaning: "Emekli" },
        { ottoman: "[Osmanlıca] معا", turkish: "maan", meaning: "Beraberce" },
        { ottoman: "[Osmanlıca] قوشمق", turkish: "koşmak", meaning: "Refekatçi kılmak, katmak" },
        { ottoman: "[Osmanlıca] تشریف", turkish: "teşrif", meaning: "Şereflendirme, gelme" },
        { ottoman: "[Osmanlıca] دار السعاده", turkish: "dârüssaâde", meaning: "Harem" },
        { ottoman: "[Osmanlıca] ملاقی", turkish: "mülâki olmak", meaning: "Karşılaşmak, bir araya gelmek" },
        { ottoman: "[Osmanlıca] تلخیص", turkish: "telhis", meaning: "Özet belge" },
        { ottoman: "[Osmanlıca] لسانا", turkish: "lisânen", meaning: "Sözlü olarak" },
        { ottoman: "[Osmanlıca] آنده", turkish: "anda", meaning: "Orada" },
        { ottoman: "[Osmanlıca] خلعت", turkish: "hil'at", meaning: "Elbise" },
        { ottoman: "[Osmanlıca] فاخره", turkish: "fâhire", meaning: "Değerli, gurur verici" },
        { ottoman: "[Osmanlıca] اعطا", turkish: "i'tâ", meaning: "Hediye etmek" },
        { ottoman: "[Osmanlıca] پیاده", turkish: "piyade", meaning: "Yaya asker" },
        { ottoman: "[Osmanlıca] مقابلجی", turkish: "mukâbeleci", meaning: "Kapıkulu maaş ve künye işlemlerini yapan büro" },
        { ottoman: "[Osmanlıca] سواری", turkish: "süvâri", meaning: "Atlı asker" },
        { ottoman: "[Osmanlıca] مرادات", turkish: "murâdât", meaning: "İstekler, talepler" },
        { ottoman: "[Osmanlıca] حاجت", turkish: "hâcet", meaning: "Dilek, istek" },
        { ottoman: "[Osmanlıca] منصب", turkish: "mansıb", meaning: "Görev, kadro" },
        { ottoman: "[Osmanlıca] معزول", turkish: "ma'zül", meaning: "Görevden alınmış" },
        { ottoman: "[Osmanlıca] اجمالا", turkish: "icmâlen", meaning: "Topluca, genel olarak" },
        { ottoman: "[Osmanlıca] واقع", turkish: "vâki' olmak", meaning: "Meydana gelmek" },
        { ottoman: "[Osmanlıca] سرگذشت", turkish: "sergüzeşt", meaning: "Başından geçen" },
        { ottoman: "[Osmanlıca] اکثار", turkish: "iksâr olunmak", meaning: "Tafsilata girmek" },
        { ottoman: "[Osmanlıca] ثالث", turkish: "sâlis", meaning: "Üçüncü" },
        { ottoman: "[Osmanlıca] ایچ", turkish: "iç", meaning: "İç kısım" },
        { ottoman: "[Osmanlıca] خزینه", turkish: "hazîne", meaning: "Hazine" },
        { ottoman: "[Osmanlıca] کلیتلو", turkish: "külliyyetlü", meaning: "Çok, fazla" },
        { ottoman: "[Osmanlıca] مبالغ", turkish: "mebâliğ", meaning: "Meblağlar, miktarlar" },
        { ottoman: "[Osmanlıca] جمع", turkish: "cem'", meaning: "Toplama, biriktirme" },
        { ottoman: "[Osmanlıca] ادخار", turkish: "iddihâr", meaning: "Depolama, biriktirme" },
        { ottoman: "[Osmanlıca] واقع", turkish: "vâkı'", meaning: "Meydana gelen" },
        { ottoman: "[Osmanlıca] نمچه", turkish: "nemçe", meaning: "Avusturya" },
        { ottoman: "[Osmanlıca] گونه", turkish: "gûne", meaning: "Türlü, çeşit" },
        { ottoman: "[Osmanlıca] مضایقه", turkish: "muzâyaka", meaning: "Darlık, sıkıntı, buhran" },
        { ottoman: "[Osmanlıca] حادث", turkish: "hâdis olmak", meaning: "İlk defa meydana gelmek" },
        { ottoman: "[Osmanlıca] مثللو", turkish: "misillü", meaning: "Gibi, benzer" },
        { ottoman: "[Osmanlıca] اول", turkish: "evvel", meaning: "Birinci, ilk" },
        { ottoman: "[Osmanlıca] کاملا", turkish: "kâmilen", meaning: "Tamamıyla, bütünüyle" },
        { ottoman: "[Osmanlıca] مرور", turkish: "mürûr etmek", meaning: "Geçmek" },
        { ottoman: "[Osmanlıca] مصارف", turkish: "mesârif", meaning: "Masraflar, harcamalar" },
        { ottoman: "[Osmanlıca] لازمه", turkish: "lâzime", meaning: "Gerekli olan" },
        { ottoman: "[Osmanlıca] تسویه", turkish: "tesviye olunmak", meaning: "Düzeltmek, karşılanmak" },
        { ottoman: "[Osmanlıca] شهریار", turkish: "şehriyâr", meaning: "Hükümdar, padişah" },
        { ottoman: "[Osmanlıca] مشار", turkish: "müşâr", meaning: "İşaret olunan" },
        { ottoman: "[Osmanlıca] نامی", turkish: "nâmî", meaning: "Namlı, ünlü" },
        { ottoman: "[Osmanlıca] منسوب", turkish: "mensûb", meaning: "Nispet edilen, ait" },
        { ottoman: "[Osmanlıca] معا", turkish: "maa", meaning: "Beraber" },
        { ottoman: "[Osmanlıca] تتمات", turkish: "tetimmât", meaning: "Tetimmeler, müştemilat" },
        { ottoman: "[Osmanlıca] عدم", turkish: "adem", meaning: "Yokluk" }
      ];
      
      // Üçüncü grup - yeni eklenecek 50 kelime daha (kelimeler.txt'den alınmıştır)
      const group3Words = [
        { ottoman: "[Osmanlıca] کافی", turkish: "kâfî", meaning: "Yeterli" },
        { ottoman: "[Osmanlıca] گذران", turkish: "güzerân", meaning: "Geçmek" },
        { ottoman: "[Osmanlıca] رابع", turkish: "râbi'", meaning: "Dördüncü" },
        { ottoman: "[Osmanlıca] جالس", turkish: "câlis", meaning: "Cülus eden, oturan" },
        { ottoman: "[Osmanlıca] سریر", turkish: "serîr", meaning: "Taht, koltuk" },
        { ottoman: "[Osmanlıca] سلطنت", turkish: "saltanat", meaning: "Sultanlık, padişahlık" },
        { ottoman: "[Osmanlıca] جلوس", turkish: "cülûs", meaning: "Oturmak, tahta geçmek" },
        { ottoman: "[Osmanlıca] اعطا", turkish: "i'tâ", meaning: "Vermek" },
        { ottoman: "[Osmanlıca] والده", turkish: "vâlide", meaning: "Anne" },
        { ottoman: "[Osmanlıca] اشقیا", turkish: "eşkıyâ", meaning: "Şakiler, isyancılar" },
        { ottoman: "[Osmanlıca] تلطیف", turkish: "taltîf", meaning: "Ödüllendirme" },
        { ottoman: "[Osmanlıca] تأیید", turkish: "te'yîd", meaning: "Pekiştirme, sağlamlaştırma" },
        { ottoman: "[Osmanlıca] مطالعه", turkish: "mutâlaa", meaning: "Değerlendirme, inceleme" },
        { ottoman: "[Osmanlıca] خزائن", turkish: "hazâin", meaning: "Hazineler" },
        { ottoman: "[Osmanlıca] بغاة", turkish: "bugāt", meaning: "Bagiler, isyancılar" },
        { ottoman: "[Osmanlıca] ابذال", turkish: "ibzâl", meaning: "Bolca harcama" },
        { ottoman: "[Osmanlıca] اسراف", turkish: "isrâf", meaning: "Bolca harcama" },
        { ottoman: "[Osmanlıca] نقود", turkish: "nukūd", meaning: "Nakit paralar" },
        { ottoman: "[Osmanlıca] مدخره", turkish: "müddehara", meaning: "Biriktirilen" },
        { ottoman: "[Osmanlıca] تلف", turkish: "telef olma", meaning: "Yok olmak" },
        { ottoman: "[Osmanlıca] مبنی", turkish: "mebnî", meaning: "İçin, dolayı" },
        { ottoman: "[Osmanlıca] تجار", turkish: "tüccâr", meaning: "Tacirler, ticaret yapanlar" },
        { ottoman: "[Osmanlıca] متمولین", turkish: "mütemevvilîn", meaning: "Çok parası olanlar" },
        { ottoman: "[Osmanlıca] استدانه", turkish: "istidâne", meaning: "Borçlanma" },
        { ottoman: "[Osmanlıca] سلاطین", turkish: "selâtîn", meaning: "Sultanlar, padişahlar" },
        { ottoman: "[Osmanlıca] ماضیه", turkish: "mâzıye", meaning: "Geçen, önceki" },
        { ottoman: "[Osmanlıca] سیم", turkish: "sîm", meaning: "Gümüş" },
        { ottoman: "[Osmanlıca] زر", turkish: "zerr", meaning: "Altın" },
        { ottoman: "[Osmanlıca] مصنوع", turkish: "masnû'", meaning: "Yapılmış" },
        { ottoman: "[Osmanlıca] ادوات", turkish: "edevât", meaning: "Edat, alet, avadanlık" },
        { ottoman: "[Osmanlıca] ضرب", turkish: "darb", meaning: "Vurma, basma" },
        { ottoman: "[Osmanlıca] سکه", turkish: "sikke", meaning: "Paralara vurulan damga" },
        { ottoman: "[Osmanlıca] ایفا", turkish: "îfâ", meaning: "Yerine getirme" },
        { ottoman: "[Osmanlıca] انعام", turkish: "n'âm", meaning: "Bahşiş, hediye verme" },
        { ottoman: "[Osmanlıca] تقریبا", turkish: "takrîben", meaning: "Yaklaşık olarak" },
        { ottoman: "[Osmanlıca] اقچه", turkish: "akçe", meaning: "Gümüş para" },
        { ottoman: "[Osmanlıca] ریال", turkish: "riyâl", meaning: "Gümüş sikkesi" },
        { ottoman: "[Osmanlıca] نسبت", turkish: "nisbet", meaning: "Oran" },
        { ottoman: "[Osmanlıca] توضیح", turkish: "tavzîh", meaning: "İzah etme, açıklama" },
        { ottoman: "[Osmanlıca] غارتکار", turkish: "gāret-kâr", meaning: "Yağmacı" },
        { ottoman: "[Osmanlıca] واردات", turkish: "vâridât", meaning: "Gelirler" },
        { ottoman: "[Osmanlıca] تأدیب", turkish: "te'dîb", meaning: "Terbiye etme cezalandırma" },
        { ottoman: "[Osmanlıca] تنکیل", turkish: "tenkîl", meaning: "Uzaklaştırma, ceza verme" },
        { ottoman: "[Osmanlıca] امور", turkish: "umûr", meaning: "İşler" },
        { ottoman: "[Osmanlıca] کثیره", turkish: "kesîre", meaning: "Çok" },
        { ottoman: "[Osmanlıca] مالامال", turkish: "mâl-â-mâl", meaning: "Dopdolu" },
        { ottoman: "[Osmanlıca] کما ینبغی", turkish: "kemâ-yenbağî", meaning: "Gerektiği gibi" },
        { ottoman: "[Osmanlıca] نظام", turkish: "nizâm vermek", meaning: "Düzene, yoluna koymak" },
        { ottoman: "[Osmanlıca] مصارفات", turkish: "mesârifât", meaning: "Masraflar, harcamalar" },
        { ottoman: "[Osmanlıca] وظائف", turkish: "vezâif", meaning: "Vazifeler, ücretler" }
      ];
      
      // Tüm kelimeleri birleştir
      const allWords = [...group1Words, ...group2Words, ...group3Words];
      
      // Kelimeleri ekle
      let count = 0;
      for (const word of allWords) {
        // Kelimenin zaten var olup olmadığını kontrol et
        const exists = existingWords.some(
          existingWord => existingWord.turkish.toLowerCase() === word.turkish.toLowerCase()
        );
        
        // Eğer kelime mevcut değilse ekle
        if (!exists) {
          this.createWord({
            ottoman: word.ottoman,  // Ottoman karakterleri ile işaretlenmiş durumda, sonra değiştirilebilir
            turkish: word.turkish,
            meaning: word.meaning,
            categoryId: categoryId,
            difficulty: "basic",
            etymology: "Osmanlıca kökenli",
            audioUrl: ""
          });
          count++;
        }
      }
      
      console.log(`[addAdditionalWords] ${count} yeni kelime eklendi.`);
    } catch (error) {
      console.error("Kelime ekleme hatası:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      dailyStreak: 0,
      lastActivity: now
    };
    this.usersMap.set(id, user);
    return user;
  }

  async updateUserStreak(userId: number, streak: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { 
      ...user, 
      dailyStreak: streak 
    };
    this.usersMap.set(userId, updatedUser);
    return updatedUser;
  }

  async updateLastActivity(userId: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { 
      ...user, 
      lastActivity: new Date() 
    };
    this.usersMap.set(userId, updatedUser);
    return updatedUser;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categoriesMap.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categoriesMap.set(id, category);
    return category;
  }

  // Word operations
  async getAllWords(): Promise<Word[]> {
    return Array.from(this.wordsMap.values());
  }

  async getWordById(id: number): Promise<Word | undefined> {
    return this.wordsMap.get(id);
  }

  async getWordsByCategory(categoryId: number): Promise<Word[]> {
    return Array.from(this.wordsMap.values()).filter(
      (word) => word.categoryId === categoryId
    );
  }

  async searchWords(query: string): Promise<Word[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.wordsMap.values()).filter(
      (word) => 
        word.turkish.toLowerCase().includes(lowerQuery) ||
        word.ottoman.includes(lowerQuery) ||
        (word.meaning && word.meaning.toLowerCase().includes(lowerQuery))
    );
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const id = this.currentWordId++;
    const now = new Date();
    const word: Word = { 
      ...insertWord, 
      id, 
      createdAt: now 
    };
    this.wordsMap.set(id, word);
    return word;
  }

  async getRelatedWords(wordId: number): Promise<Word[]> {
    const relatedWordIds = Array.from(this.relatedWordsMap.values())
      .filter(relation => relation.wordId === wordId)
      .map(relation => relation.relatedWordId);
    
    return relatedWordIds.map(id => this.wordsMap.get(id)!).filter(Boolean);
  }

  async addRelatedWord(wordId: number, relatedWordId: number): Promise<void> {
    const id = this.currentRelatedWordId++;
    const relation: RelatedWord = {
      id,
      wordId,
      relatedWordId
    };
    this.relatedWordsMap.set(`${wordId}_${relatedWordId}`, relation);
  }

  async getDailyWord(): Promise<WordWithRelated | undefined> {
    const allWords = await this.getAllWords();
    if (allWords.length === 0) return undefined;
    
    // For simplicity, we'll return a fixed word as the daily word
    // In a real app, you would implement a rotation or random selection
    const dailyWordId = 7; // The 'saat' word
    const dailyWord = await this.getWordById(dailyWordId);
    if (!dailyWord) return undefined;
    
    const relatedWords = await this.getRelatedWords(dailyWordId);
    
    return {
      ...dailyWord,
      related: relatedWords
    };
  }

  // Progress operations
  async getUserProgress(userId: number, wordId: number): Promise<Progress | undefined> {
    return this.progressMap.get(`${userId}_${wordId}`);
  }

  async recordProgress(insertProgress: InsertProgress): Promise<Progress> {
    const id = this.currentProgressId++;
    const progress: Progress = { ...insertProgress, id };
    this.progressMap.set(`${insertProgress.userId}_${insertProgress.wordId}`, progress);
    return progress;
  }

  async updateProgress(id: number, correctCount: number, incorrectCount: number): Promise<Progress> {
    const progress = Array.from(this.progressMap.values()).find(p => p.id === id);
    if (!progress) {
      throw new Error("Progress not found");
    }
    
    const updatedProgress: Progress = {
      ...progress,
      correctCount,
      incorrectCount,
      lastPracticed: new Date(),
      isMastered: (correctCount / (correctCount + incorrectCount) >= 0.8) && (correctCount + incorrectCount >= 5)
    };
    
    this.progressMap.set(`${updatedProgress.userId}_${updatedProgress.wordId}`, updatedProgress);
    return updatedProgress;
  }

  async getUserStats(userId: number): Promise<UserStats> {
    // Get all user progress items
    const userProgressItems = Array.from(this.progressMap.values())
      .filter(progress => progress.userId === userId);
    
    const totalWords = (await this.getAllWords()).length;
    const learnedWords = userProgressItems.filter(progress => progress.isMastered).length;
    
    const totalCorrect = userProgressItems.reduce((sum, progress) => sum + progress.correctCount, 0);
    const totalIncorrect = userProgressItems.reduce((sum, progress) => sum + progress.incorrectCount, 0);
    const accuracy = totalCorrect + totalIncorrect > 0 
      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) 
      : 0;
    
    // Get the user to get the streak
    const user = await this.getUser(userId);
    const streak = user?.dailyStreak || 0;
    
    // Mock the week activity for demo
    const weekActivity = [true, true, true, true, true, false, false];
    
    return {
      learnedWords,
      totalWords,
      accuracy,
      streak,
      weekActivity
    };
  }

  async getWordsWithProgress(userId: number): Promise<WordWithProgress[]> {
    const words = await this.getAllWords();
    const wordsWithProgress: WordWithProgress[] = [];
    
    for (const word of words) {
      const progress = await this.getUserProgress(userId, word.id);
      wordsWithProgress.push({
        ...word,
        progress
      });
    }
    
    return wordsWithProgress;
  }
  
  async getSuggestedWords(userId: number, count: number = 5): Promise<WordWithProgress[]> {
    // Tüm kelimeleri ilerleme bilgisiyle birlikte al
    const wordsWithProgress = await this.getWordsWithProgress(userId);
    
    // 1. Hiç çalışılmamış kelimeleri bul
    const notStudiedWords = wordsWithProgress.filter(word => !word.progress);
    
    // 2. Çalışılmış ama henüz uzmanlaşılmamış kelimeleri bul
    const inProgressWords = wordsWithProgress.filter(word => 
      word.progress && !word.progress.isMastered
    );
    
    // 3. Uzmanlaşılmış ama tekrar edilmesi gereken kelimeleri bul
    // Son çalışmadan bu yana 7 günden fazla zaman geçmiş olanlar
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const reviewWords = wordsWithProgress.filter(word => 
      word.progress && 
      word.progress.isMastered && 
      word.progress.lastPracticed && 
      new Date(word.progress.lastPracticed) < lastWeek
    );
    
    // Sonuçları birleştir ve önceliklendir:
    // 1. Yeni çalışılmamış kelimeler
    // 2. Çalışılmış ama uzmanlaşılmamış kelimeler
    // 3. Tekrar edilmesi gereken kelimeler
    let candidateWords = [
      ...notStudiedWords,
      ...inProgressWords,
      ...reviewWords
    ];
    
    // Eğer yeterli kelime yoksa, rastgele kelimeler ekle
    if (candidateWords.length < count) {
      const remainingWords = wordsWithProgress.filter(
        word => !candidateWords.some(w => w.id === word.id)
      );
      
      // Kalan kelimelerden rastgele ekle
      while (candidateWords.length < count && remainingWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingWords.length);
        candidateWords.push(remainingWords[randomIndex]);
        remainingWords.splice(randomIndex, 1);
      }
    }
    
    // Önerilen kelime sayısını sınırla ve karıştır
    // Önce karıştır
    candidateWords = this.shuffleArray(candidateWords);
    // Sonra sınırla
    return candidateWords.slice(0, count);
  }
  
  // Yardımcı fonksiyon: Dizi elemanlarını karıştır (Fisher-Yates algoritması)
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

export const storage = new MemStorage();
