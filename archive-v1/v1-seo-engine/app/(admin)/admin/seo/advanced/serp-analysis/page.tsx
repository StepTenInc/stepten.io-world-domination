"use client";

import AdvancedFeatureTemplate from "@/components/admin/AdvancedFeatureTemplate";
import { Search } from "lucide-react";

export default function SERPAnalysisPage() {
    return (
        <AdvancedFeatureTemplate
            title="SERP Analysis & Competitor Intelligence"
            description="Analyze top-ranking articles, identify content gaps, detect featured snippets, and get data-driven optimization recommendations"
            icon={Search}
            status="active"
            apiEndpoints={[
                {
                    method: "POST",
                    path: "/api/seo/analyze-serp",
                    description: "Comprehensive SERP analysis with top 10 results and content gap detection"
                }
            ]}
            databaseTables={[
                "serp_analyses",
                "serp_articles"
            ]}
            features={[
                "Scrapes and analyzes top 10 Google search results",
                "Featured snippet detection (paragraph, list, table, video)",
                "People Also Ask (PAA) extraction",
                "Related searches identification",
                "Content gap analysis vs competitors",
                "Average word count and common headings analysis",
                "Recommended target word count",
                "Must-have topics and suggested headings",
                "Content angle recommendations"
            ]}
            usageExample={`// Analyze SERP for a keyword
const response = await fetch('/api/seo/analyze-serp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    keyword: "best ai automation tools 2026",
    searchVolume: 8500,
    difficulty: 65
  })
});

// Returns comprehensive analysis:
// {
//   topRankingArticles: [...], // Top 10 results
//   featuredSnippet: {
//     type: "list",
//     content: "1. Tool A\\n2. Tool B...",
//     source: "example.com"
//   },
//   commonPatterns: {
//     avgWordCount: 2450,
//     commonHeadings: ["Benefits", "How to Choose", "Top Tools"],
//     contentGaps: ["AI integration tips", "Pricing comparison"]
//   },
//   recommendations: {
//     targetWordCount: 2800,
//     mustHaveTopics: [...],
//     suggestedHeadings: [...],
//     contentAngle: "Focus on 2026 trends and pricing"
//   }
// }`}
        />
    );
}
