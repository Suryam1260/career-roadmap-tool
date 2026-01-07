# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

All development happens in the `frontend/` directory. Navigate there first:

```bash
cd frontend
```

**Primary Commands:**
- `npm install` - Install dependencies
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run Next.js linter

**Note:** The root-level `package.json` only contains shared Tailwind config. Always work from `frontend/`.

## Architecture Overview

### Tech Stack
- **Framework:** Next.js 13 (Pages Router) with React 18
- **Styling:** Tailwind CSS + Styled Components (hybrid approach)
- **State:** React Context API via `UnifiedContext`
- **Components:** Radix UI primitives + custom shadcn/ui components
- **Charts:** Recharts for radar/skill visualizations
- **Icons:** Phosphor React + Lucide React

### Application Flow

```
Quiz (index.js)
  → User answers questions about background, experience, target role
  → QuizOrchestrator manages state

Persona Matching (personaCalculator.js)
  → Determines which persona file to load based on responses
  → Format: {level}_{background}_{role}.json (e.g., "mid_tech_backend.json")
  → 12 core personas in public/personas/complete/

Roadmap Generation (roadmap-experimental-v2.js)
  → Loads matched persona JSON
  → Displays personalized learning path, skills, company fit
  → All data is static JSON (no LLM generation at runtime)
```

### State Management - UnifiedContext

The entire app uses a single `UnifiedContext` ([src/context/UnifiedContext.js](frontend/src/context/UnifiedContext.js)) that manages:
- **Profile data:** Quiz responses, user background, target role
- **Roadmap data:** Current skills, timeline preference, generated roadmap
- **UI state:** Loading, errors

**Key methods:**
- `setQuizResponse(question, answer)` - Store quiz answers
- `setProfileData(data)` - Set profile from evaluator
- `setRoadmap(roadmap)` - Load matched persona as roadmap
- `resetAll()` - Clear all state and localStorage

**Persistence:** State auto-saves to localStorage with 24-hour TTL. SSR-safe.

**Backward compatibility:** Exports `useProfile()` and `useRoadmap()` hooks as aliases for legacy code.

### Persona System

Personas are pre-generated JSON files that define complete roadmaps. No runtime LLM calls.

**Structure:**
- **Location:** `frontend/public/personas/complete/`
- **Naming:** `{level}_{background}_{role}.json`
  - Levels: `entry`, `mid`, `senior`
  - Backgrounds: `tech`, `nontech`
  - Roles: `backend`, `frontend`, `fullstack`, `devops`, `data`

**Matching Logic:** ([src/utils/personaCalculator.js](frontend/src/utils/personaCalculator.js))
1. Normalize quiz responses (background, experience, role)
2. Construct filename: `mid_tech_backend.json`
3. Load from public directory

**Persona JSON Schema:**
- `targetRole` - Role title
- `skills` - Array of skill objects with priority scores
- `learningPath` - Phased timeline with resources
- `companyFit` - Fit scores for startup/scaleup/bigtech
- `projects` - Portfolio project recommendations by tier

### Page Structure

**Key Pages:**
- [pages/index.js](frontend/pages/index.js) - Landing/Quiz entry (redirects to quiz flow)
- [pages/quiz.js](frontend/pages/quiz.js) - Quiz page
- [pages/roadmap-experimental-v2.js](frontend/pages/roadmap-experimental-v2.js) - **Primary roadmap results page**
- [pages/admin/](frontend/pages/admin/) - Admin tools for persona management
- [pages/_app.js](frontend/pages/_app.js) - App wrapper with providers and analytics

**Current Flow:** User completes quiz → redirects to `/roadmap-experimental-v2`

### Component Organization

**Quiz Components:** ([src/components/quiz/](frontend/src/components/quiz/))
- `QuizOrchestrator.js` - Manages multi-step quiz flow, validation, navigation
- `QuizUI.js` - Renders questions with animations (Framer Motion)
- `QuizConfig.js` - Question definitions and validation rules

**Roadmap Components:** ([src/components/roadmap-new/](frontend/src/components/roadmap-new/))
- `Hero.jsx` - Landing section with stats and founder video
- `CompanyTicker.jsx` - Animated company logo carousel
- `Navbar.jsx` - Roadmap page navigation

**shadcn/ui Components:** ([src/components/ui/](frontend/src/components/ui/))
- Custom implementation of shadcn patterns (not CLI-installed)
- Components: Button, Card, Tabs, Accordion, Badge
- Styling: Tailwind + CVA (class-variance-authority)

### Key Utilities

**Persona & Roadmap Generation:**
- [src/utils/personaCalculator.js](frontend/src/utils/personaCalculator.js) - Determines which persona file to load
- [src/utils/personaLoader.js](frontend/src/utils/personaLoader.js) - Loads persona JSON files
- [src/utils/learningPathCalculator.js](frontend/src/utils/learningPathCalculator.js) - Processes learning phases
- [src/utils/fitCalculator.js](frontend/src/utils/fitCalculator.js) - Calculates company fit scores

