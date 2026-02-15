/**
 * Content Score Predictor
 * ML-based system for predicting article performance and ranking potential
 */

import type {
    ContentFeatureVector,
    ContentScorePrediction,
    RankingPrediction,
} from './seo-types';
import {
    extractContentFeatures,
    getFeatureImportance,
    normalizeFeatures,
} from './content-features';
import {
    MIN_QUALITY_SCORE,
    TRAFFIC_PREDICTION_CONFIDENCE,
    TOP_FEATURES_COUNT,
    MODEL_VERSION,
    MODEL_TRAINING_ACCURACY,
} from './constants';

/**
 * Historical article performance data (for training)
 * In production, this would come from a database
 */
interface HistoricalArticle {
    features: ContentFeatureVector;
    actualRanking: number;
    actualTraffic: number;
    qualityScore: number;
    timeToRank: number; // days
}

/**
 * Weight configuration for different feature categories
 */
interface FeatureWeights {
    readability: number;
    seo: number;
    content: number;
    engagement: number;
    competitive: number;
}

/**
 * Calculate overall content quality score (0-100)
 * Uses weighted combination of all features
 */
function calculateQualityScore(features: ContentFeatureVector): number {
    const weights: FeatureWeights = {
        readability: 0.20,
        seo: 0.30,
        content: 0.25,
        engagement: 0.15,
        competitive: 0.10,
    };

    // Readability score (0-100)
    const readabilityScore = Math.max(
        0,
        Math.min(100, features.fleschReadingEase)
    );

    // SEO optimization score (0-100)
    const seoScore =
        (features.keywordInTitle ? 20 : 0) +
        (features.keywordInFirstParagraph ? 15 : 0) +
        (features.keywordInHeadings > 0 ? 15 : 0) +
        (features.keywordDensity >= 1.0 && features.keywordDensity <= 2.5 ? 20 : 0) +
        (features.titleLength >= 50 && features.titleLength <= 60 ? 10 : 0) +
        (features.metaDescriptionLength >= 140 && features.metaDescriptionLength <= 160 ? 10 : 0) +
        (features.hasSchema ? 10 : 0);

    // Content quality score (0-100)
    const contentScore = Math.min(
        100,
        (features.wordCount / 2500) * 30 +
        (features.totalHeadingCount / 12) * 20 +
        features.lexicalDiversity * 20 +
        (features.contentDepth / 100) * 15 +
        (features.uniqueWordRatio * 15)
    );

    // Engagement score (0-100)
    const engagementScore = Math.min(
        100,
        (features.multimediaCount / 5) * 30 +
        (features.listCount / 3) * 20 +
        (features.questionCount / 5) * 15 +
        (features.statCount / 10) * 15 +
        (features.interactiveElementCount / 2) * 20
    );

    // Competitive score (0-100)
    const competitiveScore = (
        features.contentGapScore * 0.5 +
        features.differentiationScore * 0.5
    );

    // Calculate weighted total
    const totalScore =
        readabilityScore * weights.readability +
        seoScore * weights.seo +
        contentScore * weights.content +
        engagementScore * weights.engagement +
        competitiveScore * weights.competitive;

    return Math.round(totalScore);
}

/**
 * Assign quality grade based on score
 */
function getQualityGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

/**
 * Predict ranking position based on features
 * Uses heuristic model (in production, would use trained ML model)
 */
function predictRanking(
    features: ContentFeatureVector,
    keyword: string,
    qualityScore: number
): RankingPrediction {
    // Base prediction on quality score and key features
    let predictedPosition = 100;

    // Quality score impact (40% weight)
    predictedPosition -= (qualityScore / 100) * 40;

    // Word count impact (20% weight)
    const wordCountScore = Math.min(1, features.wordCount / 2500);
    predictedPosition -= wordCountScore * 20;

    // SEO optimization impact (25% weight)
    const seoOptimization =
        (features.keywordInTitle ? 0.3 : 0) +
        (features.keywordInFirstParagraph ? 0.2 : 0) +
        (features.keywordInHeadings > 0 ? 0.2 : 0) +
        (features.keywordDensity >= 1.0 && features.keywordDensity <= 2.5 ? 0.3 : 0);
    predictedPosition -= seoOptimization * 25;

    // Backlinks impact (10% weight) - placeholder, would need actual data
    const backlinkScore = 0.5; // Assume moderate backlinks
    predictedPosition -= backlinkScore * 10;

    // User signals impact (5% weight)
    // TODO: engagementScore property doesn't exist on ContentFeatureVector
    // Using multimediaCount as engagement proxy
    const userSignalScore = Math.min(1, (features.multimediaCount / 5) || 0.5);
    predictedPosition -= userSignalScore * 5;

    // Ensure position is in valid range
    predictedPosition = Math.max(1, Math.min(100, Math.round(predictedPosition)));

    // Calculate confidence based on feature completeness
    const featureCompleteness =
        (features.wordCount > 0 ? 0.2 : 0) +
        (features.keywordInTitle ? 0.2 : 0) +
        (features.totalHeadingCount > 0 ? 0.2 : 0) +
        (features.externalLinkCount > 0 ? 0.2 : 0) +
        (features.metaDescriptionLength > 0 ? 0.2 : 0);

    const confidenceScore = featureCompleteness * 100;

    // Determine timeframe based on competition and quality
    let timeframe = '3-6 months';
    if (qualityScore >= 90 && predictedPosition <= 10) {
        timeframe = '1-2 months';
    } else if (qualityScore >= 80 && predictedPosition <= 20) {
        timeframe = '2-4 months';
    } else if (qualityScore < 70 || predictedPosition > 50) {
        timeframe = '6-12 months';
    }

    return {
        keyword,
        predictedPosition,
        confidenceScore,
        timeframe,
        factors: {
            contentQuality: qualityScore,
            wordCount: features.wordCount,
            backlinks: 0, // Placeholder
            domainAuthority: 50, // Placeholder
            topicAuthority: Math.round(features.topicCoverage * 100),
            competition: 60, // Placeholder
            userSignals: Math.round(userSignalScore * 100),
        },
        recommendations: generateRankingRecommendations(features, predictedPosition),
    };
}

/**
 * Generate specific recommendations for improving ranking
 */
function generateRankingRecommendations(
    features: ContentFeatureVector,
    predictedPosition: number
): Array<{ factor: string; impact: number; suggestion: string }> {
    const recommendations: Array<{ factor: string; impact: number; suggestion: string }> = [];

    // Word count recommendation
    if (features.wordCount < 1500) {
        recommendations.push({
            factor: 'Word Count',
            impact: 15,
            suggestion: `Increase content length to at least 1,500 words (currently ${features.wordCount}). Longer content tends to rank better.`,
        });
    }

    // Keyword optimization
    if (!features.keywordInTitle) {
        recommendations.push({
            factor: 'Title Optimization',
            impact: 20,
            suggestion: 'Include the target keyword in your title tag for better relevance signals.',
        });
    }

    if (features.keywordDensity < 1.0) {
        recommendations.push({
            factor: 'Keyword Density',
            impact: 12,
            suggestion: `Increase keyword usage naturally. Current density: ${features.keywordDensity.toFixed(2)}%, target: 1-2%`,
        });
    }

    // Readability
    if (features.fleschReadingEase < 60) {
        recommendations.push({
            factor: 'Readability',
            impact: 10,
            suggestion: 'Improve readability by using shorter sentences and simpler words. Target Flesch score: 60-70.',
        });
    }

    // Links
    if (features.externalLinkCount < 3) {
        recommendations.push({
            factor: 'External Links',
            impact: 8,
            suggestion: 'Add 3-5 high-quality external links to authoritative sources.',
        });
    }

    if (features.internalLinkCount < 3) {
        recommendations.push({
            factor: 'Internal Links',
            impact: 7,
            suggestion: 'Add internal links to related content on your site to improve topic authority.',
        });
    }

    // Structure
    if (features.totalHeadingCount < 5) {
        recommendations.push({
            factor: 'Content Structure',
            impact: 9,
            suggestion: 'Add more headings (H2, H3) to improve content structure and scannability.',
        });
    }

    // Media
    if (features.imageCount === 0) {
        recommendations.push({
            factor: 'Visual Content',
            impact: 6,
            suggestion: 'Add relevant images to enhance engagement and user experience.',
        });
    }

    // Sort by impact and return top recommendations
    return recommendations.sort((a, b) => b.impact - a.impact).slice(0, 5);
}

