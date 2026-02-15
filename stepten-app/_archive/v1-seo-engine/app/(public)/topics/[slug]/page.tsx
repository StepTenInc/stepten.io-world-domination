"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data - will be replaced with Supabase
const siloData = {
    id: "1",
    name: "AI Coding Tools",
    slug: "ai-coding-tools",
    description: "The complete hub for AI-powered development tools. From IDEs to copilots, discover everything you need to 10x your coding productivity.",
    heroVideo: "https://example.com/silo-video.mp4",
    heroImage: "/images/silos/ai-coding-hero.jpg",
    articleCount: 8,
    totalWords: 25000,
    lastUpdated: "January 10, 2026",
    mainKeyword: "AI coding tools",
};

// Pillar content with accordion sections
const pillarContent = {
    title: "The Complete Guide to AI Coding Tools",
    intro: "The AI coding revolution is here. Whether you're a solo developer or part of a large team, the tools you use will determine how fast you ship, how clean your code is, and ultimately, how successful you are. This comprehensive guide covers everything you need to know about AI-powered development in 2026.",
    sections: [
        {
            id: "revolution",
            title: "The AI Coding Revolution",
            icon: "🚀",
            content: `The landscape of software development has fundamentally changed. What used to take hours now takes minutes. What used to require senior developer expertise is now accessible to juniors with the right tools.

**Key Statistics:**
- 78% of developers now use AI assistance daily
- Average productivity increase: 55%
- Bug detection rate improvement: 62%
- Time to first PR reduced by 70%

The question isn't whether to adopt AI tools—it's which ones to choose and how to use them effectively. That's what this guide is all about.`,
        },
        {
            id: "ai-native-ides",
            title: "AI-Native IDEs",
            icon: "💻",
            content: `AI-native IDEs are purpose-built from the ground up with AI at their core. Unlike traditional IDEs with AI plugins bolted on, these understand your entire codebase contextually.

**Top AI-Native IDEs in 2026:**

1. **Antigravity** - The newest player with voice-first interaction and full codebase awareness. Best for: teams wanting cutting-edge features.

2. **Cursor** - The pioneer in AI-native development. Excellent for: individual developers who want deep AI integration.

3. **Windsurf** - Focused on enterprise security and compliance. Best for: large organizations with strict security requirements.

**What to look for:**
- Full codebase indexing
- Multi-file context understanding
- Natural language code generation
- Intelligent refactoring suggestions
- Real-time collaboration features`,
        },
        {
            id: "code-completion",
            title: "Code Completion Tools",
            icon: "⌨️",
            content: `Code completion has evolved from simple autocomplete to intelligent, context-aware suggestions that can write entire functions.

**The Big Players:**

**GitHub Copilot** - The most widely adopted. Integrates seamlessly with VS Code and other IDEs. $19/month individual, $39/month business.

**Tabnine** - Privacy-focused with local model options. Great for companies that can't send code to external servers.

**Amazon CodeWhisperer** - Free tier available, excellent for AWS development. Tightly integrated with AWS services.

**Comparison Matrix:**

| Feature | Copilot | Tabnine | CodeWhisperer |
|---------|---------|---------|---------------|
| Price | $19/mo | $12/mo | Free tier |
| Local Mode | No | Yes | No |
| Languages | 20+ | 30+ | 15+ |
| IDE Support | VS Code, JetBrains | All major | VS Code, JetBrains |`,
        },
        {
            id: "code-review",
            title: "AI Code Review",
            icon: "🔍",
            content: `Manual code reviews are a bottleneck. AI code review tools can catch 80% of issues before human review, letting your senior developers focus on architecture and design decisions.

**Leading Tools:**

1. **Codacy** - Automated code review with security scanning. Integrates with GitHub, GitLab, Bitbucket.

2. **DeepSource** - Real-time static analysis with auto-fix capabilities. Known for excellent Python and JavaScript support.

3. **SonarQube** - Enterprise-grade with comprehensive language support. Best for: teams with compliance requirements.

**What AI Review Catches:**
- Security vulnerabilities
- Performance anti-patterns
- Code style violations
- Potential bugs and edge cases
- Documentation gaps`,
        },
        {
            id: "testing-debugging",
            title: "Testing & Debugging with AI",
            icon: "🐛",
            content: `AI has transformed testing from a tedious chore to an intelligent process that can generate test cases, predict failures, and even fix bugs.

**AI Testing Tools:**

**Test Generation:**
- Diffblue Cover - Generates unit tests automatically
- CodiumAI - Creates tests as you write code
- Testim - AI-powered end-to-end testing

**Debugging:**
- WhyLabs - ML-powered anomaly detection
- Bugsnag with AI triage - Automatic bug prioritization
- Sentry's new AI features - Root cause analysis

**The New Workflow:**
1. Write code with AI assistance
2. AI generates initial test suite
3. Human reviews and adds edge cases
4. AI monitors for regressions
5. Repeat`,
        },
        {
            id: "future",
            title: "The Future of AI Development",
            icon: "🔮",
            content: `Where is this all heading? Here are the trends we're watching:

**2026-2027 Predictions:**

1. **Agent-Based Development** - AI that can execute multi-step tasks autonomously, from "add a login feature" to complete implementation.

2. **Voice-First Coding** - Speaking your code will become mainstream as models better understand developer intent.

3. **Autonomous Testing** - AI that continuously tests and validates your code in production, catching issues before users do.

4. **Code Generation Standards** - Industry standards for AI-generated code attribution and licensing.

5. **AI Pair Programming** - Real-time collaboration between humans and AI that feels like working with a senior developer.

**The Bottom Line:**
Developers who master AI tools now will have a significant advantage. The learning curve is real, but the productivity gains are undeniable. Start with one tool, master it, then expand your toolkit.

**Your Next Steps:**
1. Choose one AI coding tool from this guide
2. Spend 2 weeks integrating it into your workflow
3. Measure your productivity before and after
4. Share your results with your team`,
        },
    ],
};

