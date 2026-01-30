"use client";

import AdvancedFeatureTemplate from "@/components/admin/AdvancedFeatureTemplate";
import { TrendingUp } from "lucide-react";

export default function RankTrackingPage() {
    return (
        <AdvancedFeatureTemplate
            title="Rank Tracking Integration"
            description="Monitor keyword rankings with SerpAPI integration, track position changes, and get automated alerts"
            icon={TrendingUp}
            status="active"
            apiEndpoints={[
                {
                    method: "POST",
                    path: "/api/seo/track-rankings",
                    description: "Track keyword rankings with SerpAPI"
                },
                {
                    method: "GET",
                    path: "/api/seo/ranking-history",
                    description: "Get historical ranking data and trend analysis"
                },
                {
                    method: "POST",
                    path: "/api/seo/setup-rank-alerts",
                    description: "Configure ranking alerts for position changes"
                }
            ]}
            databaseTables={[
                "keyword_rankings",
                "ranking_alerts",
                "ranking_snapshots"
            ]}
            features={[
                "SerpAPI integration with scraping fallback",
                "Daily, weekly, monthly rank tracking",
                "Position change alerts (gain/loss thresholds)",
                "Historical ranking charts and trends",
                "Featured snippet tracking",
                "Competitor position monitoring",
                "Estimated traffic calculation",
                "Ranking volatility detection"
            ]}
            usageExample={`// Track keyword rankings
const response = await fetch('/api/seo/track-rankings', {
  method: 'POST',
  body: JSON.stringify({
    keywords: [
      { keyword: "ai automation tools", url: "example.com/article" }
    ],
    location: "United States",
    device: "desktop",
    schedule: "daily"
  })
});`}
        />
    );
}
