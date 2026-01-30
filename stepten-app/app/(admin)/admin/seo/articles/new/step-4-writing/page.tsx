"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Sparkles,
    PenTool,
    FileText,
    Edit,
    Check,
    X,
    BarChart3,
    AlertTriangle,
    Target,
    CheckCircle2,
    Loader2,
    ArrowRight,
    RefreshCw
} from "lucide-react";
import { VoiceFeedback } from "@/components/seo/VoiceFeedback";
import { seoStorage } from "@/lib/seo-storage";
import { validateStepAccess } from "@/lib/seo-step-validator";
import { StepErrorBoundary } from "@/components/seo/StepErrorBoundary";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { versionHistory } from "@/lib/seo-version-history";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { handleError, handleSuccess } from "@/lib/error-handler";
import { FORMAT_DEBOUNCE_MS } from "@/lib/constants";
import type { ArticleAnalysis, ChangeAnalysis } from "@/lib/seo-types";
import { EngagingLoadingState, WRITING_STAGES } from "@/components/seo/EngagingLoadingState";

export default function Step4WritingPage() {
    const router = useRouter();
    const [isWriting, setIsWriting] = useState(false);
    const [articleWritten, setArticleWritten] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isRevising, setIsRevising] = useState(false);

    // Article states
    const [article, setArticle] = useState("");
    const [revisedArticle, setRevisedArticle] = useState("");
    const [hasRevisions, setHasRevisions] = useState(false);

    // Analysis (properly typed)
    const [analysis, setAnalysis] = useState<ArticleAnalysis | null>(null);
    const [changeAnalysis, setChangeAnalysis] = useState<ChangeAnalysis | null>(null);

    // UI state
    const [showingVersion, setShowingVersion] = useState<"original" | "revised">("original");
    const [expandedSections, setExpandedSections] = useState(new Set(["analysis"]));
    const [isFormatted, setIsFormatted] = useState(false); // Will be set to true after formatting
    const [formattedArticle, setFormattedArticle] = useState("");
    const [isFormatting, setIsFormatting] = useState(false);
    const formatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    useDraftAutosave();
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const validation = validateStepAccess(4);
        if (!validation.canAccess) {
            handleError(new Error(validation.reason), "Step Access");
            router.push(validation.redirectTo || "/admin/seo/articles/new/step-1-idea");
            return;
        }

        // Load existing article if it exists
        const step4Data = seoStorage.getArticleData().step4;
        if (step4Data && step4Data.original) {
            setArticle(step4Data.original);
            setArticleWritten(true);

            if (step4Data.revised) {
                setRevisedArticle(step4Data.revised);
                setHasRevisions(true);
            }

            if (step4Data.analysis) {
                setAnalysis(step4Data.analysis);
            }

            console.log("Loaded existing article from localStorage");
        }
    }, [router]);

    useEffect(() => {
        setHistory(versionHistory.getHistory().filter((item) => item.stepNumber === 4));
    }, []);

    // Auto-format whenever article or showingVersion changes (with proper cleanup to prevent memory leaks)
    useEffect(() => {
        if (formatTimeoutRef.current) {
            clearTimeout(formatTimeoutRef.current);
        }

        let cancelled = false;

        if (articleWritten && (article || revisedArticle)) {
            const textToFormat = showingVersion === "revised" && hasRevisions ? revisedArticle : article;
            if (textToFormat) {
                formatTimeoutRef.current = setTimeout(() => {
                    if (!cancelled) {
                        formatArticleForDisplay(textToFormat);
                    }
                }, FORMAT_DEBOUNCE_MS);
            }
        }

        return () => {
            cancelled = true;
            if (formatTimeoutRef.current) {
                clearTimeout(formatTimeoutRef.current);
            }
        };
    }, [article, revisedArticle, showingVersion, hasRevisions, articleWritten]);

    const handleWriteArticle = async () => {
        setIsWriting(true);

        try {
            const step1 = seoStorage.getStep1();
            const step2 = seoStorage.getStep2();
            const step3 = seoStorage.getArticleData().step3;

            const response = await fetch("/api/seo/write-article", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    framework: step3,
                    research: step2,
                    idea: step1?.ideaText,
                }),
            });

            if (!response.ok) throw new Error("Article writing failed");

            const data = await response.json();
            if (!data.success) throw new Error(data.error || "Writing failed");

            setArticle(data.article);
            setArticleWritten(true);
            setIsWriting(false);

            // IMMEDIATELY save to localStorage
            seoStorage.saveArticleData({
                step4: {
                    original: data.article,
                    wordCount: data.wordCount,
                    timestamp: new Date().toISOString(),
                },
                currentStep: 4,
            });
            versionHistory.saveSnapshot("Article generated", {
                step4: {
                    original: data.article,
                    wordCount: data.wordCount,
                    timestamp: new Date().toISOString(),
                },
                currentStep: 4,
            });
            setHistory(versionHistory.getHistory().filter((item) => item.stepNumber === 4));

            console.log("Article saved to localStorage:", data.wordCount, "words");

            // Auto-format for better display
            setTimeout(() => formatArticleForDisplay(data.article), 100);

            // Auto-analyze
            await analyzeArticle(data.article, step3);
        } catch (error: any) {
            handleError(error, "Write Article");
            setIsWriting(false);
        }
    };

    const analyzeArticle = async (articleContent: string, framework: any) => {
        setIsAnalyzing(true);

        try {
            const response = await fetch("/api/seo/analyze-article", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    article: articleContent,
                    framework,
                    focusKeyword: framework.metadata?.focusKeyword,
                }),
            });

            if (!response.ok) throw new Error("Analysis failed");

            const data = await response.json();
            if (!data.success) throw new Error(data.error || "Analysis failed");

            setAnalysis(data.analysis);

            // IMMEDIATELY save analysis to localStorage
            const currentStep4 = seoStorage.getArticleData().step4 || {};
            seoStorage.saveArticleData({
                step4: {
                    ...currentStep4,
                    analysis: data.analysis,
                    timestamp: new Date().toISOString(),
                },
                currentStep: 4,
            });

            console.log("Analysis saved to localStorage:", data.analysis);
        } catch (error: any) {
            console.error("Analysis error:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const formatArticleForDisplay = (articleText?: string) => {
        setIsFormatting(true);

        const textToFormat = articleText || currentArticle;
        if (!textToFormat) {
            console.error("formatArticleForDisplay: No text to format!");
            setIsFormatting(false);
            return;
        }
        let html = textToFormat.trim();
        console.log("Formatting article, length:", html.length, "Has HTML tags:", html.includes('<h1>') || html.includes('<h2>') || html.includes('<p>'));

        // If it's already HTML with proper tags, just use it (but remove H1)
        if (html.includes('<h1>') || html.includes('<h2>') || html.includes('<p>')) {
            // Remove H1 tags (title should be separate)
            html = html.replace(/<h1[^>]*>.*?<\/h1>/gi, '');
            console.log("Setting formatted HTML (already had tags), length:", html.length);
            setFormattedArticle(html);
            setIsFormatted(true);
            setIsFormatting(false);
            return;
        }

        // Convert markdown headers to HTML (skip H1, start from H2)
        html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>'); // Convert # to H2 instead of H1
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');

        // Convert markdown bold and italic
        html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');

        // Convert markdown links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="nofollow">$1</a>');

        // Handle lists
        const lines = html.split('\n');
        const processedLines: string[] = [];
        let inList = false;
        let listType = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Detect unordered list items
            if (line.match(/^[-*•] /)) {
                if (!inList || listType !== 'ul') {
                    if (inList && listType === 'ol') processedLines.push('</ol>');
                    processedLines.push('<ul>');
                    inList = true;
                    listType = 'ul';
                }
                processedLines.push('<li>' + line.replace(/^[-*•] /, '') + '</li>');
            }
            // Detect ordered list items
            else if (line.match(/^\d+\. /)) {
                if (!inList || listType !== 'ol') {
                    if (inList && listType === 'ul') processedLines.push('</ul>');
                    processedLines.push('<ol>');
                    inList = true;
                    listType = 'ol';
                }
                processedLines.push('<li>' + line.replace(/^\d+\. /, '') + '</li>');
            }
            // Regular line
            else {
                if (inList) {
                    processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
                    inList = false;
                    listType = '';
                }

                // Skip if already a tag or empty
                if (line.startsWith('<') || line.length === 0) {
                    processedLines.push(line);
                }
                // Wrap in paragraph if not already wrapped
                else if (!line.startsWith('<h') && !line.startsWith('<ul') && !line.startsWith('<ol')) {
                    processedLines.push('<p>' + line + '</p>');
                } else {
                    processedLines.push(line);
                }
            }
        }

        // Close any open lists
        if (inList) {
            processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        }

        html = processedLines.join('\n');

        // Clean up extra newlines
        html = html.replace(/\n{3,}/g, '\n\n');

        console.log("Setting formatted HTML (converted from markdown), length:", html.length);
        setFormattedArticle(html);
        setIsFormatted(true);
        setIsFormatting(false);
    };

    const handleFeedbackSubmit = async (feedback: string) => {
        setIsRevising(true);

        try {
            const step3 = seoStorage.getArticleData().step3;
            const currentArticle = hasRevisions ? revisedArticle : article;

            const response = await fetch("/api/seo/revise-article", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    article: currentArticle,
                    feedback,
                    framework: step3,
                }),
            });

            if (!response.ok) throw new Error("Revision failed");

            const data = await response.json();
            if (!data.success) throw new Error(data.error || "Revision failed");

            setRevisedArticle(data.revisedArticle);
            setChangeAnalysis(data.changeAnalysis);
            setHasRevisions(true);
            setShowingVersion("revised");
            setIsRevising(false);

            // IMMEDIATELY save revisions to localStorage
            const currentStep4 = seoStorage.getArticleData().step4 || {};
            seoStorage.saveArticleData({
                step4: {
                    ...currentStep4,
                    revised: data.revisedArticle,
                    changeAnalysis: data.changeAnalysis,
                    timestamp: new Date().toISOString(),
                },
                currentStep: 4,
            });
            versionHistory.saveSnapshot("Revisions applied", {
                step4: {
                    ...currentStep4,
                    revised: data.revisedArticle,
                    changeAnalysis: data.changeAnalysis,
                    timestamp: new Date().toISOString(),
                },
                currentStep: 4,
            });
            setHistory(versionHistory.getHistory().filter((item) => item.stepNumber === 4));

            console.log("Revisions saved to localStorage");
        } catch (error: any) {
            handleError(error, "Revise Article");
            setIsRevising(false);
        }
    };

    const acceptRevisions = () => {
        // Remove <mark> tags (with attributes support)
        const cleanedArticle = revisedArticle
            .replace(/<mark[^>]*>/gi, "")
            .replace(/<\/mark>/gi, "");
        setArticle(cleanedArticle);
        setRevisedArticle("");
        setHasRevisions(false);
        setShowingVersion("original");

        // Save accepted revisions to localStorage
        const currentStep4 = seoStorage.getArticleData().step4 || {};
        seoStorage.saveArticleData({
            step4: {
                ...currentStep4,
                original: cleanedArticle,
                revised: "",
                timestamp: new Date().toISOString(),
            }
        });
        versionHistory.saveSnapshot("Revisions accepted", {
            step4: {
                ...currentStep4,
                original: cleanedArticle,
                revised: "",
                timestamp: new Date().toISOString(),
            },
            currentStep: 4,
        });
        setHistory(versionHistory.getHistory().filter((item) => item.stepNumber === 4));

        handleSuccess("Revisions Accepted", "Your changes have been applied successfully.");
    };

    const rejectRevisions = () => {
        setRevisedArticle("");
        setChangeAnalysis(null);
        setHasRevisions(false);
        setShowingVersion("original");

        // Save rejection to localStorage (keep original article)
        const currentStep4 = seoStorage.getArticleData().step4 || {};
        seoStorage.saveArticleData({
            step4: {
                ...currentStep4,
                original: article, // Keep original
                revised: "",
                timestamp: new Date().toISOString(),
            }
        });
        versionHistory.saveSnapshot("Revisions rejected", {
            step4: {
                ...currentStep4,
                original: article,
                revised: "",
                timestamp: new Date().toISOString(),
            },
            currentStep: 4,
        });
        setHistory(versionHistory.getHistory().filter((item) => item.stepNumber === 4));

        handleSuccess("Revisions Rejected", "Reverted to original version.");
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            } else {
                next.add(section);
            }
            return next;
        });
    };

    const currentArticle = showingVersion === "revised" && hasRevisions
        ? revisedArticle
        : article;

    return (
        <StepErrorBoundary>
            <div className="space-y-8 max-w-6xl mx-auto">
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
                            <span className="relative z-10">4</span>
                        </motion.div>
                        <div className="h-2 flex-1 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-full overflow-hidden border border-white/10 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary via-info to-primary rounded-full relative"
                                initial={{ width: 0 }}
                                animate={{ width: "50%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                        </div>
                        <span className="text-sm text-foreground-muted font-semibold">Step 4 of 8</span>
                    </div>

                    {/* Title */}
                    <div>
                        <Link href="/admin/seo/articles/new/step-3-framework" className="text-sm text-primary hover:text-info transition-colors mb-2 inline-flex items-center gap-1 group">
                            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to Step 3
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
                            Article Writing & Analysis
                        </h1>
                        <p className="text-foreground-muted text-lg">
                            AI-powered writing with personality and comprehensive analysis
                        </p>
                    </div>
                </motion.div>

                {history.length > 0 && (
                    <Card className="border-border bg-background">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-warning" />
                                Version History
                            </CardTitle>
                            <CardDescription>Restore a previous draft state</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {history.slice(-5).reverse().map((item) => (
                                <div key={item.timestamp} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                                        <p className="text-xs text-foreground-muted">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            versionHistory.restoreVersion(item.timestamp);
                                            window.location.reload();
                                        }}
                                    >
                                        Restore
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Write Article Button */}
                {!articleWritten && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
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
                                {isWriting ? (
                                    <EngagingLoadingState
                                        stepName="Writing"
                                        stages={WRITING_STAGES}
                                        estimatedSeconds={90}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        <motion.div
                                            className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-info/10 flex items-center justify-center border-2 border-primary/30"
                                            whileHover={{ scale: 1.1, rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <PenTool className="w-8 h-8 text-primary" />
                                        </motion.div>
                                        <div>
                                            <p className="text-white font-semibold">Ready to Write</p>
                                            <p className="text-sm text-foreground-muted mt-1">
                                                Claude Sonnet 4 will write in your unique voice
                                            </p>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                onClick={handleWriteArticle}
                                                className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    <PenTool className="w-5 h-5" />
                                                    Write Article
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
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Article Content */}
                {articleWritten && (
                    <>
                        {/* Version Toggle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="group relative"
                        >
                            <motion.div
                                className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-info/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                whileHover={{ scale: 1.02 }}
                            />

                            <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 overflow-hidden">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <CardContent className="py-4 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-white flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4 text-primary" />
                                                Article Versions
                                            </p>
                                            <p className="text-xs text-foreground-muted">Switch between versions to compare</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    onClick={() => setShowingVersion("original")}
                                                    variant={showingVersion === "original" ? "default" : "outline"}
                                                    size="sm"
                                                    className={showingVersion === "original" ? "bg-primary text-background" : "border-white/10 text-white hover:bg-white/5"}
                                                >
                                                    Original
                                                </Button>
                                            </motion.div>
                                            {hasRevisions && (
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        onClick={() => setShowingVersion("revised")}
                                                        variant={showingVersion === "revised" ? "default" : "outline"}
                                                        size="sm"
                                                        className={showingVersion === "revised" ? "bg-gradient-to-r from-warning to-primary text-background" : "border-white/10 text-white hover:bg-white/5"}
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Revised
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Article Display */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
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

                                <CardHeader className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <FileText className="w-6 h-6 text-primary" />
                                            Article Content
                                            {showingVersion === "revised" && (
                                                <span className="text-xs bg-gradient-to-r from-warning/20 to-warning/10 text-warning px-2 py-1 rounded border border-warning/30">
                                                    Changes Highlighted
                                                </span>
                                            )}
                                            {isFormatted && (
                                                <span className="text-xs bg-gradient-to-r from-success/20 to-success/10 text-success px-2 py-1 rounded border border-success/30">
                                                    Formatted View
                                                </span>
                                            )}
                                        </CardTitle>
                                        {!isFormatted && (
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    onClick={() => formatArticleForDisplay()}
                                                    disabled={isFormatting}
                                                    className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                                    size="sm"
                                                >
                                                    {isFormatting ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Formatting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="w-4 h-4 mr-2" />
                                                            Format Article
                                                        </>
                                                    )}
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
                                        )}
                                        {isFormatted && (
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    onClick={() => {
                                                        setIsFormatted(false);
                                                        setFormattedArticle("");
                                                    }}
                                                    variant="outline"
                                                    className="border-white/10 text-white hover:bg-white/5"
                                                    size="sm"
                                                >
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    View Raw
                                                </Button>
                                            </motion.div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    {!isFormatted ? (
                                        // Raw text view
                                        <div className="bg-black/20 rounded-lg p-6 border border-white/5">
                                            <pre className="whitespace-pre-wrap text-foreground-muted font-mono text-sm leading-relaxed">
                                                {currentArticle}
                                            </pre>
                                        </div>
                                    ) : (
                                        // Formatted view with beautiful styling (sanitized for security)
                                        formattedArticle ? (
                                            <div
                                                className="article-content max-w-none"
                                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(formattedArticle) }}
                                            />
                                        ) : (
                                            <div className="article-content max-w-none p-4 border border-warning/30 bg-warning/5 rounded-lg">
                                                <p className="text-warning mb-2">⚠️ Formatting in progress...</p>
                                                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentArticle) }} />
                                            </div>
                                        )
                                    )}
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* Revision Actions */}
                        {hasRevisions && showingVersion === "revised" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="group relative"
                            >
                                <motion.div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-warning/20 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                    whileHover={{ scale: 1.02 }}
                                />

                                <Card className="relative bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/30 overflow-hidden">
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                    </div>

                                    <CardContent className="py-6 relative z-10">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="font-semibold text-white">Review Changes</p>
                                                <p className="text-sm text-foreground-muted mt-1">
                                                    {changeAnalysis?.specificChanges?.length || 0} sections modified based on your feedback
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        onClick={acceptRevisions}
                                                        className="bg-gradient-to-r from-success to-primary text-background hover:shadow-lg hover:shadow-success/50"
                                                    >
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Accept All Changes
                                                    </Button>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        onClick={rejectRevisions}
                                                        variant="outline"
                                                        className="border-error/30 text-error hover:bg-error/10"
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Reject & Revert
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Analysis */}
                        {analysis && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
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

                                    <CardHeader className="relative z-10">
                                        <button
                                            onClick={() => toggleSection("analysis")}
                                            className="w-full flex items-center justify-between text-left group/button"
                                        >
                                            <CardTitle className="text-white flex items-center gap-2 group-hover/button:text-primary transition-colors">
                                                <BarChart3 className="w-6 h-6 text-primary" />
                                                AI Analysis & Scoring (GPT-4o)
                                            </CardTitle>
                                            <span className="text-foreground-muted text-lg">{expandedSections.has("analysis") ? "−" : "+"}</span>
                                        </button>
                                    </CardHeader>
                                    {expandedSections.has("analysis") && (
                                        <CardContent className="space-y-6">
                                            {/* Overall Stats */}
                                            {analysis.stats && (
                                                <div className="grid gap-4 md:grid-cols-5">
                                                    <div className="p-3 rounded-lg bg-background-alt">
                                                        <p className="text-xs text-foreground-muted">Word Count</p>
                                                        <p className="text-2xl font-bold text-foreground">{analysis.stats.wordCount}</p>
                                                        <p className="text-xs text-foreground-muted mt-1">
                                                            Target: {analysis.stats.targetWordCount}
                                                            {analysis.stats.wordCountDifference !== 0 && (
                                                                <span className={analysis.stats.wordCountDifference > 0 ? "text-success" : "text-warning"}>
                                                                    {" "}({analysis.stats.wordCountDifference > 0 ? "+" : ""}{analysis.stats.wordCountDifference})
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-background-alt">
                                                        <p className="text-xs text-foreground-muted">Keyword Density</p>
                                                        <p className="text-2xl font-bold text-foreground">{analysis.stats.keywordDensity}</p>
                                                        <p className="text-xs text-foreground-muted mt-1">{analysis.stats.focusKeywordOccurrences}× occurrences</p>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-background-alt">
                                                        <p className="text-xs text-foreground-muted">Sentences</p>
                                                        <p className="text-2xl font-bold text-foreground">{analysis.stats.sentenceCount}</p>
                                                        <p className="text-xs text-foreground-muted mt-1">Avg: {analysis.stats.avgSentenceLength} words</p>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-background-alt">
                                                        <p className="text-xs text-foreground-muted">Links</p>
                                                        <p className="text-2xl font-bold text-foreground">{analysis.stats.linkCount}</p>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-background-alt">
                                                        <p className="text-xs text-foreground-muted">Overall Grade</p>
                                                        <p className="text-2xl font-bold text-foreground">{analysis.overallGrade || "N/A"}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Score Cards */}
                                            <div className="grid gap-4 md:grid-cols-3">
                                                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 space-y-2">
                                                    <p className="text-sm font-medium text-foreground-muted">Originality</p>
                                                    <p className="text-4xl font-bold text-primary">{analysis.originality?.score || 0}/100</p>
                                                    <p className="text-xs text-foreground-muted">{analysis.originality?.reasoning}</p>
                                                    {analysis.originality?.uniqueAngles?.length > 0 && (
                                                        <div className="mt-2">
                                                            <p className="text-xs font-semibold text-success"><Check className="w-3 h-3 inline" /> Unique Angles:</p>
                                                            <ul className="text-xs text-foreground-muted list-disc list-inside">
                                                                {analysis.originality.uniqueAngles.map((angle: string, i: number) => (
                                                                    <li key={i}>{angle}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {analysis.originality?.genericPatterns?.length > 0 && (
                                                        <div className="mt-2">
                                                            <p className="text-xs font-semibold text-warning"><AlertTriangle className="w-3 h-3 inline" /> Generic Patterns:</p>
                                                            <ul className="text-xs text-foreground-muted list-disc list-inside">
                                                                {analysis.originality.genericPatterns.map((pattern: string, i: number) => (
                                                                    <li key={i}>{pattern}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-4 rounded-lg bg-success/10 border border-success/30 space-y-2">
                                                    <p className="text-sm font-medium text-foreground-muted">Voice Quality</p>
                                                    <p className="text-4xl font-bold text-success">{analysis.voice?.score || 0}/100</p>
                                                    <p className="text-xs text-foreground-muted">{analysis.voice?.reasoning}</p>
                                                    {analysis.voice?.sentenceVariety && (
                                                        <p className="text-xs text-foreground-muted mt-1">
                                                            Sentence Variety: {analysis.voice.sentenceVariety}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="p-4 rounded-lg bg-info/10 border border-info/30 space-y-2">
                                                    <p className="text-sm font-medium text-foreground-muted">SEO Score</p>
                                                    <p className="text-4xl font-bold text-info">{analysis.seo?.score || 0}/100</p>
                                                    <p className="text-xs text-foreground-muted">{analysis.seo?.reasoning}</p>
                                                </div>
                                            </div>

                                            {/* SEO Details */}
                                            {analysis.seo && (
                                                <div className="p-4 rounded-lg bg-info/5 border border-info/20 space-y-3">
                                                    <p className="font-semibold text-foreground">SEO Analysis Details</p>

                                                    {analysis.seo.keywordPlacement && (
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground mb-1">Keyword Placement:</p>
                                                            <div className="grid gap-2 text-xs">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={analysis.seo.keywordPlacement.inH1 ? "text-success" : "text-error"}>
                                                                        {analysis.seo.keywordPlacement.inH1 ? <Check className="w-3 h-3 inline" /> : <X className="w-3 h-3 inline" />}
                                                                    </span>
                                                                    <span className="text-foreground-muted">In H1 Title</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={analysis.seo.keywordPlacement.inFirst100Words ? "text-success" : "text-error"}>
                                                                        {analysis.seo.keywordPlacement.inFirst100Words ? <Check className="w-3 h-3 inline" /> : <X className="w-3 h-3 inline" />}
                                                                    </span>
                                                                    <span className="text-foreground-muted">In First 100 Words</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-foreground-muted">
                                                                        Density: {analysis.seo.keywordPlacement.density} ({analysis.seo.keywordPlacement.assessment})
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {analysis.seo.semanticKeywords && (
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground mb-1">Semantic Keywords:</p>
                                                            {analysis.seo.semanticKeywords.found?.length > 0 && (
                                                                <div className="mb-2">
                                                                    <p className="text-xs text-success font-medium"><Check className="w-3 h-3 inline" /> Found in Article:</p>
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {analysis.seo.semanticKeywords.found.map((kw: string, i: number) => (
                                                                            <span key={i} className="text-xs px-2 py-0.5 rounded bg-success/20 text-success">
                                                                                {kw}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {analysis.seo.semanticKeywords.missing?.length > 0 && (
                                                                <div>
                                                                    <p className="text-xs text-warning font-medium"><AlertTriangle className="w-3 h-3 inline" /> Missing (Should Add):</p>
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {analysis.seo.semanticKeywords.missing.map((kw: string, i: number) => (
                                                                            <span key={i} className="text-xs px-2 py-0.5 rounded bg-warning/20 text-warning">
                                                                                {kw}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* AI Detection - Enhanced */}
                                            {analysis.aiDetection && (
                                                <div className="p-4 rounded-lg bg-background-alt border border-border space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-semibold text-foreground">AI Detection Resistance</p>
                                                        <div className="text-right">
                                                            <p className="text-3xl font-bold text-foreground">{analysis.aiDetection.score}/100</p>
                                                            <p className="text-xs text-foreground-muted">Human Likelihood: <span className="font-semibold">{analysis.aiDetection.humanLikelihood}</span></p>
                                                        </div>
                                                    </div>

                                                    {analysis.aiDetection.aiTells?.length > 0 && (
                                                        <div>
                                                            <p className="text-sm font-medium text-error mb-2"><AlertTriangle className="w-3 h-3 inline" /> AI Patterns Detected:</p>
                                                            <div className="space-y-2">
                                                                {analysis.aiDetection.aiTells.map((tell: any, i: number) => (
                                                                    <div key={i} className="p-2 rounded bg-error/10 border border-error/30">
                                                                        <p className="text-xs font-medium text-error">{tell.pattern || tell}</p>
                                                                        {tell.example && (
                                                                            <p className="text-xs text-foreground-muted mt-1 italic">&quot;{tell.example}&quot;</p>
                                                                        )}
                                                                        {tell.fix && (
                                                                            <p className="text-xs text-success mt-1">→ Fix: {tell.fix}</p>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {Array.isArray(analysis.aiDetection.humanStrengths) && analysis.aiDetection.humanStrengths.length > 0 && (
                                                        <div>
                                                            <p className="text-sm font-medium text-success mb-1"><Check className="w-3 h-3 inline" /> Human-Like Strengths:</p>
                                                            <ul className="list-disc list-inside text-xs text-foreground-muted space-y-1">
                                                                {analysis.aiDetection.humanStrengths.map((strength: string, i: number) => (
                                                                    <li key={i}>{strength}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {analysis.aiDetection.overallAssessment && (
                                                        <p className="text-xs text-foreground-muted italic border-t border-border pt-2">
                                                            {analysis.aiDetection.overallAssessment}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Top Improvements */}
                                            {analysis.topImprovements?.length > 0 && (
                                                <div>
                                                    <p className="font-semibold text-foreground mb-3"><Target className="w-4 h-4 inline" /> Prioritized Improvements</p>
                                                    <div className="space-y-3">
                                                        {analysis.topImprovements.map((improvement: any, i: number) => (
                                                            <div key={i} className="p-3 rounded-lg border border-border bg-background-alt">
                                                                <div className="flex items-start gap-2">
                                                                    <span className={`text-xs px-2 py-0.5 rounded ${improvement.priority === "High" ? "bg-error/20 text-error" :
                                                                        improvement.priority === "Medium" ? "bg-warning/20 text-warning" :
                                                                            "bg-info/20 text-info"
                                                                        }`}>
                                                                        {improvement.priority}
                                                                    </span>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-foreground">{improvement.issue || improvement}</p>
                                                                        {improvement.action && (
                                                                            <p className="text-xs text-foreground-muted mt-1">→ Action: {improvement.action}</p>
                                                                        )}
                                                                        {improvement.expectedImpact && (
                                                                            <p className="text-xs text-success mt-1"><Check className="w-3 h-3 inline" /> Impact: {improvement.expectedImpact}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    )}
                                </Card>
                            </motion.div>
                        )}

                        {/* Voice Feedback */}
                        {isRevising ? (
                            <Card className="border-border bg-background">
                                <CardContent className="py-8 text-center">
                                    <p className="text-foreground font-medium">Analyzing feedback and revising article...</p>
                                    <p className="text-sm text-foreground-muted mt-1">GPT-4o + Claude Sonnet 4</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <VoiceFeedback
                                title="Voice Feedback for Revisions (Optional)"
                                description="Record what you'd like changed in the article before humanization"
                                onFeedbackSubmit={handleFeedbackSubmit}
                            />
                        )}
                    </>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between pt-4 border-t border-white/10"
                >
                    <Link href="/admin/seo/articles/new/step-3-framework">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all">
                            <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
                            Back to Step 3
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="secondary"
                                className="bg-gradient-to-br from-white/5 to-white/[0.02] text-white hover:from-white/10 hover:to-white/5 border border-white/10"
                                onClick={() => {
                                    // Save current article state
                                    seoStorage.saveArticleData({
                                        step4: {
                                            original: article,
                                            revised: hasRevisions ? revisedArticle : undefined,
                                            analysis: analysis || undefined,
                                            wordCount: article.split(/\s+/).length,
                                            timestamp: new Date().toISOString(),
                                        },
                                        currentStep: 4,
                                    });
                                    handleSuccess("Article Saved", "Your progress has been saved.");
                                }}
                            >
                                Save Article
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                disabled={!articleWritten}
                                onClick={() => {
                                    // Save before continuing
                                    seoStorage.saveArticleData({
                                        step4: {
                                            original: article,
                                            revised: hasRevisions ? revisedArticle : undefined,
                                            analysis: analysis || undefined,
                                            wordCount: article.split(/\s+/).length,
                                            timestamp: new Date().toISOString(),
                                        },
                                        currentStep: 4,
                                    });
                                    router.push("/admin/seo/articles/new/step-5-humanize");
                                }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Continue to Humanization
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
                    </div>
                </motion.div>
            </div>
        </StepErrorBoundary>
    );
}
