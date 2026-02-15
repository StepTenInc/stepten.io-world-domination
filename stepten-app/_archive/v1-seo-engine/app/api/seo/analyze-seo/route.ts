import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

// Types
interface Link {
    text: string;
    url: string;
}

interface SEOCheckInput {
    article: string;
    metadata: {
        title: string;
        focusKeyword: string;
        targetWordCount: number;
        metaDescription?: string;
        slug?: string;
    };
    links: {
        internal: Link[];
        outbound: Link[];
    };
}

interface SEOCheck {
    id: string;
    category: "technical" | "content" | "keywords" | "links" | "schema";
    name: string;
    status: "pass" | "warning" | "fail";
    score: number;
    message: string;
    currentValue?: string | number;
    idealValue?: string;
    autoFix?: {
        available: boolean;
        suggestion: string;
        action?: string;
    };
    details?: string[];
}

interface LinkHealthCheck {
    url: string;
    text: string;
    status: "healthy" | "broken" | "redirect" | "timeout";
    statusCode?: number;
    redirectUrl?: string;
    anchorRelevance: number;
    estimatedAuthority: number;
}

interface HeaderAnalysis {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h1Content: string[];
    hasKeywordInH1: boolean;
    hierarchyIssues: string[];
}

interface KeywordPlacement {
    inTitle: boolean;
    inH1: boolean;
    inFirstParagraph: boolean;
    inLastParagraph: boolean;
    inMetaDescription: boolean;
    inUrl: boolean;
    density: number;
    occurrences: number;
    placements: string[];
}

interface SchemaRecommendation {
    type: string;
    recommended: boolean;
    reason: string;
}

interface SEOResponse {
    seoScore: number;
    checks: SEOCheck[];
    metaSuggestions: {
        title: string;
        description: string;
        slug: string;
    };
    schemaRecommendations: SchemaRecommendation[];
    schemaMarkup: {
        jsonLd: string;
    };
    recommendations: string[];
    linkHealthChecks?: LinkHealthCheck[];
    headerAnalysis?: HeaderAnalysis;
    keywordPlacement?: KeywordPlacement;
    autoFixes?: {
        missingMetaDescription?: string;
        missingAltTexts?: Array<{ image: string; suggestedAlt: string }>;
        keywordSuggestions?: string[];
        brokenLinkAlternatives?: Array<{ brokenUrl: string; alternatives: string[] }>;
    };
}

// Helper Functions
function stripHtml(html: string): string {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const syllables = words.reduce((count, word) => {
        return count + countSyllables(word);
    }, 0);

    if (sentences.length === 0 || words.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Flesch Reading Ease Score
    const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    return Math.max(0, Math.min(100, score));
}

function countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (word.length <= 3) return 1;

    const vowels = "aeiouy";
    let count = 0;
    let previousWasVowel = false;

    for (let i = 0; i < word.length; i++) {
        const isVowel = vowels.includes(word[i]);
        if (isVowel && !previousWasVowel) {
            count++;
        }
        previousWasVowel = isVowel;
    }

    if (word.endsWith("e")) count--;
    if (word.endsWith("le") && word.length > 2 && !vowels.includes(word[word.length - 3])) {
        count++;
    }

    return Math.max(1, count);
}

function calculateKeywordDensity(text: string, keyword: string): number {
    const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 0);
    const keywordLower = keyword.toLowerCase();
    const keywordWords = keywordLower.split(/\s+/);

    let count = 0;
    for (let i = 0; i <= words.length - keywordWords.length; i++) {
        const phrase = words.slice(i, i + keywordWords.length).join(" ");
        if (phrase === keywordLower) count++;
    }

    return words.length > 0 ? (count / words.length) * 100 : 0;
}

function getFirst100Words(text: string): string {
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    return words.slice(0, 100).join(" ");
}

function createSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 60);
}

function extractImages(html: string): string[] {
    const imgRegex = /<img[^>]+>/g;
    const matches = html.match(imgRegex) || [];
    return matches;
}

