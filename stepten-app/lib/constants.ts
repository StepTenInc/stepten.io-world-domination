/**
 * Application Constants
 * Centralized configuration values for the SEO Article Engine
 */

// === Auto-save Configuration ===
export const AUTOSAVE_INTERVAL_MS = 60000; // 60 seconds
export const DEBOUNCE_DELAY_MS = 1000; // 1 second
export const FORMAT_DEBOUNCE_MS = 500; // 500ms for article formatting

// === Storage Limits ===
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per image
export const MAX_TOTAL_STORAGE_BYTES = 100 * 1024 * 1024; // 100MB total
export const INDEXEDDB_NAME = "seo-images";
export const INDEXEDDB_STORE_NAME = "images";
export const INDEXEDDB_VERSION = 1;

// === API Configuration ===
export const LINK_CHECK_TIMEOUT_MS = 3000; // 3 seconds
export const MAX_LINKS_TO_CHECK = 10;
export const MAX_CONCURRENT_LINK_CHECKS = 5;
export const API_REQUEST_TIMEOUT_MS = 30000; // 30 seconds

// === AI Model Parameters ===
export const HUMANIZE_TEMPERATURE = 0.9;
export const HUMANIZE_MAX_TOKENS = 16000;
export const ANALYSIS_TEMPERATURE = 0.3;
export const ANALYSIS_MAX_TOKENS = 2000;
export const FRAMEWORK_TEMPERATURE = 0.7;
export const FRAMEWORK_MAX_TOKENS = 4000;

// === SEO Scoring ===
export const SEO_MAX_SCORE = 150;
export const SEO_BASIC_MAX_SCORE = 155;
export const SEO_SCHEMA_SCORE = 25;

// === Content Limits ===
export const MIN_ARTICLE_LENGTH = 500; // words
export const MAX_ARTICLE_LENGTH = 10000; // words
export const DEFAULT_TARGET_WORD_COUNT = 1500;
export const IDEAL_KEYWORD_DENSITY_MIN = 1.0; // percentage
export const IDEAL_KEYWORD_DENSITY_MAX = 2.0; // percentage

// === Meta Tag Limits ===
export const META_TITLE_MIN_LENGTH = 50;
export const META_TITLE_MAX_LENGTH = 60;
export const META_TITLE_WARNING_MIN = 40;
export const META_TITLE_WARNING_MAX = 70;

export const META_DESCRIPTION_MIN_LENGTH = 140;
export const META_DESCRIPTION_MAX_LENGTH = 160;
export const META_DESCRIPTION_WARNING_MIN = 120;
export const META_DESCRIPTION_WARNING_MAX = 180;

// === Readability Scoring ===
export const READABILITY_GOOD_THRESHOLD = 60;
export const READABILITY_MODERATE_THRESHOLD = 40;

// === Link Recommendations ===
export const IDEAL_INTERNAL_LINKS_MIN = 3;
export const IDEAL_INTERNAL_LINKS_MAX = 10;
export const IDEAL_OUTBOUND_LINKS_MIN = 2;
export const IDEAL_OUTBOUND_LINKS_MAX = 5;

// === Toast Notification Durations ===
export const TOAST_SUCCESS_DURATION = 3000; // 3 seconds
export const TOAST_ERROR_DURATION = 5000; // 5 seconds
export const TOAST_WARNING_DURATION = 4000; // 4 seconds
export const TOAST_INFO_DURATION = 3000; // 3 seconds

// === Cache Configuration ===
export const ARTICLES_CACHE_DURATION_MS = 60000; // 60 seconds
export const DRAFT_CACHE_DURATION_MS = 300000; // 5 minutes

// === Environment Defaults ===
export const DEFAULT_BASE_URL = "http://localhost:33333";
export const DEFAULT_AUTHOR_NAME = "Content Author";
export const DEFAULT_AUTHOR_AVATAR = "/images/default-avatar.png";

// === Step Validation ===
export const MIN_STEP = 1;
export const MAX_STEP = 8;

// === Image Generation ===
export const IMAGE_GENERATION_TIMEOUT_MS = 60000; // 60 seconds
export const MAX_IMAGE_RETRIES = 3;
export const IMAGE_RETRY_DELAY_MS = 2000; // 2 seconds

