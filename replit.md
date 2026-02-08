# replit.md

## Overview

This is a **Latin vocabulary flashcard learning app** built for studying medical/academic Latin. It provides interactive flashcards organized into 13 lesson-based lexical minimums (around 1,400 words total) plus a separate section for Latin proverbs/sayings. The app is primarily client-side — all flashcard data is loaded from a static JSON file, and the server exists mainly to serve the frontend in production and provide a health check endpoint.

Key features:
- Browse flashcards by lesson or view all cards with global numbering
- 3D flip card animations (Framer Motion)
- Quiz/blitz mode with multiple-choice questions (30 per quiz)
- Latin proverbs section with its own cards and quiz
- Confetti celebration effects on quiz completion
- Keyboard navigation support
- Responsive design

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (client/)
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite (dev server proxied through Express in development)
- **Routing**: Wouter (lightweight React router, NOT React Router)
- **State Management**: TanStack React Query for async state, but most data is static JSON imported at build time. Progress can be stored in localStorage.
- **Styling**: TailwindCSS with shadcn/ui component library (New York style variant). CSS variables define the color theme (academic/sophisticated palette with navy, gold accents).
- **Animations**: Framer Motion for card flip animations and page transitions
- **UI Components**: Full shadcn/ui component set in `client/src/components/ui/`
- **Data Layer**: Static JSON file imported via Vite alias `@assets/`. Data processing happens in `client/src/lib/data.ts` which parses lessons 1-13 and proverbs, assigns global indices, and provides quiz generation utilities.

### Key Routes
| Route | Purpose |
|-------|---------|
| `/` | Home page with lesson grid and proverbs section |
| `/all` | Card player for all vocabulary cards |
| `/lesson/:id` | Card player for a specific lesson (1-13) |
| `/proverbs` | Card player for Latin proverbs |
| `/quiz/:id` | Quiz mode for a specific lesson |
| `/quiz/proverbs` | Quiz mode for proverbs |

### Backend (server/)
- **Framework**: Express.js on Node.js
- **Purpose**: Minimal — serves the Vite dev server in development, serves static built files in production, and exposes a `/api/health` endpoint
- **Database**: PostgreSQL via Drizzle ORM is configured but barely used. The schema has a minimal `users` table. The app currently uses `MemStorage` (in-memory) for the user storage interface. The database is not required for core functionality.
- **Build**: Custom build script (`script/build.ts`) uses Vite for client and esbuild for server, outputting to `dist/`

### Shared Code (shared/)
- `schema.ts`: Drizzle schema definitions + TypeScript interfaces for Flashcard, Deck, QuizQuestion
- `routes.ts`: API route definitions with Zod validation schemas

### Data Flow
1. JSON data file lives in `attached_assets/` and is imported via Vite alias `@assets`
2. `client/src/lib/data.ts` processes the JSON on import: extracts lessons, builds global card index, extracts proverbs
3. Custom hooks in `client/src/hooks/use-flashcards.ts` expose the processed data to components
4. Components consume data directly — no API calls needed for flashcard functionality

### Path Aliases
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

### Build & Run
- `npm run dev` — Development with Vite HMR through Express
- `npm run build` — Production build (Vite for client → `dist/public`, esbuild for server → `dist/index.cjs`)
- `npm start` — Run production build
- `npm run db:push` — Push Drizzle schema to PostgreSQL

## External Dependencies

### Database
- **PostgreSQL** via `DATABASE_URL` environment variable
- **Drizzle ORM** for schema definition and queries
- **connect-pg-simple** for session storage (configured but not actively used)
- Note: The database is not required for the core flashcard functionality. The app works entirely client-side for its main features.

### Key NPM Packages
- **framer-motion**: 3D card flip animations and page transitions
- **canvas-confetti**: Celebration effects on quiz completion
- **wouter**: Client-side routing (lightweight alternative to React Router)
- **shadcn/ui** + Radix UI primitives: Complete UI component library
- **@tanstack/react-query**: Data fetching/caching (mostly for template compatibility)
- **drizzle-orm** + **drizzle-kit**: Database ORM and migration tooling
- **zod** + **drizzle-zod**: Schema validation

### Replit-specific
- `@replit/vite-plugin-runtime-error-modal`: Error overlay in development
- `@replit/vite-plugin-cartographer`: Dev tooling
- `@replit/vite-plugin-dev-banner`: Development environment banner