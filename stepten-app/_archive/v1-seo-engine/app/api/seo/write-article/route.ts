import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { STEPTEN_PERSONALITY } from "@/lib/personality-profile";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { framework, research, idea } = await request.json();

        if (!framework || !research || !idea) {
            return NextResponse.json(
                { error: "Framework, research, and idea are required" },
                { status: 400 }
            );
        }

        // Get active research version
        const activeResearch = research.activeVersion === "refined" && research.versions.refined
            ? research.versions.refined
            : research.versions.original;

        // Build comprehensive writing prompt
        const prompt = buildWritingPrompt(framework, activeResearch, idea);

        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 16000, // Maximum for long articles
            temperature: 0.8, // Higher for creative writing
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        let article = message.content[0].type === "text" ? message.content[0].text : "";

        // Clean and ensure HTML structure
        article = article.trim();

        // Remove markdown code blocks if Claude wrapped it
        article = article.replace(/^```html\n?/g, "").replace(/\n?```$/g, "");

        // If Claude didn't output HTML, convert markdown/plain text to HTML
        if (!article.startsWith("<h1>") && !article.startsWith("<p>")) {
            console.log("Converting markdown/plain text to HTML");
            article = convertToHTML(article);
        }

        // Ensure it starts with an H1 tag
        if (!article.startsWith("<h1>")) {
            console.warn("Article doesn't start with <h1> after conversion");
        }

        return NextResponse.json({
            article,
            wordCount: article.split(/\s+/).length,
            success: true,
        });
    } catch (error: any) {
        console.error("Article writing error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to write article",
                success: false,
            },
            { status: 500 }
        );
    }
}

function convertToHTML(text: string): string {
    let html = text.trim();

    // Convert markdown headers to HTML
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');

    // Convert markdown bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Convert markdown links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="nofollow">$1</a>');

    // Convert unordered lists
    html = html.replace(/^\* (.+$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.+$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/g, function (match) {
        return '<ul>' + match + '</ul>';
    });

    // Convert numbered lists
    html = html.replace(/^\d+\. (.+$)/gim, '<li>$1</li>');

    // Wrap consecutive <li> tags in proper list tags
    html = html.replace(/(<li>.*?<\/li>(\n<li>.*?<\/li>)*)/g, function (match) {
        if (html.indexOf('<ul>') === -1) {
            return '<ul>' + match + '</ul>';
        }
        return match;
    });

    // Split by double newlines to identify paragraphs
    const lines = html.split('\n\n');
    const processedLines = lines.map(line => {
        line = line.trim();
        // Skip if already wrapped in HTML tags
        if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<ol') || line.startsWith('<p') || line.startsWith('<li>') || line.length === 0) {
            return line;
        }
        // Wrap in paragraph tags
        return `<p>${line}</p>`;
    });

    html = processedLines.join('\n\n');

    // Clean up extra newlines
    html = html.replace(/\n{3,}/g, '\n\n');

    return html;
}

