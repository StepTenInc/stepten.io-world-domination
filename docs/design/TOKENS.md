# Design Tokens

## Colors

### Core Palette
```css
:root {
  /* Backgrounds */
  --bk: #0a0a0a;      /* Primary background */
  --dk: #111;         /* Dark surface (cards, sections) */
  --sf: #161616;      /* Surface (elevated cards) */
  --sf2: #1c1c1c;     /* Surface level 2 */
  
  /* Borders */
  --bd: #252525;      /* Default border */
  --bd2: #333;        /* Lighter border */
  
  /* Matrix Green (Primary Brand) */
  --mx: #00ff41;      /* Primary accent */
  --mx2: #00cc33;     /* Darker green */
  --mxg: rgba(0,255,65,.3);   /* Glow */
  --mxs: rgba(0,255,65,.06);  /* Subtle background */
  --mxb: rgba(0,255,65,.12);  /* Border tint */
  
  /* Text */
  --tx: #e8e8e8;      /* Primary text */
  --tx2: #999;        /* Secondary text */
  --tx3: #555;        /* Muted text */
  --tx4: #333;        /* Very muted */
}
```

### Character Accents
```css
:root {
  /* StepTen™ - The Architect */
  --ac-step: #00e5ff;
  --ac-step-g: rgba(0,229,255,.3);
  
  /* Pinky - The Schemer */
  --ac-pink: #ff00ff;
  --ac-pink-g: rgba(255,0,255,.3);
  
  /* Reina - The Coder */
  --ac-reina: #9b30ff;
  --ac-reina-g: rgba(155,48,255,.3);
  
  /* Clark - The Hero */
  --ac-clark: #ffd700;
  --ac-clark-g: rgba(255,215,0,.3);
}
```

## Typography

### Font Families
```css
:root {
  --fd: 'Orbitron', sans-serif;      /* Display - Headlines, buttons, nav */
  --fm: 'Share Tech Mono', monospace; /* Mono - Labels, code, meta */
  --fb: 'Exo 2', sans-serif;          /* Body - Paragraphs, descriptions */
}
```

### Font Sizes (Mobile-First)
```css
/* Labels/Meta */
.label { font-size: 0.5rem; letter-spacing: 0.2em; }

/* Small text */
.small { font-size: 0.7rem; }

/* Body */
.body { font-size: 0.85rem; line-height: 1.65; }

/* Headings */
h1 { font-size: clamp(1.5rem, 6vw, 3rem); }
h2 { font-size: clamp(1.2rem, 4vw, 2rem); }
h3 { font-size: clamp(1rem, 3vw, 1.5rem); }
```

## Spacing

### Safe Areas
```css
:root {
  --sab: env(safe-area-inset-bottom, 0px);
  --sat: env(safe-area-inset-top, 0px);
}
```

### Layout
```css
:root {
  --max-width: 900px;
  --content-padding: 16px;  /* Mobile */
  --nh: 72px;               /* Nav height (mobile dock) */
}

@media (min-width: 768px) {
  :root {
    --content-padding: 20px;
  }
}
```

## Easing

```css
:root {
  --ease: cubic-bezier(.16,1,.3,1);         /* Smooth decel */
  --bounce: cubic-bezier(.34,1.56,.64,1);   /* Overshoot bounce */
}
```

## Shadows & Glows

```css
/* Card shadow */
.card { box-shadow: 0 4px 24px rgba(0,0,0,.5); }

/* Glow effect (use character color) */
.glow-mx { box-shadow: 0 0 30px var(--mxg); }
.glow-step { box-shadow: 0 0 30px var(--ac-step-g); }
.glow-pink { box-shadow: 0 0 30px var(--ac-pink-g); }
.glow-reina { box-shadow: 0 0 30px var(--ac-reina-g); }
.glow-clark { box-shadow: 0 0 30px var(--ac-clark-g); }

/* Text glow */
.text-glow { text-shadow: 0 0 20px currentColor; }
```

## Z-Index Scale

```css
/* Layer order */
--z-rain: 0;       /* Matrix rain canvas */
--z-scan: 1;       /* Scanlines overlay */
--z-content: 10;   /* Main content */
--z-header: 50;    /* Fixed header */
--z-nav: 100;      /* Mobile dock */
--z-cmd: 400;      /* Command Center */
--z-orb: 500;      /* Command Orb */
--z-toast: 9999;   /* Toast notifications */
```
