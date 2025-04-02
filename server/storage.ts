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
    // Kelimeler.txt dosyasındaki kelimeleri ekle
    // Kelime-anlam çiftleri şeklinde yapılandırılmış
    const additionalWords = [
      { ottoman: "Azimet", turkish: "Gitmek", meaning: "Gitmek eylemi" },
      { ottoman: "Kıyam", turkish: "Başlamak", meaning: "Başlamak, harekete geçmek" },
      { ottoman: "Bârü", turkish: "Duvar", meaning: "Duvar, burç" },
      { ottoman: "Tekarrüb", turkish: "Yaklaşmak", meaning: "Yaklaşmak eylemi" },
      { ottoman: "Mecâl", turkish: "İmkan", meaning: "İmkânı olmamak" },
      { ottoman: "Metânet", turkish: "Sertlik", meaning: "Sertlik, dayanıklılık" },
      { ottoman: "Me'yüs", turkish: "Üzgün", meaning: "Üzgün, ümitsiz" },
      { ottoman: "Nüzül", turkish: "İnmek", meaning: "İnmek eylemi" },
      { ottoman: "Cümle", turkish: "Bütün", meaning: "Bütün, tamamı" },
      { ottoman: "Ümerâ", turkish: "Emirler", meaning: "Emirler, sancakbeyleri" },
      { ottoman: "Mir-i mirân", turkish: "Beylerbeyi", meaning: "Beylerbeyi unvanı" },
      { ottoman: "Kibâr", turkish: "Büyükler", meaning: "Büyükler, önde gelenler" },
      { ottoman: "Muhtâr", turkish: "Seçilmiş", meaning: "Seçilmiş, seçkin" },
      { ottoman: "İhtiyâr", turkish: "Kıdemli", meaning: "Kıdemli, yaşlı" },
      { ottoman: "Müşâvere", turkish: "Danışmak", meaning: "Danışmak eylemi" },
      { ottoman: "Cem'", turkish: "Toplanmak", meaning: "Toplanmak eylemi" },
      { ottoman: "Kemâl", turkish: "Tam", meaning: "Tam, bütün, eksiksiz" },
      { ottoman: "Suübet", turkish: "Zorluk", meaning: "Zorluk, meşakkat" },
      { ottoman: "Mukarrer", turkish: "Açık", meaning: "Açık, ortada olmak" },
      { ottoman: "Tahrib", turkish: "Zarar", meaning: "Zarar vermek" },
      { ottoman: "Bilâd", turkish: "Beldeler", meaning: "Beldeler, şehirler" },
      { ottoman: "Ta'zib", turkish: "Acı", meaning: "Acı çektirmek" },
      { ottoman: "Küffâr", turkish: "Kafirler", meaning: "Kâfirler, düşmanlar" },
      { ottoman: "Bed-nihâd", turkish: "Kötü", meaning: "Kötü huylu" },
      { ottoman: "Teveccüh", turkish: "Yönelmek", meaning: "Yönelmek eylemi" },
      { ottoman: "Kasabât", turkish: "Kasabalar", meaning: "Kasabalar, küçük şehirler" },
      { ottoman: "Kurâ", turkish: "Köyler", meaning: "Karyeler, köyler" },
      { ottoman: "Bikâ'", turkish: "Yerler", meaning: "Buk'alar, yerler, ülkeler" },
      { ottoman: "Zıyâ'", turkish: "Tarlalar", meaning: "Zay'alar, tarlalar" },
      { ottoman: "Gâret", turkish: "Yağma", meaning: "Yağma, talan" },
      { ottoman: "Hasâret", turkish: "Hasar", meaning: "Hasar verme eylemi" },
      { ottoman: "Galebe", turkish: "Üstünlük", meaning: "Üstünlük, zafer" },
      { ottoman: "Nusret", turkish: "Yardım", meaning: "İlahi yardım" },
      { ottoman: "A'dâ", turkish: "Düşmanlar", meaning: "Düşmanlar, hasımlar" },
      { ottoman: "Müris", turkish: "Getiren", meaning: "Getiren, neden olan" },
      { ottoman: "İllâ", turkish: "Ancak", meaning: "Ancak, ... hariç" },
      { ottoman: "Re'y", turkish: "Görüş", meaning: "Görüş, kanaat" },
      { ottoman: "Kabza", turkish: "El", meaning: "El, hakimiyet" },
      { ottoman: "Tasarruf", turkish: "Kullanma", meaning: "Kullanma, sahip olma" },
      { ottoman: "Aid", turkish: "Dönen", meaning: "Dönen, kalan" },
      { ottoman: "Mümânaat", turkish: "Engelleme", meaning: "Engelleme eylemi" },
      { ottoman: "Menzil", turkish: "Konak", meaning: "Konak, durak" },
      { ottoman: "Abd-i Fakir", turkish: "Aciz", meaning: "Aciz kul, yazarın kendisi" },
      { ottoman: "Kalile", turkish: "Az", meaning: "Az, küçük" },
      { ottoman: "İrkilmek", turkish: "Toplanmak", meaning: "Toplanmak eylemi" },
      { ottoman: "Meremmet", turkish: "Tamir", meaning: "Tamir, onarım" },
      { ottoman: "Ba'id", turkish: "Uzak", meaning: "Uzak, ırak" },
      { ottoman: "Ratıb", turkish: "Yumuşak", meaning: "Yumuşak, nemli" },
      { ottoman: "Yâbis", turkish: "Kuru", meaning: "Kuru, sert" },
      { ottoman: "Câri", turkish: "Akmak", meaning: "Akmak, yürürlükte olmak" },
      { ottoman: "Halk", turkish: "Yaratmak", meaning: "Yaratmak eylemi" },
      { ottoman: "Aklâm", turkish: "Kalemler", meaning: "Kalemler, yazı aletleri" },
      { ottoman: "Kâbil", turkish: "Mümkün", meaning: "Mümkün, olabilir" }
    ];
    
    // Her ek kelime için
    for (const word of additionalWords) {
      this.createWord({
        ottoman: word.ottoman,
        turkish: word.turkish,
        meaning: word.meaning,
        categoryId: categoryId,
        difficulty: "basic",
        etymology: "Osmanlıca kelime",
        audioUrl: ""
      });
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
}

export const storage = new MemStorage();
