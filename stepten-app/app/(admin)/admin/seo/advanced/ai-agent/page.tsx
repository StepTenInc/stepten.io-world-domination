"use client";

import AdvancedFeatureTemplate from "@/components/admin/AdvancedFeatureTemplate";
import { Bot } from "lucide-react";

export default function AIAgentPage() {
    return (
        <AdvancedFeatureTemplate
            title="AI SEO Agent"
            description="Fully autonomous content generation system with human-in-the-loop review workflow"
            icon={Bot}
            status="active"
            apiEndpoints={[
                {
                    method: "POST",
                    path: "/api/seo/create-agent",
                    description: "Create a new autonomous SEO agent with custom strategy"
                },
                {
                    method: "GET",
                    path: "/api/seo/agent-status",
                    description: "Monitor agent performance metrics and task queue status"
                },
                {
                    method: "GET",
                    path: "/api/seo/agent-queue",
                    description: "View queued tasks and autonomous article generation progress"
                },
                {
                    method: "POST",
                    path: "/api/seo/approve-article",
                    description: "Human approval workflow for agent-generated content"
                }
            ]}
            databaseTables={[
                "seo_agents",
                "agent_tasks",
                "agent_articles",
                "agent_metrics"
            ]}
            features={[
                "Fully autonomous content generation from keyword to published article",
                "Executes all 8 pipeline steps automatically",
                "Human-in-the-loop review and approval workflow",
                "Content gap analysis and strategic topic calendar",
                "Auto-generates SERP-optimized articles with internal linking",
                "Quality scoring and traffic prediction",
                "Task queue management with priority scheduling",
                "Performance monitoring and success metrics"
            ]}
            usageExample={`// Create an autonomous SEO agent
const response = await fetch('/api/seo/create-agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentName: "AI Automation Agent",
    strategy: {
      keywords: ["ai automation tools", "ai workflow automation"],
      contentGoals: {
        articlesPerWeek: 5,
        targetWordCount: 2000
      },
      topicFocus: ["AI automation", "workflow tools"]
    },
    autonomy: {
      autoResearch: true,
      autoWrite: true,
      autoOptimize: true,
      autoPublish: false, // Require human approval
      autoInternalLink: true,
      autoRefresh: true
    }
  })
});

// Agent will automatically:
// 1. Research keywords and competitors
// 2. Generate article framework
// 3. Write optimized content
// 4. Add internal links
// 5. Queue for human review
// 6. Publish upon approval`}
        />
    );
}
