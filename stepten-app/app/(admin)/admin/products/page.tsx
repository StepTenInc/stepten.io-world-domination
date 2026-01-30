"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Package,
    Eye,
    Edit,
    Plus,
    Search,
    TrendingUp,
    ShoppingCart,
    DollarSign,
    Sparkles,
    Film,
    Star,
    Zap
} from "lucide-react";

// Mock Products Data - will be replaced with Supabase
const mockProducts = [
    {
        id: "1",
        name: "AI Audit",
        slug: "ai-audit",
        tagline: "Comprehensive AI readiness assessment for your business",
        description: "Get a complete analysis of how AI can transform your operations",
        priceType: "one_time",
        priceAmount: 250000,
        priceDisplay: "$2,500",
        status: "active",
        isFeatured: true,
        thumbnailUrl: "/images/products/ai-audit.jpg",
        demoVideoUrl: "https://example.com/ai-audit-demo.mp4",
        category: "Consulting",
        createdAt: "2026-01-10",
        updatedAt: "2026-01-10",
        stats: {
            views: 342,
            purchases: 12,
            revenue: 30000,
        },
    },
    {
        id: "2",
        name: "One-Off Consulting Session",
        slug: "one-off-consulting",
        tagline: "1-hour strategy session with actionable insights",
        description: "Get focused advice on your biggest challenge",
        priceType: "one_time",
        priceAmount: 50000,
        priceDisplay: "$500",
        status: "active",
        isFeatured: false,
        thumbnailUrl: "/images/products/consulting.jpg",
        demoVideoUrl: null,
        category: "Consulting",
        createdAt: "2025-12-01",
        updatedAt: "2026-01-05",
        stats: {
            views: 567,
            purchases: 24,
            revenue: 12000,
        },
    },
    {
        id: "3",
        name: "Monthly Retainer",
        slug: "monthly-retainer",
        tagline: "Ongoing strategic support and priority access",
        description: "2 sessions per month with async support",
        priceType: "monthly",
        priceAmount: 75000,
        priceDisplay: "$750/mo",
        status: "active",
        isFeatured: true,
        thumbnailUrl: "/images/products/retainer.jpg",
        demoVideoUrl: null,
        category: "Consulting",
        createdAt: "2025-11-15",
        updatedAt: "2026-01-08",
        stats: {
            views: 423,
            purchases: 8,
            revenue: 6000,
        },
    },
    {
        id: "4",
        name: "Block Hours",
        slug: "block-hours",
        tagline: "10-hour development blocks at $250/hour",
        description: "Web apps, AI, automation - full stack builds",
        priceType: "hourly",
        priceAmount: 25000,
        priceDisplay: "$250/hr",
        status: "active",
        isFeatured: false,
        thumbnailUrl: "/images/products/dev-work.jpg",
        demoVideoUrl: null,
        category: "Development",
        createdAt: "2025-10-20",
        updatedAt: "2025-12-15",
        stats: {
            views: 289,
            purchases: 5,
            revenue: 12500,
        },
    },
    {
        id: "5",
        name: "SEO Content Engine",
        slug: "seo-content-engine",
        tagline: "AI-powered content creation pipeline",
        description: "Voice to published article with full automation",
        priceType: "quote",
        priceAmount: null,
        priceDisplay: "Custom Quote",
        status: "active",
        isFeatured: true,
        thumbnailUrl: "/images/products/seo-engine.jpg",
        demoVideoUrl: "https://example.com/seo-engine-demo.mp4",
        category: "Products",
        createdAt: "2025-09-01",
        updatedAt: "2026-01-10",
        stats: {
            views: 1204,
            purchases: 3,
            revenue: 15000,
        },
    },
    {
        id: "6",
        name: "Custom Project",
        slug: "custom-project",
        tagline: "MVPs, full apps, AI integrations",
        description: "Full scoping & proposal for your unique needs",
        priceType: "quote",
        priceAmount: null,
        priceDisplay: "Quote",
        status: "draft",
        isFeatured: false,
        thumbnailUrl: "/images/products/custom.jpg",
        demoVideoUrl: null,
        category: "Development",
        createdAt: "2025-08-01",
        updatedAt: "2025-12-01",
        stats: {
            views: 156,
            purchases: 2,
            revenue: 35000,
        },
    },
];

const statusColors: Record<string, string> = {
    active: "bg-success/10 text-success border-success/30",
    draft: "bg-warning/10 text-warning border-warning/30",
    archived: "bg-foreground-muted/10 text-foreground-muted border-foreground-muted/30",
};

const priceTypeLabels: Record<string, string> = {
    one_time: "One-Time",
    monthly: "Monthly",
    hourly: "Hourly",
    quote: "Quote",
    free: "Free",
};

