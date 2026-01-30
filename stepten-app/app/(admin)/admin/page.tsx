"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { seoStorage } from "@/lib/seo-storage";
import Link from "next/link";
import {
    Users,
    FileText,
    DollarSign,
    Target,
    TrendingUp,
    ArrowRight,
    Eye,
    Clock,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    BarChart3,
    Zap,
    FileEdit
} from "lucide-react";

export default function AdminPage() {
    const [recentArticles, setRecentArticles] = useState<any[]>([]);
    const [stats, setStats] = useState([
        {
            title: "Total Users",
            value: "0",
            change: "+0%",
            icon: Users,
            trend: "up" as const,
            color: "from-primary/20 to-info/20"
        },
        {
            title: "Articles",
            value: "0",
            change: "+0",
            icon: FileText,
            trend: "up" as const,
            color: "from-info/20 to-primary/20"
        },
        {
            title: "Revenue",
            value: "$0",
            change: "+0%",
            icon: DollarSign,
            trend: "up" as const,
            color: "from-primary/20 to-success/20"
        },
        {
            title: "Active Leads",
            value: "0",
            change: "+0",
            icon: Target,
            trend: "up" as const,
            color: "from-info/20 to-primary/20"
        },
    ]);

    useEffect(() => {
        // Load published and draft articles
        const publishedArticles = JSON.parse(localStorage.getItem('seo-published-articles') || '[]');
        const draftArticles = JSON.parse(localStorage.getItem('seo-draft-articles') || '[]');
        const allArticles = [...publishedArticles, ...draftArticles];

        // Get most recent 3 articles
        const recent = allArticles
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 3)
            .map(article => ({
                id: article.id,
                title: article.title,
                status: article.status === 'published' ? 'Published' : article.status === 'draft' ? 'Draft' : 'Archived',
                views: article.views || '0',
                icon: article.status === 'published' ? CheckCircle2 : FileEdit,
                slug: article.slug
            }));

        setRecentArticles(recent);

        // Update stats with real data
        const totalArticles = allArticles.length;
        const publishedCount = publishedArticles.length;

        setStats([
            {
                title: "Total Users",
                value: "0",
                change: "+0%",
                icon: Users,
                trend: "up" as const,
                color: "from-primary/20 to-info/20"
            },
            {
                title: "Articles",
                value: totalArticles.toString(),
                change: `${publishedCount} published`,
                icon: FileText,
                trend: "up" as const,
                color: "from-info/20 to-primary/20"
            },
            {
                title: "Revenue",
                value: "$0",
                change: "+0%",
                icon: DollarSign,
                trend: "up" as const,
                color: "from-primary/20 to-success/20"
            },
            {
                title: "Active Leads",
                value: "0",
                change: "+0",
                icon: Target,
                trend: "up" as const,
                color: "from-info/20 to-primary/20"
            },
        ]);
    }, []);
    return (
        <div className="space-y-8 p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
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
                        Admin Dashboard
                    </h1>
                    <p className="text-foreground-muted text-lg">
                        Welcome back! Here's what's happening with your platform.
                    </p>
                </div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button className="h-12 px-6 bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group">
                        <span className="relative z-10 flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            New Article
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
            </motion.div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="group relative"
                    >
                        {/* Glow Effect */}
                        <motion.div
                            className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
                            whileHover={{ scale: 1.02 }}
                        />

                        <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>

                            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                                <CardTitle className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">
                                    {stat.title}
                                </CardTitle>
                                <motion.div
                                    className="p-3 rounded-xl bg-primary/10 border border-primary/20"
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <stat.icon className="w-5 h-5 text-primary" />
                                </motion.div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                                <div className="flex items-center gap-2 text-xs">
                                    <TrendingUp className="w-4 h-4 text-success" />
                                    <span className="text-success font-bold">{stat.change}</span>
                                    <span className="text-foreground-muted">from last month</span>
                                </div>
                            </CardContent>

                            {/* Corner Accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Articles */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
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
                                <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                                    <BarChart3 className="w-6 h-6 text-primary" />
                                    Recent Articles
                                </CardTitle>
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
                                    <p className="text-foreground-muted mb-2">No articles yet</p>
                                    <Link href="/admin/seo/articles/new/step-1-idea">
                                        <Button className="bg-gradient-to-r from-primary to-info text-background font-bold">
                                            Create First Article
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                            <div className="space-y-3">
                                {recentArticles.map((article, index) => (
                                    <motion.div
                                        key={article.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                        whileHover={{ x: 5 }}
                                        className="group/item relative overflow-hidden rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/5 hover:border-primary/30 p-4 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />

                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-3 flex-1">
                                                <article.icon className="w-5 h-5 text-success flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-semibold truncate">{article.title}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-success font-medium px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
                                                            {article.status}
                                                        </span>
                                                        <span className="text-xs text-foreground-muted flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            {article.views}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-foreground-muted group-hover/item:text-primary transition-colors flex-shrink-0 ml-2" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pending Tasks */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
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
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-primary" />
                                    Pending Tasks
                                </CardTitle>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-sm text-primary hover:text-info transition-colors font-semibold flex items-center gap-1"
                                >
                                    View All
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-center py-12">
                                <Clock className="w-12 h-12 text-foreground-muted/30 mx-auto mb-3" />
                                <p className="text-foreground-muted">No pending tasks</p>
                            </div>
                            {/* Uncomment when task system is implemented
                            <div className="space-y-3">
                                {pendingTasks.map((item, index) => (
                                    <motion.div
                                        key={item.task}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        whileHover={{ x: 5 }}
                                        className="group/item relative overflow-hidden rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/5 hover:border-warning/30 p-4 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className={`absolute inset-0 ${
                                            item.priority === 'high'
                                                ? 'bg-gradient-to-r from-error/5 to-transparent'
                                                : item.priority === 'medium'
                                                ? 'bg-gradient-to-r from-warning/5 to-transparent'
                                                : 'bg-gradient-to-r from-info/5 to-transparent'
                                        } opacity-0 group-hover/item:opacity-100 transition-opacity`} />

                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-3 flex-1">
                                                <item.icon className={`w-5 h-5 flex-shrink-0 ${
                                                    item.priority === 'high' ? 'text-error' :
                                                    item.priority === 'medium' ? 'text-warning' :
                                                    'text-info'
                                                }`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-semibold truncate">{item.task}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                                            item.priority === 'high'
                                                                ? 'text-error bg-error/10 border border-error/20'
                                                                : item.priority === 'medium'
                                                                ? 'text-warning bg-warning/10 border border-warning/20'
                                                                : 'text-info bg-info/10 border border-info/20'
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-foreground-muted group-hover/item:text-primary transition-colors flex-shrink-0 ml-2" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            */}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
