"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
    Sparkles,
    Zap,
    FileText,
    List,
    FolderOpen,
    Folder,
    CheckCircle2,
    Check,
    Lightbulb,
    PenTool,
    ArrowRight,
    Loader2,
    Link as LinkIcon
} from "lucide-react";
import { seoStorage } from "@/lib/seo-storage";
import { VoiceFeedback } from "@/components/seo/VoiceFeedback";
import { validateStepAccess } from "@/lib/seo-step-validator";
import { StepErrorBoundary } from "@/components/seo/StepErrorBoundary";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { handleError, handleSuccess } from "@/lib/error-handler";
import type { Step3Framework } from "@/lib/seo-types";
import { EngagingLoadingState, FRAMEWORK_STAGES } from "@/components/seo/EngagingLoadingState";

export default function Step3FrameworkPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [frameworkGenerated, setFrameworkGenerated] = useState(false);
    const [framework, setFramework] = useState<Step3Framework | null>(null);
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
    const [frameworkNotes, setFrameworkNotes] = useState("");
    useDraftAutosave();

    useEffect(() => {
        const validation = validateStepAccess(3);
        if (!validation.canAccess) {
            handleError(new Error(validation.reason), "Step Access");
            router.push(validation.redirectTo || "/admin/seo/articles/new/step-1-idea");
            return;
        }

        // Check if framework already exists and load it
        const step3Data = seoStorage.getArticleData().step3;
        if (step3Data) {
            // Handle both old and new data formats
            const loadedFramework = (step3Data as any).framework || step3Data;
            setFramework(loadedFramework);
            setFrameworkGenerated(true);
            setTitle((step3Data as any).title || loadedFramework?.metadata?.title || "");
        }
    }, [router]);

    const handleGenerateFramework = async () => {
        setIsGenerating(true);

        try {
            const step1 = seoStorage.getStep1();
            const step2 = seoStorage.getStep2();

            if (!step1 || !step2) {
                throw new Error("Missing steps");
            }

            const response = await fetch("/api/seo/generate-framework", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idea: step1.ideaText,
                    research: step2,
                    selectedKeywords: step2.selectedKeywords || [],
                    selectedLinks: step2.selectedLinks || [],
                    mainKeyword: step2.versions[step2.activeVersion]?.decomposition?.mainTopic || "",
                }),
            });

            if (!response.ok) {
                throw new Error("Framework generation failed");
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || "Framework generation failed");
            }

            setFramework(data.framework);
            setFrameworkGenerated(true);

            // Save to localStorage
            seoStorage.saveArticleData({
                step3: {
                    ...data.framework,
                    timestamp: new Date().toISOString(),
                },
                currentStep: 3,
            });

            console.log("Framework generated:", data.framework);
        } catch (error: any) {
            console.error("Framework generation error:", error);
            handleError(error, "Generate Framework");
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleSection = (index: number) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

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
                            <span className="relative z-10">3</span>
                        </motion.div>
                        <div className="h-2 flex-1 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-full overflow-hidden border border-white/10 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary via-info to-primary rounded-full relative"
                                initial={{ width: 0 }}
                                animate={{ width: "37.5%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                        </div>
                        <span className="text-sm text-foreground-muted font-semibold">Step 3 of 8</span>
                    </div>

                    {/* Title */}
                    <div>
                        <Link href="/admin/seo/articles/new/step-2-research" className="text-sm text-primary hover:text-info transition-colors mb-2 inline-flex items-center gap-1 group">
                            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to Step 2
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
                            Article Framework
                        </h1>
                        <p className="text-foreground-muted text-lg">
                            AI-generated structure optimized for Rank Math 100/100
                        </p>
                    </div>
                </motion.div>

                {/* Generate Framework */}
                {!frameworkGenerated && (
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
                                {isGenerating ? (
                                    <EngagingLoadingState
                                        stepName="Framework"
                                        stages={FRAMEWORK_STAGES}
                                        estimatedSeconds={30}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        <motion.div
                                            className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-info/10 flex items-center justify-center border-2 border-primary/30"
                                            whileHover={{ scale: 1.1, rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Zap className="w-8 h-8 text-primary" />
                                        </motion.div>
                                        <div>
                                            <p className="text-white font-semibold">Ready to Generate Framework</p>
                                            <p className="text-sm text-foreground-muted mt-1">
                                                Claude Sonnet 4 will create your SEO-optimized article structure
                                            </p>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                onClick={handleGenerateFramework}
                                                className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    <Zap className="w-5 h-5" />
                                                    Generate Framework
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

                {/* Framework Results */}
                {frameworkGenerated && framework && (
                    <>
                        {/* Meta Settings */}
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

                                <CardHeader className="relative z-10">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <List className="w-6 h-6 text-primary" />
                                        Article Metadata
                                    </CardTitle>
                                    <CardDescription>SEO settings and targeting</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 relative z-10">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-white">Title (H1)</label>
                                            <Input
                                                value={framework.metadata?.title || title}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setTitle(value);
                                                    setFramework({ ...framework, metadata: { ...framework.metadata, title: value } });
                                                }}
                                                className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                            <p className="text-xs text-foreground-muted">{framework.metadata?.title?.length || 0} characters</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-white">URL Slug</label>
                                            <Input
                                                value={framework.metadata?.slug || ""}
                                                onChange={(e) => setFramework({ ...framework, metadata: { ...framework.metadata, slug: e.target.value } })}
                                                className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 text-white font-mono text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-white">Meta Description</label>
                                        <Textarea
                                            value={framework.metadata?.metaDescription || ""}
                                            onChange={(e) => setFramework({ ...framework, metadata: { ...framework.metadata, metaDescription: e.target.value } })}
                                            className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                            rows={2}
                                        />
                                        <p className="text-xs text-foreground-muted">{framework.metadata?.metaDescription?.length || 0}/160 characters</p>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div>
                                            <p className="text-sm text-foreground-muted">Focus Keyword</p>
                                            <p className="text-white font-semibold">{framework.metadata?.focusKeyword}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-foreground-muted">Target Word Count</p>
                                            <p className="text-white font-semibold">{framework.metadata?.wordCountTarget} words</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-foreground-muted">Reading Level</p>
                                            <p className="text-white font-semibold">{framework.metadata?.readingLevel}</p>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* Article Outline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
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
                                        Article Outline
                                    </CardTitle>
                                    <CardDescription>Click sections to expand/collapse</CardDescription>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="space-y-2">
                                        {framework.outline?.map((section: any, index: number) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border border-white/10 rounded-lg overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02]"
                                            >
                                                <button
                                                    onClick={() => toggleSection(index)}
                                                    className="w-full p-4 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 transition-all text-left flex items-center justify-between group/section"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {expandedSections.has(index) ? (
                                                            <FolderOpen className="w-5 h-5 text-primary" />
                                                        ) : (
                                                            <Folder className="w-5 h-5 text-foreground-muted group-hover/section:text-primary transition-colors" />
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-white group-hover/section:text-primary transition-colors">
                                                                {section.type === "h1" && "H1: "}
                                                                {section.type === "h2" && "H2: "}
                                                                {section.type === "introduction" && "Introduction"}
                                                                {section.type === "conclusion" && "Conclusion"}
                                                                {section.text}
                                                            </p>
                                                            {section.wordCount && (
                                                                <p className="text-xs text-foreground-muted">~{section.wordCount} words</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-foreground-muted text-lg group-hover/section:text-primary transition-colors">{expandedSections.has(index) ? "−" : "+"}</span>
                                                </button>
                                                {expandedSections.has(index) && (
                                                    <div className="p-4 bg-gradient-to-br from-white/[0.02] to-transparent border-t border-white/10 space-y-3">
                                                        {section.instructions && (
                                                            <div className="p-3 bg-gradient-to-br from-info/10 to-info/5 border border-info/30 rounded-lg">
                                                                <p className="text-sm text-info font-semibold flex items-center gap-2">
                                                                    <Lightbulb className="w-4 h-4" />
                                                                    Writing Instructions:
                                                                </p>
                                                                <p className="text-sm text-foreground mt-1">{section.instructions}</p>
                                                            </div>
                                                        )}
                                                        {section.mustInclude && (
                                                            <div>
                                                                <p className="text-sm font-medium text-foreground mb-2">Must Include:</p>
                                                                <ul className="list-disc list-inside text-sm text-foreground-muted space-y-1">
                                                                    {section.mustInclude.map((item: string, i: number) => (
                                                                        <li key={i}>{item}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {section.subsections && (
                                                            <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                                                                {section.subsections.map((sub: any, subIndex: number) => (
                                                                    <div key={subIndex} className="p-3 bg-background-alt rounded">
                                                                        <p className="font-medium text-foreground">H3: {sub.text}</p>
                                                                        {sub.content?.wordCount && (
                                                                            <p className="text-xs text-foreground-muted mt-1">~{sub.content.wordCount} words</p>
                                                                        )}
                                                                        {sub.content?.elements && (
                                                                            <ul className="list-disc list-inside text-xs text-foreground-muted mt-2">
                                                                                {sub.content.elements.map((el: string, i: number) => (
                                                                                    <li key={i}>{el}</li>
                                                                                ))}
                                                                            </ul>
                                                                        )}
                                                                        {sub.content?.linkPlacements && (
                                                                            <div className="mt-2 p-2 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20 text-xs">
                                                                                <p className="font-semibold text-success flex items-center gap-1">
                                                                                    <LinkIcon className="w-3 h-3" />
                                                                                    Link Placements:
                                                                                </p>
                                                                                {sub.content.linkPlacements.map((link: any, i: number) => (
                                                                                    <p key={i} className="text-foreground-muted mt-1">
                                                                                        • {link.anchorText} → [{link.relation}] → {link.url}
                                                                                    </p>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {sub.instructions && (
                                                                            <p className="text-xs text-foreground-muted mt-2 italic">{sub.instructions}</p>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-info/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>

                        {/* SEO Checklist */}
                        {framework.seoChecklist && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
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

                                    <CardHeader className="relative z-10">
                                        <CardTitle className="text-success flex items-center gap-2">
                                            <CheckCircle2 className="w-6 h-6" />
                                            Rank Math Checklist
                                        </CardTitle>
                                        <CardDescription>Optimizations included in this framework</CardDescription>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <div className="grid gap-3 md:grid-cols-2">
                                            {Object.entries(framework.seoChecklist).map(([key, value], index) => (
                                                <motion.div
                                                    key={key}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.5 + index * 0.03 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                                                    <span className="text-white text-sm">
                                                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}: {typeof value === "boolean" ? "Yes" : String(value)}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Writing Guidelines */}
                        {framework.writingGuidelines && (
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
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <PenTool className="w-6 h-6 text-primary" />
                                            Writing Guidelines
                                        </CardTitle>
                                        <CardDescription>Instructions for maintaining human-like quality</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 relative z-10">
                                        <div>
                                            <p className="text-sm font-semibold text-white mb-2">Tone & Perspective:</p>
                                            <p className="text-sm text-foreground-muted">
                                                {framework.writingGuidelines.tone} ({framework.writingGuidelines.perspective})
                                            </p>
                                        </div>
                                        {framework.writingGuidelines.voiceCharacteristics && (
                                            <div>
                                                <p className="text-sm font-semibold text-white mb-2">Voice Characteristics:</p>
                                                <ul className="list-disc list-inside text-sm text-foreground-muted space-y-1">
                                                    {framework.writingGuidelines.voiceCharacteristics.map((char: string, i: number) => (
                                                        <li key={i}>{char}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {framework.writingGuidelines.antiAITactics && (
                                            <div>
                                                <p className="text-sm font-semibold text-white mb-2">Anti-AI Detection Tactics:</p>
                                                <ul className="list-disc list-inside text-sm text-foreground-muted space-y-1">
                                                    {framework.writingGuidelines.antiAITactics.map((tactic: string, i: number) => (
                                                        <li key={i}>{tactic}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>

                                    {/* Corner Accent */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </motion.div>
                        )}

                        {/* Voice Notes for Framework Adjustments */}
                        {frameworkGenerated && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <VoiceFeedback
                                    title="Voice Notes (Optional)"
                                    description="Record any adjustments or notes about the framework structure"
                                    onFeedbackSubmit={(notes) => {
                                        setFrameworkNotes(notes);
                                        // Save notes to localStorage
                                        seoStorage.saveArticleData({
                                            step3: {
                                                ...framework,
                                                notes,
                                                timestamp: new Date().toISOString(),
                                            },
                                            currentStep: 3,
                                        });
                                        handleSuccess("Notes Saved", "Framework notes have been saved.");
                                    }}
                                />
                            </motion.div>
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
                    <Link href="/admin/seo/articles/new/step-2-research">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all">
                            <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
                            Back to Step 2
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="secondary"
                                className="bg-gradient-to-br from-white/5 to-white/[0.02] text-white hover:from-white/10 hover:to-white/5 border border-white/10"
                                onClick={() => handleSuccess("Framework Saved", "Your framework has been saved.")}
                            >
                                Save Framework
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                disabled={!frameworkGenerated}
                                onClick={() => router.push("/admin/seo/articles/new/step-4-writing")}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Continue to Writing
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