export default function AdminProductsPage() {
    const [filter, setFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const filteredProducts = mockProducts.filter(product => {
        const matchesFilter = filter === "all" || product.status === filter || product.category.toLowerCase() === filter.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.tagline.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const totalRevenue = mockProducts.reduce((sum, p) => sum + p.stats.revenue, 0);
    const totalViews = mockProducts.reduce((sum, p) => sum + p.stats.views, 0);
    const totalPurchases = mockProducts.reduce((sum, p) => sum + p.stats.purchases, 0);

    return (
        <div className="space-y-8 p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            <Sparkles className="w-8 h-8 text-primary" />
                        </motion.div>
                        Products & Services
                    </h1>
                    <p className="text-foreground-muted text-lg">
                        Manage your offerings and track performance
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="h-12 px-6 bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group">
                            <span className="relative z-10 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                New Product
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{
                                    x: ['-200%', '200%']
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        </Button>
                    </motion.div>
                </Link>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Products", value: mockProducts.length, subtext: `${mockProducts.filter(p => p.status === "active").length} active`, icon: Package, color: "from-primary/20 to-info/20" },
                    { title: "Total Views", value: totalViews.toLocaleString(), subtext: "+18% this month", icon: Eye, color: "from-info/20 to-primary/20" },
                    { title: "Total Purchases", value: totalPurchases, subtext: "+5 this week", icon: ShoppingCart, color: "from-primary/20 to-success/20" },
                    { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, subtext: "+23% this month", icon: DollarSign, color: "from-success/20 to-primary/20" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="group relative"
                    >
                        <motion.div
                            className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
                            whileHover={{ scale: 1.02 }}
                        />

                        <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>

                            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                                <CardTitle className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">
                                    {stat.title}
                                </CardTitle>
                                <motion.div
                                    className="p-3 rounded-xl bg-primary/10 border border-primary/20"
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <stat.icon className="w-5 h-5 text-primary" />
                                </motion.div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                                <div className="flex items-center gap-2 text-xs">
                                    <TrendingUp className="w-4 h-4 text-success" />
                                    <span className="text-success font-bold">{stat.subtext}</span>
                                </div>
                            </CardContent>

                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Filters & Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="flex gap-2 flex-wrap">
                    {["all", "active", "draft", "Consulting", "Development", "Products"].map(f => (
                        <motion.button
                            key={f}
                            onClick={() => setFilter(f)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                    ? "bg-gradient-to-r from-primary to-info text-background shadow-lg shadow-primary/30"
                                    : "bg-background-alt text-foreground-muted hover:text-foreground hover:bg-background-muted border border-white/10"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </motion.button>
                    ))}
                </div>
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-64 h-10 pl-10 pr-4 rounded-lg bg-background-alt border border-white/10 hover:border-primary/30 focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-foreground-muted"
                        suppressHydrationWarning
                    />
                </div>
            </motion.div>

            {/* Products Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="group relative"
            >
                <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-info/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                    whileHover={{ scale: 1.02 }}
                />

                <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    </div>

                    <CardContent className="p-0 relative z-10">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Product</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Price</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Views</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Sales</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Revenue</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product, index) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + index * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors group/row"
                                        >
                                            <td className="px-4 py-4">
                                                <Link href={`/admin/products/${product.slug}`} className="flex items-center gap-3 group/link">
                                                    <motion.div
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center flex-shrink-0 border border-white/10"
                                                    >
                                                        {product.demoVideoUrl ? (
                                                            <Film className="w-5 h-5 text-primary" />
                                                        ) : (
                                                            <Package className="w-5 h-5 text-primary" />
                                                        )}
                                                    </motion.div>
                                                    <div>
                                                        <p className="font-medium text-foreground group-hover/link:text-primary transition-colors flex items-center gap-2">
                                                            {product.name}
                                                            {product.isFeatured && <Star className="w-4 h-4 text-warning fill-warning" />}
                                                        </p>
                                                        <p className="text-xs text-foreground-muted line-clamp-1">{product.tagline}</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="px-2 py-1 rounded-full bg-background-alt text-xs text-foreground-muted border border-white/10">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-foreground">{product.priceDisplay}</p>
                                                    <p className="text-xs text-foreground-muted">{priceTypeLabels[product.priceType]}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[product.status]}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right text-foreground">{product.stats.views.toLocaleString()}</td>
                                            <td className="px-4 py-4 text-right text-foreground">{product.stats.purchases}</td>
                                            <td className="px-4 py-4 text-right font-medium text-primary">${product.stats.revenue.toLocaleString()}</td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/products/${product.slug}`} target="_blank">
                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                            <Button variant="ghost" size="sm" className="text-foreground-muted hover:text-info">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </motion.div>
                                                    </Link>
                                                    <Link href={`/admin/products/${product.slug}`}>
                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                            <Button variant="ghost" size="sm" className="text-foreground-muted hover:text-primary">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </motion.div>
                                                    </Link>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Featured Products */}
            <div className="grid gap-6 lg:grid-cols-3">
                {mockProducts.filter(p => p.isFeatured).slice(0, 3).map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="group relative"
                    >
                        <motion.div
                            className="absolute -inset-0.5 bg-gradient-to-r from-warning/20 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"
                            whileHover={{ scale: 1.02 }}
                        />

                        <Link href={`/admin/products/${product.slug}`}>
                            <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <CardContent className="p-4 relative z-10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <motion.div
                                            className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Star className="w-5 h-5 text-warning fill-warning" />
                                        </motion.div>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">{product.name}</p>
                                            <p className="text-xs text-foreground-muted">{product.priceDisplay}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-foreground-muted">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {product.stats.views}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ShoppingCart className="w-3 h-3" />
                                            {product.stats.purchases}
                                        </span>
                                        <span className="text-primary font-bold">${product.stats.revenue.toLocaleString()}</span>
                                    </div>
                                </CardContent>

                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-warning/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
