"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Mic,
    Search,
    FileText,
    PenTool,
    Brain,
    Zap,
    Palette,
    Rocket,
    TrendingUp,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { seoStorage } from "@/lib/seo-storage";
import { stepRoutes } from "@/lib/seo-step-validator";

interface PipelineStep {
    number: number;
    title: string;
    description: string;
    status: "idea" | "research" | "framework" | "draft" | "humanizing" | "optimizing" | "styling" | "review" | "published";
    icon: LucideIcon;
    href: string;
    color: string;
}

const pipelineSteps: PipelineStep[] = [
    {
        number: 1,
        title: "Voice to Idea",
        description: "Capture ideas via voice recording, text, or document upload",
        status: "idea",
        icon: Mic,
        href: "/admin/seo/articles/new/step-1-idea",
        color: "from-purple-500/20 to-info/20"
    },
    {
        number: 2,
        title: "Research & Planning",
        description: "Deep research with Perplexity, keyword analysis, silo mapping",
        status: "research",
        icon: Search,
        href: "/admin/seo/articles/new/step-2-research",
        color: "from-info/20 to-primary/20"
    },
    {
        number: 3,
        title: "Article Framework",
        description: "Generate outline, headings, and content structure",
        status: "framework",
        icon: FileText,
        href: "/admin/seo/articles/new/step-3-framework",
        color: "from-primary/20 to-info/20"
    },
    {
        number: 4,
        title: "Article Writing",
        description: "AI writes full article with your voice and style",
        status: "draft",
        icon: PenTool,
        href: "/admin/seo/articles/new/step-4-writing",
        color: "from-info/20 to-primary/20"
    },
    {
        number: 5,
        title: "Humanization",
        description: "Remove AI patterns, add natural flow and idioms",
        status: "humanizing",
        icon: Brain,
        href: "/admin/seo/articles/new/step-5-humanize",
        color: "from-primary/20 to-purple-500/20"
    },
    {
        number: 6,
        title: "SEO Optimization",
        description: "Links, schema markup, meta tags, discoverability",
        status: "optimizing",
        icon: Zap,
        href: "/admin/seo/articles/new/step-6-optimize",
        color: "from-primary/20 to-info/20"
    },
    {
        number: 7,
        title: "Styling & Media",
        description: "Visual styling, images, video hero generation",
        status: "styling",
        icon: Palette,
        href: "/admin/seo/articles/new/step-7-styling",
        color: "from-info/20 to-primary/20"
    },
    {
        number: 8,
        title: "Review & Publish",
        description: "Final review, scoring dashboard, publish",
        status: "review",
        icon: Rocket,
        href: "/admin/seo/articles/new/step-8-publish",
        color: "from-primary/20 to-success/20"
    },
];

