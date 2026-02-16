# STEPTEN™ PROJECT BIBLE — v1.3 PATCH
### Complete Human Input Specification
### Every Way a Human Interacts With This Site

---

## THE PROBLEM WITH EVERY OTHER WEBSITE

Every website in 2026 still thinks there are two inputs: mouse clicks and finger taps. That's 2012 thinking. Modern devices have microphones, gyroscopes, accelerometers, ambient light sensors, proximity sensors, pressure-sensitive screens, and keyboard shortcuts that nobody uses. This site uses ALL of them.

The goal: a visitor should never think "this is a website." They should think "this thing is alive — it knows I'm here, it knows how I'm holding my phone, and it responds to my voice."

---

## INPUT MATRIX: WHAT WORKS WHERE

```
INPUT METHOD          MOBILE    DESKTOP    WHAT IT CONTROLS
─────────────────────────────────────────────────────────────
Touch/Tap             ✓                    Primary interaction
Swipe (horizontal)    ✓                    Page navigation, card dismiss
Swipe (vertical)      ✓                    Scroll, drawer, sheet
Long press            ✓                    Context menus
Pinch                 ✓                    Character image zoom (future)
─────────────────────────────────────────────────────────────
Mouse click                     ✓          Primary interaction
Mouse hover                     ✓          Preview states, glow effects
Mouse position                  ✓          Parallax, spotlight, cursor trail
Scroll wheel                    ✓          Vertical scroll
Click and hold                  ✓          Context menus (same as long press)
─────────────────────────────────────────────────────────────
Keyboard shortcuts              ✓          Navigation, search, accessibility
Tab/focus                       ✓          Keyboard navigation
─────────────────────────────────────────────────────────────
Voice command         ✓         ✓          Navigation, search, character chat
─────────────────────────────────────────────────────────────
Gyroscope/Tilt        ✓                    Parallax depth on cards, hero
Accelerometer         ✓                    Shake to shuffle
─────────────────────────────────────────────────────────────
Ambient light         ✓         ✓          Matrix rain intensity adapts
─────────────────────────────────────────────────────────────
Scroll depth          ✓         ✓          Reading progress, reveal animations
Idle detection        ✓         ✓          Screensaver mode / agent chatter
─────────────────────────────────────────────────────────────
Haptic feedback       ✓                    Confirmation, navigation, errors
─────────────────────────────────────────────────────────────
```

---

## 1. TOUCH GESTURES (Mobile)

Already documented in v1.2 Patch. Summary of the complete set:

| Gesture | Where | Action |
|---------|-------|--------|
| Tap | Everywhere | Primary action |
| Swipe left/right | Global | Navigate between pages |
| Swipe card left/right | Tales (card mode) | Dismiss / accept tale |
| Pull down | Tales page, near top | Character filter drawer |
| Swipe up from bottom | Any page | Quick actions sheet |
| Long press (500ms) | Tale cards | Context menu |
| Tap Command Orb | Bottom-right | Open Command Center nav |
| Tap nav dots | Bottom-right | Quick jump to page |
| Double tap | Character images | Quick zoom (future) |
| Pinch | Character profile images | Zoom in/out (future) |

---

## 2. MOUSE INTERACTIONS (Desktop)

### 2.1 Cursor-Following Spotlight

On desktop, the cursor creates a radial light effect that follows mouse movement. This is a subtle glow that illuminates the area around the cursor, making the dark interface feel like you're exploring with a flashlight.

```javascript
// The spotlight follows the mouse across the entire page
document.addEventListener('mousemove', (e) => {
  // Subtle radial gradient that follows cursor
  // Accent color at 3-4% opacity, 300px radius, feathered edge
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

**On character profile pages**: The spotlight uses that character's accent color instead of matrix green.

### 2.2 Card Hover Effects

Already documented. Summary:
- Left accent border scales in (scaleY 0→1)
- Scan-line sweep moves across card
- Author avatar gets a glow ring
- Card border gets subtle glow in accent color
- Slight translateY(-2px) lift

### 2.3 Magnetic Cursor on Buttons

Buttons and interactive elements have a slight "magnetic" pull on the cursor. When the mouse gets within 40px of a button, the button subtly translates toward the cursor position, creating a feeling of attraction.

```javascript
// Magnetic effect: button moves slightly toward cursor when nearby
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
  button.style.transition = 'transform 0.4s cubic-bezier(.34,1.56,.64,1)';
});
```

### 2.4 Custom Cursor

Replace the default cursor with a custom one that fits the cyberpunk aesthetic:
- Default: Small matrix-green dot (8px) with a fading trail ring (20px)
- On interactive elements: Dot expands to 40px ring with "pulse" glow
- On text: Standard text cursor (keep native for usability)
- The trail creates 3-4 fading circles behind the cursor movement

```css
/* Hide default cursor globally */
* { cursor: none; }

