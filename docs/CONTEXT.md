# Crystal AI / LilHelper - Project Context

## Project Summary

**Crystal AI (branded as "LilHelper")** is a voice-first AI companion specifically designed for seniors, functioning as a "digital grandchild" that provides tech support, life guidance, and companionship through natural conversation. The platform enables family members to gift subscriptions to their senior loved ones, with Crystal remembering personal context and adapting its communication style for analog natives.

---

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Routing**: Wouter (lightweight React Router alternative)
- **State Management**: @tanstack/react-query (TanStack Query v5)
- **UI Library**: Radix UI primitives (shadcn/ui component system)
- **Styling**: Tailwind CSS with custom animations
- **Animation**: Framer Motion
- **Voice Input**: Web Speech API (SpeechRecognition)
- **Voice Output**: Web Speech Synthesis API (SpeechSynthesis)

### Backend
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **WebSocket**: `ws` library for real-time voice communication
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (Neon serverless)
- **Session Management**: express-session with memorystore

### AI & Machine Learning
- **Primary AI Model**: OpenAI GPT-4 (via openai SDK v4)
- **Voice Processing**: Client-side Web Speech API
- **AI Use Cases**: 
  - Conversational responses
  - Context-aware guidance
  - Personalized senior support

### Infrastructure & Deployment
- **Frontend Hosting**: Netlify (static site)
- **Backend Hosting**: Railway (Node.js + PostgreSQL)
- **Domain**: www.lilhelper.ai
- **Environment Variables**: dotenv for local, platform env vars for production

### Development Tools
- **Package Manager**: npm with legacy-peer-deps
- **TypeScript Compilation**: tsx (direct TypeScript execution)
- **Build Tool**: Vite (frontend), tsx (backend)
- **CORS**: cors middleware for cross-origin requests
- **Dev Server**: Vite dev server with HMR

---

## Architecture

### Communication Flow

**Frontend ↔ Backend Communication:**

1. **REST API (HTTP/JSON)**
   - **Base URL**: Dynamic via `VITE_API_BASE_URL` environment variable
   - **Client Library**: Custom `apiRequest` wrapper in `client/src/lib/queryClient.ts`
   - **Endpoints**:
     - `GET /api/health` - Health check
     - `GET /api/test` - Connection test
     - Additional REST endpoints for data operations (sessions, profiles, gift pools)
   - **Query Management**: TanStack Query with custom `getQueryFn` for automatic retries and error handling

2. **WebSocket (Real-time Voice)**
   - **Protocol**: Native WebSocket (`ws://` or `wss://`)
   - **Endpoint**: `/api/voice`
   - **Server**: `server/voice.ts` - WebSocketServer instance
   - **Client Hook**: `client/src/hooks/useVoiceConnection.ts`
   - **Message Format**: JSON messages containing:
     - `userMessage` (text): Transcribed user speech
     - `aiResponse` (text): OpenAI response for speech synthesis
     - `error` (text): Error messages
   - **Flow**:
     1. Client captures speech via Web Speech API
     2. Transcribed text sent over WebSocket to backend
     3. Backend forwards to OpenAI GPT-4 with conversation context
     4. OpenAI response streamed back to client
     5. Client synthesizes speech using Web Speech Synthesis API

3. **CORS Configuration**
   - **Enabled Origins**:
     - `https://www.lilhelper.ai`
     - `https://lilhelper.ai`
     - `*.netlify.app` (regex pattern for preview deployments)
     - `http://localhost:5173` (Vite dev server)
     - `http://localhost:5000` (backend dev server)
   - **Credentials**: Enabled for session cookies

### AI Logic Location

**Server-Side AI Processing** (`server/voice.ts`):
- **OpenAI Integration**: Singleton client pattern with lazy initialization
- **System Prompt**: `CRYSTAL_SYSTEM_PROMPT` - Defines Crystal's personality, voice, and behavioral rules
- **Context Management**: 
  - Per-session conversation history stored in `sessions` Map
  - Personalization via `bioContext`, `seniorName`, `gifterName`
  - Christmas mode logic (Dec 20 - Jan 5)
- **Message Processing**:
  - User messages appended to conversation history
  - Full context sent to OpenAI Chat Completions API
  - Assistant responses stored and returned to client
- **Error Handling**: Graceful fallback messages for API failures

**Client-Side Voice Processing**:
- **Speech Recognition**: Browser-native SpeechRecognition API
- **Speech Synthesis**: Browser-native SpeechSynthesis API
- **State Management**: `useVoiceConnection` hook manages WebSocket lifecycle

---

## Key Directories

### `/client/src/`
**Frontend application root**

#### `/client/src/components/`
**React components organized by feature**

