# LilHelper - The Digital Grandchild

## Overview

LilHelper is a Progressive Web App (PWA) designed as a Christmas gift for seniors. It provides voice-based AI companionship through "Scout," a warm digital grandchild personality. The app features a dual-demographic model: Gen Z/Millennial gifters purchase and configure the service for their senior loved ones.

**Core Value Proposition:**
- For gifters: "Guilt Relief" - an easy way to provide companionship for elderly family members
- For seniors: "Dignified Companionship" - respectful, patient AI interaction without condescension

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework:** React 18 with TypeScript, using Vite as the build tool
- **Routing:** Wouter for lightweight client-side routing
- **State Management:** TanStack Query (React Query) for server state
- **Styling:** Tailwind CSS with shadcn/ui component library
- **Animations:** Framer Motion for the Magic Orb voice interface
- **Design System:** OLED-optimized dark theme with pure black (#000000) background, teal (#0d9488) accent, minimum 24px typography for senior accessibility

### Backend Architecture
- **Runtime:** Node.js with Express
- **API Pattern:** RESTful JSON APIs under `/api/*` prefix
- **Real-time Communication:** WebSocket server for voice interactions
- **Build System:** esbuild for server bundling, Vite for client

### Data Storage
- **Database:** PostgreSQL with Drizzle ORM
- **Schema Location:** `shared/schema.ts` contains all table definitions
- **Key Tables:** profiles, seniorConfigs, giftPools, contributors, mirrorSessions, users
- **Migrations:** Drizzle Kit with output to `./migrations`

### Voice Interface
- **AI Integration:** OpenAI API for Scout personality responses
- **Voice Recognition:** Web Speech API (SpeechRecognition) for user input
- **State Machine:** Four states - IDLE, LISTENING, SPEAKING, ERROR
- **Visual Feedback:** Animated teal orb with state-specific breathing animations

### Key Design Decisions
1. **Single-viewport senior interface:** No scrolling required on main interface for senior usability
2. **OLED optimization:** Pure black background saves battery on senior devices
3. **48px minimum touch targets:** All interactive elements meet accessibility standards
4. **Gift pool model:** Buyer (gifter) is separate from user (senior), enabling group gifting

## External Dependencies

### Core Services
- **OpenAI API:** Powers the Scout AI companion personality using GPT models
- **PostgreSQL:** Primary database (requires DATABASE_URL environment variable)
- **Stripe:** Payment processing for gift purchases (native Replit integration)

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `openai`: OpenAI API client
- `ws`: WebSocket server for real-time voice communication
- `framer-motion`: Animation library for orb interface
- `@tanstack/react-query`: Server state management
- `zod`: Schema validation for API requests
- `express-session` with `connect-pg-simple`: Session management

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication