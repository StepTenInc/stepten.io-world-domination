"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Users, TrendingUp, Star, Play, ArrowRight, Check, Crown } from "lucide-react";
import MatrixRain from "@/components/effects/MatrixRain";
import FloatingParticles from "@/components/effects/FloatingParticles";
import AnimatedCounter from "@/components/effects/AnimatedCounter";

// Mock Courses Data
const mockCourses = [
    {
        id: "1",
        title: "AI Automation Mastery",
        slug: "ai-automation-mastery",
        description: "Learn to build powerful AI automation systems from scratch. This comprehensive course takes you from understanding the basics to implementing enterprise-grade solutions.",
        thumbnail: "/images/courses/ai-automation.jpg",
        previewVideoUrl: "https://example.com/preview.mp4",
        status: "published",
        price: 29700,
        priceDisplay: "$297",
        originalPrice: "$497",
        isFeatured: true,
        category: "AI & Automation",
        difficulty: "intermediate",
        duration: "8 hours",
        modules: 12,
        lessons: 48,
        enrolledStudents: 234,
        rating: 4.8,
        reviews: 89,
        instructor: { name: "Stephen Atcheler", avatar: "S" },
        whatYouWillLearn: [
            "Build complete AI automation workflows",
            "Connect AI models to business processes",
            "Create custom AI agents that work 24/7",
        ],
    },
    {
        id: "2",
        title: "SEO Content Engine Blueprint",
        slug: "seo-content-engine-blueprint",
        description: "Build a complete AI-powered content creation pipeline that generates, optimizes, and publishes content automatically.",
        thumbnail: "/images/courses/seo-engine.jpg",
        previewVideoUrl: "https://example.com/preview-seo.mp4",
        status: "published",
        price: 49700,
        priceDisplay: "$497",
        originalPrice: "$797",
        isFeatured: true,
        category: "SEO & Content",
        difficulty: "advanced",
        duration: "12 hours",
        modules: 16,
        lessons: 64,
        enrolledStudents: 156,
        rating: 4.9,
        reviews: 67,
        instructor: { name: "Stephen Atcheler", avatar: "S" },
        whatYouWillLearn: [
            "Voice-to-article automation pipeline",
            "AI-powered research and writing",
            "SEO optimization strategies",
        ],
    },
    {
        id: "3",
        title: "Voice-to-App Workshop",
        slug: "voice-to-app-workshop",
        description: "Learn to turn voice ideas into working applications using AI and modern development tools.",
        thumbnail: "/images/courses/voice-app.jpg",
        previewVideoUrl: null,
        status: "published",
        price: 0,
        priceDisplay: "Free",
        originalPrice: null,
        isFeatured: false,
        category: "Development",
        difficulty: "beginner",
        duration: "2 hours",
        modules: 4,
        lessons: 16,
        enrolledStudents: 567,
        rating: 4.6,
        reviews: 123,
        instructor: { name: "Stephen Atcheler", avatar: "S" },
        whatYouWillLearn: [
            "Voice-first development workflow",
            "AI-assisted coding basics",
            "Rapid prototyping techniques",
        ],
    },
    {
        id: "4",
        title: "Business Automation Fundamentals",
        slug: "business-automation-fundamentals",
        description: "The essential guide to automating your business operations, saving time and reducing errors.",
        thumbnail: "/images/courses/business-auto.jpg",
        previewVideoUrl: "https://example.com/preview-business.mp4",
        status: "published",
        price: 9700,
        priceDisplay: "$97",
        originalPrice: "$197",
        isFeatured: false,
        category: "AI & Automation",
        difficulty: "beginner",
        duration: "4 hours",
        modules: 8,
        lessons: 32,
        enrolledStudents: 312,
        rating: 4.7,
        reviews: 98,
        instructor: { name: "Stephen Atcheler", avatar: "S" },
        whatYouWillLearn: [
            "Automation fundamentals",
            "Tool selection strategies",
            "First automation projects",
        ],
    },
];

