# StepTen™ Universe — Style Guide & Character System

## 1. THE AESTHETIC DNA

**Genre:** Cyberpunk Comic Art — Matrix code rain meets GTA character portraits meets 90s Saturday morning cartoon nostalgia, all filtered through a hacker aesthetic.

**Core Feeling:** You're inside a simulation built by someone who grew up on He-Man, Captain Planet, and South Park, and is now running an army of AI agents from a BPO empire in the Philippines.

---

## 2. COLOR SYSTEM

### Base Palette (Never Changes)
| Token | Hex | Usage |
|-------|-----|-------|
| `--st-black` | `#0a0a0a` | Primary background |
| `--st-dark` | `#111111` | Card/surface background |
| `--st-matrix-green` | `#00ff41` | Code rain, data streams, terminal text |
| `--st-matrix-green-dim` | `#00cc33` | Secondary green elements |
| `--st-matrix-green-glow` | `rgba(0,255,65,0.3)` | Green glow/bloom effects |
| `--st-white` | `#f0f0f0` | Primary text |
| `--st-grey` | `#888888` | Secondary text |

### Character Accent Colors
Each character has ONE signature accent color that pops against the green/black base:

| Character | Token | Hex | Glow |
|-----------|-------|-----|------|
| **StepTen™ (You)** | `--accent-stepten` | `#00e5ff` | Cyan/Electric Blue |
| **Pinky** | `--accent-pinky` | `#ff00ff` | Hot Pink/Magenta |
| **Reina** | `--accent-reina` | `#9b30ff` | Purple/Violet |
| **Clark Kent** | `--accent-clark` | `#ffd700` | Gold/Yellow |
| **[Future Character]** | `--accent-x` | `#ff4500` | Orange Red |
| **[Future Character]** | `--accent-x` | `#ff0033` | Crimson |

### Color Rules
1. **Background is ALWAYS black** — `#0a0a0a` to `#111111` range
2. **Matrix green is ALWAYS present** — code rain, data overlays, circuit traces
3. **One accent color per character** — it bleeds into lightning, glow effects, highlights
4. **No white backgrounds. Ever.**
5. **Gradients only between black → accent color** or **accent → matrix green**

---

## 3. VISUAL ELEMENTS

### 3.1 The Matrix Code Rain
Present in EVERY piece of art and on every page. Variations:
- **Background rain**: Vertical streams of green characters, varying opacity (0.05–0.3)
- **Character rain**: Denser, brighter, mixed with accent color
- **Interactive rain**: Responds to mouse/scroll on the website

### 3.2 Lightning/Energy
- Cracks of lightning in the character's accent color
- Originates from behind/around the character
- Creates a sense of power/electricity
- On web: animated with CSS/canvas

### 3.3 Circuit Board Traces
- Thin green lines forming PCB-style patterns
- Visible in backgrounds, sometimes overlaid on characters
- Mix of straight lines with 90° turns and dots at nodes

### 3.4 Candlestick/Trading Bars
- Vertical bars resembling stock charts scattered in background
- In the accent color, varying heights
- Represents the crypto/trading aspect

### 3.5 Data Overlays
- Floating text snippets, code fragments
- Character mottos or personality traits as text in the background
- e.g., "ENJOY LIFE", "MAKE MONEY", "GET LOOSE" (from your avatar)

### 3.6 Particle/Dust Effects
- Small dots/particles in accent color
- Concentrated around the character, dispersing outward
- Gives depth and atmosphere

---

## 4. CHARACTER ART STYLE

### Art Direction
- **Style**: Digital comic book / graphic novel illustration
- **Line work**: Clean, bold outlines with comic-style shading
- **Shading**: Cell-shaded with strong contrast, not photorealistic
- **Proportions**: Slightly stylized — larger heads, expressive features
- **Eyes**: Always behind glasses/sunglasses with code/data reflected in lenses
- **Outfit**: Black t-shirt/dark clothing as base (consistent across all characters)
- **Background**: Always the Matrix-style code rain + accent color effects

### Consistent Elements Across ALL Characters
1. ✅ Glasses/sunglasses with data/code reflection in lenses
2. ✅ Black/dark clothing base
3. ✅ Matrix code rain background
4. ✅ Lightning/energy in their accent color
5. ✅ Circuit board trace elements
6. ✅ Comic book illustration style (not photorealistic)
7. ✅ Bust/portrait crop (head to upper chest)
8. ✅ Square aspect ratio (1:1)
9. ✅ Dark background, never white/light

---