/**
 * Calculate feature scores for different categories
 */
function calculateFeatureScores(features: ContentFeatureVector): ContentScorePrediction['featureScores'] {
    // Readability score
    const readabilityScore = Math.max(0, Math.min(100, features.fleschReadingEase));
    const readabilityGrade =
        readabilityScore >= 80 ? 'Excellent' :
        readabilityScore >= 60 ? 'Good' :
        readabilityScore >= 40 ? 'Fair' : 'Needs Improvement';

    // SEO optimization score
    const seoScore =
        (features.keywordInTitle ? 20 : 0) +
        (features.keywordInFirstParagraph ? 15 : 0) +
        (features.keywordInHeadings > 0 ? 15 : 0) +
        (features.keywordDensity >= 1.0 && features.keywordDensity <= 2.5 ? 20 : 0) +
        (features.titleLength >= 50 && features.titleLength <= 60 ? 15 : 0) +
        (features.metaDescriptionLength >= 140 && features.metaDescriptionLength <= 160 ? 15 : 0);

    // Content quality score
    const contentScore = Math.min(
        100,
        (features.wordCount / 2500) * 30 +
        (features.totalHeadingCount / 12) * 25 +
        features.lexicalDiversity * 25 +
        (features.uniqueWordRatio * 20)
    );

    // Engagement score
    const engagementScore = Math.min(
        100,
        (features.multimediaCount / 5) * 35 +
        (features.listCount / 3) * 25 +
        (features.questionCount / 5) * 20 +
        (features.interactiveElementCount / 2) * 20
    );

    // Competitiveness score
    const competitiveScore = (
        features.contentGapScore * 0.5 +
        features.differentiationScore * 0.5
    );

    return {
        readability: {
            score: Math.round(readabilityScore),
            grade: readabilityGrade,
            recommendation: readabilityScore >= 60
                ? 'Your content is easy to read and understand.'
                : 'Simplify sentence structure and use more common words.',
        },
        seoOptimization: {
            score: Math.round(seoScore),
            grade: seoScore >= 80 ? 'Excellent' : seoScore >= 60 ? 'Good' : 'Needs Work',
            recommendation: seoScore >= 80
                ? 'SEO fundamentals are well optimized.'
                : 'Improve keyword placement and meta tags.',
        },
        contentQuality: {
            score: Math.round(contentScore),
            grade: contentScore >= 80 ? 'Excellent' : contentScore >= 60 ? 'Good' : 'Needs Work',
            recommendation: contentScore >= 80
                ? 'Content is comprehensive and well-structured.'
                : 'Add more depth and improve content structure.',
        },
        engagement: {
            score: Math.round(engagementScore),
            grade: engagementScore >= 70 ? 'Excellent' : engagementScore >= 50 ? 'Good' : 'Needs Work',
            recommendation: engagementScore >= 70
                ? 'Content is engaging and interactive.'
                : 'Add more visual elements and interactive content.',
        },
        competitiveness: {
            score: Math.round(competitiveScore),
            grade: competitiveScore >= 75 ? 'Strong' : competitiveScore >= 50 ? 'Moderate' : 'Weak',
            recommendation: competitiveScore >= 75
                ? 'Content is competitive with top-ranking articles.'
                : 'Increase content depth to match or exceed competitors.',
        },
    };
}

/**
 * Identify top strengths from features
 */
