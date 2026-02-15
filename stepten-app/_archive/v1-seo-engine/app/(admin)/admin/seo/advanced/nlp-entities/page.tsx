"use client";

import AdvancedFeatureTemplate from "@/components/admin/AdvancedFeatureTemplate";
import { Brain } from "lucide-react";

export default function NLPEntitiesPage() {
    return (
        <AdvancedFeatureTemplate
            title="NLP Entity & Topic Coverage"
            description="Extract entities, analyze topic coverage density, and ensure comprehensive content for better rankings"
            icon={Brain}
            status="active"
            apiEndpoints={[
                {
                    method: "POST",
                    path: "/api/seo/analyze-entities",
                    description: "Extract NLP entities and analyze topic coverage"
                }
            ]}
            databaseTables={[
                "article_entities",
                "topic_coverage_analyses"
            ]}
            features={[
                "NLP entity extraction (people, organizations, locations, concepts)",
                "Topic coverage density analysis",
                "Entity frequency and prominence scoring",
                "Related topics and missing coverage identification",
                "Competitor entity comparison",
                "Semantic relevance scoring",
                "Content depth assessment",
                "Entity relationship mapping"
            ]}
            usageExample={`// Analyze NLP entities
const response = await fetch('/api/seo/analyze-entities', {
  method: 'POST',
  body: JSON.stringify({
    content: "Your article content...",
    targetKeyword: "ai automation tools",
    competitorUrls: ["competitor1.com", "competitor2.com"]
  })
});`}
        />
    );
}
