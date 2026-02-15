/**
 * SEO Article Creation Types
 * Data structures for the multi-step article generation flow
 */

export type InputMethod = "voice" | "text" | "document" | "existing";

export interface TextCorrection {
    original: string;
    suggestion: string;
    position: number;
    reason: string;
    accepted?: boolean;
}

export interface ArticleIdea {
    inputMethod: InputMethod;
    ideaText: string;
    articleTitle?: string;
    transcriptionRaw?: string;
    corrections?: TextCorrection[];
    documentMetadata?: {
        fileName: string;
        fileSize: number;
        fileType: string;
    };
    timestamp: string;
}

export interface KeyFinding {
    finding: string;
    source: string;
    relevance: string;
    date: string;
    url: string;
}

export interface PracticalExample {
    example: string;
    source: string;
    useCase: string;
}

export interface ExpertOpinion {
    opinion: string;
    expert: string;
    source: string;
}

export interface LinkRecommendation {
    relation: "follow" | "nofollow";
    reason: string;
    openInNewTab: boolean;
    confidence: "high" | "medium" | "low";
}

export interface OutboundLink {
    url: string;
    title: string;
    domain: string;
    domainAuthority: number;
    relevance: string;
    verified?: boolean;
    status?: number | null;
    finalUrl?: string;
    recommendation?: LinkRecommendation;
}

export interface SelectedLink extends OutboundLink {
    selected: boolean;
}

export interface ResearchResult {
    query: string;
    summary: string;
    keyFindings: KeyFinding[];
    trendingTopics: string[];
    controversies: string[];
    practicalExamples: PracticalExample[];
    expertOpinions: ExpertOpinion[];
    relatedTools: string[];
    commonQuestions: string[];
    metrics?: {
        userCount?: string;
        growthRate?: string;
        marketShare?: string;
    };
    researchedAt: string;
}

export interface AggregatedInsights {
    totalSources: number;
    sourceBreakdown: {
        reddit?: number;
        twitter?: number;
        hackerNews?: number;
        blogs?: number;
        githubDiscussions?: number;
    };
    dateRange: {
        oldest: string;
        newest: string;
    };
    topKeywords: string[];
    recommendedOutboundLinks: OutboundLink[];
    semanticKeywords: string[];
    titleSuggestions: string[];
    totalFindings: number;
}

export interface ResearchVersion {
    decomposition: {
        mainTopic: string;
        targetAudience: string;
        contentAngle: string;
        researchQueries: string[];
        estimatedWordCount: number;
        contentType: string;
    };
    researchResults: ResearchResult[];
    aggregatedInsights: AggregatedInsights;
    feedback?: string;
    timestamp: string;
}

export interface ArticleResearch {
    versions: {
        original: ResearchVersion;
        refined?: ResearchVersion;
    };
    activeVersion: "original" | "refined";
    hasRefined: boolean;
    selectedLinks?: SelectedLink[];
    selectedKeywords?: string[];
    timestamp: string;
}

export interface ArticleOutline {
    sections: {
        heading: string;
        subpoints: string[];
    }[];
    timestamp: string;
}

// Step 3: Framework Types
export interface OutlineSubsection {
    text: string;
    instructions?: string;
    content?: {
        wordCount?: number;
        elements?: string[];
        linkPlacements?: Array<{
            anchorText: string;
            relation: string;
            url: string;
        }>;
    };
}

export interface OutlineSection {
    type: "h1" | "h2" | "introduction" | "conclusion";
    text: string;
    wordCount?: number;
    instructions?: string;
    mustInclude?: string[];
    subsections?: OutlineSubsection[];
}

export interface WritingGuidelines {
    tone?: string;
    style?: string;
    voice?: string;
    perspective?: string;
    targetReadingLevel?: string;
    avoidances?: string[];
    requirements?: string[];
    voiceCharacteristics?: string[];
    writingStyle?: string;
    sentenceStructure?: string;
    paragraphFlow?: string;
    [key: string]: any; // Allow for additional dynamic properties
}

