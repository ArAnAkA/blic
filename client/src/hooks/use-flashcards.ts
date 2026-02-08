import { useMemo } from "react";
import { allCards, lessons, getDeckCards, getCardByGlobalIndex, generateQuiz, proverbs } from "../lib/data";

export function useLessons() {
  return lessons;
}

export function useAllCards() {
  return allCards;
}

export function useProverbs() {
  return proverbs;
}

export function useDeck(lessonId: number | null) {
  return useMemo(() => {
    if (lessonId === null) return allCards;
    return getDeckCards(lessonId);
  }, [lessonId]);
}

export function useQuiz(lessonIdOrProverbs: number | "proverbs") {
  return useMemo(() => generateQuiz(lessonIdOrProverbs), [lessonIdOrProverbs]);
}
