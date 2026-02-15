"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { seoStorage } from "@/lib/seo-storage";
import { imageStorage } from "@/lib/image-storage";
import { toast } from "sonner";
import { VoiceFeedback } from "@/components/seo/VoiceFeedback";
import { validateStepAccess } from "@/lib/seo-step-validator";
import { StepErrorBoundary } from "@/components/seo/StepErrorBoundary";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_BASE_URL } from "@/lib/constants";
import {
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    Circle,
    Eye,
    CheckSquare,
    Rocket,
    Calendar,
    Mail,
    PartyPopper,
    FileText,
    Send,
    BarChart3,
    Target,
    Twitter,
    Linkedin,
    Facebook,
    ArrowRight,
    Loader2,
    XCircle,
    Image as ImageIcon,
    Save,
    X,
    Smartphone,
    Monitor
} from "lucide-react";

interface ReviewCheck {
    id: string;
    category: string;
    name: string;
    status: "pass" | "warning" | "fail";
    value: string;
}

interface AIScore {
    name: string;
    ai: string;
    score: number;
    max: number;
    color: string;
}

// Utility function to count words accurately (strips HTML)
function countWords(text: string): number {
    if (!text) return 0;
    // Remove HTML tags
    const plainText = text.replace(/<[^>]*>/g, ' ');
    // Remove extra whitespace and count words
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
}

// Render HTML content with proper styling (simplified markdown/HTML parser)
function renderArticleContent(htmlContent: string): React.ReactElement {
    if (!htmlContent) {
        return <p className="text-foreground-muted">No content available</p>;
    }

    return (
        <div
            className="article-content prose prose-invert max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/10
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-foreground-muted prose-p:leading-relaxed prose-p:my-4
                prose-a:text-primary prose-a:no-underline hover:prose-a:text-info
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:my-4 prose-ul:space-y-2
                prose-li:text-foreground-muted
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground-muted
                prose-img:rounded-xl prose-img:border prose-img:border-white/10"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }}
        />
    );
}