function hasImageAlt(imgTag: string): boolean {
    return /alt=["'][^"']*["']/.test(imgTag) && !/alt=["']\s*["']/.test(imgTag);
}

function extractHeaders(html: string): { h1: string[]; h2: string[]; h3: string[] } {
    const h1Regex = /<h1[^>]*>([^<]+)<\/h1>/gi;
    const h2Regex = /<h2[^>]*>([^<]+)<\/h2>/gi;
    const h3Regex = /<h3[^>]*>([^<]+)<\/h3>/gi;

    const h1Matches = [...html.matchAll(h1Regex)].map((m) => m[1].trim());
    const h2Matches = [...html.matchAll(h2Regex)].map((m) => m[1].trim());
    const h3Matches = [...html.matchAll(h3Regex)].map((m) => m[1].trim());

    return { h1: h1Matches, h2: h2Matches, h3: h3Matches };
}

function analyzeHeaderStructure(html: string, keyword: string): HeaderAnalysis {
    const headers = extractHeaders(html);
    const hierarchyIssues: string[] = [];

    // Check for multiple H1s
    if (headers.h1.length === 0) {
        hierarchyIssues.push("No H1 heading found");
    } else if (headers.h1.length > 1) {
        hierarchyIssues.push(`Multiple H1 headings found (${headers.h1.length})`);
    }

    // Check for keyword in H1
    const hasKeywordInH1 = headers.h1.some((h1) =>
        h1.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!hasKeywordInH1 && headers.h1.length > 0) {
        hierarchyIssues.push("Focus keyword not found in H1");
    }

    // Check header hierarchy
    if (headers.h2.length === 0 && headers.h3.length > 0) {
        hierarchyIssues.push("H3 tags found without H2 tags (poor hierarchy)");
    }

    return {
        h1Count: headers.h1.length,
        h2Count: headers.h2.length,
        h3Count: headers.h3.length,
        h1Content: headers.h1,
        hasKeywordInH1,
        hierarchyIssues,
    };
}

function analyzeKeywordPlacement(
    html: string,
    plainText: string,
    keyword: string,
    title: string,
    metaDescription?: string,
    slug?: string
): KeywordPlacement {
    const keywordLower = keyword.toLowerCase();
    const plainTextLower = plainText.toLowerCase();
    const titleLower = title.toLowerCase();

    // Extract first and last paragraphs
    const paragraphs = plainText.split(/\n\n+/).filter((p) => p.trim().length > 0);
    const firstParagraph = paragraphs[0] || "";
    const lastParagraph = paragraphs[paragraphs.length - 1] || "";

    // Check keyword in H1
    const headers = extractHeaders(html);
    const inH1 = headers.h1.some((h1) => h1.toLowerCase().includes(keywordLower));

    // Count occurrences
    const words = plainTextLower.split(/\s+/);
    const keywordWords = keywordLower.split(/\s+/);
    let occurrences = 0;
    const placements: string[] = [];

    for (let i = 0; i <= words.length - keywordWords.length; i++) {
        const phrase = words.slice(i, i + keywordWords.length).join(" ");
        if (phrase === keywordLower) {
            occurrences++;
            // Determine placement
            const position = Math.floor((i / words.length) * 100);
            if (position < 10) placements.push("opening");
            else if (position > 90) placements.push("closing");
            else placements.push(`middle (${position}%)`);
        }
    }

    const density = words.length > 0 ? (occurrences / words.length) * 100 : 0;

    const metaLower = (metaDescription || "").toLowerCase();
    const slugLower = (slug || "").toLowerCase();

    return {
        inTitle: titleLower.includes(keywordLower),
        inH1,
        inFirstParagraph: firstParagraph.toLowerCase().includes(keywordLower),
        inLastParagraph: lastParagraph.toLowerCase().includes(keywordLower),
        inMetaDescription: metaLower.includes(keywordLower),
        inUrl: slugLower.includes(keywordLower),
        density,
        occurrences,
        placements: [...new Set(placements)],
    };
}

async function checkLinkHealth(links: Link[]): Promise<LinkHealthCheck[]> {
    const results: LinkHealthCheck[] = [];

    // Only check external links (performance optimization)
    const externalLinks = links.filter((link) => {
        try {
            const url = new URL(link.url);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch {
            return false;
        }
    });

    // Limit to 10 links to avoid timeout
    const linksToCheck = externalLinks.slice(0, 10);

    const checkPromises = linksToCheck.map(async (link) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(link.url, {
                method: "HEAD",
                signal: controller.signal,
                redirect: "manual",
            });

            clearTimeout(timeoutId);

            let status: "healthy" | "broken" | "redirect" | "timeout" = "healthy";
            let redirectUrl: string | undefined;

            if (response.status >= 200 && response.status < 300) {
                status = "healthy";
            } else if (response.status >= 300 && response.status < 400) {
                status = "redirect";
                redirectUrl = response.headers.get("location") || undefined;
            } else if (response.status >= 400) {
                status = "broken";
            }

            // Calculate anchor relevance (simple keyword match)
            const anchorLower = link.text.toLowerCase();
            const urlLower = link.url.toLowerCase();
            const anchorRelevance =
                anchorLower.length > 3 && !["click here", "read more", "here"].includes(anchorLower)
                    ? 80
                    : 40;

            // Estimate authority (based on domain)
            const domain = new URL(link.url).hostname;
            const estimatedAuthority = ["wikipedia.org", "gov", "edu"].some((d) =>
                domain.includes(d)
            )
                ? 90
                : domain.includes(".com")
                    ? 70
                    : 60;

            return {
                url: link.url,
                text: link.text,
                status,
                statusCode: response.status,
                redirectUrl,
                anchorRelevance,
                estimatedAuthority,
            };
        } catch (error: any) {
            const status: "healthy" | "broken" | "redirect" | "timeout" = error.name === "AbortError" ? "timeout" : "broken";
            return {
                url: link.url,
                text: link.text,
                status,
                statusCode: 0,
                anchorRelevance: 0,
                estimatedAuthority: 0,
            };
        }
    });

    results.push(...(await Promise.all(checkPromises)));

    return results;
}

