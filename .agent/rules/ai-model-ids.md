# AI Model IDs - Flagship Models (Jan 2026)

⚠️ **CRITICAL**: Always use these EXACT model IDs. These are the verified flagship models.

## Flagship API Model IDs

| Model Family | Flagship API ID | Status | Key Integration Detail |
|--------------|----------------|--------|------------------------|
| **Gemini 3** | `gemini-3-pro-preview` | ✅ Active | Requires `google-generativeai>=1.0.0` |
| **GPT-5** | `gpt-5.2` | ✅ Active | Supports `reasoning.effort` param |
| **Claude 4.5** | `claude-opus-4-5-20251101` | ✅ Active | Do NOT use `claude-3-opus` (retired Jan 5) |
| **Grok 4.1** | `grok-4-1-fast-reasoning` | ✅ Active | OpenAI-compatible endpoint |

## Usage in APIs

### Grok (Humanization)
```typescript
model: "grok-4-1-fast-reasoning"
```

### GPT-5 (Analysis, Debugging)
```typescript
model: "gpt-5.2"
```

### Claude 4.5 (Writing, Code Generation)
```typescript
model: "claude-opus-4-5-20251101"
```

### Gemini 3 (SEO, Design)
```typescript
model: "gemini-3-pro-preview"
```

## Deprecated Models (DO NOT USE)

- ❌ `grok-beta` - Deprecated Sep 15, 2025
- ❌ `grok-3` - Use `grok-4-1-fast-reasoning` instead
- ❌ `claude-3-opus` - Retired Jan 5, 2026
- ❌ `gpt-4o` - Superseded by GPT-5.2
- ❌ `gemini-2-flash` - Use Gemini 3 instead

## Version Requirements

- **Grok**: OpenAI-compatible SDK
- **Gemini**: `google-generativeai>=1.0.0`
- **GPT-5**: `openai>=latest`
- **Claude**: `@anthropic-ai/sdk>=latest`
