import rawData from "@assets/flashcards_ru_la_by_lesson_1770563640294.json";

export interface Flashcard {
  ru: string;
  la: string;
  lesson: number;
  globalIndex: number;
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
  
  let globalCounter = 1;

  // Iterate through keys "Занятие 1" ... "Занятие 13"
  // We sort keys to ensure order 1, 2, 3... not 1, 10, 11...
  const sortedKeys = Object.keys(rawData).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    return numA - numB;
  });

  sortedKeys.forEach((key) => {
    const lessonNum = parseInt(key.replace(/\D/g, ''));
    // @ts-ignore - rawData is typed as any from import
    const lessonData = rawData[key];
    
    // Only process "Лексика" section
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

  return { cards, decks };
};

export const { cards: allCards, decks: lessons } = processData();

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

export function generateQuiz(lessonId: number, questionCount = 30): QuizQuestion[] {
  const deckCards = getDeckCards(lessonId);
  if (deckCards.length === 0) return [];

  // Shuffle deck cards
  const shuffledDeck = [...deckCards].sort(() => Math.random() - 0.5);
  const selectedCards = shuffledDeck.slice(0, Math.min(questionCount, deckCards.length));

  return selectedCards.map(card => {
    // Generate distractors from the SAME lesson to keep difficulty consistent
    // If not enough cards in lesson, fallback to all cards
    const pool = deckCards.length > 10 ? deckCards : allCards;
    
    const distractors = pool
      .filter(c => c.globalIndex !== card.globalIndex)
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
