"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPublishedArticles } from "@/lib/data/articles";

// Fallback mock article data if no match found
const mockArticle = {
    id: "1",
    title: "Antigravity IDE: The Future of AI-Powered Coding",
    slug: "antigravity-ide-future-ai-coding",
    excerpt: "Discover how Antigravity is revolutionizing the developer experience with its groundbreaking AI capabilities.",
    content: `
## The Dawn of AI-Native Development

The development landscape is undergoing its biggest transformation since the advent of version control. I've spent the last three months deep in the trenches with **Antigravity IDE**, and I can confidently say: this is the future we've been waiting for.

### Why Traditional IDEs Are Dying

Let me be blunt: if you're still using a traditional IDE without AI augmentation in 2026, you're handicapping yourself. Here's why:

1. **Context switching kills productivity** - Traditional IDEs force you to constantly shift between documentation, Stack Overflow, and your code
2. **Boilerplate is a waste of human creativity** - AI should handle the mundane so you can focus on the interesting problems
3. **Code review bottlenecks slow teams down** - AI can catch 80% of issues before human review

> "The best code is the code you never have to write." - Every developer, eventually

### What Makes Antigravity Different

Unlike Cursor or Copilot, Antigravity doesn't just autocomplete—it **understands**. Here's what I mean:

- **Full codebase awareness**: It knows your entire project, not just the current file
- **Architectural reasoning**: It can suggest refactors that consider your whole system
- **Voice-first interaction**: Yes, you can literally talk to your IDE

![AI Code Generation](/images/articles/antigravity-demo.jpg)

The image above shows Antigravity generating a complete API endpoint from a voice description. No typing required.

## Real-World Performance

I ran a controlled experiment with my team. The results were staggering:

| Metric | Traditional IDE | Antigravity |
|--------|----------------|-------------|
| Lines of code/hour | 45 | 127 |
| Bugs caught pre-commit | 23% | 78% |
| Time to first PR | 4.2 hours | 1.1 hours |

### The Learning Curve

Be prepared for about 2-3 days of adjustment. The paradigm shift from "typing everything" to "describing intent" takes some mental rewiring. But once it clicks, you won't go back.

## Pricing and Value

At $49/month for the Pro tier, it's paying for itself within the first few hours of use. Compare that to your hourly rate—the math is obvious.

### Who Should Use Antigravity?

- ✅ Full-stack developers
- ✅ Teams shipping fast
- ✅ Anyone tired of boilerplate
- ❌ Developers who don't want AI assistance (rare breed in 2026)

## Getting Started

Here's my recommended onboarding flow:

1. Install the extension (5 minutes)
2. Complete the interactive tutorial (15 minutes)
3. Refactor one existing function using AI (20 minutes)
4. You're hooked

## Conclusion

Antigravity isn't just an IDE—it's an AI pair programmer that actually feels like a 10x developer sitting next to you. After three months, I can't imagine going back.

**Ready to level up?** [Get started with Antigravity →](#)
    `,
    heroImage: "/images/articles/antigravity-hero.jpg",
    heroVideo: "https://example.com/antigravity-demo.mp4", // Would be actual video URL
    heroVideoThumbnail: "/images/articles/antigravity-thumb.jpg",
    silo: "AI Coding Tools",
    siloSlug: "ai-coding-tools",
    isSiloPillar: false,
    depth: 1,
    parentArticle: {
        title: "The Complete Guide to AI Coding Tools",
        slug: "complete-guide-ai-coding-tools",
    },
    author: {
        name: "Stephen Atcheler",
        slug: "stephen-atcheler",
        avatar: "/images/avatar.jpg",
        bio: "Builder. Investor. AI & Automation Obsessed. 20+ years building businesses.",
    },
    publishedAt: "January 10, 2026",
    updatedAt: "January 10, 2026",
    readingTime: 8,
    wordCount: 1847,
    metaTitle: "Antigravity IDE: The Future of AI-Powered Coding in 2026",
    metaDescription: "Discover how Antigravity IDE is revolutionizing the developer experience with groundbreaking AI capabilities that feel like magic.",
    schema: {
        "@type": "Article",
        headline: "Antigravity IDE: The Future of AI-Powered Coding",
    },
};

