# User Dashboard Architecture

## Overview

The user dashboard provides a comprehensive interface for managing Crystal profiles, gift pools, mirror sessions, and settings. It's built with React, TypeScript, and follows modern UI/UX best practices.

## Architecture Components

### Pages

#### `/client/src/pages/dashboard.tsx`
Main dashboard page that serves as the central hub. Features:
- **Stats Overview**: Real-time metrics for sessions, gift pools, contributions
- **Profile Management**: View and edit user information
- **Senior Configuration**: Customize Crystal's behavior (voice speed, bio context)
- **Gift Pool Management**: Track fundraising progress and contributors
- **Session History**: View past mirror sessions
- **Quick Actions**: Fast access to key features

### Layout

#### `/client/src/components/dashboard/DashboardLayout.tsx`
Reusable layout wrapper that includes:
- **Sticky Header**: Navigation and user info
- **Desktop Navigation**: Icon-based menu with labels
- **Mobile Navigation**: Bottom tab bar for touch devices
- **Responsive Design**: Adapts to all screen sizes

### Components

#### Core Components

1. **ProfileCard.tsx**
   - Displays user profile information
   - Edit mode with inline form
   - Updates via `useAuth` hook

2. **StatsCard.tsx**
   - Reusable metric display
   - Supports icons, trends, and descriptions
   - Animated entrance

3. **GiftPoolCard.tsx**
   - Shows gift pool progress
   - Displays contributors count
   - Share functionality with native share API
   - Copy magic link to clipboard

4. **SessionHistory.tsx**
   - Lists all mirror sessions
   - Shows active vs completed status
   - Timestamp formatting (relative and absolute)
   - Message count per session

5. **SettingsPanel.tsx**
   - Integrates with `AccessibilityContext`
   - Integrates with `LanguageContext`
   - Text size, contrast, motion controls
   - Language selection
   - Voice settings

6. **SeniorConfigCard.tsx**
   - Senior-specific settings
   - Voice speed configuration
   - Device type selection
   - Bio context for personalization
   - Gifter name display

7. **ContributorsList.tsx**
   - Shows all gift pool contributors
   - Payment status badges
   - Avatar with initials
   - Paid/pending status

8. **TranscriptViewer.tsx**
   - Displays session transcripts
   - Chat-like interface
   - User vs assistant messages
   - Timestamp for each message

9. **EmptyState.tsx**
   - Reusable empty state component
   - Icon, title, description
   - Optional call-to-action button

### Hooks

#### `/client/src/hooks/useAuth.ts`
Authentication and user management hook:
```typescript
const { 
  user,              // Current user profile
  isLoading,         // Loading state
  isAuthenticated,   // Auth status
  login,             // Login function
  logout,            // Logout function
  updateProfile      // Update profile function
} = useAuth();
```

Features:
- Query user data with React Query
- Handle authentication state
- Login/logout mutations
- Profile update mutations
- Auto-refresh on changes

## Data Flow

```
User Action → Component → Hook → API Request → Server
                ↓                      ↓
            UI Update  ←  React Query  ←  Response
```

### State Management

1. **React Query**: Server state (user data, gift pools, sessions)
2. **Context API**: 
   - `AccessibilityContext` - A11y settings
   - `LanguageContext` - Localization
3. **Local State**: Component-specific UI state

## Routing

```
/dashboard                    → Main overview
/dashboard/profile           → Profile details (future)
/dashboard/gifts             → Gift pool management (future)
/dashboard/sessions          → Session history (future)
/dashboard/settings          → Settings panel (future)
```

Currently, all sections are on the main dashboard page. The navigation structure supports future expansion to dedicated pages.

## API Integration

### Expected Endpoints

```typescript
GET    /api/auth/user           // Get current user
POST   /api/auth/login          // Login
POST   /api/auth/logout         // Logout
PATCH  /api/profile             // Update profile
PATCH  /api/senior-config       // Update senior config
GET    /api/gift-pools          // Get gift pools
GET    /api/mirror-sessions     // Get sessions
```

