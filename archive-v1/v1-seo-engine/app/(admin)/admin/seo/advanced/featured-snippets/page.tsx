"use client";

import AdvancedFeatureTemplate from "@/components/admin/AdvancedFeatureTemplate";
import { Target } from "lucide-react";

export default function FeaturedSnippetsPage() {
    return (
        <AdvancedFeatureTemplate
            title="Featured Snippet Optimizer"
            description="Optimize content for paragraph, list, table, and video featured snippets to capture position zero"
            icon={Target}
            status="active"
            apiEndpoints={[
                {
                    method: "POST",
                    path: "/api/seo/optimize-snippet",
                    description: "Generate snippet-optimized content for position zero"
                }
            ]}
            databaseTables={[
                "featured_snippet_optimizations"
            ]}
            features={[
                "Paragraph snippet optimization (40-60 words)",
                "List snippet generation (ordered and unordered)",
                "Table snippet formatting with structured data",
                "Video snippet optimization with timestamps",
                "Automatic schema markup generation",
                "Snippet type detection from SERP analysis",
                "Answer box formatting",
                "Multi-format optimization for single keyword"
            ]}
            usageExample={`// Optimize for featured snippet
const response = await fetch('/api/seo/optimize-snippet', {
  method: 'POST',
  body: JSON.stringify({
    keyword: "what are ai automation tools",
    content: "Your article content...",
    targetFormat: "paragraph"
  })
});`}
        />
    );
}