const childArticles = [
    {
        id: "1",
        title: "Antigravity IDE: The Future of AI-Powered Coding",
        slug: "antigravity-ide-future-ai-coding",
        excerpt: "Discover how Antigravity is revolutionizing the developer experience with its groundbreaking AI capabilities.",
        depth: 1,
        category: "AI-Native IDEs",
        readingTime: 8,
        publishedAt: "January 10, 2026",
        hasVideo: true,
    },
    {
        id: "2",
        title: "Cursor vs Copilot: Which AI Coding Assistant Wins?",
        slug: "cursor-vs-copilot-2026",
        excerpt: "An in-depth comparison of the two giants in AI-assisted development.",
        depth: 1,
        category: "Code Completion Tools",
        readingTime: 12,
        publishedAt: "January 8, 2026",
        hasVideo: false,
    },
    {
        id: "3",
        title: "Claude Code: The AI That Understands Your Codebase",
        slug: "claude-code-understands-codebase",
        excerpt: "How Anthropic's Claude is changing the game with contextual code understanding.",
        depth: 2,
        category: "AI-Native IDEs",
        readingTime: 10,
        publishedAt: "January 5, 2026",
        hasVideo: false,
    },
    {
        id: "5",
        title: "GitHub Copilot Enterprise: Worth the Premium?",
        slug: "github-copilot-enterprise-review",
        excerpt: "We tested Copilot Enterprise for 3 months to find out if it's worth the investment for teams.",
        depth: 1,
        category: "Code Completion Tools",
        readingTime: 15,
        publishedAt: "January 3, 2026",
        hasVideo: true,
    },
    {
        id: "6",
        title: "AI-Powered Code Review: Tools That Actually Work",
        slug: "ai-code-review-tools",
        excerpt: "Automate your code reviews without sacrificing quality. These tools deliver.",
        depth: 2,
        category: "AI Code Review",
        readingTime: 11,
        publishedAt: "December 28, 2025",
        hasVideo: false,
    },
];

