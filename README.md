# Migrate Mate - Subscription Cancellation Flow Challenge
👉 For architecture overview, file structure and key implementation notes, see the **[Implementation Notes (What I built)](#implementation-notes-what-i-built)** section near the bottom of this document.

## 📝 PS Note

**Important Setup Reminders:**

1. **Environment Variables**: Make sure to create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   MOCK_USER_ID=user_id_you_want_to_test_with
   ```

2. **Testing the Cancellation Flow**: 
   - Set `MOCK_USER_ID` to a valid user ID from your database to test subscription cancellation
   - On the home page, click "Cancel Migrate" button
   - A modal will popup to start the cancellation flow

3. **Database Setup**: Ensure you've run the `seed.sql` file to populate your Supabase database with test users and the cancellations table structure.


## Overview

Convert an existing Figma design into a fully-functional subscription-cancellation flow for Migrate Mate. This challenge tests your ability to implement pixel-perfect UI, handle complex business logic, and maintain security best practices.

## Objective

Implement the Figma-designed cancellation journey exactly on mobile + desktop, persist outcomes securely, and instrument the A/B downsell logic.

## What's Provided

This repository contains:

* ✅ Next.js + TypeScript + Tailwind scaffold
* ✅ `seed.sql` with users table (25/29 USD plans) and empty cancellations table
* ✅ Local Supabase configuration for development
* ✅ Basic Supabase client setup in `src/lib/supabase.ts`

## Tech Stack (Preferred)

* **Next.js** with App Router
* **React** with TypeScript
* **Tailwind CSS** for styling
* **Supabase** (Postgres + Row-Level Security)

> **Alternative stacks allowed** if your solution:
>
> 1. Runs with `npm install && npm run dev`
> 2. Persists to a Postgres-compatible database
> 3. Enforces table-level security

## Must-Have Features

### 1. Progressive Flow (Figma Design)

* Implement the exact cancellation journey from provided Figma
* Ensure pixel-perfect fidelity on both mobile and desktop
* Handle all user interactions and state transitions

### 2. Deterministic A/B Testing (50/50 Split)

* **On first entry**: Assign variant via cryptographically secure RNG
* **Persist** variant to `cancellations.downsell_variant` field
* **Reuse** variant on repeat visits (never re-randomize)

**Variant A**: No downsell screen
**Variant B**: Show "\$10 off" offer

* Price \$25 → \$15, Price \$29 → \$19
* **Accept** → Log action, take user back to profile page (NO ACTUAL PAYMENT PROCESSING REQUIRED)
* **Decline** → Continue to reason selection in flow

### 3. Data Persistence

* Mark subscription as `pending_cancellation` in database
* Create cancellation record with:

  * `user_id`
  * `downsell_variant` (A or B)
  * `reason` (from user selection)
  * `accepted_downsell` (boolean)
  * `created_at` (timestamp)

### 4. Security Requirements

* **Row-Level Security (RLS)** policies
* **Input validation** on all user inputs
* **CSRF/XSS protection**
* Secure handling of sensitive data

### 5. Reproducible Setup

* `npm run db:setup` creates schema and seed data (local development)
* Clear documentation for environment setup

## Out of Scope

* **Payment processing** - Stub with comments only
* **User authentication** - Use mock user data
* **Email notifications** - Not required
* **Analytics tracking** - Focus on core functionality

## Getting Started

1. **Clone this repository** `git clone [repo]`
2. **Install dependencies**: `npm install`
3. **Set up local database**: `npm run db:setup`
4. **Start development**: `npm run dev`

## Database Schema

The `seed.sql` file provides a **starting point** with:

* `users` table with sample users
* `subscriptions` table with \$25 and \$29 plans
* `cancellations` table (minimal structure - **you'll need to expand this**)
* Basic RLS policies (enhance as needed)

### Important: Schema Design Required

The current `cancellations` table is intentionally minimal. You'll need to:

* **Analyze the cancellation flow requirements** from the Figma design
* **Design appropriate table structure(s)** to capture all necessary data
* **Consider data validation, constraints, and relationships**
* **Ensure the schema supports the A/B testing requirements**

## Evaluation Criteria

* **Functionality (40%)**: Feature completeness and correctness
* **Code Quality (25%)**: Clean, maintainable, well-structured code
* **Pixel/UX Fidelity (15%)**: Accuracy to Figma design
* **Security (10%)**: Proper RLS, validation, and protection
* **Documentation (10%)**: Clear README and code comments

## Deliverables

1. **Working implementation** in this repository
2. **NEW One-page README.md (replace this)** (≤600 words) explaining:

   * Architecture decisions
   * Security implementation
   * A/B testing approach
3. **Clean commit history** with meaningful messages

## Timeline

Submit your solution within **72 hours** of receiving this repository.

## AI Tooling

Using Cursor, ChatGPT, Copilot, etc. is **encouraged**. Use whatever accelerates your development—just ensure you understand the code and it runs correctly.

## Questions?

Review the challenge requirements carefully. If you have questions about specific implementation details, make reasonable assumptions and document them in your README.

---

## Implementation Notes (What I built)

* **State & persistence:** Redux Toolkit + `redux-persist` (localStorage) for a durable, resume-able flow.
* **Flow orchestration:** A single `CancelFlowModal` renders “cards” (organisms) and drives steps via Redux.
* **Deterministic A/B:** Variant assigned once (secure RNG) and stored in an HttpOnly cookie; reused on return and written to `cancellations.downsell_variant`.
* **Server APIs:** App Router routes write to Supabase (`start` marks `pending_cancellation`; `complete` inserts into `cancellations` and flips `subscriptions.status` to `active` or `cancelled`). On complete, the A/B cookie is cleared for fresh test runs.
* **Security:** zod validation for inputs, `xss` sanitize for free-text reason, basic same-origin assumption, and RLS-enabled tables.
* **DX:** Centralized “complete-on-terminal-step” hook so *every* end screen records exactly once without duplicate API code.

## File Structure (key paths)

```text
src/
  features/
    cancel-flow/
      CancelFlowModal.tsx            # orchestrates the whole flow (UI only)
      lib.ts                         # pure helpers (money, computeOffer, buildReasonFromState, TERMINAL_STEPS)
      hooks/
        useAssignVariant.ts          # assigns A/B once (Strict Mode-safe, dev override supported)
        useStartCancellation.ts      # calls /api/cancel/start; returns subscription_id; sets planCents
        useCompleteOnTerminalStep.ts # posts /api/cancel/complete when step is terminal
  store/
    cancelFlowSlice.ts               # Redux slice: steps, survey/reason/visa, abVariant, planCents
    cancelFlowSelectors.ts           # memoized selectors (e.g., stepper)
    index.ts                         # RTK store + redux-persist configuration
    hooks.ts                         # typed useAppDispatch/useAppSelector
  app/
    api/
      cancel/
        assign/route.ts              # picks & sets A/B cookie via secure RNG
        start/route.ts               # marks subscription pending; returns subscription_id + price_cents
        complete/route.ts            # inserts cancellation; sets subscription status; clears A/B cookie
  ui/
    atoms/                           # buttons, inputs, headings (primitives)
    molecules/                       # Stepper, Modal pieces, DiscountBanner, etc.
    organisms/
      cards/
        CancelOfferCard.tsx
        CancelReasonCard.tsx
        UsageSurveyCard.tsx
        FeedbackWishCard.tsx
        VisaSupportCard.tsx
        OfferAcceptedCard.tsx
        SubscriptionCancelledCard.tsx
        CancellationCompleteCard.tsx
```

## Main Files — One-liners

* `features/cancel-flow/CancelFlowModal.tsx` — Renders the correct card per step; no business logic beyond dispatching.
* `features/cancel-flow/lib.ts` — Pricing/copy helpers + reason builder and terminal step set.
* `features/cancel-flow/hooks/useAssignVariant.ts` — One-time A/B assignment with dev override; Strict-Mode deduped.
* `features/cancel-flow/hooks/useStartCancellation.ts` — Starts flow in DB; returns `subscription_id`; hydrates plan price.
* `features/cancel-flow/hooks/useCompleteOnTerminalStep.ts` — Posts completion exactly once on final steps.
* `store/cancelFlowSlice.ts` — Canonical state machine for the flow with typed actions.
* `store/cancelFlowSelectors.ts` — Memoized selectors (e.g., stepper position).
* `store/index.ts` — RTK store + `redux-persist` (ignores persist actions for serializable check).
* `app/api/cancel/assign/route.ts` — Sets `mm_downsell_variant` cookie (`A`/`B`).
* `app/api/cancel/start/route.ts` — `status='pending_cancellation'`, returns price & `subscription_id`.
* `app/api/cancel/complete/route.ts` — Inserts cancellation, flips subscription to `active` (accepted) or `cancelled`, clears cookie.
* `ui/molecules/DiscountBanner.tsx` — Banner UI; accepts custom headline/price props for A/B copy.
* `ui/organisms/cards/*` — Presentational screens mapped 1:1 to the Figma cards.
