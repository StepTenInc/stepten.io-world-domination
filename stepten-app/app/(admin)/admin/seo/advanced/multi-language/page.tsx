"use client";

import AdvancedFeatureTemplate from "@/components/admin/AdvancedFeatureTemplate";
import { Globe } from "lucide-react";

export default function MultiLanguagePage() {
    return (
        <AdvancedFeatureTemplate
            title="Multi-Language Support"
            description="Translate articles to 27+ languages with cultural adaptation, brand term preservation, and automatic hreflang tags"
            icon={Globe}
            status="active"
            apiEndpoints={[
                {
                    method: "POST",
                    path: "/api/seo/translate-article",
                    description: "Translate article with cultural adaptation"
                },
                {
                    method: "POST",
                    path: "/api/seo/generate-hreflang",
                    description: "Generate hreflang tags for translated versions"
                }
            ]}
            databaseTables={[
                "article_translations",
                "hreflang_tags"
            ]}
            features={[
                "27+ language support (Spanish, French, German, Portuguese, Italian, etc.)",
                "Cultural adaptation and localization",
                "Brand term preservation",
                "SEO-optimized translations",
                "Automatic hreflang tag generation",
                "Multi-language sitemap support",
                "Regional dialect support (pt-BR vs pt-PT)",
                "Translation quality scoring"
            ]}
            usageExample={`// Translate article
const response = await fetch('/api/seo/translate-article', {
  method: 'POST',
  body: JSON.stringify({
    articleId: "uuid-123",
    targetLanguages: ["es", "fr", "de"],
    preserveBrandTerms: ["StepTen", "Claude"],
    culturalAdaptation: true
  })
});`}
        />
    );
}
