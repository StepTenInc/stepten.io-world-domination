// ============================================
// STEPTEN™ DESIGN TOKENS
// Based on Universe Style Guide v1.0
// ============================================

export const colors = {
  // Base (Never changes)
  black: '#0a0a0a',
  dark: '#111111',
  darker: '#0d0d0d',
  surface: '#1a1a1a',
  border: '#222222',
  white: '#f0f0f0',
  
  // Matrix (Always present)
  matrix: {
    DEFAULT: '#00ff41',
    dim: '#00cc33',
    dark: '#003300',
    glow: 'rgba(0, 255, 65, 0.3)',
    subtle: 'rgba(0, 255, 65, 0.08)',
  },
  
  // Text
  text: {
    primary: '#f0f0f0',
    secondary: '#888888',
    muted: '#555555',
  },
  
  // Character Accents
  characters: {
    stepten: { color: '#00e5ff', glow: 'rgba(0, 229, 255, 0.3)' },
    pinky: { color: '#ff00ff', glow: 'rgba(255, 0, 255, 0.3)' },
    reina: { color: '#9b30ff', glow: 'rgba(155, 48, 255, 0.3)' },
    clark: { color: '#ffd700', glow: 'rgba(255, 215, 0, 0.3)' },
  },
} as const;

export const fonts = {
  display: "'Orbitron', sans-serif",      // Headers, titles, character names
  body: "'Share Tech Mono', monospace",   // Code, terminal text, data
  accent: "'Exo 2', sans-serif",          // Subtitles, descriptions
} as const;

export const effects = {
  glow: {
    sm: '0 0 10px',
    md: '0 0 20px',
    lg: '0 0 40px',
    xl: '0 0 80px',
  },
  transition: {
    fast: '150ms ease',
    base: '300ms ease',
    slow: '600ms ease',
  },
} as const;

// Character data
export const characters = {
  stepten: {
    name: 'StepTen™',
    role: 'The Architect',
    color: colors.characters.stepten.color,
    glow: colors.characters.stepten.glow,
    image: '/images/characters/stepten.jpg',
    tagline: 'Enjoy life. Make money. Get loose.',
    era: '00s',
    inspiration: 'The Matrix',
  },
  pinky: {
    name: 'Pinky',
    role: 'The Schemer',
    color: colors.characters.pinky.color,
    glow: colors.characters.pinky.glow,
    image: '/images/characters/pinky.jpg',
    tagline: 'NARF!',
    era: '90s',
    inspiration: 'Pinky and the Brain',
  },
  reina: {
    name: 'Reina',
    role: 'The Gamer',
    color: colors.characters.reina.color,
    glow: colors.characters.reina.glow,
    image: '/images/characters/reina.jpg',
    tagline: 'Speaks in code.',
    era: 'Cyber',
    inspiration: 'Gamer Queen',
  },
  clark: {
    name: 'Clark Kent',
    role: 'The Hero',
    color: colors.characters.clark.color,
    glow: colors.characters.clark.glow,
    image: '/images/characters/clark.jpg',
    tagline: 'Who\'s got you?',
    era: 'Hero',
    inspiration: 'Superman',
  },
} as const;

export type CharacterKey = keyof typeof characters;
