import rawData from "@assets/flashcards_ru_la_by_lesson_plus_proverbs_1770565052990.json";

export interface Flashcard {
  ru: string;
  la: string;
  lesson?: number;
  globalIndex?: number;
  isProverb?: boolean;
}

export interface Deck {
  id: number;
  title: string;
  count: number;
  globalStart: number;
  globalEnd: number;
}

// Process raw data once
const processData = () => {
  const cards: Flashcard[] = [];
  const decks: Deck[] = [];
  const proverbs: Flashcard[] = [];
  
  let globalCounter = 1;

  // @ts-ignore
  if (rawData.proverbs) {
    // @ts-ignore
    rawData.proverbs.forEach((item: any) => {
      proverbs.push({
        ru: item.ru,
        la: item.la,
        isProverb: true
      });
    });
  }

  // Iterate through keys "Занятие 1" ... "Занятие 13"
  const sortedKeys = Object.keys(rawData).filter(k => k.startsWith('Занятие')).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    return numA - numB;
  });

  sortedKeys.forEach((key) => {
    const lessonNum = parseInt(key.replace(/\D/g, ''));
    // @ts-ignore
    const lessonData = rawData[key];
    
    if (lessonData && lessonData["Лексика"] && Array.isArray(lessonData["Лексика"])) {
      const lessonCards: any[] = lessonData["Лексика"];
      const start = globalCounter;
      
      lessonCards.forEach((item) => {
        if (item.ru && item.la) {
          cards.push({
            ru: item.ru,
            la: item.la,
            lesson: lessonNum,
            globalIndex: globalCounter
          });
          globalCounter++;
        }
      });
      
      const end = globalCounter - 1;
      
      if (end >= start) {
        decks.push({
          id: lessonNum,
          title: key,
          count: end - start + 1,
          globalStart: start,
          globalEnd: end
        });
      }
    }
  });

  return { cards, decks, proverbs };
};

export const { cards: allCards, decks: lessons, proverbs } = processData();

// Helper functions
export function getDeckCards(lessonId: number): Flashcard[] {
  return allCards.filter(c => c.lesson === lessonId);
}

export function getCardByGlobalIndex(index: number): Flashcard | undefined {
  return allCards.find(c => c.globalIndex === index);
}

// Quiz Helpers
export interface QuizQuestion {
  card: Flashcard;
  options: string[]; // 1 correct + 3 wrong (latin)
  correctOptionIndex: number;
}

export function generateQuiz(lessonIdOrProverbs: number | "proverbs", questionCount = 30): QuizQuestion[] {
  let deckCards: Flashcard[];
  let pool: Flashcard[];

  if (lessonIdOrProverbs === "proverbs") {
    deckCards = proverbs;
    pool = proverbs;
  } else {
    deckCards = getDeckCards(lessonIdOrProverbs);
    pool = deckCards.length > 10 ? deckCards : allCards;
  }

  if (deckCards.length === 0) return [];

  const shuffledDeck = [...deckCards].sort(() => Math.random() - 0.5);
  const selectedCards = shuffledDeck.slice(0, Math.min(questionCount, deckCards.length));

  return selectedCards.map(card => {
    const distractors = pool
      .filter(c => c.la !== card.la)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.la);

    const options = [...distractors, card.la].sort(() => Math.random() - 0.5);
    const correctOptionIndex = options.indexOf(card.la);

    return {
      card,
      options,
      correctOptionIndex
    };
  });
}
