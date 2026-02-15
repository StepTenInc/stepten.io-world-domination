"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock Product Data - will be replaced with Supabase
const mockProduct = {
    id: "1",
    name: "AI Audit",
    slug: "ai-audit",
    tagline: "Comprehensive AI readiness assessment for your business",
    description: "Get a complete analysis of how AI can transform your operations",
    descriptionFull: `## What is the AI Audit?

The AI Audit is a comprehensive assessment of your business's AI readiness. We analyze your current operations, identify opportunities for AI integration, and provide a detailed roadmap for implementation.

## What You'll Get

**Week 1: Discovery & Analysis**
- Deep dive into your current workflows
- Stakeholder interviews
- Technology stack assessment
- Data audit

**Week 2: Strategy & Roadmap**
- AI opportunity identification
- ROI projections
- Implementation timeline
- Tool recommendations

**Week 3: Delivery**
- Comprehensive report (30+ pages)
- Executive summary
- Prioritized action items
- 90-minute presentation call

## Who This Is For

- Businesses doing $1M+ annual revenue
- Companies with 10+ employees
- Organizations looking to automate operations
- Leaders who want to leverage AI strategically

## What's NOT Included

- Implementation (quoted separately)
- Tool licenses
- Ongoing support (available via retainer)`,
    priceType: "one_time",
    priceAmount: 250000, // $2,500 in cents
    priceDisplay: "$2,500",
    status: "active",
    isFeatured: true,
    thumbnailUrl: "/images/products/ai-audit.jpg",
    demoVideoUrl: "https://example.com/ai-audit-demo.mp4",
    category: "Consulting",
    features: [
        "30+ page comprehensive report",
        "Executive summary & presentation",
        "ROI projections & timeline",
        "Prioritized action items",
        "Tool recommendations",
        "90-minute presentation call",
    ],
    deliverables: [
        "AI Readiness Score",
        "Workflow Analysis Document",
        "Implementation Roadmap",
        "Technology Stack Recommendations",
        "Cost-Benefit Analysis",
    ],
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
    stats: {
        views: 342,
        purchases: 12,
        revenue: 30000,
        conversionRate: 3.5,
    },
    analytics: {
        viewsThisMonth: 89,
        viewsLastMonth: 67,
        purchasesThisMonth: 3,
        purchasesLastMonth: 2,
    },
    customers: [
        { id: "1", name: "John Smith", email: "john@example.com", purchasedAt: "2026-01-08", status: "completed" },
        { id: "2", name: "Sarah Johnson", email: "sarah@example.com", purchasedAt: "2026-01-05", status: "completed" },
        { id: "3", name: "Mike Wilson", email: "mike@example.com", purchasedAt: "2026-01-02", status: "in_progress" },
    ],
};

