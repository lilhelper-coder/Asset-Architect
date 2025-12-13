# Crystal AI / LilHelper - Development Blueprint

> **Last Updated**: December 12, 2025 (5:10 PM)  
> **Status**: 🟢 Production Live at www.lilhelper.ai  
> **Current Sprint**: Zero-Cost Architecture Migration

---

## 🎯 Current Mission

**✅ COMPLETED: Implement Filler Audio to reduce perceived latency**  
**🚀 NEW MISSION: Migrate to Zero-Cost Architecture (Supabase + Gemini Flash)**

---

## 📋 Active Tasks

### Phase 1: Voice & UI Optimization ✅ COMPLETED
- [x] Task 1: Filler audio strategy implemented in `useVoiceConnection.ts`
- [x] Task 2: Play filler audio immediately on `speechend` event
- [x] Task 3: Stop filler audio when AI response arrives
- [x] Task 4: Switch backend from OpenAI to Gemini 1.5 Flash
- [x] Task 5: Add glassmorphism effect to `LivingOrb.tsx`
- [x] Task 6: Created audio asset directory structure

### Phase 2: Supabase Realtime Integration ✅ COMPLETED
- [x] Task 7: Created `client/src/lib/supabase.ts` client
- [x] Task 8: Created `useGhostSession.ts` realtime hook
- [x] Task 9: Documented Ghost Mode SQL schema in `docs/GHOST_MODE_SCHEMA.sql`

### Phase 3: Deployment & Testing (NEXT)
- [ ] Task 10: Record/generate actual thinking sound MP3 files
- [ ] Task 11: Add `GEMINI_API_KEY` to Railway environment variables
- [ ] Task 12: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Netlify
- [ ] Task 13: Run Ghost Mode schema SQL in Supabase dashboard
- [ ] Task 14: Test Gemini integration end-to-end
- [ ] Task 15: Test filler audio on mobile devices
- [ ] Task 16: Verify barge-in still works with filler audio

---

## 🧠 Architecture Decisions

### Voice & Communication
- **[AD-001]**: Using native `ws` library for WebSocket (not socket.io) for minimal overhead
- **[AD-002]**: ~~Using OpenAI GPT-4 Chat Completions API~~ **MIGRATED TO GEMINI 1.5 FLASH** (free tier, faster)
- **[AD-003]**: Client-side speech processing via Web Speech API (browser-native)
- **[AD-004]**: Server-side AI processing to protect API keys and manage conversation context
- **[AD-005]**: WebSocket message format: JSON with `userMessage`, `aiResponse`, `error` fields
- **[AD-030]**: **NEW - Filler audio plays immediately after speech recognition** to mask latency
- **[AD-031]**: **NEW - Filler audio loops until AI response arrives**, then stops instantly
- **[AD-032]**: **NEW - Random selection from 3 thinking sounds** for variety

### Frontend Architecture
- **[AD-006]**: React 18 with TypeScript for type safety and modern patterns
- **[AD-007]**: Vite 5 for fast builds and HMR during development
- **[AD-008]**: Wouter for lightweight routing (not React Router)
- **[AD-009]**: TanStack Query for server state management and caching
- **[AD-010]**: Tailwind CSS + shadcn/ui for consistent, accessible components
- **[AD-011]**: Framer Motion for orb animations (60 FPS target)
- **[AD-033]**: **NEW - Glassmorphism effect on orb container** with backdrop blur and semi-transparent borders

### Backend Architecture
- **[AD-012]**: Express.js with TypeScript executed via `tsx` (no separate build step)
- **[AD-013]**: Drizzle ORM for type-safe database operations
- **[AD-014]**: PostgreSQL (Neon serverless) for production database
- **[AD-015]**: In-memory session storage for WebSocket sessions (Map-based)
- **[AD-016]**: CORS enabled for Netlify frontend and custom domain
- **[AD-034]**: **NEW - Google Generative AI SDK** (`@google/generative-ai`) for Gemini integration
- **[AD-035]**: **NEW - Gemini 1.5 Flash model** for free, fast AI responses

