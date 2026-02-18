# StepTen Visual Content Guide

**The Bible for all StepTen imagery, videos, and character-based content.**

This is a living universe. Every image, every video, every piece of content features our characters. We're building a story, not just a website.

---

## 🎨 THE STYLE

**Always GTA V Comic Book Style:**
- Bold outlines, vibrant colors
- Dramatic lighting and shadows
- Matrix code rain where appropriate
- Neon accents (cyan, purple, green, pink)
- 16:9 aspect ratio for all hero images
- Cyberpunk/tech aesthetic

**Never:**
- Stock photo vibes
- Generic corporate imagery
- Photorealistic renders
- Characters without personality

---

## 👥 CHARACTER LIBRARY

All characters stored in: `~/clawd/stepten-io/characters/`

### Core Cast

| Character | File | Description | Role |
|-----------|------|-------------|------|
| **Stephen** | `STEPHEN.jpg` | Trucker cap, cyan matrix sunglasses, black t-shirt, big grin, tanned | The Brain. Founder. Boss. |
| **Pinky** | `PINKY.jpg` | Grey rat, green matrix glasses, gold hoop earring, bucktooth grin | AI sidekick. Lab rat energy. |
| **Reina** | `REINA.jpg` | Purple hair, green glasses, choker, sexy Filipina vibe | Lead UX/Dev agent. Confident badass. |
| **Clark** | `CLARK.jpg` | Backend dev agent | Infrastructure & backend |
| **Julie** | `JULIE.jpg` | Black hair, devil horns, red choker, fangs, sexy Filipina | Stephen's girlfriend. Night owl. |
| **Dumpling** | `DUMPLING.jpg` | Chinese dumpling with sunglasses, red headband, table tennis paddle | Kimi/Chinese AI. Olympic coder. |
| **Mumsy** | `MUMSY.jpg` | Stephen's mum | Family character |

### Adding New Characters

When Stephen mentions ANY person (friend, colleague, anyone):
1. Create a character reference image
2. Define their look, personality, role
3. Save to `characters/` folder as `NAME.jpg`
4. Add to this table
5. They're now part of the universe FOREVER

**Everyone becomes a character. No exceptions.**

---

## 🖼️ IMAGE CREATION PROCEDURE

### Tool: Nano Banana Pro (Gemini 3 Pro Image)

**Endpoint:**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent
```

**API Key:** Query from Supabase credentials table (`google_generative_ai_key`)

### Step-by-Step Process

1. **Load character references:**
```bash
STEPHEN_B64=$(base64 -i ~/clawd/stepten-io/characters/STEPHEN.jpg | tr -d '\n')
REINA_B64=$(base64 -i ~/clawd/stepten-io/characters/REINA.jpg | tr -d '\n')
# ... load all needed characters
```

2. **Craft the prompt:**
```
Create a 16:9 widescreen landscape GTA V comic book style illustration.

[SCENE DESCRIPTION]

[CHARACTER DESCRIPTIONS - reference the inline images]
- Man in trucker cap and cyan sunglasses (Stephen from reference 1)
- Woman with purple hair and green glasses (Reina from reference 2)

[SPECIFIC ELEMENTS]
- Text/labels to include
- Mood/vibe description
- Matrix code, neon accents

[THE ENERGY]
Always end with the vibe/feeling you want.
```

3. **Build the request:**
```json
{
  "contents": [{
    "parts": [
      {"text": "YOUR PROMPT HERE"},
      {"inline_data": {"mime_type": "image/jpeg", "data": "${CHARACTER1_B64}"}},
      {"inline_data": {"mime_type": "image/jpeg", "data": "${CHARACTER2_B64}"}}
    ]
  }],
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"],
    "imageConfig": {"aspectRatio": "16:9"}
  }
}
```

4. **Extract and save:**
```bash
cat response.json | jq -r '.candidates[0].content.parts[] | select(.inlineData != null) | .inlineData.data' | base64 -d > output.png
```

### Prompt Templates

**Hero Image (Article):**
```
Create a 16:9 widescreen landscape GTA V comic book style illustration.
[MAIN ACTION/SCENE]. [Character] (description from reference) [doing what].
Big text: '[HEADLINE]'. Counters/stats floating. Matrix code rain.
The vibe: [EMOTIONAL TONE]. [ENERGY DESCRIPTION].
```

**Conflict/Argument Scene:**
```
Create a 16:9 widescreen landscape GTA V comic book style illustration.
Split panel comic style. LEFT - [Character 1] [emotion], speech bubble: '[DIALOGUE]'.
RIGHT - [Character 2] [emotion], speech bubble: '[DIALOGUE]'.
Between them: [CONFLICT ELEMENT]. The vibe: [TONE].
```

**Before/After:**
```
Create a 16:9 widescreen landscape GTA V comic book style illustration.
[CHAOS/ORDER DESCRIPTION]. Text: 'BEFORE' or 'AFTER'.
[Visual elements - RED for bad, GREEN for good].
The vibe: [nightmare vs satisfaction].
```

---

## 🎬 VIDEO CREATION PROCEDURE

### Tool: Veo 3.1

**Endpoint:**
```
https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning
```

### Step-by-Step Process

1. **Start with a generated hero image** (use the image you want to animate)

2. **Build the video request:**
```python
payload = {
    "instances": [{
        "prompt": """8 second cinematic animation. [SCENE DESCRIPTION].

SCENE: [What's happening, who's there]

ANIMATION:
- [Movement 1]
- [Movement 2]
- [Visual effects - code rain, counters, etc.]

AUDIO/DIALOGUE:
[0-3s] [Sound/dialogue]
[3-6s] [Sound/dialogue]
[6-8s] [Sound/dialogue]

[VIBE DESCRIPTION].""",
        "image": {
            "bytesBase64Encoded": hero_b64,
            "mimeType": "image/png"
        }
    }],
    "parameters": {
        "aspectRatio": "16:9",
        "durationSeconds": 8
    }
}
```

3. **Submit and poll:**
```bash
# Submit
curl -s "https://...predictLongRunning?key=$KEY" -d @request.json
# Returns: {"name": "operations/xxxxx"}