const relatedArticles = [
    {
        id: "2",
        title: "Cursor vs Copilot: Which AI Coding Assistant Wins?",
        slug: "cursor-vs-copilot-2026",
        excerpt: "An in-depth comparison of the two giants in AI-assisted development.",
        readingTime: 12,
    },
    {
        id: "3",
        title: "Claude Code: The AI That Understands Your Codebase",
        slug: "claude-code-understands-codebase",
        excerpt: "How Anthropic's Claude is changing the game with contextual code understanding.",
        readingTime: 10,
    },
    {
        id: "4",
        title: "Complete Guide to AI Coding Tools",
        slug: "complete-guide-ai-coding-tools",
        excerpt: "Your comprehensive pillar guide to every AI coding tool worth knowing.",
        readingTime: 25,
        isPillar: true,
    },
];

const relatedProducts = [
    {
        id: "1",
        name: "AI Developer Toolkit",
        description: "My personal toolkit for AI-augmented development",
        price: "$47",
        link: "#",
    },
    {
        id: "2",
        name: "IDE Mastery Course",
        description: "Master any AI-native IDE in 7 days",
        price: "$197",
        link: "#",
    },
];

export default function ArticlePage() {
    const params = useParams();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const slug = params.slug as string;

    // Load article from Supabase database (via API)
    useEffect(() => {
        const loadArticle = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch article from database via API
                const response = await fetch(`/api/articles/${slug}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setArticle(null);
                        setLoading(false);
                        return;
                    }
                    throw new Error(`Failed to load article: ${response.status}`);
                }

                const data = await response.json();

                if (!data.success || !data.article) {
                    setArticle(null);
                    setLoading(false);
                    return;
                }

                const foundArticle = data.article;

                // Format dates
                let formattedPublishedAt = 'Draft';
                let formattedUpdatedAt = 'Draft';

                if (foundArticle.publishedAt) {
                    try {
                        formattedPublishedAt = new Date(foundArticle.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    } catch (e) {
                        formattedPublishedAt = foundArticle.publishedAt;
                    }
                }

                if (foundArticle.updatedAt) {
                    try {
                        formattedUpdatedAt = new Date(foundArticle.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    } catch (e) {
                        formattedUpdatedAt = foundArticle.updatedAt;
                    }
                }

                setArticle({
                    ...foundArticle,
                    heroVideo: foundArticle.heroVideo || null,
                    heroVideoThumbnail: foundArticle.heroImage,
                    siloSlug: foundArticle.silo?.toLowerCase().replace(/\s+/g, '-') || 'general',
                    parentArticle: null,
                    publishedAt: formattedPublishedAt,
                    updatedAt: formattedUpdatedAt,
                    readingTime: foundArticle.readingTime || Math.ceil(foundArticle.wordCount / 200),
                    metaTitle: foundArticle.metaTitle || foundArticle.title,
                    metaDescription: foundArticle.metaDescription || foundArticle.excerpt || '',
                    author: foundArticle.author || {
                        name: "Stephen Ten",
                        slug: "stephen-ten",
                        avatar: "/images/stepten-logo.png",
                        bio: "Builder. Investor. AI & Automation Obsessed. 20+ years building businesses.",
                    },
                    schema: {
                        "@type": "Article",
                        headline: foundArticle.title,
                    }
                });

                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setArticle(null);
                setLoading(false);
            }
        };

        loadArticle();
    }, [slug]);

    // Scroll progress tracking
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            setScrollProgress(Math.min(progress, 100));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-foreground-muted">Loading article...</p>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center max-w-lg px-4">
                    <span className="text-6xl mb-4 block">🔍</span>
                    <h1 className="text-4xl font-bold text-foreground mb-4">Article Not Found</h1>
                    <p className="text-foreground-muted mb-6">
                        The article you're looking for doesn't exist or hasn't been published yet.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/articles">
                            <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                                ← Back to Articles
                            </button>
                        </Link>
                        <Link href="/admin/seo/articles">
                            <button className="px-6 py-3 rounded-xl bg-background-alt border border-border text-foreground font-medium hover:bg-background-muted transition-colors">
                                Go to SEO Engine
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Convert markdown to styled HTML (simplified)
    const renderContent = (content: string) => {
        // Check if content is already HTML
        if (content.includes('<p>') || content.includes('<h2>') || content.includes('<div>')) {
            return (
                <div
                    className="prose prose-invert prose-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            );
        }

        // Otherwise, parse as markdown
        return content
            .split('\n\n')
            .map((paragraph, i) => {
                // Headers
                if (paragraph.startsWith('## ')) {
                    return (
                        <h2 key={i} className="text-3xl font-bold text-primary mb-4 mt-8 pb-3 border-b border-white/10">
                            {paragraph.replace('## ', '')}
                        </h2>
                    );
                }
                if (paragraph.startsWith('### ')) {
                    return (
                        <h3 key={i} className="text-2xl font-semibold text-info mb-3 mt-6">
                            {paragraph.replace('### ', '')}
                        </h3>
                    );
                }
                // Blockquote
                if (paragraph.startsWith('> ')) {
                    return (
                        <blockquote key={i} className="border-l-4 border-primary pl-4 py-2 my-6 italic text-foreground-muted bg-primary/5 rounded-r-lg">
                            {paragraph.replace('> ', '')}
                        </blockquote>
                    );
                }
                // Lists
                if (paragraph.includes('\n1. ') || paragraph.includes('\n- ')) {
                    const items = paragraph.split('\n').filter(line => line.match(/^(\d+\.|-)/));
                    return (
                        <ul key={i} className="space-y-2 my-4 ml-4">
                            {items.map((item, j) => (
                                <li key={j} className="flex items-start gap-2 text-foreground-muted">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{item.replace(/^(\d+\.|-)\s*/, '')}</span>
                                </li>
                            ))}
                        </ul>
                    );
                }
                // Image
                if (paragraph.includes('![')) {
                    const match = paragraph.match(/!\[(.*?)\]\((.*?)\)/);
                    if (match) {
                        return (
                            <figure key={i} className="my-8">
                                <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center border border-border">
                                    <span className="text-4xl">🖼️</span>
                                </div>
                                <figcaption className="text-center text-sm text-foreground-muted mt-2">
                                    {match[1]}
                                </figcaption>
                            </figure>
                        );
                    }
                }
                // Table
                if (paragraph.includes('|')) {
                    const rows = paragraph.split('\n').filter(line => line.includes('|'));
                    if (rows.length > 1) {
                        return (
                            <div key={i} className="my-8 overflow-x-auto">
                                <table className="w-full border-collapse rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-primary/10">
                                            {rows[0].split('|').filter(Boolean).map((cell, j) => (
                                                <th key={j} className="px-4 py-3 text-left text-foreground font-semibold border-b border-border">
                                                    {cell.trim()}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.slice(2).map((row, j) => (
                                            <tr key={j} className="bg-background-alt hover:bg-background-muted transition-colors">
                                                {row.split('|').filter(Boolean).map((cell, k) => (
                                                    <td key={k} className="px-4 py-3 text-foreground-muted border-b border-border">
                                                        {cell.trim()}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    }
                }
                // Regular paragraph
                if (paragraph.trim()) {
                    return (
                        <p key={i} className="text-foreground-muted leading-relaxed my-4"
                            dangerouslySetInnerHTML={{
                                __html: paragraph
                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-sm font-mono">$1</code>')
                            }}
                        />
                    );
                }
                return null;
            });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-border z-50">
                <div
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Video/Image Hero */}
            <section className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden">
                {/* Video Background */}
                {article.heroVideo && !isVideoPlaying ? (
                    <>
                        {/* Video Thumbnail with Play Button */}
                        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/20 to-info/20">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    onClick={() => setIsVideoPlaying(true)}
                                    className="group relative"
                                >
                                    <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
                                    <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <span className="text-3xl md:text-4xl ml-1">▶️</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    </>
                ) : article.heroVideo && isVideoPlaying ? (
                    // Actual Video Player (placeholder)
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                        <p className="text-white">Video would play here</p>
                    </div>
                ) : article.heroImage ? (
                    // Static Image (base64 or URL)
                    <div className="absolute inset-0">
                        <img
                            src={article.heroImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    </div>
                ) : (
                    // Fallback placeholder
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                        <span className="text-6xl">📖</span>
                    </div>
                )}

                {/* Hero Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-4xl">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm mb-4">
                            <Link href="/articles" className="text-foreground-muted hover:text-primary">
                                Articles
                            </Link>
                            <span className="text-foreground-muted">/</span>
                            <Link href={`/topics/${article.siloSlug}`} className="text-primary hover:underline">
                                {article.silo}
                            </Link>
                        </div>

                        {/* Pillar Link if exists */}
                        {article.parentArticle && (
                            <Link
                                href={`/articles/${article.parentArticle.slug}`}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm mb-4 hover:bg-primary/30 transition-colors"
                            >
                                🏛️ Part of: {article.parentArticle.title}
                            </Link>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            {article.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span>S</span>
                                </div>
                                <span>{article.author.name}</span>
                            </div>
                            <span>•</span>
                            <span>{article.publishedAt}</span>
                            <span>•</span>
                            <span>{article.readingTime} min read</span>
                            <span className="hidden md:inline">•</span>
                            <span className="hidden md:inline">{article.wordCount} words</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content with Sidebar */}
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="lg:flex lg:gap-12">
                    {/* Article Content */}
                    <article className="flex-1 max-w-3xl">
                        <div className="article-content">
                            {renderContent(article.content)}
                        </div>

                        {/* Author Bio */}
                        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-info/5 border border-border">
                            <div className="flex items-start gap-4">
                                <Link href={`/about/${article.author.slug}`} className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 hover:bg-primary/30 transition-colors">
                                    <span className="text-2xl">S</span>
                                </Link>
                                <div>
                                    <p className="text-sm text-foreground-muted mb-1">Written by</p>
                                    <Link href={`/about/${article.author.slug}`} className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                                        {article.author.name}
                                    </Link>
                                    <p className="text-foreground-muted mt-1">{article.author.bio}</p>
                                    <div className="flex gap-3 mt-4">
                                        <Link href={`/about/${article.author.slug}`}>
                                            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                                                View Profile
                                            </button>
                                        </Link>
                                        <Link href="/articles">
                                            <button className="px-4 py-2 rounded-lg bg-background-alt text-foreground text-sm border border-border hover:bg-background-muted">
                                                More articles
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Share */}
                        <div className="mt-8 flex items-center gap-4">
                            <span className="text-foreground-muted text-sm">Share:</span>
                            <div className="flex gap-2">
                                {['𝕏', 'in', 'f', '📧'].map((icon, i) => (
                                    <button key={i} className="w-10 h-10 rounded-lg bg-background-alt border border-border flex items-center justify-center text-foreground-muted hover:text-foreground hover:border-primary/50 transition-colors">
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* Sticky Sidebar - Compact */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-20 space-y-4">
                            {/* Back to Hub */}
                            <Link
                                href={`/topics/${article.siloSlug}`}
                                className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                            >
                                <span>🏛️</span>
                                <span className="font-medium text-sm">{article.silo} Hub</span>
                                <span className="ml-auto">→</span>
                            </Link>

                            {/* Table of Contents - Compact */}
                            <div className="p-3 rounded-lg bg-background-alt border border-border">
                                <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                                    📋 Contents
                                </h3>
                                <nav className="space-y-1 text-xs">
                                    {['AI-Native Development', 'Traditional IDEs', 'What\'s Different', 'Performance', 'Pricing', 'Getting Started'].map((item, i) => (
                                        <a key={i} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="block text-foreground-muted hover:text-primary transition-colors py-0.5">
                                            {item}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* Related Article - Just 1 Most Relevant */}
                            <div className="p-3 rounded-lg bg-background-alt border border-border">
                                <h3 className="font-semibold text-foreground text-sm mb-2">📚 Related</h3>
                                <Link
                                    href={`/articles/${relatedArticles[0].slug}`}
                                    className="block p-2 rounded hover:bg-background-muted transition-colors group"
                                >
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2">
                                        {relatedArticles[0].title}
                                    </p>
                                    <p className="text-xs text-foreground-muted mt-1">
                                        {relatedArticles[0].readingTime} min
                                    </p>
                                </Link>
                            </div>

                            {/* Get Started CTA */}
                            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-info/10 border border-primary/30">
                                <div className="text-center">
                                    <span className="text-3xl mb-2 block">🚀</span>
                                    <h3 className="font-bold text-foreground mb-1">Ready to Level Up?</h3>
                                    <p className="text-xs text-foreground-muted mb-3">
                                        Get started with AI-powered development today
                                    </p>
                                    <Link href="/register">
                                        <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                                            Get Started Free
                                        </button>
                                    </Link>
                                    <Link href="/login" className="block text-xs text-foreground-muted mt-2 hover:text-primary">
                                        Already have an account? Sign in
                                    </Link>
                                </div>
                            </div>

                            {/* Newsletter - Compact */}
                            <div className="p-3 rounded-lg bg-background-alt border border-border">
                                <p className="text-xs text-foreground-muted mb-2">📧 Weekly AI insights</p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className="flex-1 h-8 px-2 rounded bg-background border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
                                        suppressHydrationWarning
                                    />
                                    <button className="px-3 h-8 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
                                        →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border">
                <div className="flex gap-3">
                    <Link href={`/topics/${article.siloSlug}`} className="flex-1">
                        <button className="w-full h-12 rounded-xl bg-background-alt border border-border text-foreground font-medium">
                            🏛️ Topic Hub
                        </button>
                    </Link>
                    <button className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-medium">
                        📧 Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
}
