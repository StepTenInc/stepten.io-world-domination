import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { article, framework, focusKeyword } = await request.json();

    if (!article) {
      return NextResponse.json(
        { error: "Article content is required" },
        { status: 400 }
      );
    }

    // Strip HTML for analysis
    const plainText = article.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const wordCount = plainText.split(/\s+/).length;

    // Extract all keywords from article
    const words = plainText.toLowerCase().split(/\s+/);
    const wordFreq = words.reduce((acc: any, word: string) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    // Calculate keyword density
    const focusKeywordLower = focusKeyword?.toLowerCase() || "";
    const keywordOccurrences = plainText.toLowerCase().split(focusKeywordLower).length - 1;
    const keywordDensity = ((keywordOccurrences / wordCount) * 100).toFixed(2);

    // Use GPT-4o for comprehensive analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO content analyst. Analyze the provided article comprehensively.

CRITICAL: Return ONLY valid JSON with NO markdown code blocks.

{
  "originality": {
    "score": 0-100,
    "reasoning": "Detailed explanation of originality assessment",
    "uniqueAngles": ["List 2-3 unique angles found"],
    "genericPatterns": ["List any generic/overused patterns found"],
    "recommendations": ["Specific ways to increase originality"]
  },
  "voice": {
    "score": 0-100,
    "reasoning": "How well this matches natural human voice",
    "strengths": ["What works well with voice"],
    "weaknesses": ["What sounds robotic or formulaic"],
    "sentenceVariety": "Assessment of sentence length variety",
    "recommendations": ["Specific voice improvements"]
  },
  "seo": {
    "score": 0-100,
    "reasoning": "SEO optimization assessment",
    "keywordPlacement": {
      "inH1": true/false,
      "inFirst100Words": true/false,
      "density": "calculated density",
      "assessment": "Good/Too high/Too low"
    },
    "headingStructure": {
      "h1Count": X,
      "h2Count": X,
      "h3Count": X,
      "hierarchy": "Good/Needs work",
      "issues": ["Any hierarchy problems"]
    },
    "readability": {
      "grade": "Xth grade",
      "avgSentenceLength": X,
      "assessment": "Easy/Medium/Hard"
    },
    "semanticKeywords": {
      "found": ["Keywords actually found in article"],
      "missing": ["Important semantic keywords missing"],
      "recommendations": ["Specific keywords to add and where"]
    },
    "recommendations": ["Top 3-5 specific SEO improvements with exact actions"]
  },
  "aiDetection": {
    "score": 0-100,
    "humanLikelihood": "Very High/High/Medium/Low",
    "aiTells": [
      {
        "pattern": "Specific AI pattern found",
        "example": "Actual example from article",
        "fix": "How to fix this specific issue"
      }
    ],
    "humanStrengths": ["What makes it feel human"],
    "overallAssessment": "Detailed assessment",
    "recommendations": ["Specific ways to make more human"]
  },
  "readability": {
    "score": 0-100,
    "avgSentenceLength": X,
    "sentenceLengthVariety": "High/Medium/Low",
    "avgParagraphLength": X,
    "paragraphVariety": "High/Medium/Low",
    "issues": ["Specific readability problems"],
    "recommendations": ["Specific improvements"]
  },
  "competitionAnalysis": {
    "comparedTo": "Top ranking content for this topic",
    "strengths": ["What this article does better"],
    "weaknesses": ["What competitors do better"],
    "recommendations": ["How to beat competition"]
  },
  "overallGrade": "A-F",
  "topImprovements": [
    {
      "priority": "High/Medium/Low",
      "issue": "Specific issue",
      "action": "Exact action to take",
      "expectedImpact": "What this will improve"
    }
  ]
}`,
        },
        {
          role: "user",
          content: `Analyze this article in extreme detail:

Focus Keyword: "${focusKeyword || "N/A"}"
Target Word Count: ${framework?.metadata?.wordCountTarget || "N/A"}
Actual Word Count: ${wordCount}

Article Content (first 8000 chars):
${plainText.substring(0, 8000)}${plainText.length > 8000 ? "..." : ""}

Provide comprehensive, specific analysis with actionable recommendations.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const responseText = completion.choices[0].message.content || "{}";

    let analysis;
    try {
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse analysis:", parseError);
      return NextResponse.json(
        { error: "Failed to analyze article", rawResponse: responseText.substring(0, 500) },
        { status: 500 }
      );
    }

    // Add computed stats
    const sentences = plainText.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
    const avgSentenceLength = Math.round(plainText.split(/\s+/).length / sentences.length);

    analysis.stats = {
      wordCount,
      targetWordCount: framework?.metadata?.wordCountTarget || 0,
      wordCountDifference: wordCount - (framework?.metadata?.wordCountTarget || 0),
      characterCount: plainText.length,
      paragraphCount: (article.match(/<p>/g) || []).length,
      sentenceCount: sentences.length,
      avgSentenceLength,
      headingCount: {
        h1: (article.match(/<h1>/g) || []).length,
        h2: (article.match(/<h2>/g) || []).length,
        h3: (article.match(/<h3>/g) || []).length,
      },
      linkCount: (article.match(/<a /g) || []).length,
      keywordDensity: `${keywordDensity}%`,
      focusKeywordOccurrences: keywordOccurrences,
    };

    return NextResponse.json({
      analysis,
      success: true,
    });
  } catch (error: any) {
    console.error("Article analysis error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to analyze article",
        success: false,
      },
      { status: 500 }
    );
  }
}
