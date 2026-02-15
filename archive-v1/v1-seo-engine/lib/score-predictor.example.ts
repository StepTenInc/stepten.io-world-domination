/**
 * Content Score Predictor - Usage Examples
 * Demonstrates how to use the Content Score Predictor system
 */

import { predictContentScore, compareArticles } from './score-predictor';
import { extractContentFeatures } from './content-features';

/**
 * Example 1: Analyze a single article
 */
export async function exampleSingleArticle() {
    const sampleContent = `
        <html>
            <head>
                <title>The Complete Guide to Content Marketing in 2025</title>
                <meta name="description" content="Learn proven content marketing strategies to grow your business with our comprehensive guide covering SEO, social media, and more.">
            </head>
            <body>
                <h1>The Complete Guide to Content Marketing in 2025</h1>

                <p>Content marketing has become an essential strategy for businesses looking to attract and engage their target audience. In this comprehensive guide, we'll explore the most effective content marketing strategies for 2025.</p>

                <h2>What is Content Marketing?</h2>
                <p>Content marketing is a strategic marketing approach focused on creating and distributing valuable, relevant, and consistent content to attract and retain a clearly defined audience. The goal is to drive profitable customer action through educational and entertaining content.</p>

                <h2>Why Content Marketing Matters</h2>
                <p>Content marketing delivers several key benefits:</p>
                <ul>
                    <li>Builds trust and authority with your audience</li>
                    <li>Improves search engine rankings</li>
                    <li>Generates qualified leads</li>
                    <li>Establishes thought leadership</li>
                    <li>Creates long-term value</li>
                </ul>

                <h2>Content Marketing Strategy</h2>
                <p>A successful content marketing strategy requires careful planning and execution. Here are the essential steps:</p>

                <h3>1. Define Your Goals</h3>
                <p>Start by identifying what you want to achieve with your content marketing efforts. Common goals include increasing brand awareness, generating leads, improving SEO rankings, and establishing thought leadership.</p>

                <h3>2. Know Your Audience</h3>
                <p>Understanding your target audience is crucial. Create detailed buyer personas that include demographics, pain points, challenges, and content preferences.</p>

                <h3>3. Conduct Keyword Research</h3>
                <p>Identify the keywords and topics your audience is searching for. Use tools like Google Keyword Planner, SEMrush, or Ahrefs to find high-volume, low-competition keywords.</p>

                <h3>4. Create High-Quality Content</h3>
                <p>Focus on creating content that provides real value to your audience. Your content should be well-researched, engaging, and actionable.</p>

                <h2>Content Distribution Channels</h2>
                <p>Creating great content is only half the battle. You also need to distribute it effectively:</p>

                <ul>
                    <li>Your website and blog</li>
                    <li>Email newsletters</li>
                    <li>Social media platforms</li>
                    <li>Guest posting opportunities</li>
                    <li>Content syndication</li>
                </ul>

                <h2>Measuring Success</h2>
                <p>Track these key metrics to measure your content marketing success:</p>
                <ul>
                    <li>Organic traffic growth</li>
                    <li>Engagement rates</li>
                    <li>Lead generation</li>
                    <li>Conversion rates</li>
                    <li>Social shares</li>
                </ul>

                <h2>Conclusion</h2>
                <p>Content marketing is a powerful strategy that can transform your business. By following these proven strategies and consistently creating valuable content, you'll build a loyal audience and drive sustainable growth.</p>

                <p>Ready to get started with content marketing? Download our free content marketing template to plan your strategy today!</p>
            </body>
        </html>
    `;

    const prediction = await predictContentScore(
        sampleContent,
        'content marketing',
        'The Complete Guide to Content Marketing in 2025',
        'Learn proven content marketing strategies to grow your business with our comprehensive guide covering SEO, social media, and more.',
        'https://example.com/content-marketing-guide',
        {
            avgWordCount: 2500,
            avgHeadings: 12
        }
    );

    console.log('=== Content Score Prediction ===');
    console.log(`Overall Score: ${prediction.overallScore}/100 (${prediction.qualityGrade})`);
    console.log(`\nRanking Prediction:`);
    console.log(`  Position: #${prediction.rankingPotential.predictedPosition}`);
    console.log(`  Confidence: ${prediction.rankingPotential.confidenceScore}%`);
    console.log(`  Timeframe: ${prediction.rankingPotential.timeframe}`);

    console.log(`\nTraffic Prediction:`);
    console.log(`  Monthly Visits: ${prediction.trafficPrediction.estimatedMonthlyVisits}`);
    console.log(`  Confidence Interval: ${prediction.trafficPrediction.confidenceInterval[0]} - ${prediction.trafficPrediction.confidenceInterval[1]}`);

    console.log(`\nTop Strengths:`);
    prediction.topStrengths.forEach((strength, i) => {
        console.log(`  ${i + 1}. ${strength.feature}: ${strength.description} (${strength.score}/100)`);
    });

    console.log(`\nTop Weaknesses:`);
    prediction.topWeaknesses.forEach((weakness, i) => {
        console.log(`  ${i + 1}. ${weakness.feature}: ${weakness.recommendation}`);
        console.log(`     Expected improvement: +${weakness.estimatedImprovement} points`);
    });

    return prediction;
}