export default function Step8PublishPage() {
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
        || (typeof window !== "undefined" ? window.location.origin : DEFAULT_BASE_URL);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [scheduledDate, setScheduledDate] = useState("");
    const [publishMode, setPublishMode] = useState<"now" | "schedule">("now");
    const [articleType, setArticleType] = useState<"pillar" | "silo" | "supporting">("supporting");

    // Article data
    const [articleTitle, setArticleTitle] = useState("");
    const [articleSlug, setArticleSlug] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [articleContent, setArticleContent] = useState("");
    const [heroImage, setHeroImage] = useState("");
    const [heroImageData, setHeroImageData] = useState<string | null>(null);
    const [publishedUrl, setPublishedUrl] = useState("");
    const [authorName, setAuthorName] = useState<string | null>(null);
    const [authorAvatar, setAuthorAvatar] = useState<string | null>(null);

    // Scores
    const [overallScore, setOverallScore] = useState(0);
    const [aiScores, setAiScores] = useState<AIScore[]>([]);
    const [reviewChecks, setReviewChecks] = useState<ReviewCheck[]>([]);

    // Social sharing
    const [shareTwitter, setShareTwitter] = useState(true);
    const [shareLinkedIn, setShareLinkedIn] = useState(true);
    const [shareFacebook, setShareFacebook] = useState(false);
    const [shareNewsletter, setShareNewsletter] = useState(true);
    const [publishingNotes, setPublishingNotes] = useState("");
    useDraftAutosave();

    // Preview modal
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
    const actualWordCount = useMemo(() => countWords(articleContent), [articleContent]);
    const estimatedReadTime = useMemo(
        () => `${Math.ceil(actualWordCount / 200)} min read`,
        [actualWordCount]
    );

    useEffect(() => {
        // ESC key to close preview modal
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && showPreviewModal) {
                setShowPreviewModal(false);
            }
        };

        window.addEventListener("keydown", handleEscKey);
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [showPreviewModal]);

    useEffect(() => {
        const loadAuthor = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    logger.warn("Failed to load author session", error);
                    return;
                }
                const user = data.user;
                if (!user) return;
                const metadata = user.user_metadata || {};
                setAuthorName(metadata.full_name || metadata.name || user.email || null);
                setAuthorAvatar(metadata.avatar_url || metadata.avatar || null);
            } catch (error) {
                logger.warn("Author session lookup failed", error);
            }
        };

        loadAuthor();
    }, []);

    useEffect(() => {
        // Load all data from previous steps
        const loadArticleData = async () => {
            const articleData = seoStorage.getArticleData();

            const validation = validateStepAccess(8);
            if (!validation.canAccess) {
                toast.error("Previous steps incomplete", {
                    description: validation.reason || "Please complete previous steps before publishing"
                });
                if (validation.redirectTo) {
                    router.push(validation.redirectTo);
                }
                return;
            }

            // Get article content and metadata
            const step3 = articleData.step3;
            const step4 = articleData.step4;
            const step5 = articleData.step5;
            const step6 = articleData.step6;
            const step7 = articleData.step7;

            // Set article info
            setArticleTitle(step3?.metadata?.title || "Untitled Article");
            setArticleSlug((step6 as any)?.articleSlug || step3?.metadata?.slug || "untitled-article");
            setMetaTitle((step6 as any)?.metaTitle || step3?.metadata?.title || "");
            setMetaDescription((step6 as any)?.metaDescription || step3?.metadata?.metaDescription || "");
            setArticleContent(step5?.humanized || step4?.original || "");

            // Hero image from Step 7 (check if hero image was generated)
            const hasHeroImage = (step7 as any)?.heroImage?.prompt ? "generated" : "";
            setHeroImage(hasHeroImage);
            if ((step7 as any)?.heroImageData) {
                setHeroImageData((step7 as any).heroImageData);
            } else if ((step7 as any)?.heroImageId) {
                const draftId = seoStorage.getDraftId();
                try {
                    const storedImage = await imageStorage.getImage(`${draftId}:${(step7 as any).heroImageId}`);
                    setHeroImageData(storedImage);
                } catch (error) {
                    logger.warn("Failed to load hero image from IndexedDB", error);
                }
            }

            // Calculate AI Scores
            const scores: AIScore[] = [];

            // Step 4 Analysis (GPT-4o)
            if (step4?.analysis) {
                const analysis = step4.analysis;
                const avgScore = Math.round(
                    ((analysis.originality?.score || 0) +
                        (analysis.voice?.score || 0) +
                        (analysis.seo?.score || 0)) / 3
                );
                scores.push({
                    name: "Content Quality",
                    ai: "GPT-4o",
                    score: avgScore,
                    max: 100,
                    color: "bg-primary"
                });
            }

            // Step 5 Humanization (Grok)
            if (step5?.humanized && typeof step5?.humanScore === "number") {
                scores.push({
                    name: "Humanization",
                    ai: "Grok",
                    score: step5.humanScore,
                    max: 100,
                    color: "bg-success"
                });
            }

            // Step 6 SEO Score (Gemini)
            if ((step6 as any)?.overallScore) {
                scores.push({
                    name: "SEO Optimization",
                    ai: "Gemini",
                    score: (step6 as any).overallScore,
                    max: 150,
                    color: "bg-info"
                });
            }

            setAiScores(scores);

            // Calculate overall score (normalized to 100)
            const totalScore = scores.reduce((sum, s) => sum + (s.score / s.max) * 100, 0);
            const avgScore = scores.length > 0 ? Math.round(totalScore / scores.length) : 0;
            setOverallScore(avgScore);

            // Build review checks
            const checks: ReviewCheck[] = [];

            // Content checks - use accurate word count
            const actualWordCount = countWords(step5?.humanized || step4?.original || "");
            const targetWordCount = step3?.metadata?.wordCountTarget || 1500;
            checks.push({
                id: "word-count",
                category: "Content",
                name: "Word Count",
                status: actualWordCount >= targetWordCount * 0.9 ? "pass" : "warning",
                value: `${actualWordCount.toLocaleString()} words`
            });

            const readingTime = Math.ceil(actualWordCount / 200);
            checks.push({
                id: "reading-time",
                category: "Content",
                name: "Reading Time",
                status: "pass",
                value: `${readingTime} min read`
            });

            // Human score from Step 5
            if (step5?.humanized && typeof step5?.humanScore === "number") {
                checks.push({
                    id: "human-score",
                    category: "Content",
                    name: "Human Score",
                    status: "pass",
                    value: `${Math.round(step5.humanScore)}/100`
                });
            }

            // SEO checks from Step 6
            if ((step6 as any)?.seoChecks) {
                const seoScore = (step6 as any).overallScore || 0;
                checks.push({
                    id: "seo-score",
                    category: "SEO",
                    name: "SEO Score",
                    status: seoScore >= 100 ? "pass" : seoScore >= 80 ? "warning" : "fail",
                    value: `${seoScore}/150`
                });
            }

            // Meta tags
            const metaTitleLength = (step6?.metaTitle || step3?.metadata?.title || "").length;
            checks.push({
                id: "meta-title",
                category: "SEO",
                name: "Meta Title",
                status: metaTitleLength > 0 && metaTitleLength <= 60 ? "pass" : "warning",
                value: `${metaTitleLength} chars`
            });

            const metaDescLength = (step6?.metaDescription || "").length;
            checks.push({
                id: "meta-description",
                category: "SEO",
                name: "Meta Description",
                status: metaDescLength >= 120 && metaDescLength <= 160 ? "pass" : "warning",
                value: `${metaDescLength} chars`
            });

            // Links
            const internalLinks = (articleContent.match(/<a[^>]*href\s*=\s*["']\/#/gi) || []).length;
            checks.push({
                id: "internal-links",
                category: "Links",
                name: "Internal Links",
                status: internalLinks >= 2 ? "pass" : "warning",
                value: `${internalLinks} links`
            });

            const outboundLinks = (articleContent.match(/<a[^>]*href\s*=\s*["']https?:\/\//gi) || []).length;
            checks.push({
                id: "outbound-links",
                category: "Links",
                name: "Outbound Links",
                status: outboundLinks >= 2 ? "pass" : "warning",
                value: `${outboundLinks} links`
            });

            // Media from Step 7
            const imageCount = (step7 as any)?.imageSlots?.filter((s: any) => s.status === "ready").length || 0;
            checks.push({
                id: "images",
                category: "Media",
                name: "Images",
                status: imageCount >= 3 ? "pass" : imageCount >= 1 ? "warning" : "fail",
                value: `${imageCount} images`
            });

            checks.push({
                id: "hero-image",
                category: "Media",
                name: "Hero Image",
                status: (step7 as any)?.heroImage ? "pass" : "warning",
                value: (step7 as any)?.heroImage ? "Set" : "Missing"
            });

            // Schema from Step 6
            checks.push({
                id: "schema",
                category: "Schema",
                name: "Article Schema",
                status: (step6 as any)?.jsonLD ? "pass" : "warning",
                value: (step6 as any)?.jsonLD ? "Valid" : "Not configured"
            });

            setReviewChecks(checks);
        };

        loadArticleData();
    }, []);

    const handlePublish = async () => {
        setIsPublishing(true);

        try {
            // Generate slug and URL using environment variable
            const slug = articleSlug || articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;
            const url = `${baseUrl}/articles/${slug}`;

            // Get all article data from previous steps
            const articleData = seoStorage.getArticleData();
            const step7Data = articleData.step7 as any;

            const step5Data = articleData.step5 as any;
            const calculatedHumanScore = typeof step5Data?.humanScore === "number"
                ? step5Data.humanScore
                : undefined;

            // Build complete article object for database
            const articlePayload = {
                title: articleTitle,
                slug: slug,
                excerpt: metaDescription,
                content: articleContent,

                // SEO & Classification
                mainKeyword: articleData.step3?.metadata?.mainKeyword || articleData.step1?.ideaText || "",
                status: publishMode === "schedule" ? "scheduled" : "published",
                articleType: articleType,
                silo: articleData.step3?.metadata?.silo || "AI & Automation",
                depth: articleType === "pillar" ? 0 : articleType === "silo" ? 1 : 2,

                // Metrics
                wordCount: actualWordCount,
                readTime: estimatedReadTime,
                seoScore: Math.round(overallScore),
                humanScore: typeof calculatedHumanScore === "number"
                    ? Math.round(calculatedHumanScore)
                    : undefined,

                // Media
                heroImage: heroImageData,
                heroVideo: null,

                // Metadata
                metaTitle: metaTitle || articleTitle,
                metaDescription: metaDescription,
                authorName: authorName || undefined,
                authorAvatar: authorAvatar || undefined,

                // URL
                url: url,
            };

            // Publish to database via API - REQUIRED for live articles
            let result: any = { article: null };
            try {
                const response = await fetch('/api/articles/publish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(articlePayload)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                    throw new Error(errorData.error || `API returned ${response.status}`);
                }

                result = await response.json();

                // Verify article was actually saved to database
                if (!result.article?.id) {
                    throw new Error('Article published but no ID returned from database');
                }
            } catch (apiError: any) {
                setIsPublishing(false);
                toast.error("Publish failed - article NOT live", {
                    description: apiError.message || "Check database connection and try again",
                    duration: 8000
                });
                return; // STOP execution - don't save to localStorage if DB failed
            }

            // Set published URL
            setPublishedUrl(url);

            // Save publish data to localStorage (for local reference)
            seoStorage.saveStep8({
                publishedAt: new Date().toISOString(),
                scheduledFor: publishMode === "schedule" ? scheduledDate : null,
                publishMode,
                slug,
                url,
                articleType,
                socialSharing: {
                    twitter: shareTwitter,
                    linkedin: shareLinkedIn,
                    facebook: shareFacebook,
                    newsletter: shareNewsletter
                }
            });

            // Mark entire article as published
            seoStorage.saveArticleData({
                status: publishMode === "schedule" ? "scheduled" : "published",
                publishedUrl: url
            } as any);

            // Also save to localStorage published articles (primary storage for now)
            try {
                const existingArticles = JSON.parse(localStorage.getItem('seo-published-articles') || '[]');
                const updatedArticles = [...existingArticles, {
                    ...articlePayload,
                    id: result.article?.id || `article-${Date.now()}`,
                    createdAt: result.article?.created_at || new Date().toISOString(),
                    updatedAt: result.article?.updated_at || new Date().toISOString(),
                    publishedAt: result.article?.published_at || new Date().toISOString(),
                    isSiloPillar: articleType === "pillar",
                    author: {
                        name: authorName || undefined,
                        avatar: authorAvatar || undefined
                    }
                }];
                localStorage.setItem('seo-published-articles', JSON.stringify(updatedArticles));
            } catch (storageError) {
                logger.error("Failed to save to localStorage", storageError);
            }

            setIsPublished(true);
            toast.success(publishMode === "schedule" ? "Article scheduled!" : "Article published!", {
                description: publishMode === "schedule" ? `Scheduled for ${scheduledDate}` : `Live at ${url}`
            });
        } catch (error: any) {
            logger.error("Publish error", error);
            toast.error("Publish failed", {
                description: error.message || "Please try again"
            });
            setIsPublishing(false);
        }
    };

    const handleSaveDraft = async () => {
        try {
            // Generate slug
            const slug = articleSlug || articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const baseUrl = BASE_URL;

            // Get all article data
            const articleData = seoStorage.getArticleData();
            const step7Data = articleData.step7 as any;

            // Calculate actual human score from Step 5 AI detection
            const step5Data = articleData.step5 as any;
            const calculatedHumanScore = typeof step5Data?.humanScore === "number"
                ? step5Data.humanScore
                : undefined;

            // Build draft article payload
            const draftPayload = {
                title: articleTitle || "Untitled Article",
                slug: slug,
                excerpt: metaDescription,
                content: articleContent,

                // SEO & Classification
                mainKeyword: articleData.step3?.metadata?.mainKeyword || articleData.step1?.ideaText || "",
                status: "draft",
                articleType: articleType,
                silo: articleData.step3?.metadata?.silo || "AI & Automation",
                depth: articleType === "pillar" ? 0 : articleType === "silo" ? 1 : 2,

                // Metrics
                wordCount: actualWordCount,
                readTime: estimatedReadTime,
                seoScore: Math.round(overallScore),
                humanScore: typeof calculatedHumanScore === "number"
                    ? Math.round(calculatedHumanScore)
                    : undefined,

                // Media
                heroImage: heroImageData,
                heroVideo: null,

                // Metadata
                metaTitle: metaTitle || articleTitle,
                metaDescription: metaDescription,
                authorName: authorName || undefined,
                authorAvatar: authorAvatar || undefined,

                // URL
                url: `${baseUrl}/articles/${slug}`,
            };

            // Save to database
            const response = await fetch('/api/articles/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draftPayload)
            });

            if (!response.ok) {
                throw new Error('Failed to save draft');
            }

            const result = await response.json();

            // Save to localStorage - update currentStep
            seoStorage.saveArticleData({
                currentStep: 8,
            });

            const draftArticle = {
                id: result.article.id,
                ...draftPayload,
                createdAt: result.article.created_at,
                updatedAt: result.article.updated_at,
                publishedAt: null,
                mainKeyword: articleData.step3?.metadata?.mainKeyword || articleData.step1?.ideaText || "",
                excerpt: metaDescription,
                content: articleContent,
                heroImage: heroImageData,
                heroVideo: null,
                author: {
                    name: authorName || undefined,
                    avatar: authorAvatar || undefined
                },
                readTime: estimatedReadTime,
                articleType: articleType
            };

            // Save to localStorage 'seo-draft-articles'
            try {
                const existingDrafts = JSON.parse(localStorage.getItem('seo-draft-articles') || '[]');
                const updatedDrafts = [...existingDrafts, draftArticle];
                localStorage.setItem('seo-draft-articles', JSON.stringify(updatedDrafts));
            } catch (storageError) {
                logger.error("Failed to save to seo-draft-articles", storageError);
            }

            // Also save to seo-published-articles for backwards compatibility
            seoStorage.savePublishedArticle({
                title: articleTitle || "Untitled Article",
                slug: slug,
                mainKeyword: draftArticle.mainKeyword,
                status: "draft",
                silo: draftArticle.silo,
                depth: draftArticle.depth,
                isPillar: draftArticle.articleType === "pillar",
                updatedAt: new Date().toISOString().split("T")[0],
                wordCount: draftArticle.wordCount,
                aiScore: Math.round(overallScore),
                url: `${baseUrl}/articles/${slug}`,
            });

            toast.success("Saved as draft", {
                description: "Redirecting to articles..."
            });

            // Redirect after short delay
            setTimeout(() => {
                router.push("/admin/seo/articles");
            }, 1000);
        } catch (error: any) {
            logger.error("Save draft error", error);
            toast.error("Save failed", {
                description: error.message || "Please try again"
            });
        }
    };

    const totalScore = aiScores.reduce((sum, s) => sum + (s.score / s.max) * 100, 0);
    const maxScore = aiScores.length * 100;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "pass": return "text-success bg-success/10";
            case "warning": return "text-warning bg-warning/10";
            default: return "text-foreground-muted bg-foreground-muted/10";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pass": return <CheckCircle2 className="w-3 h-3" />;
            case "warning": return <AlertTriangle className="w-3 h-3" />;
            default: return <Circle className="w-3 h-3" />;
        }
    };

    return (
        <StepErrorBoundary>
            <div className="space-y-8 max-w-5xl mx-auto">
                {/* Full Article Preview Modal */}
                <AnimatePresence>
                    {showPreviewModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                            onClick={() => setShowPreviewModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="w-full h-full flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="bg-gradient-to-r from-background to-background-alt border-b border-white/10 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Eye className="w-6 h-6 text-primary" />
                                            Article Preview
                                        </h2>
                                        <div className="text-sm text-foreground-muted font-mono">
                                            {BASE_URL.replace(/^https?:\/\//, '')}/articles/{articleSlug || "article-slug"}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Desktop/Mobile Toggle */}
                                        <div className="flex items-center gap-1 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-1">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setPreviewMode("desktop")}
                                                className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-all ${previewMode === "desktop"
                                                    ? "bg-primary text-background font-semibold"
                                                    : "text-foreground-muted hover:text-white"
                                                    }`}
                                            >
                                                <Monitor className="w-4 h-4" />
                                                Desktop
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setPreviewMode("mobile")}
                                                className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-all ${previewMode === "mobile"
                                                    ? "bg-primary text-background font-semibold"
                                                    : "text-foreground-muted hover:text-white"
                                                    }`}
                                            >
                                                <Smartphone className="w-4 h-4" />
                                                Mobile
                                            </motion.button>
                                        </div>
                                        {/* Close Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setShowPreviewModal(false)}
                                            className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center text-white hover:border-primary/30 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Modal Content - Scrollable Article Preview */}
                                <div className="flex-1 overflow-auto bg-background">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className={`mx-auto transition-all duration-300 ${previewMode === "mobile" ? "max-w-[375px]" : "max-w-7xl"
                                            }`}
                                    >
                                        {/* Article Container */}
                                        <div className="min-h-screen bg-background">
                                            {/* Hero Section */}
                                            <section className={`relative w-full overflow-hidden ${previewMode === "mobile" ? "aspect-video" : "aspect-[21/9]"
                                                }`}>
                                                {/* Hero Image/Video */}
                                                {heroImage === "generated" ? (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                                                        <div className="text-center space-y-2">
                                                            <CheckCircle2 className="w-20 h-20 text-success mx-auto" />
                                                            <p className="text-sm text-success font-semibold">Hero Image Generated</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                                                        <ImageIcon className="w-20 h-20 text-warning/50" />
                                                    </div>
                                                )}

                                                {/* Hero Content Overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6 md:p-12">
                                                    <div className="max-w-4xl">
                                                        {/* Breadcrumb */}
                                                        <div className="flex items-center gap-2 text-sm mb-4">
                                                            <span className="text-foreground-muted">Articles</span>
                                                            <span className="text-foreground-muted">/</span>
                                                            <span className="text-primary">{articleType === "pillar" ? "Pillar Content" : articleType === "silo" ? "Silo Pages" : "Supporting Articles"}</span>
                                                        </div>

                                                        {/* Article Type Badge */}
                                                        {articleType !== "supporting" && (
                                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm mb-4">
                                                                {articleType === "pillar" ? "🏛️ Pillar Content" : "🗂️ Silo Page"}
                                                            </div>
                                                        )}

                                                        {/* Title */}
                                                        <h1 className={`font-bold text-white mb-4 ${previewMode === "mobile" ? "text-2xl" : "text-4xl lg:text-5xl"
                                                            }`}>
                                                            {articleTitle || "Untitled Article"}
                                                        </h1>

                                                        {/* Meta */}
                                                        <div className={`flex flex-wrap items-center gap-4 text-foreground-muted ${previewMode === "mobile" ? "text-xs" : "text-sm"
                                                            }`}>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                                    <span className="text-primary font-bold">S</span>
                                                                </div>
                                                                <span>Stephen Ten</span>
                                                            </div>
                                                            <span>•</span>
                                                            <span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                                                            <span>•</span>
                                                            <span>{estimatedReadTime}</span>
                                                            {previewMode !== "mobile" && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{actualWordCount.toLocaleString()} words</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Main Content with Sidebar */}
                                            <div className={`mx-auto px-4 py-8 md:py-12 ${previewMode === "mobile" ? "" : "max-w-7xl"
                                                }`}>
                                                <div className={previewMode === "mobile" ? "" : "lg:flex lg:gap-12"}>
                                                    {/* Article Content */}
                                                    <article className={previewMode === "mobile" ? "" : "flex-1 max-w-3xl"}>
                                                        {/* Meta Description / Excerpt */}
                                                        {metaDescription && (
                                                            <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-info/5 border border-primary/20">
                                                                <p className="text-foreground-muted leading-relaxed">
                                                                    {metaDescription}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Article Body */}
                                                        <div className="article-preview-content">
                                                            {renderArticleContent(articleContent)}
                                                        </div>

                                                        {/* Author Bio */}
                                                        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-info/5 border border-border">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                                    <span className="text-2xl text-primary font-bold">S</span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-foreground-muted mb-1">Written by</p>
                                                                    <p className="text-xl font-bold text-white">Stephen Ten</p>
                                                                    <p className="text-foreground-muted mt-1">
                                                                        Builder. Investor. AI & Automation Obsessed. 20+ years building businesses.
                                                                    </p>
                                                                    <div className="flex gap-3 mt-4">
                                                                        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                                                                            View Profile
                                                                        </button>
                                                                        <button className="px-4 py-2 rounded-lg bg-background-alt text-foreground text-sm border border-border hover:bg-background-muted">
                                                                            More articles
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Share Buttons */}
                                                        <div className="mt-8 flex items-center gap-4">
                                                            <span className="text-foreground-muted text-sm">Share:</span>
                                                            <div className="flex gap-2">
                                                                {["𝕏", "in", "f", "📧"].map((icon, i) => (
                                                                    <button key={i} className="w-10 h-10 rounded-lg bg-background-alt border border-border flex items-center justify-center text-foreground-muted hover:text-foreground hover:border-primary/50 transition-colors">
                                                                        {icon}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </article>

                                                    {/* Sticky Sidebar - Desktop Only */}
                                                    {previewMode === "desktop" && (
                                                        <aside className="hidden lg:block w-72 flex-shrink-0">
                                                            <div className="sticky top-8 space-y-4">
                                                                {/* Article Type Info */}
                                                                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-info/5 border border-primary/20">
                                                                    <h3 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                                                                        {articleType === "pillar" ? "🏛️ Pillar Content" : articleType === "silo" ? "🗂️ Silo Page" : "📄 Supporting Article"}
                                                                    </h3>
                                                                    <p className="text-xs text-foreground-muted">
                                                                        {articleType === "pillar"
                                                                            ? "Comprehensive cornerstone article (3000+ words)"
                                                                            : articleType === "silo"
                                                                                ? "Topic hub linking to supporting articles"
                                                                                : "Standard article supporting main topics"
                                                                        }
                                                                    </p>
                                                                </div>

                                                                {/* Stats */}
                                                                <div className="p-4 rounded-lg bg-background-alt border border-border">
                                                                    <h3 className="font-semibold text-white text-sm mb-3">Article Stats</h3>
                                                                    <div className="space-y-2 text-xs">
                                                                        <div className="flex justify-between">
                                                                            <span className="text-foreground-muted">Words:</span>
                                                                            <span className="text-primary font-semibold">{actualWordCount.toLocaleString()}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-foreground-muted">Read Time:</span>
                                                                            <span className="text-primary font-semibold">{Math.ceil(actualWordCount / 200)} min</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-foreground-muted">SEO Score:</span>
                                                                            <span className="text-success font-semibold">{overallScore}/100</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* CTA */}
                                                                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-info/10 border border-primary/30 text-center">
                                                                    <span className="text-3xl mb-2 block">🚀</span>
                                                                    <h3 className="font-bold text-white mb-1">Ready to Level Up?</h3>
                                                                    <p className="text-xs text-foreground-muted mb-3">
                                                                        Get started with AI-powered workflows today
                                                                    </p>
                                                                    <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                                                                        Get Started Free
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </aside>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Modal Footer */}
                                <div className="bg-gradient-to-r from-background to-background-alt border-t border-white/10 px-6 py-4 flex items-center justify-between">
                                    <div className="text-sm text-foreground-muted">
                                        Viewing as: <span className="text-primary font-semibold">{previewMode === "mobile" ? "Mobile (375px)" : "Desktop (Full Width)"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowPreviewModal(false)}
                                                className="border-white/10 text-white hover:bg-white/5"
                                            >
                                                Close Preview
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                onClick={() => {
                                                    const previewSlug = articleSlug || articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                                    const previewUrl = `${BASE_URL}/articles/${previewSlug}`;
                                                    window.open(previewUrl, '_blank');
                                                }}
                                                className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Open in New Tab
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header with Progress */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    {/* Enhanced Progress Bar */}
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-info text-background text-sm font-black relative"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-info rounded-full blur-md opacity-50" />
                            <span className="relative z-10">8</span>
                        </motion.div>
                        <div className="h-2 flex-1 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-full overflow-hidden border border-white/10 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary via-info to-primary rounded-full relative"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                        </div>
                        <span className="text-sm text-foreground-muted font-semibold">Step 8 of 8</span>
                    </div>

                    {/* Title */}
                    <div>
                        <Link href="/admin/seo/articles/new/step-7-styling" className="text-sm text-primary hover:text-info transition-colors mb-2 inline-flex items-center gap-1 group">
                            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to Step 7
                        </Link>
                        <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <Sparkles className="w-8 h-8 text-primary" />
                            </motion.div>
                            Review & Publish
                        </h1>
                        <p className="text-foreground-muted text-lg">
                            Final review, scoring dashboard, and publish or schedule
                        </p>
                    </div>
                </motion.div>

                {/* Published Success */}
                {isPublished && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="group relative"
                    >
                        <motion.div
                            className="absolute -inset-0.5 bg-gradient-to-r from-success/30 to-primary/30 rounded-2xl blur-lg opacity-50"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />

                        <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-success/30 overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>

                            <CardContent className="py-12 text-center relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                                    className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4 relative"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-success to-primary rounded-full blur-md opacity-50" />
                                    <PartyPopper className="w-12 h-12 text-success relative z-10" />
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl font-black text-white mb-2"
                                >
                                    {publishMode === "schedule" ? "Article Scheduled!" : "Article Published!"}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-foreground-muted mb-2"
                                >
                                    {publishMode === "schedule"
                                        ? `Your article will be published on ${new Date(scheduledDate).toLocaleDateString()}`
                                        : "Your article is now live at"
                                    }
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-primary font-mono mb-6"
                                >
                                    {publishedUrl || `${BASE_URL}/articles/${articleSlug}`}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex justify-center gap-3 flex-wrap"
                                >
                                    <Link href="/admin/seo/articles">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                View All Articles
                                            </Button>
                                        </motion.div>
                                    </Link>
                                    <Link href="/admin/seo">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:border-white/20">
                                                Back to SEO Engine
                                            </Button>
                                        </motion.div>
                                    </Link>
                                    {publishMode === "now" && (
                                        <a href={publishedUrl} target="_blank" rel="noopener noreferrer">
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group">
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        View Article
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                        animate={{ x: ['-200%', '200%'] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                    />
                                                </Button>
                                            </motion.div>
                                        </a>
                                    )}
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {!isPublished && (
                    <>
                        {/* Score Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="group relative"
                        >
                            <motion.div
                                className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-info/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                whileHover={{ scale: 1.02 }}
                            />

                            <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-primary/30 overflow-hidden">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <CardContent className="py-8 relative z-10">
                                    <div className="grid gap-8 md:grid-cols-2 items-center">
                                        {/* Score Circle */}
                                        <div className="text-center">
                                            <motion.div
                                                className="relative w-40 h-40 mx-auto"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", duration: 0.8 }}
                                            >
                                                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-info rounded-full blur-md opacity-30" />
                                                <svg className="w-full h-full transform -rotate-90 relative z-10">
                                                    <circle
                                                        cx="80"
                                                        cy="80"
                                                        r="70"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="12"
                                                        className="text-white/10"
                                                    />
                                                    <motion.circle
                                                        cx="80"
                                                        cy="80"
                                                        r="70"
                                                        fill="none"
                                                        stroke="url(#scoreGradient)"
                                                        strokeWidth="12"
                                                        strokeDasharray={`${(overallScore / 100) * 440} 440`}
                                                        strokeLinecap="round"
                                                        initial={{ strokeDasharray: "0 440" }}
                                                        animate={{ strokeDasharray: `${(overallScore / 100) * 440} 440` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                    />
                                                    <defs>
                                                        <linearGradient id="scoreGradient">
                                                            <stop offset="0%" stopColor="rgb(var(--primary))" />
                                                            <stop offset="100%" stopColor="rgb(var(--info))" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <motion.div
                                                    className="absolute inset-0 flex flex-col items-center justify-center"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    <span className="text-5xl font-black text-primary">{overallScore}</span>
                                                    <span className="text-sm text-foreground-muted font-semibold">/100</span>
                                                </motion.div>
                                            </motion.div>
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                                className="text-lg font-bold text-white mt-4"
                                            >
                                                Overall Score
                                            </motion.p>
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.7 }}
                                                className={`text-sm font-semibold flex items-center justify-center gap-1 ${overallScore >= 85 ? "text-success" : overallScore >= 70 ? "text-warning" : "text-error"
                                                    }`}
                                            >
                                                {overallScore >= 85 ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Excellent - Ready to Publish!
                                                    </>
                                                ) : overallScore >= 70 ? (
                                                    <>
                                                        <AlertTriangle className="w-4 h-4" />
                                                        Good - Minor improvements needed
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-4 h-4" />
                                                        Needs work before publishing
                                                    </>
                                                )}
                                            </motion.p>
                                        </div>

                                        {/* AI Score Breakdown */}
                                        <div className="space-y-4">
                                            <p className="text-sm text-foreground-muted font-semibold mb-3">Scores by AI Model</p>
                                            {aiScores.map((item, index) => (
                                                <motion.div
                                                    key={item.name}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex justify-between text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-white font-semibold">{item.name}</span>
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30 font-mono">
                                                                {item.ai}
                                                            </span>
                                                        </div>
                                                        <span className="text-primary font-bold">{item.score}/{item.max}</span>
                                                    </div>
                                                    <div className="h-2 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-full overflow-hidden border border-white/10 relative">
                                                        <motion.div
                                                            className="h-full rounded-full bg-gradient-to-r from-primary to-info relative"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(item.score / item.max) * 100}%` }}
                                                            transition={{ duration: 1, delay: 0.1 * index, ease: "easeOut" }}
                                                        >
                                                            <motion.div
                                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                                animate={{ x: ['-100%', '200%'] }}
                                                                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.1 * index }}
                                                            />
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* Article Type Selector */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                            className="group relative"
                        >
                            <motion.div
                                className="absolute -inset-0.5 bg-gradient-to-r from-info/20 to-success/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                whileHover={{ scale: 1.02 }}
                            />

                            <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <CardHeader className="relative z-10">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Target className="w-6 h-6 text-primary" />
                                        Article Type
                                    </CardTitle>
                                    <CardDescription>Choose the article type for content strategy</CardDescription>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        {[
                                            {
                                                type: "pillar" as const,
                                                name: "Pillar Content",
                                                desc: "Comprehensive cornerstone article (3000+ words)",
                                                icon: "🏛️"
                                            },
                                            {
                                                type: "silo" as const,
                                                name: "Silo Page",
                                                desc: "Topic hub linking to supporting articles",
                                                icon: "🗂️"
                                            },
                                            {
                                                type: "supporting" as const,
                                                name: "Supporting Article",
                                                desc: "Standard article supporting main topics",
                                                icon: "📄"
                                            },
                                        ].map((option, index) => (
                                            <motion.div
                                                key={option.type}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.05 * index, duration: 0.3 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setArticleType(option.type)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all ${articleType === option.type
                                                    ? "border-primary/50 bg-gradient-to-br from-primary/20 to-primary/10"
                                                    : "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-primary/30"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-2xl">{option.icon}</span>
                                                    <input
                                                        type="radio"
                                                        checked={articleType === option.type}
                                                        onChange={() => setArticleType(option.type)}
                                                        className="w-4 h-4 accent-primary"
                                                    />
                                                </div>
                                                <p className="text-sm font-bold text-white mb-1">{option.name}</p>
                                                <p className="text-xs text-foreground-muted">{option.desc}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-info/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* Article Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="group relative"
                        >
                            <motion.div
                                className="absolute -inset-0.5 bg-gradient-to-r from-info/20 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                whileHover={{ scale: 1.02 }}
                            />

                            <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <CardHeader className="relative z-10">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Eye className="w-6 h-6 text-primary" />
                                        Article Preview
                                    </CardTitle>
                                    <CardDescription>Preview your article exactly as it will appear live</CardDescription>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="rounded-lg border border-white/10 overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.01]">
                                        {/* Browser Chrome */}
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-white/5 to-white/[0.02] border-b border-white/10">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-error" />
                                                <div className="w-3 h-3 rounded-full bg-warning" />
                                                <div className="w-3 h-3 rounded-full bg-success" />
                                            </div>
                                            <div className="flex-1 text-center">
                                                <span className="text-xs text-primary font-mono">{BASE_URL.replace(/^https?:\/\//, '')}/articles/{articleSlug || "article-slug"}</span>
                                            </div>
                                        </div>
                                        {/* Preview Content */}
                                        <div className="p-6">
                                            <div className="max-w-2xl mx-auto space-y-4">
                                                {/* Hero Image */}
                                                <motion.div
                                                    className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 via-info/10 to-transparent flex items-center justify-center border border-white/10 relative overflow-hidden"
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {heroImage === "generated" ? (
                                                        <div className="w-full h-full bg-gradient-to-br from-success/10 to-primary/5 flex items-center justify-center">
                                                            <div className="text-center space-y-2">
                                                                <CheckCircle2 className="w-16 h-16 text-success mx-auto" />
                                                                <p className="text-sm text-success font-semibold">Hero Image Generated</p>
                                                                <p className="text-xs text-foreground-muted">Generated with Nano Banana</p>
                                                            </div>
                                                            <span className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-success/20 text-success border border-success/30">
                                                                ✓ Ready
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                                            <div className="text-center space-y-2">
                                                                <ImageIcon className="w-16 h-16 text-warning/50 mx-auto" />
                                                                <p className="text-xs text-foreground-muted">Return to Step 7 to generate hero image</p>
                                                            </div>
                                                            <span className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-warning/20 text-warning border border-warning/30">
                                                                No Hero Image
                                                            </span>
                                                        </>
                                                    )}
                                                </motion.div>

                                                {/* Title */}
                                                <h1 className="text-2xl font-bold text-white">
                                                    {articleTitle || "Untitled Article"}
                                                </h1>

                                                {/* Metadata */}
                                                <div className="flex items-center gap-4 text-sm text-foreground-muted">
                                                    <span>Stephen Ten</span>
                                                    <span>•</span>
                                                    <span>{new Date().toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{Math.ceil((articleContent.split(/\s+/).length || 0) / 200)} min read</span>
                                                </div>

                                                {/* Meta Description Preview */}
                                                <p className="text-foreground-muted line-clamp-3">
                                                    {metaDescription || "No meta description set. Add one in Step 6 for better SEO."}
                                                </p>

                                                {/* Article Stats */}
                                                <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                                                    <div className="text-xs">
                                                        <span className="text-foreground-muted">Word Count: </span>
                                                        <span className="text-primary font-bold">{actualWordCount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-xs">
                                                        <span className="text-foreground-muted">Slug: </span>
                                                        <span className="text-primary font-mono">{articleSlug || "not-set"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-xs text-foreground-muted">
                                            Full preview with responsive options available
                                        </div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="outline"
                                                className="border-white/10 text-white hover:bg-white/5 hover:border-primary/30 flex items-center gap-2"
                                                onClick={() => setShowPreviewModal(true)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                Preview Article
                                            </Button>
                                        </motion.div>
                                    </div>
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-info/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* Review Checklist */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="group relative"
                        >
                            <motion.div
                                className="absolute -inset-0.5 bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                whileHover={{ scale: 1.02 }}
                            />

                            <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <CardHeader className="relative z-10">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <CheckSquare className="w-6 h-6 text-primary" />
                                        Pre-Publish Checklist
                                    </CardTitle>
                                    <CardDescription>Final verification of all elements</CardDescription>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        {["Content", "SEO", "Links", "Media", "Schema"].map((category, catIndex) => (
                                            <motion.div
                                                key={category}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.05 * catIndex, duration: 0.3 }}
                                                className="space-y-3"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <BarChart3 className="w-4 h-4 text-primary" />
                                                    <p className="text-sm font-bold text-white">{category}</p>
                                                </div>
                                                {reviewChecks
                                                    .filter((check) => check.category === category)
                                                    .map((check, checkIndex) => (
                                                        <motion.div
                                                            key={check.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.05 * catIndex + 0.03 * checkIndex, duration: 0.3 }}
                                                            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all group/item"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <motion.span
                                                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${getStatusStyle(check.status)}`}
                                                                    whileHover={{ scale: 1.2, rotate: 360 }}
                                                                    transition={{ duration: 0.3 }}
                                                                >
                                                                    {getStatusIcon(check.status)}
                                                                </motion.span>
                                                                <span className="text-sm text-white font-medium group-hover/item:text-primary transition-colors">{check.name}</span>
                                                            </div>
                                                            <span className="text-xs text-foreground-muted font-semibold">{check.value}</span>
                                                        </motion.div>
                                                    ))}
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-success/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* Publish Options */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="group relative"
                        >
                            <motion.div
                                className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-success/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                whileHover={{ scale: 1.02 }}
                            />

                            <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <CardHeader className="relative z-10">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Rocket className="w-6 h-6 text-primary" />
                                        Publish Options
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 relative z-10">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {/* Publish Now */}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`p-6 rounded-xl border cursor-pointer transition-all relative overflow-hidden group/option ${publishMode === "now"
                                                ? "border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5"
                                                : "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-primary/30"
                                                }`}
                                            onClick={() => {
                                                setPublishMode("now");
                                                setScheduledDate("");
                                            }}
                                        >
                                            {publishMode === "now" && (
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-info rounded-xl blur opacity-20" />
                                            )}
                                            <div className="flex items-center gap-3 mb-3 relative z-10">
                                                <input
                                                    type="radio"
                                                    checked={publishMode === "now"}
                                                    onChange={() => {
                                                        setPublishMode("now");
                                                        setScheduledDate("");
                                                    }}
                                                    className="w-4 h-4 accent-primary"
                                                />
                                                <motion.div
                                                    whileHover={{ rotate: 45, scale: 1.1 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Rocket className="w-6 h-6 text-primary" />
                                                </motion.div>
                                                <span className="text-lg font-bold text-white">Publish Now</span>
                                            </div>
                                            <p className="text-sm text-foreground-muted pl-7 relative z-10">
                                                Make article live immediately
                                            </p>
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover/option:opacity-100 transition-opacity" />
                                        </motion.div>

                                        {/* Schedule */}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`p-6 rounded-xl border cursor-pointer transition-all relative overflow-hidden group/option ${publishMode === "schedule"
                                                ? "border-info/50 bg-gradient-to-br from-info/10 to-info/5"
                                                : "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-info/30"
                                                }`}
                                            onClick={() => {
                                                setPublishMode("schedule");
                                                if (!scheduledDate) {
                                                    // Set default to tomorrow at 9 AM
                                                    const tomorrow = new Date();
                                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                                    tomorrow.setHours(9, 0, 0, 0);
                                                    const isoString = tomorrow.toISOString().slice(0, 16);
                                                    setScheduledDate(isoString);
                                                }
                                            }}
                                        >
                                            {publishMode === "schedule" && (
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-info to-primary rounded-xl blur opacity-20" />
                                            )}
                                            <div className="flex items-center gap-3 mb-3 relative z-10">
                                                <input
                                                    type="radio"
                                                    checked={publishMode === "schedule"}
                                                    onChange={() => {
                                                        setPublishMode("schedule");
                                                        if (!scheduledDate) {
                                                            const tomorrow = new Date();
                                                            tomorrow.setDate(tomorrow.getDate() + 1);
                                                            tomorrow.setHours(9, 0, 0, 0);
                                                            const isoString = tomorrow.toISOString().slice(0, 16);
                                                            setScheduledDate(isoString);
                                                        }
                                                    }}
                                                    className="w-4 h-4 accent-info"
                                                />
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Calendar className="w-6 h-6 text-info" />
                                                </motion.div>
                                                <span className="text-lg font-bold text-white">Schedule</span>
                                            </div>
                                            {publishMode === "schedule" ? (
                                                <Input
                                                    type="datetime-local"
                                                    value={scheduledDate}
                                                    onChange={(e) => setScheduledDate(e.target.value)}
                                                    className="w-full mt-2 bg-gradient-to-br from-white/10 to-white/5 border-white/20 text-white focus:border-info/50 focus:ring-2 focus:ring-info/20 relative z-10"
                                                />
                                            ) : (
                                                <p className="text-sm text-foreground-muted pl-7 relative z-10">
                                                    Choose date and time to publish
                                                </p>
                                            )}
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-info/10 to-transparent rounded-bl-full opacity-0 group-hover/option:opacity-100 transition-opacity" />
                                        </motion.div>
                                    </div>

                                    {/* Social Sharing */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                                    >
                                        <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                            <Target className="w-4 h-4 text-primary" />
                                            Auto-share on publish
                                        </p>
                                        <div className="flex gap-3 flex-wrap">
                                            {[
                                                { name: "Twitter/X", icon: Twitter, enabled: shareTwitter, setter: setShareTwitter },
                                                { name: "LinkedIn", icon: Linkedin, enabled: shareLinkedIn, setter: setShareLinkedIn },
                                                { name: "Facebook", icon: Facebook, enabled: shareFacebook, setter: setShareFacebook },
                                                { name: "Newsletter", icon: Mail, enabled: shareNewsletter, setter: setShareNewsletter },
                                            ].map((platform, index) => {
                                                const Icon = platform.icon;
                                                return (
                                                    <motion.button
                                                        key={platform.name}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.05 * index }}
                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => platform.setter(!platform.enabled)}
                                                        className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 relative overflow-hidden ${platform.enabled
                                                            ? "border-primary/50 bg-gradient-to-br from-primary/20 to-primary/10 text-primary"
                                                            : "border-white/10 text-foreground-muted hover:border-primary/30 hover:text-white"
                                                            }`}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                        <span className="text-sm font-semibold">{platform.name}</span>
                                                        {platform.enabled && (
                                                            <CheckCircle2 className="w-3 h-3 text-success" />
                                                        )}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                        <p className="text-xs text-foreground-muted mt-3">
                                            Selected platforms will automatically share this article when published
                                        </p>
                                    </motion.div>
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* Final Action */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="group relative"
                        >
                            <motion.div
                                className="absolute -inset-0.5 bg-gradient-to-r from-primary/40 to-success/40 rounded-2xl blur-xl opacity-50"
                                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />

                            <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-primary/30 overflow-hidden">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <CardContent className="py-12 text-center relative z-10">
                                    {isPublishing ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-6"
                                        >
                                            <motion.div
                                                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center relative"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            >
                                                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-info rounded-full blur-md opacity-50" />
                                                <Rocket className="w-10 h-10 text-primary relative z-10" />
                                            </motion.div>
                                            <p className="text-xl text-white font-bold">Publishing...</p>
                                            <div className="flex justify-center gap-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-2 h-2 rounded-full bg-primary"
                                                        animate={{
                                                            scale: [1, 1.5, 1],
                                                            opacity: [0.3, 1, 0.3]
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            delay: i * 0.15
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-foreground-muted">
                                                Deploying to production, updating CDN, notifying subscribers...
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            <div className="space-y-2">
                                                <motion.div
                                                    className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center relative"
                                                    whileHover={{ scale: 1.1, rotate: 45 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-info rounded-full blur-md opacity-50" />
                                                    <Rocket className="w-8 h-8 text-primary relative z-10" />
                                                </motion.div>
                                                <p className="text-lg text-white font-semibold">
                                                    Ready to go live? Your article will be published at:
                                                </p>
                                            </div>
                                            <motion.div
                                                className="inline-block px-6 py-3 rounded-lg bg-gradient-to-br from-primary/10 to-info/10 border border-primary/30"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <p className="text-primary font-mono font-bold">
                                                    {BASE_URL}/articles/{articleSlug || "article-slug"}
                                                </p>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    onClick={handlePublish}
                                                    size="lg"
                                                    disabled={!articleTitle || !articleSlug || overallScore < 50}
                                                    className="bg-gradient-to-r from-primary to-info text-background hover:shadow-2xl hover:shadow-primary/50 text-lg px-10 py-6 font-black relative overflow-hidden group/btn mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="relative z-10 flex items-center gap-3">
                                                        <Send className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                                        {publishMode === "schedule" ? "Schedule Publication" : "Publish Now"}
                                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                                    </span>
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                        animate={{
                                                            x: ['-200%', '200%']
                                                        }}
                                                        transition={{
                                                            duration: 3,
                                                            repeat: Infinity,
                                                            ease: "linear"
                                                        }}
                                                    />
                                                </Button>
                                            </motion.div>
                                            {publishMode === "schedule" && scheduledDate && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-sm text-info flex items-center justify-center gap-2"
                                                >
                                                    <Calendar className="w-4 h-4" />
                                                    Scheduled for: {new Date(scheduledDate).toLocaleString()}
                                                </motion.p>
                                            )}
                                            {overallScore < 50 && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-sm text-warning flex items-center justify-center gap-2"
                                                >
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Article score too low. Complete previous steps first.
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    )}
                                </CardContent>

                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full opacity-50" />
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-success/10 to-transparent rounded-tl-full opacity-50" />
                            </Card>
                        </motion.div>

                        {/* Voice Notes for Publishing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                        >
                            <VoiceFeedback
                                title="Publishing Notes (Optional)"
                                description="Record any final notes, social media captions, or distribution instructions"
                                onFeedbackSubmit={(notes) => {
                                    setPublishingNotes(notes);
                                    // Save notes to localStorage
                                    const articleData = seoStorage.getArticleData();
                                    seoStorage.saveArticleData({
                                        ...articleData,
                                        step8: {
                                            ...articleData.step8,
                                            timestamp: new Date().toISOString(),
                                        },
                                    });
                                    toast.success("Publishing notes saved!");
                                }}
                            />
                        </motion.div>
                    </>
                )}

                {/* Action Buttons */}
                {!isPublished && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-between pt-6 border-t border-white/10"
                    >
                        <Link href="/admin/seo/articles/new/step-7-styling">
                            <motion.div whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 flex items-center gap-2 transition-all">
                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                    Back to Step 7
                                </Button>
                            </motion.div>
                        </Link>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleSaveDraft}
                                className="bg-gradient-to-r from-warning to-warning/80 text-black hover:shadow-lg hover:shadow-warning/30 font-bold flex items-center gap-2 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Save as Draft
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    animate={{ x: ['-200%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </StepErrorBoundary>
    );
}
