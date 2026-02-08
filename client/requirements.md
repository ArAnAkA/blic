## Packages
framer-motion | Essential for complex 3D card flip animations and page transitions
canvas-confetti | Celebration effect for completing quizzes
@types/canvas-confetti | TypeScript definitions for confetti

## Notes
Static data import from @assets/flashcards_ru_la_by_lesson_1770563640294.json is assumed to be configured in Vite alias.
No backend database required for core functionality; app runs client-side with the provided JSON.
Tailwind config should support 3D transform utilities (perspective, rotate-y) or use custom CSS/Framer Motion.
