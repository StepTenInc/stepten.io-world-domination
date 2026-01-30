import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { STEPTEN_PERSONALITY } from "@/lib/personality-profile";
import { ClusterArticle } from "@/lib/seo-types";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST /api/seo/generate-cluster-article
 *
 * Generate an article following cluster strategy with automatic internal linking
 *
 * Request body:
 * {
 *   "clusterArticle": ClusterArticle,
 *   "relatedArticles": ClusterArticle[], // Articles to link to
 *   "pillarArticle": ClusterArticle,
 *   "customInstructions": string (optional)
 * }
 *
 * Response:
 * {
 *   "article": string (HTML),
 *   "wordCount": number,
 *   "internalLinks": Array<{
 *     "targetArticleId": string,
 *     "anchorText": string,
 *     "targetKeyword": string
 *   }>,
 *   "success": true
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            clusterArticle,
            relatedArticles = [],
            pillarArticle,
            customInstructions = "",
        } = body;

        // Validate required fields
        if (!clusterArticle || !clusterArticle.keyword) {
            return NextResponse.json(
                {
                    error: "clusterArticle with keyword is required",
                    success: false,
                },
                { status: 400 }
            );
        }

        if (!pillarArticle || !pillarArticle.keyword) {
            return NextResponse.json(
                {
                    error: "pillarArticle with keyword is required",
                    success: false,
                },
                { status: 400 }
            );
        }

        // Validate cluster article structure
        if (!clusterArticle.type || !["pillar", "cluster", "supporting"].includes(clusterArticle.type)) {
            return NextResponse.json(
                {
                    error: "clusterArticle.type must be 'pillar', 'cluster', or 'supporting'",
                    success: false,
                },
                { status: 400 }
            );
        }

        if (!clusterArticle.wordCount || clusterArticle.wordCount < 500) {
            return NextResponse.json(
                {
                    error: "clusterArticle.wordCount must be at least 500",
                    success: false,
                },
                { status: 400 }
            );
        }

        console.log(
            `Generating ${clusterArticle.type} article for keyword: ${clusterArticle.keyword.keyword}`
        );
        console.log(`Target word count: ${clusterArticle.wordCount}`);
        console.log(`Linking to ${relatedArticles.length} related articles`);

        // Build comprehensive writing prompt with cluster context
        const prompt = buildClusterArticlePrompt(
            clusterArticle,
            pillarArticle,
            relatedArticles,
            customInstructions
        );

        // Generate article with Claude
        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 16000,
            temperature: 0.8, // Higher for creative, engaging writing
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

        // Extract internal links that were generated
        const internalLinks = extractInternalLinks(article, relatedArticles, pillarArticle);

        // Calculate word count
        const wordCount = article.split(/\s+/).length;

        console.log(`Generated article: ${wordCount} words, ${internalLinks.length} internal links`);

        return NextResponse.json({
            article,
            wordCount,
            internalLinks,
            metadata: {
                type: clusterArticle.type,
                keyword: clusterArticle.keyword.keyword,
                targetWordCount: clusterArticle.wordCount,
                actualWordCount: wordCount,
                intent: clusterArticle.keyword.intent,
                difficulty: clusterArticle.keyword.difficulty,
                searchVolume: clusterArticle.keyword.searchVolume,
            },
            success: true,
        });
    } catch (error: any) {
        console.error("Generate cluster article error:", error);

        // Handle specific error types
        if (error.message?.includes("API key")) {
            return NextResponse.json(
                {
                    error: "Anthropic API key not configured",
                    success: false,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                error: error.message || "Failed to generate cluster article",
                details: process.env.NODE_ENV === "development" ? error.stack : undefined,
                success: false,
            },
            { status: 500 }
        );
    }
}

/**
 * Build comprehensive writing prompt for cluster article
 */
