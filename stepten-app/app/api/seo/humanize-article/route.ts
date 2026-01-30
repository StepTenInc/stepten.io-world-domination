import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Grok uses OpenAI-compatible API
const grok = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: "https://api.x.ai/v1",
});

// Split text into sentences while preserving HTML
function splitIntoSentences(text: string): string[] {
    // Remove HTML tags temporarily for sentence splitting
    const stripped = text.replace(/<[^>]*>/g, '');

    // Split into sentences (basic implementation)
    const sentences = stripped.match(/[^.!?]+[.!?]+/g) || [stripped];

    return sentences.map(s => s.trim()).filter(s => s.length > 0);
}

// Extract sentences with their HTML context
function extractSentencesWithHTML(html: string): Array<{ id: string; content: string; plainText: string; separator: string }> {
    const sentences: Array<{ id: string; content: string; plainText: string; separator: string }> = [];
    let sentenceId = 0;

    // Simple HTML-aware sentence extraction
    // This preserves HTML tags within sentences
    const parts = html.split(/(?<=[.!?])(\s+(?=[A-Z<]))/);

    for (let i = 0; i < parts.length; i += 2) {
        const rawSentence = parts[i] || "";
        const separator = parts[i + 1] || "";
        const sentence = rawSentence.trim();
        if (sentence.length === 0) continue;

        sentences.push({
            id: `sentence-${sentenceId++}`,
            content: sentence,
            plainText: sentence.replace(/<[^>]*>/g, '').trim(),
            separator,
        });
    }

    return sentences;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        const { article, aiDetection, sentence, sentenceId } = body;

        if (!article && !sentence) {
            return NextResponse.json(
                { error: "Article content or sentence is required" },
                { status: 400 }
            );
        }

        // Validate types
        if (article && typeof article !== "string") {
            return NextResponse.json(
                { error: "Article must be a string" },
                { status: 400 }
            );
        }

        if (sentence) {
            if (typeof sentence !== "string") {
                return NextResponse.json(
                    { error: "Sentence must be a string" },
                    { status: 400 }
                );
            }
            if (!sentenceId || typeof sentenceId !== "string") {
                return NextResponse.json(
                    { error: "sentenceId is required and must be a string when sentence is provided" },
                    { status: 400 }
                );
            }
        }

        // Handle single sentence re-humanization
        if (sentence && sentenceId) {
            return await humanizeSingleSentence(sentence, sentenceId, aiDetection);
        }

        // Build detailed prompt with AI detection data
        let prompt = `You are a master humanization expert. Your job is to transform AI-written content into genuinely human writing that passes all AI detection tools.

## YOUR MISSION:
Take this article and make it indistinguishable from content written by an experienced human writer. Add emotion, personality, and authentic voice.

## CRITICAL REQUIREMENTS:

### 1. Add Genuine Emotion & Personality:
- Inject authentic human feelings (excitement, curiosity, concern, humor)
- Use personal observations and relatable moments
- Add conversational asides that feel spontaneous
- Include subjective opinions (not just facts)
- Show enthusiasm where appropriate

### 2. Create Engaging Hooks:
- Start sections with compelling questions or observations
- Use storytelling elements and mini-narratives
- Add surprising comparisons or analogies
- Create "aha!" moments for readers

### 3. Natural Imperfections (Human Traits):
- Vary sentence structure dramatically (3 words to 30+ words)
- Use strategic fragments for emphasis
- Occasional comma splices for flow
- Start sentences with "And," "But," "So," when natural
- Mix paragraph lengths (1 sentence to 6+ sentences)
- Use contractions liberally

### 4. Remove AI Patterns:
- Eliminate formulaic transitions (Furthermore, Moreover, Additionally)
- Remove parallel structure repetition
- Vary sentence openings (avoid pattern: "The X is...", "This Y...")
- Replace corporate-speak with natural language
- Remove overly perfect grammar where casual is better`;

        // Add specific AI detection issues if provided
        if (aiDetection?.aiTells && Array.isArray(aiDetection.aiTells) && aiDetection.aiTells.length > 0) {
            prompt += `\n\n### 5. FIX THESE SPECIFIC AI DETECTION ISSUES:\n`;
            aiDetection.aiTells.forEach((tell: any, index: number) => {
                const pattern = typeof tell === 'string' ? tell : tell.pattern;
                const example = tell.example || '';
                const fix = tell.fix || '';

                prompt += `\n**Issue ${index + 1}: ${pattern}**\n`;
                if (example) prompt += `Example: "${example}"\n`;
                if (fix) prompt += `Fix: ${fix}\n`;
            });
        }

        if (aiDetection?.humanLikelihood) {
            prompt += `\n\nCurrent Human Likelihood: ${aiDetection.humanLikelihood} - Your goal is to make this "Very High"\n`;
        }

        prompt += `\n\n## KEEP INTACT:
- All HTML tags (<h1>, <h2>, <p>, <a>, etc.)
- All links and their attributes
- The overall structure and main points
- SEO elements (just make them more natural)

## OUTPUT:
Return the COMPLETE humanized article with all HTML intact. Make every sentence feel like it came from a real person's keyboard, not an AI.

---

## ARTICLE TO HUMANIZE:

${article}`;

        const completion = await grok.chat.completions.create({
            model: "grok-4-1-fast-reasoning",
            messages: [
                {
                    role: "system",
                    content: "You are a humanization expert. Transform AI content into authentic human writing. Return ONLY the humanized article, no explanations.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.9, // Higher for more human variability
            max_tokens: 16000,
        });

        const humanizedArticle = completion.choices?.[0]?.message?.content || "";

        // Extract sentences from both versions
        const originalSentences = extractSentencesWithHTML(article);
        const humanizedSentences = extractSentencesWithHTML(humanizedArticle);

        // Create sentence-level changes with alignment
        const changes = [];
        const maxLength = Math.max(originalSentences.length, humanizedSentences.length);

        for (let i = 0; i < maxLength; i++) {
            const original = originalSentences[i];
            const humanized = humanizedSentences[i];

            if (!original && humanized) {
                // New sentence added
                changes.push({
                    id: humanized.id,
                    type: 'addition',
                    original: '',
                    humanized: humanized.content,
                    separator: humanized.separator || ' ',
                    status: 'accepted' // Default to accepted
                });
            } else if (original && !humanized) {
                // Sentence removed
                changes.push({
                    id: original.id,
                    type: 'deletion',
                    original: original.content,
                    humanized: '',
                    separator: original.separator || ' ',
                    status: 'accepted'
                });
            } else if (original && humanized) {
                // Check if sentence was modified
                const isModified = original.plainText !== humanized.plainText;
                changes.push({
                    id: original.id,
                    type: isModified ? 'modification' : 'unchanged',
                    original: original.content,
                    humanized: humanized.content,
                    separator: original.separator || humanized.separator || ' ',
                    status: 'accepted' // Default to accepted
                });
            }
        }

        // Generate change summary
        const summaryCompletion = await grok.chat.completions.create({
            model: "grok-4-1-fast-reasoning",
            messages: [
                {
                    role: "user",
                    content: `Compare these two article versions and list the TOP 5-7 changes you made to humanize it. Be specific.

ORIGINAL (first 500 chars):
${article.substring(0, 500)}...

HUMANIZED (first 500 chars):
${humanizedArticle.substring(0, 500)}...

Return ONLY a JSON array of changes:
[
  {
    "type": "emotion" | "hook" | "structure" | "tone" | "ai_fix",
    "description": "Brief description of change",
    "example": "Specific example of the change"
  }
]`,
                },
            ],
            temperature: 0.3,
            max_tokens: 1000,
        });

        let changeSummary = [];
        try {
            const summaryText = summaryCompletion.choices?.[0]?.message?.content || "[]";
            const cleaned = summaryText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            changeSummary = JSON.parse(cleaned);
        } catch (e) {
            console.error("Failed to parse change summary:", e);
            changeSummary = [
                { type: "general", description: "Article humanized with emotion and personality", example: "Multiple improvements made" }
            ];
        }

        return NextResponse.json({
            originalArticle: article,
            humanizedArticle,
            changes, // Sentence-level changes with IDs
            changeSummary,
            success: true,
        });
    } catch (error: any) {
        console.error("Humanization error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to humanize article",
                success: false,
            },
            { status: 500 }
        );
    }
}

// Handle single sentence re-humanization
async function humanizeSingleSentence(sentence: string, sentenceId: string, aiDetection: any) {
    try {
        const prompt = `You are a master humanization expert. Transform this single sentence to be more human, natural, and authentic.

CRITICAL REQUIREMENTS:
- Add genuine emotion and personality
- Use natural, conversational language
- Vary sentence structure
- Remove AI patterns
- Keep the core meaning intact
- Preserve any HTML tags

SENTENCE TO HUMANIZE:
${sentence}

Return ONLY the humanized sentence, nothing else.`;

        const completion = await grok.chat.completions.create({
            model: "grok-4-1-fast-reasoning",
            messages: [
                {
                    role: "system",
                    content: "You are a humanization expert. Transform AI sentences into authentic human writing. Return ONLY the humanized sentence.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.9,
            max_tokens: 500,
        });

        const humanizedSentence = completion.choices[0].message.content?.trim() || sentence;

        return NextResponse.json({
            success: true,
            sentenceId,
            original: sentence,
            humanized: humanizedSentence,
        });
    } catch (error: any) {
        console.error("Sentence humanization error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to humanize sentence",
                success: false,
            },
            { status: 500 }
        );
    }
}
