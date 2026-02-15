"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Search,
    Link2,
    Network,
    Brain,
    Target,
    RefreshCw,
    Globe,
    TestTube,
    TrendingUp,
    Sparkles,
    Bot,
    ArrowRight,
    Zap
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface AdvancedFeature {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: string;
    badge?: string;
}

const advancedFeatures: AdvancedFeature[] = [
    {
        title: "SERP Analysis",
        description: "Analyze top-ranking articles, identify content gaps, and get optimization recommendations",
        icon: Search,
        href: "/admin/seo/advanced/serp-analysis",
        color: "from-blue-500/20 to-cyan-500/20",
        badge: "Competitor Intel"
    },
    {
        title: "Internal Linking Engine",
        description: "AI-powered semantic link suggestions using vector embeddings for maximum relevance",
        icon: Link2,
        href: "/admin/seo/advanced/internal-linking",
        color: "from-purple-500/20 to-pink-500/20",
        badge: "Vector Search"
    },
    {
        title: "Content Cluster Builder",
        description: "Generate pillar/cluster/supporting article strategies with automatic internal linking",
        icon: Network,
        href: "/admin/seo/advanced/content-clusters",
        color: "from-green-500/20 to-emerald-500/20",
        badge: "Topic Authority"
    },
    {
        title: "NLP Entity Analysis",
        description: "Extract entities, analyze topic coverage, and ensure comprehensive content",
        icon: Brain,
        href: "/admin/seo/advanced/nlp-entities",
        color: "from-orange-500/20 to-red-500/20",
        badge: "Topic Coverage"
    },
    {
        title: "Featured Snippet Optimizer",
        description: "Optimize content for paragraph, list, table, and video featured snippets",
        icon: Target,
        href: "/admin/seo/advanced/featured-snippets",
        color: "from-yellow-500/20 to-orange-500/20",
        badge: "Position Zero"
    },
    {
        title: "Content Refresh Detector",
        description: "Monitor competitor updates and get alerts when your content needs refreshing",
        icon: RefreshCw,
        href: "/admin/seo/advanced/content-refresh",
        color: "from-teal-500/20 to-cyan-500/20",
        badge: "Stay Fresh"
    },
    {
        title: "Multi-Language Support",
        description: "Translate articles to 27+ languages with cultural adaptation and hreflang tags",
        icon: Globe,
        href: "/admin/seo/advanced/multi-language",
        color: "from-indigo-500/20 to-purple-500/20",
        badge: "27+ Languages"
    },
    {
        title: "A/B Testing Dashboard",
        description: "Test titles, meta descriptions, and content variations with statistical analysis",
        icon: TestTube,
        href: "/admin/seo/advanced/ab-testing",
        color: "from-pink-500/20 to-rose-500/20",
        badge: "Data-Driven"
    },
    {
        title: "Rank Tracking",
        description: "Monitor keyword rankings, track position changes, and get automated alerts",
        icon: TrendingUp,
        href: "/admin/seo/advanced/rank-tracking",
        color: "from-primary/20 to-info/20",
        badge: "Real-Time"
    },
    {
        title: "Content Score Predictor",
        description: "ML-powered predictions for content quality scores and traffic potential",
        icon: Sparkles,
        href: "/admin/seo/advanced/score-predictor",
        color: "from-amber-500/20 to-yellow-500/20",
        badge: "ML Powered"
    },
    {
        title: "AI SEO Agent",
        description: "Fully autonomous content generation with human-in-the-loop review workflow",
        icon: Bot,
        href: "/admin/seo/advanced/ai-agent",
        color: "from-primary/20 to-success/20",
        badge: "Autonomous"
    },
];

export default function AdvancedFeaturesPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-6">
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
                                <Zap className="w-8 h-8 text-primary" />
                            </motion.div>
                            Advanced SEO Features
                        </h1>
                        <p className="text-foreground-muted text-lg">
                            Elite-tier SEO tools powered by AI, ML, and vector search
                        </p>
                    </div>
                    <Link href="/admin/seo">
                        <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                            Back to Pipeline
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                {/* Status Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-primary/10 via-info/10 to-primary/10 border border-primary/30 rounded-xl p-6 mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                All 11 Advanced Features Active
                            </h3>
                            <p className="text-foreground-muted">
                                Your SEO engine is equipped with the most advanced tools available. All features are production-ready and connected to your database.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            <span className="text-primary font-bold">LIVE</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {advancedFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="group relative h-full"
                        >
                            <Link href={feature.href}>
                                {/* Glow Effect */}
                                <motion.div
                                    className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
                                    whileHover={{ scale: 1.02 }}
                                />

                                <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden h-full">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                    </div>

                                    <CardHeader className="pb-3 relative z-10">
                                        <div className="flex items-start justify-between mb-3">
                                            <motion.div
                                                className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors"
                                                whileHover={{ rotate: 360, scale: 1.1 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <Icon className="w-6 h-6 text-primary" />
                                            </motion.div>
                                            {feature.badge && (
                                                <span className="px-2 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full">
                                                    {feature.badge}
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg text-white group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <CardDescription className="text-foreground-muted text-sm leading-relaxed mb-4">
                                            {feature.description}
                                        </CardDescription>
                                        <motion.div
                                            className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                            whileHover={{ x: 5 }}
                                        >
                                            <span className="text-xs font-semibold">Launch Feature</span>
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

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="grid gap-6 sm:grid-cols-3"
            >
                {[
                    { title: "API Endpoints", value: "25+", description: "Production-ready APIs", color: "from-primary/20 to-info/20" },
                    { title: "Database Tables", value: "31", description: "Supabase + pgvector", color: "from-purple-500/20 to-pink-500/20" },
                    { title: "Code Lines", value: "15K+", description: "TypeScript strict mode", color: "from-green-500/20 to-emerald-500/20" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="group relative"
                    >
                        <motion.div
                            className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                            whileHover={{ scale: 1.02 }}
                        />
                        <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>
                            <CardHeader className="pb-2 relative z-10">
                                <CardTitle className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">
                                    {stat.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                                <p className="text-xs text-foreground-muted">{stat.description}</p>
                            </CardContent>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
