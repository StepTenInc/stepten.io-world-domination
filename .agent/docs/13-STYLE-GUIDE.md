# 13 — Style Guide

---

## Overview

StepTen.io uses a dark-first, futuristic design with Matrix green accents. This guide ensures consistency across all pages and components.

---

## Color Palette

### Primary Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Background** | `#0a0a0a` | `--background` | Page backgrounds |
| **Background Alt** | `#111111` | `--background-alt` | Cards, elevated surfaces |
| **Background Muted** | `#171717` | `--background-muted` | Subtle sections, inputs |
| **Foreground** | `#fafafa` | `--foreground` | Primary text |
| **Foreground Muted** | `#a1a1aa` | `--foreground-muted` | Secondary text, labels |

### Accent Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Primary (Matrix Green)** | `#00FF41` | `--primary` | CTAs, highlights, active states |
| **Primary Muted** | `#00cc34` | `--primary-muted` | Hover states, subtle accents |
| **Primary Glow** | `rgba(0, 255, 65, 0.15)` | `--primary-glow` | Glow effects, shadows |

### Semantic Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Error** | `#FF4757` | `--error` | Error states, destructive actions |
| **Error Muted** | `rgba(255, 71, 87, 0.15)` | `--error-muted` | Error backgrounds |
| **Warning** | `#FBBF24` | `--warning` | Warnings, cautions |
| **Warning Muted** | `rgba(251, 191, 36, 0.15)` | `--warning-muted` | Warning backgrounds |
| **Info (Aqua)** | `#22D3EE` | `--info` | Links, info states |
| **Info Muted** | `rgba(34, 211, 238, 0.15)` | `--info-muted` | Info backgrounds |
| **Success** | `#00FF41` | `--success` | Success states (same as primary) |

### Border Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Border** | `#262626` | `--border` | Default borders |
| **Border Hover** | `#404040` | `--border-hover` | Hover state borders |
| **Border Focus** | `#00FF41` | `--border-focus` | Focus state borders |

---

## Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: {
          DEFAULT: "#0a0a0a",
          alt: "#111111",
          muted: "#171717",
        },
        // Foregrounds
        foreground: {
          DEFAULT: "#fafafa",
          muted: "#a1a1aa",
        },
        // Primary (Matrix Green)
        primary: {
          DEFAULT: "#00FF41",
          muted: "#00cc34",
          glow: "rgba(0, 255, 65, 0.15)",
        },
        // Semantic
        error: {
          DEFAULT: "#FF4757",
          muted: "rgba(255, 71, 87, 0.15)",
        },
        warning: {
          DEFAULT: "#FBBF24",
          muted: "rgba(251, 191, 36, 0.15)",
        },
        info: {
          DEFAULT: "#22D3EE",
          muted: "rgba(34, 211, 238, 0.15)",
        },
        success: {
          DEFAULT: "#00FF41",
          muted: "rgba(0, 255, 65, 0.15)",
        },
        // Borders
        border: {
          DEFAULT: "#262626",
          hover: "#404040",
          focus: "#00FF41",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        // Fluid typography
        "display-1": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-2": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "heading-1": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-2": ["2.25rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "heading-3": ["1.875rem", { lineHeight: "1.3" }],
        "heading-4": ["1.5rem", { lineHeight: "1.4" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.4" }],
      },
      spacing: {
        // Consistent spacing scale
        "4xs": "0.125rem",  // 2px
        "3xs": "0.25rem",   // 4px
        "2xs": "0.375rem",  // 6px
        "xs": "0.5rem",     // 8px
        "sm": "0.75rem",    // 12px
        "md": "1rem",       // 16px
        "lg": "1.5rem",     // 24px
        "xl": "2rem",       // 32px
        "2xl": "3rem",      // 48px
        "3xl": "4rem",      // 64px
        "4xl": "6rem",      // 96px
      },
      borderRadius: {
        "sm": "0.25rem",    // 4px
        "md": "0.5rem",     // 8px
        "lg": "0.75rem",    // 12px
        "xl": "1rem",       // 16px
        "2xl": "1.5rem",    // 24px
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(0, 255, 65, 0.15)",
        "glow-md": "0 0 20px rgba(0, 255, 65, 0.2)",
        "glow-lg": "0 0 40px rgba(0, 255, 65, 0.25)",
        "card": "0 4px 20px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 255, 65, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 255, 65, 0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## Typography

### Font Stack

| Type | Font | Fallback | Usage |
|------|------|----------|-------|
| **Primary** | Space Grotesk | system-ui, sans-serif | Headings, body text |
| **Monospace** | JetBrains Mono | monospace | Code, technical content |

### Font Loading (Next.js)

```typescript
// app/layout.tsx
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

// Apply to body
<body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}>
```

### Type Scale

| Element | Class | Size | Weight |
|---------|-------|------|--------|
| Display 1 | `text-display-1` | 4.5rem (72px) | 700 |
| Display 2 | `text-display-2` | 3.75rem (60px) | 700 |
| Heading 1 | `text-heading-1` | 3rem (48px) | 600 |
| Heading 2 | `text-heading-2` | 2.25rem (36px) | 600 |
| Heading 3 | `text-heading-3` | 1.875rem (30px) | 600 |
| Heading 4 | `text-heading-4` | 1.5rem (24px) | 600 |
| Body Large | `text-body-lg` | 1.125rem (18px) | 400 |
| Body | `text-body` | 1rem (16px) | 400 |
| Body Small | `text-body-sm` | 0.875rem (14px) | 400 |
| Caption | `text-caption` | 0.75rem (12px) | 400 |

---

## Effects & Animations

### Principles

1. **Subtle by default** — Effects enhance, not distract
2. **Consistent** — Same effect = same implementation everywhere
3. **Accessible** — Respect `prefers-reduced-motion`
4. **Performant** — Use CSS transforms, avoid layout shifts

### Reduced Motion

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Standard Effects

#### Hover Effects

```tsx
// Card hover
className="transition-all duration-300 hover:shadow-card-hover hover:border-border-hover hover:-translate-y-1"

// Button hover
className="transition-all duration-200 hover:bg-primary-muted hover:shadow-glow-sm"

// Link hover
className="transition-colors duration-200 hover:text-primary"
```

#### Glow Effects (Use Sparingly)

```tsx
// Subtle glow on focus
className="focus:shadow-glow-sm focus:border-primary"

// Button glow
className="shadow-glow-sm hover:shadow-glow-md"

// Hero element glow (hero sections only)
className="shadow-glow-lg animate-glow-pulse"
```

#### Scroll Animations (Framer Motion)

```tsx
// Fade up on scroll
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
```

#### Particle Effects

**Hero sections ONLY** — Use sparingly for visual impact on landing pages.

```tsx
// Only import on pages that need it
import { ParticleBackground } from "@/components/effects/ParticleBackground";

// Hero section only
<section className="relative">
  <ParticleBackground />
  {/* Hero content */}
</section>
```

---

## Component Patterns

### Cards

```tsx
// Base card
<div className="bg-background-alt border border-border rounded-lg p-lg transition-all duration-300 hover:border-border-hover hover:shadow-card">
  {/* Content */}
</div>

// Interactive card
<div className="bg-background-alt border border-border rounded-lg p-lg transition-all duration-300 hover:border-border-hover hover:shadow-card-hover hover:-translate-y-1 cursor-pointer">
  {/* Content */}
</div>
```

### Buttons

```tsx
// Primary button
<button className="bg-primary text-background font-semibold px-lg py-sm rounded-md transition-all duration-200 hover:bg-primary-muted hover:shadow-glow-sm">
  Button Text
</button>

// Secondary button
<button className="bg-transparent border border-border text-foreground font-semibold px-lg py-sm rounded-md transition-all duration-200 hover:border-primary hover:text-primary">
  Button Text
</button>

// Ghost button
<button className="bg-transparent text-foreground-muted font-medium px-md py-xs rounded-md transition-colors duration-200 hover:text-foreground hover:bg-background-muted">
  Button Text
</button>
```

### Inputs

```tsx
// Text input
<input 
  className="w-full bg-background-muted border border-border rounded-md px-md py-sm text-foreground placeholder:text-foreground-muted transition-all duration-200 focus:outline-none focus:border-primary focus:shadow-glow-sm"
  placeholder="Enter text..."
/>
```

### Links

```tsx
// Inline link
<a className="text-info underline-offset-4 hover:underline transition-colors duration-200 hover:text-primary">
  Link text
</a>

// Navigation link
<a className="text-foreground-muted transition-colors duration-200 hover:text-foreground">
  Nav item
</a>
```

### Badges / Status

```tsx
// Active/Success
<span className="inline-flex items-center px-xs py-4xs text-caption font-medium bg-success-muted text-success rounded-full">
  Active
</span>

// Warning
<span className="inline-flex items-center px-xs py-4xs text-caption font-medium bg-warning-muted text-warning rounded-full">
  Pending
</span>

// Error
<span className="inline-flex items-center px-xs py-4xs text-caption font-medium bg-error-muted text-error rounded-full">
  Error
</span>

// Info
<span className="inline-flex items-center px-xs py-4xs text-caption font-medium bg-info-muted text-info rounded-full">
  Info
</span>
```

---

## Layout Rules

### Spacing

| Context | Spacing |
|---------|---------|
| Page padding (mobile) | `px-md` (16px) |
| Page padding (desktop) | `px-xl` to `px-3xl` |
| Section spacing | `py-3xl` to `py-4xl` |
| Card padding | `p-lg` (24px) |
| Component gap (tight) | `gap-xs` to `gap-sm` |
| Component gap (normal) | `gap-md` to `gap-lg` |
| Component gap (loose) | `gap-xl` to `gap-2xl` |

### Max Widths

```tsx
// Content container
<div className="max-w-7xl mx-auto px-md lg:px-xl">

// Narrow content (articles, forms)
<div className="max-w-3xl mx-auto">

// Wide content (dashboards)
<div className="max-w-full">
```

### Grid

```tsx
// Standard grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">

// Dashboard grid
<div className="grid grid-cols-12 gap-md">
```

---

## Dark Mode Only

StepTen is **dark mode only**. No light mode toggle needed.

```tsx
// In layout.tsx, force dark class
<html className="dark">
```

```css
/* In globals.css */
:root {
  color-scheme: dark;
}
```

---

## DO's and DON'Ts

### DO

✅ Use CSS variables / Tailwind classes for all colors
✅ Use the spacing scale (xs, sm, md, lg, xl)
✅ Use consistent border-radius (rounded-md, rounded-lg)
✅ Add transitions to interactive elements
✅ Test contrast ratios for text
✅ Use semantic color names (error, warning, info)

### DON'T

❌ Hardcode hex colors in components
❌ Use white (`#fff`) without checking contrast
❌ Create custom animations without adding to config
❌ Use different hover effects on similar components
❌ Add particle effects outside hero sections
❌ Forget reduced-motion support
❌ Use inconsistent spacing (avoid arbitrary values)

---

## Contrast Reference

| Background | Text Color | Contrast Ratio | Pass? |
|------------|------------|----------------|-------|
| `#0a0a0a` | `#fafafa` | 19.3:1 | ✅ AAA |
| `#0a0a0a` | `#a1a1aa` | 7.2:1 | ✅ AAA |
| `#0a0a0a` | `#00FF41` | 12.1:1 | ✅ AAA |
| `#0a0a0a` | `#22D3EE` | 10.8:1 | ✅ AAA |
| `#111111` | `#fafafa` | 17.9:1 | ✅ AAA |
| `#171717` | `#fafafa` | 15.8:1 | ✅ AAA |

All color combinations pass WCAG AAA standards.