## 5. AI IMAGE PROMPT TEMPLATE

Use this template structure to generate consistent characters:

```
[CHARACTER DESCRIPTION], digital comic book illustration style, bold clean 
line art, cell-shaded, [EXPRESSION], wearing [OUTFIT - default: black t-shirt], 
wearing [GLASSES TYPE] with green matrix code reflecting in the lenses, 
[CHARACTER'S ACCENT COLOR] lightning bolts and energy crackling in the 
background, dark black background with falling green matrix code rain and 
binary numbers, [ACCENT COLOR] glowing candlestick chart bars scattered in 
background, circuit board trace patterns in green, [ACCENT COLOR] particle 
effects and dust, cyberpunk atmosphere, GTA character portrait style, 
square format, bust portrait head to upper chest, high contrast, 
dark moody lighting with [ACCENT COLOR] rim lighting
```

### Example Prompts:

**StepTen™ (You):**
```
Athletic Australian man, short buzzed hair, confident wide grin laughing, 
wearing black snapback trucker cap with white front panel, wearing AirPods, 
blue-framed sunglasses with green matrix code reflecting in lenses, digital 
comic book illustration style, bold clean line art, cell-shaded, wearing 
black t-shirt, cyan blue (#00e5ff) lightning bolts and energy crackling 
in background, dark black background with falling green matrix code rain, 
cyan blue glowing candlestick chart bars, circuit board traces in green, 
floating text "ENJOY LIFE" "MAKE MONEY" "GET LOOSE", cyberpunk atmosphere, 
GTA character portrait style, square 1:1, bust portrait, high contrast, 
dark moody lighting with cyan blue rim lighting
```

**Pinky (The Rat):**
```
Anthropomorphic cartoon rat character, grey fur, large round ears, 
mischievous grinning expression showing buck teeth, wearing small 
rectangular glasses with green matrix code reflecting in lenses, 
inspired by Pinky from Pinky and the Brain but cyberpunk styled, 
digital comic book illustration, bold clean line art, cell-shaded, 
wearing black t-shirt, hot pink magenta (#ff00ff) lightning bolts 
and energy in background, dark black background with falling green 
matrix code rain, pink glowing candlestick bars, circuit board traces, 
pink particle dust effects, cyberpunk atmosphere, GTA character portrait 
style, square 1:1, bust portrait, high contrast, dark moody lighting 
with magenta rim lighting
```

**Reina (Gamer Girl):**
```
Beautiful young Asian woman, shoulder-length black hair with purple 
highlights/streaks, confident cool expression with slight lip bite, 
wearing rectangular dark-framed glasses with green matrix code reflecting 
in lenses, silver hoop earrings, multiple ear piercings, eyebrow piercing, 
beauty mark on cheek, black leather choker necklace, digital comic book 
illustration, bold clean line art, cell-shaded, wearing black spaghetti 
strap top, purple violet (#9b30ff) glow effects in background, dark black 
background with falling green matrix code rain and data windows, circuit 
board traces in green, cyberpunk atmosphere, GTA character portrait style, 
square 1:1, bust portrait, high contrast, dark moody lighting with purple 
rim lighting
```

**Clark Kent (Superman Alter-Ego):**
```
Clean-cut muscular man, dark slicked-back hair with one curl falling on 
forehead, strong jaw, confident heroic smile, wearing thick-rimmed Clark 
Kent style glasses with green matrix code reflecting in lenses, digital 
comic book illustration, bold clean line art, cell-shaded, wearing black 
t-shirt slightly tight showing physique, golden yellow (#ffd700) lightning 
bolts and energy in background, dark black background with falling green 
matrix code rain, gold glowing candlestick bars, circuit board traces, 
gold particle effects, cyberpunk atmosphere, GTA character portrait style, 
square 1:1, bust portrait, high contrast, dark moody lighting with golden 
yellow rim lighting
```

---

## 6. 86–2000 ERA CHARACTER ROSTER (Potential)

Characters inspired by your life/pop culture — all reimagined in the StepTen cyberpunk style:

| Era | Inspiration | Character Name | Accent Color | Personality Trait |
|-----|------------|----------------|-------------|-------------------|
| 80s | He-Man | TBD | Gold | Raw Power |
| 80s | Ultimate Warrior | TBD | Neon Rainbow | Intensity |
| 90s | Captain Planet | TBD | Earth Green/Teal | The Environmentalist |
| 90s | Pinky & The Brain | Pinky | Magenta | The Schemer |
| 90s | South Park | TBD | Orange | The Irreverent |
| 90s | The Simpsons | TBD | Yellow | The Everyman |
| 90s | Street Fighter | TBD | Red | The Fighter |
| 90s | Dragon Ball Z | TBD | Orange/Yellow | The Ascender |
| 00s | The Matrix | StepTen™ | Cyan | The Architect |
| 00s | GTA | TBD | Red | The Hustler |

