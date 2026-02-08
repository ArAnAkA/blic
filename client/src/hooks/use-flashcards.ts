import { useMemo } from "react";
import { allCards, lessons, getDeckCards, getCardByGlobalIndex, generateQuiz } from "../lib/data";

export function useLessons() {
  return lessons;
}

export function useAllCards() {
  return allCards;
}

export function useDeck(lessonId: number | null) {
  return useMemo(() => {
    if (!lessonId) return allCards;
    return getDeckCards(lessonId);
  }, [lessonId]);
}

export function useQuiz(lessonId: number) {
  return useMemo(() => generateQuiz(lessonId), [lessonId]);
}