// === Audio/Voice ===
export const MAX_AUDIO_DURATION_SECONDS = 300; // 5 minutes
export const AUDIO_CHUNK_SIZE_BYTES = 1024 * 1024; // 1MB chunks

// === Rate Limiting (Client-side) ===
export const API_CALL_COOLDOWN_MS = 1000; // 1 second between same API calls
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 2000; // 2 seconds

// === Local Storage Keys ===
export const STORAGE_KEY_ARTICLE_DATA = "seo-article-data";
export const STORAGE_KEY_DRAFT_ID = "seo-draft-id";
export const STORAGE_KEY_USER_PREFS = "seo-user-preferences";

// === Feature Flags ===
export const ENABLE_VOICE_INPUT = true;
export const ENABLE_DOCUMENT_UPLOAD = true;
export const ENABLE_AUTO_SAVE = true;
export const ENABLE_DRAFT_RESTORE = true;
export const ENABLE_IMAGE_GENERATION = true;

// === Content Analysis Thresholds ===
export const AI_DETECTION_LOW_THRESHOLD = 0.3;
export const AI_DETECTION_MEDIUM_THRESHOLD = 0.6;
export const AI_DETECTION_HIGH_THRESHOLD = 0.8;

export const ORIGINALITY_LOW_THRESHOLD = 50;
export const ORIGINALITY_MEDIUM_THRESHOLD = 70;
export const ORIGINALITY_HIGH_THRESHOLD = 85;

// === Error Messages ===
export const ERROR_NETWORK = "Network error. Please check your connection and try again.";
export const ERROR_API_KEY = "API key not configured. Please contact support.";
export const ERROR_RATE_LIMIT = "Rate limit exceeded. Please wait a moment and try again.";
export const ERROR_STORAGE_FULL = "Storage quota exceeded. Please delete some images or drafts.";
export const ERROR_INVALID_INPUT = "Invalid input. Please check your data and try again.";

// === Success Messages ===
export const SUCCESS_SAVED = "Progress saved successfully!";
export const SUCCESS_PUBLISHED = "Article published successfully!";
export const SUCCESS_GENERATED = "Content generated successfully!";

// === Domain Configuration ===
export const INTERNAL_DOMAINS = ["stepten.io", "www.stepten.io"];
export const HIGH_AUTHORITY_DOMAINS = [".gov", ".edu", "wikipedia.org"];

// === SERP Analysis Configuration ===
export const SERP_RESULTS_COUNT = 10; // Number of top results to analyze
export const SCRAPE_TIMEOUT_MS = 30000; // 30 seconds timeout for SERP scraping
export const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
export const MAX_COMPETITOR_ARTICLES = 10; // Maximum competitor articles to analyze
export const MIN_CONTENT_LENGTH = 500; // Minimum content length for analysis (chars)
export const SCRAPE_RETRY_ATTEMPTS = 2; // Number of retry attempts for failed scrapes

// === Featured Snippet Optimization ===
export const SNIPPET_PARAGRAPH_LENGTH: [number, number] = [40, 60]; // Min/max word count for paragraph snippets
export const SNIPPET_LIST_ITEMS: [number, number] = [5, 8]; // Min/max items for list snippets
export const SNIPPET_TABLE_COLUMNS: [number, number] = [2, 4]; // Min/max columns for table snippets

// === Internal Linking Configuration ===
export const MAX_INTERNAL_LINK_SUGGESTIONS = 5; // Maximum number of internal link suggestions to generate
export const MIN_RELEVANCE_SCORE = 70; // Minimum relevance score (0-100) for a link to be suggested
export const EMBEDDING_MODEL = "text-embedding-3-small"; // OpenAI embedding model for semantic similarity

// === NLP & Topic Coverage ===
export const MIN_ENTITY_MENTIONS = 2; // Minimum mentions to consider an entity significant
export const TARGET_TOPIC_COMPLETENESS = 85; // Target completeness score (0-100)
export const MAX_COMPETITORS_TO_ANALYZE = 5; // Maximum number of competitor articles to analyze for topic coverage

