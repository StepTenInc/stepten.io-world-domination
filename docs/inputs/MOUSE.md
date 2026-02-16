# Mouse Interactions (Desktop)

## Custom Cursor

Replace default cursor with cyberpunk aesthetic:

```css
/* Hide default cursor globally */
* { cursor: none; }

/* Custom cursor elements */
.cursor-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--mx);
  position: fixed;
  pointer-events: none;
  z-index: 10000;
  mix-blend-mode: difference;
  transition: width 0.2s, height 0.2s;
}

.cursor-ring {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(0, 255, 65, 0.3);
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transition: all 0.3s ease;
}

/* On interactive elements - expand */
a:hover ~ .cursor-dot,
button:hover ~ .cursor-dot {
  width: 40px;
  height: 40px;
  background: transparent;
  border: 2px solid var(--mx);
}
```

**Important:** Restore native cursor on text inputs:
```css
input, textarea, [contenteditable] { cursor: auto; }
```

## Cursor-Following Spotlight

The cursor creates a radial light that follows mouse movement:

```javascript
document.addEventListener('mousemove', (e) => {
  document.body.style.background = `
    radial-gradient(
      600px circle at ${e.clientX}px ${e.clientY}px,
      rgba(0, 255, 65, 0.03),
      transparent 50%
    ),
    var(--bk)
  `;
});
```

**On character pages:** Use that character's accent color instead of matrix green.

## Magnetic Buttons

Buttons have a slight "magnetic" pull when cursor gets close:

```javascript
button.addEventListener('mousemove', (e) => {
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance < 80) {
    const pull = (1 - distance / 80) * 6; // max 6px pull
    button.style.transform = `translate(${dx * pull / 80}px, ${dy * pull / 80}px)`;
  }
});

button.addEventListener('mouseleave', () => {
  button.style.transform = '';
  button.style.transition = 'transform 0.4s var(--bounce)';
});
```

## Card Hover Effects

```css
.card {
  transition: transform 0.3s, border-color 0.3s;
}

.card:hover {
  transform: translateY(-2px);
  border-color: var(--character-color);
}

/* Left accent border scales in */
.card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--character-color);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s var(--ease);
}

.card:hover::before {
  transform: scaleY(1);
}

/* Scan-line sweep */
.card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 65, 0.03),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.5s;
}

.card:hover::after {
  transform: translateX(100%);
}
```

## Scroll-Based Parallax

Background layers scroll at different speeds:

```javascript
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  // Matrix rain: fixed (doesn't move)
  // Hero background: scroll at 0.3× speed
  heroBackground.style.transform = `translateY(${scrollY * 0.3}px)`;
  
  // Content: normal scroll
});
```