export interface Step3Framework {
    metadata: {
        title: string;
        slug: string;
        metaDescription: string;
        focusKeyword: string;
        mainKeyword?: string;
        wordCountTarget: number;
        readingLevel: string;
        silo?: string;
        [key: string]: any; // Allow additional dynamic properties
    };
    outline: OutlineSection[];
    seoChecklist: Record<string, boolean | string>;
    writingGuidelines: WritingGuidelines;
    notes?: string;
    timestamp?: string;
}

// Step 4: Article Analysis Types
export interface KeywordPlacement {
    title?: boolean;
    introduction?: boolean;
    body?: boolean;
    conclusion?: boolean;
    headings?: number;
    inTitle?: boolean;
    inH1?: boolean;
    inFirstParagraph?: boolean;
    inLastParagraph?: boolean;
    inMetaDescription?: boolean;
    inUrl?: boolean;
    density?: number;
    occurrences?: number;
    placements?: string[];
    [key: string]: any; // Allow additional dynamic properties
}

export interface ArticleStats {
    wordCount: number;
    targetWordCount: number;
    keywordDensity: string;
    sentenceCount: number;
    avgSentenceLength: number;
    linkCount: number;
    wordCountDifference: number;
    focusKeywordOccurrences: number;
}

export interface OriginalityAnalysis {
    score: number;
    reasoning: string;
    uniqueAngles: string[];
    genericPatterns: string[];
}

export interface VoiceAnalysis {
    score: number;
    reasoning: string;
    sentenceVariety: string;
}

export interface SEOAnalysis {
    score: number;
    reasoning: string;
    keywordPlacement: KeywordPlacement;
    semanticKeywords: {
        found: string[];
        missing: string[];
    };
}

export interface AIDetectionResult {
    score: number;
    humanLikelihood: string;
    aiTells: Array<{
        pattern: string;
        example?: string;
        fix?: string;
    }>;
    humanStrengths?: string[];
    overallAssessment?: string;
}

export interface TopImprovement {
    priority: "High" | "Medium" | "Low";
    issue: string;
    action: string;
    expectedImpact: string;
}

export interface ArticleAnalysis {
    stats: ArticleStats;
    originality: OriginalityAnalysis;
    voice: VoiceAnalysis;
    seo: SEOAnalysis;
    aiDetection: AIDetectionResult;
    overallGrade: string;
    topImprovements: TopImprovement[];
}

export interface ChangeAnalysis {
    totalChanges: number;
    significantChanges: number;
    minorChanges: number;
    impactScore: number;
    changeTypes: {
        structural: number;
        content: number;
        style: number;
        seo: number;
    };
    improvements: string[];
    concerns?: string[];
    specificChanges?: Array<{
        category: string;
        description: string;
        impact: string;
    }>;
    [key: string]: any; // Allow additional dynamic properties
}

export interface ArticleContent {
    original?: string;
    revised?: string;
    analysis?: ArticleAnalysis;
    changeAnalysis?: ChangeAnalysis;
    wordCount?: number;
    timestamp?: string;
}

// Step 5: Humanization Types
export interface HumanizationChange {
    id: string;
    type: 'addition' | 'deletion' | 'modification' | 'unchanged';
    original: string;
    humanized: string;
    separator: string;
    status: 'accepted' | 'rejected' | 'pending';
    isRehumanizing?: boolean;
}

export interface ChangeSummary {
    type: "emotion" | "hook" | "structure" | "tone" | "ai_fix";
    description: string;
    example: string;
}

export interface Step5Humanization {
    original?: string;
    humanized?: string;
    changes?: HumanizationChange[];
    humanScore?: number;
    changeSummary?: ChangeSummary[];
    aiDetection?: AIDetectionResult;
    timestamp?: string;
}

// Step 6: SEO Optimization Types
export interface SEOCheck {
    id: string;
    category: "content" | "technical" | "links" | "schema" | "keywords";
    name: string;
    status: "pass" | "warning" | "fail" | "pending";
    score: number;
    message: string;
    currentValue?: string | number;
    idealValue?: string;
    details?: string[];
    autoFix?: {
        available: boolean;
        suggestion: string;
        action?: string;
    };
}