const relatedProducts = [
    {
        id: "1",
        name: "AI Developer Toolkit",
        description: "My personal toolkit for AI-augmented development",
        price: "$47",
    },
    {
        id: "2",
        name: "IDE Mastery Course",
        description: "Master any AI-native IDE in 7 days",
        price: "$197",
    },
];

export default function SiloPage() {
    const params = useParams();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [openSections, setOpenSections] = useState<string[]>(["revolution"]); // First section open by default

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const expandAll = () => setOpenSections(pillarContent.sections.map(s => s.id));
    const collapseAll = () => setOpenSections([]);

    // Render markdown-like content
    const renderContent = (content: string) => {
        return content.split('\n\n').map((paragraph, i) => {
            // Headers
            if (paragraph.startsWith('**') && paragraph.endsWith(':**')) {
                return (
                    <h4 key={i} className="text-lg font-bold text-foreground mt-6 mb-3">
                        {paragraph.replace(/\*\*/g, '').replace(':', '')}
                    </h4>
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
                                <span dangerouslySetInnerHTML={{
                                    __html: item.replace(/^(\d+\.|-)\s*/, '')
                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                                }} />
                            </li>
                        ))}
                    </ul>
                );
            }
            // Tables
            if (paragraph.includes('|')) {
                const rows = paragraph.split('\n').filter(line => line.includes('|'));
                if (rows.length > 1) {
                    return (
                        <div key={i} className="my-6 overflow-x-auto">
                            <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-primary/10">
                                        {rows[0].split('|').filter(Boolean).map((cell, j) => (
                                            <th key={j} className="px-4 py-2 text-left text-foreground font-semibold border-b border-border">
                                                {cell.trim()}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.slice(2).map((row, j) => (
                                        <tr key={j} className="bg-background-alt hover:bg-background-muted transition-colors">
                                            {row.split('|').filter(Boolean).map((cell, k) => (
                                                <td key={k} className="px-4 py-2 text-foreground-muted border-b border-border">
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
                    <p key={i} className="text-foreground-muted leading-relaxed my-3"
                        dangerouslySetInnerHTML={{
                            __html: paragraph
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        }}
                    />
                );
            }
            return null;
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Video Hero Section */}
            <section className="relative overflow-hidden h-[60vh] md:h-[70vh]">
                {/* Video Background Placeholder */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-info/30 to-primary/20"
                        style={{
                            animation: 'pulse 4s ease-in-out infinite',
                        }}
                    />
                    {/* Grid overlay for techy feel */}
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `linear-gradient(rgba(0,255,65,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.5) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />
                    {/* Gradient overlay - 70% */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
                </div>

                {/* Play Button */}
                {siloData.heroVideo && !isVideoPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button
                            onClick={() => setIsVideoPlaying(true)}
                            className="group relative"
                        >
                            <div className="absolute -inset-8 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all">
                                <span className="text-4xl md:text-5xl ml-2">▶️</span>
                            </div>
                        </button>
                    </div>
                )}

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
                    <div className="max-w-5xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm mb-4">
                            <Link href="/articles" className="text-foreground-muted hover:text-primary">
                                Articles
                            </Link>
                            <span className="text-foreground-muted">/</span>
                            <span className="text-foreground">Topics</span>
                        </div>

                        {/* Silo Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-4">
                            <span className="text-xl">🏛️</span>
                            <span className="text-sm text-primary font-medium">Topic Hub</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                            {siloData.name}
                        </h1>
                        <p className="text-lg md:text-xl text-foreground-muted max-w-3xl mb-6">
                            {siloData.description}
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6 md:gap-10">
                            <div>
                                <p className="text-2xl md:text-3xl font-bold text-primary">{siloData.articleCount}</p>
                                <p className="text-xs md:text-sm text-foreground-muted">Articles</p>
                            </div>
                            <div>
                                <p className="text-2xl md:text-3xl font-bold text-foreground">{(siloData.totalWords / 1000).toFixed(0)}K+</p>
                                <p className="text-xs md:text-sm text-foreground-muted">Words</p>
                            </div>
                            <div>
                                <p className="text-2xl md:text-3xl font-bold text-info">{pillarContent.sections.length}</p>
                                <p className="text-xs md:text-sm text-foreground-muted">Sections</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pillar Content with Sidebar */}
            <section className="px-4 py-12 md:py-16 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <div className="lg:flex lg:gap-12">
                        {/* Main Content */}
                        <div className="flex-1 max-w-4xl">
                            {/* Section Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📖</span>
                                    <h2 className="text-2xl font-bold text-foreground">{pillarContent.title}</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={expandAll}
                                        className="px-3 py-1 rounded-lg text-xs text-foreground-muted hover:text-foreground bg-background-alt hover:bg-background-muted transition-colors"
                                    >
                                        Expand All
                                    </button>
                                    <button
                                        onClick={collapseAll}
                                        className="px-3 py-1 rounded-lg text-xs text-foreground-muted hover:text-foreground bg-background-alt hover:bg-background-muted transition-colors"
                                    >
                                        Collapse
                                    </button>
                                </div>
                            </div>

                            {/* Introduction */}
                            <div className="p-6 rounded-2xl bg-background border border-border mb-6">
                                <p className="text-foreground-muted leading-relaxed text-lg">
                                    {pillarContent.intro}
                                </p>
                            </div>

                            {/* Accordion Sections */}
                            <div className="space-y-3">
                                {pillarContent.sections.map((section) => (
                                    <div
                                        key={section.id}
                                        className="rounded-xl border border-border bg-background overflow-hidden"
                                    >
                                        {/* Section Header - Clickable */}
                                        <button
                                            onClick={() => toggleSection(section.id)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-background-alt/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{section.icon}</span>
                                                <h3 className="text-lg md:text-xl font-bold text-foreground">
                                                    {section.title}
                                                </h3>
                                            </div>
                                            <div className={`text-2xl text-foreground-muted transition-transform duration-300 ${openSections.includes(section.id) ? 'rotate-180' : ''}`}>
                                                ▼
                                            </div>
                                        </button>

                                        {/* Section Content - Collapsible */}
                                        {openSections.includes(section.id) && (
                                            <div className="px-4 md:px-5 pb-5 pt-0 border-t border-border">
                                                <div className="pt-4">
                                                    {renderContent(section.content)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Author Attribution */}
                            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-info/5 border border-border">
                                <div className="flex items-center gap-4">
                                    <Link href="/about/stephen-atcheler" className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 hover:bg-primary/30 transition-colors">
                                        <span className="text-xl font-bold">S</span>
                                    </Link>
                                    <div>
                                        <p className="text-sm text-foreground-muted">Written & curated by</p>
                                        <Link href="/about/stephen-atcheler" className="text-lg font-bold text-foreground hover:text-primary">
                                            Stephen Atcheler
                                        </Link>
                                        <p className="text-sm text-foreground-muted">Last updated: {siloData.lastUpdated}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Sidebar */}
                        <aside className="hidden lg:block w-72 flex-shrink-0">
                            <div className="sticky top-20 space-y-4">
                                {/* Table of Contents */}
                                <div className="p-4 rounded-xl bg-background border border-border">
                                    <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                                        📋 In This Guide
                                    </h3>
                                    <nav className="space-y-1">
                                        {pillarContent.sections.map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => {
                                                    if (!openSections.includes(section.id)) {
                                                        toggleSection(section.id);
                                                    }
                                                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs text-foreground-muted hover:text-primary hover:bg-background-alt transition-colors"
                                            >
                                                <span>{section.icon}</span>
                                                <span className="truncate">{section.title}</span>
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Quick Stats */}
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/30">
                                    <h3 className="font-bold text-foreground text-sm mb-3">📊 Hub Stats</h3>
                                    <div className="grid grid-cols-2 gap-3 text-center">
                                        <div className="p-2 rounded-lg bg-background">
                                            <p className="text-lg font-bold text-primary">{siloData.articleCount}</p>
                                            <p className="text-xs text-foreground-muted">Articles</p>
                                        </div>
                                        <div className="p-2 rounded-lg bg-background">
                                            <p className="text-lg font-bold text-foreground">{(siloData.totalWords / 1000).toFixed(0)}K</p>
                                            <p className="text-xs text-foreground-muted">Words</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Article */}
                                <div className="p-4 rounded-xl bg-background border border-border">
                                    <h3 className="font-bold text-foreground text-sm mb-3">🔥 Most Popular</h3>
                                    <Link
                                        href={`/articles/${childArticles[0]?.slug}`}
                                        className="block p-3 rounded-lg bg-background-alt hover:bg-background-muted transition-colors group"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            {childArticles[0]?.hasVideo && <span className="text-xs">🎬</span>}
                                            <span className="text-xs text-primary">{childArticles[0]?.category}</span>
                                        </div>
                                        <p className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2">
                                            {childArticles[0]?.title}
                                        </p>
                                        <p className="text-xs text-foreground-muted mt-1">
                                            {childArticles[0]?.readingTime} min read
                                        </p>
                                    </Link>
                                </div>

                                {/* Newsletter */}
                                <div className="p-4 rounded-xl bg-background border border-border">
                                    <h3 className="font-bold text-foreground text-sm mb-2">📧 Get Updates</h3>
                                    <p className="text-xs text-foreground-muted mb-3">
                                        New {siloData.name} content in your inbox
                                    </p>
                                    <div className="flex gap-2" suppressHydrationWarning>
                                        <input
                                            type="email"
                                            placeholder="email@example.com"
                                            className="flex-1 h-8 px-2 rounded bg-background-alt border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
                                            suppressHydrationWarning
                                        />
                                        <button className="px-3 h-8 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
                                            →
                                        </button>
                                    </div>
                                </div>

                                {/* Back to All Topics */}
                                <Link
                                    href="/articles"
                                    className="flex items-center gap-2 p-3 rounded-xl bg-background-alt border border-border text-foreground-muted hover:text-foreground hover:border-primary/30 transition-all"
                                >
                                    <span>←</span>
                                    <span className="text-sm">All Articles</span>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            <section className="px-4 py-12 md:py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-xl">📚</span>
                        <h2 className="text-xl font-bold text-foreground">Related Articles</h2>
                        <span className="text-sm text-foreground-muted">({childArticles.length} deep dives)</span>
                    </div>

                    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {childArticles.map(article => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.slug}`}
                                className="group p-4 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-background-alt/50 transition-all"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-0.5 rounded-full bg-info/10 text-info text-xs">
                                        {article.category}
                                    </span>
                                    {article.hasVideo && (
                                        <span className="text-xs">🎬</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-foreground-muted line-clamp-2 mb-3">
                                    {article.excerpt}
                                </p>
                                <div className="text-xs text-foreground-muted">
                                    {article.readingTime} min • Depth {article.depth}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related Products */}
            <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-primary/5 via-transparent to-info/5">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-xl">🛒</span>
                        <h2 className="text-xl font-bold text-foreground">Related Products</h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {relatedProducts.map(product => (
                            <div
                                key={product.id}
                                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-all"
                            >
                                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-foreground">{product.name}</h3>
                                    <p className="text-sm text-foreground-muted">{product.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-primary">{product.price}</p>
                                    <button className="text-xs text-primary hover:underline">Learn more →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="px-4 py-16 md:py-24">
                <div className="max-w-2xl mx-auto text-center">
                    <span className="text-4xl mb-4 block">📧</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Master {siloData.name}
                    </h2>
                    <p className="text-foreground-muted mb-8">
                        Get exclusive tips, early access to guides, and tool recommendations delivered weekly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 h-12 px-4 rounded-xl bg-background-alt border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
                            suppressHydrationWarning
                        />
                        <button className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