Each gets the same art treatment: cyberpunk comic style, black/green base, unique accent, data glasses.

---

## 7. WEB DESIGN SYSTEM

### Typography
- **Display/Headers**: `'Orbitron'` or `'Rajdhani'` — angular, techy, futuristic
- **Body**: `'Share Tech Mono'` or `'JetBrains Mono'` — monospace terminal feel
- **Accent/Labels**: `'Exo 2'` — clean sci-fi
- **NEVER**: Inter, Roboto, Arial, system fonts

### Layout Principles
- Dark immersive full-bleed sections
- Characters as hero elements, oversized
- Asymmetric grid layouts
- Text overlapping images slightly
- Parallax depth on scroll
- Glitch effects on hover/transition

### Background Treatment
Every page/section has:
1. Base: Solid `#0a0a0a`
2. Layer 1: Animated matrix code rain (canvas or CSS)
3. Layer 2: Subtle circuit board SVG pattern (low opacity)
4. Layer 3: Accent color gradient vignette (character-specific)
5. Layer 4: Floating particles (accent color)

### Interactive Elements
- Buttons: Bordered, glowing on hover with accent color
- Cards: Dark glass-morphism with green/accent border glow
- Links: Matrix green, glitch on hover
- Cursor: Custom crosshair or terminal cursor
- Scrollbar: Thin, matrix green

### Animations
- **Page load**: Matrix rain builds up, then characters fade in with lightning flash
- **Scroll**: Parallax layers, elements slide in from sides
- **Hover**: Glitch effect, color pulse, scan-line sweep
- **Transitions**: Digital dissolve / pixel scatter

---

## 8. CSS CUSTOM PROPERTIES (Copy-Paste Ready)

```css
:root {
  /* Base */
  --st-black: #0a0a0a;
  --st-dark: #111111;
  --st-darker: #0d0d0d;
  --st-surface: #1a1a1a;
  --st-border: #222222;
  
  /* Matrix */
  --st-matrix: #00ff41;
  --st-matrix-dim: #00cc33;
  --st-matrix-dark: #003300;
  --st-matrix-glow: rgba(0, 255, 65, 0.3);
  --st-matrix-subtle: rgba(0, 255, 65, 0.08);
  
  /* Text */
  --st-text-primary: #f0f0f0;
  --st-text-secondary: #888888;
  --st-text-muted: #555555;
  
  /* Character Accents */
  --accent-stepten: #00e5ff;
  --accent-stepten-glow: rgba(0, 229, 255, 0.3);
  --accent-pinky: #ff00ff;
  --accent-pinky-glow: rgba(255, 0, 255, 0.3);
  --accent-reina: #9b30ff;
  --accent-reina-glow: rgba(155, 48, 255, 0.3);
  --accent-clark: #ffd700;
  --accent-clark-glow: rgba(255, 215, 0, 0.3);
  
  /* Typography */
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Share Tech Mono', monospace;
  --font-accent: 'Exo 2', sans-serif;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  --space-2xl: 8rem;
  
  /* Effects */
  --glow-sm: 0 0 10px;
  --glow-md: 0 0 20px;
  --glow-lg: 0 0 40px;
  --glow-xl: 0 0 80px;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 600ms ease;
}
```

---

## 9. SOUL FILE INTEGRATION

Each character's `.soul` file should reference:
- Their accent color (for UI theming when active)
- Their personality archetype
- Their origin inspiration (80s/90s/00s reference)
- Their speaking style
- Their role in the StepTen™ universe

This creates consistency between the visual identity and the AI personality.

---

## 10. PRODUCTION RULES

1. **Every visual asset** must have the matrix code rain background
2. **Every character** wears data-reflecting glasses
3. **Every character** has a unique accent color — no duplicates
4. **The green/black base is sacred** — never deviate
5. **Style is comic/illustration** — never photorealistic
6. **Crop is always bust portrait, 1:1** for character art
7. **Dark clothing** on all characters (black preferred)
8. **Lightning/energy** in accent color for every character
9. **Web pages** always have animated background (rain + circuits + particles)
10. **Typography** is always monospace or angular/techy — never generic
