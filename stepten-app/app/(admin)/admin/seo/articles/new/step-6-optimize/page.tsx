"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceFeedback } from "@/components/seo/VoiceFeedback";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { seoStorage } from "@/lib/seo-storage";
import { useDebouncedSave } from "@/hooks/useDebouncedSave";
import { validateStepAccess } from "@/lib/seo-step-validator";
import { StepErrorBoundary } from "@/components/seo/StepErrorBoundary";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { handleError } from "@/lib/error-handler";
import { extractLinksFromHTML } from "@/lib/extract-links";
import {
    Sparkles,
    Zap,
    FileText,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Link as LinkIcon,
    BarChart3,
    Target,
    Settings,
    Copy,
    ArrowRight,
    Loader2,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Wand2,
    ExternalLink,
    AlertCircle,
    TrendingUp,
    Hash,
    Heading,
    Image as ImageIcon
} from "lucide-react";

interface SEOCheck {
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

interface LinkHealthCheck {
    url: string;
    text: string;
    status: "healthy" | "broken" | "redirect" | "timeout";
    statusCode?: number;
    redirectUrl?: string;
    anchorRelevance: number;
    estimatedAuthority: number;
}

interface HeaderAnalysis {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h1Content: string[];
    hasKeywordInH1: boolean;
    hierarchyIssues: string[];
}

interface KeywordPlacement {
    inTitle: boolean;
    inH1: boolean;
    inFirstParagraph: boolean;
    inLastParagraph: boolean;
    inMetaDescription: boolean;
    inUrl: boolean;
    density: number;
    occurrences: number;
    placements: string[];
}

export default function Step6OptimizePage() {
    const router = useRouter();
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [overallScore, setOverallScore] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [articleSlug, setArticleSlug] = useState("");
    const [jsonLD, setJsonLD] = useState("");
    const [schemaRecommendations, setSchemaRecommendations] = useState<any[]>([]);
    const [linkHealthChecks, setLinkHealthChecks] = useState<LinkHealthCheck[]>([]);
    const [headerAnalysis, setHeaderAnalysis] = useState<HeaderAnalysis | null>(null);
    const [keywordPlacement, setKeywordPlacement] = useState<KeywordPlacement | null>(null);
    const [autoFixes, setAutoFixes] = useState<any>(null);
    const [expandedChecks, setExpandedChecks] = useState<Set<string>>(new Set());
    const [beforeScore, setBeforeScore] = useState(0);
    const [hasLoaded, setHasLoaded] = useState(false);
    useDraftAutosave();

    // Article data
    const [articleContent, setArticleContent] = useState("");
    const [articleTitle, setArticleTitle] = useState("");
    const [focusKeyword, setFocusKeyword] = useState("");
    const [researchLinks, setResearchLinks] = useState<any[]>([]);

    // Initialize as empty - will be populated by API response
    const [seoChecks, setSeoChecks] = useState<SEOCheck[]>([]);

    // Helper function to convert title to kebab-case slug
    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    // Load saved data from previous steps
    useEffect(() => {
        const validation = validateStepAccess(6);
        if (!validation.canAccess) {
            handleError(new Error(validation.reason), "Step Access");
            router.push(validation.redirectTo || "/admin/seo/articles/new/step-5-humanize");
            return;
        }

        const step3Data = seoStorage.getStep3();
        const step2Data = seoStorage.getStep2();

        // Load article content from Step 5
        const content = seoStorage.getStep5()?.humanized || "";
        setArticleContent(content);

        // Load metadata from Step 3
        if (step3Data?.metadata) {
            const title = step3Data.metadata.title || "";
            setArticleTitle(title);
            setMetaTitle(title);
            setMetaDescription(step3Data.metadata.metaDescription || "");
            setFocusKeyword(
                step3Data.metadata.focusKeyword ||
                step3Data.metadata.mainKeyword ||
                step2Data?.versions?.[step2Data.activeVersion]?.decomposition?.mainTopic ||
                ""
            );

            // Generate slug from title
            const slug = step3Data.metadata.slug || generateSlug(title);
            setArticleSlug(slug);
        }

        // Load research links from Step 2
        if (step2Data?.selectedLinks) {
            setResearchLinks(step2Data.selectedLinks);
        }

        // Check if SEO analysis already exists
        const step6Data = seoStorage.getStep6();
        if (step6Data?.seoChecks) {
            setSeoChecks(step6Data.seoChecks);
            setOverallScore(step6Data.overallScore || 0);
            setIsComplete(true);

            if (step6Data.jsonLD) {
                setJsonLD(step6Data.jsonLD);
            }
            if (step6Data.schemaRecommendations) {
                setSchemaRecommendations(step6Data.schemaRecommendations);
            }
            if (step6Data.metaTitle) {
                setMetaTitle(step6Data.metaTitle);
            }
            if (step6Data.metaDescription) {
                setMetaDescription(step6Data.metaDescription);
            }
            if (step6Data.articleSlug) {
                setArticleSlug(step6Data.articleSlug);
            }
        }
        setHasLoaded(true);
    }, [router]);

    useDebouncedSave(
        () => {
            if (!hasLoaded) return;
            seoStorage.saveStep6({
                seoChecks,
                overallScore,
                metaTitle,
                metaDescription,
                articleSlug,
                jsonLD,
                schemaRecommendations,
                timestamp: new Date().toISOString(),
            });
        },
        [seoChecks, overallScore, metaTitle, metaDescription, articleSlug, jsonLD, schemaRecommendations],
        1000,
        hasLoaded
    );

    const toggleCheckExpanded = (checkId: string) => {
        const newExpanded = new Set(expandedChecks);
        if (newExpanded.has(checkId)) {
            newExpanded.delete(checkId);
        } else {
            newExpanded.add(checkId);
        }
        setExpandedChecks(newExpanded);
    };

    const applyAutoFix = (fixType: string, fixData: any) => {
        switch (fixType) {
            case "meta-description":
                setMetaDescription(fixData);
                toast.success("Applied meta description fix");
                break;
            case "alt-text":
                toast.info("Alt text suggestions available - manually update images");
                break;
            case "keyword-placement":
                toast.info("Keyword suggestions available - review content");
                break;
            default:
                toast.info("Fix suggestion available");
        }
    };

    const handleStartOptimization = async () => {
        setIsOptimizing(true);
        setBeforeScore(overallScore);

        try {
            if (!focusKeyword.trim()) {
                toast.error("Missing focus keyword", {
                    description: "Add a focus keyword in Step 3 before running SEO analysis.",
                });
                setIsOptimizing(false);
                return;
            }
            // Extract links from article content using utility function
            const { internal: internalLinks, outbound: outboundLinks } = extractLinksFromHTML(articleContent);

            // Get word count from Step 3 metadata
            const step3Data = seoStorage.getStep3();
            const targetWordCount = step3Data?.metadata?.wordCountTarget || 1500;

            // Call the real API with correct format
            const researchOutboundLinks = researchLinks
                .filter((link: any) => link.verified !== false)
                .map((link: any) => ({
                    text: link.title || link.text,
                    url: link.finalUrl || link.url,
                }));

            const response = await fetch("/api/seo/analyze-seo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    article: articleContent,
                    metadata: {
                        title: metaTitle || articleTitle,
                        focusKeyword: focusKeyword,
                        targetWordCount: targetWordCount,
                        metaDescription: metaDescription,
                        slug: articleSlug || generateSlug(metaTitle || articleTitle),
                    },
                    links: {
                        internal: internalLinks,
                        outbound: [...outboundLinks, ...researchOutboundLinks],
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
                throw new Error(errorData.error || "SEO analysis failed");
            }

            const data = await response.json();

            // Map API response to our check format
            const mappedChecks: SEOCheck[] = data.checks.map((check: any) => ({
                id: check.id,
                category: check.category,
                name: check.name,
                status: check.status,
                score: check.score,
                message: check.message,
            }));

            // Update state with real results
            setSeoChecks(mappedChecks);
            setOverallScore(data.seoScore);
            setIsComplete(true);

            // Update schema recommendations and JSON-LD
            if (data.schemaRecommendations) {
                setSchemaRecommendations(data.schemaRecommendations);
            }
            if (data.schemaMarkup?.jsonLd) {
                setJsonLD(data.schemaMarkup.jsonLd);
            }

            // Update link health checks
            if (data.linkHealthChecks) {
                setLinkHealthChecks(data.linkHealthChecks);
            }

            // Update header analysis
            if (data.headerAnalysis) {
                setHeaderAnalysis(data.headerAnalysis);
            }

            // Update keyword placement
            if (data.keywordPlacement) {
                setKeywordPlacement(data.keywordPlacement);
            }

            // Update auto-fixes
            if (data.autoFixes) {
                setAutoFixes(data.autoFixes);
            }

            // Update meta suggestions if provided
            if (data.metaSuggestions) {
                if (!metaTitle && data.metaSuggestions.title) {
                    setMetaTitle(data.metaSuggestions.title);
                }
                if (!metaDescription && data.metaSuggestions.description) {
                    setMetaDescription(data.metaSuggestions.description);
                }
                if (!articleSlug && data.metaSuggestions.slug) {
                    setArticleSlug(data.metaSuggestions.slug);
                }
            }

            // Auto-save after successful optimization
            seoStorage.saveStep6({
                seoChecks: mappedChecks,
                overallScore: data.seoScore,
                metaTitle: data.metaSuggestions?.title || metaTitle,
                metaDescription: data.metaSuggestions?.description || metaDescription,
                articleSlug: data.metaSuggestions?.slug || articleSlug,
                jsonLD: data.schemaMarkup?.jsonLd,
                schemaRecommendations: data.schemaRecommendations,
                timestamp: new Date().toISOString(),
            });

            toast.success("SEO analysis complete!", {
                description: `Score: ${data.seoScore}/150 - Progress saved!`,
            });
        } catch (error: any) {
            console.error("SEO optimization error:", error);
            toast.error("SEO Analysis Failed", {
                description: error.message || "Please try again",
            });
            setSeoChecks(prev => prev.map(check => ({ ...check, status: "pending", score: 0, message: "" })));
            setOverallScore(0);
            setIsComplete(false);
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleSaveProgress = async () => {
        setIsSaving(true);

        try {
            // Save to localStorage
            seoStorage.saveStep6({
                seoChecks,
                overallScore,
                metaTitle,
                metaDescription,
                articleSlug,
                jsonLD,
                schemaRecommendations,
                timestamp: new Date().toISOString(),
            });

            toast.success("Progress saved!", {
                description: "SEO optimization data has been saved",
            });
        } catch (error: any) {
            console.error("Save error:", error);
            toast.error("Save failed", {
                description: error.message || "Please try again",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopyJsonLD = () => {
        if (jsonLD) {
            navigator.clipboard.writeText(jsonLD);
            toast.success("Copied!", {
                description: "JSON-LD copied to clipboard",
            });
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "pass": return "text-success bg-success/10";
            case "warning": return "text-warning bg-warning/10";
            case "fail": return "text-error bg-error/10";
            default: return "text-foreground-muted bg-foreground-muted/10";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pass": return CheckCircle2;
            case "warning": return AlertTriangle;
            case "fail": return XCircle;
            default: return Target;
        }
    };

    const getCategoryChecks = (category: string) => seoChecks.filter(c => c.category === category);

    return (
        <StepErrorBoundary>
            <div className="space-y-8 max-w-5xl mx-auto">
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
                            <span className="relative z-10">6</span>
                        </motion.div>
                        <div className="h-2 flex-1 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-full overflow-hidden border border-white/10 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary via-info to-primary rounded-full relative"
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                        </div>
                        <span className="text-sm text-foreground-muted font-semibold">Step 6 of 8</span>
                    </div>

                    {/* Title */}
                    <div>
                        <Link href="/admin/seo/articles/new/step-5-humanize" className="text-sm text-primary hover:text-info transition-colors mb-2 inline-flex items-center gap-1 group">
                            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to Step 5
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
                            SEO Optimization
                        </h1>
                        <p className="text-foreground-muted text-lg">
                            Links, schema markup, meta tags, and RankMath-style optimization scoring
                        </p>
                    </div>
                </motion.div>

                {/* Start Button */}
                {!isOptimizing && !isComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="group relative"
                    >
                        <motion.div
                            className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-info/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                            whileHover={{ scale: 1.02 }}
                        />

                        <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>

                            <CardContent className="py-12 text-center relative z-10">
                                <div className="space-y-6">
                                    <motion.div
                                        className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30"
                                        whileHover={{ scale: 1.1, rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Zap className="w-10 h-10 text-primary" />
                                    </motion.div>
                                    <div>
                                        <p className="text-white font-bold text-xl mb-2">Ready to Optimize</p>
                                        <p className="text-foreground-muted">
                                            Gemini will analyze and optimize for maximum discoverability
                                        </p>
                                    </div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={handleStartOptimization}
                                            className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                <Zap className="w-5 h-5" />
                                                Run SEO Analysis
                                            </span>
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
                                </div>
                            </CardContent>

                            {/* Corner Accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Card>
                    </motion.div>
                )}

                {/* Processing */}
                {isOptimizing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="group relative"
                    >
                        <motion.div
                            className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-info/30 rounded-2xl blur-lg"
                            animate={{
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        <Card className="relative bg-gradient-to-br from-primary/[0.15] to-info/[0.05] border border-primary/30 overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>

                            <CardContent className="py-12 text-center relative z-10">
                                <div className="space-y-4">
                                    <motion.div
                                        className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50"
                                        animate={{
                                            rotate: 360,
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                                        }}
                                    >
                                        <Zap className="w-10 h-10 text-primary" />
                                    </motion.div>
                                    <div>
                                        <p className="text-white font-bold text-xl mb-2">Analyzing SEO factors...</p>
                                        <p className="text-foreground-muted">
                                            Checking 15 optimization criteria
                                        </p>
                                    </div>
                                    <div className="flex justify-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1.5 bg-primary rounded-full"
                                                animate={{
                                                    height: [8, 24, 8],
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    repeat: Infinity,
                                                    delay: i * 0.1,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Results */}
                {isComplete && (
                    <>
                        {/* Score Display */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="group relative"
                        >
                            <motion.div
                                className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-success/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                whileHover={{ scale: 1.02 }}
                            />

                            <Card className="relative bg-gradient-to-br from-primary/[0.15] to-success/[0.05] border border-primary/30 overflow-hidden">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <CardContent className="py-8 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-black text-white flex items-center gap-2">
                                                <Target className="w-6 h-6 text-primary" />
                                                SEO Score
                                            </h3>
                                            <p className="text-foreground-muted mt-1">Comprehensive SEO Analysis</p>
                                            {beforeScore > 0 && beforeScore !== overallScore && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-sm text-foreground-muted">
                                                        Before: {beforeScore}/150
                                                    </span>
                                                    <span className="text-primary font-bold">→</span>
                                                    <span className="text-sm text-success font-semibold">
                                                        After: {overallScore}/150 (+{overallScore - beforeScore})
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Button
                                                onClick={() => {
                                                    setBeforeScore(overallScore);
                                                    setIsComplete(false);
                                                    handleStartOptimization();
                                                }}
                                                variant="outline"
                                                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Re-analyze
                                            </Button>
                                        </div>
                                        <div className="text-center">
                                            <motion.div
                                                className="relative w-32 h-32"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ duration: 0.8, type: "spring" }}
                                            >
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="56"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        className="text-white/10"
                                                    />
                                                    <motion.circle
                                                        cx="64"
                                                        cy="64"
                                                        r="56"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        className="text-primary"
                                                        initial={{ strokeDasharray: "0 352" }}
                                                        animate={{ strokeDasharray: `${(overallScore / 150) * 352} 352` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <motion.span
                                                        className="text-3xl font-black text-primary"
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.5, duration: 0.5 }}
                                                    >
                                                        {overallScore}/150
                                                    </motion.span>
                                                </div>
                                            </motion.div>
                                            <motion.p
                                                className={`text-sm mt-2 font-bold ${overallScore >= 130 ? "text-success" : overallScore >= 100 ? "text-warning" : "text-error"}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.8 }}
                                            >
                                                {overallScore >= 130 ? "Excellent" : overallScore >= 100 ? "Good" : "Needs Work"}
                                            </motion.p>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* Meta Data Edit */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
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
                                        <FileText className="w-6 h-6 text-primary" />
                                        Meta Data
                                    </CardTitle>
                                    <CardDescription>Edit title and description for search results</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 relative z-10">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-semibold text-white">Meta Title</label>
                                            <span className={`text-xs font-bold ${metaTitle.length <= 60 ? "text-success" : "text-warning"}`}>
                                                {metaTitle.length}/60
                                            </span>
                                        </div>
                                        <Input
                                            value={metaTitle}
                                            onChange={(e) => setMetaTitle(e.target.value)}
                                            className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 text-white placeholder:text-foreground-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-semibold text-white">Meta Description</label>
                                            <span className={`text-xs font-bold ${metaDescription.length <= 160 ? "text-success" : "text-warning"}`}>
                                                {metaDescription.length}/160
                                            </span>
                                        </div>
                                        <textarea
                                            value={metaDescription}
                                            onChange={(e) => setMetaDescription(e.target.value)}
                                            className="w-full p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-white placeholder:text-foreground-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none resize-none h-20 transition-all"
                                        />
                                    </div>
                                    {/* SERP Preview */}
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/[0.08] to-info/[0.02] border border-primary/20">
                                        <p className="text-xs text-foreground-muted mb-3 font-semibold">Search Preview</p>
                                        <div className="space-y-1">
                                            <p className="text-info text-lg hover:underline cursor-pointer font-semibold">{metaTitle || articleTitle}</p>
                                            <p className="text-xs text-success font-medium">stepten.io › {articleSlug || "your-article-slug"}</p>
                                            <p className="text-sm text-foreground-muted">{metaDescription || "Add a meta description to see preview..."}</p>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* Checks by Category */}
                        {[
                            { key: "keywords", title: "Keyword Optimization", icon: Hash, delay: 0.2 },
                            { key: "content", title: "Content Quality", icon: FileText, delay: 0.25 },
                            { key: "technical", title: "Technical SEO", icon: Settings, delay: 0.3 },
                            { key: "links", title: "Link Optimization", icon: LinkIcon, delay: 0.35 },
                            { key: "schema", title: "Schema Markup", icon: BarChart3, delay: 0.4 },
                        ].map((category) => {
                            const Icon = category.icon;
                            const categoryChecks = getCategoryChecks(category.key);
                            if (categoryChecks.length === 0) return null;

                            return (
                                <motion.div
                                    key={category.key}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: category.delay, duration: 0.5 }}
                                    className="group relative"
                                >
                                    <motion.div
                                        className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-info/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                        whileHover={{ scale: 1.02 }}
                                    />

                                    <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                                        <div className="absolute inset-0 opacity-5">
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                        </div>

                                        <CardHeader className="pb-3 relative z-10">
                                            <CardTitle className="text-white flex items-center gap-2 text-lg font-black">
                                                <Icon className="w-5 h-5 text-primary" />
                                                {category.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="relative z-10">
                                            <div className="space-y-2">
                                                {categoryChecks.map((check, idx) => {
                                                    const StatusIcon = getStatusIcon(check.status);
                                                    const isExpanded = expandedChecks.has(check.id);
                                                    const hasDetails = check.details && check.details.length > 0;

                                                    return (
                                                        <motion.div
                                                            key={check.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: category.delay + (idx * 0.05), duration: 0.3 }}
                                                            className="rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-primary/20 transition-all"
                                                        >
                                                            <div
                                                                className="flex items-center justify-between p-3 cursor-pointer"
                                                                onClick={() => hasDetails && toggleCheckExpanded(check.id)}
                                                            >
                                                                <div className="flex items-center gap-3 flex-1">
                                                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusStyle(check.status)}`}>
                                                                        <StatusIcon className="w-4 h-4" />
                                                                    </span>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-white font-semibold">{check.name}</p>
                                                                        <p className="text-xs text-foreground-muted">{check.message}</p>
                                                                        {check.currentValue && (
                                                                            <p className="text-xs text-primary mt-1">
                                                                                Current: {check.currentValue} | Ideal: {check.idealValue}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-sm font-black ${check.status === "pass" ? "text-success" : check.status === "warning" ? "text-warning" : "text-error"}`}>
                                                                        +{check.score}
                                                                    </span>
                                                                    {hasDetails && (
                                                                        <motion.div
                                                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                                                            transition={{ duration: 0.2 }}
                                                                        >
                                                                            <ChevronDown className="w-4 h-4 text-foreground-muted" />
                                                                        </motion.div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Expandable Details */}
                                                            {hasDetails && isExpanded && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="px-3 pb-3 space-y-2"
                                                                >
                                                                    <div className="pl-10 space-y-1">
                                                                        {check.details!.map((detail, i) => (
                                                                            <p key={i} className="text-xs text-foreground-muted flex items-start gap-2">
                                                                                <span className="text-primary mt-0.5">•</span>
                                                                                <span>{detail}</span>
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>

                                        {/* Corner Accent */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Card>
                                </motion.div>
                            );
                        })}

                        {/* Keyword Placement Insights */}
                        {keywordPlacement && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45, duration: 0.5 }}
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
                                            <TrendingUp className="w-6 h-6 text-primary" />
                                            Keyword Placement Analysis
                                        </CardTitle>
                                        <CardDescription>
                                            Strategic placement of "{focusKeyword}" throughout content
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 relative z-10">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {[
                                                { label: "Title", value: keywordPlacement.inTitle },
                                                { label: "H1", value: keywordPlacement.inH1 },
                                                { label: "Opening", value: keywordPlacement.inFirstParagraph },
                                                { label: "Closing", value: keywordPlacement.inLastParagraph },
                                                { label: "URL", value: keywordPlacement.inUrl },
                                            ].map((item, i) => (
                                                <motion.div
                                                    key={item.label}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.5 + i * 0.05 }}
                                                    className={`p-3 rounded-lg border ${item.value
                                                            ? "bg-success/10 border-success/30"
                                                            : "bg-error/10 border-error/30"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-white">
                                                            {item.label}
                                                        </span>
                                                        {item.value ? (
                                                            <CheckCircle2 className="w-4 h-4 text-success" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-error" />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-info/5 border border-primary/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold text-white">
                                                    Keyword Density
                                                </span>
                                                <span className="text-lg font-black text-primary">
                                                    {keywordPlacement.density.toFixed(2)}%
                                                </span>
                                            </div>
                                            <div className="text-xs text-foreground-muted">
                                                {keywordPlacement.occurrences} occurrences | Ideal: 1-2%
                                            </div>
                                        </div>

                                        {keywordPlacement.placements.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold text-white">Keyword Locations:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {keywordPlacement.placements.map((placement, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-1 text-xs rounded-md bg-primary/20 text-primary border border-primary/30"
                                                        >
                                                            {placement}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>

                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </motion.div>
                        )}

                        {/* Header Structure Analysis */}
                        {headerAnalysis && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
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
                                            <Heading className="w-6 h-6 text-primary" />
                                            Header Structure
                                        </CardTitle>
                                        <CardDescription>
                                            Hierarchy and organization of headings
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 relative z-10">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                                                <div className="text-3xl font-black text-primary mb-1">
                                                    {headerAnalysis.h1Count}
                                                </div>
                                                <div className="text-sm text-foreground-muted">H1 Tags</div>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-info/10 to-transparent border border-info/20">
                                                <div className="text-3xl font-black text-info mb-1">
                                                    {headerAnalysis.h2Count}
                                                </div>
                                                <div className="text-sm text-foreground-muted">H2 Tags</div>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-success/10 to-transparent border border-success/20">
                                                <div className="text-3xl font-black text-success mb-1">
                                                    {headerAnalysis.h3Count}
                                                </div>
                                                <div className="text-sm text-foreground-muted">H3 Tags</div>
                                            </div>
                                        </div>

                                        {headerAnalysis.h1Content.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold text-white">H1 Content:</p>
                                                {headerAnalysis.h1Content.map((h1, i) => (
                                                    <div
                                                        key={i}
                                                        className="p-3 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                                                    >
                                                        <p className="text-white font-semibold">{h1}</p>
                                                        {h1.toLowerCase().includes(focusKeyword.toLowerCase()) && (
                                                            <p className="text-xs text-success mt-1 flex items-center gap-1">
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                Contains focus keyword
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {headerAnalysis.hierarchyIssues.length > 0 && (
                                            <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                                                <p className="text-sm font-semibold text-warning mb-2 flex items-center gap-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Issues Found:
                                                </p>
                                                <ul className="space-y-1">
                                                    {headerAnalysis.hierarchyIssues.map((issue, i) => (
                                                        <li key={i} className="text-xs text-foreground-muted">
                                                            • {issue}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>

                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </motion.div>
                        )}

                        {/* Link Health Check */}
                        {linkHealthChecks.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55, duration: 0.5 }}
                                className="group relative"
                            >
                                <motion.div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-warning/20 to-info/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                    whileHover={{ scale: 1.02 }}
                                />

                                <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                    </div>

                                    <CardHeader className="relative z-10">
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <ExternalLink className="w-6 h-6 text-primary" />
                                            Link Health Check
                                        </CardTitle>
                                        <CardDescription>
                                            Status and quality of external links (first 10)
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 relative z-10">
                                        {linkHealthChecks.map((link, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6 + i * 0.05 }}
                                                className={`p-3 rounded-lg border ${link.status === "healthy"
                                                        ? "bg-success/10 border-success/30"
                                                        : link.status === "redirect"
                                                            ? "bg-warning/10 border-warning/30"
                                                            : "bg-error/10 border-error/30"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-white truncate">
                                                            {link.text}
                                                        </p>
                                                        <p className="text-xs text-foreground-muted truncate mt-1">
                                                            {link.url}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <span className="text-xs text-foreground-muted">
                                                                Anchor: {link.anchorRelevance}%
                                                            </span>
                                                            <span className="text-xs text-foreground-muted">
                                                                Authority: {link.estimatedAuthority}%
                                                            </span>
                                                        </div>
                                                        {link.redirectUrl && (
                                                            <p className="text-xs text-warning mt-1">
                                                                Redirects to: {link.redirectUrl}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-bold rounded ${link.status === "healthy"
                                                                    ? "bg-success/20 text-success"
                                                                    : link.status === "redirect"
                                                                        ? "bg-warning/20 text-warning"
                                                                        : "bg-error/20 text-error"
                                                                }`}
                                                        >
                                                            {link.status.toUpperCase()}
                                                        </span>
                                                        {link.statusCode && link.statusCode > 0 && (
                                                            <span className="text-xs text-foreground-muted">
                                                                {link.statusCode}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </CardContent>

                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </motion.div>
                        )}

                        {/* Auto-Fix Suggestions */}
                        {autoFixes && Object.keys(autoFixes).length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
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
                                            <Wand2 className="w-6 h-6 text-primary" />
                                            AI-Powered Auto-Fixes
                                        </CardTitle>
                                        <CardDescription>
                                            One-click fixes generated by AI
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 relative z-10">
                                        {autoFixes.missingMetaDescription && (
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-white mb-1">
                                                            Meta Description
                                                        </p>
                                                        <p className="text-xs text-foreground-muted">
                                                            {autoFixes.missingMetaDescription}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            applyAutoFix(
                                                                "meta-description",
                                                                autoFixes.missingMetaDescription
                                                            )
                                                        }
                                                        className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                                                    >
                                                        <Wand2 className="w-3 h-3 mr-1" />
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {autoFixes.missingAltTexts && autoFixes.missingAltTexts.length > 0 && (
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-info/10 to-transparent border border-info/20">
                                                <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4" />
                                                    Missing Alt Text Suggestions
                                                </p>
                                                <div className="space-y-2">
                                                    {autoFixes.missingAltTexts.slice(0, 3).map((alt: any, i: number) => (
                                                        <div
                                                            key={i}
                                                            className="text-xs text-foreground-muted p-2 rounded bg-white/5"
                                                        >
                                                            <span className="text-info font-semibold">
                                                                Suggestion {i + 1}:
                                                            </span>{" "}
                                                            {alt.suggestedAlt}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {autoFixes.keywordSuggestions && autoFixes.keywordSuggestions.length > 0 && (
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-success/10 to-transparent border border-success/20">
                                                <p className="text-sm font-semibold text-white mb-3">
                                                    Keyword Placement Suggestions
                                                </p>
                                                <ul className="space-y-2">
                                                    {autoFixes.keywordSuggestions.map((suggestion: string, i: number) => (
                                                        <li key={i} className="text-xs text-foreground-muted flex items-start gap-2">
                                                            <span className="text-success mt-0.5">•</span>
                                                            <span>{suggestion}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>

                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </motion.div>
                        )}

                        {/* Schema Options */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65, duration: 0.5 }}
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
                                        <BarChart3 className="w-6 h-6 text-primary" />
                                        Schema Markup
                                    </CardTitle>
                                    <CardDescription>AI recommends the best structured data for this article</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 relative z-10">
                                    {/* Schema Type Selection */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-white">Recommended Schema Types</label>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {schemaRecommendations.length > 0 ? schemaRecommendations.map((schema, idx) => (
                                                <motion.div
                                                    key={schema.type}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.7 + (idx * 0.05), duration: 0.3 }}
                                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${schema.recommended
                                                        ? "bg-gradient-to-br from-primary/[0.15] to-success/[0.05] border-primary/30 hover:border-primary/50"
                                                        : "bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 opacity-60 hover:opacity-80"
                                                        }`}
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`w-5 h-5 rounded border flex items-center justify-center ${schema.recommended ? "bg-primary border-primary" : "border-white/20"
                                                                }`}
                                                        >
                                                            {schema.recommended && <CheckCircle2 className="w-3.5 h-3.5 text-background" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-semibold text-sm">{schema.type}</p>
                                                            <p className="text-xs text-foreground-muted">{schema.reason}</p>
                                                        </div>
                                                    </div>
                                                    {schema.recommended && (
                                                        <span className="text-xs px-2 py-1 rounded-md bg-success/20 text-success font-bold border border-success/30">AI Pick</span>
                                                    )}
                                                </motion.div>
                                            )) : (
                                                [
                                                    { type: "Article", recommended: true, reason: "Standard for blog posts" },
                                                    { type: "HowTo", recommended: true, reason: "Content includes step-by-step guide" },
                                                    { type: "FAQPage", recommended: false, reason: "Add FAQ section to enable" },
                                                    { type: "Organization", recommended: true, reason: "Publisher info (auto-included)" },
                                                    { type: "BreadcrumbList", recommended: true, reason: "Navigation path" },
                                                    { type: "WebPage", recommended: false, reason: "Alternative to Article" },
                                                ].map((schema, idx) => (
                                                    <motion.div
                                                        key={schema.type}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.7 + (idx * 0.05), duration: 0.3 }}
                                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${schema.recommended
                                                            ? "bg-gradient-to-br from-primary/[0.15] to-success/[0.05] border-primary/30 hover:border-primary/50"
                                                            : "bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 opacity-60 hover:opacity-80"
                                                            }`}
                                                        whileHover={{ scale: 1.02 }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`w-5 h-5 rounded border flex items-center justify-center ${schema.recommended ? "bg-primary border-primary" : "border-white/20"
                                                                    }`}
                                                            >
                                                                {schema.recommended && <CheckCircle2 className="w-3.5 h-3.5 text-background" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-semibold text-sm">{schema.type}</p>
                                                                <p className="text-xs text-foreground-muted">{schema.reason}</p>
                                                            </div>
                                                        </div>
                                                        {schema.recommended && (
                                                            <span className="text-xs px-2 py-1 rounded-md bg-success/20 text-success font-bold border border-success/30">AI Pick</span>
                                                        )}
                                                    </motion.div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Generated Schema Preview */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-white">Generated JSON-LD</label>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleCopyJsonLD}
                                                className="text-xs text-primary hover:text-info transition-colors flex items-center gap-1 font-semibold"
                                            >
                                                <Copy className="w-3 h-3" />
                                                Copy to clipboard
                                            </motion.button>
                                        </div>
                                        <div className="relative group/code">
                                            <pre className="p-4 rounded-xl bg-gradient-to-br from-black/40 to-black/20 border border-white/10 overflow-x-auto text-xs text-primary/80 font-mono max-h-64 overflow-y-auto">
                                                {jsonLD || `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "${articleTitle || 'Your Article Title'}",
      "author": {
        "@type": "Person",
        "name": "Stephen Ten",
        "url": "https://stepten.io/about"
      },
      "datePublished": "${new Date().toISOString().split('T')[0]}",
      "dateModified": "${new Date().toISOString().split('T')[0]}"
    },
    {
      "@type": "Organization",
      "name": "StepTen.io",
      "logo": "https://stepten.io/logo.png",
      "url": "https://stepten.io"
    }
  ]
}`}
                                            </pre>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={handleCopyJsonLD}
                                                    className="p-2 bg-primary/20 hover:bg-primary/30 rounded-lg border border-primary/30 transition-colors"
                                                >
                                                    <Copy className="w-4 h-4 text-primary" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SEO Settings Note */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.2 }}
                                        className="p-3 rounded-lg bg-info/10 border border-info/30"
                                    >
                                        <p className="text-sm text-info flex items-center gap-2">
                                            <Settings className="w-4 h-4" />
                                            Organization schema pulls from SEO Settings. Configure in Admin → SEO Settings.
                                        </p>
                                    </motion.div>
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* Voice Feedback */}
                        <VoiceFeedback
                            title="Feedback on SEO"
                            description="Record your feedback to adjust meta tags, schema, or optimization"
                        />
                    </>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center justify-between pt-4 border-t border-white/10"
                >
                    <Link href="/admin/seo/articles/new/step-5-humanize">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all">
                            <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
                            Back to Step 5
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="secondary"
                                className="bg-gradient-to-br from-white/5 to-white/[0.02] text-white hover:from-white/10 hover:to-white/5 border border-white/10"
                                onClick={handleSaveProgress}
                                disabled={isSaving || !isComplete}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Progress"
                                )}
                            </Button>
                        </motion.div>
                        <Link href="/admin/seo/articles/new/step-7-styling">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                    disabled={!isComplete}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Continue to Styling
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
                        </Link>
                    </div>
                </motion.div>
            </div>
        </StepErrorBoundary>
    );
}