export interface SchemaRecommendation {
    type: string;
    recommended: boolean;
    reason: string;
}

export interface Step6Optimization {
    metaTitle?: string;
    metaDescription?: string;
    articleSlug?: string;
    seoScore?: number;
    overallScore?: number;
    seoChecks?: SEOCheck[];
    schemaMarkup?: string;
    jsonLD?: string;
    schemaRecommendations?: SchemaRecommendation[];
    timestamp?: string;
}

// Step 7: Styling Types
export interface GeneratedImage {
    id: string;
    type: 'hero' | 'section' | 'thumbnail';
    prompt: string;
    url?: string;
    status: 'generating' | 'ready' | 'error';
    error?: string;
}

export interface ContentBlock {
    id: string;
    type: 'text' | 'image' | 'quote' | 'code' | 'list';
    content: string;
    styling?: {
        alignment?: 'left' | 'center' | 'right';
        width?: string;
        margin?: string;
    };
}

export interface Typography {
    headingFont?: string;
    bodyFont?: string;
    headingSize?: string;
    bodySize?: string;
    lineHeight?: string;
    letterSpacing?: string;
}

export interface ColorAccents {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
}

export interface HeroMedia {
    type: 'image' | 'video' | 'none';
    imageId?: string;
    videoUrl?: string;
    caption?: string;
}

export interface Step7Styling {
    images?: GeneratedImage[];
    contentBlocks?: ContentBlock[];
    typography?: Typography;
    colorAccents?: ColorAccents;
    heroMedia?: HeroMedia;
    heroImageId?: string;
    sectionImageIds?: string[];
    timestamp?: string;
}

// Step 8: Publishing Types
export interface SocialPlatform {
    platform: 'twitter' | 'linkedin' | 'facebook' | 'reddit';
    enabled: boolean;
    message?: string;
    scheduledTime?: string;
}

export interface SocialSharing {
    platforms: SocialPlatform[];
    autoPost: boolean;
    customMessages?: Record<string, string>;
}

export interface ReviewCheck {
    id: string;
    category: 'content' | 'seo' | 'legal' | 'quality';
    item: string;
    checked: boolean;
    required: boolean;
}

export interface Step8Publishing {
    publishStatus?: 'draft' | 'scheduled' | 'published';
    scheduledDate?: string;
    socialSharing?: SocialSharing;
    reviewChecks?: ReviewCheck[];
    publishedUrl?: string;
    publishedAt?: string;
    timestamp?: string;
}

// Main Article Data Interface
export interface ArticleData {
    draftId?: string;
    step1?: ArticleIdea;
    step2?: ArticleResearch;
    step3?: Step3Framework;
    step4?: ArticleContent;
    step5?: Step5Humanization;
    step6?: Step6Optimization;
    step7?: Step7Styling;
    step8?: Step8Publishing;
    currentStep: number;
    lastUpdated: string;
}

// ====================================
// NEW ADVANCED SEO FEATURES
// ====================================

// SERP Analysis Types
export interface SERPArticle {
    position: number;
    url: string;
    title: string;
    snippet: string;
    wordCount: number;
    headings: string[];
    topics: string[];
    entities: string[];
    backlinks?: number;
    domainAuthority?: number;
    contentType: 'article' | 'listicle' | 'guide' | 'review' | 'comparison';
    hasVideo: boolean;
    hasFAQ: boolean;
    hasTable: boolean;
    lastUpdated?: string;
}

export interface SERPAnalysis {
    keyword: string;
    searchVolume: number;
    difficulty: number;
    topRankingArticles: SERPArticle[];
    featuredSnippet?: {
        type: 'paragraph' | 'list' | 'table' | 'video';
        content: string;
        source: string;
        position: number;
    };
    peopleAlsoAsk: Array<{
        question: string;
        answer: string;
        source: string;
    }>;
    relatedSearches: string[];
    commonPatterns: {
        avgWordCount: number;
        avgHeadings: number;
        commonHeadings: string[];
        sharedTopics: string[];
        contentGaps: string[];
        commonContentTypes: Record<string, number>;
    };
    recommendations: {
        targetWordCount: number;
        mustHaveTopics: string[];
        suggestedHeadings: string[];
        contentAngle: string;
        snippetOpportunity: boolean;
    };
    analyzedAt: string;
}