export default function AdminProductDetailPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState<"overview" | "edit" | "analytics" | "customers">("overview");
    const [isEditing, setIsEditing] = useState(false);
    const [product, setProduct] = useState(mockProduct);

    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "edit", label: "Edit Product", icon: "✏️" },
        { id: "analytics", label: "Analytics", icon: "📈" },
        { id: "customers", label: "Customers", icon: "👥" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="text-foreground-muted hover:text-primary">
                        ← Back
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
                            {product.isFeatured && <span className="text-lg">⭐</span>}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                                }`}>
                                {product.status}
                            </span>
                        </div>
                        <p className="text-foreground-muted">{product.tagline}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/products/${product.slug}`} target="_blank">
                        <Button variant="outline" className="border-border text-foreground-muted hover:text-foreground">
                            👁️ View Public Page
                        </Button>
                    </Link>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        💾 Save Changes
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-foreground-muted">Total Views</p>
                                <p className="text-2xl font-bold text-foreground">{product.stats.views}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-success text-xs">+{product.analytics.viewsThisMonth - product.analytics.viewsLastMonth} this month</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-foreground-muted">Purchases</p>
                                <p className="text-2xl font-bold text-foreground">{product.stats.purchases}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-success text-xs">+{product.analytics.purchasesThisMonth} this month</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-foreground-muted">Conversion Rate</p>
                                <p className="text-2xl font-bold text-primary">{product.stats.conversionRate}%</p>
                            </div>
                            <span className="text-xl">📊</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-foreground-muted">Total Revenue</p>
                                <p className="text-2xl font-bold text-primary">${product.stats.revenue.toLocaleString()}</p>
                            </div>
                            <span className="text-xl">💰</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border pb-4">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground-muted hover:text-foreground hover:bg-background-muted"
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Preview */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Product Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center mb-4">
                                    {product.demoVideoUrl ? (
                                        <div className="text-center">
                                            <span className="text-5xl">🎬</span>
                                            <p className="text-sm text-foreground-muted mt-2">Demo Video</p>
                                        </div>
                                    ) : (
                                        <span className="text-5xl">📦</span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{product.name}</h3>
                                <p className="text-foreground-muted mb-4">{product.description}</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-bold text-primary">{product.priceDisplay}</span>
                                    <span className="text-sm text-foreground-muted">{product.priceType}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features & Deliverables */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="bg-background border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground text-sm">Features</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {product.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-foreground-muted">
                                                <span className="text-primary">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card className="bg-background border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground text-sm">Deliverables</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {product.deliverables.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-foreground-muted">
                                                <span className="text-info">📄</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Quick Actions */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground text-sm">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start text-foreground-muted hover:text-foreground border-border">
                                    ✏️ Edit Product
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-foreground-muted hover:text-foreground border-border">
                                    📋 Duplicate
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-foreground-muted hover:text-foreground border-border">
                                    📊 View Analytics
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-error hover:bg-error/10 border-border">
                                    🗑️ Archive
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Customers */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground text-sm">Recent Customers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {product.customers.slice(0, 3).map(customer => (
                                        <div key={customer.id} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-xs font-bold">{customer.name.charAt(0)}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{customer.name}</p>
                                                <p className="text-xs text-foreground-muted">{customer.purchasedAt}</p>
                                            </div>
                                            <span className={`text-xs ${customer.status === "completed" ? "text-success" : "text-warning"}`}>
                                                {customer.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Info */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground text-sm">Product Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-foreground-muted">Category</span>
                                    <span className="text-foreground">{product.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground-muted">Price Type</span>
                                    <span className="text-foreground">{product.priceType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground-muted">Created</span>
                                    <span className="text-foreground">{product.createdAt}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground-muted">Last Updated</span>
                                    <span className="text-foreground">{product.updatedAt}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "edit" && (
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Product Name</label>
                                    <input
                                        type="text"
                                        value={product.name}
                                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Tagline</label>
                                    <input
                                        type="text"
                                        value={product.tagline}
                                        onChange={(e) => setProduct({ ...product, tagline: e.target.value })}
                                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Short Description</label>
                                    <textarea
                                        value={product.description}
                                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Full Description (Markdown)</label>
                                    <textarea
                                        value={product.descriptionFull}
                                        onChange={(e) => setProduct({ ...product, descriptionFull: e.target.value })}
                                        rows={12}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono text-sm focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-1 block">Price Type</label>
                                        <select
                                            value={product.priceType}
                                            onChange={(e) => setProduct({ ...product, priceType: e.target.value })}
                                            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                        >
                                            <option value="one_time">One-Time</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="hourly">Hourly</option>
                                            <option value="quote">Quote</option>
                                            <option value="free">Free</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-1 block">Price Display</label>
                                        <input
                                            type="text"
                                            value={product.priceDisplay}
                                            onChange={(e) => setProduct({ ...product, priceDisplay: e.target.value })}
                                            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                            placeholder="$2,500"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Media */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Media</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Cover Image</label>
                                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                        <span className="text-4xl">📷</span>
                                        <p className="text-foreground-muted mt-2">Drop image or click to upload</p>
                                        <p className="text-xs text-foreground-muted">Recommended: 1200x630px</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Demo Video URL</label>
                                    <input
                                        type="text"
                                        value={product.demoVideoUrl || ""}
                                        onChange={(e) => setProduct({ ...product, demoVideoUrl: e.target.value })}
                                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                        placeholder="https://example.com/video.mp4"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground text-sm">Publish Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Status</label>
                                    <select
                                        value={product.status}
                                        onChange={(e) => setProduct({ ...product, status: e.target.value })}
                                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
                                    <select
                                        value={product.category}
                                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                    >
                                        <option value="Consulting">Consulting</option>
                                        <option value="Development">Development</option>
                                        <option value="Products">Products</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={product.isFeatured}
                                        onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })}
                                        className="rounded border-border"
                                    />
                                    <label className="text-sm text-foreground">Featured Product</label>
                                </div>
                            </CardContent>
                        </Card>

                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            💾 Save Changes
                        </Button>
                        <Button variant="outline" className="w-full border-border text-foreground-muted">
                            Preview Changes
                        </Button>
                    </div>
                </div>
            )}

            {activeTab === "analytics" && (
                <div className="space-y-6">
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Views Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-background-alt rounded-lg">
                                <p className="text-foreground-muted">📊 Chart placeholder - Views analytics</p>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Traffic Sources</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        { source: "Direct", percent: 45, color: "bg-primary" },
                                        { source: "Google", percent: 30, color: "bg-info" },
                                        { source: "Articles", percent: 15, color: "bg-success" },
                                        { source: "Social", percent: 10, color: "bg-warning" },
                                    ].map(source => (
                                        <div key={source.source}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-foreground">{source.source}</span>
                                                <span className="text-foreground-muted">{source.percent}%</span>
                                            </div>
                                            <div className="h-2 bg-background-alt rounded-full overflow-hidden">
                                                <div className={`h-full ${source.color}`} style={{ width: `${source.percent}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Conversion Funnel</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        { stage: "Page Views", count: 342, percent: 100 },
                                        { stage: "CTA Clicks", count: 89, percent: 26 },
                                        { stage: "Started Checkout", count: 34, percent: 10 },
                                        { stage: "Completed Purchase", count: 12, percent: 3.5 },
                                    ].map(stage => (
                                        <div key={stage.stage} className="flex items-center gap-3">
                                            <div className="w-24 text-sm text-foreground truncate">{stage.stage}</div>
                                            <div className="flex-1 h-6 bg-background-alt rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${stage.percent}%` }} />
                                            </div>
                                            <div className="w-16 text-right text-sm text-foreground-muted">{stage.count}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "customers" && (
                <Card className="bg-background border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Purchased</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.customers.map(customer => (
                                        <tr key={customer.id} className="border-b border-border hover:bg-background-alt/50">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-xs font-bold">{customer.name.charAt(0)}</span>
                                                    </div>
                                                    <span className="font-medium text-foreground">{customer.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-foreground-muted">{customer.email}</td>
                                            <td className="px-4 py-4 text-foreground-muted">{customer.purchasedAt}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${customer.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                                                    }`}>
                                                    {customer.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="text-foreground-muted">
                                                    View →
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