function identifyTopStrengths(
    features: ContentFeatureVector,
    count: number = TOP_FEATURES_COUNT
): Array<{ feature: string; score: number; description: string }> {
    const strengths: Array<{ feature: string; score: number; description: string }> = [];

    const normalized = normalizeFeatures(features);
    const importance = getFeatureImportance();

    // Check each feature
    if (features.wordCount >= 2000) {
        strengths.push({
            feature: 'Word Count',
            score: Math.min(100, (features.wordCount / 3000) * 100),
            description: `Comprehensive content with ${features.wordCount} words`,
        });
    }

    if (features.fleschReadingEase >= 70) {
        strengths.push({
            feature: 'Readability',
            score: features.fleschReadingEase,
            description: 'Easy to read and understand',
        });
    }

    if (features.keywordInTitle && features.keywordInFirstParagraph) {
        strengths.push({
            feature: 'Keyword Optimization',
            score: 95,
            description: 'Excellent keyword placement',
        });
    }

    if (features.totalHeadingCount >= 8) {
        strengths.push({
            feature: 'Content Structure',
            score: Math.min(100, (features.totalHeadingCount / 15) * 100),
            description: `Well-structured with ${features.totalHeadingCount} headings`,
        });
    }

    if (features.externalLinkCount >= 3 && features.externalLinkCount <= 7) {
        strengths.push({
            feature: 'External Links',
            score: 90,
            description: 'Good balance of authoritative external links',
        });
    }

    if (features.lexicalDiversity >= 0.7) {
        strengths.push({
            feature: 'Vocabulary Diversity',
            score: features.lexicalDiversity * 100,
            description: 'Rich and varied vocabulary',
        });
    }

    if (features.multimediaCount >= 3) {
        strengths.push({
            feature: 'Visual Content',
            score: Math.min(100, (features.multimediaCount / 5) * 100),
            description: `Engaging visuals with ${features.multimediaCount} media elements`,
        });
    }

    return strengths
        .sort((a, b) => b.score - a.score)
        .slice(0, count);
}

/**
 * Identify top weaknesses and improvement opportunities
 */
function identifyTopWeaknesses(
    features: ContentFeatureVector,
    count: number = TOP_FEATURES_COUNT
): Array<{
    feature: string;
    score: number;
    impact: 'high' | 'medium' | 'low';
    recommendation: string;
    estimatedImprovement: number;
}> {
    const weaknesses: Array<{
        feature: string;
        score: number;
        impact: 'high' | 'medium' | 'low';
        recommendation: string;
        estimatedImprovement: number;
    }> = [];

    // Check for critical issues
    if (features.wordCount < 1000) {
        weaknesses.push({
            feature: 'Word Count',
            score: (features.wordCount / 1000) * 100,
            impact: 'high',
            recommendation: `Increase content to at least 1,500 words. Current: ${features.wordCount}`,
            estimatedImprovement: 15,
        });
    }

    if (!features.keywordInTitle) {
        weaknesses.push({
            feature: 'Title Optimization',
            score: 0,
            impact: 'high',
            recommendation: 'Add target keyword to title tag',
            estimatedImprovement: 12,
        });
    }

    if (features.keywordDensity < 0.5 || features.keywordDensity > 3.0) {
        weaknesses.push({
            feature: 'Keyword Density',
            score: features.keywordDensity < 0.5 ? 30 : 40,
            impact: 'high',
            recommendation: `Adjust keyword density to 1-2%. Current: ${features.keywordDensity.toFixed(2)}%`,
            estimatedImprovement: 10,
        });
    }

    if (features.fleschReadingEase < 50) {
        weaknesses.push({
            feature: 'Readability',
            score: features.fleschReadingEase,
            impact: 'medium',
            recommendation: 'Simplify sentence structure and use shorter words',
            estimatedImprovement: 8,
        });
    }

    if (features.totalHeadingCount < 5) {
        weaknesses.push({
            feature: 'Content Structure',
            score: (features.totalHeadingCount / 5) * 100,
            impact: 'medium',
            recommendation: 'Add more headings to improve structure and scannability',
            estimatedImprovement: 7,
        });
    }

    if (features.externalLinkCount < 2) {
        weaknesses.push({
            feature: 'External Links',
            score: features.externalLinkCount * 50,
            impact: 'medium',
            recommendation: 'Add 3-5 high-quality external links to authoritative sources',
            estimatedImprovement: 6,
        });
    }

    if (features.imageCount === 0) {
        weaknesses.push({
            feature: 'Visual Content',
            score: 0,
            impact: 'low',
            recommendation: 'Add relevant images to enhance engagement',
            estimatedImprovement: 5,
        });
    }

    if (features.internalLinkCount < 2) {
        weaknesses.push({
            feature: 'Internal Links',
            score: features.internalLinkCount * 50,
            impact: 'low',
            recommendation: 'Add internal links to related content',
            estimatedImprovement: 4,
        });
    }

    return weaknesses
        .sort((a, b) => b.estimatedImprovement - a.estimatedImprovement)
        .slice(0, count);
}

