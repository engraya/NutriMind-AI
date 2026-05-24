<div align="center">

# NutriMind AI

### The intelligent nutrition companion that thinks, plans, and adapts with you.

**AI-powered meal planning · Fridge scanning · Real-time nutrition tracking · Personalized fitness plans**

---

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/status-production--ready-brightgreen?style=flat-square)]()

</div>

---

## Overview

**NutriMind AI** is a full-stack, production-grade nutrition and wellness platform that replaces generic diet apps with an intelligent, personalized experience. It combines computer vision, large language models, and evidence-based nutrition science to help users eat smarter — without the guesswork.

At its core, NutriMind answers three questions every day:

- **What should I eat?** — AI-generated meal plans tailored to your goals, allergies, and budget.
- **What can I make right now?** — Point your camera at your fridge; the app detects ingredients and suggests meals.
- **How am I doing?** — Real-time dashboards track calories, macros, hydration, and weekly trends.

Built with a culturally inclusive mindset, NutriMind has first-class support for **Nigerian cuisine** alongside global dietary patterns, making it genuinely useful for a wider audience than most Western-centric nutrition apps.

---

## Why NutriMind AI?

Most nutrition apps make you do all the work — manually searching foods, guessing portions, building plans from scratch. NutriMind flips this model:

| Problem | NutriMind's Solution |
|---|---|
| Meal planning is tedious | AI generates a personalized 7-day plan in seconds |
| You don't know what to cook | Fridge scanner detects ingredients and suggests recipes |
| Tracking macros is complex | Auto-calculated BMR/TDEE targets, real-time logging |
| Generic advice doesn't fit your life | Personalized by goal, allergies, cuisine, and activity level |
| Fitness and nutrition are disconnected | Integrated AI workout plans paired with nutrition goals |

---

## Features

### Core Features
- **Smart Dashboard** — Real-time summary of daily calories, macros, water intake, and weekly trends with interactive charts.
- **Nutrition Logging** — Log meals manually or directly from meal plans, fridge scans, or recipes. Tracks calories, protein, carbs, fat, and fiber.
- **Water Intake Tracker** — Daily hydration goal calculated at 35 ml/kg of body weight, with quick-add buttons and visual progress.
- **Analytics & Trends** — 7-day macro charts, weekly comparisons, and progress visualization powered by Recharts.

### AI Features
- **AI Nutrition Chat** — A real-time streaming conversation with a specialized nutrition assistant powered by Google Gemini. Context-aware; it knows your goals, allergies, and preferences.
- **AI Meal Planner** — Generates balanced, macro-optimized 7-day meal plans with an automatic shopping list. Supports budget tiers (low / medium / high) and prioritizes ingredients you already have.
- **Fridge Scanner** — Upload a photo of your fridge or pantry. Gemini Vision detects ingredients with confidence scores and suggests 3–5 meals you can make right now.
- **AI Recipe Recommendations** — Personalized recipe discovery based on your recent meals, preferences, and nutrition history. Enriched with images via Spoonacular.
- **AI Fitness Planner** — Generates personalized 7-day workout plans by goal (weight loss, muscle gain, endurance) and activity level, with sets, reps, and rest periods.

### Authentication
- Email/password registration with Zod-validated forms.
- Google OAuth via Supabase Auth.
- 5-step onboarding wizard that auto-calculates calorie targets using the Mifflin-St Jeor BMR formula and TDEE multipliers.
- Middleware-enforced route protection with onboarding completion checks.

### Performance
- Streaming AI responses for real-time chat and generation UX.
- Next.js App Router with SSR and server components.
- React Query v5 for optimistic updates and cache management.
- Supabase Row Level Security ensures zero cross-user data leakage at the database level.
- Cloudinary CDN for fast, globally distributed image delivery.

### Developer Experience
- Fully typed with TypeScript 5 — end-to-end from database to UI.
- ESLint 9 with strict rules.
- shadcn/ui + Radix UI for accessible, composable components out of the box.
- Zustand for lightweight, boilerplate-free state management.
- Framer Motion 12 for polished micro-animations and page transitions.

