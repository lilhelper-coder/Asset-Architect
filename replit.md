# LilHelper - The Digital Grandchild

## Overview

LilHelper is a Progressive Web App (PWA) designed as a Christmas gift for seniors. It provides voice-based AI companionship through "Crystal," an all-knowing companion for tech and life guidance with a mystical, wise personality. The app features a dual-demographic model: Gen Z/Millennial gifters purchase and configure the service for their senior loved ones.

**Core Value Proposition:**
- For gifters: "Guilt Relief" - an easy way to provide companionship for elderly family members
- For seniors: "Dignified Companionship" - respectful, patient AI interaction without condescension

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework:** React 18 with TypeScript, using Vite as the build tool
- **Routing:** Wouter for lightweight client-side routing
- **State Management:** TanStack Query (React Query) for server state, AccessibilityContext for global a11y settings
- **Styling:** Tailwind CSS with shadcn/ui component library
- **Animations:** Framer Motion for the Magic Orb voice interface
- **Design System:** Premium OLED-optimized dark theme with pure black (#000000) background, turquoise color family (rgb(94, 234, 212) accent), Poppins font family, minimum 24px typography for senior accessibility
- **Design Benchmarks:** DoorDash, Bumble/Hinge, Apple product pages - clean, minimal, premium aesthetics
- **Accessibility:** WCAG 2.1 AAA compliant with high contrast mode, reduced motion, customizable captions

### Backend Architecture
- **Runtime:** Node.js with Express
- **API Pattern:** RESTful JSON APIs under `/api/*` prefix
- **Real-time Communication:** WebSocket server for voice interactions and Ghost Touch
- **Build System:** esbuild for server bundling, Vite for client

### Data Storage
- **Database:** PostgreSQL with Drizzle ORM
- **Schema Location:** `shared/schema.ts` contains all table definitions
- **Key Tables:** profiles, seniorConfigs, giftPools, contributors, mirrorSessions, users
- **Migrations:** Drizzle Kit with output to `./migrations`

### Voice Interface
- **AI Integration:** OpenAI API for Crystal personality responses
- **Voice Recognition:** Web Speech API (SpeechRecognition) for user input
- **Text-to-Speech:** Web Speech API (SpeechSynthesis) for Crystal responses
- **State Machine:** Four states - IDLE, LISTENING, SPEAKING, ERROR
- **Visual Feedback:** Living Orb component with generative graphics

### Accessibility Features (New)
- **AccessibilityContext:** Global state for text size, contrast, motion, captions
  - Location: `client/src/context/accessibility-context.tsx`
  - Provides: `speak()` utility that triggers TTS and updates captions simultaneously
- **CaptionOverlay:** Draggable, customizable caption display
  - Size options: sm, md, lg, xl
  - Weight options: 300-900
  - Style options: sans-serif, serif, monospace
  - Background options: solid, transparent
- **A11yToolbar:** Fixed gear icon (bottom-right) opens accessibility settings panel
- **High Contrast Mode:** Enhanced color contrast with white on pure black
- **Reduce Motion Mode:** Disables all animations for motion-sensitive users

### Interactive Features (New)
- **InteractiveFAQ:** Accordion-style FAQ with voice readout
  - Small Crystal orb icon pulses while speaking
  - Captions appear in CaptionOverlay simultaneously
- **GhostTouchCanvas:** AR touch visualization for remote assistance
  - Glowing teal particle trail on touch coordinates
  - Haptic feedback via Vibration API
  - Voice announcement: "Helper is highlighting screen"
- **Magic Mirror Page:** Video chat room for family helpers
  - Route: `/mirror`
  - Large touch targets (64px+ buttons)
  - Camera toggle, microphone toggle, end session
  - Integrates with GhostTouchCanvas

### Commerce Features
- **ChristmasPricing:** Premium pricing card component
  - Lifetime Edition: $99 (crossed out $199)
  - "Split with Family" feature for group gifting
  - Turquoise/teal glassmorphism styling
  - Christmas decorations (Santa hat, holiday badge) preserved for ads/social media campaigns only
  - Up to 5 contributors with individual thank-you messages

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
- **Accessibility:** Respects prefers-reduced-motion and AccessibilityContext.reducedMotion

### Key Design Decisions
1. **Scrollable landing page:** Hero orb section with FAQ and Pricing below
2. **OLED optimization:** Dark radial gradient background (#0a1f24 to #000000) saves battery on senior devices
3. **64px touch targets:** All interactive elements exceed 48px accessibility minimum
4. **Gift pool model:** Buyer (gifter) is separate from user (senior), enabling group gifting
5. **Generative orb graphics:** CSS/SVG-based for resolution independence across all device DPRs
6. **iOS safe-area support:** viewport-fit=cover with env() padding for notch/home indicator
7. **Global accessibility state:** AccessibilityContext manages all a11y preferences with localStorage persistence

## Routes

- `/` - Main landing page with Crystal orb, FAQ, and pricing
- `/senior` - Alias for main landing page
- `/claim/:code` - Gift claim flow
- `/mirror` - Magic Mirror video chat room

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| LivingOrb | `components/LivingOrb.tsx` | Crystal orb visual with state animations |
| SignInModal | `components/SignInModal.tsx` | Multi-platform authentication UI |
| CaptionOverlay | `components/CaptionOverlay.tsx` | Draggable, customizable caption display |
| A11yToolbar | `components/A11yToolbar.tsx` | Accessibility settings panel |
| InteractiveFAQ | `components/InteractiveFAQ.tsx` | FAQ accordion with voice readout |
| GhostTouchCanvas | `components/GhostTouchCanvas.tsx` | AR touch visualization overlay |
| ChristmasPricing | `components/ChristmasPricing.tsx` | Holiday pricing with family split |

## External Dependencies

### Core Services
- **OpenAI API:** Powers the Crystal AI companion personality using GPT-4o
- **PostgreSQL:** Primary database (requires DATABASE_URL environment variable)
- **Stripe:** Payment processing for gift purchases (not yet configured)

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `openai`: OpenAI API client
- `ws`: WebSocket server for real-time voice communication
- `framer-motion`: Animation library for orb interface and UI transitions
- `@tanstack/react-query`: Server state management
- `zod`: Schema validation for API requests
- `express-session` with `connect-pg-simple`: Session management
- `lucide-react`: Icon library
- `react-icons`: Additional icons (social provider logos)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- `SESSION_SECRET`: Session encryption key