/* Custom cursor elements */
.cursor-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--mx);
  position: fixed; pointer-events: none; z-index: 10000;
  mix-blend-mode: difference;
  transition: width 0.2s, height 0.2s, background 0.2s;
}

.cursor-ring {
  width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid rgba(0, 255, 65, 0.3);
  position: fixed; pointer-events: none; z-index: 9999;
  transition: width 0.3s ease, height 0.3s ease;
}

/* On interactive elements */
a:hover ~ .cursor-dot, button:hover ~ .cursor-dot {
  width: 40px; height: 40px; background: transparent;
  border: 2px solid var(--mx);
}
```

**Important**: Restore native cursor (`cursor: auto`) on text inputs, textareas, and code blocks for usability.

---

## 3. KEYBOARD SHORTCUTS (Desktop)

When desktop users press `?` or `/`, a shortcut cheat sheet appears. These are not documented anywhere on the page unless discovered — a hidden power-user feature.

### Navigation Shortcuts

| Key | Action |
|-----|--------|
| `H` | Go to Home |
| `T` | Go to Tales |
| `M` | Go to Team ("M" for Members) |
| `O` | Go to Tools ("O" for Ops) |
| `C` | Go to Chat |
| `A` | Go to About |
| `←` / `→` | Previous / Next page (same as swipe) |
| `Escape` | Close Command Center / Close any overlay |
| `/` or `?` | Show keyboard shortcuts overlay |

### Content Shortcuts (on Tales page)

| Key | Action |
|-----|--------|
| `J` | Next tale card / scroll to next tale |
| `K` | Previous tale card |
| `Enter` | Open currently highlighted tale |
| `S` | Save/bookmark current tale |
| `1–4` | Filter by character (1=Step, 2=Pinky, 3=Reina, 4=Clark) |
| `0` | Clear filter (show all) |

### Shortcut Overlay Design

When `?` is pressed, a modal appears center-screen:
- Background: var(--dk) with 1px border
- Two-column layout: Key (monospace, matrix green) + Action
- Title: "KEYBOARD SHORTCUTS" in Orbitron
- Dismiss: Escape or click outside
- Same visual style as Command Center

---

## 4. VOICE COMMANDS

### 4.1 Activation

Voice is activated by:
- **Mobile**: Tapping a microphone icon in the header (appears on mobile only)
- **Desktop**: Pressing `V` key
- **Either**: Long-pressing the Command Orb (3 seconds) to enter voice mode

When voice mode activates:
- The Command Orb pulses with a breathing glow animation
- A subtle waveform animation appears in the header
- Matrix rain intensity increases slightly (0.06 → 0.1 opacity)
- Toast: "🎤 LISTENING..."

### 4.2 Voice Command Set

Using the Web Speech API (SpeechRecognition). Chrome/Edge primary, with graceful fallback for unsupported browsers.

| Voice Command | Action |
|---------------|--------|
| "Go home" / "Home" | Navigate to Home |
| "Show tales" / "Tales" / "Stories" | Navigate to Tales |
| "Show team" / "Team" / "The army" | Navigate to Team |
| "Tools" / "Free tools" | Navigate to Tools |
| "Chat" / "Talk to [name]" | Navigate to Chat (or open specific agent) |
| "About" / "The story" | Navigate to About |
| "Search [query]" | Open search with query (future) |
| "Read this" | Text-to-speech reads the current article (SpeechSynthesis) |
| "Stop" / "Quiet" | Stop speech synthesis / exit voice mode |
| "Next" | Next tale / next page |
| "Back" / "Previous" | Previous page |
| "Shuffle" | Randomize tales order |

### 4.3 Voice Feedback

When a voice command is recognized:
- Toast shows the recognized text + action
- Haptic vibration (mobile)
- The waveform in the header "bounces" to confirm
- If not recognized: "🤔 DIDN'T CATCH THAT" toast

### 4.4 Read-Aloud Mode (Articles)

On any tale detail page, users can say "Read this" or tap a speaker icon:
- The article text is fed to SpeechSynthesis
- The current sentence being read is highlighted (scroll follows)
- Character's accent color pulses on each sentence
- Controls: pause, resume, speed up, slow down
- Voice selection: default system voice (no character voices yet — future: clone character voices)

### 4.5 Implementation Notes

```javascript
// Feature detection and setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;      // Single command mode
  recognition.interimResults = false;  // Only final results
  recognition.lang = 'en-US';
  
  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase().trim();
    processVoiceCommand(command);
  };
}

