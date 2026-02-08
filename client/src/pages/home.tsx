import { useLessons, useAllCards } from "@/hooks/use-flashcards";
import { Link } from "wouter";
import { Shell } from "@/components/layout/shell";
import { ArrowRight, Book, GraduationCap, PlayCircle, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function DeckGridPage() {
  const lessons = useLessons();
  const allCards = useAllCards();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8 md:py-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold text-primary"
          >
            Master Latin Vocabulary
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            A comprehensive flashcard collection organized by lessons. 
            Study {allCards.length} words and phrases with our interactive tools.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center pt-4"
          >
            <Link href="/all">
              <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-200 bg-primary rounded-full hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <Layers className="w-5 h-5" />
                Study All {allCards.length} Cards
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
        >
          {lessons.map((lesson) => (
            <motion.div 
              key={lesson.id}
              variants={item}
              className="bg-card hover:bg-accent/5 rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    Lesson {lesson.id}
                  </span>
                  <span className="text-sm font-mono text-muted-foreground/60">
                    #{lesson.globalStart}-{lesson.globalEnd}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2 font-display">
                  {lesson.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  {lesson.count} words
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <Link href={`/lesson/${lesson.id}`}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                    <PlayCircle className="w-4 h-4" />
                    Cards
                  </button>
                </Link>
                <Link href={`/quiz/${lesson.id}`}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium border-2 border-primary/10 text-primary hover:border-primary/20 hover:bg-primary/5 transition-colors">
                    <GraduationCap className="w-4 h-4" />
                    Quiz
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Shell>
  );
}
