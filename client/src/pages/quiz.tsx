import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Shell } from "@/components/layout/shell";
import { useQuiz } from "@/hooks/use-flashcards";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RefreshCcw, Home, ArrowRight, Quote } from "lucide-react";

export default function QuizPage() {
  const params = useParams<{ id: string }>();
  const quizId = params.id === "proverbs" ? "proverbs" : parseInt(params.id);
  
  // Force remount when quizId changes to generate new quiz
  return <QuizGame key={quizId.toString()} quizId={quizId} />;
}

function QuizGame({ quizId }: { quizId: number | "proverbs" }) {
  const questions = useQuiz(quizId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Reset state if questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  }, [questions]);

  const currentQ = questions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);

    const isCorrect = index === currentQ.correctOptionIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      // Small confetti for correct answer
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399']
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      // Big confetti for finish
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  if (!questions.length) return <div className="p-8 text-center">Loading quiz...</div>;

  const isProverbs = quizId === "proverbs";

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "Good effort!";
    if (percentage >= 90) message = "Outstanding!";
    else if (percentage >= 70) message = "Well done!";

    return (
      <Shell>
        <div className="max-w-xl mx-auto py-12 px-4 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-3xl p-8 shadow-xl border border-border"
          >
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-4xl font-display font-bold text-primary mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground text-lg mb-8">{message}</p>
            
            <div className="flex items-end justify-center gap-2 mb-8">
              <span className="text-6xl font-bold text-primary tabular-nums">{score}</span>
              <span className="text-xl text-muted-foreground pb-2 font-medium">/ {questions.length}</span>
            </div>

            <div className="grid gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all"
              >
                <RefreshCcw className="w-5 h-5" />
                Retry Quiz
              </button>
              <Link href={isProverbs ? "/proverbs" : `/lesson/${quizId}`}>
                <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all">
                  Back to {isProverbs ? "Proverbs" : "Lesson"}
                </button>
              </Link>
              <Link href="/">
                <button className="w-full flex items-center justify-center gap-2 py-3.5 text-muted-foreground hover:text-primary transition-all">
                  <Home className="w-5 h-5" />
                  Home
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-2xl mx-auto py-4 md:py-8 flex flex-col min-h-[600px]">
        
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {isProverbs ? "Proverb Quiz" : "Vocabulary Quiz"}
            </span>
            <span className="text-xl font-bold text-primary tabular-nums">
              {currentQuestionIndex + 1} <span className="text-muted-foreground/40">/ {questions.length}</span>
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Score</span>
            <span className="text-xl font-bold text-emerald-600 tabular-nums">
              {score}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full mb-8 overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border mb-8 text-center min-h-[200px] flex flex-col items-center justify-center relative overflow-hidden">
              {isProverbs && <Quote className="absolute -top-4 -left-4 w-24 h-24 text-primary/5 -rotate-12" />}
              <h3 className="text-2xl md:text-3xl font-display font-bold text-primary relative z-10 leading-relaxed">
                {currentQ.card.ru}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {currentQ.options.map((option, idx) => {
                let stateClass = "bg-white border-border hover:border-primary/50 hover:bg-secondary/20";
                let icon = null;

                if (selectedOption !== null) {
                  if (idx === currentQ.correctOptionIndex) {
                    stateClass = "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 text-emerald-800";
                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
                  } else if (idx === selectedOption) {
                    stateClass = "bg-rose-50 border-rose-500 text-rose-800";
                    icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                  } else {
                    stateClass = "opacity-50 grayscale";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleOptionClick(idx)}
                    className={cn(
                      "relative p-4 md:p-6 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between gap-3 group",
                      stateClass,
                      selectedOption === null && "shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    )}
                  >
                    <span className="font-serif-text italic text-base md:text-lg leading-snug">{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            <div className="h-16 flex justify-end">
              {selectedOption !== null && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </Shell>
  );
}
