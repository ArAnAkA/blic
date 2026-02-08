import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Shell } from "@/components/layout/shell";
import { Flashcard3D } from "@/components/ui/card-3d";
import { useDeck, useProverbs } from "@/hooks/use-flashcards";
import { ChevronLeft, ChevronRight, CornerUpLeft, Search, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CardPlayerPage() {
  const params = useParams<{ id?: string }>();
  const [pathname] = useLocation();
  const [_, setLocation] = useLocation();
  
  const isProverbs = pathname === "/proverbs";
  const lessonId = params.id ? parseInt(params.id) : null;
  const isGlobal = !lessonId && !isProverbs;

  const vocabularyDeck = useDeck(lessonId);
  const proverbs = useProverbs();
  
  const deck = isProverbs ? proverbs : vocabularyDeck;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [jumpInput, setJumpInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const currentCard = deck[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case "ArrowRight":
        case " ": // Space also advances
          nextCard();
          break;
        case "ArrowLeft":
          prevCard();
          break;
        case "ArrowUp":
        case "ArrowDown":
          setIsFlipped(prev => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, deck.length]);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }, 200); // Small delay to start flip back
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
    }, 200);
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const targetVal = parseInt(jumpInput);

    if (isNaN(targetVal)) {
      setError("Введите число");
      return;
    }

    if (isProverbs) {
      if (targetVal >= 1 && targetVal <= deck.length) {
        setIsFlipped(false);
        setCurrentIndex(targetVal - 1);
        setJumpInput("");
      } else {
        setError(`Введите число от 1 до ${deck.length}`);
      }
      return;
    }

    if (isGlobal) {
      const index = deck.findIndex(c => c.globalIndex === targetVal);
      if (index !== -1) {
        setIsFlipped(false);
        setCurrentIndex(index);
        setJumpInput("");
      } else {
        setError("Карточка не найдена.");
      }
    } else {
      const index = deck.findIndex(c => c.globalIndex === targetVal);
      if (index !== -1) {
        setIsFlipped(false);
        setCurrentIndex(index);
        setJumpInput("");
      } else {
        setError(`Карточка #${targetVal} не входит в Занятие ${lessonId}.`);
      }
    }
  };

  if (!currentCard) return <div>Загрузка...</div>;

  const title = isProverbs ? "Латинские изречения" : (isGlobal ? "Все карточки" : `Занятие ${lessonId}`);

  return (
    <Shell>
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 py-4">
        
        {/* Navigation & Title */}
        <div className="w-full flex items-center justify-between">
          <button 
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <CornerUpLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Назад к занятиям</span>
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-display font-bold text-primary flex items-center justify-center gap-2">
              {isProverbs && <Quote className="w-4 h-4" />}
              {title}
            </h2>
            <p className="text-sm text-muted-foreground tabular-nums">
              {currentIndex + 1} / {deck.length} 
              {!isProverbs && (
                <>
                  <span className="opacity-50 mx-1">|</span> Глобальный индекс #{currentCard.globalIndex}
                </>
              )}
            </p>
          </div>

          <div className="w-[100px]" /> {/* Spacer for balance */}
        </div>

        {/* Card Interaction Area */}
        <div className="w-full relative flex items-center justify-center gap-4 sm:gap-8">
          <button 
            onClick={prevCard}
            className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white border border-border shadow-sm hover:bg-secondary text-primary transition-all hover:-translate-x-1"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={isProverbs ? currentIndex : currentCard.globalIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
              >
                <Flashcard3D 
                  card={currentCard} 
                  isFlipped={isFlipped} 
                  onFlip={() => setIsFlipped(!isFlipped)} 
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <button 
            onClick={nextCard}
            className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white border border-border shadow-sm hover:bg-secondary text-primary transition-all hover:translate-x-1"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Nav Controls */}
        <div className="flex sm:hidden w-full items-center justify-between px-4 gap-4">
          <button 
            onClick={prevCard}
            className="flex-1 py-3 rounded-xl bg-secondary font-medium text-secondary-foreground"
          >
            Назад
          </button>
          <button 
            onClick={nextCard}
            className="flex-1 py-3 rounded-xl bg-primary font-medium text-primary-foreground"
          >
            Далее
          </button>
        </div>

        {/* Jump To Control */}
        <div className="w-full max-w-xs mt-8">
          <form onSubmit={handleJump} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="number"
                placeholder={isProverbs ? `Перейти к изречению (1-${deck.length})` : "Перейти к номеру карточки"}
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                className="w-full pl-10 pr-12 py-2 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={!jumpInput}
                className="absolute right-1 top-1 text-xs bg-primary text-white px-2 py-1.5 rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                Перейти
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-500 mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </form>
        </div>
        
      </div>
    </Shell>
  );
}
