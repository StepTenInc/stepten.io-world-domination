# StepTen™ Design System

> "The visitor should never think 'this is a website.' They should think 'this thing is alive.'"

## Documentation Structure

```
docs/
├── README.md           ← You are here
├── design/
│   ├── TOKENS.md       ← Colors, fonts, spacing, variables
│   ├── COMPONENTS.md   ← Reusable UI components
│   └── ANIMATION.md    ← Transitions, effects, motion
├── inputs/
│   ├── TOUCH.md        ← Mobile gestures
│   ├── MOUSE.md        ← Desktop interactions
│   ├── KEYBOARD.md     ← Shortcuts and accessibility
│   ├── VOICE.md        ← Voice commands
│   └── SENSORS.md      ← Gyroscope, shake, ambient light
└── pages/
    └── STRUCTURE.md    ← Page layouts and navigation
```

## The Philosophy

Every website in 2026 still thinks there are two inputs: mouse clicks and finger taps. StepTen uses ALL of them:
- Touch/Swipe (Mobile)
- Mouse/Hover/Cursor (Desktop)
- Keyboard shortcuts (Power users)
- Voice commands (Hands-free)
- Gyroscope/Tilt (Parallax depth)
- Shake (Actions)
- Ambient light (Adaptive brightness)

## Quick Reference

### Colors
```css
--bk: #0a0a0a     /* Background */
--dk: #111        /* Dark surface */
--sf: #161616     /* Surface */
--mx: #00ff41     /* Matrix green (primary) */
--ac-step: #00e5ff    /* StepTen cyan */
--ac-pink: #ff00ff    /* Pinky magenta */
--ac-reina: #9b30ff   /* Reina purple */
--ac-clark: #ffd700   /* Clark gold */
```

### Fonts
```css
--fd: 'Orbitron'      /* Display/Headlines */
--fm: 'Share Tech Mono'/* Mono/Labels */
--fb: 'Exo 2'         /* Body text */
```

### The Cast
| Character | Color | Role | Era |
|-----------|-------|------|-----|
| StepTen™ | #00e5ff | The Architect | Present |
| Pinky | #ff00ff | The Schemer | 90s |
| Reina | #9b30ff | The Coder | Cyber |
| Clark | #ffd700 | The Hero | 86 |

## Browser Support

All features degrade gracefully. Core experience works everywhere.

| Feature | Chrome | Safari | Firefox | Fallback |
|---------|--------|--------|---------|----------|
| Touch | ✓ | ✓ | ✓ | Pointer events |
| Voice | ✓ | ✗ | ✗ | Hide mic icon |
| Gyroscope | ✓ | ✓ | ✓ | No parallax |
| Haptics | ✓ | ✗ | ✓ | Silent |

---

*This is the gospel for style. Follow it.*