// Internal Linking Types
export interface InternalLinkSuggestion {
    id: string;
    targetArticle: {
        id: string;
        slug: string;
        title: string;
        focusKeyword: string;
        url: string;
    };
    anchorText: string;
    relevanceScore: number;
    semanticSimilarity: number;
    placement: {
        paragraphIndex: number;
        sentenceIndex: number;
        position: number;
        context: string;
    };
    reasoning: string;
    bidirectional: boolean;
    status: 'suggested' | 'accepted' | 'rejected';
}

export interface InternalLinkingAnalysis {
    currentArticleId: string;
    suggestions: InternalLinkSuggestion[];
    existingLinks: Array<{
        targetId: string;
        anchorText: string;
    }>;
    metrics: {
        totalInternalLinks: number;
        optimalRange: [number, number];
        orphanedContent: boolean;
        topicClusterCoverage: number;
    };
}

// Content Cluster Types
export interface ContentClusterKeyword {
    keyword: string;
    searchVolume: number;
    difficulty: number;
    intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
    parent?: string;
}

export interface ClusterArticle {
    id: string;
    keyword: ContentClusterKeyword;
    type: 'pillar' | 'cluster' | 'supporting';
    wordCount: number;
    status: 'planned' | 'writing' | 'complete' | 'published';
    linksTo: string[];
    depth: number;
    priority: number;
}

export interface ContentCluster {
    id: string;
    name: string;
    mainKeyword: string;
    pillarArticle: ClusterArticle;
    clusterArticles: ClusterArticle[];
    supportingArticles: ClusterArticle[];
    totalArticles: number;
    completedArticles: number;
    estimatedTimeToRank: string;
    createdAt: string;
    updatedAt: string;
}

// Entity & Topic Coverage Types
export interface Entity {
    name: string;
    type: 'Person' | 'Organization' | 'Concept' | 'Product' | 'Location' | 'Event';
    mentions: number;
    coverage: 'missing' | 'mentioned' | 'explained' | 'detailed';
    importance: number;
    competitorMentions: number;
    suggestedPlacement?: {
        section: string;
        context: string;
    };
}

export interface TopicCoverage {
    mainTopic: string;
    requiredSubtopics: Array<{
        topic: string;
        covered: boolean;
        depth: 'shallow' | 'medium' | 'deep';
        competitorCoverage: number;
    }>;
    semanticKeywords: Array<{
        keyword: string;
        relevance: number;
        present: boolean;
        frequency: number;
        suggestedFrequency: number;
    }>;
    entities: Entity[];
    completeness: number;
    competitorAverage: number;
}

// Featured Snippet Types
export interface SnippetOptimization {
    keyword: string;
    currentSnippet?: {
        type: 'paragraph' | 'list' | 'table' | 'video';
        content: string;
        source: string;
        yourRank?: number;
    };
    targetFormat: 'paragraph' | 'list' | 'table';
    recommendations: {
        idealLength: number;
        structure: string[];
        examples: string[];
    };
    optimizedContent: {
        paragraph?: string;
        list?: string[];
        table?: Array<Record<string, string>>;
        html: string;
    };
    insertionPoint: {
        afterHeading: string;
        paragraphIndex: number;
    };
    winProbability: number;
}

// Rank Tracking Types
export interface RankingData {
    keyword: string;
    position: number;
    previousPosition?: number;
    change: number;
    url: string;
    searchVolume: number;
    estimatedTraffic: number;
    checkedAt: string;
}

export interface RankTracking {
    articleId: string;
    keywords: RankingData[];
    averagePosition: number;
    topTenKeywords: number;
    totalKeywords: number;
    estimatedMonthlyTraffic: number;
    history: Array<{
        date: string;
        averagePosition: number;
        traffic: number;
    }>;
}

