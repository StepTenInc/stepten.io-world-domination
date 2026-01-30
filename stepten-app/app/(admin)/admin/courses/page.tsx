"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    GraduationCap,
    Users,
    CheckCircle2,
    Star,
    TrendingUp,
    Plus,
    Search,
    DollarSign,
    Play,
    Clock,
    BookOpen,
    Sparkles,
    Zap
} from "lucide-react";

// Mock Course Data - will be replaced with Supabase
const mockCourses = [
    {
        id: "1",
        title: "AI Automation Mastery",
        slug: "ai-automation-mastery",
        description: "Learn to build powerful AI automation systems from scratch",
        thumbnail: "/images/courses/ai-automation.jpg",
        previewVideoUrl: "https://example.com/preview-ai-automation.mp4",
        status: "published",
        price: 29700,
        priceDisplay: "$297",
        isFeatured: true,
        category: "AI & Automation",
        difficulty: "intermediate",
        duration: "8 hours",
        modules: 12,
        lessons: 48,
        enrolledStudents: 234,
        completionRate: 68,
        rating: 4.8,
        reviews: 89,
        revenue: 69498,
        lastUpdated: "2026-01-08",
        createdAt: "2025-10-15",
    },
    {
        id: "2",
        title: "SEO Content Engine Blueprint",
        slug: "seo-content-engine-blueprint",
        description: "Build a complete AI-powered content creation pipeline",
        thumbnail: "/images/courses/seo-engine.jpg",
        previewVideoUrl: "https://example.com/preview-seo-engine.mp4",
        status: "published",
        price: 49700,
        priceDisplay: "$497",
        isFeatured: true,
        category: "SEO & Content",
        difficulty: "advanced",
        duration: "12 hours",
        modules: 16,
        lessons: 64,
        enrolledStudents: 156,
        completionRate: 72,
        rating: 4.9,
        reviews: 67,
        revenue: 77532,
        lastUpdated: "2026-01-05",
        createdAt: "2025-09-01",
    },
    {
        id: "3",
        title: "Build Your First AI Agent",
        slug: "build-first-ai-agent",
        description: "A beginner-friendly guide to creating AI agents",
        thumbnail: "/images/courses/ai-agent.jpg",
        previewVideoUrl: "https://example.com/preview-ai-agent.mp4",
        status: "draft",
        price: 9700,
        priceDisplay: "$97",
        isFeatured: false,
        category: "AI & Automation",
        difficulty: "beginner",
        duration: "4 hours",
        modules: 6,
        lessons: 24,
        enrolledStudents: 0,
        completionRate: 0,
        rating: 0,
        reviews: 0,
        revenue: 0,
        lastUpdated: "2026-01-10",
        createdAt: "2026-01-05",
    },
    {
        id: "4",
        title: "Voice-to-App Workshop",
        slug: "voice-to-app-workshop",
        description: "Turn voice ideas into working applications",
        thumbnail: "/images/courses/voice-app.jpg",
        previewVideoUrl: null,
        status: "published",
        price: 0,
        priceDisplay: "Free",
        isFeatured: false,
        category: "Development",
        difficulty: "beginner",
        duration: "2 hours",
        modules: 4,
        lessons: 16,
        enrolledStudents: 567,
        completionRate: 45,
        rating: 4.6,
        reviews: 123,
        revenue: 0,
        lastUpdated: "2025-12-20",
        createdAt: "2025-11-01",
    },
];

const statusColors: Record<string, string> = {
    published: "bg-success/10 text-success border-success/30",
    draft: "bg-warning/10 text-warning border-warning/30",
    archived: "bg-foreground-muted/10 text-foreground-muted border-foreground-muted/30",
};

const difficultyColors: Record<string, string> = {
    beginner: "bg-success/10 text-success border-success/30",
    intermediate: "bg-info/10 text-info border-info/30",
    advanced: "bg-primary/10 text-primary border-primary/30",
};

