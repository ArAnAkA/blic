import { Link, useLocation } from "wouter";
import { BookOpen, Home, Layers } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 mr-6 hover:opacity-80 transition-opacity">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-display tracking-tight text-primary">Latin Cards</span>
          </Link>
          
          <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium">
            <Link 
              href="/" 
              className={`flex items-center gap-2 transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link 
              href="/all" 
              className={`flex items-center gap-2 transition-colors hover:text-primary ${location === '/all' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">All Cards</span>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container py-8 px-4 md:px-6">
        {children}
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 text-sm text-muted-foreground">
          <p>Latin Flashcards App &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