function buildClusterArticlePrompt(
    clusterArticle: ClusterArticle,
    pillarArticle: ClusterArticle,
    relatedArticles: ClusterArticle[],
    customInstructions: string
): string {
    const personality = STEPTEN_PERSONALITY;

    // Determine article context based on type
    let contextInstructions = "";
    if (clusterArticle.type === "pillar") {
        contextInstructions = `This is a PILLAR ARTICLE - the comprehensive hub for the topic "${clusterArticle.keyword.keyword}".
- Cover the topic exhaustively but engagingly
- This is the go-to resource readers bookmark and return to
- Link to all cluster articles (subtopics) in relevant sections
- Establish topic authority with depth and breadth`;
    } else if (clusterArticle.type === "cluster") {
        contextInstructions = `This is a CLUSTER ARTICLE - a major subtopic of "${pillarArticle.keyword.keyword}".
- Focus deeply on this specific aspect: "${clusterArticle.keyword.keyword}"
- Link back to pillar article: "${pillarArticle.keyword.keyword}"
- Link to relevant supporting articles for related details
- Provide comprehensive coverage of this subtopic`;
    } else {
        contextInstructions = `This is a SUPPORTING ARTICLE - a specific, focused piece within the "${pillarArticle.keyword.keyword}" topic cluster.
- Target the long-tail keyword: "${clusterArticle.keyword.keyword}"
- Link back to the main pillar: "${pillarArticle.keyword.keyword}"
- Keep focused on this specific question/topic
- Provide actionable, specific information`;
    }

    // Build internal linking instructions
    let linkingInstructions = "";
    if (relatedArticles.length > 0) {
        linkingInstructions = `\n## INTERNAL LINKS TO INCLUDE:\n\n`;
        linkingInstructions += `Link to the pillar article:\n- Keyword: "${pillarArticle.keyword.keyword}"\n- Use natural anchor text like "learn more about ${pillarArticle.keyword.keyword}" or contextual references\n\n`;

        if (relatedArticles.length > 0) {
            linkingInstructions += `Also link to these related articles naturally within the content:\n`;
            relatedArticles.forEach((article) => {
                linkingInstructions += `- "${article.keyword.keyword}" (${article.type} article)\n`;
            });
            linkingInstructions += `\nIntegrate these links seamlessly into the narrative where contextually relevant.\n`;
        }
    }

    return `You are writing as ${personality.name}, a ${personality.role}.

## YOUR PERSONALITY & VOICE:

**Tone:** ${personality.voice.tone}
**Energy:** ${personality.voice.energy}
**Authority:** ${personality.voice.authority}
**Perspective:** ${personality.perspective}

## WRITING STYLE RULES:

**Sentence Structure:**
${personality.style.sentenceStructure.map((s) => `- ${s}`).join("\n")}

**Paragraph Style:**
${personality.style.paragraphStyle.map((s) => `- ${s}`).join("\n")}

**Language Use:**
${personality.style.languageUse.map((s) => `- ${s}`).join("\n")}

**Engagement Techniques:**
${personality.engagement.hooks.map((h) => `- ${h}`).join("\n")}

**FORBIDDEN (AI tells - never use these):**
${personality.avoid.map((a) => `- ${a}`).join("\n")}

## SIGNATURE PHRASES TO USE:
${personality.signature.phrases.map((p) => `- "${p}"`).join("\n")}

## TECHNICAL SPECS:
- Reading Level: ${personality.technical.readability}
- Average Sentence: ${personality.technical.avgSentenceLength}
- Average Paragraph: ${personality.technical.avgParagraphLength}
- Use contractions liberally: ${personality.technical.contractions}

---

## ARTICLE SPECIFICATIONS:

${contextInstructions}

**Target Keyword:** ${clusterArticle.keyword.keyword}
**Search Intent:** ${clusterArticle.keyword.intent}
**Search Volume:** ${clusterArticle.keyword.searchVolume}/month
**Difficulty:** ${clusterArticle.keyword.difficulty}/100
**Target Word Count:** ${clusterArticle.wordCount} words

${linkingInstructions}

## CONTENT STRATEGY:

1. **Marketing-First Approach:**
   - Make it compelling and valuable FIRST
   - Keywords flow naturally, never forced
   - Reader value > Search rankings
   - Every paragraph earns the next read

2. **LLM Optimization:**
   - Use clear question-answer pairs where natural
   - Numbered lists for step-by-step processes
   - Proper heading hierarchy (H1 → H2 → H3)
   - Structured content for AI understanding

3. **Anti-AI Detection:**
   - Vary sentence length dramatically (5 words to 25 words)
   - Mix paragraph lengths (1 sentence to 5 sentences)
   - Use contractions naturally
   - Include occasional sentence fragments
   - Show personality and clear opinions
   - Unexpected transitions
   - Rhetorical questions that engage reader
   - Real examples with specific details

4. **SEO Integration:**
   - Target keyword appears naturally in:
     * H1 title
     * First 100 words
     * 2-3 subheadings
     * Throughout body (1-1.5% density)
   - Semantic variations prevent keyword stuffing
   - Headers are compelling FIRST, keyword-rich second

5. **Internal Linking (CRITICAL):**
   - Include links to related articles naturally
   - Use descriptive anchor text (never "click here")
   - Link in context where it adds value
   - 3-5 internal links for cluster articles
   - 2-3 internal links for supporting articles
   - Always link back to pillar article

${customInstructions ? `\n## CUSTOM INSTRUCTIONS:\n${customInstructions}\n` : ""}

## OUTPUT FORMAT:

**CRITICAL: You MUST output proper HTML markup. DO NOT output plain text or markdown.**

Required structure:
- Use \`<h1>\` for the main title (EXACTLY ONCE at the start)
- Use \`<h2>\` for main sections
- Use \`<h3>\` for subsections
- Use \`<p>\` for EVERY paragraph
- Use \`<ul>\` and \`<li>\` for bullet lists
- Use \`<ol>\` and \`<li>\` for numbered lists
- Use \`<a href="#" data-cluster-link="ARTICLE_KEYWORD">\` for internal cluster links
- Use \`<strong>\` for emphasis
- Use \`<em>\` for italics

**Internal Link Format:**
For links to other cluster articles, use this format:
\`<a href="#" data-cluster-link="${pillarArticle.keyword.keyword}" rel="internal">anchor text</a>\`

The data-cluster-link attribute helps identify which article to link to in the cluster.

**Example structure:**
\`\`\`html
<h1>Main Title About ${clusterArticle.keyword.keyword}</h1>

<p>Engaging hook that grabs attention immediately...</p>

<p>Second paragraph building momentum. Notice the variety?</p>

<h2>First Major Section</h2>

<p>Content here. And here's a link to the <a href="#" data-cluster-link="${pillarArticle.keyword.keyword}" rel="internal">complete ${pillarArticle.keyword.keyword} guide</a> for more context.</p>

<h3>Subsection</h3>

<p>More detailed content...</p>

<ul>
<li>First point</li>
<li>Second point</li>
<li>Third point</li>
</ul>
\`\`\`

**DO NOT:**
- Output plain text without HTML tags
- Use markdown formatting (##, *, etc.)
- Forget to wrap paragraphs in <p> tags
- Skip the opening <h1> tag
- Use generic examples or AI-sounding language

**START WRITING THE HTML ARTICLE NOW:**

Hook the reader immediately with a surprising fact, counterintuitive statement, or compelling question about "${clusterArticle.keyword.keyword}". Make them want to keep reading.`;
}