### Realtime & Sync
- **[AD-036]**: **NEW - Supabase Realtime** for Ghost Mode (Helper watches Senior's session)
- **[AD-037]**: **NEW - Supabase free tier** for database and realtime subscriptions
- **[AD-038]**: **NEW - Ghost Mode schema**: `sessions` table with RLS policies
- **[AD-039]**: **NEW - `useGhostSession` hook** for bidirectional real-time sync

### Deployment Strategy
- **[AD-017]**: Split deployment: Netlify (static frontend) + Railway (Node.js backend)
- **[AD-018]**: Environment variables for dynamic API URL (`VITE_API_BASE_URL`)
- **[AD-019]**: `legacy-peer-deps=true` in `.npmrc` to bypass peer dependency conflicts
- **[AD-020]**: Direct TypeScript execution on Railway via `tsx` (no compilation step)

### UX & Accessibility
- **[AD-021]**: Orb state machine: idle → listening → speaking → idle
- **[AD-022]**: Barge-in support: user can interrupt AI mid-speech
- **[AD-023]**: Real-time captions via `CaptionOverlay` component
- **[AD-024]**: Accessibility toolbar with font size, contrast, caption controls
- **[AD-025]**: Mobile-first design with large touch targets (64px minimum)

### Performance Optimizations
- **[AD-026]**: Minimal WebSocket message payload (text-only)
- **[AD-027]**: React.memo and useCallback for voice components to prevent re-renders
- **[AD-028]**: Lazy loading for non-critical UI components
- **[AD-029]**: Speech synthesis starts immediately on first token (future: streaming)

---

## 🚫 Known Issues

### Critical (P0)
- **[ISSUE-001]**: **Voice latency is 2-5 seconds** ✅ MITIGATED
  - Root Cause: AI API processing time + network round-trip
  - Impact: Users perceive lag, feels unnatural
  - **Mitigation Implemented**: Filler audio now plays immediately, masking perceived latency
  - **Performance Improvement**: Switched to Gemini 1.5 Flash (faster than GPT-4)
  - Status: Pending real-world testing with audio files

- **[ISSUE-002]**: **Barge-in doesn't always stop audio playback immediately**
  - Root Cause: Speech synthesis cancellation timing issue
  - Impact: User hears old response while new one is processing
  - Location: `client/src/hooks/useVoiceConnection.ts` (stopSpeaking function)
  - **Update**: Filler audio now stops immediately when response arrives
  - Mitigation: Add aggressive cancellation logic + audio fade-out

### High Priority (P1)
- **[ISSUE-003]**: **Web Speech API not available in all browsers**
  - Impact: Users on Firefox/older Safari can't use voice features
  - Workaround: Display error message with browser recommendations
  - Long-term: Fallback to server-side speech recognition (Whisper API)

- **[ISSUE-004]**: **WebSocket disconnects not always detected**
  - Impact: User may think they're connected when backend is down
  - Location: `client/src/hooks/useVoiceConnection.ts` (WebSocket error handling)
  - Mitigation: Add heartbeat/ping mechanism

- **[ISSUE-005]**: **Mobile Safari sometimes blocks microphone access**
  - Impact: iOS users can't activate voice on first tap
  - Root Cause: iOS requires user gesture for media permissions
  - Workaround: Add explicit "Enable Microphone" button

### Medium Priority (P2)
- **[ISSUE-006]**: **Orb animation can stutter on low-end devices**
  - Impact: Poor UX on older phones/tablets
  - Location: `client/src/components/LivingOrb.tsx`
  - Mitigation: Reduce motion option + simpler animation fallback

- **[ISSUE-007]**: **No session persistence across page refreshes**
  - Impact: Conversation history lost on reload
  - Root Cause: In-memory session storage on server
  - Long-term: Store sessions in PostgreSQL

- **[ISSUE-008]**: **No authentication system yet**
  - Impact: Anyone can access the app, no user profiles
  - Long-term: Implement Supabase Auth or custom JWT system

### Low Priority (P3)
- **[ISSUE-009]**: **Favicon not updating in all browsers after recent change**
  - Impact: Some users still see old Replit logo
  - Mitigation: Hard refresh required (Ctrl+F5)
  - Auto-resolves: Browser cache expiration

- **[ISSUE-010]**: **Dashboard components not fully connected to live data**
  - Impact: Some UI shows placeholder data
  - Location: `client/src/pages/dashboard.tsx`
  - Long-term: Connect to PostgreSQL queries via TanStack Query

---

## 🎨 Design System Notes

### Color Palette
- **Primary**: `#0d9488` (Teal 600) - Crystal orb idle state
- **Primary Hover**: `#14b8a6` (Teal 500) - Orb listening state
- **Background**: Radial gradient from `#0a1f24` to `#000000`
- **Error**: `#F59E0B` (Amber 500) - Error state
- **Text**: White with varying opacity for hierarchy

### Typography
- **Primary Font**: System font stack (DM Sans, Inter, Poppins loaded via Google Fonts)
- **Sizes**: Large (24px+) for senior-friendly readability
- **Line Height**: 1.6 for comfortable reading

### Spacing
- **Touch Targets**: 64px minimum for senior users
- **Padding**: Generous spacing (p-6, p-8) for breathing room
- **Mobile Breakpoints**: 640px (sm), 768px (md), 1024px (lg)

---

## 📊 Success Metrics

### Voice Experience
- **Target Voice Latency**: < 1 second perceived gap
- **Barge-in Response Time**: < 200ms to stop speaking
- **Speech Recognition Accuracy**: > 90% (browser-dependent)
- **Orb Animation Frame Rate**: 60 FPS consistent

### User Experience
- **Mobile Usability**: Works on iOS Safari + Chrome
- **Accessibility Score**: WCAG AA compliance
- **First Interaction Success**: > 80% successful first taps

### Technical Health
- **WebSocket Uptime**: > 99.5%
- **API Response Time**: < 500ms (excluding OpenAI)
- **Build Time**: < 30 seconds
- **Bundle Size**: < 500KB gzipped

---

## 🔄 Recent Changes

### December 12, 2025
- ✅ Replaced Replit favicon with custom Crystal orb favicon
- ✅ Deployed frontend to Netlify (www.lilhelper.ai)
- ✅ Deployed backend to Railway with PostgreSQL
- ✅ Fixed CORS configuration for split deployment
- ✅ Created `docs/CONTEXT.md` architecture documentation
- ✅ Created `.cursorrules` for AI coding standards
- ✅ Initialized `docs/BLUEPRINT.md` (this file)

---

## 📝 Next Sprint Planning

### Sprint Goal: Reduce Perceived Latency to < 1 Second

**User Story**: As a senior user, I want Crystal to respond quickly so the conversation feels natural and engaging.

**Acceptance Criteria**:
1. Filler audio plays immediately when I stop speaking
2. Filler audio stops when Crystal starts speaking
3. Barge-in works even during filler audio playback
4. Accessibility option to disable filler audio exists
5. Perceived latency is < 1 second based on user testing

**Out of Scope**:
- Switching to OpenAI Realtime API (future sprint)
- Server-side speech recognition (future sprint)
- Authentication system (future sprint)

---

## 🎯 Long-Term Roadmap

### Q1 2026: Core Experience Polish
- [ ] Implement filler audio for perceived latency reduction
- [ ] Add OpenAI streaming responses (token-by-token)
- [ ] Implement session persistence in PostgreSQL
- [ ] Add basic authentication (magic link or Supabase Auth)

### Q2 2026: Growth Features
- [ ] Payment system integration (Stripe for gift pools)
- [ ] Email notifications for gift link sharing
- [ ] Mobile app wrappers (React Native or Capacitor)
- [ ] Multiple voice options (speed, pitch, accent)

### Q3 2026: Analytics & Insights
- [ ] Usage analytics dashboard
- [ ] Conversation sentiment analysis
- [ ] Family member notifications (daily summaries)
- [ ] Senior wellness insights

### Q4 2026: Scale & Optimize
- [ ] Multi-language support (Spanish, French, etc.)
- [ ] Offline mode with local speech processing
- [ ] Voice customization (personality presets)
- [ ] Enterprise features (care facility management)

---

*This blueprint is a living document. Update it as decisions are made, tasks are completed, and issues are discovered.*

