# Device Sensors

## Gyroscope / Tilt (Mobile)

When the user tilts their phone, background layers shift to create depth:

```
Layer 0: Matrix rain          — shifts 0px (anchored)
Layer 1: Circuit patterns     — shifts ±5px based on tilt
Layer 2: Character images     — shifts ±10px
Layer 3: Foreground cards     — shifts ±3px (subtle)
```

### Implementation

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
  const tiltX = (e.beta - 45) * 0.15;  // front/back tilt
  const tiltY = e.gamma * 0.15;         // left/right tilt
  
  // Apply to layers with different multipliers
  circuits.style.transform = `translate(${tiltY * 0.3}px, ${tiltX * 0.3}px)`;
  heroText.style.transform = `translate(${tiltY * 0.8}px, ${tiltX * 0.5}px)`;
  cards.style.transform = `translate(${tiltY * 0.2}px, ${tiltX * 0.2}px)`;
}, { passive: true });
```

### Permission UX

iOS 13+ requires a user gesture. Show a one-time prompt:
- Button: "ENABLE 3D MOTION"
- Store preference in localStorage
- If skipped: site works fine, just no tilt parallax

## Shake Detection

### Shake to Shuffle (Tales)

On the Tales page, shaking shuffles the order:

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

function onShake() {
  shuffleTales();
  showToast('🔀 SHUFFLED');
  haptic([10, 30, 10, 30, 10]);
}
```

### Shake to Reset (Character Creator)

In the Character Creator tool, shaking clears selections.

## Ambient Light Sensor

If AmbientLightSensor API is available, adjust matrix rain opacity:

```javascript
if ('AmbientLightSensor' in window) {
  const sensor = new AmbientLightSensor();
  sensor.addEventListener('reading', () => {
    const lux = sensor.illuminance;
    
    if (lux < 10) {
      // Dark room - subtle rain
      matrixRain.style.opacity = '0.04';
    } else if (lux < 200) {
      // Normal room
      matrixRain.style.opacity = '0.06';
    } else {
      // Bright environment
      matrixRain.style.opacity = '0.12';
    }
  });
  sensor.start();
}
```

**Note:** Very limited browser support. Progressive enhancement only.

## Idle Detection

If user is idle for 60+ seconds:
- Matrix rain intensity increases
- Character avatars start floating
- Random character "speaks" with a quote bubble

```javascript
let idleTimer;
const IDLE_TIMEOUT = 60000;

function resetIdle() {
  clearTimeout(idleTimer);
  exitIdleMode();
  idleTimer = setTimeout(enterIdleMode, IDLE_TIMEOUT);
}

['mousemove', 'touchstart', 'keydown', 'scroll'].forEach(event => {
  document.addEventListener(event, resetIdle, { passive: true });
});
```

## Tab Visibility

Pause animations when tab is hidden:

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseAllAnimations();
  } else {
    showReconnectFlash(); // "RE-CONNECTING TO SIMULATION..."
    resumeAllAnimations();
  }
});
```

## Reduced Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  #rain {
    animation-play-state: paused;
    opacity: 0.03;
  }
}
```