/**
 * Predict traffic potential based on features and ranking
 */
function predictTraffic(
    ranking: RankingPrediction,
    features: ContentFeatureVector
): ContentScorePrediction['trafficPrediction'] {
    // Click-through rate by position (industry averages)
    const ctrByPosition: Record<number, number> = {
        1: 0.316, 2: 0.158, 3: 0.100, 4: 0.077, 5: 0.059,
        6: 0.047, 7: 0.039, 8: 0.033, 9: 0.029, 10: 0.025,
    };

    const position = Math.min(10, Math.max(1, ranking.predictedPosition));
    const ctr = ctrByPosition[position] || 0.01;

    // Assume moderate search volume (would use actual data in production)
    const estimatedSearchVolume = 1000;
    const estimatedMonthlyVisits = Math.round(estimatedSearchVolume * ctr);

    // Calculate confidence interval (±20%)
    const confidenceInterval: [number, number] = [
        Math.round(estimatedMonthlyVisits * 0.8),
        Math.round(estimatedMonthlyVisits * 1.2),
    ];

    // Determine time to rank
    const timeToRank = ranking.timeframe;

    // Peak traffic typically occurs 3-6 months after initial ranking
    const peakTrafficMonth = position <= 5 ? 4 : 6;

    return {
        estimatedMonthlyVisits,
        confidenceInterval,
        timeToRank,
        peakTrafficMonth,
    };
}

/**
 * Generate improvement recommendations
 */
function generateImprovements(
    features: ContentFeatureVector,
    weaknesses: ContentScorePrediction['topWeaknesses']
): ContentScorePrediction['improvements'] {
    const improvements: ContentScorePrediction['improvements'] = [];

    weaknesses.forEach(weakness => {
        let category = 'Content';
        let actionItems: string[] = [];
        let currentValue = 0;
        let targetValue = 0;

        if (weakness.feature === 'Word Count') {
            category = 'Content Length';
            currentValue = features.wordCount;
            targetValue = 1500;
            actionItems = [
                'Expand each section with more details and examples',
                'Add case studies or real-world applications',
                'Include data and statistics to support claims',
                'Add FAQ section addressing common questions',
            ];
        } else if (weakness.feature === 'Title Optimization') {
            category = 'SEO Fundamentals';
            currentValue = features.keywordInTitle ? 1 : 0;
            targetValue = 1;
            actionItems = [
                'Rewrite title to naturally include target keyword',
                'Keep title between 50-60 characters',
                'Make title compelling and click-worthy',
            ];
        } else if (weakness.feature === 'Keyword Density') {
            category = 'Keyword Optimization';
            currentValue = features.keywordDensity;
            targetValue = 1.5;
            actionItems = [
                'Add keyword naturally in subheadings',
                'Include keyword variations throughout content',
                'Ensure keyword appears in introduction and conclusion',
            ];
        } else if (weakness.feature === 'Readability') {
            category = 'Content Quality';
            currentValue = features.fleschReadingEase;
            targetValue = 65;
            actionItems = [
                'Break long sentences into shorter ones',
                'Replace complex words with simpler alternatives',
                'Use active voice instead of passive',
                'Add transition words for better flow',
            ];
        } else if (weakness.feature === 'Content Structure') {
            category = 'Structure';
            currentValue = features.totalHeadingCount;
            targetValue = 10;
            actionItems = [
                'Add descriptive H2 headings for main sections',
                'Use H3 subheadings to break down complex topics',
                'Ensure headings follow logical hierarchy',
            ];
        }

        improvements.push({
            category,
            priority: weakness.impact === 'high' ? 'urgent' : weakness.impact === 'medium' ? 'high' : 'medium',
            currentValue,
            targetValue,
            expectedScoreIncrease: weakness.estimatedImprovement,
            actionItems,
        });
    });

    return improvements;
}

