"use client";

import Link from "next/link";

export interface ArticleCardProps {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    heroImage?: string;
    heroVideo?: string | null;
    silo?: string;
    siloSlug?: string;
    isSiloPillar?: boolean;
    depth?: number;
    category?: string;
    author?: string;
    publishedAt?: string;
    readingTime: number;
    hasVideo?: boolean;
    // Variants
    size?: 'small' | 'medium' | 'large';
    showDepth?: boolean;
    showAuthor?: boolean;
    showExcerpt?: boolean;
}

export function ArticleCard({
    id,
    title,
    slug,
    excerpt,
    heroVideo,
    silo,
    siloSlug,
    isSiloPillar = false,
    depth = 1,
    category,
    author,
    publishedAt,
    readingTime,
    hasVideo = false,
    size = 'medium',
    showDepth = true,
    showAuthor = true,
    showExcerpt = true,
}: ArticleCardProps) {
    // Size-based classes
    const sizeClasses = {
        small: {
            card: 'p-3',
            title: 'text-sm',
            excerpt: 'text-xs',
            thumbnail: 'w-16 h-16',
        },
        medium: {
            card: 'p-4',
            title: 'text-base',
            excerpt: 'text-sm',
            thumbnail: 'w-full aspect-video',
        },
        large: {
            card: 'p-5 md:p-6',
            title: 'text-lg md:text-xl',
            excerpt: 'text-sm md:text-base',
            thumbnail: 'w-full aspect-video md:aspect-[16/10]',
        },
    };

    const classes = sizeClasses[size];

    if (size === 'small') {
        // Compact horizontal card
        return (
            <Link
                href={`/articles/${slug}`}
                className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-background-alt/50 transition-all"
            >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-info/20 flex-shrink-0 flex items-center justify-center">
                    {isSiloPillar ? (
                        <span className="text-lg">🏛️</span>
                    ) : heroVideo || hasVideo ? (
                        <span className="text-lg">🎬</span>
                    ) : (
                        <span className="text-lg">📝</span>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">
                        {title}
                    </h3>
                    <p className="text-xs text-foreground-muted mt-1">
                        {readingTime} min{category ? ` • ${category}` : ''}
                    </p>
                </div>
            </Link>
        );
    }

    // Standard card (medium/large)
    return (
        <Link
            href={`/articles/${slug}`}
            className="group rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
        >
            {/* Thumbnail with Video Indicator */}
            <div className={`relative ${classes.thumbnail} bg-gradient-to-br from-background-alt to-background-muted`}>
                {heroVideo || hasVideo ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-info/20">
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-2xl">▶️</span>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-info/10">
                        <span className="text-4xl">{isSiloPillar ? '🏛️' : '📝'}</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {isSiloPillar && (
                        <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            🏛️ PILLAR
                        </span>
                    )}
                    {silo && !isSiloPillar && (
                        <span className="px-2 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium text-foreground">
                            {silo}
                        </span>
                    )}
                    {category && (
                        <span className="px-2 py-1 rounded-full bg-info/20 text-info text-xs">
                            {category}
                        </span>
                    )}
                </div>

                {/* Depth Indicator */}
                {showDepth && depth > 0 && !isSiloPillar && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-info/80 text-xs font-medium text-white">
                        Depth {depth}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={classes.card}>
                <h3 className={`font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors ${classes.title}`}>
                    {title}
                </h3>
                {showExcerpt && (
                    <p className={`text-foreground-muted line-clamp-2 mb-3 ${classes.excerpt}`}>
                        {excerpt}
                    </p>
                )}
                {showAuthor && (
                    <div className="flex items-center justify-between text-xs text-foreground-muted">
                        <div className="flex items-center gap-2">
                            {author && <span>{author}</span>}
                            {author && publishedAt && <span>•</span>}
                            {publishedAt && <span>{publishedAt}</span>}
                        </div>
                        <span>{readingTime} min</span>
                    </div>
                )}
            </div>
        </Link>
    );
}

// Pillar-specific large card variant
export function PillarArticleCard({
    title,
    slug,
    excerpt,
    heroVideo,
    silo,
    author,
    publishedAt,
    readingTime,
}: ArticleCardProps) {
    return (
        <Link
            href={`/articles/${slug}`}
            className="group relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/5 via-background to-info/5 hover:from-primary/10 hover:to-info/10 transition-all duration-300"
        >
            <div className="flex flex-col md:flex-row">
                {/* Video/Image */}
                <div className="relative w-full md:w-80 lg:w-96 h-48 md:h-auto flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center">
                        {heroVideo ? (
                            <div className="text-center">
                                <span className="text-5xl mb-2 block">🎬</span>
                                <span className="text-xs text-white/80">Video Header</span>
                            </div>
                        ) : (
                            <span className="text-5xl">📖</span>
                        )}
                    </div>
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        🏛️ PILLAR
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        {silo && <span className="text-sm text-primary">{silo}</span>}
                        <span className="text-foreground-muted">•</span>
                        <span className="text-sm text-foreground-muted">{readingTime} min read</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-foreground-muted line-clamp-2 mb-4">
                        {excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-sm">S</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">{author}</p>
                                <p className="text-xs text-foreground-muted">{publishedAt}</p>
                            </div>
                        </div>
                        <span className="text-primary font-medium group-hover:translate-x-1 transition-transform inline-block">
                            Read guide →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
