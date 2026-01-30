/**
 * Example Usage of Entity Extractor & Topic Coverage System
 * This file demonstrates how to use the NLP entity and topic coverage features
 */

import {
  extractEntities,
  extractCompetitorEntities,
  mergeEntityData,
  suggestEntityPlacement,
  calculateEntityFrequency,
} from "./entity-extractor";

import {
  analyzeTopicCoverage,
  identifyMissingSubtopics,
  identifyMissingKeywords,
  identifyUnderUtilizedKeywords,
  generateCoverageRecommendations,
  calculateCoverageGaps,
} from "./topic-coverage";

// ============================================
// EXAMPLE 1: Basic Entity Extraction
// ============================================
async function example1_basicEntityExtraction() {
  const articleText = `
    React is a JavaScript library for building user interfaces.
    It was created by Facebook and is now maintained by Meta.
    React hooks like useState and useEffect have revolutionized
    how developers write React components. Popular frameworks
    like Next.js and Remix are built on top of React.
  `;

  const keyword = "React hooks tutorial";

  // Extract entities
  const entities = await extractEntities(articleText, keyword);

  console.log("Extracted Entities:");
  entities.forEach((entity) => {
    console.log(`- ${entity.name} (${entity.type})`);
    console.log(`  Mentions: ${entity.mentions}, Coverage: ${entity.coverage}`);
    console.log(`  Importance: ${entity.importance}/100`);
  });

  // Expected output:
  // - React (Product): 4 mentions, "detailed" coverage, importance: 95
  // - Facebook (Organization): 1 mention, "mentioned" coverage, importance: 40
  // - Meta (Organization): 1 mention, "mentioned" coverage, importance: 40
  // - useState (Concept): 1 mention, "mentioned" coverage, importance: 85
  // - useEffect (Concept): 1 mention, "mentioned" coverage, importance: 85
  // - Next.js (Product): 1 mention, "mentioned" coverage, importance: 60
  // - Remix (Product): 1 mention, "mentioned" coverage, importance: 55
}

// ============================================
// EXAMPLE 2: Competitor Analysis
// ============================================
async function example2_competitorAnalysis() {
  const yourArticle = `
    <h1>Introduction to React Hooks</h1>
    <p>React hooks are functions that let you use state and other React features...</p>
  `;

  const competitor1 = `
    <h1>Complete React Hooks Guide</h1>
    <p>Understanding useState, useEffect, useContext, useReducer, and custom hooks...</p>
    <h2>useState Hook</h2>
    <p>useState allows you to add state to functional components...</p>
    <h2>useEffect Hook</h2>
    <p>useEffect lets you perform side effects in function components...</p>
    <h2>Custom Hooks</h2>
    <p>Custom hooks let you extract component logic into reusable functions...</p>
  `;

  const competitor2 = `
    <h1>React Hooks Best Practices</h1>
    <p>Learn the rules of hooks, dependency arrays, and common pitfalls...</p>
    <h2>Rules of Hooks</h2>
    <p>Always call hooks at the top level, never in loops or conditions...</p>
    <h2>Dependency Arrays</h2>
    <p>Understanding useEffect dependencies is crucial for avoiding bugs...</p>
  `;

  const keyword = "React hooks";
  const competitors = [competitor1, competitor2];

  // Analyze topic coverage
  const coverage = await analyzeTopicCoverage(yourArticle, keyword, competitors);

  console.log("\n=== TOPIC COVERAGE ANALYSIS ===");
  console.log(`Main Topic: ${coverage.mainTopic}`);
  console.log(`Completeness Score: ${coverage.completeness}%`);
  console.log(`Competitor Average: ${coverage.competitorAverage}%`);
  console.log(`Score Gap: ${coverage.completeness - coverage.competitorAverage}%`);

  console.log("\n=== MISSING SUBTOPICS ===");
  const missingSubtopics = identifyMissingSubtopics(coverage);
  missingSubtopics.forEach((topic) => console.log(`- ${topic}`));

  console.log("\n=== MISSING KEYWORDS ===");
  const missingKeywords = identifyMissingKeywords(coverage);
  missingKeywords.slice(0, 5).forEach((kw) => console.log(`- ${kw}`));

  console.log("\n=== RECOMMENDATIONS ===");
  const recommendations = generateCoverageRecommendations(coverage);
  recommendations.forEach((rec) => console.log(`- ${rec}`));
}