export default function AdminCoursesPage() {
    const [filter, setFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const filteredCourses = mockCourses.filter(course => {
        const matchesFilter = filter === "all" || course.status === filter || course.category.toLowerCase().includes(filter.toLowerCase());
        const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
            course.description.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const totalStudents = mockCourses.reduce((sum, c) => sum + c.enrolledStudents, 0);
    const totalRevenue = mockCourses.reduce((sum, c) => sum + c.revenue, 0);
    const avgCompletionRate = mockCourses.filter(c => c.completionRate > 0).reduce((sum, c) => sum + c.completionRate, 0) / mockCourses.filter(c => c.completionRate > 0).length;

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
                        Courses
                    </h1>
                    <p className="text-foreground-muted text-lg">
                        Create, manage, and track your educational content
                    </p>
                </div>
                <Link href="/admin/courses/new">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="h-12 px-6 bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group">
                            <span className="relative z-10 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                New Course
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {[
                    { title: "Total Courses", value: mockCourses.length, subtext: `${mockCourses.filter(c => c.status === "published").length} published`, icon: GraduationCap, color: "from-primary/20 to-info/20" },
                    { title: "Total Students", value: totalStudents.toLocaleString(), subtext: "+45 this week", icon: Users, color: "from-info/20 to-primary/20" },
                    { title: "Completion Rate", value: `${avgCompletionRate.toFixed(0)}%`, subtext: "+5% vs last month", icon: CheckCircle2, color: "from-success/20 to-primary/20" },
                    { title: "Avg Rating", value: "4.8", subtext: "279 total reviews", icon: Star, color: "from-warning/20 to-primary/20" },
                    { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, subtext: "+18% this month", icon: DollarSign, color: "from-primary/20 to-success/20" },
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
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="flex gap-2 flex-wrap">
                    {["all", "published", "draft", "AI & Automation", "SEO & Content", "Development"].map(f => (
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
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-64 h-10 pl-10 pr-4 rounded-lg bg-background-alt border border-white/10 hover:border-primary/30 focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-foreground-muted"
                        suppressHydrationWarning
                    />
                </div>
            </motion.div>

            {/* Courses Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course, index) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="group relative"
                    >
                        <motion.div
                            className={`absolute -inset-0.5 bg-gradient-to-r ${course.isFeatured ? 'from-warning/20 to-primary/20' : 'from-primary/20 to-info/20'} rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
                            whileHover={{ scale: 1.02 }}
                        />

                        <Link href={`/admin/courses/${course.slug}`}>
                            <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer h-full">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-info/20">
                                    {course.previewVideoUrl ? (
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                                                <Play className="w-6 h-6 text-white ml-1" />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <GraduationCap className="w-12 h-12 text-primary" />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[course.status]}`}>
                                            {course.status}
                                        </span>
                                        {course.isFeatured && (
                                            <span className="px-2 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium border border-warning/30 flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-warning" />
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Price Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className="px-3 py-1 rounded-lg bg-background/80 backdrop-blur text-foreground text-sm font-bold border border-white/10">
                                            {course.priceDisplay}
                                        </span>
                                    </div>
                                </div>

                                <CardContent className="p-4 relative z-10">
                                    {/* Meta */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-foreground-muted">{course.category}</span>
                                        <span className="text-xs text-foreground-muted">•</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs border ${difficultyColors[course.difficulty]}`}>
                                            {course.difficulty}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-foreground-muted line-clamp-2 mb-4">
                                        {course.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-xs text-foreground-muted mb-4">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />
                                            {course.modules} modules
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {course.duration}
                                        </span>
                                    </div>

                                    {/* Bottom Stats */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1 text-foreground">
                                                <Users className="w-4 h-4 text-primary" />
                                                {course.enrolledStudents}
                                            </span>
                                            {course.rating > 0 && (
                                                <span className="flex items-center gap-1 text-foreground">
                                                    <Star className="w-4 h-4 text-warning fill-warning" />
                                                    {course.rating}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>

                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </Link>
                    </motion.div>
                ))}

                {/* New Course Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + filteredCourses.length * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="group relative"
                >
                    <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-info/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"
                        whileHover={{ scale: 1.02 }}
                    />

                    <Link href="/admin/courses/new">
                        <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-2 border-dashed border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer h-full min-h-[320px] flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>

                            <div className="text-center p-6 relative z-10">
                                <motion.div
                                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20"
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Plus className="w-8 h-8 text-primary" />
                                </motion.div>
                                <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Create New Course</h3>
                                <p className="text-sm text-foreground-muted">
                                    Use AI to structure and create your course content
                                </p>
                            </div>
                        </Card>
                    </Link>
                </motion.div>
            </div>

            {filteredCourses.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-16"
                >
                    <Search className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
                    <p className="text-foreground-muted text-lg">No courses found. Try a different search.</p>
                </motion.div>
            )}
        </div>
    );
}
