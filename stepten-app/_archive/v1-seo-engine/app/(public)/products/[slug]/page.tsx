"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Product Data - will be replaced with Supabase
const mockProduct = {
    id: "1",
    name: "AI Audit",
    slug: "ai-audit",
    tagline: "Comprehensive AI readiness assessment for your business",
    description: "Get a complete analysis of how AI can transform your operations. Walk away with a clear roadmap and ROI projections.",
    descriptionFull: `## What is the AI Audit?

The AI Audit is a comprehensive assessment of your business's AI readiness. We analyze your current operations, identify opportunities for AI integration, and provide a detailed roadmap for implementation.

This isn't a generic report. It's a deep dive into YOUR business, with specific recommendations tailored to your goals, team, and resources.

## The Process

### Week 1: Discovery & Analysis
During the first week, we'll conduct:
- **Stakeholder interviews** to understand your pain points and goals
- **Workflow mapping** to identify automation opportunities
- **Technology stack assessment** to understand current capabilities
- **Data audit** to evaluate AI-readiness of your information

### Week 2: Strategy & Roadmap
Based on our findings, we'll develop:
- **Prioritized opportunities** ranked by ROI and feasibility
- **Implementation timeline** with realistic milestones
- **Tool recommendations** matched to your needs and budget
- **Risk assessment** with mitigation strategies

### Week 3: Delivery
You'll receive:
- **30+ page comprehensive report** with all findings
- **Executive summary** for stakeholders
- **90-minute presentation call** to walk through everything
- **Action plan** with next steps

## What's Included

Everything you need to move forward confidently:

✅ 30+ page comprehensive report
✅ Executive summary for stakeholders  
✅ ROI projections with realistic timelines
✅ Prioritized action items
✅ Tool and vendor recommendations
✅ 90-minute presentation call
✅ 30-day email support for questions

## Who This Is For

The AI Audit is designed for:
- **Established businesses** doing $1M+ annual revenue
- **Growing companies** with 10+ employees
- **Leaders** who want to leverage AI strategically (not just follow trends)
- **Organizations** ready to invest in transformation

## Who This Is NOT For

To be transparent, this probably isn't right for you if:
- You're just starting out (under $500K revenue)
- You want someone to "just implement ChatGPT"
- You're not ready to invest in changes
- You expect overnight transformations

## Investment

$2,500 USD (one-time payment)

This includes everything listed above. No hidden fees, no ongoing commitments.

## FAQ

**How long does the audit take?**
The full process takes 3 weeks from kickoff to final delivery.

**What if I don't like the recommendations?**
I only recommend what I believe will work. If you disagree with any recommendation, we'll discuss alternatives during the presentation call.

**Can you implement the recommendations?**
Yes! Many clients choose to work with me on implementation through Block Hours or a Monthly Retainer. But there's no pressure—the audit stands on its own.

**What industries do you work with?**
I've worked with SaaS companies, agencies, professional services, e-commerce, and more. The principles of AI integration apply across industries.`,
    priceType: "one_time",
    priceAmount: 250000,
    priceDisplay: "$2,500",
    status: "active",
    isFeatured: true,
    thumbnailUrl: "/images/products/ai-audit.jpg",
    demoVideoUrl: "https://example.com/ai-audit-demo.mp4",
    category: "Consulting",
    features: [
        { title: "30+ Page Report", description: "Comprehensive analysis with actionable insights" },
        { title: "Executive Summary", description: "Stakeholder-ready overview of findings" },
        { title: "ROI Projections", description: "Realistic timelines and expected returns" },
        { title: "Implementation Roadmap", description: "Step-by-step action plan" },
        { title: "Tool Recommendations", description: "Curated vendor list for your needs" },
        { title: "90-Min Presentation", description: "Walk-through call to discuss findings" },
    ],
    deliverables: [
        "AI Readiness Score",
        "Workflow Analysis Document",
        "Implementation Roadmap",
        "Technology Stack Recommendations",
        "Cost-Benefit Analysis",
        "30-Day Email Support",
    ],
    testimonials: [
        {
            name: "Sarah Johnson",
            role: "CEO, TechStart Inc",
            quote: "The AI Audit gave us clarity we didn't know we needed. Within 6 months, we automated 40% of our operations.",
            avatar: "S",
        },
        {
            name: "Michael Chen",
            role: "COO, GrowthCo",
            quote: "Stephen's recommendations were practical and actionable. No fluff, just real strategies we could implement.",
            avatar: "M",
        },
    ],
    faqs: [
        { q: "How long does the audit take?", a: "The full process takes 3 weeks from kickoff to final delivery." },
        { q: "What if I don't like the recommendations?", a: "We'll discuss alternatives during the presentation. I only recommend what I believe will work." },
        { q: "Can you implement the recommendations?", a: "Yes! Many clients continue with Block Hours or Monthly Retainer for implementation." },
    ],
    relatedProducts: [
        { slug: "monthly-retainer", name: "Monthly Retainer", price: "$750/mo" },
        { slug: "block-hours", name: "Block Hours", price: "$250/hr" },
    ],
};