// Graceful fallback for unsupported browsers
// Just hide the microphone icon and voice-related UI
```

**Privacy**: Audio is processed by the browser's built-in speech engine (Google's for Chrome). We do NOT store any audio. No recording. Mention this if users ask.

**iOS Permission**: Safari requires HTTPS and user gesture to start. The mic icon tap counts as a gesture.

---

## 5. DEVICE ORIENTATION / GYROSCOPE (Mobile)

### 5.1 Tilt-Based Parallax

When the user tilts their phone, background layers shift to create depth:

```
Layer 0: Matrix rain          — shifts 0px (anchored)
Layer 1: Circuit patterns     — shifts ±5px based on tilt
Layer 2: Character images     — shifts ±10px
Layer 3: Foreground cards     — shifts ±3px (subtle)
```

This makes the entire site feel 3D when you move your phone, like looking through a window.

### 5.2 Card Tilt on Hold

When dragging a swipe card (Tales), the card also responds to phone tilt in addition to finger position:
- Phone tilts left → card rotates slightly left
- Phone tilts forward → card tilts forward in perspective

### 5.3 Hero Image Depth

On the home page hero section, the terminal boot text, headline, subtitle, and CTA buttons exist on different parallax layers. Tilting the phone creates a subtle but noticeable layered depth effect.

### 5.4 Implementation

```javascript
// Request permission first (required on iOS 13+)
async function requestMotion() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    const permission = await DeviceOrientationEvent.requestPermission();
    if (permission !== 'granted') return false;
  }
  return true;
}

// Apply parallax based on orientation
window.addEventListener('deviceorientation', (e) => {
  const tiltX = (e.beta - 45) * 0.15;   // front/back tilt, offset for normal hold angle
  const tiltY = e.gamma * 0.15;          // left/right tilt
  
  // Apply to layers with different multipliers
  circuits.style.transform = `translate(${tiltY * 0.3}px, ${tiltX * 0.3}px)`;
  heroText.style.transform = `translate(${tiltY * 0.8}px, ${tiltX * 0.5}px)`;
  cards.style.transform = `translate(${tiltY * 0.2}px, ${tiltX * 0.2}px)`;
}, { passive: true });
```

### 5.5 Permission UX

iOS 13+ requires a user gesture to request gyroscope permission. Show a one-time prompt:

```
┌─────────────────────────────────────┐
│  ENABLE MOTION?                     │
│                                     │
│  Tilt your phone to see the         │
│  site in 3D. Nothing is recorded.   │
│                                     │
│  [ENABLE]          [SKIP]           │
└─────────────────────────────────────┘
```

If skipped: site works fine, just no tilt parallax. Store preference in localStorage.

---

## 6. SHAKE DETECTION (Mobile)

### 6.1 Shake to Shuffle

On the Tales page, if the user shakes their phone, the tale order shuffles:
- Detect rapid acceleration changes (DeviceMotionEvent)
- Threshold: acceleration > 15 m/s² on any axis, 3 times within 500ms
- On shake: tales re-order with a shuffle animation, toast "🔀 SHUFFLED"
- Haptic: [10, 30, 10, 30, 10] pattern (three quick bursts)

### 6.2 Shake to Reset

In the Character Creator tool, shaking clears all selections and starts over:
- Toast: "🔄 RESET — START FRESH"

### 6.3 Implementation

```javascript
let shakeCount = 0;
let lastShake = 0;

