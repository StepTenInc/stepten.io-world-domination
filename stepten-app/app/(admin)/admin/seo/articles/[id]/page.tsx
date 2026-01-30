"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ArticleStatus = "draft" | "published" | "archived" | "deleted";

export default function ArticleDetailPage() {
    const params = useParams();
    const articleId = params.id as string;

    // Mock data - will come from database
    const [article, setArticle] = useState({
        id: articleId,
        title: "How AI is Transforming Small Business Operations in 2026",
        slug: "ai-transforming-small-business-2026",
        status: "published" as ArticleStatus,
        silo: "AI & Automation",
        isSiloPillar: false,
        depth: 1,
        wordCount: 1847,
        seoScore: 92,
        humanScore: 89,
        publishedAt: "2026-01-08",
        updatedAt: "2026-01-08",
        createdAt: "2026-01-05",
        mainKeyword: "AI automation small business",
        metaTitle: "How AI is Transforming Small Business Operations in 2026",
        metaDescription: "Discover how small businesses are leveraging AI automation tools to boost productivity by 40%. Practical implementation guide with ROI-focused strategies.",
        content: `# How AI is Transforming Small Business Operations in 2026

The landscape of business operations is undergoing a seismic shift. For small business owners who have watched from the sidelines as enterprise giants deployed AI solutions, the playing field is finally leveling.

## Why Small Businesses Need AI Now

Let me be blunt: if you're not exploring AI for your business in 2026, you're not just falling behind—you're actively choosing to compete with one hand tied behind your back.

## 5 AI Tools Every Small Business Should Consider

Having worked with dozens of small businesses on their AI journey, I've identified the tools that consistently deliver ROI without requiring a PhD in machine learning.

### 1. Customer Service Automation
The days of choosing between great customer service and manageable costs are over.

### 2. Marketing Automation
From email personalization to social media scheduling, AI has made sophisticated marketing accessible.`,
        internalLinks: [
            { title: "AI & Automation Pillar Page", slug: "/topics/ai-automation" },
            { title: "Best AI Tools 2026", slug: "/best-ai-tools-2026" },
        ],
        outboundLinks: [
            { title: "MIT AI Research on SMB Adoption", url: "https://mit.edu/ai-research" },
            { title: "Forbes: AI Tools for Small Business", url: "https://forbes.com/ai-small-business" },
        ],
        images: [
            { location: "Hero", status: "ready", altText: "AI technology merging with small business operations" },
            { location: "Section 1", status: "ready", altText: "AI analytics dashboard visualization" },
        ],
        schema: ["Article", "HowTo", "Organization"],
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(article.title);
    const [editedMetaTitle, setEditedMetaTitle] = useState(article.metaTitle);
    const [editedMetaDescription, setEditedMetaDescription] = useState(article.metaDescription);
    const [activeTab, setActiveTab] = useState<"overview" | "content" | "seo" | "media" | "settings">("overview");

    const statusConfig = {
        draft: { label: "Draft", color: "bg-warning/10 text-warning border-warning/30", icon: "📝" },
        published: { label: "Published", color: "bg-success/10 text-success border-success/30", icon: "🟢" },
        archived: { label: "Archived", color: "bg-foreground-muted/10 text-foreground-muted border-foreground-muted/30", icon: "📦" },
        deleted: { label: "Deleted", color: "bg-error/10 text-error border-error/30", icon: "🗑️" },
    };

    const silos = ["AI & Automation", "SEO Strategy", "Marketing", "Business Growth"];

    const handleStatusChange = (newStatus: ArticleStatus) => {
        setArticle(prev => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString().split("T")[0] }));
    };

    const handleSave = () => {
        setArticle(prev => ({
            ...prev,
            title: editedTitle,
            metaTitle: editedMetaTitle,
            metaDescription: editedMetaDescription,
            updatedAt: new Date().toISOString().split("T")[0],
        }));
        setIsEditing(false);
    };

    const getDepthLabel = (depth: number, isPillar: boolean) => {
        if (isPillar) return "🏛️ Pillar (Top of Silo)";
        return `↳ Depth ${depth} (Under Pillar)`;
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/seo/articles" className="text-foreground-muted hover:text-foreground">
                        ← Back
                    </Link>
                    <div>
                        {isEditing ? (
                            <Input
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="text-2xl font-bold bg-background-alt border-border"
                            />
                        ) : (
                            <h1 className="text-2xl font-bold text-foreground">{article.title}</h1>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-1 rounded text-xs border ${statusConfig[article.status].color}`}>
                                {statusConfig[article.status].icon} {statusConfig[article.status].label}
                            </span>
                            <span className="text-sm text-foreground-muted">/{article.slug}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                className="border-border text-foreground"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="bg-primary text-primary-foreground"
                            >
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="border-border text-foreground"
                            >
                                ✏️ Edit
                            </Button>
                            {article.status === "draft" && (
                                <Button
                                    onClick={() => handleStatusChange("published")}
                                    className="bg-success text-white hover:bg-success/90"
                                >
                                    🚀 Publish
                                </Button>
                            )}
                            {article.status === "published" && (
                                <Button
                                    onClick={() => handleStatusChange("draft")}
                                    className="bg-warning text-black hover:bg-warning/90"
                                >
                                    ↩️ Unpublish
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-lg bg-background-alt w-fit">
                {(["overview", "content", "seo", "media", "settings"] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded text-sm font-medium capitalize transition-colors ${activeTab === tab
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground-muted hover:text-foreground"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Score Cards */}
                        <div className="grid gap-4 sm:grid-cols-3">
                            <Card className="border-border bg-background">
                                <CardContent className="py-4 text-center">
                                    <p className="text-sm text-foreground-muted">SEO Score</p>
                                    <p className="text-3xl font-bold text-primary">{article.seoScore}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-border bg-background">
                                <CardContent className="py-4 text-center">
                                    <p className="text-sm text-foreground-muted">Human Score</p>
                                    <p className="text-3xl font-bold text-info">{article.humanScore}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-border bg-background">
                                <CardContent className="py-4 text-center">
                                    <p className="text-sm text-foreground-muted">Word Count</p>
                                    <p className="text-3xl font-bold text-foreground">{article.wordCount}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Content Preview */}
                        <Card className="border-border bg-background">
                            <CardHeader>
                                <CardTitle className="text-foreground">Content Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-invert max-w-none p-4 rounded-lg bg-background-alt border border-border max-h-[400px] overflow-y-auto">
                                    <div className="whitespace-pre-wrap text-foreground text-sm">
                                        {article.content}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Links */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Card className="border-border bg-background">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-foreground text-lg">🔁 Internal Links</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {article.internalLinks.map((link, i) => (
                                            <div key={i} className="flex items-center gap-2 p-2 rounded bg-background-alt">
                                                <span className="text-primary">↗️</span>
                                                <div>
                                                    <p className="text-foreground text-sm">{link.title}</p>
                                                    <p className="text-xs text-foreground-muted">{link.slug}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-border bg-background">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-foreground text-lg">🔗 Outbound Links</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {article.outboundLinks.map((link, i) => (
                                            <div key={i} className="flex items-center gap-2 p-2 rounded bg-background-alt">
                                                <span className="text-info">🌐</span>
                                                <div>
                                                    <p className="text-foreground text-sm">{link.title}</p>
                                                    <p className="text-xs text-foreground-muted truncate max-w-[200px]">{link.url}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Silo Info */}
                        <Card className="border-primary/30 bg-primary/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-foreground text-lg flex items-center gap-2">
                                    <span>🗂️</span> Silo Structure
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs text-foreground-muted">Silo</p>
                                    <p className="text-foreground font-medium">{article.silo}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-foreground-muted">Position</p>
                                    <p className="text-foreground">{getDepthLabel(article.depth, article.isSiloPillar)}</p>
                                </div>
                                {!article.isSiloPillar && (
                                    <div className="p-2 rounded bg-background-alt">
                                        <p className="text-xs text-foreground-muted">Parent Pillar</p>
                                        <p className="text-sm text-primary">The Complete Guide to AI & Automation</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status Actions */}
                        <Card className="border-border bg-background">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-foreground text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {article.status !== "draft" && (
                                    <Button
                                        variant="outline"
                                        onClick={() => handleStatusChange("draft")}
                                        className="w-full justify-start border-warning/30 text-warning hover:bg-warning/10"
                                    >
                                        📝 Move to Draft
                                    </Button>
                                )}
                                {article.status !== "published" && (
                                    <Button
                                        variant="outline"
                                        onClick={() => handleStatusChange("published")}
                                        className="w-full justify-start border-success/30 text-success hover:bg-success/10"
                                    >
                                        🟢 Publish
                                    </Button>
                                )}
                                {article.status !== "archived" && (
                                    <Button
                                        variant="outline"
                                        onClick={() => handleStatusChange("archived")}
                                        className="w-full justify-start border-foreground-muted/30 text-foreground-muted hover:bg-foreground-muted/10"
                                    >
                                        📦 Archive
                                    </Button>
                                )}
                                {article.status !== "deleted" && (
                                    <Button
                                        variant="outline"
                                        onClick={() => handleStatusChange("deleted")}
                                        className="w-full justify-start border-error/30 text-error hover:bg-error/10"
                                    >
                                        🗑️ Delete
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Dates */}
                        <Card className="border-border bg-background">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-foreground text-lg">Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-foreground-muted">Created</span>
                                    <span className="text-foreground">{article.createdAt}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground-muted">Updated</span>
                                    <span className="text-foreground">{article.updatedAt}</span>
                                </div>
                                {article.publishedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-foreground-muted">Published</span>
                                        <span className="text-success">{article.publishedAt}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Re-optimize */}
                        <Card className="border-info/30 bg-info/5">
                            <CardContent className="py-4">
                                <p className="text-foreground font-medium mb-2">Need to Update?</p>
                                <p className="text-sm text-foreground-muted mb-3">
                                    Run through the optimization steps again
                                </p>
                                <div className="space-y-1">
                                    <Link href={`/admin/seo/articles/new/step-5-humanize`}>
                                        <Button variant="outline" size="sm" className="w-full justify-start border-border">
                                            🧠 Re-Humanize
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/seo/articles/new/step-6-optimize`}>
                                        <Button variant="outline" size="sm" className="w-full justify-start border-border">
                                            ⚡ Re-Optimize SEO
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
                <div className="space-y-6">
                    {/* Meta Data */}
                    <Card className="border-border bg-background">
                        <CardHeader>
                            <CardTitle className="text-foreground">Meta Data</CardTitle>
                            <CardDescription>Edit title and description for search results</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium text-foreground">Meta Title</label>
                                    <span className={`text-xs ${editedMetaTitle.length <= 60 ? "text-success" : "text-warning"}`}>
                                        {editedMetaTitle.length}/60
                                    </span>
                                </div>
                                <Input
                                    value={editedMetaTitle}
                                    onChange={(e) => setEditedMetaTitle(e.target.value)}
                                    className="bg-background-alt border-border text-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium text-foreground">Meta Description</label>
                                    <span className={`text-xs ${editedMetaDescription.length <= 160 ? "text-success" : "text-warning"}`}>
                                        {editedMetaDescription.length}/160
                                    </span>
                                </div>
                                <textarea
                                    value={editedMetaDescription}
                                    onChange={(e) => setEditedMetaDescription(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-background-alt border border-border text-foreground resize-none h-20"
                                />
                            </div>
                            {/* SERP Preview */}
                            <div className="p-4 rounded-lg bg-background-alt border border-border">
                                <p className="text-xs text-foreground-muted mb-2">Search Preview</p>
                                <div className="space-y-1">
                                    <p className="text-info text-lg hover:underline cursor-pointer">{editedMetaTitle}</p>
                                    <p className="text-xs text-success">stepten.io › {article.slug}</p>
                                    <p className="text-sm text-foreground-muted">{editedMetaDescription}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schema */}
                    <Card className="border-border bg-background">
                        <CardHeader>
                            <CardTitle className="text-foreground">Schema Markup</CardTitle>
                            <CardDescription>Active structured data for this article</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {article.schema.map(s => (
                                    <span key={s} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                        ✓ {s}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Keyword */}
                    <Card className="border-border bg-background">
                        <CardHeader>
                            <CardTitle className="text-foreground">Target Keyword</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/30">
                                <p className="text-primary font-medium">{article.mainKeyword}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
                <Card className="border-border bg-background">
                    <CardHeader>
                        <CardTitle className="text-foreground">Article Content</CardTitle>
                        <CardDescription>Full article in markdown format</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            value={article.content}
                            onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full h-[600px] p-4 rounded-lg bg-background-alt border border-border text-foreground font-mono text-sm resize-none"
                        />
                    </CardContent>
                </Card>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
                <div className="space-y-6">
                    <Card className="border-border bg-background">
                        <CardHeader>
                            <CardTitle className="text-foreground">Article Images</CardTitle>
                            <CardDescription>All images used in this article</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {article.images.map((img, i) => (
                                    <div key={i} className="aspect-video rounded-lg bg-background-alt border border-border flex flex-col items-center justify-center">
                                        <span className="text-4xl mb-2">🖼️</span>
                                        <p className="text-foreground font-medium">{img.location}</p>
                                        <p className="text-xs text-foreground-muted mt-1">Alt: {img.altText}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
                <div className="space-y-6">
                    {/* Silo Settings */}
                    <Card className="border-border bg-background">
                        <CardHeader>
                            <CardTitle className="text-foreground">Silo Structure</CardTitle>
                            <CardDescription>Configure topical authority relationships</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Silo Assignment</label>
                                <select
                                    value={article.silo || ""}
                                    onChange={(e) => setArticle(prev => ({ ...prev, silo: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg bg-background-alt border border-border text-foreground"
                                >
                                    {silos.map(silo => (
                                        <option key={silo} value={silo}>{silo}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Article Type</label>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <button
                                        onClick={() => setArticle(prev => ({ ...prev, isSiloPillar: true, depth: 0 }))}
                                        className={`p-4 rounded-lg border text-left transition-colors ${article.isSiloPillar
                                            ? "bg-primary/10 border-primary/30"
                                            : "bg-background-alt border-border hover:border-primary/30"
                                            }`}
                                    >
                                        <p className="font-medium text-foreground">🏛️ Pillar Content</p>
                                        <p className="text-xs text-foreground-muted mt-1">Top of silo, main topic hub</p>
                                    </button>
                                    <button
                                        onClick={() => setArticle(prev => ({ ...prev, isSiloPillar: false, depth: 1 }))}
                                        className={`p-4 rounded-lg border text-left transition-colors ${!article.isSiloPillar
                                            ? "bg-primary/10 border-primary/30"
                                            : "bg-background-alt border-border hover:border-primary/30"
                                            }`}
                                    >
                                        <p className="font-medium text-foreground">📄 Supporting Content</p>
                                        <p className="text-xs text-foreground-muted mt-1">Linked under pillar</p>
                                    </button>
                                </div>
                            </div>

                            {!article.isSiloPillar && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Depth Level</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setArticle(prev => ({ ...prev, depth: d }))}
                                                className={`px-4 py-2 rounded-lg border transition-colors ${article.depth === d
                                                    ? "bg-primary/10 border-primary/30 text-primary"
                                                    : "bg-background-alt border-border text-foreground-muted hover:text-foreground"
                                                    }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-foreground-muted">
                                        Depth 1 = directly under pillar, higher = more specific subtopic
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-error/30 bg-error/5">
                        <CardHeader>
                            <CardTitle className="text-error">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="outline"
                                onClick={() => handleStatusChange("archived")}
                                className="w-full justify-start border-foreground-muted/30 text-foreground-muted"
                            >
                                📦 Archive Article (Remove from site, keep in system)
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleStatusChange("deleted")}
                                className="w-full justify-start border-error/30 text-error"
                            >
                                🗑️ Delete Article (Mark for deletion)
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
