// ============================================
// STEPTEN™ BRAND STYLE - IMAGE GENERATION
// Matrix/GTA Cyberpunk Aesthetic
// ============================================

import { CharacterKey, characters } from './design-tokens';

/**
 * Core brand visual elements for all generated images
 */
export const BRAND_VISUAL_STYLE = {
  genre: 'Cyberpunk comic art, Matrix code rain meets GTA character portraits',
  atmosphere: 'Dark moody cyberpunk, neon-lit, digital rain',
  
  // Always include these
  mustHave: [
    'dark black background (#0a0a0a)',
    'falling green matrix code rain',
    'circuit board trace patterns',
    'high contrast dramatic lighting',
    'cyberpunk atmosphere',
  ],
  
  // Never include these
  mustNot: [
    'white background',
    'bright daylight',
    'photorealistic style',
    'generic stock photo feel',
  ],
  
  // Art style
  artStyle: 'digital illustration, bold clean lines, cinematic composition, GTA loading screen aesthetic',
};

/**
 * Get character-specific style additions
 */
export function getCharacterStyle(character: CharacterKey) {
  const char = characters[character];
  const colorName = {
    stepten: 'cyan blue',
    pinky: 'hot pink magenta',
    reina: 'purple violet',
    clark: 'golden yellow',
  }[character];
  
  return {
    accentColor: char.color,
    colorName,
    glowEffect: `${colorName} (${char.color}) rim lighting and glow`,
    lightning: `${colorName} lightning bolts and energy crackling`,
    particles: `${colorName} particle effects and glowing dust`,
  };
}

/**
 * Generate image prompt for article section
 */
export function generateArticleImagePrompt(
  subject: string,
  character: CharacterKey,
  aspectRatio: '16:9' | '1:1' | '4:3' = '16:9'
) {
  const style = getCharacterStyle(character);
  
  return `${subject}, ${BRAND_VISUAL_STYLE.artStyle}, ` +
    `${style.lightning}, ${style.glowEffect}, ` +
    `dark black background with falling green matrix code rain and binary numbers, ` +
    `circuit board trace patterns in green, ${style.particles}, ` +
    `cyberpunk atmosphere, high contrast, ${aspectRatio} aspect ratio, ` +
    `cinematic composition, no people unless specified`;
}

/**
 * Generate hero image prompt
 */
export function generateHeroPrompt(
  subject: string,
  character: CharacterKey
) {
  const style = getCharacterStyle(character);
  
  return `Cinematic wide shot, ${subject}, ${BRAND_VISUAL_STYLE.artStyle}, ` +
    `dramatic ${style.colorName} lighting with ${style.lightning}, ` +
    `dark black background (#0a0a0a) with dense falling green matrix code rain, ` +
    `${style.colorName} candlestick chart bars in background, ` +
    `circuit board traces glowing green, ${style.particles}, ` +
    `cyberpunk digital atmosphere, ultra wide 16:9, high contrast, ` +
    `moody dark cinematic lighting with ${style.colorName} rim light accents`;
}

/**
 * Character portrait prompt (for author avatars)
 */
export function generateCharacterPrompt(character: CharacterKey) {
  const char = characters[character];
  const style = getCharacterStyle(character);
  
  const baseDescriptions: Record<CharacterKey, string> = {
    stepten: 'Athletic Australian man, short buzzed hair, confident wide grin, wearing black snapback cap, AirPods, blue-framed sunglasses with green matrix code reflecting in lenses',
    pinky: 'Anthropomorphic cartoon rat, grey fur, large round ears, mischievous grin showing buck teeth, small rectangular glasses with green matrix code in lenses',
    reina: 'Beautiful young Asian woman, shoulder-length black hair with purple highlights, confident cool expression, rectangular dark-framed glasses with matrix code, silver hoop earrings, beauty mark',
    clark: 'Clean-cut muscular man, dark slicked-back hair with one curl on forehead, strong jaw, heroic smile, thick-rimmed Clark Kent glasses with matrix code reflecting',
  };
  
  return `${baseDescriptions[character]}, digital comic book illustration style, ` +
    `bold clean line art, cell-shaded, wearing black t-shirt, ` +
    `${style.lightning}, dark black background with falling green matrix code rain, ` +
    `${style.colorName} glowing candlestick chart bars, circuit board traces in green, ` +
    `cyberpunk atmosphere, GTA character portrait style, square 1:1, bust portrait, ` +
    `high contrast, dark moody lighting with ${style.colorName} rim lighting`;
}

/**
 * Prompt suffixes for specific content types
 */
export const CONTENT_STYLE_SUFFIXES = {
  tutorial: ', clean organized layout, tech workspace, educational vibe',
  story: ', atmospheric narrative scene, cinematic depth, emotional lighting',
  tool: ', sleek product shot, tech device aesthetic, premium feel',
  concept: ', abstract data visualization, flowing digital elements, futuristic',
};