export default function SEOEnginePage() {
    const router = useRouter();
    const [stats, setStats] = useState({
        total: 0,
        inPipeline: 0,
        publishedThisMonth: 0
    });

    const [recentArticles, setRecentArticles] = useState<any[]>([]);
    const [draftProgress, setDraftProgress] = useState<{
        step: number;
        title?: string;
    } | null>(null);

    useEffect(() => {
        // Load all articles
        const publishedArticles = JSON.parse(localStorage.getItem('seo-published-articles') || '[]');
        const draftArticles = JSON.parse(localStorage.getItem('seo-draft-articles') || '[]');
        const allArticles = [...publishedArticles, ...draftArticles];

        // Calculate stats
        const total = allArticles.length;
        const inPipeline = draftArticles.length;

        // Published this month
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const publishedThisMonth = publishedArticles.filter((a: any) => {
            const publishedDate = new Date(a.publishedAt || a.createdAt);
            return publishedDate >= firstOfMonth;
        }).length;

        setStats({ total, inPipeline, publishedThisMonth });

        // Get recent articles (last 4)
        const recent = allArticles
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 4);
        setRecentArticles(recent);

        const draftData = seoStorage.getArticleData();
        if (draftData.currentStep > 0 && (draftData.step1?.ideaText || draftData.step3?.metadata?.title)) {
            setDraftProgress({
                step: draftData.currentStep,
                title: draftData.step3?.metadata?.title || draftData.step1?.ideaText
            });
        }
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
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
                            SEO Content Engine
                        </h1>
                        <p className="text-foreground-muted text-lg">
                            AI-powered content creation pipeline — from voice idea to published article
                        </p>
                    </div>
                    <Link href="/admin/seo/advanced">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-primary to-info text-background font-bold rounded-lg hover:shadow-xl hover:shadow-primary/50 transition-all flex items-center gap-2"
                        >
                            <Zap className="w-5 h-5" />
                            Advanced Features
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            {draftProgress && (
                <Card className="border-primary/30 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-white">Resume draft</CardTitle>
                        <CardDescription>
                            Step {draftProgress.step}/8
                            {draftProgress.title ? ` • ${draftProgress.title}` : ""}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <button
                            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
                            onClick={() => router.push(stepRoutes[draftProgress.step] || stepRoutes[1])}
                        >
                            Continue where you left off
                        </button>
                    </CardContent>
                </Card>
            )}

            {/* Pipeline Overview */}
            <div className="relative">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {pipelineSteps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5 }}
                                className="group relative"
                            >
                                <Link href={step.href}>
                                    {/* Glow Effect */}
                                    <motion.div
                                        className={`absolute -inset-0.5 bg-gradient-to-r ${step.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
                                        whileHover={{ scale: 1.02 }}
                                    />

                                    <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden h-full">
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-5">
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                        </div>

                                        <CardHeader className="pb-3 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <motion.div
                                                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors"
                                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <Icon className="w-6 h-6 text-primary" />
                                                </motion.div>
                                                <div>
                                                    <p className="text-xs text-primary font-bold uppercase tracking-wider">Step {step.number}</p>
                                                    <CardTitle className="text-base text-white group-hover:text-primary transition-colors">
                                                        {step.title}
                                                    </CardTitle>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="relative z-10">
                                            <CardDescription className="text-foreground-muted text-sm leading-relaxed">
                                                {step.description}
                                            </CardDescription>
                                            <motion.div
                                                className="flex items-center gap-2 mt-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                                whileHover={{ x: 5 }}
                                            >
                                                <span className="text-xs font-semibold">Start Step</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </motion.div>
                                        </CardContent>

                                        {/* Corner Accent */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 sm:grid-cols-3">
                {[
                    { title: "Total Articles", value: stats.total.toString(), change: `${stats.total} total created`, color: "from-primary/20 to-info/20", changeColor: "text-success" },
                    { title: "In Pipeline", value: stats.inPipeline.toString(), change: `${stats.inPipeline} drafts`, color: "from-warning/20 to-primary/20", changeColor: "text-foreground-muted" },
                    { title: "Published This Month", value: stats.publishedThisMonth.toString(), change: `${stats.publishedThisMonth} this month`, color: "from-primary/20 to-success/20", changeColor: "text-success" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="group relative"
                    >
                        {/* Glow Effect */}
                        <motion.div
                            className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                            whileHover={{ scale: 1.02 }}
                        />

                        <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>

                            <CardHeader className="pb-2 relative z-10">
                                <CardTitle className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">
                                    {stat.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    <p className={`text-xs font-bold ${stat.changeColor}`}>{stat.change}</p>
                                </div>
                            </CardContent>

                            {/* Corner Accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="group relative"
            >
                <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-info/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                    whileHover={{ scale: 1.02 }}
                />

                <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    </div>

                    <CardHeader className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-primary" />
                                    Recent Articles
                                </CardTitle>
                                <CardDescription className="mt-1">Articles currently in the pipeline</CardDescription>
                            </div>
                            <Link href="/admin/seo/articles">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-sm text-primary hover:text-info transition-colors font-semibold flex items-center gap-1"
                                >
                                    View All
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        {recentArticles.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-foreground-muted/30 mx-auto mb-3" />
                                <p className="text-foreground-muted mb-4">No articles created yet</p>
                                <Link href="/admin/seo/articles/new/step-1-idea">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-gradient-to-r from-primary to-info text-background font-bold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all"
                                    >
                                        Start Your First Article
                                    </motion.button>
                                </Link>
                            </div>
                        ) : (
                        <div className="space-y-3">
                            {recentArticles.map((article, index) => {
                                const getStatusColor = (status: string) => {
                                    switch (status) {
                                        case 'published': return 'text-success bg-success/10 border-success/20';
                                        case 'draft': return 'text-warning bg-warning/10 border-warning/20';
                                        case 'archived': return 'text-info bg-info/10 border-info/20';
                                        default: return 'text-foreground-muted bg-foreground-muted/10 border-foreground-muted/20';
                                    }
                                };

                                return (
                                <motion.div
                                    key={article.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.3 + index * 0.1 }}
                                    whileHover={{ x: 5 }}
                                    className="group/item relative overflow-hidden rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/5 hover:border-primary/30 p-4 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />

                                    <div className="flex items-center justify-between relative z-10">
                                        <span className="text-white font-semibold truncate">{article.title}</span>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full border whitespace-nowrap ml-3 ${getStatusColor(article.status)}`}>
                                            {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                            })}
                        </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
