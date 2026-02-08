import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DeckGridPage from "@/pages/home";
import CardPlayerPage from "@/pages/player";
import QuizPage from "@/pages/quiz";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DeckGridPage} />
      <Route path="/all" component={CardPlayerPage} />
      <Route path="/lesson/:id" component={CardPlayerPage} />
      <Route path="/quiz/:id" component={QuizPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