const categories = ["All", "AI & Automation", "SEO & Content", "Development"];
const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCourses = mockCourses.filter(course => {
        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === "All Levels" ||
            course.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesDifficulty && matchesSearch && course.status === "published";
    });

    const featuredCourses = mockCourses.filter(c => c.isFeatured && c.status === "published");
    const totalStudents = mockCourses.reduce((sum, c) => sum + c.enrolledStudents, 0);

    const heroRef = useRef(null);

    return (
        <div className="min-h-screen bg-background relative">
            {/* Matrix Rain Background */}
            <MatrixRain />

            {/* Floating Particles */}
            <FloatingParticles count={20} />

            {/* Hero Section */}
            <section ref={heroRef} className="relative overflow-hidden pt-32 pb-20">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-info/10 to-background"
                        animate={{
                            opacity: [0.3, 0.5, 0.3],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-info/20 blur-[120px]"
                        animate={{
                            x: [0, 50, 0],
                            y: [0, 30, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] opacity-30" />
                </div>

                <div className="relative px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-xl mb-8 hover:bg-white/15 hover:border-primary/30 transition-all shadow-xl shadow-black/20"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [1, 0.5, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-2.5 h-2.5 rounded-full bg-primary"
                            />
                            <span className="text-sm font-semibold text-white">Learn from Experience</span>
                            <Sparkles className="w-4 h-4 text-primary" />
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <span className="text-white">Master </span>
                                <span className="relative inline-block">
                                    <motion.span
                                        className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-info to-primary"
                                        animate={{
                                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        style={{ backgroundSize: '200% 200%' }}
                                    >
                                        AI & Automation
                                    </motion.span>
                                    <motion.div
                                        className="absolute inset-0 blur-3xl opacity-50"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.3, 0.6, 0.3]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        style={{
                                            background: 'linear-gradient(90deg, #00FF41, #22D3EE, #00FF41)',
                                        }}
                                    />
                                </span>
                            </motion.div>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-10 leading-relaxed"
                        >
                            Hands-on courses that take you from{' '}
                            <span className="text-white font-bold">curious to confident</span>.
                            Learn to build real systems that{' '}
                            <span className="text-primary font-bold">save time and scale</span>.
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="flex flex-wrap items-center justify-center gap-12 mb-12"
                        >
                            {[
                                { icon: Star, label: 'Courses', value: mockCourses.length, suffix: '+' },
                                { icon: Users, label: 'Students', value: totalStudents },
                                { icon: TrendingUp, label: 'Avg Rating', value: 4.8, suffix: '/5' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.9 + index * 0.2, duration: 0.5 }}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                            className="p-2 rounded-lg bg-primary/10 border border-primary/20"
                                        >
                                            <stat.icon className="w-5 h-5 text-primary" />
                                        </motion.div>
                                        <div className="text-3xl md:text-4xl font-black text-white">
                                            {typeof stat.value === 'number' && stat.value > 10 ? (
                                                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                            ) : (
                                                `${stat.value}${stat.suffix || ''}`
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-foreground-muted font-medium">{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-5"
                        >
                            <motion.a
                                href="#all-courses"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-14 px-10 text-lg bg-gradient-to-r from-primary to-info text-background hover:shadow-2xl hover:shadow-primary/50 font-bold rounded-full border-0 relative overflow-hidden group flex items-center gap-2"
                            >
                                <span className="relative z-10">Browse Courses</span>
                                <ArrowRight className="w-5 h-5 relative z-10" />
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{
                                        x: ['-200%', '200%']
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />
                            </motion.a>

                            <Link href="/membership">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="h-14 px-10 text-lg border-2 border-white/30 hover:bg-white/10 hover:border-primary/50 text-white rounded-full backdrop-blur-xl font-semibold shadow-xl flex items-center gap-2"
                                >
                                    <Star className="w-5 h-5 fill-current text-primary" />
                                    Get All Access
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="relative px-4 py-20 bg-background-alt/50 overflow-hidden">
                {/* Background Effects */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                        scaleX: [0.8, 1, 0.8]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center justify-between mb-12"
                    >
                        <div className="flex items-center gap-3">
                            <motion.span
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-3xl"
                            >
                                <Star className="w-4 h-4 inline fill-current text-primary" />
                            </motion.span>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-white">Featured Courses</h2>
                                <p className="text-foreground-muted mt-1">Our most popular learning paths</p>
                            </div>
                        </div>
                        <Link href="#all-courses" className="text-primary hover:text-info transition-colors text-sm font-bold flex items-center gap-2 group">
                            View all
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowRight className="w-4 h-4" />
                            </motion.div>
                        </Link>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {featuredCourses.map(course => (
                            <Link
                                key={course.id}
                                href={`/courses/${course.slug}`}
                                className="group flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-background border border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full md:w-48 flex-shrink-0 aspect-video md:aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-info/20">
                                    {course.previewVideoUrl && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="text-xl"><Play className="w-5 h-5 fill-current" /></span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                                        <Star className="w-4 h-4 inline fill-current text-primary" /> FEATURED
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded-full bg-background-alt text-xs text-foreground-muted">
                                            {course.category}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-info/10 text-xs text-info">
                                            {course.difficulty}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-foreground-muted line-clamp-2 mb-3">
                                        {course.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-foreground-muted mb-3">
                                        <span>{course.modules} modules</span>
                                        <span>•</span>
                                        <span>{course.duration}</span>
                                        <span>•</span>
                                        <span><Users className="w-4 h-4 inline" /> {course.enrolledStudents}</span>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-primary">{course.priceDisplay}</span>
                                            {course.originalPrice && (
                                                <span className="text-sm text-foreground-muted line-through">
                                                    {course.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-foreground-muted flex items-center gap-1">
                                            <Star className="w-4 h-4 inline fill-current text-primary" /> {course.rating} ({course.reviews})
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section id="all-courses" className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-y border-border">
                <div className="px-4 py-4">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
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
                        <div className="flex gap-3">
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                            >
                                {difficulties.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full lg:w-64 h-10 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
                                suppressHydrationWarning
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* All Courses Grid */}
            <section className="px-4 py-12 md:py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">All Courses</h2>
                            <p className="text-foreground-muted mt-1">
                                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCourses.map(course => (
                            <Link
                                key={course.id}
                                href={`/courses/${course.slug}`}
                                className="group rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-info/20">
                                    {course.previewVideoUrl && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="text-xl"><Play className="w-5 h-5 fill-current" /></span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className="px-2 py-1 rounded-lg bg-background/80 backdrop-blur text-xs font-medium text-foreground">
                                            {course.category}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2 py-1 rounded-lg bg-background/80 backdrop-blur text-xs font-bold text-primary">
                                            {course.priceDisplay}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${course.difficulty === "beginner" ? "bg-success/10 text-success" :
                                                course.difficulty === "intermediate" ? "bg-info/10 text-info" :
                                                    "bg-primary/10 text-primary"
                                            }`}>
                                            {course.difficulty}
                                        </span>
                                        <span className="text-xs text-foreground-muted">{course.duration}</span>
                                    </div>

                                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>

                                    <p className="text-sm text-foreground-muted line-clamp-2 mb-4">
                                        {course.description}
                                    </p>

                                    {/* What you'll learn preview */}
                                    <div className="space-y-1 mb-4">
                                        {course.whatYouWillLearn.slice(0, 2).map((item, i) => (
                                            <div key={i} className="flex items-start gap-2 text-xs text-foreground-muted">
                                                <span className="text-primary"><Check className="w-4 h-4 inline" /></span>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                                <span className="text-xs font-bold">{course.instructor.avatar}</span>
                                            </div>
                                            <span className="text-xs text-foreground-muted">{course.instructor.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-primary"><Star className="w-4 h-4 inline fill-current text-primary" /> {course.rating}</span>
                                            <span className="text-foreground-muted">({course.reviews})</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-16">
                            <span className="text-5xl">🔍</span>
                            <p className="text-foreground-muted mt-4">No courses found. Try a different filter.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Membership CTA */}
            <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-info/10">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="text-4xl mb-4 block"><Crown className="w-10 h-10 text-primary fill-current" /></span>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Get All-Access with Membership
                    </h2>
                    <p className="text-foreground-muted mb-8 max-w-xl mx-auto">
                        Unlock every course, get new content as it's released, and join our
                        private community of builders. One subscription, unlimited learning.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <Link href="/membership">
                            <button className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                                View Membership Plans
                            </button>
                        </Link>
                        <span className="text-foreground-muted">or</span>
                        <Link href="/courses">
                            <button className="px-8 py-3 rounded-xl bg-background border border-border text-foreground font-medium hover:border-primary/50 transition-colors">
                                Buy Courses Individually
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