// Main Analysis Function
function performBasicAnalysis(input: SEOCheckInput): {
    checks: SEOCheck[];
    basicScore: number;
    plainText: string;
    readabilityScore: number;
} {
    const { article, metadata, links } = input;
    const plainText = stripHtml(article);
    const wordCount = plainText.split(/\s+/).filter((w) => w.length > 0).length;
    const first100Words = getFirst100Words(plainText);
    const keywordDensity = calculateKeywordDensity(plainText, metadata.focusKeyword);
    const readabilityScore = calculateReadabilityScore(plainText);
    const images = extractImages(article);

    const checks: SEOCheck[] = [];
    let totalScore = 0;
    const maxScore = 155;

    // 1. Keyword in Title (15 points)
    const titleHasKeyword = metadata.title.toLowerCase().includes(metadata.focusKeyword.toLowerCase());
    checks.push({
        id: "keyword-in-title",
        category: "keywords",
        name: "Keyword in Title",
        status: titleHasKeyword ? "pass" : "fail",
        score: titleHasKeyword ? 15 : 0,
        message: titleHasKeyword
            ? "Focus keyword found in title"
            : "Focus keyword not found in title",
        currentValue: metadata.title,
    });
    totalScore += titleHasKeyword ? 15 : 0;

    // 2. Keyword in First 100 Words (10 points)
    const keywordInIntro = first100Words.toLowerCase().includes(metadata.focusKeyword.toLowerCase());
    checks.push({
        id: "keyword-in-intro",
        category: "keywords",
        name: "Keyword in Introduction",
        status: keywordInIntro ? "pass" : "warning",
        score: keywordInIntro ? 10 : 5,
        message: keywordInIntro
            ? "Focus keyword found in first 100 words"
            : "Focus keyword not found in first 100 words",
    });
    totalScore += keywordInIntro ? 10 : 5;

    // 3. Keyword Density (15 points)
    let densityStatus: "pass" | "warning" | "fail" = "fail";
    let densityScore = 0;
    let densityMessage = "";

    if (keywordDensity >= 1 && keywordDensity <= 2) {
        densityStatus = "pass";
        densityScore = 15;
        densityMessage = `Optimal keyword density: ${keywordDensity.toFixed(2)}%`;
    } else if (keywordDensity >= 0.5 && keywordDensity < 1) {
        densityStatus = "warning";
        densityScore = 10;
        densityMessage = `Keyword density is low: ${keywordDensity.toFixed(2)}% (aim for 1-2%)`;
    } else if (keywordDensity > 2 && keywordDensity <= 3) {
        densityStatus = "warning";
        densityScore = 10;
        densityMessage = `Keyword density is high: ${keywordDensity.toFixed(2)}% (aim for 1-2%)`;
    } else {
        densityStatus = "fail";
        densityScore = 0;
        densityMessage = `Keyword density is ${keywordDensity > 3 ? "too high" : "too low"}: ${keywordDensity.toFixed(2)}%`;
    }

    checks.push({
        id: "keyword-density",
        category: "keywords",
        name: "Keyword Density",
        status: densityStatus,
        score: densityScore,
        message: densityMessage,
        currentValue: `${keywordDensity.toFixed(2)}%`,
        idealValue: "1-2%",
    });
    totalScore += densityScore;

    // 4. Readability Score (15 points)
    let readabilityStatus: "pass" | "warning" | "fail" = "fail";
    let readabilityScorePoints = 0;
    let readabilityMessage = "";

    if (readabilityScore >= 60) {
        readabilityStatus = "pass";
        readabilityScorePoints = 15;
        readabilityMessage = `Good readability: ${readabilityScore.toFixed(0)}/100`;
    } else if (readabilityScore >= 40) {
        readabilityStatus = "warning";
        readabilityScorePoints = 10;
        readabilityMessage = `Moderate readability: ${readabilityScore.toFixed(0)}/100 (aim for 60+)`;
    } else {
        readabilityStatus = "fail";
        readabilityScorePoints = 5;
        readabilityMessage = `Low readability: ${readabilityScore.toFixed(0)}/100 (aim for 60+)`;
    }

    checks.push({
        id: "readability",
        category: "content",
        name: "Readability Score",
        status: readabilityStatus,
        score: readabilityScorePoints,
        message: readabilityMessage,
        currentValue: readabilityScore.toFixed(0),
        idealValue: "60-80",
    });
    totalScore += readabilityScorePoints;

    // 5. Content Length (15 points)
    const lengthRatio = wordCount / metadata.targetWordCount;
    let lengthStatus: "pass" | "warning" | "fail" = "fail";
    let lengthScore = 0;
    let lengthMessage = "";

    if (lengthRatio >= 0.9 && lengthRatio <= 1.1) {
        lengthStatus = "pass";
        lengthScore = 15;
        lengthMessage = `Optimal length: ${wordCount} words`;
    } else if (lengthRatio >= 0.7 && lengthRatio < 0.9) {
        lengthStatus = "warning";
        lengthScore = 10;
        lengthMessage = `Content is shorter than target: ${wordCount}/${metadata.targetWordCount} words`;
    } else if (lengthRatio > 1.1 && lengthRatio <= 1.3) {
        lengthStatus = "warning";
        lengthScore = 10;
        lengthMessage = `Content is longer than target: ${wordCount}/${metadata.targetWordCount} words`;
    } else {
        lengthStatus = "fail";
        lengthScore = 5;
        lengthMessage = `Content length significantly differs from target: ${wordCount}/${metadata.targetWordCount} words`;
    }

    checks.push({
        id: "content-length",
        category: "content",
        name: "Content Length",
        status: lengthStatus,
        score: lengthScore,
        message: lengthMessage,
        currentValue: wordCount,
        idealValue: `${metadata.targetWordCount} words`,
    });
    totalScore += lengthScore;

    // 6. Meta Title Length (10 points)
    const titleLength = metadata.title.length;
    let titleLengthStatus: "pass" | "warning" | "fail" = "fail";
    let titleLengthScore = 0;

    if (titleLength >= 50 && titleLength <= 60) {
        titleLengthStatus = "pass";
        titleLengthScore = 10;
    } else if (titleLength >= 40 && titleLength <= 70) {
        titleLengthStatus = "warning";
        titleLengthScore = 7;
    } else {
        titleLengthStatus = "fail";
        titleLengthScore = 0;
    }

    checks.push({
        id: "title-length",
        category: "technical",
        name: "Meta Title Length",
        status: titleLengthStatus,
        score: titleLengthScore,
        message: `Title is ${titleLength} characters (ideal: 50-60)`,
        currentValue: titleLength,
        idealValue: "50-60 characters",
    });
    totalScore += titleLengthScore;

    // 7. Meta Description Length (10 points)
    const metaDescription = metadata.metaDescription || "";
    const metaLength = metaDescription.length;
    const metaHasKeyword = metaDescription.toLowerCase().includes(metadata.focusKeyword.toLowerCase());
    let metaStatus: "pass" | "warning" | "fail" = "fail";
    let metaScore = 0;
    let metaMessage = "";

    if (metaLength === 0) {
        metaStatus = "fail";
        metaScore = 0;
        metaMessage = "Meta description is missing";
    } else if (metaLength >= 140 && metaLength <= 160) {
        metaStatus = metaHasKeyword ? "pass" : "warning";
        metaScore = metaHasKeyword ? 10 : 7;
        metaMessage = metaHasKeyword
            ? `Meta description is ${metaLength} characters and includes keyword`
            : `Meta description is ${metaLength} characters but missing keyword`;
    } else if (metaLength >= 120 && metaLength <= 180) {
        metaStatus = "warning";
        metaScore = metaHasKeyword ? 7 : 5;
        metaMessage = `Meta description is ${metaLength} characters (aim for 140-160)`;
    } else {
        metaStatus = "fail";
        metaScore = metaHasKeyword ? 5 : 0;
        metaMessage = `Meta description is ${metaLength} characters (aim for 140-160)`;
    }

    checks.push({
        id: "meta-description",
        category: "technical",
        name: "Meta Description",
        status: metaStatus,
        score: metaScore,
        message: metaMessage,
        currentValue: metaLength > 0 ? metaLength : "missing",
        idealValue: "140-160 characters",
    });
    totalScore += metaScore;

    // 8. Image Alt Tags (10 points)
    let altTagScore = 0;
    let altTagStatus: "pass" | "warning" | "fail" = "pass";
    let altTagMessage = "";

    if (images.length === 0) {
        altTagStatus = "warning";
        altTagScore = 5;
        altTagMessage = "No images found in article";
    } else {
        const imagesWithAlt = images.filter(hasImageAlt).length;
        const altRatio = imagesWithAlt / images.length;

        if (altRatio === 1) {
            altTagStatus = "pass";
            altTagScore = 10;
            altTagMessage = `All ${images.length} images have alt tags`;
        } else if (altRatio >= 0.5) {
            altTagStatus = "warning";
            altTagScore = 5;
            altTagMessage = `${imagesWithAlt}/${images.length} images have alt tags`;
        } else {
            altTagStatus = "fail";
            altTagScore = 0;
            altTagMessage = `Only ${imagesWithAlt}/${images.length} images have alt tags`;
        }
    }

    checks.push({
        id: "image-alt-tags",
        category: "technical",
        name: "Image Alt Tags",
        status: altTagStatus,
        score: altTagScore,
        message: altTagMessage,
        currentValue: images.length > 0 ? `${images.filter(hasImageAlt).length}/${images.length}` : "0",
        idealValue: "All images",
    });
    totalScore += altTagScore;

    // 9. Internal Links (15 points)
    const internalLinkCount = links.internal.length;
    let internalLinkStatus: "pass" | "warning" | "fail" = "fail";
    let internalLinkScore = 0;

    if (internalLinkCount >= 3 && internalLinkCount <= 10) {
        internalLinkStatus = "pass";
        internalLinkScore = 15;
    } else if (internalLinkCount >= 1 && internalLinkCount < 3) {
        internalLinkStatus = "warning";
        internalLinkScore = 10;
    } else if (internalLinkCount > 10) {
        internalLinkStatus = "warning";
        internalLinkScore = 10;
    } else {
        internalLinkStatus = "fail";
        internalLinkScore = 0;
    }

    checks.push({
        id: "internal-links",
        category: "links",
        name: "Internal Links",
        status: internalLinkStatus,
        score: internalLinkScore,
        message: `Article contains ${internalLinkCount} internal links (ideal: 3-10)`,
        currentValue: internalLinkCount,
        idealValue: "3-10 links",
    });
    totalScore += internalLinkScore;

    // 10. Outbound Links (10 points)
    const outboundLinkCount = links.outbound.length;
    let outboundLinkStatus: "pass" | "warning" | "fail" = "fail";
    let outboundLinkScore = 0;

    if (outboundLinkCount >= 2 && outboundLinkCount <= 5) {
        outboundLinkStatus = "pass";
        outboundLinkScore = 10;
    } else if (outboundLinkCount >= 1 && outboundLinkCount < 2) {
        outboundLinkStatus = "warning";
        outboundLinkScore = 7;
    } else if (outboundLinkCount > 5) {
        outboundLinkStatus = "warning";
        outboundLinkScore = 7;
    } else {
        outboundLinkStatus = "fail";
        outboundLinkScore = 0;
    }

    checks.push({
        id: "outbound-links",
        category: "links",
        name: "Outbound Links",
        status: outboundLinkStatus,
        score: outboundLinkScore,
        message: `Article contains ${outboundLinkCount} outbound links (ideal: 2-5)`,
        currentValue: outboundLinkCount,
        idealValue: "2-5 links",
    });
    totalScore += outboundLinkScore;

    // 11. Anchor Text Variety (10 points)
    const allLinks = [...links.internal, ...links.outbound];
    const uniqueAnchorTexts = new Set(allLinks.map((link) => link.text.toLowerCase()));
    const anchorVarietyRatio = allLinks.length > 0 ? uniqueAnchorTexts.size / allLinks.length : 0;

    let anchorStatus: "pass" | "warning" | "fail" = "fail";
    let anchorScore = 0;

    if (anchorVarietyRatio >= 0.8 || allLinks.length <= 3) {
        anchorStatus = "pass";
        anchorScore = 10;
    } else if (anchorVarietyRatio >= 0.5) {
        anchorStatus = "warning";
        anchorScore = 7;
    } else {
        anchorStatus = "fail";
        anchorScore = 0;
    }

    checks.push({
        id: "anchor-text-variety",
        category: "links",
        name: "Anchor Text Variety",
        status: anchorStatus,
        score: anchorScore,
        message: `${uniqueAnchorTexts.size} unique anchor texts from ${allLinks.length} total links`,
        currentValue: `${Math.round(anchorVarietyRatio * 100)}%`,
        idealValue: "80%+",
    });
    totalScore += anchorScore;

    // 12. Header Structure (10 points)
    const headerAnalysis = analyzeHeaderStructure(article, metadata.focusKeyword);
    let headerStatus: "pass" | "warning" | "fail" = "pass";
    let headerScore = 10;

    if (headerAnalysis.hierarchyIssues.length === 0) {
        headerStatus = "pass";
        headerScore = 10;
    } else if (headerAnalysis.hierarchyIssues.length <= 2) {
        headerStatus = "warning";
        headerScore = 6;
    } else {
        headerStatus = "fail";
        headerScore = 0;
    }

    checks.push({
        id: "header-structure",
        category: "technical",
        name: "Header Structure (H1/H2/H3)",
        status: headerStatus,
        score: headerScore,
        message:
            headerAnalysis.hierarchyIssues.length === 0
                ? `Proper header hierarchy (H1: ${headerAnalysis.h1Count}, H2: ${headerAnalysis.h2Count}, H3: ${headerAnalysis.h3Count})`
                : `${headerAnalysis.hierarchyIssues.length} issue(s) found`,
        currentValue: `H1: ${headerAnalysis.h1Count}, H2: ${headerAnalysis.h2Count}`,
        idealValue: "Single H1, Multiple H2s",
        details: headerAnalysis.hierarchyIssues,
    });
    totalScore += headerScore;

    // 13. Keyword Placement (10 points)
    const keywordPlacement = analyzeKeywordPlacement(
        article,
        plainText,
        metadata.focusKeyword,
        metadata.title,
        metadata.metaDescription,
        metadata.slug
    );

    const placementCount = [
        keywordPlacement.inTitle,
        keywordPlacement.inH1,
        keywordPlacement.inFirstParagraph,
    ].filter(Boolean).length;

    let placementStatus: "pass" | "warning" | "fail" = "fail";
    let placementScore = 0;

    if (placementCount === 3) {
        placementStatus = "pass";
        placementScore = 10;
    } else if (placementCount === 2) {
        placementStatus = "warning";
        placementScore = 6;
    } else {
        placementStatus = "fail";
        placementScore = 0;
    }

    checks.push({
        id: "keyword-placement",
        category: "keywords",
        name: "Strategic Keyword Placement",
        status: placementStatus,
        score: placementScore,
        message: `Keyword found in ${placementCount}/3 key locations`,
        currentValue: `${placementCount}/3`,
        idealValue: "3/3 (Title, H1, Opening)",
        details: [
            `Title: ${keywordPlacement.inTitle ? "✓" : "✗"}`,
            `H1: ${keywordPlacement.inH1 ? "✓" : "✗"}`,
            `First paragraph: ${keywordPlacement.inFirstParagraph ? "✓" : "✗"}`,
        ],
    });
    totalScore += placementScore;

    const scaledScore = Math.round((totalScore / maxScore) * 125);
    return { checks, basicScore: scaledScore, plainText, readabilityScore };
}

