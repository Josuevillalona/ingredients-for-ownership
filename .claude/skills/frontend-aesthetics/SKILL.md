---
name: frontend-aesthetics
description: Creates distinctive, creative frontend designs that avoid generic "AI slop" aesthetics. Use when designing UI components, choosing colors/fonts, adding animations, or improving visual design. Focuses on unique typography, cohesive themes, purposeful motion, and atmospheric backgrounds.
---

# Frontend Aesthetics

## Philosophy

Avoid converging toward generic, "on distribution" outputs that create the "AI slop" aesthetic. Instead, make creative, distinctive frontends that surprise and delight users.

## Core Principles

### 1. Typography

**Choose fonts that are beautiful, unique, and interesting.**

- **Avoid**: Generic fonts like Arial, Inter, Roboto, system fonts, Space Grotesk (overused)
- **Prefer**: Distinctive choices that elevate the frontend's aesthetics
- Consider context-specific character and unexpected pairings
- Use Google Fonts, Adobe Fonts, or custom typefaces for uniqueness

**Examples of distinctive font families:**
- Display fonts: Crimson Pro, Cormorant Garamond, Spectral, Fraunces
- Sans-serif alternatives: Archivo, Cabinet Grotesk, General Sans, Satoshi, Anybody
- Monospace: JetBrains Mono, Fira Code, IBM Plex Mono, Commit Mono
- Experimental: DM Serif Display, Playfair Display, Chivo, Epilogue

### 2. Color & Theme

**Commit to a cohesive aesthetic with intentional color choices.**

- Use CSS variables (`--color-primary`, `--color-accent`) for consistency
- **Dominant colors with sharp accents** outperform timid, evenly-distributed palettes
- Draw inspiration from:
  - IDE themes (Tokyo Night, Dracula, Nord, Catppuccin, Gruvbox)
  - Cultural aesthetics (Japanese minimalism, Memphis design, Swiss modernism)
  - Nature and physical materials
- **Avoid**: Clichéd purple gradients on white backgrounds
- Vary between light and dark themes based on context
- Consider unexpected color combinations that feel genuinely designed

**Example CSS variable structure:**
```css
:root {
  --color-primary: #...;
  --color-accent: #...;
  --color-background: #...;
  --color-surface: #...;
  --color-text: #...;
  --font-heading: '...', serif;
  --font-body: '...', sans-serif;
}
```

### 3. Motion & Animation

**Use animations for effects and micro-interactions that create delight.**

- **Prioritize**: CSS-only solutions for HTML elements
- **Use**: Motion library (Framer Motion) for React when available
- Focus on high-impact moments: one well-orchestrated page load with staggered reveals
- Use `animation-delay` to create choreographed sequences
- More impactful than scattered micro-interactions

**Key animation opportunities:**
- Page/modal entrance animations
- List item staggered reveals
- Hover states with smooth transitions
- Loading states with personality
- Success/error feedback animations

**Example staggered animation:**
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.item {
  animation: fadeInUp 0.6s ease-out forwards;
}

.item:nth-child(1) { animation-delay: 0.1s; }
.item:nth-child(2) { animation-delay: 0.2s; }
.item:nth-child(3) { animation-delay: 0.3s; }
```

### 4. Backgrounds

**Create atmosphere and depth rather than defaulting to solid colors.**

- Layer CSS gradients for richness
- Use geometric patterns (stripes, grids, dots)
- Add contextual effects that match the overall aesthetic
- Consider subtle textures, noise, or mesh gradients

**Examples:**
```css
/* Layered gradients */
background:
  linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%),
  linear-gradient(225deg, rgba(0,0,0,0.05) 0%, transparent 100%),
  #base-color;

/* Geometric pattern */
background-image:
  repeating-linear-gradient(45deg, transparent, transparent 35px,
  rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px);

/* Radial mesh effect */
background:
  radial-gradient(at 20% 30%, hsla(280,80%,60%,0.2) 0px, transparent 50%),
  radial-gradient(at 80% 70%, hsla(200,70%,50%,0.2) 0px, transparent 50%),
  #background-base;
```

## Anti-Patterns to Avoid

### Generic AI-Generated Aesthetics

❌ **Avoid these common patterns:**
- Overused font families: Inter, Roboto, Arial, system fonts, Space Grotesk
- Clichéd color schemes (purple gradients on white)
- Predictable layouts and component patterns
- Cookie-cutter design lacking context-specific character
- Safe, boring color palettes with no personality
- Generic card-based layouts with no visual hierarchy
- Timid spacing and typography scales

### How to Break the Pattern

✅ **Instead, aim for:**
- Unexpected font pairings that feel intentional
- Bold color choices that reflect the brand/context
- Unique layout approaches (asymmetry, creative grids)
- Context-specific design language
- Strong visual hierarchy and contrast
- Memorable, distinctive aesthetic choices

## Workflow

When designing or improving frontend aesthetics:

1. **Understand the context**: What is the product? Who uses it? What feeling should it evoke?
2. **Choose a distinctive direction**: Pick 2-3 aesthetic references (IDE theme, design movement, cultural style)
3. **Define the foundation**: Select unique fonts and create a cohesive color system
4. **Design with intention**: Every choice (spacing, borders, shadows) should support the aesthetic
5. **Add delight**: Identify 1-2 high-impact moments for animation
6. **Create atmosphere**: Replace flat backgrounds with layered, atmospheric alternatives
7. **Review for uniqueness**: Does this feel generic? If yes, push further.

## Examples by Context

### Dashboard/Analytics Tool
- Font: Quantico (headings) + IBM Plex Sans (body)
- Colors: Dark mode with Tokyo Night palette (deep blues, bright cyan accents)
- Motion: Staggered card reveals on dashboard load
- Background: Subtle grid pattern with gradient overlay

### Creative Portfolio
- Font: Cormorant Garamond (headings) + Spectral (body)
- Colors: Warm neutrals with burnt orange accent
- Motion: Smooth parallax scrolling, image reveal animations
- Background: Textured paper effect with gradient

### SaaS Product
- Font: Cabinet Grotesk (all text, varied weights)
- Colors: High-contrast black/white with electric lime accent
- Motion: Snappy micro-interactions, button morphing
- Background: Dynamic mesh gradient that shifts on scroll

### Internal Tool (like O'Reilly Answers QA Dashboard)
- Font: Fraunces (headings) + Commit Mono (data/code)
- Colors: Warm academic palette (deep burgundy, cream, forest green)
- Motion: Subtle fade-ins for modals, smooth transitions
- Background: Book-texture inspired gradient with subtle noise

## Critical Reminder

**You still tend to converge on common choices across generations. Avoid this: it is critical that you think outside the box!**

Vary:
- Light vs dark themes
- Different font families (avoid repeating Space Grotesk, Inter, etc.)
- Different aesthetic directions
- Unexpected but coherent combinations

Make each project feel genuinely designed for its specific context, not like a template.
