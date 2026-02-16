# Touch Gestures (Mobile)

## Core Gestures

| Gesture | Where | Action | Implementation |
|---------|-------|--------|----------------|
| Tap | Everywhere | Primary action | `onClick` |
| Swipe left/right | Global | Navigate between pages | Touch event delta |
| Long press (500ms) | Cards | Context menu | `setTimeout` on touchstart |
| Pull down | Near top | Refresh / Filter drawer | Touch delta + scroll position |
| Swipe up from bottom | Any page | Quick actions sheet | Touch origin detection |

## Swipe Navigation

Pages can be swiped horizontally to navigate:
```javascript
const pageOrder = ['home', 'tales', 'team', 'tools', 'chat', 'about'];

// Detect swipe
if (dx > 80 && dy < dx * 0.6) {
  // Horizontal swipe detected
  if (dx > 0) goToNextPage();
  else goToPrevPage();
}
```

**Conflict Resolution:**
- If touch starts inside a scrollable element (e.g., cast row), let it scroll
- Only treat as page-swipe if touch starts outside scrollable areas
- Cancel swipe if vertical movement exceeds horizontal

## Long Press

Triggers after 500ms hold without movement:
```javascript
let longPressTimer;
const LONG_PRESS_DURATION = 500;
const MOVE_THRESHOLD = 8; // px

element.addEventListener('touchstart', (e) => {
  const startX = e.touches[0].clientX;
  const startY = e.touches[0].clientY;
  
  longPressTimer = setTimeout(() => {
    triggerContextMenu(e);
    haptic([10, 50, 10]);
  }, LONG_PRESS_DURATION);
});

element.addEventListener('touchmove', (e) => {
  const dx = Math.abs(e.touches[0].clientX - startX);
  const dy = Math.abs(e.touches[0].clientY - startY);
  if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
    clearTimeout(longPressTimer);
  }
});
```

## Pull-to-Refresh

On Tales page, pulling down triggers refresh:
- Only activates if `scrollTop === 0`
- Pull threshold: 80px
- Show matrix green spinner
- Haptic on release

## Haptic Feedback

Use Vibration API for feedback:
```javascript
function haptic(pattern = [10]) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

// Patterns
haptic([6]);           // Light tap
haptic([10]);          // Normal tap
haptic([10, 50, 10]);  // Long press confirm
haptic([10, 30, 10, 30, 10]); // Shake detected
```

## Touch Feedback CSS

```css
/* Prevent tap highlight */
* { -webkit-tap-highlight-color: transparent; }

/* Active state feedback */
.card:active {
  transform: scale(0.98);
  transition: transform 0.1s;
}

.btn:active {
  transform: scale(0.95);
}
```