### Responsive UI
- Mobile-first design with a collapsible sidebar and mobile navigation drawer.
- Full dark/light mode support via CSS variable theming and `next-themes`.
- Custom design tokens — gradient meshes, a layered shadow system, and animated number counters.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Server Components) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion) |
| **Charts** | [Recharts](https://recharts.org) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Fonts** | Geist Sans/Mono · Plus Jakarta Sans |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs) |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query) |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| **AI Provider** | [Google Gemini Flash](https://ai.google.dev) (Text · Vision · Streaming) |
| **Database** | [Supabase](https://supabase.com) (PostgreSQL + RLS + Realtime) |
| **Authentication** | Supabase Auth (Email/Password · Google OAuth) |
| **Image Storage** | [Cloudinary](https://cloudinary.com) |
| **Recipe Images** | [Spoonacular API](https://spoonacular.com/food-api) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski) |
| **File Uploads** | [React Dropzone](https://react-dropzone.js.org) |

---

## Architecture

### Project Structure

```
nutrimindai/
├── src/
│   ├── app/
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/                # Sign-in page
│   │   │   ├── signup/               # Registration page
│   │   │   └── forgot-password/      # Password reset
│   │   ├── (dashboard)/              # Protected app routes
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── meal-planner/         # AI meal planning
│   │   │   │   └── [planId]/         # Individual plan view
│   │   │   ├── fridge-scanner/       # Vision-based ingredient detection
│   │   │   ├── chat/                 # AI nutrition assistant
│   │   │   ├── analytics/            # Nutrition trends & insights
│   │   │   ├── recipes/              # Recipe discovery
│   │   │   │   └── [recipeId]/       # Recipe detail
│   │   │   ├── grocery-list/         # Shopping list manager
│   │   │   ├── workout-plan/         # AI fitness planner
│   │   │   ├── profile/              # User profile editor
│   │   │   └── settings/             # App preferences
│   │   ├── onboarding/
│   │   │   └── [step]/               # 5-step onboarding wizard
│   │   ├── api/
│   │   │   ├── chat/                 # Gemini streaming chat
│   │   │   ├── meal-planner/         # Plan generation & management
│   │   │   ├── fridge-scanner/       # Image upload & Gemini vision
│   │   │   ├── nutrition/            # Meal logging & daily summary
│   │   │   ├── recipes/              # Recommendations & bookmarks
│   │   │   ├── grocery-list/         # List generation & management
│   │   │   ├── workout-plan/         # AI fitness generation
│   │   │   ├── profile/              # Profile CRUD
│   │   │   └── water/                # Hydration logging
│   │   ├── auth/callback/            # OAuth callback handler
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── ui/                       # shadcn/ui base components (40+)
│   │   ├── dashboard/                # Dashboard-specific widgets
│   │   ├── layout/                   # Sidebar, TopNav, MobileNav
│   │   └── [feature]/                # Feature-scoped components
│   ├── lib/
│   │   ├── supabase/                 # Browser + server Supabase clients
│   │   ├── gemini.ts                 # Google AI client configuration
│   │   ├── cloudinary.ts             # Upload and transform helpers
│   │   └── utils.ts                  # Shared utility functions
│   ├── stores/                       # Zustand state stores
│   ├── hooks/                        # Custom React hooks
│   └── types/                        # TypeScript interfaces & enums
├── middleware.ts                     # Auth + onboarding route guard
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Design tokens
└── tsconfig.json
```

### Request Flow

```
Browser Request
      │
      ▼
Next.js Middleware
(auth check + onboarding completion guard)
      │
      ▼
Server Component / API Route Handler
      │
      ├──▶ Supabase (user data, logs, plans, scans)
      │
      ├──▶ Google Gemini AI
      │        ├── Text generation  (meal plans, workouts, chat)
      │        ├── Vision analysis  (fridge scanning)
      │        └── Streaming        (chat interface)
      │
      ├──▶ Cloudinary (image upload → CDN URL)
      │
      └──▶ Spoonacular (recipe image enrichment)
                │
                ▼
         React Query (cache + optimistic updates)
                │
                ▼
         Zustand (UI state)
                │
                ▼
         Component Render (Tailwind + Framer Motion)
```

---

## Database Schema

NutriMind uses Supabase PostgreSQL with Row Level Security enforced on all user-owned tables. Every table includes a `user_id` foreign key linked to `auth.users`, `created_at` / `updated_at` timestamps with auto-update triggers, and RLS policies that restrict reads and writes to the owning user.

| Table | Purpose |
|---|---|
| `profiles` | Physical stats, nutrition targets, dietary preferences, onboarding state |
| `nutrition_logs` | Daily meal entries with calories, macros, and source tracking |
| `water_logs` | Timestamped hydration entries in milliliters |
| `meal_plans` | AI-generated weekly plans stored as JSONB |
| `fridge_scans` | Image URLs, detected ingredients, and AI meal suggestions |
| `recipes` | Shared recipe cache (Gemini + Spoonacular enriched, public-read) |
| `saved_recipes` | User recipe bookmarks (composite key: user_id + recipe_id) |
| `grocery_lists` | Shopping lists tied to meal plans, with per-item check state |
| `chat_sessions` | Full conversation history as JSONB message arrays |
| `workout_plans` | AI-generated fitness plans per user |

Performance indexes exist on `(user_id, logged_at DESC)` for nutrition and water logs, `(user_id, created_at DESC)` for meal plans and fridge scans, and `(cuisine_type, meal_type)` on the recipes table.

---

## Getting Started

### Prerequisites

- Node.js 20.19 or later
- npm 10+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- A [Cloudinary](https://cloudinary.com) account
- A [Spoonacular](https://spoonacular.com/food-api) API key

### 1. Clone the Repository

```bash
git clone https://github.com/Engraya/nutrimind-ai.git
cd nutrimind-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in your credentials — see the [Environment Variables](#environment-variables) section for a full reference.

### 4. Set Up the Database

Run the SQL migrations in your Supabase project using the Supabase CLI:

```bash
npx supabase db push
```

Enable Google OAuth in your Supabase dashboard under **Authentication → Providers → Google**, and set the redirect URL to:

```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

Create `.env.local` in the project root:

```env
# ─── Supabase ─────────────────────────────────────────────────────────────────
# Project URL — found in Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Public anon key — safe to expose in the browser
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Service role key — SERVER SIDE ONLY. Never expose to the client.
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# ─── Google Gemini AI ─────────────────────────────────────────────────────────
# API key from Google AI Studio (aistudio.google.com)
GEMINI_API_KEY=your-gemini-api-key

# ─── Cloudinary ───────────────────────────────────────────────────────────────
# Cloud name visible in your Cloudinary dashboard
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# API credentials — found in Settings → Access Keys
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Upload preset name — create one under Settings → Upload → Upload presets
CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# ─── Spoonacular ──────────────────────────────────────────────────────────────
# API key from spoonacular.com/food-api
SPOONACULAR_API_KEY=your-spoonacular-api-key

# ─── App ──────────────────────────────────────────────────────────────────────
# Public URL of your deployment (used for OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## API Reference

All routes require an authenticated Supabase session passed via cookies. Unauthenticated requests receive `401 Unauthorized`.

### Chat

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Stream a nutrition assistant response from Gemini |

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "What should I eat after a workout?" }
  ]
}
```
**Response:** `text/event-stream` — token-by-token streaming.

---

### Meal Planner

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/meal-planner/generate` | Generate a 7-day AI meal plan |
| `POST` | `/api/meal-planner/save` | Persist a generated plan |
| `GET` | `/api/meal-planner/[planId]` | Fetch a saved plan by ID |
| `PUT` | `/api/meal-planner/[planId]` | Update a plan |

**Generate request body:**
```json
{
  "calorieTarget": 2000,
  "goal": "weight_loss",
  "allergies": ["nuts"],
  "dietaryRestrictions": ["vegetarian"],
  "cuisinePreferences": ["Nigerian", "Mediterranean"],
  "budget": "medium",
  "availableIngredients": ["rice", "tomatoes", "eggs"]
}
```

---

### Fridge Scanner

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/fridge-scanner/upload` | Upload image to Cloudinary |
| `POST` | `/api/fridge-scanner/analyze` | Analyze image with Gemini Vision |

---

### Nutrition Logging

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/nutrition/log` | Log a meal entry |
| `GET` | `/api/nutrition/summary` | Get daily or weekly nutrition totals |

---

### Recipes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/recipes/recommend` | Get personalized recipe recommendations |
| `GET` | `/api/recipes/[recipeId]` | Fetch a single recipe |
| `POST` | `/api/recipes/[recipeId]/save` | Bookmark a recipe |

---

### Other Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/workout-plan/generate` | Generate a 7-day AI fitness plan |
| `POST` | `/api/water` | Log a water intake entry |
| `GET/PUT` | `/api/profile` | Fetch or update the current user's profile |
| `POST` | `/api/grocery-list/generate` | Generate a shopping list from a meal plan |
| `GET/PUT` | `/api/grocery-list/[listId]` | Fetch or update a grocery list |

---

## AI & Intelligence

NutriMind is built around **Google Gemini Flash** — a multimodal model capable of both text generation and image understanding.

### Nutrition Chat
The chat assistant uses Gemini with a specialized system prompt that frames the model as a registered nutritionist. Responses stream token-by-token via the Fetch Streaming API. The user's profile (goals, allergies, cuisine preferences) is injected into the context window so every reply is personalized, not generic.

### Meal Plan Generation
A structured prompt with strict JSON schema requirements is sent to Gemini. The response parser strips markdown fencing and retries once on parse failure before surfacing an error. Generated plans include:
- 7+ days of breakfast, lunch, dinner, and snacks
- Per-meal macro breakdown
- A deduplicated, categorized shopping list

### Fridge Scanner
Images are uploaded to Cloudinary, then passed to Gemini's vision API as base64-encoded content. Gemini returns detected ingredients with confidence scores, 3–5 meal suggestions using those ingredients, and basic nutritional estimates. Nigerian recipes (Jollof Rice, Moi Moin, Egusi Soup, etc.) are surfaced when locally relevant ingredients are detected.

### Recipe Recommendations
Gemini generates recipe ideas based on the user's meal history and preferences. Each recipe is then enriched with an image from the Spoonacular API. Failed Spoonacular lookups degrade gracefully — the recipe is returned without an image rather than failing the whole request.

### Workout Plans
Gemini generates structured 7-day fitness plans tailored to the user's fitness goal (weight loss, muscle gain, maintenance, endurance) and current activity level, with per-exercise sets, reps, rest periods, and focus area labels.

### Nutrition Calculations

| Calculation | Method |
|---|---|
| BMR | Mifflin-St Jeor formula, adjusted for gender |
| TDEE | BMR × activity multiplier (sedentary → very active) |
| Calorie target | TDEE ± goal adjustment (e.g., −500 kcal/day for weight loss) |
| Macro split | 30% protein · 45% carbs · 25% fat (default) |
| Water goal | 35 ml × body weight in kg |

---

## Performance

- **Streaming responses** — Chat and AI generation use `ReadableStream` for real-time UX without polling.
- **React Query caching** — API responses are cached client-side with configurable stale times to reduce redundant requests.
- **Server Components** — Dashboard data is pre-fetched server-side, reducing client bundle size and time-to-first-byte.
- **Cloudinary CDN** — All user-uploaded images are served via Cloudinary's global CDN with automatic format optimization.
- **Row Level Security** — Database-level security eliminates the need for application-layer data filtering on every query.
- **Zustand** — Minimal, non-reactive state management avoids unnecessary re-renders across the component tree.
- **Next.js Image Optimization** — Remote domains (Cloudinary, Google, Spoonacular) are allowlisted and served through Next.js's built-in image optimizer.

---

## Deployment

### Vercel (Recommended)

NutriMind is optimized for deployment on [Vercel](https://vercel.com):

1. Import the repository in the Vercel dashboard.
2. Add all environment variables from `.env.local` to the Vercel project settings.
3. Deploy — Vercel auto-detects Next.js and configures the build correctly.

```bash
# Or via Vercel CLI
npx vercel --prod
```

### Other Platforms

NutriMind runs on any platform that supports Node.js 20+:

- **Railway / Render** — Connect the repo, set environment variables, build command `npm run build`, start command `npm start`.
- **AWS / GCP** — Deploy as a containerized workload or to a managed Node.js service.
- **Docker** — Add a standard Node.js `Dockerfile` to containerize the app.

### Runtime Requirements

| Requirement | Value |
|---|---|
| Node.js | ≥ 20.19 |
| Build command | `npm run build` |
| Start command | `npm start` |

---

## Screenshots

> The app is running and ready for screenshots. Start the dev server with `npm run dev` to explore locally.

| View | Description |
|---|---|
| `docs/screenshots/dashboard.png` | Main dashboard — calorie summary, macros, weekly trend chart |
| `docs/screenshots/meal-planner.png` | AI-generated 7-day meal plan with shopping list |
| `docs/screenshots/fridge-scanner.png` | Ingredient detection from a fridge photo |
| `docs/screenshots/chat.png` | Real-time AI nutrition assistant |
| `docs/screenshots/analytics.png` | Weekly nutrition trends and insights |
| `docs/screenshots/mobile.png` | Responsive mobile layout |

---

## Developer Notes

### Architecture Decisions

**Supabase over Prisma/Drizzle** — The `supabase-js` client is used for direct SQL semantics, avoiding ORM abstraction overhead while leveraging Supabase's generated types, RLS integration, and realtime subscriptions in one package.

**Gemini Flash** — Selected for its speed-to-cost ratio on structured JSON generation tasks and strong multimodal capability (vision + text in one API call). JSON responses are parsed defensively — markdown fencing is stripped and parse failures trigger a single retry before surfacing an error to the client.

**Zustand over Redux/Context** — Dashboard state (active meal plan, onboarding progress, UI toggles) is lightweight. Zustand's minimal API is preferable; Redux would introduce significant boilerplate for no meaningful gain at this scale.

**Nigerian Cuisine as a Feature** — System prompts explicitly include Nigerian dishes (Jollof Rice, Moi Moi, Egusi Soup, Suya, Pepper Soup, Akara, Plantain) to ensure the AI generates culturally relevant suggestions rather than defaulting to Western cuisine. This is a deliberate product decision.

**Service Role for Recipe Inserts** — The `recipes` table uses RLS that allows anonymous reads but blocks inserts from the anon key. API routes that cache new recipes use the service role client specifically for that insert.

### Coding Conventions

- Server-only secrets (service role key, Gemini key) are accessed exclusively in API route handlers — never in components or client-side code.
- All API routes validate the user session before touching the database.
- Zod schemas are colocated with the forms that use them.
- Components under `src/components/ui/` are shadcn/ui primitives — they should only be modified to adjust design tokens or fix accessibility, not to add business logic.
- Feature-specific components live in their own subdirectory (e.g., `src/components/dashboard/`).
- Supabase query sites use explicit type assertions where TypeScript infers `never` due to complex join types, with an inline comment explaining the workaround.

---

## Future Improvements

- **Barcode scanning** — Scan packaged food barcodes to auto-populate nutrition data via the Open Food Facts API.
- **Restaurant mode** — Search nearby restaurants and estimate nutrition for menu items.
- **Macro cycling** — Support for carb cycling, refeed days, and periodized nutrition plans.
- **Wearable integration** — Sync steps and active calories from Google Fit or Apple Health to adjust daily targets dynamically.
- **Community recipes** — User-submitted recipes with moderation and public sharing.
- **Offline mode** — Service worker caching for dashboard access without internet connectivity.
- **Push notifications** — Meal reminders and hydration nudges via the Web Push API.
- **PDF export** — Downloadable weekly meal plans and grocery lists.
- **Multi-language support** — Internationalization starting with major West African languages.

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes, following the coding conventions above.

3. Lint before committing:
   ```bash
   npm run lint
   ```

4. Write a clear commit message describing what changed and why.

5. Open a Pull Request against `main` with:
   - A clear title and description
   - Screenshots for any UI changes
   - Notes on any new environment variables

### Reporting Issues

Open a GitHub Issue with steps to reproduce, expected vs. actual behavior, your Node version, and any relevant console errors or screenshots.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built by [Engraya](https://github.com/Engraya)

*Eat smart. Move well. Feel better.*

</div>