function buildWritingPrompt(framework: any, research: any, idea: string): string {
    const personality = STEPTEN_PERSONALITY;
    const researchResults = Array.isArray(research?.researchResults) ? research.researchResults : [];
    const semanticKeywords = Array.isArray(research?.aggregatedInsights?.semanticKeywords)
        ? research.aggregatedInsights.semanticKeywords
        : [];
    const mainTopic = research?.decomposition?.mainTopic || "N/A";
    const targetAudience = research?.decomposition?.targetAudience || "N/A";
    const contentAngle = research?.decomposition?.contentAngle || "N/A";

    return `You are writing as ${personality.name}, a ${personality.role}.

## YOUR PERSONALITY & VOICE:

**Tone:** ${personality.voice.tone}
**Energy:** ${personality.voice.energy}
**Authority:** ${personality.voice.authority}
**Perspective:** ${personality.perspective}

## WRITING STYLE RULES:

**Sentence Structure:**
${personality.style.sentenceStructure.map(s => `- ${s}`).join("\n")}

**Paragraph Style:**
${personality.style.paragraphStyle.map(s => `- ${s}`).join("\n")}

**Language Use:**
${personality.style.languageUse.map(s => `- ${s}`).join("\n")}

**Engagement Techniques:**
- ${personality.engagement.hooks.join("\n- ")}

**FORBIDDEN (AI tells - never use these):**
${personality.avoid.map(a => `- ${a}`).join("\n")}

## SIGNATURE PHRASES TO USE:
${personality.signature.phrases.map(p => `- "${p}"`).join("\n")}

## TECHNICAL SPECS:
- Reading Level: ${personality.technical.readability}
- Average Sentence: ${personality.technical.avgSentenceLength}
- Average Paragraph: ${personality.technical.avgParagraphLength}
- Use contractions liberally: ${personality.technical.contractions}

---

## ARTICLE FRAMEWORK:

**Title:** ${framework.metadata.title}
**Focus Keyword:** ${framework.metadata.focusKeyword}
**Target Word Count:** ${framework.metadata.wordCountTarget}
**Meta Description:** ${framework.metadata.metaDescription}

## OUTLINE TO FOLLOW:

${JSON.stringify(framework.outline, null, 2)}

## RESEARCH INSIGHTS:

**Main Topic:** ${mainTopic}
**Target Audience:** ${targetAudience}
**Content Angle:** ${contentAngle}

**Key Findings from Research:**
${researchResults.slice(0, 3).map((result: any) => `
Query: ${result.query}
Summary: ${result.summary}
Top Findings: ${(Array.isArray(result.keyFindings) ? result.keyFindings : []).slice(0, 2).map((f: any) => f.finding).join("; ")}
`).join("\n")}

**Semantic Keywords to Incorporate:**
${semanticKeywords.slice(0, 15).join(", ")}

## WRITING INSTRUCTIONS:

1. **Marketing-First, SEO-Second:**
   - Make it compelling FIRST
   - Keywords flow naturally, never forced
   - Reader value > Search rankings

2. **LLM Optimization:**
   - Use clear question-answer pairs where natural
   - Numbered lists for processes
   - Proper heading hierarchy (H1 → H2 → H3)

3. **Anti-AI Detection:**
   - Vary sentence length dramatically (5 words to 25 words)
   - Mix paragraph lengths
   - Use contractions
   - Include occasional fragments
   - Show personality and opinions
   - Unexpected transitions
   - Questions that engage reader

4. **Plagiarism Prevention:**
   - 100% unique angles
   - Original examples (specific, not generic)
   - Your own voice throughout
   - Never copy competitor phrasing

5. **Link Integration:**
   - Follow the framework's link placements
   - Use natural anchor text (not "click here")
   - Integrate seamlessly into narrative

6. **SEO Integration:**
   - Focus keyword appears naturally in:
     * H1 title
     * First 100 words
     * 2-3 subheadings
     * Naturally throughout (1-1.5% density)
   - Semantic variations prevent repetition
   - Headers are compelling FIRST, keyword-rich second

## OUTPUT FORMAT:

**CRITICAL: You MUST output proper HTML markup. DO NOT output plain text or markdown.**

Required structure:
- Use \`<h1>\` for the main title (EXACTLY ONCE at the start)
- Use \`<h2>\` for main sections
- Use \`<h3>\` for subsections
- Use \`<p>\` for EVERY paragraph
- Use \`<ul>\` and \`<li>\` for bullet lists
- Use \`<ol>\` and \`<li>\` for numbered lists
- Use \`<a href="URL" rel="nofollow/follow" target="_blank">\` for links (follow framework's rel attributes)
- Use \`<strong>\` for emphasis
- Use \`<em>\` for italics

**Example structure:**
\`\`\`html
<h1>Main Title Here</h1>

<p>First paragraph with engaging hook...</p>

<p>Second paragraph continues the narrative...</p>

<h2>First Major Section</h2>

<p>Content for this section...</p>

<h3>Subsection</h3>

<p>More detailed content...</p>

<ul>
<li>List item one</li>
<li>List item two</li>
</ul>
\`\`\`

**DO NOT:**
- Output plain text without HTML tags
- Use markdown formatting (##, *, etc.)
- Forget to wrap paragraphs in <p> tags
- Skip the opening <h1> tag

**START WRITING THE HTML ARTICLE NOW:**

${framework.outline[0].instructions || "Hook the reader immediately with a surprising fact or provocative question."}`;
}