# Poll until done
curl -s "https://.../${OPERATION}?key=$KEY"
# When done=true, extract video URI and download
```

4. **Download the video:**
```bash
VIDEO_URI=$(echo "$RESULT" | jq -r '.response.generateVideoResponse.generatedSamples[0].video.uri')
curl -L "${VIDEO_URI}&key=$KEY" -o output.mp4
```

---

## 📦 STORAGE & DEPLOYMENT

### Supabase Storage

**Bucket:** `tales` (public)
**Project:** StepTen.io (`iavnhggphhrvbcidixiw`)
**Base URL:** `https://iavnhggphhrvbcidixiw.supabase.co/storage/v1/object/public/tales`

**Structure:**
```
tales/
├── hero-videos/{slug}.mp4
├── images/{slug}/
│   ├── hero.png
│   ├── scene-1.png
│   ├── scene-2.png
│   └── ...
└── thumbnails/{slug}.jpg
```

### Upload Command
```bash
curl -X PUT "${SUPABASE_URL}/storage/v1/object/tales/images/${SLUG}/hero.png" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: image/png" \
  -T ~/clawd/stepten-io/content/tales/image.png
```

### Cache Busting

After uploading new images, add version param to URLs in `lib/tales.ts`:
```bash
TIMESTAMP=$(date +%s)
sed -i '' "s|${SLUG}/hero.png|${SLUG}/hero.png?v=${TIMESTAMP}|g" lib/tales.ts
```

---

## 📝 TALES ARTICLE WORKFLOW

### Full Process

1. **Read the article** - Understand the story, identify image opportunities
2. **Plan images** - List every image needed (hero + inline)
3. **Identify characters** - Who appears? Load their references
4. **Generate images** - One by one with character consistency
5. **Review with Stephen** - Send previews before uploading
6. **Generate hero video** - Animate the hero image
7. **Upload to Supabase** - All images + video
8. **Update tales.ts** - Add cache bust params
9. **Commit and deploy** - Push to master

### Image Checklist Per Article

- [ ] Hero image (always required)
- [ ] Hero video (always required)
- [ ] Inline images (as needed by content)
- [ ] All characters use reference images
- [ ] 16:9 aspect ratio
- [ ] GTA V comic book style
- [ ] Cache bust added
- [ ] Uploaded to Supabase
- [ ] Deployed

---

## 🌍 THE UNIVERSE

This isn't just a website. It's a story.

**Core Principles:**
1. **Every person becomes a character** - Friends, colleagues, anyone mentioned
2. **Consistent visual identity** - Same style, same characters, always
3. **Characters have personality** - Dialogue, expressions, relationships
4. **The story grows** - Each article adds to the universe
5. **We can animate anything** - Music videos, shorts, full stories

**Future Possibilities:**
- Animated series episodes
- Music videos featuring characters
- Interactive stories
- Character crossovers
- Merchandise with character art

**The goal:** Build a recognizable visual universe that people want to follow.

---

## 🔧 QUICK REFERENCE

### API Keys (from Supabase credentials)
- `google_generative_ai_key` - Nano Banana Pro + Veo

### Key Paths
- Characters: `~/clawd/stepten-io/characters/`
- Local images: `~/clawd/stepten-io/content/tales/`
- Tales data: `~/clawd/stepten-io/lib/tales.ts`
- This doc: `~/clawd/stepten-io/docs/VISUAL-CONTENT-GUIDE.md`

### Aspect Ratios
- Hero images: 16:9
- Hero videos: 16:9, 8 seconds
- Thumbnails: 16:9

### Style Keywords
Always include in prompts:
- "GTA V comic book style"
- "16:9 widescreen landscape"
- "Matrix code rain"
- "Neon accents"
- "Cyberpunk"

---

*Last updated: Feb 18, 2026*
*By: Pinky 🐀*
