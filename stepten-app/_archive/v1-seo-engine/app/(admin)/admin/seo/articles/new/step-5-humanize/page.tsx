"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Sparkles,
    AlertTriangle,
    Heart,
    Anchor,
    Wrench,
    Music,
    Zap,
    RefreshCw,
    Loader2,
    ArrowRight,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Check,
    X
} from "lucide-react";
import { seoStorage } from "@/lib/seo-storage";
import { validateStepAccess } from "@/lib/seo-step-validator";
import { StepErrorBoundary } from "@/components/seo/StepErrorBoundary";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { versionHistory } from "@/lib/seo-version-history";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { handleError, handleSuccess } from "@/lib/error-handler";
import type { HumanizationChange } from "@/lib/seo-types";
import { EngagingLoadingState, HUMANIZE_STAGES } from "@/components/seo/EngagingLoadingState";

// Use the global type
type SentenceChange = HumanizationChange;

export default function Step5HumanizePage() {
    const router = useRouter();
    const [isHumanizing, setIsHumanizing] = useState(false);
    const [humanized, setHumanized] = useState(false);
    const [originalArticle, setOriginalArticle] = useState("");
    const [changes, setChanges] = useState<SentenceChange[]>([]);
    const [changeSummary, setChangeSummary] = useState<any[]>([]);
    const [aiDetection, setAiDetection] = useState<any>(null);
    const [showingVersion, setShowingVersion] = useState<"original" | "changes" | "final">("original");
    useDraftAutosave();
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const validation = validateStepAccess(5);
        if (!validation.canAccess) {
            handleError(new Error(validation.reason), "Step Access");
            router.push(validation.redirectTo || "/admin/seo/articles/new/step-4-writing");
            return;
        }

        // Load Step 4 data
        const step4Data = seoStorage.getArticleData().step4;

        if (!step4Data) {
            handleError(new Error("No article content found. Please write an article in Step 4 first."), "Missing Content");
            router.push("/admin/seo/articles/new/step-4-writing");
            return;
        }

        // Use revised if available, otherwise original
        const articleToHumanize = step4Data.revised || step4Data.original;

        if (!articleToHumanize) {
            handleError(new Error("No article content found. Please write an article in Step 4 first."), "Missing Content");
            router.push("/admin/seo/articles/new/step-4-writing");
            return;
        }

        setOriginalArticle(articleToHumanize);

        // Load AI detection data if available
        if (step4Data.analysis?.aiDetection) {
            setAiDetection(step4Data.analysis.aiDetection);
        } else {
            console.warn("AI detection data not found - humanization will use general improvements");
        }

        // Check if already humanized
        const step5Data = seoStorage.getArticleData().step5;
        if (step5Data?.changes) {
            setChanges(step5Data.changes);
            setChangeSummary(step5Data.changeSummary || []);
            setHumanized(true);
        }
    }, [router]);

    useEffect(() => {
        setHistory(versionHistory.getHistory().filter((item) => item.stepNumber === 5));
    }, []);

    const handleHumanize = async () => {
        setIsHumanizing(true);

        try {
            const response = await fetch("/api/seo/humanize-article", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    article: originalArticle,
                    aiDetection,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
                throw new Error(errorData.error || "Humanization failed");
            }

            const data = await response.json();
            if (!data.success) throw new Error(data.error || "Humanization failed");

            setChanges(data.changes || []);
            setChangeSummary(data.changeSummary || []);
            setHumanized(true);
            setShowingVersion("changes");

            // Save to localStorage
            saveToStorage(data.changes, data.changeSummary);

            console.log("Humanization complete!");
        } catch (error: any) {
            console.error("Humanization error:", error);
            alert(`Failed to humanize: ${error.message}\n\nPlease try again or go back to Step 4 to re-analyze the article.`);
        } finally {
            setIsHumanizing(false);
        }
    };

    const handleAcceptChange = (id: string) => {
        setChanges(prev => prev.map(change =>
            change.id === id ? { ...change, status: 'accepted' } : change
        ));
    };

    const handleRejectChange = (id: string) => {
        setChanges(prev => prev.map(change =>
            change.id === id ? { ...change, status: 'rejected' } : change
        ));
    };

    const handleAcceptAll = () => {
        setChanges(prev => prev.map(change => ({ ...change, status: 'accepted' })));
    };

    const handleRejectAll = () => {
        setChanges(prev => prev.map(change => ({ ...change, status: 'rejected' })));
    };

    const handleAcceptModifications = () => {
        setChanges(prev => prev.map(change =>
            change.type === 'modification' ? { ...change, status: 'accepted' } : change
        ));
    };

    const handleAcceptAdditions = () => {
        setChanges(prev => prev.map(change =>
            change.type === 'addition' ? { ...change, status: 'accepted' } : change
        ));
    };

    const handleRejectDeletions = () => {
        setChanges(prev => prev.map(change =>
            change.type === 'deletion' ? { ...change, status: 'rejected' } : change
        ));
    };

    const handleRehumanizeSentence = async (id: string) => {
        const change = changes.find(c => c.id === id);
        if (!change) return;

        // Store original state to restore on error
        const originalChange = { ...change };

        // Mark as rehumanizing
        setChanges(prev => prev.map(c =>
            c.id === id ? { ...c, isRehumanizing: true } : c
        ));

        try {
            const response = await fetch("/api/seo/humanize-article", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sentence: change.original,
                    sentenceId: id,
                    aiDetection,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to re-humanize sentence");
            }

            const data = await response.json();
            if (!data.success) throw new Error(data.error || "Re-humanization failed");

            // Update the change with new humanized version
            setChanges(prev => prev.map(c =>
                c.id === id ? {
                    ...c,
                    humanized: data.humanized,
                    type: c.original !== data.humanized ? 'modification' : 'unchanged',
                    status: 'accepted',
                    isRehumanizing: false
                } : c
            ));

        } catch (error: any) {
            console.error("Re-humanization error:", error);
            alert(`Failed to re-humanize sentence: ${error.message || 'Unknown error'}. Keeping previous version.`);

            // Restore original state (don't modify the change)
            setChanges(prev => prev.map(c =>
                c.id === id ? { ...originalChange, isRehumanizing: false } : c
            ));
        }
    };

    const buildFinalArticle = (changesOverride?: SentenceChange[]): string => {
        const activeChanges = changesOverride || changes;
        return activeChanges.map(change => {
            const content = change.status === 'accepted'
                ? (change.humanized || change.original)
                : change.original;
            const separator = change.separator ?? ' ';
            return content ? `${content}${separator}` : '';
        }).join('').trim();
    };

    const saveToStorage = (changesData?: SentenceChange[], summaryData?: any[]) => {
        const finalArticle = buildFinalArticle(changesData || changes);
        const humanScore = typeof aiDetection?.score === "number" ? aiDetection.score : undefined;

        seoStorage.saveArticleData({
            step5: {
                original: originalArticle,
                humanized: finalArticle,
                changes: changesData || changes,
                humanScore,
                changeSummary: summaryData || changeSummary,
                timestamp: new Date().toISOString(),
            },
            currentStep: 5,
        });
        versionHistory.saveSnapshot("Humanization saved", {
            step5: {
                original: originalArticle,
                humanized: finalArticle,
                changes: changesData || changes,
                humanScore,
                changeSummary: summaryData || changeSummary,
                timestamp: new Date().toISOString(),
            },
            currentStep: 5,
        });
        setHistory(versionHistory.getHistory().filter((item) => item.stepNumber === 5));
    };

    const getChangeIcon = (type: string) => {
        switch (type) {
            case "emotion": return <Heart className="w-5 h-5 text-success" />;
            case "hook": return <Anchor className="w-5 h-5 text-primary" />;
            case "structure": return <Wrench className="w-5 h-5 text-info" />;
            case "tone": return <Music className="w-5 h-5 text-warning" />;
            case "ai_fix": return <Zap className="w-5 h-5 text-error" />;
            default: return <Sparkles className="w-5 h-5 text-primary" />;
        }
    };

    const getChangeColor = (type: string) => {
        switch (type) {
            case "emotion": return "bg-success/10 border-success/30";
            case "hook": return "bg-primary/10 border-primary/30";
            case "structure": return "bg-info/10 border-info/30";
            case "tone": return "bg-warning/10 border-warning/30";
            case "ai_fix": return "bg-error/10 border-error/30";
            default: return "bg-background-alt border-border";
        }
    };

    const renderSentenceChange = (change: SentenceChange, index: number) => {
        const isModified = change.type === 'modification';
        const isAccepted = change.status === 'accepted';
        const isRejected = change.status === 'rejected';

        if (change.type === 'unchanged') {
            return (
                <div key={change.id} className="mb-4 p-3 rounded-lg bg-background-alt/50 border border-border/50">
                    <div
                        className="text-foreground leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(change.original) }}
                    />
                </div>
            );
        }

        return (
            <div
                key={change.id}
                className={`mb-6 p-4 rounded-lg border-2 transition-all ${isAccepted
                    ? 'bg-success/5 border-success/30'
                    : isRejected
                        ? 'bg-background-alt/50 border-border/30 opacity-60'
                        : 'bg-warning/5 border-warning/30'
                    }`}
            >
                {/* Change Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                            Change #{index + 1}
                        </span>
                        {isAccepted && (
                            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" /> Accepted
                            </span>
                        )}
                        {isRejected && (
                            <span className="text-xs bg-error/20 text-error px-2 py-1 rounded-full flex items-center gap-1">
                                <X className="w-3 h-3" /> Rejected
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {!isRejected && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10"
                                onClick={() => handleRehumanizeSentence(change.id)}
                                disabled={change.isRehumanizing}
                            >
                                {change.isRehumanizing ? (
                                    <>
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        Re-humanizing...
                                    </>
                                ) : (
                                    <>
                                        <RotateCcw className="w-3 h-3 mr-1" />
                                        Re-humanize This
                                    </>
                                )}
                            </Button>
                        )}
                        {isAccepted ? (
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-error/30 text-error hover:bg-error/10"
                                onClick={() => handleRejectChange(change.id)}
                            >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-success/30 text-success hover:bg-success/10"
                                onClick={() => handleAcceptChange(change.id)}
                            >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Accept
                            </Button>
                        )}
                    </div>
                </div>

                {/* Original Sentence (if rejected or showing change) */}
                {(isRejected || isModified) && change.original && (
                    <div className="mb-3">
                        <p className="text-xs font-medium text-error mb-1 flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-error"></span>
                            Original:
                        </p>
                        <div
                            className={`p-3 rounded bg-error/10 border border-error/30 ${isRejected ? '' : 'line-through opacity-60'
                                }`}
                        >
                            <div
                                className="text-foreground leading-relaxed prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(change.original) }}
                            />
                        </div>
                    </div>
                )}

                {/* Humanized Sentence */}
                {isModified && change.humanized && !isRejected && (
                    <div>
                        <p className="text-xs font-medium text-success mb-1 flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                            Humanized:
                        </p>
                        <div className="p-3 rounded bg-success/10 border border-success/30 border-b-2">
                            <div
                                className="text-foreground leading-relaxed prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(change.humanized) }}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const formatHTMLForDisplay = (html: string): string => {
        if (!html) return '';

        // If already formatted with proper tags, return as-is
        if (html.includes('<h1>') || html.includes('<h2>')) {
            return html;
        }

        // Convert markdown to HTML
        let formatted = html.trim();

        // Headers
        formatted = formatted.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        formatted = formatted.replace(/^## (.*$)/gim, '<h2 class="text-primary">$1</h2>');
        formatted = formatted.replace(/^### (.*$)/gim, '<h3 class="text-info">$1</h3>');
        formatted = formatted.replace(/^#### (.*$)/gim, '<h4>$1</h4>');

        // Bold and italic
        formatted = formatted.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Links
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="nofollow">$1</a>');

        // Lists
        const lines = formatted.split('\n');
        const processed: string[] = [];
        let inList = false;
        let listType = '';

        for (const line of lines) {
            const trimmed = line.trim();

            if (trimmed.match(/^[-*•] /)) {
                if (!inList || listType !== 'ul') {
                    if (inList) processed.push(listType === 'ol' ? '</ol>' : '</ul>');
                    processed.push('<ul class="list-disc pl-6 space-y-2 my-4">');
                    inList = true;
                    listType = 'ul';
                }
                processed.push('<li>' + trimmed.replace(/^[-*•] /, '') + '</li>');
            } else if (trimmed.match(/^\d+\. /)) {
                if (!inList || listType !== 'ol') {
                    if (inList) processed.push(listType === 'ul' ? '</ul>' : '</ol>');
                    processed.push('<ol class="list-decimal pl-6 space-y-2 my-4">');
                    inList = true;
                    listType = 'ol';
                }
                processed.push('<li>' + trimmed.replace(/^\d+\. /, '') + '</li>');
            } else {
                if (inList) {
                    processed.push(listType === 'ul' ? '</ul>' : '</ol>');
                    inList = false;
                    listType = '';
                }

                if (trimmed.startsWith('<') || !trimmed) {
                    processed.push(line);
                } else if (!trimmed.startsWith('<h')) {
                    processed.push('<p class="mb-4 leading-relaxed">' + trimmed + '</p>');
                } else {
                    processed.push(line);
                }
            }
        }

        if (inList) {
            processed.push(listType === 'ul' ? '</ul>' : '</ol>');
        }

        return processed.join('\n');
    };

    const modifiedChangesCount = changes.filter(c => c.type === 'modification').length;
    const acceptedChangesCount = changes.filter(c => c.status === 'accepted' && c.type === 'modification').length;
    const rejectedChangesCount = changes.filter(c => c.status === 'rejected' && c.type === 'modification').length;

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
                            <span className="relative z-10">5</span>
                        </motion.div>
                        <div className="h-2 flex-1 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-full overflow-hidden border border-white/10 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary via-info to-primary rounded-full relative"
                                initial={{ width: 0 }}
                                animate={{ width: "62.5%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                        </div>
                        <span className="text-sm text-foreground-muted font-semibold">Step 5 of 8</span>
                    </div>

                    {/* Title */}
                    <div>
                        <Link href="/admin/seo/articles/new/step-4-writing" className="text-sm text-primary hover:text-info transition-colors mb-2 inline-flex items-center gap-1 group">
                            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to Step 4
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
                            Humanization with Grok
                        </h1>
                        <p className="text-foreground-muted text-lg">
                            Add emotion, personality, and authentic voice to pass AI detection
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
                            <CardDescription>Restore a previous humanization state</CardDescription>
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

                {/* AI Detection Summary */}
                {aiDetection && !humanized && (
                    <Card className="border-warning/30 bg-warning/5">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-warning" /> AI Detection Issues to Fix
                            </CardTitle>
                            <CardDescription>Grok will address these specific patterns</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-foreground-muted">Current Human Likelihood</p>
                                    <p className="text-2xl font-bold text-foreground">{aiDetection.humanLikelihood || "Unknown"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-foreground-muted">AI Detection Score</p>
                                    <p className="text-2xl font-bold text-foreground">{aiDetection.score}/100</p>
                                </div>
                            </div>

                            {aiDetection.aiTells && aiDetection.aiTells.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-foreground mb-2">Patterns to Fix:</p>
                                    <div className="space-y-2">
                                        {aiDetection.aiTells.slice(0, 5).map((tell: any, i: number) => (
                                            <div key={i} className="p-2 rounded bg-error/10 border border-error/30">
                                                <p className="text-xs font-medium text-error">
                                                    {typeof tell === 'string' ? tell : tell.pattern}
                                                </p>
                                                {tell.fix && (
                                                    <p className="text-xs text-foreground-muted mt-1">→ {tell.fix}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Humanize Button */}
                {!humanized && (
                    <Card className="border-success/30 bg-success/5">
                        <CardContent className="py-12 text-center">
                            {isHumanizing ? (
                                <EngagingLoadingState
                                    stepName="Humanization"
                                    stages={HUMANIZE_STAGES}
                                    estimatedSeconds={60}
                                />
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-success" />
                                    </div>
                                    <div>
                                        <p className="text-foreground font-medium">Ready to Humanize</p>
                                        <p className="text-sm text-foreground-muted mt-1">
                                            Grok will transform your article to pass AI detection
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleHumanize}
                                        className="bg-success text-success-foreground hover:bg-success/90 glow-sm"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Humanize with Grok
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Results */}
                {humanized && (
                    <>
                        {/* Statistics Card */}
                        <Card className="border-primary/30 bg-primary/5">
                            <CardContent className="py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-xs text-foreground-muted uppercase tracking-wider">Total Changes</p>
                                            <p className="text-2xl font-bold text-primary">{modifiedChangesCount}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-foreground-muted uppercase tracking-wider">Accepted</p>
                                            <p className="text-2xl font-bold text-success">{acceptedChangesCount}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-foreground-muted uppercase tracking-wider">Rejected</p>
                                            <p className="text-2xl font-bold text-error">{rejectedChangesCount}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleAcceptAll}
                                            size="sm"
                                            className="bg-success text-success-foreground hover:bg-success/90"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            Accept All
                                        </Button>
                                        <Button
                                            onClick={handleRejectAll}
                                            size="sm"
                                            variant="outline"
                                            className="border-error text-error hover:bg-error/10"
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject All
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={handleAcceptModifications}
                                        size="sm"
                                        variant="outline"
                                        className="border-success/40 text-success hover:bg-success/10"
                                    >
                                        Accept Modifications
                                    </Button>
                                    <Button
                                        onClick={handleAcceptAdditions}
                                        size="sm"
                                        variant="outline"
                                        className="border-primary/40 text-primary hover:bg-primary/10"
                                    >
                                        Accept Additions
                                    </Button>
                                    <Button
                                        onClick={handleRejectDeletions}
                                        size="sm"
                                        variant="outline"
                                        className="border-error/40 text-error hover:bg-error/10"
                                    >
                                        Reject Deletions
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Version Toggle */}
                        <Card className="border-border bg-background">
                            <CardContent className="py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">View Mode</p>
                                        <p className="text-xs text-foreground-muted">Switch between different views</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => setShowingVersion("original")}
                                            variant={showingVersion === "original" ? "default" : "outline"}
                                            size="sm"
                                        >
                                            Original
                                        </Button>
                                        <Button
                                            onClick={() => setShowingVersion("changes")}
                                            variant={showingVersion === "changes" ? "default" : "outline"}
                                            size="sm"
                                            className={showingVersion === "changes" ? "bg-primary text-primary-foreground" : ""}
                                        >
                                            Review Changes
                                        </Button>
                                        <Button
                                            onClick={() => setShowingVersion("final")}
                                            variant={showingVersion === "final" ? "default" : "outline"}
                                            size="sm"
                                            className={showingVersion === "final" ? "bg-success text-success-foreground" : ""}
                                        >
                                            <Sparkles className="w-4 h-4 mr-1" />
                                            Final Article
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Change Summary */}
                        {changeSummary.length > 0 && showingVersion !== "changes" && (
                            <Card className="border-success/30 bg-success/5">
                                <CardHeader>
                                    <CardTitle className="text-success flex items-center gap-2">
                                        <Sparkles className="w-6 h-6" /> Humanization Changes
                                    </CardTitle>
                                    <CardDescription>What Grok improved in your article</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {changeSummary.map((change, i) => (
                                            <div key={i} className={`p-3 rounded-lg border ${getChangeColor(change.type)}`}>
                                                <div className="flex items-start gap-2">
                                                    {getChangeIcon(change.type)}
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-foreground capitalize">
                                                            {change.type.replace('_', ' ')}
                                                        </p>
                                                        <p className="text-sm text-foreground-muted mt-1">{change.description}</p>
                                                        {change.example && (
                                                            <p className="text-xs text-foreground-muted mt-1 italic">
                                                                Example: &quot;{change.example}&quot;
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Article Display */}
                        <Card className="border-border bg-background">
                            <CardHeader>
                                <CardTitle className="text-foreground flex items-center gap-2">
                                    {showingVersion === "original" && "Original Article"}
                                    {showingVersion === "changes" && "Review Changes"}
                                    {showingVersion === "final" && (
                                        <>
                                            <Sparkles className="w-6 h-6 text-success" />
                                            Final Humanized Article
                                        </>
                                    )}
                                </CardTitle>
                                {showingVersion === "changes" && (
                                    <CardDescription>
                                        <span className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1">
                                                <span className="inline-block w-3 h-3 rounded-full bg-error"></span> Original
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="inline-block w-3 h-3 rounded-full bg-success"></span> Humanized
                                            </span>
                                        </span>
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                {showingVersion === "original" && (
                                    <div
                                        className="prose prose-lg max-w-none
                                        prose-headings:text-foreground prose-headings:font-bold
                                        prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-6
                                        prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-5 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
                                        prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
                                        prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
                                        prose-li:text-foreground prose-li:my-1
                                        prose-a:text-primary prose-a:font-semibold prose-a:underline prose-a:decoration-primary/50 hover:prose-a:decoration-primary prose-a:transition-all
                                        prose-strong:text-foreground prose-strong:font-bold
                                        prose-em:text-foreground prose-em:italic
                                        prose-ul:my-3 prose-ol:my-3
                                        prose-code:text-foreground prose-code:bg-background-alt prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                                        dangerouslySetInnerHTML={{ __html: formatHTMLForDisplay(originalArticle) }}
                                    />
                                )}

                                {showingVersion === "changes" && (
                                    <div className="space-y-4">
                                        {changes.map((change, index) => renderSentenceChange(change, index))}
                                    </div>
                                )}

                                {showingVersion === "final" && (
                                    <div
                                        className="prose prose-lg max-w-none
                                        prose-headings:text-foreground prose-headings:font-bold
                                        prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-6
                                        prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-5 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
                                        prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
                                        prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
                                        prose-li:text-foreground prose-li:my-1
                                        prose-a:text-primary prose-a:font-semibold prose-a:underline prose-a:decoration-primary/50 hover:prose-a:decoration-primary prose-a:transition-all
                                        prose-strong:text-foreground prose-strong:font-bold
                                        prose-em:text-foreground prose-em:italic
                                        prose-ul:my-3 prose-ol:my-3
                                        prose-code:text-foreground prose-code:bg-background-alt prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(formatHTMLForDisplay(buildFinalArticle())) }}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Link href="/admin/seo/articles/new/step-4-writing">
                        <Button variant="outline" className="border-border text-foreground hover:bg-background-alt">
                            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                            Back to Step 4
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            className="bg-background-alt text-foreground hover:bg-background-muted"
                            disabled={!humanized}
                            onClick={() => {
                                saveToStorage();
                                alert("Humanized article saved!");
                            }}
                        >
                            Save Changes
                        </Button>
                        <Link href="/admin/seo/articles/new/step-6-optimize">
                            <Button
                                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-sm relative overflow-hidden"
                                disabled={!humanized}
                                onClick={() => saveToStorage()}
                            >
                                Continue to SEO Optimization
                                <ArrowRight className="w-4 h-4 ml-2" />
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
                        </Link>
                    </div>
                </div>
            </div>
        </StepErrorBoundary>
    );
}