// Content Refresh Types
export interface RefreshAnalysis {
    articleId: string;
    articleSlug: string;
    publishedAt: string;
    lastUpdated: string;
    ageInMonths: number;
    currentRankings: RankingData[];
    rankingDecline: number;
    needsRefresh: boolean;
    refreshPriority: 'urgent' | 'high' | 'medium' | 'low';
    reasons: string[];
    suggestedUpdates: Array<{
        type: 'content' | 'stats' | 'links' | 'images' | 'keywords';
        description: string;
        priority: number;
    }>;
    competitorChanges: {
        newCompetitors: number;
        contentUpdates: number;
    };
    outdatedInfo: Array<{
        section: string;
        content: string;
        reason: string;
    }>;
}

// Multi-Language Types
export interface TranslationJob {
    id: string;
    sourceArticleId: string;
    targetLanguage: string;
    status: 'pending' | 'translating' | 'localizing' | 'complete' | 'failed';
    progress: number;
    translatedContent?: {
        title: string;
        metaDescription: string;
        content: string;
        keywords: string[];
    };
    localization: {
        culturalAdaptation: boolean;
        localKeywords: boolean;
        localExamples: boolean;
        currencyConversion: boolean;
    };
    createdAt: string;
    completedAt?: string;
}

// A/B Testing Types
export interface ABTestVariant {
    id: string;
    name: string;
    title: string;
    metaDescription: string;
    heroImage?: string;
    traffic: number;
    impressions: number;
    clicks: number;
    ctr: number;
    avgTimeOnPage: number;
    bounceRate: number;
}

export interface ABTest {
    id: string;
    articleId: string;
    metric: 'CTR' | 'time_on_page' | 'bounce_rate' | 'conversions';
    variants: ABTestVariant[];
    winner?: string;
    status: 'running' | 'completed' | 'paused';
    startDate: string;
    endDate?: string;
    duration: number;
    confidence: number;
}

// Content Score Predictor Types
export interface RankingPrediction {
    keyword: string;
    currentPosition?: number;
    predictedPosition: number;
    confidenceScore: number;
    timeframe: string;
    factors: {
        contentQuality: number;
        wordCount: number;
        backlinks: number;
        domainAuthority: number;
        topicAuthority: number;
        competition: number;
        userSignals: number;
    };
    recommendations: Array<{
        factor: string;
        impact: number;
        suggestion: string;
    }>;
}

// AI SEO Agent Types
export interface SEOAgentStrategy {
    niche: string;
    articlesPerWeek: number;
    targetKeywords: number;
    focusFormats: Array<'pillar' | 'cluster' | 'supporting' | 'listicle' | 'comparison'>;
    qualityThreshold: number;
    contentClusterSize: number;
}

export interface SEOAgentTask {
    id: string;
    type: 'research' | 'write' | 'optimize' | 'link' | 'refresh' | 'publish';
    status: 'queued' | 'running' | 'review' | 'complete' | 'failed';
    priority: number;
    articleId?: string;
    clusterId?: string;
    data: Record<string, any>;
    createdAt: string;
    completedAt?: string;
    error?: string;
}

export interface SEOAgent {
    id: string;
    name: string;
    strategy: SEOAgentStrategy;
    autonomy: {
        autoResearch: boolean;
        autoWrite: boolean;
        autoOptimize: boolean;
        autoPublish: boolean;
        autoInternalLink: boolean;
        autoRefresh: boolean;
    };
    status: 'active' | 'paused' | 'stopped';
    metrics: {
        articlesCreated: number;
        articlesPublished: number;
        keywordsCovered: number;
        avgQualityScore: number;
        estimatedMonthlyTraffic: number;
    };
    tasks: SEOAgentTask[];
    createdAt: string;
    lastRunAt?: string;
}

// Multi-Language Support Types
export interface LocalizedArticle {
    language: string;
    locale: string;
    title: string;
    metaDescription: string;
    content: string;
    keywords: string[];
    slug: string;
    culturalAdaptations: Array<{
        original: string;
        adapted: string;
        reason: string;
    }>;
    localizedDates: Record<string, string>;
    localizedCurrency: Record<string, string>;
    localizedMeasurements: Record<string, string>;
    translatedAt: string;
}