// ============================================
// EXAMPLE 3: API Integration
// ============================================
async function example3_apiIntegration() {
  // This shows how a frontend would call the API
  const apiUrl = "/api/seo/analyze-entities";

  const requestBody = {
    articleContent: `
      <h1>Complete Guide to React State Management</h1>
      <p>Managing state in React applications can be complex...</p>
      <h2>useState Hook</h2>
      <p>The most basic way to manage state...</p>
      <h2>Context API</h2>
      <p>For sharing state across components...</p>
    `,
    keyword: "React state management",
    competitorArticles: [
      `<article>Competitor discussing Redux, MobX, Zustand...</article>`,
      `<article>Competitor discussing Recoil, Jotai, Valtio...</article>`,
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log("\n=== API RESPONSE ===");
    console.log("Summary:", data.summary);
    console.log("\nRecommendations:", data.recommendations);
    console.log("\nEntities Found:", data.topicCoverage.entities.length);
    console.log("Subtopics Analyzed:", data.topicCoverage.requiredSubtopics.length);
    console.log("Semantic Keywords:", data.topicCoverage.semanticKeywords.length);
  } catch (error) {
    console.error("API Error:", error);
  }
}

// ============================================
// EXAMPLE 4: Entity Placement Suggestions
// ============================================
async function example4_entityPlacement() {
  const article = `
    <h1>React Hooks Tutorial</h1>
    <p>Introduction to React hooks...</p>

    <h2>Getting Started</h2>
    <p>First steps with hooks...</p>

    <h2>useState Hook</h2>
    <p>Managing state with useState...</p>

    <h2>useEffect Hook</h2>
    <p>Side effects with useEffect...</p>

    <h2>Conclusion</h2>
    <p>Summary of what we learned...</p>
  `;

  const missingEntity = {
    name: "Redux",
    type: "Product" as const,
    mentions: 0,
    coverage: "missing" as const,
    importance: 75,
    competitorMentions: 12,
  };

  const placement = await suggestEntityPlacement(missingEntity, article, "React hooks");

  if (placement) {
    console.log("\n=== ENTITY PLACEMENT SUGGESTION ===");
    console.log(`Entity: ${missingEntity.name}`);
    console.log(`Suggested Section: ${placement.section}`);
    console.log(`Context: ${placement.context}`);
  }

  // Expected output:
  // Suggested Section: "Conclusion"
  // Context: "Mention Redux as an alternative state management solution that works alongside hooks"
}

// ============================================
// EXAMPLE 5: Coverage Gap Analysis
// ============================================
async function example5_coverageGaps() {
  const yourArticle = `
    <h1>React Hooks Basics</h1>
    <p>Learn useState and useEffect...</p>
  `;

  const competitors = [
    `<article>Comprehensive guide covering useState, useEffect, useContext, useReducer, useMemo, useCallback, custom hooks...</article>`,
    `<article>Deep dive into hooks with practical examples and best practices...</article>`,
  ];

  const coverage = await analyzeTopicCoverage(yourArticle, "React hooks", competitors);
  const gaps = calculateCoverageGaps(coverage);

  console.log("\n=== COVERAGE GAPS ===");
  console.log(`Missing Entities: ${gaps.missingEntities}`);
  console.log(`Missing Subtopics: ${gaps.missingSubtopics}`);
  console.log(`Missing Keywords: ${gaps.missingKeywords}`);
  console.log(`Score Gap: ${gaps.scoreGap > 0 ? "+" : ""}${gaps.scoreGap}%`);

  if (gaps.scoreGap < 0) {
    console.log("\n⚠️ Your article is below competitor average");
    console.log("Focus on filling content gaps to improve rankings");
  } else {
    console.log("\n✅ Your article exceeds competitor average");
    console.log("Maintain quality and consider expanding to solidify lead");
  }
}

// ============================================
// EXAMPLE 6: Real-World Workflow
// ============================================
async function example6_realWorldWorkflow() {
  console.log("\n=== COMPLETE WORKFLOW EXAMPLE ===\n");

  // Step 1: Write your article
  const myArticle = `
    <h1>Ultimate Guide to React Hooks in 2024</h1>
    <p>React hooks transformed how we write React components...</p>
    <h2>What are React Hooks?</h2>
    <p>Hooks are functions that let you use state and lifecycle features...</p>
    <h2>useState Hook</h2>
    <p>The useState hook lets you add state to functional components...</p>
    <h2>useEffect Hook</h2>
    <p>useEffect performs side effects in function components...</p>
  `;

  const keyword = "React hooks guide";

  // Step 2: Gather competitor content (in real app, this would be SERP scraping)
  const competitorArticles = [
    `<h1>React Hooks Explained</h1>...(useState, useEffect, useContext, useReducer, custom hooks)...`,
    `<h1>Master React Hooks</h1>...(hooks rules, best practices, common mistakes)...`,
    `<h1>React Hooks Tutorial</h1>...(practical examples, real-world usage)...`,
  ];

  // Step 3: Analyze topic coverage
  console.log("📊 Analyzing topic coverage...");
  const coverage = await analyzeTopicCoverage(myArticle, keyword, competitorArticles);

  // Step 4: Review results
  console.log(`\n✅ Analysis complete!`);
  console.log(`   Completeness: ${coverage.completeness}%`);
  console.log(`   Entities found: ${coverage.entities.length}`);
  console.log(`   Subtopics analyzed: ${coverage.requiredSubtopics.length}`);

  // Step 5: Identify improvements
  const recommendations = generateCoverageRecommendations(coverage);
  console.log("\n📝 Top Recommendations:");
  recommendations.slice(0, 3).forEach((rec, i) => {
    console.log(`   ${i + 1}. ${rec}`);
  });

  // Step 6: Get specific gaps
  const missingTopics = identifyMissingSubtopics(coverage);
  console.log("\n🎯 Missing Topics to Add:");
  missingTopics.slice(0, 3).forEach((topic) => {
    console.log(`   - ${topic}`);
  });

  const underUtilized = identifyUnderUtilizedKeywords(coverage);
  console.log("\n🔤 Keywords to Use More:");
  underUtilized.slice(0, 3).forEach((kw) => {
    console.log(`   - "${kw.keyword}" (current: ${kw.current}, suggested: ${kw.suggested})`);
  });

  // Step 7: Focus on high-impact entities
  const missingEntities = coverage.entities.filter(
    (e) => e.coverage === "missing" && e.importance >= 70 && e.competitorMentions >= 5
  );
  console.log("\n⚠️ Important Missing Entities:");
  missingEntities.slice(0, 3).forEach((entity) => {
    console.log(`   - ${entity.name} (competitors mention ${entity.competitorMentions}x)`);
  });

  // Step 8: Make improvements and re-analyze
  console.log("\n💡 Next Steps:");
  console.log("   1. Add missing subtopics");
  console.log("   2. Incorporate missing entities");
  console.log("   3. Use semantic keywords more frequently");
  console.log("   4. Re-run analysis to verify improvements");
  console.log(`   5. Target completeness score: ${coverage.completeness}% → 85%+`);
}

// Run examples
// Uncomment to test individual examples:
// example1_basicEntityExtraction();
// example2_competitorAnalysis();
// example3_apiIntegration();
// example4_entityPlacement();
// example5_coverageGaps();
// example6_realWorldWorkflow();

export {
  example1_basicEntityExtraction,
  example2_competitorAnalysis,
  example3_apiIntegration,
  example4_entityPlacement,
  example5_coverageGaps,
  example6_realWorldWorkflow,
};