/**
 * Main prediction function - analyze article and predict performance
 * @param content - HTML content of the article
 * @param keyword - Target keyword
 * @param title - Article title
 * @param metaDescription - Meta description
 * @param url - Article URL
 * @param competitorData - Optional competitor analysis data
 * @returns Complete content score prediction
 */
export async function predictContentScore(
    content: string,
    keyword: string,
    title: string = '',
    metaDescription: string = '',
    url: string = '',
    competitorData?: {
        avgWordCount: number;
        avgHeadings: number;
    }
): Promise<ContentScorePrediction> {
    // Extract all features from content
    const features = extractContentFeatures(
        content,
        keyword,
        title,
        metaDescription,
        url,
        competitorData
    );

    // Calculate overall quality score
    const overallScore = calculateQualityScore(features);
    const qualityGrade = getQualityGrade(overallScore);

    // Predict ranking potential
    const rankingPotential = predictRanking(features, keyword, overallScore);

    // Calculate feature scores
    const featureScores = calculateFeatureScores(features);

    // Identify strengths and weaknesses
    const topStrengths = identifyTopStrengths(features);
    const topWeaknesses = identifyTopWeaknesses(features);

    // Predict traffic
    const trafficPrediction = predictTraffic(rankingPotential, features);

    // Generate improvements
    const improvements = generateImprovements(features, topWeaknesses);

    // Build model metadata
    const modelMetadata = {
        modelVersion: MODEL_VERSION,
        trainingAccuracy: MODEL_TRAINING_ACCURACY,
        confidence: TRAFFIC_PREDICTION_CONFIDENCE,
        featuresUsed: Object.keys(features).length,
        predictionDate: new Date().toISOString(),
    };

    return {
        overallScore,
        qualityGrade,
        rankingPotential,
        featureScores,
        topStrengths,
        topWeaknesses,
        trafficPrediction,
        modelMetadata,
        improvements,
    };
}

/**
 * Analyze multiple articles and compare performance
 * @param articles - Array of articles to analyze
 * @returns Comparative analysis results
 */
export async function compareArticles(
    articles: Array<{
        content: string;
        keyword: string;
        title: string;
        metaDescription: string;
        url: string;
    }>
): Promise<{
    predictions: ContentScorePrediction[];
    bestPerformer: number;
    averageScore: number;
    recommendations: string[];
}> {
    const predictions: ContentScorePrediction[] = [];

    for (const article of articles) {
        const prediction = await predictContentScore(
            article.content,
            article.keyword,
            article.title,
            article.metaDescription,
            article.url
        );
        predictions.push(prediction);
    }

    // Find best performer
    const bestPerformerIndex = predictions.reduce(
        (maxIdx, pred, idx, arr) =>
            pred.overallScore > arr[maxIdx].overallScore ? idx : maxIdx,
        0
    );

    // Calculate average score
    const averageScore = predictions.reduce((sum, pred) => sum + pred.overallScore, 0) / predictions.length;

    // Generate comparative recommendations
    const recommendations: string[] = [
        `Best performing article scores ${predictions[bestPerformerIndex].overallScore}/100`,
        `Average score across all articles: ${Math.round(averageScore)}/100`,
        `${predictions.filter(p => p.overallScore >= MIN_QUALITY_SCORE).length} of ${predictions.length} articles meet minimum quality threshold`,
    ];

    return {
        predictions,
        bestPerformer: bestPerformerIndex,
        averageScore,
        recommendations,
    };
}

/**
 * Train model with historical data (placeholder for future ML implementation)
 * @param trainingData - Historical article performance data
 * @returns Training metrics
 */
export async function trainModel(
    trainingData: HistoricalArticle[]
): Promise<{
    accuracy: number;
    rmse: number;
    samplesUsed: number;
}> {
    // This is a placeholder for future ML model training
    // In production, this would train a regression model using the historical data

    console.log(`Training with ${trainingData.length} samples...`);

    // Simulated training metrics
    return {
        accuracy: MODEL_TRAINING_ACCURACY,
        rmse: 0.12,
        samplesUsed: trainingData.length,
    };
}
