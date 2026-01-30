"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Landmark, Video, FileText, Search, Flame, Star, Play, BookOpen, Mail } from "lucide-react";
import { getPublishedArticles, getPillarArticles } from "@/lib/data/articles";

export default function ArticlesHubPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSilo, setSelectedSilo] = useState<string>("all");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [publishedArticles, setPublishedArticles] = useState<any[]>([]);
    const [silos, setSilos] = useState<any[]>([]);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Load articles from Supabase on client side
    useEffect(() => {
        async function loadArticles() {
            try {
                const loadedArticles = await getPublishedArticles();
                setPublishedArticles(loadedArticles);

            // Extract unique silos from articles
            const silosSet = new Set(loadedArticles.map(article => article.silo).filter(Boolean));
            const loadedSilos = Array.from(silosSet).map((siloName, index) => {
                const siloArticles = loadedArticles.filter(a => a.silo === siloName);
                return {
                    id: String(index + 1),
                    name: siloName as string,
                    slug: (siloName as string).toLowerCase().replace(/\s+/g, '-'),
                    description: `Explore our ${siloName} content`,
                    articleCount: siloArticles.length,
                    heroImage: `/images/silos/${(siloName as string).toLowerCase().replace(/\s+/g, '-')}.jpg`,
                    color: index % 2 === 0 ? "from-primary/20 to-info/20" : "from-info/20 to-primary/20",
                };
            });
            setSilos(loadedSilos);

            // Use the real published articles
            const formattedArticles = loadedArticles.map(article => ({
                ...article,
                siloSlug: article.silo?.toLowerCase().replace(/\s+/g, '-') || 'general',
                author: article.author || {
                    name: "Stephen Ten",
                    avatar: "/images/authors/stephen.jpg"
                },
                publishedDate: article.publishedAt || article.createdAt,
            }));
                setArticles(formattedArticles);
                setLoading(false);
            } catch (error) {
                console.error('Error loading articles:', error);
                setLoading(false);
            }
        }

        loadArticles();
    }, []);

    const filteredArticles = articles.filter(article => {
        const matchesSilo = selectedSilo === "all" || article.siloSlug === selectedSilo;
        const matchesSearch = searchQuery === "" ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSilo && matchesSearch;
    });

    const pillars = filteredArticles.filter(a => a.isSiloPillar);
    const regularArticles = filteredArticles.filter(a => !a.isSiloPillar);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-foreground-muted">Loading articles...</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (articles.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center max-w-lg px-4">
                    <span className="text-6xl mb-4 block">📝</span>
                    <h1 className="text-3xl font-bold text-foreground mb-4">No Articles Yet</h1>
                    <p className="text-foreground-muted mb-8">
                        Articles published through the SEO Engine will appear here. Head to the admin panel to create your first article!
                    </p>
                    <Link href="/admin/seo/articles">
                        <button className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                            Go to SEO Engine
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with AI Search */}
            <section className="relative overflow-hidden">
                {/* Video Background Placeholder */}
                <div className="absolute inset-0">
                    {/* Video would go here */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-info/20 to-primary/10 animate-pulse"
                        style={{ animationDuration: '4s' }}
                    />
                    {/* Video overlay gradient - 70% opacity */}
                    <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
                </div>

                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />

                <div className="relative px-4 py-16 md:py-24 lg:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-sm text-primary font-medium">AI-Powered Knowledge Base</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                            Insights That
                            <span className="text-primary"> Move You Forward</span>
                        </h1>
                        <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto mb-8">
                            Deep dives into AI, automation, and the tools transforming how we build.
                            No fluff, just actionable intelligence.
                        </p>

                        {/* AI Search Bar */}
                        <div className={`relative max-w-2xl mx-auto transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                            <div className={`absolute -inset-1 bg-gradient-to-r from-primary via-info to-primary rounded-2xl blur-lg transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-0'}`} />
                            <div className="relative flex items-center">
                                <div className="absolute left-4 flex items-center gap-2">
                                    <span className="text-xl"><Sparkles className="w-5 h-5 inline text-primary" /></span>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                    placeholder="Ask AI anything... 'Best AI coding tools' or 'How to automate my business'"
                                    className="w-full h-14 md:h-16 pl-14 pr-32 rounded-xl bg-background/80 backdrop-blur-xl border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-all"
                                    suppressHydrationWarning
                                />
                                <button className="absolute right-2 px-6 py-2 md:py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                                    Search
                                </button>
                            </div>

                            {/* Search Dropdown */}
                            {isSearchFocused && (
                                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-background border border-border shadow-2xl overflow-hidden z-50">
                                    {searchQuery.length > 0 ? (
                                        // Search Results
                                        <div className="p-2">
                                            <p className="text-xs text-foreground-muted px-3 py-2">
                                                {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} for "{searchQuery}"
                                            </p>
                                            {filteredArticles.slice(0, 5).map(article => (
                                                <Link
                                                    key={article.id}
                                                    href={`/articles/${article.slug}`}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-alt transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        {article.isSiloPillar ? <Landmark className="w-5 h-5 text-primary" /> : article.heroVideo ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">{article.title}</p>
                                                        <p className="text-xs text-foreground-muted">{article.silo} • {article.readTime} min</p>
                                                    </div>
                                                </Link>
                                            ))}
                                            {filteredArticles.length === 0 && (
                                                <div className="p-4 text-center text-foreground-muted">
                                                    <span className="text-2xl mb-2 block"><Search className="w-6 h-6 inline" /></span>
                                                    No articles found. Try a different search.
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        // Suggestions when empty
                                        <div className="p-4">
                                            <p className="text-xs text-foreground-muted mb-3"><Flame className="w-4 h-4 inline text-primary" /> Trending Topics</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {['AI Coding', 'Automation', 'SEO', 'Cursor', 'Claude'].map(term => (
                                                    <button
                                                        key={term}
                                                        onClick={() => setSearchQuery(term)}
                                                        className="px-3 py-1.5 rounded-full bg-background-alt text-foreground-muted text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                                                    >
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-xs text-foreground-muted mb-3"><Landmark className="w-5 h-5 inline text-primary" /> Topic Hubs</p>
                                            <div className="space-y-1">
                                                {silos.map(silo => (
                                                    <Link
                                                        key={silo.id}
                                                        href={`/topics/${silo.slug}`}
                                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-alt transition-colors"
                                                    >
                                                        <span><Landmark className="w-5 h-5 inline text-primary" /></span>
                                                        <span className="text-sm text-foreground">{silo.name}</span>
                                                        <span className="text-xs text-foreground-muted ml-auto">{silo.articleCount} articles</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Search Hint */}
                            <p className="text-xs text-foreground-muted mt-2">
                                Powered by semantic AI search • Understands context, not just keywords
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-10">
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-foreground">{articles.length}</p>
                                <p className="text-sm text-foreground-muted">Articles</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-primary">{silos.length}</p>
                                <p className="text-sm text-foreground-muted">Topic Hubs</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-foreground">15K+</p>
                                <p className="text-sm text-foreground-muted">Words Published</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Silo Filter Pills */}
            <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="px-4 py-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => setSelectedSilo("all")}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSilo === "all"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background-alt text-foreground-muted hover:text-foreground hover:bg-background-muted"
                                    }`}
                            >
                                All Topics
                            </button>
                            {silos.map(silo => (
                                <button
                                    key={silo.id}
                                    onClick={() => setSelectedSilo(silo.slug)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSilo === silo.slug
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-background-alt text-foreground-muted hover:text-foreground hover:bg-background-muted"
                                        }`}
                                >
                                    {silo.name} ({silo.articleCount})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Topic Hubs (Silos) */}
            {selectedSilo === "all" && (
                <section className="px-4 py-12 md:py-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground"><Landmark className="w-5 h-5 inline text-primary" /> Topic Hubs</h2>
                                <p className="text-foreground-muted mt-1">Deep-dive into our comprehensive topic clusters</p>
                            </div>
                            <Link href="/topics" className="text-primary hover:underline text-sm hidden md:block">
                                View all topics →
                            </Link>
                        </div>

                        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {silos.map(silo => (
                                <Link
                                    key={silo.id}
                                    href={`/topics/${silo.slug}`}
                                    className="group relative overflow-hidden rounded-2xl border border-border bg-background hover:border-primary/50 transition-all duration-300"
                                >
                                    {/* Gradient Background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${silo.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

                                    {/* Content */}
                                    <div className="relative p-6 md:p-8">
                                        <div className="flex items-start justify-between mb-4">
                                            <span className="text-4xl"><Landmark className="w-5 h-5 inline text-primary" /></span>
                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                                {silo.articleCount} articles
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                            {silo.name}
                                        </h3>
                                        <p className="text-foreground-muted text-sm line-clamp-2">
                                            {silo.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-4 text-primary text-sm font-medium">
                                            Explore hub
                                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Pillar Articles */}
            {pillars.length > 0 && (
                <section className="px-4 py-12 md:py-16 bg-background-alt/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-2xl"><Star className="w-6 h-6 inline fill-current text-primary" /></span>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Pillar Content</h2>
                                <p className="text-foreground-muted">Comprehensive guides on core topics</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:gap-8">
                            {pillars.map(article => (
                                <Link
                                    key={article.id}
                                    href={`/articles/${article.slug}`}
                                    className="group relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/5 via-background to-info/5 hover:from-primary/10 hover:to-info/10 transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image */}
                                        <div className="relative w-full md:w-80 lg:w-96 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                                            {article.heroVideo ? (
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <span className="text-5xl mb-2 block"><Video className="w-8 h-8 inline" /></span>
                                                        <span className="text-xs text-white/80">Video Header</span>
                                                    </div>
                                                </div>
                                            ) : article.heroImage ? (
                                                <img
                                                    src={article.heroImage}
                                                    alt={article.title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center">
                                                    <span className="text-5xl"><BookOpen className="w-12 h-12" /></span>
                                                </div>
                                            )}
                                            {/* Pillar Badge */}
                                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold z-10">
                                                <Landmark className="w-5 h-5 inline text-primary" /> PILLAR
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 md:p-8 flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-sm text-primary">{article.silo}</span>
                                                <span className="text-foreground-muted">•</span>
                                                <span className="text-sm text-foreground-muted">{article.readTime} min read</span>
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-foreground-muted line-clamp-2 mb-4">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <span className="text-sm">S</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{typeof article.author === 'string' ? article.author : article.author.name}</p>
                                                        <p className="text-xs text-foreground-muted">{article.publishedAt}</p>
                                                    </div>
                                                </div>
                                                <span className="text-primary font-medium group-hover:translate-x-1 transition-transform inline-block">
                                                    Read guide →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Regular Articles Grid */}
            <section className="px-4 py-12 md:py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">📚 Latest Articles</h2>
                            <p className="text-foreground-muted mt-1">
                                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                                Grid
                            </button>
                            <button className="px-3 py-2 rounded-lg bg-background-alt text-foreground-muted text-sm hover:text-foreground">
                                List
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {regularArticles.map(article => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.slug}`}
                                className="group rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                            >
                                {/* Image/Video */}
                                <div className="relative aspect-video bg-gradient-to-br from-background-alt to-background-muted overflow-hidden">
                                    {article.heroVideo ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-info/20">
                                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="text-2xl"><Play className="w-6 h-6 fill-current" /></span>
                                            </div>
                                        </div>
                                    ) : article.heroImage ? (
                                        <img
                                            src={article.heroImage}
                                            alt={article.title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-info/10">
                                            <span className="text-4xl"><FileText className="w-8 h-8 inline" /></span>
                                        </div>
                                    )}

                                    {/* Silo Badge */}
                                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium text-foreground">
                                        {article.silo}
                                    </div>

                                    {/* Depth Indicator */}
                                    {article.depth > 0 && (
                                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-info/80 text-xs font-medium text-white">
                                            Depth {article.depth}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-foreground-muted line-clamp-2 mb-4">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-foreground-muted">
                                        <div className="flex items-center gap-2">
                                            <span>{typeof article.author === 'string' ? article.author : article.author.name}</span>
                                            <span>•</span>
                                            <span>{article.publishedAt}</span>
                                        </div>
                                        <span>{article.readTime} min</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-12">
                        <button className="px-8 py-3 rounded-xl bg-background-alt border border-border text-foreground font-medium hover:border-primary/50 hover:bg-background-muted transition-all">
                            Load More Articles
                        </button>
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-info/10">
                <div className="max-w-2xl mx-auto text-center">
                    <span className="text-4xl mb-4 block"><Mail className="w-16 h-16 mx-auto text-primary" /></span>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Get Smarter Every Week
                    </h2>
                    <p className="text-foreground-muted mb-8">
                        Join 5,000+ builders receiving actionable AI insights, tool reviews, and automation strategies.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" suppressHydrationWarning>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
                            suppressHydrationWarning
                        />
                        <button className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                            Subscribe
                        </button>
                    </div>
                    <p className="text-xs text-foreground-muted mt-3">No spam. Unsubscribe anytime.</p>
                </div>
            </section>
        </div>
    );
}