export default function ProductPage() {
    const params = useParams();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    // Parse markdown-like content
    const renderContent = (content: string) => {
        const lines = content.split('\n');
        const elements: React.ReactElement[] = [];

        lines.forEach((line, i) => {
            if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={i} className="text-2xl font-bold text-foreground mt-8 mb-4">
                        {line.replace('## ', '')}
                    </h2>
                );
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={i} className="text-xl font-bold text-foreground mt-6 mb-3">
                        {line.replace('### ', '')}
                    </h3>
                );
            } else if (line.startsWith('✅ ')) {
                elements.push(
                    <div key={i} className="flex items-start gap-2 mb-2">
                        <span className="text-primary">✓</span>
                        <span className="text-foreground-muted">{line.replace('✅ ', '')}</span>
                    </div>
                );
            } else if (line.startsWith('- **')) {
                const match = line.match(/- \*\*(.*?)\*\*(.*)/);
                if (match) {
                    elements.push(
                        <div key={i} className="flex items-start gap-2 mb-2 pl-4">
                            <span className="text-primary">•</span>
                            <span><strong className="text-foreground">{match[1]}</strong>{match[2]}</span>
                        </div>
                    );
                }
            } else if (line.startsWith('**') && line.endsWith('**')) {
                elements.push(
                    <p key={i} className="font-bold text-foreground mt-4 mb-2">
                        {line.replace(/\*\*/g, '')}
                    </p>
                );
            } else if (line.trim()) {
                elements.push(
                    <p key={i} className="text-foreground-muted leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{
                            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                        }}
                    />
                );
            }
        });

        return elements;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Video Hero Section */}
            <section className="relative overflow-hidden h-[50vh] md:h-[60vh]">
                {/* Video Background Placeholder */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-info/30 to-primary/20"
                        style={{ animation: 'pulse 4s ease-in-out infinite' }}
                    />
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `linear-gradient(rgba(0,255,65,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.5) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
                </div>

                {/* Play Button */}
                {mockProduct.demoVideoUrl && !isVideoPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button
                            onClick={() => setIsVideoPlaying(true)}
                            className="group relative"
                        >
                            <div className="absolute -inset-8 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all">
                                <span className="text-4xl md:text-5xl ml-2">▶️</span>
                            </div>
                            <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/60 whitespace-nowrap">
                                Watch demo
                            </p>
                        </button>
                    </div>
                )}

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
                    <div className="max-w-5xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm mb-4">
                            <Link href="/products" className="text-foreground-muted hover:text-primary">
                                Products
                            </Link>
                            <span className="text-foreground-muted">/</span>
                            <span className="text-foreground">{mockProduct.category}</span>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            {mockProduct.isFeatured && (
                                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                                    ⭐ FEATURED
                                </span>
                            )}
                            <span className="px-3 py-1 rounded-full bg-background/50 backdrop-blur text-foreground text-xs">
                                {mockProduct.category}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                            {mockProduct.name}
                        </h1>
                        <p className="text-lg md:text-xl text-foreground-muted max-w-2xl">
                            {mockProduct.tagline}
                        </p>
                    </div>
                </div>
            </section>

            {/* Price Bar */}
            <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="px-4 py-4">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl md:text-3xl font-bold text-primary">
                                {mockProduct.priceDisplay}
                            </span>
                            <span className="text-sm text-foreground-muted">
                                {mockProduct.priceType === "one_time" && "One-time payment"}
                                {mockProduct.priceType === "monthly" && "Per month"}
                                {mockProduct.priceType === "hourly" && "Per hour"}
                                {mockProduct.priceType === "quote" && "Custom pricing"}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/contact">
                                <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-4 py-12 md:py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="lg:flex lg:gap-12">
                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Features Grid */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
                                {mockProduct.features.map((feature, i) => (
                                    <div
                                        key={i}
                                        className="p-5 rounded-xl bg-background-alt border border-border hover:border-primary/30 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                                            <span className="text-lg text-primary">✓</span>
                                        </div>
                                        <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                                        <p className="text-sm text-foreground-muted">{feature.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Full Description */}
                            <div className="prose-custom max-w-none">
                                {renderContent(mockProduct.descriptionFull)}
                            </div>

                            {/* Testimonials */}
                            {mockProduct.testimonials.length > 0 && (
                                <div className="mt-12">
                                    <h2 className="text-2xl font-bold text-foreground mb-6">What Clients Say</h2>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {mockProduct.testimonials.map((testimonial, i) => (
                                            <div key={i} className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-info/5 border border-border">
                                                <p className="text-foreground-muted mb-4 italic">
                                                    "{testimonial.quote}"
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <span className="font-bold">{testimonial.avatar}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{testimonial.name}</p>
                                                        <p className="text-xs text-foreground-muted">{testimonial.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FAQ */}
                            {mockProduct.faqs.length > 0 && (
                                <div className="mt-12">
                                    <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                                    <div className="space-y-4">
                                        {mockProduct.faqs.map((faq, i) => (
                                            <div key={i} className="p-5 rounded-xl bg-background-alt border border-border">
                                                <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                                                <p className="text-foreground-muted">{faq.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sticky Sidebar */}
                        <aside className="hidden lg:block w-72 flex-shrink-0">
                            <div className="sticky top-24 space-y-4">
                                {/* Price Card */}
                                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-info/10 border border-primary/30">
                                    <p className="text-3xl font-bold text-primary mb-2">{mockProduct.priceDisplay}</p>
                                    <p className="text-sm text-foreground-muted mb-4">
                                        {mockProduct.priceType === "one_time" && "One-time investment"}
                                        {mockProduct.priceType === "monthly" && "Billed monthly"}
                                    </p>
                                    <Link href="/contact" className="block">
                                        <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors mb-3">
                                            Get Started
                                        </button>
                                    </Link>
                                    <Link href="/contact" className="block">
                                        <button className="w-full py-3 rounded-lg bg-background border border-border text-foreground font-medium hover:border-primary/50 transition-colors">
                                            Book a Call First
                                        </button>
                                    </Link>
                                </div>

                                {/* Deliverables */}
                                <div className="p-4 rounded-xl bg-background border border-border">
                                    <h3 className="font-bold text-foreground text-sm mb-3">📦 What You Get</h3>
                                    <ul className="space-y-2">
                                        {mockProduct.deliverables.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-foreground-muted">
                                                <span className="text-primary mt-0.5">✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Related Products */}
                                {mockProduct.relatedProducts.length > 0 && (
                                    <div className="p-4 rounded-xl bg-background border border-border">
                                        <h3 className="font-bold text-foreground text-sm mb-3">🔗 Related</h3>
                                        <div className="space-y-2">
                                            {mockProduct.relatedProducts.map((product, i) => (
                                                <Link
                                                    key={i}
                                                    href={`/products/${product.slug}`}
                                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-background-alt transition-colors group"
                                                >
                                                    <span className="text-sm text-foreground group-hover:text-primary">{product.name}</span>
                                                    <span className="text-xs text-primary">{product.price}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Author */}
                                <Link href="/about/stephen-atcheler">
                                    <div className="p-4 rounded-xl bg-background-alt border border-border hover:border-primary/30 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                                <span className="font-bold">S</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground group-hover:text-primary">Stephen Atcheler</p>
                                                <p className="text-xs text-foreground-muted">Creator</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-info/10">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-foreground-muted mb-8">
                        Book a free call to discuss your needs, or get started right away.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/contact">
                            <button className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                                Get {mockProduct.name}
                            </button>
                        </Link>
                        <Link href="/products">
                            <button className="px-8 py-3 rounded-xl bg-background border border-border text-foreground font-medium hover:border-primary/50 transition-colors">
                                View All Products
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
