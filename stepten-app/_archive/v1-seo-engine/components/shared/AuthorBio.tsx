"use client";

import Link from "next/link";

export interface AuthorBioProps {
    name: string;
    slug: string;
    avatar?: string;
    bio: string;
    // Variants
    size?: 'compact' | 'standard' | 'large';
    showActions?: boolean;
    showWrittenBy?: boolean;
}

export function AuthorBio({
    name,
    slug,
    avatar,
    bio,
    size = 'standard',
    showActions = true,
    showWrittenBy = true,
}: AuthorBioProps) {
    // Compact variant - for sidebars
    if (size === 'compact') {
        return (
            <Link
                href={`/about/${slug}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-background-alt border border-border hover:border-primary/30 transition-all group"
            >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                    <span className="text-sm font-bold">{name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {name}
                    </p>
                    <p className="text-xs text-foreground-muted truncate">{bio}</p>
                </div>
            </Link>
        );
    }

    // Large variant - for author page hero
    if (size === 'large') {
        return (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="relative">
                    <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl" />
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center border-4 border-background">
                        <span className="text-5xl md:text-6xl font-bold text-white">{name.charAt(0)}</span>
                    </div>
                </div>

                {/* Info */}
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                        {name}
                    </h1>
                    <p className="text-xl text-primary mb-4">
                        {bio}
                    </p>
                </div>
            </div>
        );
    }

    // Standard variant - for article pages
    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-info/5 border border-border">
            <div className="flex items-start gap-4">
                <Link
                    href={`/about/${slug}`}
                    className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 hover:bg-primary/30 transition-colors"
                >
                    <span className="text-2xl font-bold">{name.charAt(0)}</span>
                </Link>
                <div className="flex-1">
                    {showWrittenBy && (
                        <p className="text-sm text-foreground-muted mb-1">Written by</p>
                    )}
                    <Link
                        href={`/about/${slug}`}
                        className="text-xl font-bold text-foreground hover:text-primary transition-colors inline-block"
                    >
                        {name}
                    </Link>
                    <p className="text-foreground-muted mt-1">{bio}</p>
                    {showActions && (
                        <div className="flex gap-3 mt-4">
                            <Link href={`/about/${slug}`}>
                                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                                    View Profile
                                </button>
                            </Link>
                            <Link href="/articles">
                                <button className="px-4 py-2 rounded-lg bg-background-alt text-foreground text-sm border border-border hover:bg-background-muted transition-colors">
                                    More articles
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Topic Hub Link component for sidebar
export function TopicHubLink({
    name,
    slug,
    articleCount,
}: {
    name: string;
    slug: string;
    articleCount?: number;
}) {
    return (
        <Link
            href={`/topics/${slug}`}
            className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
        >
            <span>🏛️</span>
            <span className="font-medium text-sm flex-1">{name}</span>
            {articleCount && (
                <span className="text-xs text-foreground-muted">{articleCount}</span>
            )}
            <span>→</span>
        </Link>
    );
}
