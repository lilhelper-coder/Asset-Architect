# LilHelper - Design Guidelines

## Design Approach
**Strict Specifications Provided** - This project has explicit design requirements focused on senior accessibility and OLED optimization. All guidelines below are mandatory, not suggestions.

## Core Design Principles
1. **Accessibility-First**: Every design decision prioritizes senior usability
2. **Dignified Simplicity**: No condescension, no tech jargon
3. **OLED Optimization**: Pure black saves battery on senior devices
4. **Single-Viewport Focus**: No scrolling on senior interface

## Color Palette

**Background:**
- Pure Black: `#000000` (OLED optimized, main senior interface)
- White: `#FFFFFF` (gifter/admin interfaces only)

**Primary Accent:**
- Teal: `#0d9488` (all interactive elements, orb glow, CTAs)

**Feedback States:**
- Success: Teal `#0d9488`
- Error/Fallback: Amber `#F59E0B`
- Neutral: Gray-600 `#4B5563`

## Typography

**Font Family:** Inter (Google Fonts)

**Senior Interface Sizes:**
- Minimum: 24px (all text)
- Primary Actions: 32px
- Headings: 40px+

**Gifter/Admin Interface:**
- Body: 16px
- Headings: 24-32px
- CTA buttons: 18px

**Weights:**
- Regular: 400
- Medium: 500 (primary actions)
- Semibold: 600 (headings)

## Layout System

**Spacing Units (Tailwind):** Use 4, 8, 12, 16, 24 (p-4, m-8, gap-12, etc.)

**Touch Targets:**
- Minimum: 48px height/width for ALL interactive elements
- Recommended: 64px for primary actions on senior interface

**Senior Interface Constraints:**
- NO scrolling - everything fits in single viewport
- Center-aligned content
- Maximum 3 elements per screen

## Component Library

### 1. Magic Orb (Senior Interface Centerpiece)
- Size: 300px (mobile), 400px (tablet)
- Position: Absolute center of viewport
- Glow effect: Teal with blur radius 40px
- States via Framer Motion:
  - IDLE: Breathing animation (scale 1.0 → 1.05, 2s ease-in-out loop)
  - LISTENING: Rapid pulse (scale 1.0 → 1.15, 0.8s)
  - SPEAKING: Smooth breathing (scale 1.0 → 1.1, 1.5s)

### 2. Senior Interface Icons
- Size: Minimum 48px × 48px
- Position: Top corners only
- Style: Simple outlines, teal color
- Examples: "Help Mirror" (QR code), Settings (gear)

### 3. Gifter Landing Page
- Hero: Emotional headline + family photo placeholder (600px height)
- Trust badges: "2-Week Christmas Launch", "Privacy First"
- 3-step wizard cards with icons
- Split Pay progress bar (teal fill)

### 4. QR Magic Mirror Dashboard
- Two-column layout: Live transcript (left), controls (right)
- Flash Message input: Large textarea, send button (teal)
- Connection status: Pulsing indicator (teal = connected)
- Visual guide thumbnails: 120px cards with play icons

### 5. Buttons
**Senior Interface:**
- ONE massive button: Full width, 80px height, 32px text, teal background
- Label: "TAP TO START" or similar ultra-clear copy

**Gifter Interface:**
- Primary CTA: Teal background, white text, 48px height
- Secondary: Teal outline, teal text
- Hover states: Slight scale (1.02) + brightness increase

### 6. Forms & Inputs
- Height: 56px minimum
- Border: 2px teal on focus
- Placeholder text: Gray-500
- Error states: Red border + amber icon

## Animations

**Sparingly Used:**
- Orb state transitions (core UX)
- QR code generation fade-in
- Page transitions: Simple fade (300ms)

**Forbidden:**
- Parallax scrolling
- Complex hover effects
- Auto-playing carousels

## Images

**Hero Section (Gifter Landing):**
- Warm family photo showing Gen Z/Millennial gifter with senior
- Emotional tone: Love, connection, care
- Overlay: Dark gradient (bottom) for text legibility
- Buttons on hero: Blurred background, no custom hover states

**Visual Sidecar Protocol:**
- SVG/CSS device diagrams (phone outlines with highlighted buttons)
- Simple, high-contrast, no photos

**No Images On:**
- Senior main interface (only the orb)
- QR Magic Mirror screens

## PWA Specifications

**Manifest Settings:**
- Name: "LilHelper"
- Theme color: `#0d9488`
- Background color: `#000000`
- Display: "standalone"
- Icons: 192px, 512px (teal glowing orb on black)

**Install Prompt:**
- Show on gifter setup completion
- Large "Add to Home Screen" visual guide
- Platform-specific instructions (iOS vs Android)

## Accessibility Mandates

- WCAG AAA contrast ratios (teal on black = 7.3:1)
- Focus indicators: 3px teal outline
- Screen reader labels on ALL interactive elements
- No auto-play audio (iOS Safari policy compliance)
- Keyboard navigation support for admin interfaces

## Language & Tone

**Forbidden Terms:**
- "Tech illiterate", "user error", "as an AI"

**Required Replacements:**
- "Analog Native", "Reality-Focused", "Tech-Selective"
- "Let's try a different path" (not "error")

**Button Copy Style:**
- Ultra-clear imperatives: "TAP TO START", "SEND TO FAMILY"
- No cute/clever copy on senior interface