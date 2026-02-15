"use client";

import AdvancedFeatureTemplate from "@/components/admin/AdvancedFeatureTemplate";
import { Network } from "lucide-react";

export default function ContentClustersPage() {
    return (
        <AdvancedFeatureTemplate
            title="Content Cluster Builder"
            description="Generate comprehensive pillar/cluster/supporting article strategies with automatic internal linking structure"
            icon={Network}
            status="active"
            apiEndpoints={[
                {
                    method: "POST",
                    path: "/api/seo/generate-cluster",
                    description: "Generate complete content cluster strategy with pillar, cluster, and supporting articles"
                },
                {
                    method: "POST",
                    path: "/api/seo/generate-cluster-article",
                    description: "Write individual cluster article with automatic internal linking"
                }
            ]}
            databaseTables={[
                "content_clusters",
                "cluster_articles",
                "article_internal_links"
            ]}
            features={[
                "Automatic keyword clustering and topic grouping",
                "Pillar article strategy (3500+ words comprehensive guide)",
                "Cluster articles (2000 words subtopic deep dives)",
                "Supporting articles (1200 words long-tail specific)",
                "Automatic internal linking structure between articles",
                "SEO-optimized content with natural keyword integration",
                "Topical authority building for better rankings",
                "Time-to-rank estimation for each article type"
            ]}
            usageExample={`// Generate a content cluster
const response = await fetch('/api/seo/generate-cluster', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mainKeyword: "AI automation tools",
    clusterSize: 6, // Number of cluster articles
    supportingArticleCount: 12, // Supporting long-tail articles
    customInstructions: "Focus on business workflows"
  })
});

// Returns strategy with:
// 1 Pillar: "Complete Guide to AI Automation Tools" (3500 words)
// 6 Clusters: Subtopics like "AI Email Automation", etc (2000 words each)
// 12 Supporting: Long-tail like "Best AI tools for Gmail" (1200 words each)
// + Full internal linking map`}
        />
    );
}
