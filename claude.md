# Ingredients for Ownership - Claude Code Context

## Project Overview

**Mission**: Enable health coaches to rapidly create shareable, color-coded nutrition plans for clients
**Users**: Health coaches (creators) and their clients (consumers)
**Tech Stack**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Firebase (Firestore + Auth), USDA FoodData Central API, Hugging Face AI, React PDF

## Architecture

### Frontend
- **Framework**: Next.js 14 with App Router (`/src/app`)
- **Styling**: Tailwind CSS with custom brand colors
- **State Management**: React hooks + Firebase real-time subscriptions
- **PDF Generation**: @react-pdf/renderer with base64 image encoding

### Backend
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth (Email/Password)
- **API Routes**: Next.js API routes (`/src/app/api`)
- **External APIs**:
  - USDA FoodData Central (food search)
  - Hugging Face (AI food categorization)

### Key Collections (Firestore)
```
foods/
  - Global food database
  - Categories: meat, seafood, vegetables, fruits, etc.
  - Auto-categorized via AI (regex + Hugging Face)

ingredient-documents/
  - Coach-created nutrition plans
  - Contains selected foods with color codes (blue/yellow/red)
  - Shareable via token
  - Status: draft or published

coaches/
  - User profiles for health coaches
  - Linked to Firebase Auth
```

## Color System

**Brand Colors** (Tailwind config):
- Dark: `#191B24`
- Gold: `#BD9A60`
- Cream: `#FFF7EF`
- White: `#FDFDFD`

**Food Status Colors** (Consistent across app and PDF):
- **Blue (#81D4FA)**: Approved/Therapeutic - unlimited consumption
- **Yellow (#FFC000)**: Neutral/Healthful - moderate portions
- **Red (#FF5252)**: Avoid/Occasional - limited consumption

**Important**: Color coding is ONLY assigned by coaches during plan creation, never shown in food search results.

## Key User Flows

### 1. Coach Creates Nutrition Plan
```
/dashboard/plans/create
↓
Search/Browse Foods → Assign Status (Approved/Neutral/Avoid) → Save Plan
↓
/dashboard/plans/[id] (view/edit/export)
```

### 2. Food Search (USDA Database)
```
/dashboard/foods (Manage Foods tab)
↓
Search USDA Database → Preview → Quick Save or Add to Database
```
- **Default Search**: Foundation foods only (most accurate nutritional data)
- **No color badges in search** - coaches decide colors during plan creation
- **Data types available**: Foundation (recommended), Branded, Survey

### 3. Client Views Plan
```
/share/[token]
↓
View categorized foods by color → Track completion (checkboxes)
```

### 4. PDF Export
```
/dashboard/plans/[id] → Export PDF button
↓
POST /api/export/pdf → Generate landscape PDF with:
  - Background image (base64)
  - Client name
  - Categorized foods with color dots
  - Legend explaining colors
```

## Important Code Patterns

### PDF Generation
- **Images must be base64 encoded** - React PDF doesn't support filesystem paths
- Fonts registered via `Font.register()` on first use
- Background image uses `objectFit: 'cover'` with `position: 'absolute'`

### Food Status Toggle
- Click once: Set status (approved/neutral/avoid)
- Click twice: Deselect (set to 'none')
- Implementation in `src/components/food/FoodItem.tsx`

### AI Food Categorization
- Layer 1: Regex keyword detection (fast, high confidence)
- Layer 2: Hugging Face zero-shot classification (fallback)
- Confidence threshold: 0.4 (safe with Layer 1 protection)
- Categories: meat-poultry, seafood, eggs-dairy, legumes, grains, nuts-seeds, vegetables, fruits, other

## File Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── plans/
│   │   │   ├── create/page.tsx     # Create new plan
│   │   │   ├── [id]/page.tsx       # View plan
│   │   │   └── [id]/edit/page.tsx  # Edit plan
│   │   └── foods/page.tsx          # Manage food database
│   ├── share/[token]/page.tsx      # Client view (public)
│   └── api/
│       ├── export/pdf/route.ts     # PDF generation
│       ├── foods/route.ts          # Food CRUD
│       └── fdc/                    # USDA API routes
├── components/
│   ├── food/
│   │   ├── FoodItem.tsx           # Food card with status buttons
│   │   ├── FDCFoodSearch.tsx      # USDA search interface
│   │   └── types.ts               # Status colors config
│   └── plans/
│       └── ExportPDFButton.tsx    # PDF export trigger
├── lib/
│   ├── firebase/
│   │   ├── foods.ts               # Food service
│   │   └── ingredient-documents.ts # Plan service
│   ├── pdf/
│   │   ├── pdf-generator.ts       # PDF generation logic
│   │   └── pdf-template.tsx       # PDF React component
│   └── ai/
│       └── food-categorization.ts # AI categorization
└── public/
    ├── PDF-background.png         # PDF watermark
    └── fonts/                     # Prompt font family
```

## Environment Variables

Required in `.env.local`:
```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# USDA FoodData Central
NEXT_PUBLIC_FDC_API_KEY=

# Hugging Face (AI)
HUGGINGFACE_API_KEY=
```

## Development Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run type-check   # TypeScript validation
npm run lint         # ESLint
```

## Common Tasks

### Add New Food Category
1. Update AI category list in `src/lib/ai/food-categorization.ts`
2. Add category config in `src/lib/pdf/category-mapping.ts`
3. Update coach-facing categories in `src/app/dashboard/plans/create/page.tsx`

### Modify PDF Layout
1. Edit styles in `src/lib/pdf/pdf-template.tsx` (StyleSheet)
2. Adjust component structure in same file
3. Test with sample plan export

### Update Color System
1. Modify `statusColors` in `src/components/food/types.ts`
2. Update PDF colors in `src/lib/pdf/pdf-template.tsx` (legend + dots)
3. Verify consistency across all plan views

### Debug PDF Issues
- Check browser console for PDF generation errors
- Verify images are base64 encoded (not file paths)
- Ensure fonts are loaded before PDF generation
- Test with small dataset first

## Design Principles

1. **Coach-first UX**: Hide technical complexity, show only what coaches need
2. **Mobile-first**: All interfaces responsive, touch-friendly
3. **Fast iteration**: Coaches should create plans in <15 minutes
4. **Color consistency**: Blue/Yellow/Red system used everywhere
5. **Foundation foods default**: Most accurate nutritional data for coaches

## Known Limitations

- PDF generation requires all images as base64 (no external URLs)
- USDA API has rate limits (use Foundation foods filter to reduce calls)
- AI categorization needs confidence threshold tuning per category
- Client progress tracking is local (not synced to coach dashboard yet)

## Recent Changes

**Latest commit** (2025-01-29):
- Fixed PDF background image display via base64 encoding
- Added client name to PDF header
- Standardized color system across app and PDF
- Simplified food search UX (Foundation Only default)
- Added toggle deselect for food status buttons
- Removed color badges from search results

## Support & Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide.html)
- [React PDF Docs](https://react-pdf.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