// AI-Powered Auto-Fix Generation
async function generateAutoFixes(
    input: SEOCheckInput,
    checks: SEOCheck[],
    plainText: string
): Promise<SEOResponse["autoFixes"]> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Find failing checks that can be auto-fixed
    const failingChecks = checks.filter((c) => c.status === "fail" || c.status === "warning");

    if (failingChecks.length === 0) {
        return {};
    }

    const images = extractImages(input.article).filter((img) => !hasImageAlt(img));

    const prompt = `You are an SEO expert. Generate auto-fix suggestions for these SEO issues.

## ARTICLE INFO:
- Title: ${input.metadata.title}
- Focus Keyword: ${input.metadata.focusKeyword}
- Content Preview: ${plainText.substring(0, 1000)}

## FAILING CHECKS:
${failingChecks.map((c) => `- ${c.name}: ${c.message}`).join("\n")}

## IMAGES WITHOUT ALT TEXT:
${images.length > 0 ? images.slice(0, 5).map((img, i) => `${i + 1}. ${img.substring(0, 100)}...`).join("\n") : "None"}

## YOUR TASKS:

Generate specific, actionable auto-fixes:

1. If meta description is missing or poor, generate an optimized 150-160 character description
2. For images without alt text, suggest descriptive alt text (max 5 images)
3. If keyword density is poor, suggest 3-5 specific places to naturally insert the keyword
4. For any broken links, suggest alternative authoritative sources

## OUTPUT FORMAT (JSON only, no markdown):
{
  "missingMetaDescription": "Optimized meta description here (150-160 chars)",
  "missingAltTexts": [
    { "image": "img tag here", "suggestedAlt": "Descriptive alt text" }
  ],
  "keywordSuggestions": [
    "Suggestion 1: Where and how to add keyword",
    "Suggestion 2: Another placement idea"
  ],
  "brokenLinkAlternatives": [
    {
      "brokenUrl": "url",
      "alternatives": ["alternative url 1", "alternative url 2"]
    }
  ]
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const cleanedText = text
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();

        const parsed = JSON.parse(cleanedText);
        return parsed;
    } catch (error) {
        console.error("Auto-fix generation error:", error);
        return {};
    }
}

// AI-Powered Analysis using Gemini
async function performAIAnalysis(
    input: SEOCheckInput,
    plainText: string,
    readabilityScore: number
): Promise<{
    metaSuggestions: SEOResponse["metaSuggestions"];
    schemaRecommendations: SchemaRecommendation[];
    recommendations: string[];
}> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an expert SEO analyst. Analyze this article and provide detailed SEO recommendations.

## ARTICLE METADATA:
- Title: ${input.metadata.title}
- Focus Keyword: ${input.metadata.focusKeyword}
- Word Count: ${plainText.split(/\s+/).length}
- Target Word Count: ${input.metadata.targetWordCount}
- Readability Score: ${readabilityScore.toFixed(0)}/100

## ARTICLE CONTENT (first 1000 words):
${plainText.substring(0, 5000)}

## LINKS:
- Internal Links: ${input.links.internal.length} (${input.links.internal.map(l => l.text).join(", ")})
- Outbound Links: ${input.links.outbound.length} (${input.links.outbound.map(l => l.text).join(", ")})

## YOUR TASKS:

### 1. META SUGGESTIONS
Create optimized meta tags:
- Title: 50-60 characters, include focus keyword, compelling
- Description: 150-160 characters, include keyword, call-to-action
- Slug: URL-friendly, include keyword, concise

### 2. SCHEMA RECOMMENDATIONS
Analyze the content and recommend appropriate schema types. For each schema type, determine if it should be included:
- Article: Always recommend
- HowTo: If article contains step-by-step instructions
- FAQ: If article has Q&A format sections
- Organization: If discussing a company/organization
- BreadcrumbList: For site navigation context
- WebPage: For general page structure
- Others: Any other relevant schema types based on content

### 3. SEO RECOMMENDATIONS
Provide 5-8 specific, actionable recommendations to improve SEO, such as:
- Keyword placement improvements
- Content structure suggestions
- Link building opportunities
- User engagement improvements
- Technical SEO enhancements

## OUTPUT FORMAT (JSON only, no markdown):
{
  "metaSuggestions": {
    "title": "Optimized title here",
    "description": "Optimized description here",
    "slug": "optimized-slug-here"
  },
  "schemaRecommendations": [
    {
      "type": "Article",
      "recommended": true,
      "reason": "Standard for all articles"
    },
    {
      "type": "HowTo",
      "recommended": true/false,
      "reason": "Explanation here"
    }
  ],
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2"
  ]
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean and parse JSON
        const cleanedText = text
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();

        const parsed = JSON.parse(cleanedText);

        return {
            metaSuggestions: parsed.metaSuggestions || {
                title: input.metadata.title,
                description: plainText.substring(0, 160),
                slug: createSlug(input.metadata.title),
            },
            schemaRecommendations: parsed.schemaRecommendations || [],
            recommendations: parsed.recommendations || [],
        };
    } catch (error) {
        console.error("AI analysis error:", error);
        // Return fallback suggestions
        return {
            metaSuggestions: {
                title: input.metadata.title,
                description: plainText.substring(0, 160),
                slug: createSlug(input.metadata.title),
            },
            schemaRecommendations: [
                {
                    type: "Article",
                    recommended: true,
                    reason: "Standard schema for blog articles",
                },
            ],
            recommendations: [
                "Ensure focus keyword appears in title and first paragraph",
                "Add more internal links to related content",
                "Optimize images with descriptive alt tags",
                "Include clear call-to-action",
            ],
        };
    }
}

// Generate Schema Markup
async function generateSchemaMarkup(
    input: SEOCheckInput,
    recommendations: SchemaRecommendation[],
    metaSuggestions: SEOResponse["metaSuggestions"]
): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const recommendedSchemas = recommendations.filter((r) => r.recommended);
    const plainText = stripHtml(input.article);

    const prompt = `Generate JSON-LD schema markup for this article.

