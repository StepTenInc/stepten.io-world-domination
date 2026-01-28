# 🎤 Step 1: Voice to Idea - Prompts

**Step:** Voice to Idea Capture  
**AI Model:** OpenAI Whisper (`whisper-1`)  
**Last Updated:** 2026-01-10 11:00 SGT

---

## Overview

Step 1 uses Whisper for voice transcription, then optionally processes the transcription with an LLM to extract a structured idea.

---

## Prompts

### PROMPT 1: Voice Transcription

**Model:** `whisper-1`  
**Type:** Audio Transcription  
**When Used:** When user records voice

```
// Whisper doesn't use text prompts - it's audio-to-text
// Configuration only:

{
  "model": "whisper-1",
  "language": "en",
  "response_format": "text",
  "temperature": 0
}
```

**Notes:**
- Whisper auto-detects language if not specified
- Use `response_format: "verbose_json"` to get timestamps
- Temperature 0 for most accurate transcription

---

### PROMPT 2: Idea Extraction (Post-Transcription)

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Text Processing  
**When Used:** After transcription to structure the idea

```markdown
## SYSTEM PROMPT

You are an expert content strategist helping extract article ideas from raw voice notes.

Your job is to take a raw transcription and extract:
1. The main topic or subject
2. The unique angle or perspective
3. The target audience
4. Key points they want to cover
5. A suggested working title

Be concise and structured. If information is missing, note what needs clarification.

## USER PROMPT

Here is a voice transcription from the user:

---
{{TRANSCRIPTION}}
---

Please extract the article idea with this structure:

**Main Topic:** [One line summary]
**Unique Angle:** [What makes this perspective different]
**Target Audience:** [Who this is for]
**Key Points:**
- Point 1
- Point 2
- Point 3

**Suggested Title:** [Working title]

**Needs Clarification:** [List anything unclear]
```

---

### PROMPT 3: Document Processing

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Document Analysis  
**When Used:** When user uploads a document

```markdown
## SYSTEM PROMPT

You are an expert content analyst. You've been given a document that contains an article idea or research.

Your job is to extract the core article concept from this document.

Output a structured summary that can be used to kickstart the content creation process.

## USER PROMPT

Here is the uploaded document content:

---
{{DOCUMENT_CONTENT}}
---

Please extract:

**Document Type:** [Research notes / Outline / Draft / Other]
**Main Topic:** [Core subject]
**Key Insights:**
- Insight 1
- Insight 2
- Insight 3

**Suggested Article Title:** [Working title]
**Recommended Next Steps:** [What should happen next in the pipeline]
```

---

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{TRANSCRIPTION}}` | Raw text from Whisper | "So I want to write about AI automation..." |
| `{{DOCUMENT_CONTENT}}` | Extracted text from uploaded file | "# AI Automation Research\n\n## Key Points..." |

---

## Testing This Step

### Test Case 1: Voice Input
1. Record: "I want to write about how small businesses can use AI tools without spending a fortune"
2. Expected output: Structured idea about budget AI for SMBs

### Test Case 2: Text Input
1. Type: "SEO best practices for 2026 - focus on AI-generated content detection"
2. Expected output: Direct pass-through (no processing needed)

### Test Case 3: Document Upload
1. Upload: Research PDF about AI trends
2. Expected output: Extracted key points and suggested title

---

## Prompt Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial prompts created |

---

*Last updated: 2026-01-10 11:00 SGT*
