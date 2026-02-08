import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { type Flashcard } from "@/lib/data";
import { cn } from "@/lib/utils";

interface Flashcard3DProps {
  card: Flashcard;
  isFlipped?: boolean;
  onFlip?: () => void;
  className?: string;
}

export function Flashcard3D({ card, isFlipped: controlledFlipped, onFlip, className }: Flashcard3DProps) {
  const [isFlippedInternal, setIsFlippedInternal] = useState(false);
  
  // Use controlled state if provided, otherwise internal
  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : isFlippedInternal;
  
  const handleFlip = () => {
    if (onFlip) onFlip();
    else setIsFlippedInternal(!isFlippedInternal);
  };

  // Reset internal flip state when card changes
  useEffect(() => {
    if (controlledFlipped === undefined) {
      setIsFlippedInternal(false);
    }
  }, [card, controlledFlipped]);

  return (
    <div 
      className={cn("w-full max-w-xl mx-auto h-80 sm:h-96 perspective-1000 cursor-pointer group", className)}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500 preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Face (Russian) */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl border border-border/40 p-8 flex flex-col items-center justify-center backface-hidden group-hover:shadow-2xl transition-shadow">
          <div className="absolute top-4 left-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Russian</span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="text-xs font-mono text-muted-foreground/50">#{card.globalIndex}</span>
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary leading-tight font-display">
            {card.ru}
          </h3>
          <p className="absolute bottom-6 text-sm text-muted-foreground font-medium">
            Tap to flip
          </p>
        </div>

        {/* Back Face (Latin) */}
        <div 
          className="absolute inset-0 w-full h-full bg-slate-900 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180"
        >
          <div className="absolute top-4 left-4">
            <span className="text-xs font-bold uppercase tracking-widest text-white/30">Latin</span>
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif-text italic text-center text-white leading-tight">
            {card.la}
          </h3>
          <p className="absolute bottom-6 text-sm text-white/40 font-medium">
            Lesson {card.lesson}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