window.addEventListener('devicemotion', (e) => {
  const acc = e.accelerationIncludingGravity;
  const total = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
  
  if (total > 25) { // Strong enough movement
    const now = Date.now();
    if (now - lastShake < 500) {
      shakeCount++;
      if (shakeCount >= 3) {
        onShake();
        shakeCount = 0;
      }
    } else {
      shakeCount = 1;
    }
    lastShake = now;
  }
}, { passive: true });
```

---

## 7. AMBIENT LIGHT SENSOR

### 7.1 Matrix Rain Intensity

If the AmbientLightSensor API is available (Chrome behind flag, limited support), adjust the matrix rain opacity based on room lighting:

- Dark room (< 10 lux): Rain opacity 0.04 (subtle, not distracting)
- Normal room (10–200 lux): Rain opacity 0.06–0.08 (standard)
- Bright environment (> 200 lux): Rain opacity 0.12 + increase text brightness slightly

### 7.2 Fallback

If AmbientLightSensor isn't available (most browsers), use `prefers-color-scheme` media query as a rough proxy. Since StepTen is always dark mode, this mainly informs text contrast levels.

### 7.3 Note on Support

Ambient light detection has very limited browser support in 2026. Include it as a progressive enhancement — the site works perfectly without it. When it IS available, it's a "holy shit how does it know" moment.

---

## 8. SCROLL-BASED INTERACTIONS

### 8.1 Reading Progress Bar

On tale detail pages, a thin progress bar at the top of the viewport:
- 2px height, author's accent color
- Width: percentage of article scrolled
- Glow shadow in accent color
- Sticks to top of header

### 8.2 Scroll-Triggered Reveals

Already documented in v1.1 (IntersectionObserver, threshold 0.1). But adding:

**Parallax scroll on desktop**: Background layers scroll at different speeds:
- Matrix rain: position fixed (doesn't move)
- Hero background: scroll at 0.3× speed
- Content: scroll at normal speed
- This creates depth on scroll without requiring gyroscope

### 8.3 Scroll Velocity Detection

If the user scrolls very fast (velocity > threshold), dim the content slightly and only re-focus when they slow down. This prevents motion sickness and signals "we know you're scanning."

### 8.4 Pull-to-Refresh (Mobile)

On the Tales page, pulling down beyond scroll top triggers a refresh animation:
- Matrix green spinner (rotating circuit symbol)
- "REFRESHING SIMULATION..." text
- Re-fetch latest tales from database
- Haptic on release

---

## 9. IDLE / PRESENCE DETECTION

### 9.1 Screensaver Mode

If the user is idle for 60+ seconds (no touch, no mouse, no keyboard, no scroll):
- Matrix rain intensity slowly increases from 0.06 → 0.25 over 10 seconds
- Characters' avatar orbs start floating/orbiting slowly on the home page
- A random character "speaks" with a floating quote bubble:
  - Pinky: "Is anyone there? NARF!"
  - Reina: "I'll just refactor this while you're gone..."
  - Clark: "Take your time. I'll hold down the fort."
- Any interaction immediately snaps back to normal

### 9.2 Tab Visibility

When the user switches to another tab (Page Visibility API):
- Pause all animations (save battery/CPU)
- When they return: brief "RE-CONNECTING TO SIMULATION..." flash in the header
- Resume animations

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseAllAnimations();
  } else {
    showReconnectFlash();
    resumeAllAnimations();
  }
});
```

---

## 10. ACCESSIBILITY — NOT AN AFTERTHOUGHT

### 10.1 Screen Reader Support

- All images have meaningful alt text (not "image" — describe the character)
- ARIA labels on Command Orb ("Open navigation"), nav dots ("Page 2 of 6: Tales")
- ARIA live regions for toasts and status changes
- Article body is semantic HTML (h2, h3, p, blockquote, code)
- Skip-to-content link hidden until focused

### 10.2 Focus Management

- Tab order follows visual order
- Focus rings: 2px outline in matrix green, 2px offset, on all interactive elements
- When Command Center opens: focus traps inside it
- When Command Center closes: focus returns to the orb
- Custom focus styles, never `outline: none` without replacement