- **Voice UI Components**:
  - `LivingOrb.tsx` - Animated orb with state-based visual feedback (idle/listening/speaking/error)
  - `ChristmasOrb.tsx` - Seasonal variant of the orb with festive styling
  - `MagicOrb.tsx` - Alternative orb implementation with different animation patterns
  
- **Voice Experience**:
  - `CaptionOverlay.tsx` - Real-time speech captions for accessibility
  - `GhostTouchCanvas.tsx` - Visual touch feedback system
  
- **User Interaction**:
  - `SignInModal.tsx` - Authentication modal
  - `InteractiveFAQ.tsx` - Expandable FAQ system
  - `ChristmasPricing.tsx` - Subscription pricing display
  - `LanguagePicker.tsx` - Multi-language support selector
  
- **Accessibility**:
  - `A11yToolbar.tsx` - Accessibility controls toolbar
  
- **Dashboard Components** (`/components/dashboard/`):
  - `DashboardLayout.tsx` - Main dashboard scaffold
  - `ProfileCard.tsx` - User profile display
  - `SessionHistory.tsx` - Conversation history viewer
  - `TranscriptViewer.tsx` - Detailed session transcript display
  - `StatsCard.tsx` - Usage statistics cards
  - `GiftPoolCard.tsx` - Gift subscription pool management
  - `ContributorsList.tsx` - Gift pool contributor list
  - `SeniorConfigCard.tsx` - Senior-specific settings (voice speed, bio context)
  - `SettingsPanel.tsx` - Global settings panel
  - `EmptyState.tsx` - Empty state placeholder components

- **UI Primitives** (`/components/ui/`):
  - shadcn/ui component library (accordion, alert, button, card, dialog, dropdown, form, input, select, etc.)

#### `/client/src/pages/`
**Top-level route pages**

- `senior-interface.tsx` - **Main landing page** - Hero section with Crystal orb, FAQ, pricing
- `dashboard.tsx` - **User dashboard** - Session management, analytics, settings
- `mirror.tsx` - **Mirror page** - Alternative interface view
- `not-found.tsx` - 404 error page

#### `/client/src/hooks/`
**Custom React hooks**

- `useVoiceConnection.ts` - **Core voice logic** - WebSocket management, speech recognition/synthesis, orb state machine
- `useAuth.ts` - Authentication state management
- `use-toast.ts` - Toast notification hook
- `use-mobile.tsx` - Mobile device detection

#### `/client/src/context/`
**Global React contexts**

- `accessibility-context.tsx` - Accessibility preferences (font size, high contrast, captions)
- `language-context.tsx` - Multi-language support and translations

#### `/client/src/lib/`
**Utility libraries**

- `queryClient.ts` - **API communication layer** - TanStack Query setup, `apiRequest` wrapper, base URL configuration
- `utils.ts` - Utility functions (classname merging, etc.)

### `/server/`
**Backend application root**

- `index.ts` - **Main server entry point** - Express app setup, CORS config, middleware, server startup
- `routes.ts` - **API route registration** - HTTP endpoints and WebSocket setup
- `voice.ts` - **Voice AI logic** - WebSocket server, OpenAI integration, conversation management
- `db.ts` - **Database connection** - Drizzle ORM + PostgreSQL pool initialization
- `storage.ts` - Storage utilities (future feature)
- `vite.ts` - Vite dev server integration for local development
- `static.ts` - Static file serving for production builds

### `/shared/`
**Shared code between client and server**

- `schema.ts` - **Database schema** - Drizzle ORM table definitions + Zod validation schemas
  - Tables: `profiles`, `seniorConfigs`, `giftPools`, `contributors`, `voiceSessions`, `transcripts`

### `/client/public/`
**Static assets**

- `favicon.svg` - Crystal orb favicon
- `manifest.json` - PWA manifest
- `/assets/` - Images, fonts, other static resources
- `/icons/` - PWA icons (192x192, 512x512)

### Configuration Files (Root)

- `package.json` - Dependencies and npm scripts
- `tsconfig.json` - TypeScript configuration (shared)
- `tsconfig.server.json` - Server-specific TypeScript config
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `drizzle.config.ts` - Drizzle ORM migration config
- `netlify.toml` - Netlify deployment configuration
- `.npmrc` - npm configuration (legacy-peer-deps=true)

---

## Entry Points

### Frontend Entry
1. **`client/index.html`** - HTML shell with root div
2. **`client/src/main.tsx`** - React root renderer, imports App
3. **`client/src/App.tsx`** - Router setup with context providers
4. **`client/src/pages/senior-interface.tsx`** - Default route (`/`)

