"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Play, Package, Search, MessageCircle, Briefcase, Code, ArrowRight, Sparkles, TrendingUp, Award } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import MatrixRain from "@/components/effects/MatrixRain";
import FloatingParticles from "@/components/effects/FloatingParticles";
import AnimatedCounter from "@/components/effects/AnimatedCounter";

// Mock Products Data - will be replaced with Supabase
const mockProducts = [
    {
        id: "1",
        name: "AI Audit",
        slug: "ai-audit",
        tagline: "Comprehensive AI readiness assessment for your business",
        description: "Get a complete analysis of how AI can transform your operations. Includes a 30+ page report, ROI projections, and implementation roadmap.",
        priceType: "one_time",
        priceAmount: 250000,
        priceDisplay: "$2,500",
        status: "active",
        isFeatured: true,
        thumbnailUrl: "/images/products/ai-audit.jpg",
        demoVideoUrl: "https://example.com/ai-audit-demo.mp4",
        category: "Consulting",
        features: ["30+ page report", "ROI projections", "Implementation roadmap", "90-min presentation"],
    },
    {
        id: "2",
        name: "One-Off Consulting Session",
        slug: "one-off-consulting",
        tagline: "1-hour strategy session with actionable insights",
        description: "Get focused advice on your biggest challenge. Walk away with a clear action plan and recording of our session.",
        priceType: "one_time",
        priceAmount: 50000,
        priceDisplay: "$500",
        status: "active",
        isFeatured: false,
        thumbnailUrl: "/images/products/consulting.jpg",
        demoVideoUrl: null,
        category: "Consulting",
        features: ["1-hour call", "Strategy focus", "Recording provided", "Action plan delivered"],
    },
    {
        id: "3",
        name: "Monthly Retainer",
        slug: "monthly-retainer",
        tagline: "Ongoing strategic support and priority access",
        description: "2 sessions per month with async support. Get continuous guidance as your business evolves.",
        priceType: "monthly",
        priceAmount: 75000,
        priceDisplay: "$750/mo",
        status: "active",
        isFeatured: true,
        thumbnailUrl: "/images/products/retainer.jpg",
        demoVideoUrl: null,
        category: "Consulting",
        features: ["2 sessions/month", "Async support", "Priority access", "Ongoing strategy"],
    },
    {
        id: "4",
        name: "Block Hours",
        slug: "block-hours",
        tagline: "10-hour development blocks at $250/hour",
        description: "Web apps, AI integrations, automation - full stack builds with expert execution.",
        priceType: "hourly",
        priceAmount: 25000,
        priceDisplay: "$250/hr",
        status: "active",
        isFeatured: false,
        thumbnailUrl: "/images/products/dev-work.jpg",
        demoVideoUrl: null,
        category: "Development",
        features: ["10-hour blocks", "Full stack builds", "AI integrations", "Automation systems"],
    },
    {
        id: "5",
        name: "SEO Content Engine",
        slug: "seo-content-engine",
        tagline: "AI-powered content creation pipeline",
        description: "Voice to published article with full automation. Research, writing, humanization, and SEO optimization built in.",
        priceType: "quote",
        priceAmount: null,
        priceDisplay: "Custom Quote",
        status: "active",
        isFeatured: true,
        thumbnailUrl: "/images/products/seo-engine.jpg",
        demoVideoUrl: "https://example.com/seo-engine-demo.mp4",
        category: "Products",
        features: ["Voice-to-text", "AI research", "Humanization", "SEO optimization"],
    },
    {
        id: "6",
        name: "Custom Project",
        slug: "custom-project",
        tagline: "MVPs, full apps, AI integrations",
        description: "Full scoping & proposal for your unique needs. From idea to deployed product.",
        priceType: "quote",
        priceAmount: null,
        priceDisplay: "Quote",
        status: "active",
        isFeatured: false,
        thumbnailUrl: "/images/products/custom.jpg",
        demoVideoUrl: null,
        category: "Development",
        features: ["Full scoping", "Custom builds", "AI integrations", "End-to-end delivery"],
    },
];