/**
 * Example 2: Compare multiple articles
 */
export async function exampleCompareArticles() {
    const articles = [
        {
            content: '<html><h1>SEO Guide</h1><p>SEO is important...</p></html>',
            keyword: 'SEO guide',
            title: 'SEO Guide for Beginners',
            metaDescription: 'Learn SEO basics',
            url: 'https://example.com/seo-guide'
        },
        {
            content: '<html><h1>Advanced SEO</h1><p>Advanced SEO techniques include...</p><h2>Technical SEO</h2><p>Technical SEO focuses on...</p></html>',
            keyword: 'SEO guide',
            title: 'Advanced SEO Strategies',
            metaDescription: 'Master advanced SEO techniques',
            url: 'https://example.com/advanced-seo'
        }
    ];

    const comparison = await compareArticles(articles);

    console.log('=== Article Comparison ===');
    console.log(`Best Performer: Article ${comparison.bestPerformer + 1}`);
    console.log(`Average Score: ${comparison.averageScore.toFixed(2)}/100`);
    console.log(`\nRecommendations:`);
    comparison.recommendations.forEach(rec => {
        console.log(`  - ${rec}`);
    });

    return comparison;
}

/**
 * Example 3: Extract features only (for analysis)
 */
export async function exampleFeatureExtraction() {
    const sampleContent = `
        <html>
            <body>
                <h1>Content Marketing Guide</h1>
                <p>Content marketing is essential for business growth.</p>
                <h2>Why it Matters</h2>
                <p>Here are the key reasons why content marketing matters.</p>
            </body>
        </html>
    `;

    const features = extractContentFeatures(
        sampleContent,
        'content marketing',
        'Content Marketing Guide',
        'Learn about content marketing',
        'https://example.com/guide'
    );

    console.log('=== Extracted Features ===');
    console.log(`Word Count: ${features.wordCount}`);
    console.log(`Readability (Flesch): ${features.fleschReadingEase.toFixed(2)}`);
    console.log(`Keyword Density: ${features.keywordDensity.toFixed(2)}%`);
    console.log(`Headings: ${features.totalHeadingCount}`);
    console.log(`Links: ${features.internalLinkCount} internal, ${features.externalLinkCount} external`);

    return features;
}

/**
 * Example 4: API request format
 */
export function exampleAPIRequest() {
    const apiRequest = {
        endpoint: 'POST /api/seo/predict-score',
        body: {
            content: '<html>...</html>',
            keyword: 'content marketing',
            title: 'Content Marketing Guide',
            metaDescription: 'Learn content marketing strategies',
            url: 'https://example.com/content-marketing',
            competitorData: {
                avgWordCount: 2500,
                avgHeadings: 12
            }
        }
    };

    console.log('=== Example API Request ===');
    console.log(JSON.stringify(apiRequest, null, 2));

    return apiRequest;
}

/**
 * Example 5: Interpreting results
 */
export function exampleInterpretResults() {
    console.log(`
=== How to Interpret Content Score Predictions ===

1. Overall Score (0-100):
   - 95-100 (A+): Exceptional content, likely to rank very well
   - 90-94 (A): Excellent content, strong ranking potential
   - 85-89 (B+): Very good content, good ranking potential
   - 80-84 (B): Good content, moderate ranking potential
   - 70-79 (C): Acceptable content, needs improvement
   - 60-69 (D): Poor content, significant improvements needed
   - 0-59 (F): Very poor content, major overhaul required

2. Ranking Prediction:
   - Position 1-3: Top rankings, high visibility
   - Position 4-10: First page, good visibility
   - Position 11-20: Second page, moderate visibility
   - Position 21+: Lower rankings, limited visibility

3. Traffic Prediction:
   - Based on predicted position and typical CTR rates
   - Confidence interval shows range of likely outcomes
   - Actual traffic depends on keyword search volume

4. Feature Scores:
   - Readability: How easy your content is to read
   - SEO Optimization: Technical SEO factors
   - Content Quality: Depth, structure, and value
   - Engagement: Visual elements and interactivity
   - Competitiveness: How you compare to competitors

5. Improvements:
   - Prioritized by expected score increase
   - Focus on "urgent" and "high" priority items first
   - Each improvement shows actionable steps

Example Workflow:
1. Submit content for prediction
2. Review overall score and grade
3. Identify top weaknesses
4. Implement recommended improvements
5. Re-analyze to see score increase
6. Publish when score meets your threshold (typically 70+)
    `);
}

// Run examples if executed directly
if (require.main === module) {
    (async () => {
        console.log('\n--- Example 1: Single Article Analysis ---\n');
        await exampleSingleArticle();

        console.log('\n\n--- Example 2: Compare Articles ---\n');
        await exampleCompareArticles();

        console.log('\n\n--- Example 3: Feature Extraction ---\n');
        await exampleFeatureExtraction();

        console.log('\n\n--- Example 4: API Request Format ---\n');
        exampleAPIRequest();

        console.log('\n\n--- Example 5: Interpreting Results ---\n');
        exampleInterpretResults();
    })();
}