**Analytics:**
- [src/utils/analytics.js](frontend/src/utils/analytics.js) - UTM tracking initialization
- [src/utils/tracker.js](frontend/src/utils/tracker.js) - Event tracking wrapper
- [src/utils/gtm.js](frontend/src/utils/gtm.js) - Google Tag Manager integration

All analytics events use the `PRODUCTS.CRT_PAGE` constant.

### Authentication

**Context:** [src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx) + [src/context/RequestCallbackContext.jsx](frontend/src/context/RequestCallbackContext.jsx)

**Flow:**
- `AuthGate` component (in `_app.js`) wraps non-admin pages
- Checks user session and redirects if needed
- Admin pages bypass AuthGate (they have own auth)

### Backend (Python)

The `backend/` directory contains Python utility scripts:
- `skills_analysis.py` - Skill prioritization algorithms
- `priority_data.py` - Priority scoring data

**Note:** These are reference files. Current production uses frontend-only persona loading (static JSON). No Python runtime required.

### Environment Variables

**Required in production:**
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (defaults to http://localhost:8000)
- `ADMIN_USERNAME` - Admin panel username
- `ADMIN_PASSWORD` - Admin panel password

**Built-in constants:**
- `NEXT_PUBLIC_BASE_PATH` - Set to `/career-roadmap-tool` (for Scaler.com integration)

## Configuration Files

- [next.config.js](frontend/next.config.js) - basePath: `/career-roadmap-tool`, styled-components compiler, SVG-as-components
- [tailwind.config.js](frontend/tailwind.config.js) - Plus Jakarta Sans font, sharp corners (0px radius), brand color #B30158
- [.babelrc](frontend/.babelrc) - Styled-components SSR support
- [amplify.yml](amplify.yml) - AWS Amplify deployment config

## Development Notes

### Working with Personas

When modifying persona files:
1. Files are in `frontend/public/personas/complete/`
2. Follow naming convention: `{level}_{background}_{role}.json`
3. Maintain schema consistency (skills, learningPath, companyFit, projects)
4. Test matching logic in [personaCalculator.js](frontend/src/utils/personaCalculator.js)

### Styling Approach

The codebase uses **both** Tailwind and Styled Components:
- **Tailwind:** New components (shadcn/ui, roadmap-new)
- **Styled Components:** Legacy components (quiz, older roadmap sections)

**When adding new components:** Prefer Tailwind + CVA pattern (see [src/components/ui/](frontend/src/components/ui/) for examples).

### Quiz Modifications

All quiz questions are in [QuizConfig.js](frontend/src/components/quiz/QuizConfig.js):
- Each question has: `id`, `type`, `question`, `options`, `validation`
- Conditional questions use `showIf` function
- Validation rules ensure data quality before submission

To add a new question:
1. Add to `questions` array in QuizConfig.js
2. Update matching logic in [personaCalculator.js](frontend/src/utils/personaCalculator.js) if needed
3. Update `quizResponses` type in UnifiedContext if tracking new field

### localStorage Behavior

`UnifiedContext` auto-persists to `localStorage` key `scalerCareerRoadmapState`:
- Saves on every state change
- 24-hour TTL (auto-clears stale data)
- SSR-safe (skips during server render)

**To debug:** Check `localStorage.getItem('scalerCareerRoadmapState')` in browser console.

## Deployment

**AWS Amplify:** Uses [amplify.yml](amplify.yml)
- Build command: `npm run build` (in frontend/)
- Build artifacts: `.next/` directory
- Caches: `.next/cache/` and `.npm/`

**Render:** See [frontend/README.md](frontend/README.md) deployment section
- Build: `npm install && npm run build`
- Start: `npm start`
- Node version: 18.x

## Common Patterns

### Adding a New Roadmap Section

1. Create component in `frontend/src/components/roadmap-new/`
2. Import in `pages/roadmap-experimental-v2.js`
3. Access roadmap data via `useUnified()` hook
4. Follow Tailwind + shadcn/ui patterns

### Tracking Analytics Events

```javascript
import tracker from '@/utils/tracker';

tracker.track('event_name', {
  // event properties
  skill_name: 'React',
  user_level: 'mid'
});
```

### Loading Persona Data

```javascript
import { determinePersonaFile } from '@/utils/personaCalculator';
import { loadPersona } from '@/utils/personaLoader';

const filename = determinePersonaFile(quizResponses);
const persona = await loadPersona(filename);
setRoadmap(persona); // Save to UnifiedContext
```

## Migration Notes

The codebase is migrating from custom components to shadcn/ui. See [MIGRATION_PROGRESS.md](frontend/MIGRATION_PROGRESS.md) for status.

**Active routes:**
- `/roadmap-experimental-v2` - Primary roadmap (uses new components)
- `/roadmap`, `/roadmap-new` - Legacy routes (still functional)

When refactoring, prefer `/roadmap-experimental-v2` path and new component patterns.
