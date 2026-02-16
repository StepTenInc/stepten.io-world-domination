# Keyboard Shortcuts (Desktop)

## Activation

Press `?` or `/` to show the shortcut cheat sheet overlay.

## Navigation Shortcuts

| Key | Action |
|-----|--------|
| `H` | Go to Home |
| `T` | Go to Tales |
| `M` | Go to Team (Members) |
| `O` | Go to Tools (Ops) |
| `C` | Go to Chat |
| `A` | Go to About |
| `←` / `→` | Previous / Next page |
| `Escape` | Close overlay / Command Center |
| `/` or `?` | Show keyboard shortcuts |

## Content Shortcuts (Tales Page)

| Key | Action |
|-----|--------|
| `J` | Next tale / scroll down |
| `K` | Previous tale / scroll up |
| `Enter` | Open highlighted tale |
| `S` | Save/bookmark tale |
| `1-4` | Filter by character |
| `0` | Clear filter (show all) |

## Implementation

```javascript
const shortcuts = {
  'h': () => goTo('home'),
  't': () => goTo('tales'),
  'm': () => goTo('team'),
  'o': () => goTo('tools'),
  'c': () => goTo('chat'),
  'a': () => goTo('about'),
  'ArrowLeft': () => goToPrevPage(),
  'ArrowRight': () => goToNextPage(),
  'Escape': () => closeOverlay(),
  '/': () => showShortcuts(),
  '?': () => showShortcuts(),
};

document.addEventListener('keydown', (e) => {
  // Disable shortcuts when typing
  if (e.target.matches('input, textarea, [contenteditable]')) {
    return;
  }
  
  const handler = shortcuts[e.key];
  if (handler) {
    e.preventDefault();
    handler();
  }
});
```

## Shortcut Overlay Design

```jsx
<div className="shortcuts-overlay">
  <h2>KEYBOARD SHORTCUTS</h2>
  <div className="shortcuts-grid">
    <div className="shortcut">
      <kbd>H</kbd>
      <span>Home</span>
    </div>
    <div className="shortcut">
      <kbd>T</kbd>
      <span>Tales</span>
    </div>
    // ...
  </div>
</div>
```

```css
.shortcuts-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(4, 4, 4, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

kbd {
  font-family: var(--fm);
  font-size: 0.7rem;
  padding: 4px 10px;
  background: var(--sf);
  border: 1px solid var(--mx);
  border-radius: 4px;
  color: var(--mx);
}
```

## Focus Management

```css
/* Visible focus rings */
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--mx);
  outline-offset: 2px;
}

/* Never remove focus without replacement */
*:focus { outline: none; } /* BAD */
*:focus-visible { outline: 2px solid var(--mx); } /* GOOD */
```
