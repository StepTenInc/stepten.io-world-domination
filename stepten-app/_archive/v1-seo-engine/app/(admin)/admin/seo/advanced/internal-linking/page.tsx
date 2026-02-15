"use client";

import AdvancedFeatureTemplate from "@/components/admin/AdvancedFeatureTemplate";
import { Link2 } from "lucide-react";

export default function InternalLinkingPage() {
    return (
        <AdvancedFeatureTemplate
            title="Internal Linking Engine"
            description="AI-powered semantic link suggestions using vector embeddings for maximum relevance and SEO impact"
            icon={Link2}
            status="active"
            apiEndpoints={[
                {
                    method: "POST",
                    path: "/api/seo/suggest-internal-links",
                    description: "Get AI-powered internal link suggestions based on semantic similarity"
                },
                {
                    method: "POST",
                    path: "/api/seo/generate-embeddings",
                    description: "Generate vector embeddings for article content"
                }
            ]}
            databaseTables={[
                "article_embeddings",
                "article_internal_links"
            ]}
            features={[
                "Vector similarity search using pgvector and OpenAI embeddings",
                "Semantic link suggestions based on content relevance",
                "Automatic anchor text generation with context awareness",
                "Relevance scoring (0-100) for each link suggestion",
                "Max 5 high-quality links per article (no link spam)",
                "Contextual placement recommendations",
                "Bidirectional linking for topic authority",
                "Real-time embedding generation (1536 dimensions)"
            ]}
            usageExample={`// Get internal link suggestions
const response = await fetch('/api/seo/suggest-internal-links', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleContent: "Your article content here...",
    articleMetadata: {
      title: "How to Use AI Automation Tools",
      keywords: ["ai automation", "workflow tools"]
    },
    maxSuggestions: 5
  })
});

// Returns semantic link suggestions:
// [
//   {
//     targetArticleId: "uuid-123",
//     targetTitle: "Best AI Tools for Email Automation",
//     suggestedAnchorText: "AI email automation tools",
//     relevanceScore: 92,
//     placementContext: "...when discussing email workflows..."
//   }
// ]`}
        />
    );
}