## ARTICLE INFO:
- Title: ${input.metadata.title}
- Meta Description: ${metaSuggestions.description}
- Focus Keyword: ${input.metadata.focusKeyword}
- Word Count: ${plainText.split(/\s+/).length}

## CONTENT PREVIEW:
${plainText.substring(0, 2000)}

## RECOMMENDED SCHEMAS:
${recommendedSchemas.map((r) => `- ${r.type}: ${r.reason}`).join("\n")}

## REQUIREMENTS:
1. Generate valid JSON-LD schema markup
2. Include all recommended schema types
3. Use realistic placeholder data where needed (e.g., author, publisher, dates)
4. Ensure proper nesting and relationships
5. Include all required properties for each schema type

## OUTPUT:
Return ONLY valid JSON-LD markup (no markdown, no explanations). Use this structure:
{
  "@context": "https://schema.org",
  "@graph": [
    // Array of schema objects here
  ]
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean and validate JSON
        const cleanedText = text
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();

        // Validate it's proper JSON
        JSON.parse(cleanedText);
        return cleanedText;
    } catch (error) {
        console.error("Schema generation error:", error);
        // Return basic Article schema as fallback
        return JSON.stringify(
            {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: input.metadata.title,
                description: metaSuggestions.description,
                keywords: input.metadata.focusKeyword,
                wordCount: plainText.split(/\s+/).length,
                author: {
                    "@type": "Person",
                    name: "Content Author",
                },
                publisher: {
                    "@type": "Organization",
                    name: "Your Organization",
                },
                datePublished: new Date().toISOString(),
                dateModified: new Date().toISOString(),
            },
            null,
            2
        );
    }
}

