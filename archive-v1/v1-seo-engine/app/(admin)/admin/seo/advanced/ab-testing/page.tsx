"use client";

import AdvancedFeatureTemplate from "@/components/admin/AdvancedFeatureTemplate";
import { TestTube } from "lucide-react";

export default function ABTestingPage() {
    return (
        <AdvancedFeatureTemplate
            title="A/B Testing Dashboard"
            description="Test titles, meta descriptions, and content variations with statistical significance analysis"
            icon={TestTube}
            status="active"
            apiEndpoints={[
                {
                    method: "POST",
                    path: "/api/seo/create-ab-test",
                    description: "Create A/B test for titles, meta descriptions, or content"
                },
                {
                    method: "GET",
                    path: "/api/seo/ab-test-results",
                    description: "Get test results with statistical significance"
                },
                {
                    method: "POST",
                    path: "/api/seo/finalize-ab-test",
                    description: "End test and apply winning variant"
                }
            ]}
            databaseTables={[
                "ab_tests",
                "ab_variants",
                "ab_impressions",
                "ab_clicks"
            ]}
            features={[
                "Title and meta description A/B testing",
                "Content variation testing",
                "Statistical significance calculation (z-test)",
                "Minimum sample size requirements (100+ impressions)",
                "Confidence level tracking (95% standard)",
                "CTR and conversion tracking",
                "Automated winner selection",
                "Multi-variant testing support"
            ]}
            usageExample={`// Create A/B test
const response = await fetch('/api/seo/create-ab-test', {
  method: 'POST',
  body: JSON.stringify({
    articleId: "uuid-123",
    testType: "title",
    variants: [
      { 
        name: "Variant A",
        content: "Best AI Automation Tools for 2026"
      },
      {
        name: "Variant B", 
        content: "Top 10 AI Automation Tools That Save 20 Hours/Week"
      }
    ],
    trafficSplit: 50
  })
});`}
        />
    );
}