// === Rank Tracking Configuration ===
export const RANKING_CHECK_INTERVAL_HOURS = 24; // How often to check rankings (once per day)
export const ALERT_POSITION_DROP = 3; // Trigger alert when position drops by this many positions
export const TOP_POSITION_THRESHOLD = 10; // Threshold for "page 1" rankings (top 10 results)

// === Content Freshness & Refresh Detection ===
export const FRESHNESS_THRESHOLD_DAYS = 180; // Content older than 180 days (6 months) is considered stale
export const HIGH_PRIORITY_TRAFFIC_DROP = 0.2; // 20% traffic drop triggers high-priority refresh
export const OUTDATED_YEAR_THRESHOLD = 2; // Years older than 2 years are flagged as outdated

// === Multi-Language Support Configuration ===
export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = [
    "en",    // English
    "es",    // Spanish
    "fr",    // French
    "de",    // German
    "it",    // Italian
    "pt",    // Portuguese
    "pt-BR", // Portuguese (Brazil)
    "nl",    // Dutch
    "pl",    // Polish
    "ru",    // Russian
    "ja",    // Japanese
    "ko",    // Korean
    "zh",    // Chinese (Simplified)
    "zh-TW", // Chinese (Traditional)
    "ar",    // Arabic
    "hi",    // Hindi
    "tr",    // Turkish
    "sv",    // Swedish
    "da",    // Danish
    "no",    // Norwegian
    "fi",    // Finnish
    "cs",    // Czech
    "el",    // Greek
    "he",    // Hebrew
    "th",    // Thai
    "vi",    // Vietnamese
    "id",    // Indonesian
];

export const PRESERVE_BRAND_TERMS = [
    "StepTen",
    "StepTen.io",
    "Claude",
    "OpenAI",
    "ChatGPT",
    "Google",
    "Meta",
    "Facebook",
    "Instagram",
    "Twitter",
    "LinkedIn",
    "YouTube",
    "TikTok",
    "API",
    "SDK",
    "SaaS",
    "SEO",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
];

// === Content Cluster Configuration ===
export const CLUSTER_SIZE_MIN = 5;
export const CLUSTER_SIZE_MAX = 7;
export const SUPPORTING_ARTICLES_MIN = 10;
export const SUPPORTING_ARTICLES_MAX = 15;
export const PILLAR_WORD_COUNT = 3500;
export const CLUSTER_WORD_COUNT = 2000;
export const SUPPORTING_WORD_COUNT = 1200;

// === Content Score Predictor ===
export const MIN_QUALITY_SCORE = 70; // Minimum quality score threshold for publishing
export const TRAFFIC_PREDICTION_CONFIDENCE = 0.8; // Confidence threshold for traffic predictions
export const TOP_FEATURES_COUNT = 10; // Number of top features to show in analysis
export const MODEL_VERSION = "1.0.0"; // Current ML model version
export const MODEL_TRAINING_ACCURACY = 0.85; // Expected model accuracy baseline

// === A/B Testing Configuration ===
export const MIN_SAMPLE_SIZE = 100; // Minimum impressions per variant for statistical significance
export const CONFIDENCE_LEVEL = 0.95; // Default confidence level for A/B tests (95%)
export const MAX_TEST_DURATION_DAYS = 30; // Maximum test duration before marking as inconclusive
export const MIN_TEST_DURATION_DAYS = 7; // Minimum recommended test duration
export const DEFAULT_VARIANT_COUNT = 3; // Default number of variants to generate (excluding control)
export const MAX_VARIANT_COUNT = 5; // Maximum number of variants allowed per test
export const MIN_DETECTABLE_EFFECT = 0.1; // Minimum detectable effect size (10% improvement)
export const AB_TEST_ALPHA = 0.05; // Significance level (1 - confidence level)
export const AB_TEST_POWER = 0.8; // Statistical power (80% chance of detecting true effect)

// === AI SEO Agent Configuration ===
export const AGENT_TASK_LIMIT = 5; // Maximum number of tasks to process in a single agent run
export const AGENT_QUALITY_THRESHOLD = 75; // Minimum quality score for agent-generated articles (0-100)
export const AGENT_HUMAN_REVIEW_REQUIRED = true; // Whether human review is required before publishing