// Main POST Handler
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { article, metadata, links } = body as SEOCheckInput;

        // Validate input
        if (!article || !metadata || !links) {
            return NextResponse.json(
                { error: "Missing required fields: article, metadata, or links" },
                { status: 400 }
            );
        }

        if (!metadata.title || !metadata.focusKeyword || !metadata.targetWordCount) {
            return NextResponse.json(
                { error: "Metadata must include title, focusKeyword, and targetWordCount" },
                { status: 400 }
            );
        }

        // Check API key
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return NextResponse.json(
                { error: "Google AI API key not configured" },
                { status: 500 }
            );
        }

        // 1. Perform basic analysis
        const { checks, basicScore, plainText, readabilityScore } = performBasicAnalysis({
            article,
            metadata,
            links,
        });

        // 2. Perform AI-powered analysis
        const { metaSuggestions, schemaRecommendations, recommendations } = await performAIAnalysis(
            { article, metadata, links },
            plainText,
            readabilityScore
        );

        // 3. Check link health (async, but don't wait too long)
        let linkHealthChecks: LinkHealthCheck[] = [];
        try {
            const allLinks = [...links.internal, ...links.outbound];
            linkHealthChecks = await checkLinkHealth(allLinks);

            // Add link health check results
            const brokenLinks = linkHealthChecks.filter((l) => l.status === "broken");
            const redirectLinks = linkHealthChecks.filter((l) => l.status === "redirect");

            if (brokenLinks.length > 0 || redirectLinks.length > 0) {
                checks.push({
                    id: "link-health",
                    category: "links",
                    name: "Link Health Check",
                    status: brokenLinks.length > 0 ? "fail" : "warning",
                    score: brokenLinks.length > 0 ? 0 : 5,
                    message: `${brokenLinks.length} broken, ${redirectLinks.length} redirects`,
                    currentValue: `${linkHealthChecks.filter((l) => l.status === "healthy").length}/${linkHealthChecks.length}`,
                    idealValue: "All links healthy",
                    details: [
                        ...brokenLinks.map((l) => `Broken: ${l.url} (${l.text})`),
                        ...redirectLinks.map((l) => `Redirect: ${l.url} → ${l.redirectUrl}`),
                    ],
                });
            }
        } catch (error) {
            console.error("Link health check error:", error);
        }

        // 4. Generate schema markup
        const schemaMarkup = await generateSchemaMarkup(
            { article, metadata, links },
            schemaRecommendations,
            metaSuggestions
        );

        // 5. Add schema check to checks array
        const recommendedCount = schemaRecommendations.filter((r) => r.recommended).length;
        const schemaScore = recommendedCount > 0 ? 25 : 0;
        const schemaCheck: SEOCheck = {
            id: "schema-markup",
            category: "schema",
            name: "Schema Markup",
            status: recommendedCount > 0 ? "pass" : "warning",
            score: schemaScore,
            message: recommendedCount > 0
                ? `Generated ${recommendedCount} schema types`
                : "No schema recommendations generated",
            currentValue: recommendedCount,
            idealValue: "Multiple relevant schemas",
        };
        checks.push(schemaCheck);

        // 6. Generate auto-fixes for failing checks
        const autoFixes = await generateAutoFixes({ article, metadata, links }, checks, plainText);

        // 7. Analyze header structure
        const headerAnalysis = analyzeHeaderStructure(article, metadata.focusKeyword);

        // 8. Analyze keyword placement
        const keywordPlacement = analyzeKeywordPlacement(
            article,
            plainText,
            metadata.focusKeyword,
            metadata.title
        );

        // 9. Calculate final SEO score (max 150)
        const finalScore = Math.min(150, basicScore + schemaCheck.score);

        // 10. Prepare response
        const response: SEOResponse = {
            seoScore: finalScore,
            checks,
            metaSuggestions,
            schemaRecommendations,
            schemaMarkup: {
                jsonLd: schemaMarkup,
            },
            recommendations,
            linkHealthChecks,
            headerAnalysis,
            keywordPlacement,
            autoFixes,
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error("SEO analysis error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to analyze SEO",
                details: error.toString(),
            },
            { status: 500 }
        );
    }
}