## Styling

- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Component library
- **Framer Motion**: Animations
- **Custom CSS Variables**: Theme system

### Theme Support

The dashboard respects the existing theme system:
- Light/Dark mode (via CSS variables)
- High contrast mode
- Reduced motion
- Custom color palette

## Accessibility Features

1. **Keyboard Navigation**: Full keyboard support
2. **Screen Reader**: ARIA labels and semantic HTML
3. **Focus Management**: Visible focus indicators
4. **Color Contrast**: WCAG AA compliant
5. **Text Sizing**: Adjustable font sizes
6. **Motion**: Respects prefers-reduced-motion

## Mobile Responsiveness

- **Breakpoints**:
  - Mobile: < 768px (bottom navigation)
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

- **Touch Targets**: Minimum 44x44px
- **Safe Areas**: iOS safe area insets
- **Gestures**: Native share, copy to clipboard

## Performance Optimizations

1. **Code Splitting**: Route-based
2. **Lazy Loading**: Images and components
3. **Caching**: React Query with stale-while-revalidate
4. **Animations**: GPU-accelerated transforms
5. **Bundle Size**: Tree-shaking and minification

## Future Enhancements

### Planned Features

1. **Separate Pages**: Split dashboard into dedicated routes
2. **Analytics**: Usage statistics and insights
3. **Notifications**: Real-time updates
4. **Export**: Download transcripts and data
5. **Dark Mode Toggle**: Manual override
6. **Profile Pictures**: Avatar upload
7. **Search**: Search through sessions and transcripts
8. **Filters**: Filter sessions by date, status
9. **Pagination**: Load more sessions
10. **Collaboration**: Multiple gifters per pool

### Technical Improvements

1. **Optimistic Updates**: UI updates before server response
2. **Offline Support**: Service workers and cache
3. **Real-time**: WebSocket updates for live data
4. **Testing**: Unit and integration tests
5. **Documentation**: Storybook for components

## Component Dependencies

```
dashboard.tsx
├── DashboardLayout
│   └── Navigation components
├── StatsCard (x4)
├── ProfileCard
│   └── useAuth
├── SeniorConfigCard (conditional)
├── GiftPoolCard (conditional)
├── SessionHistory
└── SettingsPanel
    ├── AccessibilityContext
    └── LanguageContext
```

## Usage Example

```tsx
import Dashboard from "@/pages/dashboard";

// In App.tsx
<Route path="/dashboard" component={Dashboard} />

// Protected route (add middleware)
function ProtectedDashboard() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  
  return <Dashboard />;
}
```

## Development Guidelines

1. **Component Size**: Keep components under 300 lines
2. **Props**: Use TypeScript interfaces
3. **State**: Minimize local state, prefer React Query
4. **Styling**: Use Tailwind classes, avoid inline styles
5. **Accessibility**: Always include ARIA labels
6. **Error Handling**: Show user-friendly error messages
7. **Loading States**: Always show loading indicators
8. **Empty States**: Use EmptyState component

## Testing Checklist

- [ ] All routes accessible
- [ ] Authentication redirect works
- [ ] Profile updates save correctly
- [ ] Gift pools display properly
- [ ] Session history loads
- [ ] Settings persist
- [ ] Mobile navigation works
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible
- [ ] Dark mode support
- [ ] Loading states show
- [ ] Error handling works
- [ ] Animations smooth
- [ ] Copy/share functions work

## Deployment Notes

1. **Environment Variables**: Configure BASE_URL for API
2. **Build**: `npm run build`
3. **Assets**: Optimize images before deployment
4. **Cache**: Set appropriate cache headers
5. **Analytics**: Add tracking if needed
6. **Error Tracking**: Consider Sentry integration

## Support & Maintenance

- **Browser Support**: Modern browsers (last 2 versions)
- **Node Version**: 18+ recommended
- **Dependencies**: Keep packages updated
- **Security**: Regular audits with `npm audit`