### Backend Entry
1. **`server/index.ts`** - Express server initialization
2. **`server/routes.ts`** - Route registration and WebSocket setup
3. **`server/voice.ts`** - WebSocket handlers and OpenAI logic

### Build Entry
- **Development**: `npm run dev` → `tsx watch server/index.ts` (runs Vite dev server via server)
- **Production Build**: `npm run build` → `vite build` (client only)
- **Production Server**: `npm start` → `tsx server/index.ts` (Railway deployment)

---

## Environment Variables

### Frontend (Vite)
- `VITE_API_BASE_URL` - Backend API URL (defaults to `window.location.origin`)

### Backend (Node.js)
- `DATABASE_URL` - PostgreSQL connection string (Neon serverless)
- `OPENAI_API_KEY` - OpenAI API key for GPT-4
- `NODE_ENV` - Environment mode (`development` | `production`)
- `PORT` - Server port (default: 5000)

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│           www.lilhelper.ai (DNS)                    │
│                                                     │
│  ┌───────────────────┐       ┌──────────────────┐ │
│  │  Netlify CDN      │       │  Railway         │ │
│  │  (Static React)   │◄─────►│  (Node.js API)   │ │
│  │                   │       │                  │ │
│  │  - HTML/CSS/JS    │       │  - Express       │ │
│  │  - Vite Build     │       │  - WebSocket     │ │
│  │  - /dist/public/  │       │  - tsx runtime   │ │
│  └───────────────────┘       └──────────────────┘ │
│                                     │               │
│                                     ▼               │
│                           ┌──────────────────┐     │
│                           │  Railway         │     │
│                           │  PostgreSQL      │     │
│                           │  (Neon)          │     │
│                           └──────────────────┘     │
│                                                     │
│                           ┌──────────────────┐     │
│                           │  OpenAI          │     │
│                           │  GPT-4 API       │     │
│                           └──────────────────┘     │
└─────────────────────────────────────────────────────┘

Client Browser:
  - Web Speech API (input)
  - Web Speech Synthesis (output)
  - WebSocket connection to Railway backend
```

---

## Key Design Patterns

### Frontend
- **Custom Hooks**: Encapsulate stateful logic (voice connection, auth)
- **Context Providers**: Global state for accessibility and language
- **Component Composition**: Radix UI primitives + Tailwind styling
- **Query Invalidation**: TanStack Query cache management

### Backend
- **Singleton Pattern**: OpenAI client lazy initialization
- **Session Management**: In-memory WebSocket session map
- **Middleware Chain**: Express middleware for logging, CORS, error handling
- **Environment-Based Config**: Different behaviors for dev vs. production

### Voice Experience
- **State Machine**: Orb states (idle → listening → speaking → idle)
- **Event-Driven**: WebSocket messages trigger state transitions
- **Graceful Degradation**: Fallback UI if speech APIs unavailable

---

## Critical User Flows

### 1. First-Time Senior User
1. Lands on `/` (senior-interface)
2. Sees animated Crystal orb with "Tap to Talk" hint
3. Taps orb → Browser requests microphone permission
4. Orb enters "listening" state
5. User speaks → Web Speech API transcribes
6. Transcript sent via WebSocket to backend
7. Backend sends to OpenAI with Crystal personality prompt
8. Response returned → Speech Synthesis speaks it aloud
9. Orb animates in "speaking" state
10. Returns to "idle" state when complete

### 2. Family Member Gifting
1. Visits `/` and scrolls to pricing section
2. Clicks "Gift LilHelper" button
3. SignInModal opens (future: Stripe checkout)
4. Creates gift pool with magic link code
5. Shares link with family for group contributions
6. Senior receives device with pre-configured access

### 3. Dashboard Management
1. User navigates to `/dashboard`
2. Views session history, transcripts, usage stats
3. Configures senior settings (voice speed, bio context, gifter name)
4. Reviews gift pool status and contributors

---

## Security Considerations

- **API Keys**: All keys in environment variables (`.env` gitignored)
- **CORS**: Strict origin whitelist
- **Input Validation**: Zod schemas for all database operations
- **Session Management**: Express sessions with secure cookies (future implementation)
- **Rate Limiting**: Not yet implemented (future consideration)

---

## Future Architecture Considerations

- **Authentication**: Implement Supabase Auth (already imported but not used)
- **Payment Processing**: Stripe integration for gift pool checkout
- **Email Notifications**: Gift link delivery, session summaries
- **Analytics**: Usage tracking, conversation insights
- **Mobile Apps**: React Native wrapper for iOS/Android
- **Voice Customization**: Multiple voice options, speed controls
- **Offline Mode**: Local speech processing fallback

---

*This document provides a high-level map of the Crystal AI / LilHelper codebase. For detailed implementation analysis, see additional documentation in `/docs/`.*

