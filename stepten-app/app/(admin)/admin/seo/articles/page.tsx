"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    FileText,
    CheckCircle2,
    Archive,
    Trash2,
    Search,
    LayoutList,
    LayoutGrid,
    Plus,
    Edit,
    Send,
    Sparkles,
    TrendingUp,
    Landmark
} from "lucide-react";
import { Article } from "@/lib/data/articles";
import { seoStorage } from "@/lib/seo-storage";

type ArticleStatus = "draft" | "published" | "archived" | "deleted";

export default function ArticlesPage() {
    const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSilo, setSelectedSilo] = useState<string>("all");
    const [draggedArticle, setDraggedArticle] = useState<Article | null>(null);

    // Use real articles from localStorage (no mock data)
    const [articles, setArticles] = useState<Article[]>([]);

    // Load articles from localStorage on mount
    useEffect(() => {
        const loadedArticles = seoStorage.getAllArticles();
        setArticles(loadedArticles);
    }, []);

    const silos = ["all", "AI & Automation", "SEO Strategy", "Marketing", "Business Growth"];

    const statusConfig = {
        draft: { label: "Draft", color: "bg-warning/10 text-warning border-warning/30", icon: FileText, gradient: "from-warning/20 to-primary/20" },
        published: { label: "Published", color: "bg-success/10 text-success border-success/30", icon: CheckCircle2, gradient: "from-success/20 to-primary/20" },
        archived: { label: "Archived", color: "bg-foreground-muted/10 text-foreground-muted border-foreground-muted/30", icon: Archive, gradient: "from-gray-500/20 to-gray-400/20" },
        deleted: { label: "Deleted", color: "bg-error/10 text-error border-error/30", icon: Trash2, gradient: "from-error/20 to-warning/20" },
    };

    const getArticlesByStatus = (status: ArticleStatus) =>
        articles.filter(a => a.status === status && (selectedSilo === "all" || a.silo === selectedSilo));

    const handleDragStart = (article: Article) => {
        setDraggedArticle(article);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetStatus: ArticleStatus) => {
        if (draggedArticle && draggedArticle.status !== targetStatus) {
            setArticles(prev =>
                prev.map(a =>
                    a.id === draggedArticle.id
                        ? { ...a, status: targetStatus, updatedAt: new Date().toISOString().split("T")[0] }
                        : a
                )
            );
        }
        setDraggedArticle(null);
    };

    const filteredArticles = articles.filter(a =>
        (selectedSilo === "all" || a.silo === selectedSilo) &&
        (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.mainKeyword.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getDepthBadge = (depth: number, isPillar: boolean) => {
        if (isPillar) return (
            <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary font-medium border border-primary/30 flex items-center gap-1">
                <Landmark className="w-3 h-3" />
                Pillar
            </span>
        );
        if (depth === 1) return <span className="px-2 py-0.5 rounded text-xs bg-info/10 text-info border border-info/20">↳ Depth 1</span>;
        if (depth === 2) return <span className="px-2 py-0.5 rounded text-xs bg-info/10 text-info border border-info/20">↳↳ Depth 2</span>;
        if (depth >= 3) return <span className="px-2 py-0.5 rounded text-xs bg-info/10 text-info border border-info/20">↳↳↳ Depth {depth}</span>;
        return null;
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
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
                        Articles
                    </h1>
                    <p className="text-foreground-muted text-lg">Manage your SEO content library</p>
                </div>
                <Link href="/admin/seo/articles/new/step-1-idea">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/30 font-bold relative overflow-hidden group h-12 px-6">
                            <span className="relative z-10 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                New Article
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </Button>
                    </motion.div>
                </Link>
            </motion.div>

            {/* Filters & View Toggle */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-wrap items-center justify-between gap-4"
            >
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 h-10 pl-9 pr-3 rounded-lg bg-background-alt border border-border text-foreground text-sm placeholder:text-foreground-muted focus:border-primary focus:outline-none transition-all"
                            suppressHydrationWarning
                        />
                    </div>

                    {/* Silo Filter */}
                    <select
                        value={selectedSilo}
                        onChange={(e) => setSelectedSilo(e.target.value)}
                        className="h-10 px-3 rounded-lg bg-background-alt border border-border text-foreground hover:border-primary/50 transition-colors"
                        suppressHydrationWarning
                    >
                        {silos.map(silo => (
                            <option key={silo} value={silo}>
                                {silo === "all" ? "All Silos" : silo}
                            </option>
                        ))}
                    </select>
                </div>

                {/* View Toggle */}
                <div className="flex gap-1 p-1 rounded-lg bg-background-alt border border-border">
                    <motion.button
                        onClick={() => setViewMode("list")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "list"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground-muted hover:text-foreground"
                            }`}
                    >
                        <LayoutList className="w-4 h-4" />
                        List
                    </motion.button>
                    <motion.button
                        onClick={() => setViewMode("kanban")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "kanban"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground-muted hover:text-foreground"
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Kanban
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid gap-6 sm:grid-cols-4">
                {(["draft", "published", "archived", "deleted"] as ArticleStatus[]).map((status, index) => {
                    const StatusIcon = statusConfig[status].icon;
                    return (
                        <motion.div
                            key={status}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="group relative"
                        >
                            {/* Glow Effect */}
                            <motion.div
                                className={`absolute -inset-0.5 bg-gradient-to-r ${statusConfig[status].gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
                                whileHover={{ scale: 1.02 }}
                            />

                            <Card className={`relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border hover:border-primary/30 transition-all duration-300 overflow-hidden ${statusConfig[status].color}`}>
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <CardContent className="py-4 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-foreground-muted uppercase tracking-wider font-semibold">{statusConfig[status].label}</p>
                                            <p className="text-3xl font-black text-white mt-1">
                                                {getArticlesByStatus(status).length}
                                            </p>
                                        </div>
                                        <motion.div
                                            className={`p-3 rounded-xl border ${statusConfig[status].color}`}
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <StatusIcon className="w-6 h-6" />
                                        </motion.div>
                                    </div>
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* List View */}
            {viewMode === "list" && (
                <Card className="border-border bg-background">
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border text-sm text-foreground-muted">
                                    <th className="text-left p-4 font-medium">Article</th>
                                    <th className="text-left p-4 font-medium">Silo / Depth</th>
                                    <th className="text-left p-4 font-medium">Status</th>
                                    <th className="text-left p-4 font-medium">SEO</th>
                                    <th className="text-left p-4 font-medium">Updated</th>
                                    <th className="text-right p-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredArticles.map((article) => (
                                    <tr key={article.id} className="border-b border-border hover:bg-background-alt/50 transition-colors">
                                        <td className="p-4">
                                            <div>
                                                <Link
                                                    href={`/admin/seo/articles/${article.id}`}
                                                    className="text-foreground font-medium hover:text-primary"
                                                >
                                                    {article.title}
                                                </Link>
                                                <p className="text-xs text-foreground-muted mt-0.5">
                                                    /{article.slug} • {article.wordCount} words
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <span className="text-sm text-foreground">{article.silo}</span>
                                                <div>{getDepthBadge(article.depth, article.isSiloPillar)}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs border ${statusConfig[article.status].color} flex items-center gap-1 inline-flex`}>
                                                {(() => {
                                                    const StatusIcon = statusConfig[article.status].icon;
                                                    return <StatusIcon className="w-3 h-3" />;
                                                })()}
                                                {statusConfig[article.status].label}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-foreground-muted">SEO</span>
                                                    <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full"
                                                            style={{ width: `${article.seoScore}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-foreground">{article.seoScore}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-foreground-muted">Human</span>
                                                    <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-info rounded-full"
                                                            style={{ width: `${article.humanScore}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-foreground">{article.humanScore}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-foreground-muted">{article.updatedAt}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/seo/articles/${article.id}`}>
                                                    <button className="px-2 py-1 rounded text-xs bg-background-alt text-foreground hover:bg-background-muted">
                                                        Edit
                                                    </button>
                                                </Link>
                                                {article.status === "draft" && (
                                                    <button
                                                        onClick={() => setArticles(prev =>
                                                            prev.map(a => a.id === article.id ? { ...a, status: "published" as ArticleStatus } : a)
                                                        )}
                                                        className="px-2 py-1 rounded text-xs bg-success/10 text-success hover:bg-success/20"
                                                    >
                                                        Publish
                                                    </button>
                                                )}
                                                {article.status === "published" && (
                                                    <button
                                                        onClick={() => setArticles(prev =>
                                                            prev.map(a => a.id === article.id ? { ...a, status: "archived" as ArticleStatus } : a)
                                                        )}
                                                        className="px-2 py-1 rounded text-xs bg-foreground-muted/10 text-foreground-muted hover:bg-foreground-muted/20"
                                                    >
                                                        Archive
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredArticles.length === 0 && (
                            <div className="p-12 text-center text-foreground-muted">
                                No articles found
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Kanban View */}
            {viewMode === "kanban" && (
                <div className="grid gap-4 lg:grid-cols-4">
                    {(["draft", "published", "archived", "deleted"] as ArticleStatus[]).map(status => (
                        <div
                            key={status}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(status)}
                            className={`rounded-lg border-2 border-dashed transition-colors min-h-[400px] ${draggedArticle ? "border-primary/50 bg-primary/5" : "border-border"
                                }`}
                        >
                            {/* Column Header */}
                            <div className={`p-3 rounded-t-lg border-b ${statusConfig[status].color}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const StatusIcon = statusConfig[status].icon;
                                            return <StatusIcon className="w-4 h-4" />;
                                        })()}
                                        <span className="font-medium">{statusConfig[status].label}</span>
                                    </div>
                                    <span className="text-sm px-2 py-0.5 rounded bg-background/50 font-bold">
                                        {getArticlesByStatus(status).length}
                                    </span>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="p-2 space-y-2">
                                {getArticlesByStatus(status).map(article => (
                                    <div
                                        key={article.id}
                                        draggable
                                        onDragStart={() => handleDragStart(article)}
                                        className={`p-3 rounded-lg bg-background border border-border hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all ${draggedArticle?.id === article.id ? "opacity-50 scale-95" : ""
                                            }`}
                                    >
                                        {/* Silo Badge */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs px-2 py-0.5 rounded bg-background-alt text-foreground-muted">
                                                {article.silo}
                                            </span>
                                            {getDepthBadge(article.depth, article.isSiloPillar)}
                                        </div>

                                        {/* Title */}
                                        <Link href={`/admin/seo/articles/${article.id}`}>
                                            <h3 className="text-foreground font-medium text-sm hover:text-primary line-clamp-2">
                                                {article.title}
                                            </h3>
                                        </Link>

                                        {/* Stats */}
                                        <div className="flex items-center gap-3 mt-2 text-xs text-foreground-muted">
                                            <span>{article.wordCount} words</span>
                                            <span>SEO {article.seoScore}</span>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border">
                                            <Link href={`/admin/seo/articles/${article.id}`} className="flex-1">
                                                <button className="w-full px-2 py-1 rounded text-xs bg-background-alt text-foreground hover:bg-background-muted">
                                                    Edit
                                                </button>
                                            </Link>
                                            {article.status === "draft" && (
                                                <button
                                                    onClick={() => setArticles(prev =>
                                                        prev.map(a => a.id === article.id ? { ...a, status: "published" as ArticleStatus } : a)
                                                    )}
                                                    className="px-2 py-1 rounded text-xs bg-success/10 text-success"
                                                >
                                                    Publish
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {getArticlesByStatus(status).length === 0 && (
                                    <div className="p-4 text-center text-xs text-foreground-muted">
                                        Drop articles here
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