export interface HreflangTag {
    rel: 'alternate';
    hreflang: string;
    href: string;
}

export interface MultiLanguageContent {
    sourceLanguage: string;
    sourceArticle: {
        title: string;
        metaDescription: string;
        content: string;
        slug: string;
    };
    translations: LocalizedArticle[];
    hreflangTags: HreflangTag[];
    xDefault?: string;
    supportedLanguages: string[];
    translationMetadata: {
        totalLanguages: number;
        completedTranslations: number;
        failedTranslations: number;
        modelUsed: string;
        translatedAt: string;
    };
}

// Content Score Prediction Types
export interface ContentFeatureVector {
    // Content metrics
    wordCount: number;
    paragraphCount: number;
    sentenceCount: number;
    avgSentenceLength: number;
    avgParagraphLength: number;

    // Readability metrics
    fleschReadingEase: number;
    fleschKincaidGrade: number;
    smogIndex: number;
    colemanLiauIndex: number;
    automatedReadabilityIndex: number;

    // Keyword metrics
    keywordDensity: number;
    keywordFrequency: number;
    keywordInTitle: boolean;
    keywordInFirstParagraph: boolean;
    keywordInLastParagraph: boolean;
    keywordInHeadings: number;
    semanticKeywordCoverage: number;

    // Structure metrics
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h4Count: number;
    totalHeadingCount: number;
    listCount: number;
    tableCount: number;
    imageCount: number;

    // Link metrics
    internalLinkCount: number;
    externalLinkCount: number;
    followLinkCount: number;
    nofollowLinkCount: number;
    avgLinkAuthority: number;

    // Content quality metrics
    uniqueWordRatio: number;
    lexicalDiversity: number;
    contentDepth: number;
    questionCount: number;
    statCount: number;
    quoteCount: number;
    codeBlockCount: number;

    // SEO metrics
    titleLength: number;
    metaDescriptionLength: number;
    urlLength: number;
    hasSchema: boolean;
    hasFAQ: boolean;
    hasHowTo: boolean;

    // Engagement metrics
    estimatedReadTime: number;
    multimediaCount: number;
    interactiveElementCount: number;
    ctaCount: number;

    // Advanced NLP metrics
    entityDensity: number;
    topicCoverage: number;
    sentimentScore: number;
    formalityScore: number;

    // Competitive metrics
    competitorAvgWordCount: number;
    competitorAvgHeadings: number;
    contentGapScore: number;
    differentiationScore: number;
}

export interface ContentScorePrediction {
    overallScore: number;
    qualityGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
    rankingPotential: RankingPrediction;

    featureScores: {
        readability: {
            score: number;
            grade: string;
            recommendation: string;
        };
        seoOptimization: {
            score: number;
            grade: string;
            recommendation: string;
        };
        contentQuality: {
            score: number;
            grade: string;
            recommendation: string;
        };
        engagement: {
            score: number;
            grade: string;
            recommendation: string;
        };
        competitiveness: {
            score: number;
            grade: string;
            recommendation: string;
        };
    };

    topStrengths: Array<{
        feature: string;
        score: number;
        description: string;
    }>;

    topWeaknesses: Array<{
        feature: string;
        score: number;
        impact: 'high' | 'medium' | 'low';
        recommendation: string;
        estimatedImprovement: number;
    }>;

    trafficPrediction: {
        estimatedMonthlyVisits: number;
        confidenceInterval: [number, number];
        timeToRank: string;
        peakTrafficMonth: number;
    };

    modelMetadata: {
        modelVersion: string;
        trainingAccuracy: number;
        confidence: number;
        featuresUsed: number;
        predictionDate: string;
    };

    improvements: Array<{
        category: string;
        priority: 'urgent' | 'high' | 'medium' | 'low';
        currentValue: number;
        targetValue: number;
        expectedScoreIncrease: number;
        actionItems: string[];
    }>;
}