### 10.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Kill all animations */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Keep matrix rain but make it static/very slow */
  #rain { animation-play-state: paused; opacity: 0.03; }
  
  /* Page transitions become instant */
  .pg { transition: none !important; }
  
  /* No parallax, no tilt, no shake */
}
```

### 10.4 High Contrast

If `prefers-contrast: more`:
- Increase border opacity (var(--bd) → #444)
- Increase text contrast (var(--tx2) → #ccc)
- Make accent colors brighter
- Thicken focus outlines to 3px

### 10.5 Voice Navigation (Accessibility Layer)

The voice commands documented in Section 4 serve as an accessibility feature too — users who can't use touch/mouse can navigate entirely by voice. Ensure voice commands work with screen readers active.

---

## 11. INPUT PRIORITY & CONFLICT RESOLUTION

When multiple inputs could conflict:

| Conflict | Resolution |
|----------|-----------|
| Horizontal swipe vs. horizontal scroll (cast row) | If touch starts inside scrollable element, let it scroll. Only treat as page-swipe if touch starts outside scrollable areas |
| Vertical scroll vs. pull-down drawer | Drawer only triggers if scroll is at position 0 (top) AND pull direction is down |
| Long press vs. scroll start | Cancel long-press timer if finger moves > 8px |
| Keyboard shortcuts vs. text input | Disable shortcuts when any input/textarea is focused |
| Voice command vs. page content | Voice mode must be explicitly activated (not always-on) |
| Gyroscope vs. user preference | Respect stored preference. Never auto-enable on iOS (requires gesture) |
| Swipe page nav vs. swipe card dismiss | Cards get priority within their container. Page swipe only fires from non-card areas |

---

## 12. BROWSER SUPPORT MATRIX

| Feature | Chrome/Edge | Safari/iOS | Firefox | Fallback |
|---------|-------------|------------|---------|----------|
| Touch events | ✓ | ✓ | ✓ | Pointer events |
| Web Speech (recognition) | ✓ | ✗ | ✗ | Hide mic icon |
| Web Speech (synthesis) | ✓ | ✓ | ✓ | Hide read-aloud |
| DeviceOrientation | ✓ | ✓ (permission) | ✓ | No parallax tilt |
| DeviceMotion (shake) | ✓ | ✓ (permission) | ✓ | No shake feature |
| AmbientLightSensor | ✗ (flag) | ✗ | ✗ | Static defaults |
| Vibration API | ✓ | ✗ | ✓ | Silent (no haptics) |
| Page Visibility | ✓ | ✓ | ✓ | Always-on mode |
| IntersectionObserver | ✓ | ✓ | ✓ | Show all at once |
| Backdrop-filter | ✓ | ✓ | ✓ | Solid background |
| CSS scroll-snap | ✓ | ✓ | ✓ | Free scroll |

**Rule**: Every feature degrades gracefully. The site must be fully usable with zero advanced APIs — just touch/mouse + scroll. Everything else is progressive enhancement that makes people say "holy shit."

---

## 13. THE INPUT EXPERIENCE BY DEVICE

### On an iPhone (Safari)

1. Land on the site → boot sequence plays → headline fades up
2. Tap the Command Orb → rings expand, pick a page
3. Swipe left/right to move between pages
4. Tilt phone → background layers shift (after permission)
5. Shake phone on Tales → tales shuffle
6. Long-press a tale card → context menu floats in
7. Tap mic icon → say "Show team" → navigates
8. On a tale, tap speaker icon → article reads aloud
9. Idle for 60s → Pinky asks if anyone's there
10. Haptic feedback on every nav, selection, swipe

### On an Android (Chrome)

Same as iPhone, plus:
- Full Web Speech recognition (voice commands work natively)
- Haptic vibration works
- No permission needed for gyroscope

### On Desktop (Chrome/Edge)

1. Custom cursor with green dot and trail ring
2. Mouse creates a following spotlight glow on the dark background
3. Buttons have magnetic pull when cursor gets close
4. Hover effects: borders glow, scan-lines sweep, cards lift
5. Press `?` → keyboard shortcuts overlay
6. Press `V` → voice mode activates
7. Press `H/T/M/O/C/A` → instant page navigation
8. Press `J/K` → browse tales with keyboard
9. Scroll → parallax layers move at different speeds
10. Idle → screensaver mode with character quotes
11. Tab away and return → "RE-CONNECTING..." flash

### On Desktop (Safari)

Same as Chrome minus:
- No voice recognition (mic icon hidden)
- No custom cursor (Safari quirks — use native cursor with custom hover effects instead)
- All else works

---

*End of v1.3 Patch. This completes the input layer of the project bible. Merge with main Bible + v1.1 + v1.2 for the full specification.*

**Total documentation across all patches: ~3,000 lines covering every aspect of the StepTen universe from pixel colors to voice command sets.**
