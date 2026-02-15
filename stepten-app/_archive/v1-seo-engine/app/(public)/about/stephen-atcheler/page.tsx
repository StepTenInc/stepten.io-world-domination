"use client";

import Link from "next/link";

// Author data - will be replaced with Supabase/CMS
const author = {
    name: "Stephen Atcheler",
    slug: "stephen-atcheler",
    title: "Builder. Investor. AI & Automation Obsessed.",
    bio: `With over 20 years of experience building and scaling businesses, I've learned that the right tools and systems are what separate those who struggle from those who thrive.

I'm the founder of ShoreAgents, a BPO company that leverages AI and automation to deliver exceptional results for our clients. I'm also an active investor in early-stage tech companies, particularly those focused on AI, automation, and the future of work.

This site is my personal knowledge hub where I share everything I've learned about building businesses, leveraging AI tools, and staying ahead of the curve in an increasingly automated world.

**My Focus Areas:**
- AI-powered development tools
- Business automation and scaling
- SEO and content strategy
- Building and leading remote teams`,
    avatar: "/images/stephen-avatar.jpg",
    stats: {
        articles: 42,
        words: "150K+",
        yearsExperience: 20,
    },
    social: {
        twitter: "https://twitter.com/stephenatcheler",
        linkedin: "https://linkedin.com/in/stephenatcheler",
        youtube: "https://youtube.com/@stephenatcheler",
    },
    companies: [
        {
            name: "ShoreAgents",
            role: "Founder & CEO",
            description: "AI-powered BPO company",
            url: "https://shoreagents.com",
        },
        {
            name: "StepTen Ventures",
            role: "Managing Partner",
            description: "Early-stage tech investments",
            url: "#",
        },
    ],
};

const recentArticles = [
    {
        id: "1",
        title: "Antigravity IDE: The Future of AI-Powered Coding",
        slug: "antigravity-ide-future-ai-coding",
        excerpt: "Discover how Antigravity is revolutionizing the developer experience.",
        publishedAt: "January 10, 2026",
        topic: "AI Coding Tools",
    },
    {
        id: "2",
        title: "Cursor vs Copilot: Which AI Coding Assistant Wins?",
        slug: "cursor-vs-copilot-2026",
        excerpt: "An in-depth comparison of the two giants.",
        publishedAt: "January 8, 2026",
        topic: "AI Coding Tools",
    },
    {
        id: "3",
        title: "Automate Your Small Business in 7 Days",
        slug: "automate-small-business-7-days",
        excerpt: "A practical guide to AI automation.",
        publishedAt: "January 7, 2026",
        topic: "Business Automation",
    },
    {
        id: "4",
        title: "SEO in the Age of AI: What Actually Works",
        slug: "seo-age-of-ai",
        excerpt: "The rules have changed. Here's how to win.",
        publishedAt: "January 3, 2026",
        topic: "SEO Strategy",
    },
];

const topicHubs = [
    { name: "AI Coding Tools", slug: "ai-coding-tools", count: 8 },
    { name: "Business Automation", slug: "business-automation", count: 12 },
    { name: "SEO Strategy", slug: "seo-strategy", count: 6 },
];

