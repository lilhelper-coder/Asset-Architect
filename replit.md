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
- **Visual Feedback:** Living Orb component with generative graphics

### Living Orb Component
- **Resolution-independent:** CSS/SVG-based, crisp at any DPR
- **Dynamic colors:** CSS variables (--orb-hue, --orb-saturation) for state-based color shifts
- **Layered structure:**
  - Ambient glow layer with 8s breathing animation
  - 3 SVG energy ring layers rotating at different speeds (20s, 35s, 50s)
  - Central core with radial gradient and specular highlight
- **State classes:**
  - state-idle: Teal (hue 175)
  - state-listening: Bright teal (hue 175, higher lightness)
  - state-speaking: Green-teal (hue 155)
  - state-error: Amber (hue 38)
- **Accessibility:** Respects prefers-reduced-motion media query

### Key Design Decisions
1. **Single-viewport senior interface:** No scrolling required on main interface for senior usability
2. **OLED optimization:** Dark radial gradient background (#0a1f24 to #000000) saves battery on senior devices
3. **64px touch targets:** Header buttons exceed 48px accessibility minimum
4. **Gift pool model:** Buyer (gifter) is separate from user (senior), enabling group gifting
5. **Generative orb graphics:** CSS/SVG-based for resolution independence across all device DPRs
6. **iOS safe-area support:** viewport-fit=cover with env() padding for notch/home indicator

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