const categories = ["All", "Consulting", "Development", "Products"];

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = mockProducts.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.tagline.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch && product.status === "active";
    });

    const featuredProducts = mockProducts.filter(p => p.isFeatured && p.status === "active");
    const heroRef = useRef(null);

    return (
        <div className="min-h-screen bg-background relative">
            <MatrixRain />
            <FloatingParticles count={20} />
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-info/20 to-primary/10"
                        style={{ animation: 'pulse 4s ease-in-out infinite' }}
                    />
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
                </div>

                <div className="relative px-4 py-16 md:py-24 lg:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-sm text-primary font-medium">Services & Products</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                            Work With <span className="text-primary">Me</span>
                        </h1>
                        <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto mb-8">
                            From strategic consulting to custom development, find the right way to
                            accelerate your business with AI and automation.
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-foreground">50+</p>
                                <p className="text-sm text-foreground-muted">Projects Delivered</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-primary">20+</p>
                                <p className="text-sm text-foreground-muted">Years Experience</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-foreground">100%</p>
                                <p className="text-sm text-foreground-muted">Client Satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="px-4 py-12 md:py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-2xl"><Star className="w-5 h-5 inline fill-current text-primary" /></span>
                        <h2 className="text-2xl font-bold text-foreground">Featured</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {featuredProducts.map(product => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-info/5 hover:from-primary/10 hover:to-info/10 transition-all duration-300"
                            >
                                {/* Video/Image */}
                                <div className="relative aspect-video">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center">
                                        {product.demoVideoUrl ? (
                                            <div className="text-center">
                                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <span className="text-2xl ml-1"><Play className="w-5 h-5 fill-current" /></span>
                                                </div>
                                            </div>
                                        ) : (
                                            <Package className="w-12 h-12 text-white/30" />
                                        )}
                                    </div>
                                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                        <Star className="w-5 h-5 inline fill-current text-primary" /> FEATURED
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <p className="text-xs text-primary mb-2">{product.category}</p>
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-foreground-muted line-clamp-2 mb-4">
                                        {product.tagline}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-primary">{product.priceDisplay}</span>
                                        <span className="text-sm text-primary group-hover:translate-x-1 transition-transform">
                                            Learn more →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-y border-border">
                <div className="px-4 py-4">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background-alt text-foreground-muted hover:text-foreground hover:bg-background-muted"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 h-10 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
                            suppressHydrationWarning
                        />
                    </div>
                </div>
            </section>

            {/* All Products Grid */}
            <section className="px-4 py-12 md:py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">All Products & Services</h2>
                            <p className="text-foreground-muted mt-1">
                                {filteredProducts.length} offering{filteredProducts.length !== 1 ? 's' : ''} available
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map(product => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gradient-to-br from-background-alt to-background-muted">
                                    {product.demoVideoUrl ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-info/20">
                                            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="text-xl"><Play className="w-5 h-5 fill-current" /></span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-info/10">
                                            {product.category === "Consulting" ? (
                                                <Briefcase className="w-12 h-12 text-white/40" />
                                            ) : product.category === "Development" ? (
                                                <Code className="w-12 h-12 text-white/40" />
                                            ) : (
                                                <Package className="w-12 h-12 text-white/40" />
                                            )}
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium text-foreground">
                                        {product.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-foreground-muted line-clamp-2 mb-4">
                                        {product.tagline}
                                    </p>

                                    {/* Features preview */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {product.features.slice(0, 3).map((feature, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded-full bg-background-alt text-xs text-foreground-muted">
                                                {feature}
                                            </span>
                                        ))}
                                        {product.features.length > 3 && (
                                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-xs text-primary">
                                                +{product.features.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-primary">{product.priceDisplay}</span>
                                        <span className="text-sm text-foreground-muted group-hover:text-primary transition-colors">
                                            View details →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-16">
                            <Search className="w-12 h-12 text-foreground-muted" />
                            <p className="text-foreground-muted mt-4">No products found. Try a different search.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-info/10">
                <div className="max-w-2xl mx-auto text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Not Sure What You Need?
                    </h2>
                    <p className="text-foreground-muted mb-8">
                        Let's chat about your goals and find the right solution together.
                        No pressure, just honest advice.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/contact">
                            <button className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                                Book a Free Call
                            </button>
                        </Link>
                        <Link href="/about/stephen-atcheler">
                            <button className="px-8 py-3 rounded-xl bg-background border border-border text-foreground font-medium hover:border-primary/50 transition-colors">
                                Learn About Me
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
