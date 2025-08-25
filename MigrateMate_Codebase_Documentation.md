# MigrateMate Cancellation Flow - Complete Codebase Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Directory Structure](#directory-structure)
4. [Core Features](#core-features)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [API Endpoints](#api-endpoints)
8. [Database Integration](#database-integration)
9. [Styling System](#styling-system)
10. [Technical Implementation Details](#technical-implementation-details)
11. [Development Workflow](#development-workflow)

---

## Project Overview

**MigrateMate** is a Next.js-based web application focused on helping users find visa-sponsored jobs. The current codebase implements a sophisticated **subscription cancellation flow** that guides users through different paths based on their job search status and provides tailored downsell offers and support.

### Key Technologies
- **Framework**: Next.js 14+ with App Router
- **Frontend**: React 18+ with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Custom component library following atomic design principles

---

## Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Database      │
│   (React/Next)  │◄──►│   (Next.js)     │◄──►│   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Design Patterns
- **Atomic Design**: Components organized as Atoms → Molecules → Organisms
- **Container/Presentational**: Smart components handle logic, dumb components handle presentation
- **Redux Slice Pattern**: Feature-based state management
- **Custom Hooks**: Business logic abstraction
- **Server Components**: Next.js App Router with RSC

---

## Directory Structure

### `/src` - Main Application Source

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # Server-side API endpoints
│   ├── cancel/            # Cancel flow page
│   ├── test/              # Development testing page
│   └── core files         # Layout, globals, providers
├── components/            # UI Component library
│   └── ui/
│       ├── atoms/         # Basic building blocks
│       ├── molecules/     # Component combinations
│       ├── organisms/     # Complex UI patterns
│       └── features/      # Feature-specific components
├── store/                 # Redux state management
├── lib/                   # Utility functions and configurations
```

---

## Core Features

### 1. Subscription Cancellation Flow
A multi-step guided process that:
- Determines if user found a job
- Provides tailored downsell offers (A/B tested)
- Collects usage feedback and cancellation reasons
- Offers visa support for successful job seekers
- Handles subscription state changes

### 2. A/B Testing System
- **Variant A**: 50% discount offer
- **Variant B**: $10 flat discount offer
- Cookie-based persistence across sessions
- Server-side variant assignment

### 3. User Profile Management
- Account information display
- Subscription status tracking
- Support contact integration
- Settings management interface

---

## Component Architecture

### Atomic Design System

#### **Atoms** (`/components/ui/atoms/`)
Basic, indivisible UI components:

- **`CTA.tsx`** - Call-to-action button component
  - Variants: primary, secondary, success, danger
  - Loading states and accessibility support
  
- **`HeaderText.tsx`** - Consistent heading typography
  - Responsive font sizing and spacing
  
- **`Radio.tsx`** - Custom radio input component
  - Full keyboard navigation and screen reader support
  
- **`TextInput.tsx`** - Form input component
  - Status states (default, success, danger)
  - Icon support and validation display

#### **Molecules** (`/components/ui/molecules/`)
Component combinations serving specific purposes:

- **`ContactNoteBanner.tsx`** - Staff contact information display
  - Avatar, name, email with formatted messaging
  
- **`DiscountBanner.tsx`** - Promotional offer display
  - Dynamic pricing and discount visualization
  
- **`SegmentedControl.tsx`** - Multi-option selector
  - Keyboard navigation and accessibility compliance
  
- **`Stepper.tsx`** - Progress indicator
  - Visual step tracking with completion states
  
- **`TextAreaWithCounter.tsx`** - Text input with character counting
  - Real-time validation and error display

#### **Modal System** (`/components/ui/molecules/modal/`)
Modular modal components:

- **`Modal.tsx`** - Base modal with backdrop and positioning
- **`ModalHeader.tsx`** - Title, navigation, and close button
- **`ModalBody.tsx`** - Scrollable content area
- **`ModalFooter.tsx`** - Action buttons with sticky positioning

#### **Organisms** (`/components/ui/organisms/cards/`)
Complex UI patterns and complete features:

- **`CancelCard.tsx`** - Initial job status inquiry
- **`CancelofferCard.tsx`** - Downsell offer presentation
- **`UsageSurveyCard.tsx`** - Service usage data collection
- **`FeedbackWishCard.tsx`** - User feedback collection
- **`CancelReasonCard.tsx`** - Cancellation reason gathering
- **`VisaSupportedCard.tsx`** - Visa assistance offering
- **`CancellationCompleteCard.tsx`** - Flow completion confirmation
- **`SubscriptionCancelledCard.tsx`** - Final cancellation state

### Feature Components (`/components/ui/features/cancelflow/`)

- **`CancelModal.tsx`** - Main orchestration component
  - Manages entire cancellation flow
  - Handles step navigation and state transitions
  
- **`TowColumnCard.tsx`** - Layout component for card designs
  - Responsive two-column layout with image support
  
- **Custom Hooks**:
  - `useAssignVariant.ts` - A/B test variant assignment
  - `useCompleteOnTerminalStep.ts` - API completion handling
  - `useStartCancellation.ts` - Flow initialization

---

## State Management

### Redux Store Configuration (`/store/`)

#### **Store Setup** (`index.ts`)
```typescript
// Configured with Redux Persist for cross-session state retention
const persistConfig = {
  key: "mm.cancelFlow.v1",
  storage,
  whitelist: ["cancelFlow"]
};
```

#### **Cancel Flow Slice** (`cancelFlowSlice.ts`)
Comprehensive state management for the entire cancellation process:

**State Structure:**
```typescript
interface CancelFlowState {
  open: boolean;                    // Modal visibility
  step: CancelStep;                 // Current flow position
  foundJob?: boolean;               // Job finding status
  offerAccepted?: boolean;          // Downsell acceptance
  survey: SurveyState;              // Usage data collection
  wishText?: string;                // User feedback
  reason: ReasonState;              // Cancellation reasoning
  visa: VisaState;                  // Visa support needs
  endDate?: string;                 // Subscription end date
  abVariant?: 'A' | 'B';           // A/B test assignment
  planCents?: number;               // Subscription pricing
}
```

**Available Actions:**
- Flow control: `openModal`, `closeModal`, `setStep`
- User journey: `setFoundJob`, `acceptOffer`
- Data collection: `setSurvey`, `setWishText`, `setReason`, `setVisa`
- System state: `setAbVariant`, `setPlanCents`

#### **Selectors**
- `selectCancel` - Main state accessor
- `selectStepper` - Progress calculation logic

---

## API Endpoints

### Cancellation Flow APIs (`/app/api/cancel/`)

#### **POST `/api/cancel/start`**
Initializes the cancellation process:
- Updates subscription status to 'pending_cancellation'
- Returns subscription ID and pricing information
- Requires `MOCK_USER_ID` environment variable

#### **POST `/api/cancel/assign`**
Handles A/B test variant assignment:
- Randomly assigns variant A or B (50/50 split)
- Sets persistent HTTP-only cookie
- Supports development override via query parameter

#### **POST `/api/cancel/complete`**
Finalizes the cancellation process:
- Validates request data with Zod schema
- Records cancellation reason in database
- Updates subscription status (active/cancelled)
- Cleans up A/B test cookies

---

## Database Integration

### Supabase Configuration (`/lib/supabase.ts`)

**Client Setup:**
- Public client for frontend operations
- Admin client with service role for API endpoints
- Environment-based configuration

**Database Tables:**
- `subscriptions` - User subscription management
- `cancellations` - Cancellation tracking and analytics

**Security:**
- Service role key for server-side operations
- XSS protection for user input sanitization
- UUID validation for subscription IDs

---

## Styling System

### Design System (`/app/globals.css`)

**Color Palette:**
```css
/* Brand Colors */
--brand-migrate-mate: #996EFF;
--brand-purple-1: #A87EFC;
--brand-purple-2: #EBE1FE;

/* Semantic Colors */
--theme-success: #4ABF71;
--theme-danger: #FF3B30;

/* Neutral Grays */
--gray-warm-100 through --gray-warm-800
```

**Typography:**
- Primary: Geist Sans font family
- Monospace: Geist Mono
- Responsive scaling with tracking adjustments

**Component Patterns:**
- Consistent spacing with gap utilities
- Border radius standards (4px, 8px, 12px)
- Shadow system for depth
- Responsive breakpoints (mobile-first)

---

## Technical Implementation Details

### Key Design Decisions

#### **Flow Management**
- State-driven step progression
- Persistent state across browser sessions
- Mobile-first responsive design
- Accessibility-compliant navigation

#### **Performance Optimizations**
- React.memo for expensive components
- useMemo for computed values
- Lazy loading for modal content
- Redux state normalization

#### **Error Handling**
- Graceful API failure recovery
- Form validation with user feedback
- Network retry mechanisms
- Fallback UI states

#### **Security Measures**
- Input sanitization (XSS protection)
- CSRF protection via HTTP-only cookies
- Environment variable validation
- SQL injection prevention

### Custom Utilities (`/lib/utils.ts`)

**`cn()` Function:**
Utility for conditional class name concatenation:
```typescript
export function cn(...classes: (string | undefined | null | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
}
```

---

## Development Workflow

### Environment Setup
1. **Required Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   MOCK_USER_ID=test_user_uuid
   ```

2. **Development Commands:**
   ```bash
   npm run dev        # Start development server
   npm run build      # Production build
   npm run lint       # Code linting
   ```

### Code Organization Principles

#### **File Naming Conventions**
- PascalCase for React components
- camelCase for utilities and hooks
- kebab-case for pages and API routes

#### **Import Organization**
1. React and Next.js imports
2. Third-party library imports
3. Internal component imports
4. Utility and type imports

#### **Component Structure**
```typescript
// Type definitions
type Props = { ... };

// Component implementation
export default function ComponentName({ ...props }: Props) {
  // Hooks and state
  // Event handlers
  // Render logic
}
```

### Testing Strategy
- Component testing with user interaction simulation
- API endpoint testing with mock data
- State management testing with Redux DevTools
- Cross-browser compatibility verification

---

## Deployment Considerations

### Production Optimizations
- Static generation for non-dynamic pages
- Image optimization with Next.js Image component
- Bundle analysis and code splitting
- Performance monitoring and analytics

### Security Checklist
- Environment variable validation
- HTTPS enforcement
- Content Security Policy headers
- Regular dependency updates

### Monitoring and Analytics
- User flow completion rates
- A/B test performance metrics
- Error tracking and reporting
- Performance monitoring

---

*This documentation serves as the complete technical reference for the MigrateMate cancellation flow codebase. It should be regularly updated as the system evolves.*
