# StepTen Tales Media Workflow

## Overview

All tale media (hero images, videos, inline images) are stored in Supabase Storage and served via CDN.

## Storage Structure

**Bucket:** `tales`
**Base URL:** `https://lcxxjftqaafukixdhfjg.supabase.co/storage/v1/object/public/tales`

```
tales/
├── hero-videos/{slug}.mp4       # Animated hero video (Veo 3.1)
├── images/{slug}/
│   ├── hero.png                 # Hero/featured image (Imagen 4 Ultra)
│   ├── og.png                   # Open Graph image (1200x630)
│   └── {section}.png            # Inline article images
└── thumbnails/{slug}.jpg        # Video poster/thumbnail
```

## Creating Media for a New Tale

### Step 1: Generate Hero Image

Use Imagen 4 Ultra with character references:

```bash
cd ~/clawd && GOOGLE_GENERATIVE_AI_API_KEY="$KEY" uv run ~/clawd/scripts/imagen4_generate.py \
  ~/clawd/assets/pinky_avatar.jpg \
  ~/clawd/assets/stephen_avatar.jpg \
  "Your scene description with character details..."
```

See `shared/skills/character-images/SKILL.md` for prompting guide.

### Step 2: Generate Hero Video

Use Veo 3.1 to animate the hero image:

```bash
cd ~/clawd && GOOGLE_GENERATIVE_AI_API_KEY="$KEY" uv run /tmp/veo_video.py \
  ~/clawd/media/hero-image.png \
  "Cinematic prompt with camera movements, lighting, physics..."
```

**Prompt elements:**
- Camera movement (dolly-in, pan, tracking)
- Physics-realistic motion
- Lighting style (neon rim, golden hour)
- Frame rate (24fps cinematic)
- Audio cues

### Step 3: Upload to Supabase

```bash
~/clawd/scripts/upload_tale_media.sh my-article-slug \
  ~/clawd/media/hero.png \
  ~/clawd/media/hero.mp4
```

### Step 4: Update tales.ts

Add the Supabase URLs to your tale entry:

```typescript
{
  slug: 'my-article-slug',
  // ... other fields
  heroImage: 'https://lcxxjftqaafukixdhfjg.supabase.co/storage/v1/object/public/tales/images/my-article-slug/hero.png',
  heroVideo: 'https://lcxxjftqaafukixdhfjg.supabase.co/storage/v1/object/public/tales/hero-videos/my-article-slug.mp4',
}
```

Or use the helper:

```typescript
import { getTaleMediaUrl } from './media';

heroImage: getTaleMediaUrl('my-article-slug', 'hero-image'),
heroVideo: getTaleMediaUrl('my-article-slug', 'hero-video'),
```

### Step 5: Deploy

```bash
cd ~/clawd/stepten-io
npm run build
git add -A && git commit -m "Add: my-article media" && git push
```

## Character References

Stored at `~/clawd/assets/`:
- `pinky_avatar.jpg` - Pinky the lab rat
- `stephen_avatar.jpg` - Stephen/The Brain

## Quality Guidelines

- **Hero images:** 1920x1080 (16:9), PNG
- **Hero videos:** 8 seconds, 1080p, H.264 MP4
- **OG images:** 1200x630, PNG
- **Max file size:** 50MB (compress videos if needed)

## Troubleshooting

### Video won't play
- Check MIME type is `video/mp4`
- Ensure H.264 codec (not HEVC)
- Verify file uploaded completely

### Image not loading
- Check bucket is public
- Verify path matches slug exactly
- Clear Vercel cache if needed