export default function AuthorPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Video Hero Section */}
            <section className="relative overflow-hidden h-[50vh] md:h-[60vh]">
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

                {/* Play Button for Video */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <button className="group relative">
                        <div className="absolute -inset-8 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all">
                            <span className="text-3xl md:text-4xl ml-1">▶️</span>
                        </div>
                        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/60 whitespace-nowrap">Watch my story</p>
                    </button>
                </div>

                {/* Hero Content - Bottom Positioned */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="absolute -inset-2 bg-primary/30 rounded-full blur-xl" />
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center border-4 border-background shadow-2xl">
                                    <span className="text-4xl md:text-5xl font-bold text-white">S</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-1">
                                    {author.name}
                                </h1>
                                <p className="text-lg md:text-xl text-primary font-medium">
                                    {author.title}
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-3">
                                <a href={author.social.twitter} className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                                    𝕏
                                </a>
                                <a href={author.social.linkedin} className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                                    in
                                </a>
                                <a href={author.social.youtube} className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                                    ▶
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="px-4 py-6 bg-background-alt border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-12">
                        <div className="text-center md:text-left">
                            <p className="text-2xl md:text-3xl font-bold text-primary">{author.stats.articles}</p>
                            <p className="text-sm text-foreground-muted">Articles Published</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-2xl md:text-3xl font-bold text-foreground">{author.stats.words}</p>
                            <p className="text-sm text-foreground-muted">Words Written</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-2xl md:text-3xl font-bold text-info">{author.stats.yearsExperience}+</p>
                            <p className="text-sm text-foreground-muted">Years Experience</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bio Section */}
            <section className="px-4 py-12 md:py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Bio */}
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">👋</span>
                                About Me
                            </h2>
                            <div className="p-6 rounded-2xl bg-background-alt border border-border">
                                <div className="text-foreground-muted leading-relaxed space-y-4">
                                    {author.bio.split('\n\n').map((paragraph, i) => {
                                        // Handle list items
                                        if (paragraph.includes('\n- ')) {
                                            const [heading, ...items] = paragraph.split('\n');
                                            return (
                                                <div key={i}>
                                                    <p className="font-bold text-foreground mb-2" dangerouslySetInnerHTML={{
                                                        __html: heading.replace(/\*\*(.*?)\*\*/g, '$1')
                                                    }} />
                                                    <ul className="space-y-2">
                                                        {items.filter(item => item.startsWith('-')).map((item, j) => (
                                                            <li key={j} className="flex items-start gap-2">
                                                                <span className="text-primary mt-0.5">•</span>
                                                                <span>{item.replace(/^- /, '')}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        }
                                        // Regular paragraphs
                                        return (
                                            <p key={i} className="text-lg" dangerouslySetInnerHTML={{
                                                __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                                            }} />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Companies */}
                        <div>
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">🏢</span>
                                Companies
                            </h2>
                            <div className="space-y-4">
                                {author.companies.map((company, i) => (
                                    <a
                                        key={i}
                                        href={company.url}
                                        className="block p-5 rounded-xl bg-gradient-to-br from-background-alt to-background border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-lg">{i === 0 ? '🏢' : '💼'}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground group-hover:text-primary transition-colors">{company.name}</p>
                                                <p className="text-sm text-primary font-medium">{company.role}</p>
                                                <p className="text-sm text-foreground-muted mt-1">{company.description}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-primary mt-3 block group-hover:translate-x-1 transition-transform">
                                            Visit →
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Topic Hubs */}
            <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-primary/5 via-transparent to-info/5">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <span>🏛️</span> My Topic Hubs
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        {topicHubs.map((hub, i) => (
                            <Link
                                key={i}
                                href={`/topics/${hub.slug}`}
                                className="group p-5 rounded-xl bg-background border border-border hover:border-primary/50 transition-all"
                            >
                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                                    {hub.name}
                                </h3>
                                <p className="text-sm text-foreground-muted">
                                    {hub.count} articles
                                </p>
                                <span className="text-primary text-sm mt-2 inline-block group-hover:translate-x-1 transition-transform">
                                    Explore →
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Articles */}
            <section className="px-4 py-12 md:py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <span>📚</span> Recent Articles
                        </h2>
                        <Link href="/articles" className="text-primary hover:underline text-sm">
                            View all →
                        </Link>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {recentArticles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.slug}`}
                                className="group p-5 rounded-xl bg-background-alt border border-border hover:border-primary/50 transition-all"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                                        {article.topic}
                                    </span>
                                    <span className="text-xs text-foreground-muted">{article.publishedAt}</span>
                                </div>
                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-foreground-muted line-clamp-2">
                                    {article.excerpt}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 py-16 md:py-24">
                <div className="max-w-2xl mx-auto text-center">
                    <span className="text-4xl mb-4 block">📧</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Get My Weekly Insights
                    </h2>
                    <p className="text-foreground-muted mb-8">
                        Join 5,000+ builders receiving actionable AI and business insights every week.
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
