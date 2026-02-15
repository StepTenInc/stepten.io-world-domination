"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
    Sparkles,
    Search,
    Target,
    FileText,
    Link as LinkIcon,
    CheckCircle2,
    Check,
    X,
    ArrowRight,
    Loader2,
    ExternalLink,
    RefreshCw
} from "lucide-react";
import { VoiceFeedback } from "@/components/seo/VoiceFeedback";
import { seoStorage } from "@/lib/seo-storage";
import type { ResearchVersion, SelectedLink } from "@/lib/seo-types";
import { validateStepAccess } from "@/lib/seo-step-validator";
import { StepErrorBoundary } from "@/components/seo/StepErrorBoundary";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { handleError, handleSuccess, handleWarning } from "@/lib/error-handler";
import { EngagingLoadingState, RESEARCH_STAGES } from "@/components/seo/EngagingLoadingState";

export default function Step2ResearchPage() {
    const router = useRouter();
    const [isResearching, setIsResearching] = useState(false);
    const [researchComplete, setResearchComplete] = useState(false);
    const [ideaText, setIdeaText] = useState("");
    const [mainKeyword, setMainKeyword] = useState("");

    // Research versions
    const [originalResearch, setOriginalResearch] = useState<ResearchVersion | null>(null);
    const [refinedResearch, setRefinedResearch] = useState<ResearchVersion | null>(null);
    const [activeVersion, setActiveVersion] = useState<"original" | "refined">("original");
    const [hasRefined, setHasRefined] = useState(false);
    const [isRefining, setIsRefining] = useState(false);

    // UI data from active version
    const [outboundLinks, setOutboundLinks] = useState<SelectedLink[]>([]);
    const [semanticKeywords, setSemanticKeywords] = useState<string[]>([]);
    const [titleOptions, setTitleOptions] = useState<string[]>([]);

    // Link verification
    const [isVerifyingLinks, setIsVerifyingLinks] = useState(false);
    useDraftAutosave();

    // Load Step 1 data and check for existing research
    useEffect(() => {
        const validation = validateStepAccess(2);
        if (!validation.canAccess) {
            handleError(new Error(validation.reason), "Step Access");
            router.push(validation.redirectTo || "/admin/seo/articles/new/step-1-idea");
            return;
        }

        const step1Data = seoStorage.getStep1();
        if (!step1Data) {
            router.push("/admin/seo/articles/new/step-1-idea");
            return;
        }
        setIdeaText(step1Data.ideaText || "");

        if (step1Data.articleTitle) {
            setMainKeyword(step1Data.articleTitle);
        } else {
            const words = (step1Data.ideaText || "").split(" ").slice(0, 5).join(" ");
            setMainKeyword(words);
        }

        // Check for existing research
        const step2Data = seoStorage.getStep2();
        if (step2Data && step2Data.versions && step2Data.versions.original) {
            setOriginalResearch(step2Data.versions.original);
            if (step2Data.versions.refined) {
                setRefinedResearch(step2Data.versions.refined);
                setHasRefined(true);
            }
            setActiveVersion(step2Data.activeVersion);
            setResearchComplete(true);

            // Load active version data
            loadVersionData(
                step2Data.activeVersion === "refined" && step2Data.versions.refined
                    ? step2Data.versions.refined
                    : step2Data.versions.original
            );
        }
    }, [router]);

    // Update UI when active version changes
    useEffect(() => {
        if (!originalResearch) return;

        const activeData = activeVersion === "refined" && refinedResearch
            ? refinedResearch
            : originalResearch;

        loadVersionData(activeData);
    }, [activeVersion, originalResearch, refinedResearch]);

    const loadVersionData = (data: ResearchVersion) => {
        // Populate outbound links - preserve verification status
        if (data.aggregatedInsights?.recommendedOutboundLinks) {
            const newLinks = data.aggregatedInsights.recommendedOutboundLinks.map((link, index) => {
                // Check if this link was previously verified by matching URL
                const existingLink = outboundLinks.find(l => l.url === link.url);
                const linkAny = link as any;
                return {
                    ...link,
                    selected: existingLink?.selected ?? linkAny.selected ?? index < 5,
                    verified: existingLink?.verified ?? link.verified, // Preserve verification status
                    recommendation: existingLink?.recommendation || link.recommendation, // Preserve AI recommendation
                };
            });
            setOutboundLinks(newLinks);
        }

        // Set semantic keywords
        if (data.aggregatedInsights?.semanticKeywords) {
            setSemanticKeywords(data.aggregatedInsights.semanticKeywords.slice(0, 10));
        }

        // Set title options
        if (data.aggregatedInsights?.titleSuggestions) {
            setTitleOptions(data.aggregatedInsights.titleSuggestions);
        }

        // Update main keyword
        if (data.decomposition?.mainTopic) {
            setMainKeyword(data.decomposition.mainTopic);
        }
    };

    const handleStartResearch = async () => {
        setIsResearching(true);

        try {
            const response = await fetch("/api/seo/research-comprehensive", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ideaText }),
            });

            if (!response.ok) throw new Error("Research failed");

            const data = await response.json();
            if (!data.success) throw new Error(data.error || "Research failed");

            const research: ResearchVersion = {
                decomposition: data.decomposition,
                researchResults: data.researchResults,
                aggregatedInsights: data.aggregatedInsights,
                timestamp: new Date().toISOString(),
            };

            // Save as original version
            seoStorage.saveStep2({
                versions: {
                    original: research,
                },
                activeVersion: "original",
                hasRefined: false,
                timestamp: new Date().toISOString(),
            });

            setOriginalResearch(research);
            loadVersionData(research);
            setIsResearching(false);
            setResearchComplete(true);

            // Auto-verify and analyze links
            await verifyAndAnalyzeLinks(data.aggregatedInsights.recommendedOutboundLinks);
        } catch (error: any) {
            console.error("Research error:", error);
            handleError(error, "Research");
            setIsResearching(false);
        }
    };

    const handleFeedbackSubmit = async (feedback: string) => {
        if (hasRefined) {
            handleWarning("Already Refined", "You can only refine research once. Use the toggle to switch between versions.");
            return;
        }

        setIsRefining(true);

        try {
            const response = await fetch("/api/seo/refine-research", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    originalIdea: ideaText,
                    originalResearch: originalResearch,
                    userFeedback: feedback,
                }),
            });

            if (!response.ok) throw new Error("Refinement failed");

            const data = await response.json();
            if (!data.success) throw new Error(data.error || "Refinement failed");

            const refined: ResearchVersion = {
                ...data.refinedResearch,
                feedback,
            };

            // Save refined version
            seoStorage.saveStep2Refined(refined, feedback);

            setRefinedResearch(refined);
            setActiveVersion("refined");
            setHasRefined(true);
            setIsRefining(false);

            // Auto-verify refined links
            await verifyAndAnalyzeLinks(refined.aggregatedInsights.recommendedOutboundLinks);
        } catch (error: any) {
            console.error("Refinement error:", error);
            handleError(error, "Refinement");
            setIsRefining(false);
        }
    };

    const verifyAndAnalyzeLinks = async (links: any[]) => {
        setIsVerifyingLinks(true);

        try {
            // Step 1: Verify links
            const verifyResponse = await fetch("/api/seo/verify-links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ links }),
            });

            if (!verifyResponse.ok) throw new Error("Link verification failed");

            const verifyData = await verifyResponse.json();

            // Step 2: Analyze authority
            const analyzeResponse = await fetch("/api/seo/analyze-link-authority", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ links: verifyData.verifiedLinks }),
            });

            if (!analyzeResponse.ok) throw new Error("Link analysis failed");

            const analyzeData = await analyzeResponse.json();

            const updatedLinks = (links || []).map((link, index) => {
                const existing = outboundLinks.find((item) => item.url === link.url);
                return {
                    ...link,
                    selected: existing?.selected ?? index < 5,
                    ...analyzeData.analyzedLinks[index],
                };
            });

            setOutboundLinks(updatedLinks);

            const step2Data = seoStorage.getStep2();
            if (step2Data) {
                const activeKey = step2Data.activeVersion;
                const activeVersion = step2Data.versions[activeKey];
                const updatedVersion = activeVersion ? {
                    ...activeVersion,
                    aggregatedInsights: {
                        ...activeVersion.aggregatedInsights,
                        recommendedOutboundLinks: updatedLinks,
                    },
                } : activeVersion;

                seoStorage.saveStep2({
                    ...step2Data,
                    versions: {
                        ...step2Data.versions,
                        [activeKey]: updatedVersion,
                    },
                    selectedLinks: updatedLinks.filter((link) => link.selected),
                });

                if (activeKey === "original") {
                    setOriginalResearch(updatedVersion as ResearchVersion);
                } else {
                    setRefinedResearch(updatedVersion as ResearchVersion);
                }
            }
        } catch (error: any) {
            console.error("Link verification error:", error);
        } finally {
            setIsVerifyingLinks(false);
        }
    };

    const toggleVersion = (version: "original" | "refined") => {
        setActiveVersion(version);
        seoStorage.setStep2ActiveVersion(version);
    };

    const toggleLinkSelection = (index: number) => {
        setOutboundLinks(prev =>
            prev.map((link, i) => i === index ? { ...link, selected: !link.selected } : link)
        );
    };

    const handleContinue = () => {
        // Save selected links and keywords
        const step2Data = seoStorage.getStep2();
        if (step2Data) {
            seoStorage.saveStep2({
                ...step2Data,
                selectedLinks: outboundLinks.filter(l => l.selected),
                selectedKeywords: semanticKeywords,
            });
        }

        router.push("/admin/seo/articles/new/step-3-framework");
    };

    const activeData = activeVersion === "refined" && refinedResearch ? refinedResearch : originalResearch;

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
                            <span className="relative z-10">2</span>
                        </motion.div>
                        <div className="h-2 flex-1 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-full overflow-hidden border border-white/10 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary via-info to-primary rounded-full relative"
                                initial={{ width: 0 }}
                                animate={{ width: "25%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                        </div>
                        <span className="text-sm text-foreground-muted font-semibold">Step 2 of 8</span>
                    </div>

                    {/* Title */}
                    <div>
                        <Link href="/admin/seo/articles/new/step-1-idea" className="text-sm text-primary hover:text-info transition-colors mb-2 inline-flex items-center gap-1 group">
                            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to Step 1
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
                            Research & Planning
                        </h1>
                        <p className="text-foreground-muted text-lg">
                            Deep research with Perplexity AI, link verification, and feedback refinement
                        </p>
                    </div>
                </motion.div>

                {/* Idea Summary */}
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

                    <Card className="relative bg-gradient-to-br from-primary/10 to-info/5 border border-primary/30 overflow-hidden">
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                        </div>

                        <CardHeader className="pb-3 relative z-10">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Your Idea
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-foreground italic">&quot;{ideaText}&quot;</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Research Button */}
                {!researchComplete && (
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

                        <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>

                            <CardContent className="py-12 text-center relative z-10">
                                {isResearching ? (
                                    <EngagingLoadingState
                                        stepName="Research"
                                        stages={RESEARCH_STAGES}
                                        estimatedSeconds={45}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        <motion.div
                                            className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-info/10 flex items-center justify-center border-2 border-primary/30"
                                            whileHover={{ scale: 1.1, rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Search className="w-8 h-8 text-primary" />
                                        </motion.div>
                                        <div>
                                            <p className="text-white font-semibold">Ready to Research</p>
                                            <p className="text-sm text-foreground-muted mt-1">
                                                Premium research with GPT-4o + Perplexity Sonar-Pro
                                            </p>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                onClick={handleStartResearch}
                                                className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    <Search className="w-5 h-5" />
                                                    Start Research
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

                {/* Research Results */}
                {researchComplete && activeData && (
                    <>
                        {/* Version Toggle */}
                        {hasRefined && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="group relative"
                            >
                                <motion.div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
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
                                                    Research Versions
                                                </p>
                                                <p className="text-xs text-foreground-muted">Toggle between original and refined research</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        onClick={() => toggleVersion("original")}
                                                        variant={activeVersion === "original" ? "default" : "outline"}
                                                        size="sm"
                                                        className={activeVersion === "original" ? "bg-primary text-background" : "border-white/10 text-white hover:bg-white/5"}
                                                    >
                                                        Original
                                                    </Button>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        onClick={() => toggleVersion("refined")}
                                                        variant={activeVersion === "refined" ? "default" : "outline"}
                                                        size="sm"
                                                        className={activeVersion === "refined" ? "bg-gradient-to-r from-success to-primary text-background" : "border-white/10 text-white hover:bg-white/5"}
                                                    >
                                                        <Sparkles className="w-4 h-4 mr-1" />
                                                        Refined
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Keyword Strategy */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
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
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Target className="w-6 h-6 text-primary" />
                                        Keyword Strategy
                                    </CardTitle>
                                    <CardDescription>Main keyword and semantic variations</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-white">Main Keyword</label>
                                        <Input
                                            value={mainKeyword}
                                            onChange={(e) => setMainKeyword(e.target.value)}
                                            className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 text-white placeholder:text-foreground-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    {semanticKeywords.length > 0 && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-white">
                                                Semantic Keywords ({semanticKeywords.length})
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {semanticKeywords.map((keyword, index) => (
                                                    <motion.span
                                                        key={keyword}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-info/10 text-primary text-sm border border-primary/20 hover:border-primary/40 transition-all cursor-default"
                                                    >
                                                        {keyword}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* Title Options */}
                        {titleOptions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
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
                                            Title Options
                                        </CardTitle>
                                        <CardDescription>AI-generated SEO-optimized titles</CardDescription>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <div className="space-y-3">
                                            {titleOptions.map((title, index) => (
                                                <motion.label
                                                    key={title}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-primary/50 cursor-pointer transition-all group/option"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="title"
                                                        defaultChecked={index === 0}
                                                        className="w-4 h-4 accent-primary"
                                                    />
                                                    <span className="text-white group-hover/option:text-primary transition-colors">{title}</span>
                                                </motion.label>
                                            ))}
                                        </div>
                                    </CardContent>

                                    {/* Corner Accent */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-info/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </motion.div>
                        )}

                        {/* Outbound Links */}
                        {outboundLinks.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
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
                                            <LinkIcon className="w-6 h-6 text-primary" />
                                            Outbound Links
                                            <span className="text-sm font-normal text-foreground-muted">
                                                ({outboundLinks.filter(l => l.selected).length}/{outboundLinks.length})
                                            </span>
                                        </CardTitle>
                                        <CardDescription>
                                            {isVerifyingLinks ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                                    Verifying links...
                                                </span>
                                            ) : (
                                                "High-authority sources with AI-powered rel attributes"
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <div className="space-y-3">
                                            {outboundLinks.map((link, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => toggleLinkSelection(index)}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all group/link ${link.selected
                                                        ? "bg-gradient-to-br from-primary/10 to-info/5 border-primary/30"
                                                        : "bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-primary/30"
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-start gap-3 flex-1">
                                                            <div
                                                                className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${link.selected ? "bg-primary border-primary" : "border-white/20 group-hover/link:border-primary/50"
                                                                    }`}
                                                            >
                                                                {link.selected && <Check className="w-3 h-3 text-background" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-white font-medium group-hover/link:text-primary transition-colors">{link.title}</p>
                                                                <p className="text-xs text-foreground-muted truncate flex items-center gap-1">
                                                                    <ExternalLink className="w-3 h-3" />
                                                                    {link.url}
                                                                </p>
                                                                {link.recommendation && (
                                                                    <p className="text-xs text-foreground-muted mt-1">
                                                                        {link.recommendation.reason}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                            <div className="flex items-center gap-1">
                                                                {link.verified !== undefined && (
                                                                    <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${link.verified ? "bg-success/10 text-success border border-success/20" : "bg-error/10 text-error border border-error/20"
                                                                        }`}>
                                                                        {link.verified ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                                        {link.verified ? "Verified" : "Broken"}
                                                                    </span>
                                                                )}
                                                                {link.recommendation && (
                                                                    <span className={`text-xs px-2 py-0.5 rounded border ${link.recommendation.relation === "follow"
                                                                        ? "bg-success/10 text-success border-success/20"
                                                                        : "bg-foreground-muted/10 text-foreground-muted border-foreground-muted/20"
                                                                        }`}>
                                                                        {link.recommendation.relation}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs px-2 py-0.5 rounded bg-info/10 text-info border border-info/20">
                                                                DA {link.domainAuthority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>

                                    {/* Corner Accent */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-success/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </motion.div>
                        )}

                        {/* Research Stats */}
                        {activeData.aggregatedInsights && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="group relative"
                            >
                                <motion.div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                    whileHover={{ scale: 1.02 }}
                                />

                                <Card className="relative bg-gradient-to-br from-success/10 to-primary/5 border border-success/30 overflow-hidden">
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                    </div>

                                    <CardHeader className="pb-3 relative z-10">
                                        <CardTitle className="text-success text-lg flex items-center gap-2">
                                            <CheckCircle2 className="w-6 h-6" />
                                            Research Complete
                                            {activeVersion === "refined" && (
                                                <span className="text-xs bg-success/20 px-2 py-1 rounded border border-success/30 flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" />
                                                    Refined with Feedback
                                                </span>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.8 }}
                                            >
                                                <p className="text-foreground-muted">Total Sources</p>
                                                <p className="text-2xl font-bold text-white">{activeData.aggregatedInsights.totalSources || 0}</p>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.9 }}
                                            >
                                                <p className="text-foreground-muted">Key Findings</p>
                                                <p className="text-2xl font-bold text-white">{activeData.aggregatedInsights.totalFindings || 0}</p>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 1.0 }}
                                            >
                                                <p className="text-foreground-muted">Keywords Found</p>
                                                <p className="text-2xl font-bold text-white">{activeData.aggregatedInsights.topKeywords?.length || 0}</p>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 1.1 }}
                                            >
                                                <p className="text-foreground-muted">Queries Researched</p>
                                                <p className="text-2xl font-bold text-white">{activeData.researchResults?.length || 0}</p>
                                            </motion.div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Voice Feedback */}
                        {isRefining ? (
                            <Card className="border-border bg-background">
                                <CardContent className="py-8 text-center">
                                    <p className="text-foreground font-medium">Refining research with your feedback...</p>
                                    <p className="text-sm text-foreground-muted mt-1">Running 7 new queries based on your input</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <VoiceFeedback
                                title="Refine Research"
                                description={hasRefined ? "Research already refined. Toggle between versions above." : "Record feedback to adjust research focus (one-time only)"}
                                onFeedbackSubmit={handleFeedbackSubmit}
                                disabled={hasRefined}
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
                    <Link href="/admin/seo/articles/new/step-1-idea">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all">
                            <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
                            Back to Step 1
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="secondary"
                                className="bg-gradient-to-br from-white/5 to-white/[0.02] text-white hover:from-white/10 hover:to-white/5 border border-white/10"
                                onClick={() => handleSuccess("Progress Saved", "Your research has been saved.")}
                            >
                                Save Progress
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleContinue}
                                className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                disabled={!researchComplete}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Continue to Framework
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