/**
 * Convert markdown/plain text to HTML
 */
function convertToHTML(text: string): string {
    let html = text.trim();

    // Convert markdown headers to HTML
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");

    // Convert markdown bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
    html = html.replace(/_(.+?)_/g, "<em>$1</em>");

    // Convert markdown links
    html = html.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="nofollow">$1</a>'
    );

    // Convert unordered lists
    html = html.replace(/^\* (.+$)/gim, "<li>$1</li>");
    html = html.replace(/^- (.+$)/gim, "<li>$1</li>");

    // Convert numbered lists
    html = html.replace(/^\d+\. (.+$)/gim, "<li>$1</li>");

    // Wrap consecutive <li> tags in proper list tags
    html = html.replace(/(<li>[\s\S]*?<\/li>(\n<li>[\s\S]*?<\/li>)*)/g, function (match) {
        if (!match.includes("<ul>") && !match.includes("<ol>")) {
            return "<ul>" + match + "</ul>";
        }
        return match;
    });

    // Split by double newlines to identify paragraphs
    const lines = html.split("\n\n");
    const processedLines = lines.map((line) => {
        line = line.trim();
        // Skip if already wrapped in HTML tags
        if (
            line.startsWith("<h") ||
            line.startsWith("<ul") ||
            line.startsWith("<ol") ||
            line.startsWith("<p") ||
            line.startsWith("<li>") ||
            line.length === 0
        ) {
            return line;
        }
        // Wrap in paragraph tags
        return `<p>${line}</p>`;
    });

    html = processedLines.join("\n\n");

    // Clean up extra newlines
    html = html.replace(/\n{3,}/g, "\n\n");

    return html;
}

/**
 * Extract internal links from generated article
 */
function extractInternalLinks(
    article: string,
    relatedArticles: ClusterArticle[],
    pillarArticle: ClusterArticle
): Array<{
    targetArticleId: string;
    anchorText: string;
    targetKeyword: string;
}> {
    const links: Array<{
        targetArticleId: string;
        anchorText: string;
        targetKeyword: string;
    }> = [];

    // Find all data-cluster-link attributes
    const linkRegex = /<a[^>]*data-cluster-link="([^"]*)"[^>]*>(.*?)<\/a>/gi;
    let match;

    while ((match = linkRegex.exec(article)) !== null) {
        const targetKeyword = match[1];
        const anchorText = match[2].replace(/<[^>]*>/g, ""); // Remove any HTML tags in anchor text

        // Find matching article
        const allArticles = [pillarArticle, ...relatedArticles];
        const targetArticle = allArticles.find(
            (a) => a.keyword.keyword === targetKeyword
        );

        if (targetArticle) {
            links.push({
                targetArticleId: targetArticle.id,
                anchorText,
                targetKeyword,
            });
        }
    }

    return links;
}
