"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Course Data
const mockCourse = {
    id: "1",
    title: "AI Automation Mastery",
    slug: "ai-automation-mastery",
    description: "Learn to build powerful AI automation systems from scratch. This comprehensive course takes you from understanding the basics to implementing enterprise-grade solutions that save 20+ hours per week.",
    thumbnail: "/images/courses/ai-automation.jpg",
    previewVideoUrl: "https://example.com/preview.mp4",
    marketingVideoUrl: "https://example.com/marketing.mp4",
    status: "published",
    price: 29700,
    priceDisplay: "$297",
    originalPrice: "$497",
    discountPercent: 40,
    membershipAccess: true,
    isFeatured: true,
    category: "AI & Automation",
    difficulty: "intermediate",
    duration: "8 hours",
    lastUpdated: "January 2026",
    language: "English",
    instructor: {
        name: "Stephen Atcheler",
        title: "AI & Automation Expert",
        bio: "20+ years building and scaling businesses through technology. Helped 500+ companies implement AI solutions.",
        avatar: "S",
        students: 1200,
        courses: 4,
        rating: 4.8,
    },
    stats: {
        enrolledStudents: 234,
        rating: 4.8,
        reviews: 89,
        totalVideos: 48,
        downloadableResources: 12,
    },
    whatYouWillLearn: [
        "Build complete AI automation workflows from scratch using tools like Make.com, Zapier, and n8n",
        "Connect AI models (ChatGPT, Claude, Gemini) to real-world business processes",
        "Create custom AI agents that work 24/7 without human intervention",
        "Implement robust error handling and monitoring for production systems",
        "Scale your automations from MVP to enterprise-grade infrastructure",
        "Save 20+ hours per week by automating repetitive tasks intelligently",
    ],
    requirements: [
        "Basic programming knowledge (any language) - no advanced coding required",
        "Understanding of APIs and webhooks (we'll cover the basics)",
        "A computer with internet access",
        "Curiosity and willingness to experiment",
    ],
    targetAudience: [
        "Entrepreneurs looking to automate their business operations",
        "Developers wanting to add AI to their toolkit",
        "Operations managers seeking efficiency gains",
        "Anyone curious about practical AI applications",
        "Freelancers who want to offer AI services",
    ],
    tools: [
        { name: "OpenAI API", icon: "🤖" },
        { name: "Claude API", icon: "🧠" },
        { name: "Make.com", icon: "⚙️" },
        { name: "Zapier", icon: "⚡" },
        { name: "n8n", icon: "🔗" },
        { name: "Supabase", icon: "🗄️" },
    ],
    modules: [
        {
            id: "m1",
            title: "Getting Started with AI Automation",
            description: "Foundation concepts and setting up your environment",
            duration: "45 min",
            lessons: [
                { id: "l1", title: "Welcome & Course Overview", type: "video", duration: "8:00", isFree: true },
                { id: "l2", title: "What is AI Automation?", type: "video", duration: "12:00", isFree: true },
                { id: "l3", title: "Setting Up Your Tools", type: "video", duration: "15:00", isFree: false },
                { id: "l4", title: "Quick Start Guide", type: "download", duration: "5:00", isFree: false },
            ]
        },
        {
            id: "m2",
            title: "Understanding AI Models",
            description: "Deep dive into different AI models and their use cases",
            duration: "1h 30min",
            lessons: [
                { id: "l5", title: "Types of AI Models", type: "video", duration: "20:00", isFree: false },
                { id: "l6", title: "OpenAI vs Claude vs Gemini", type: "video", duration: "25:00", isFree: false },
                { id: "l7", title: "Choosing the Right Model", type: "video", duration: "15:00", isFree: false },
                { id: "l8", title: "Hands-On: Your First API Call", type: "video", duration: "20:00", isFree: false },
                { id: "l9", title: "AI Model Cheat Sheet", type: "download", duration: "5:00", isFree: false },
            ]
        },
        {
            id: "m3",
            title: "Building Your First Automation",
            description: "Create a complete workflow from start to finish",
            duration: "2h",
            lessons: [
                { id: "l10", title: "Planning Your Automation", type: "video", duration: "15:00", isFree: false },
                { id: "l11", title: "Building the Trigger", type: "video", duration: "20:00", isFree: false },
                { id: "l12", title: "Adding AI Processing", type: "video", duration: "25:00", isFree: false },
                { id: "l13", title: "Output & Actions", type: "video", duration: "20:00", isFree: false },
                { id: "l14", title: "Testing & Debugging", type: "video", duration: "15:00", isFree: false },
                { id: "l15", title: "Automation Template", type: "download", duration: "5:00", isFree: false },
            ]
        },
        {
            id: "m4",
            title: "Advanced Automation Patterns",
            description: "Enterprise-grade automation techniques",
            duration: "2h 30min",
            lessons: [
                { id: "l16", title: "Multi-Step Workflows", type: "video", duration: "25:00", isFree: false },
                { id: "l17", title: "Conditional Logic", type: "video", duration: "20:00", isFree: false },
                { id: "l18", title: "Loops & Iterations", type: "video", duration: "20:00", isFree: false },
                { id: "l19", title: "Error Handling", type: "video", duration: "25:00", isFree: false },
                { id: "l20", title: "Monitoring & Alerts", type: "video", duration: "20:00", isFree: false },
            ]
        },
    ],
    reviews: [
        { name: "Sarah Johnson", rating: 5, comment: "This course changed how I approach automation. Within 2 weeks of completing it, I had automated tasks that were taking me 10+ hours a week. Stephen explains complex concepts in a way that just clicks.", date: "Jan 5, 2026", helpful: 24 },
        { name: "Michael Chen", rating: 5, comment: "Practical, no-fluff content. Every lesson has actionable takeaways. The templates alone are worth the price of the course.", date: "Jan 2, 2026", helpful: 18 },
        { name: "Emily Davis", rating: 5, comment: "I was skeptical about AI automation, but this course completely changed my perspective. Now I'm building automations for clients!", date: "Dec 28, 2025", helpful: 15 },
        { name: "Alex Thompson", rating: 4, comment: "Great course overall. Would love to see more advanced examples in future updates. The fundamentals are solid though.", date: "Dec 20, 2025", helpful: 8 },
    ],
    faqs: [
        { q: "How long do I have access to the course?", a: "Lifetime access! Once you purchase, you can access all content forever, including any future updates." },
        { q: "Is there a money-back guarantee?", a: "Yes! We offer a 30-day no-questions-asked refund policy. If the course isn't for you, just let us know." },
        { q: "Do I need coding experience?", a: "Basic programming knowledge helps, but it's not required. We explain everything step by step." },
        { q: "Will this work for my industry?", a: "These automation principles apply across industries. We have students from SaaS, e-commerce, professional services, and more." },
    ],
};

export default function CourseDetailPage() {
    const params = useParams();
    const [expandedModules, setExpandedModules] = useState<string[]>([mockCourse.modules[0]?.id]);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const lessonTypeIcons: Record<string, string> = {
        video: "🎬",
        download: "📥",
        quiz: "❓",
    };

    const totalLessons = mockCourse.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const freeLessons = mockCourse.modules.reduce((sum, m) => sum + m.lessons.filter(l => l.isFree).length, 0);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with Video */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-info/30 to-primary/20" />
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `linear-gradient(rgba(0,255,65,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.5) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
                </div>

                <div className="relative px-4 py-12 md:py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="lg:flex lg:gap-12 lg:items-start">
                            {/* Left Content */}
                            <div className="flex-1 mb-8 lg:mb-0">
                                {/* Breadcrumb */}
                                <div className="flex items-center gap-2 text-sm mb-4">
                                    <Link href="/courses" className="text-foreground-muted hover:text-primary">
                                        Courses
                                    </Link>
                                    <span className="text-foreground-muted">/</span>
                                    <span className="text-foreground">{mockCourse.category}</span>
                                </div>

                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                    {mockCourse.title}
                                </h1>
                                <p className="text-lg text-foreground-muted mb-6 max-w-2xl">
                                    {mockCourse.description}
                                </p>

                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    {mockCourse.isFeatured && (
                                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                                            ⭐ Bestseller
                                        </span>
                                    )}
                                    <span className="px-3 py-1 rounded-full bg-background/50 backdrop-blur text-foreground text-sm">
                                        {mockCourse.difficulty}
                                    </span>
                                    <span className="text-foreground">
                                        ⭐ {mockCourse.stats.rating} ({mockCourse.stats.reviews} reviews)
                                    </span>
                                    <span className="text-foreground-muted">
                                        {mockCourse.stats.enrolledStudents} students
                                    </span>
                                </div>

                                {/* Instructor */}
                                <Link href="/about/stephen-atcheler" className="flex items-center gap-3 mb-6 group">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="font-bold">{mockCourse.instructor.avatar}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground group-hover:text-primary">
                                            {mockCourse.instructor.name}
                                        </p>
                                        <p className="text-sm text-foreground-muted">{mockCourse.instructor.title}</p>
                                    </div>
                                </Link>

                                {/* Meta */}
                                <div className="flex flex-wrap gap-4 text-sm text-foreground-muted">
                                    <span>📅 Last updated {mockCourse.lastUpdated}</span>
                                    <span>🌐 {mockCourse.language}</span>
                                    <span>⏱️ {mockCourse.duration}</span>
                                </div>
                            </div>

                            {/* Right - Video Preview & CTA */}
                            <div className="lg:w-96 flex-shrink-0">
                                <div className="sticky top-4 rounded-2xl border border-border bg-background overflow-hidden shadow-2xl shadow-primary/10">
                                    {/* Video Preview */}
                                    <div className="relative aspect-video bg-gradient-to-br from-primary/30 to-info/30">
                                        <button
                                            onClick={() => setIsVideoPlaying(true)}
                                            className="absolute inset-0 flex items-center justify-center group"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="text-3xl ml-1">▶️</span>
                                            </div>
                                        </button>
                                        <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur text-white text-sm">
                                            Preview this course
                                        </div>
                                    </div>

                                    {/* Price & CTA */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-3xl font-bold text-foreground">{mockCourse.priceDisplay}</span>
                                            {mockCourse.originalPrice && (
                                                <>
                                                    <span className="text-lg text-foreground-muted line-through">
                                                        {mockCourse.originalPrice}
                                                    </span>
                                                    <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                                                        {mockCourse.discountPercent}% off
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors mb-3">
                                            Enroll Now
                                        </button>

                                        {mockCourse.membershipAccess && (
                                            <p className="text-center text-sm text-foreground-muted mb-4">
                                                or <Link href="/membership" className="text-primary hover:underline">get it free with membership</Link>
                                            </p>
                                        )}

                                        <p className="text-center text-xs text-foreground-muted mb-6">
                                            30-Day Money-Back Guarantee
                                        </p>

                                        {/* Course Includes */}
                                        <div className="space-y-3 text-sm">
                                            <p className="font-medium text-foreground">This course includes:</p>
                                            <div className="flex items-center gap-2 text-foreground-muted">
                                                <span>🎬</span>
                                                <span>{mockCourse.stats.totalVideos} video lessons</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-foreground-muted">
                                                <span>📥</span>
                                                <span>{mockCourse.stats.downloadableResources} downloadable resources</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-foreground-muted">
                                                <span>♾️</span>
                                                <span>Lifetime access</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-foreground-muted">
                                                <span>📱</span>
                                                <span>Access on any device</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-foreground-muted">
                                                <span>📜</span>
                                                <span>Certificate of completion</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-4 py-12 md:py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="lg:flex lg:gap-12">
                        {/* Main Content */}
                        <div className="flex-1 lg:max-w-3xl">
                            {/* What You'll Learn */}
                            <div className="p-6 rounded-2xl border border-border bg-background mb-8">
                                <h2 className="text-xl font-bold text-foreground mb-4">What you'll learn</h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {mockCourse.whatYouWillLearn.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="text-primary mt-0.5">✓</span>
                                            <span className="text-foreground-muted">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tools Covered */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-foreground mb-4">Tools You'll Master</h2>
                                <div className="flex flex-wrap gap-3">
                                    {mockCourse.tools.map((tool, i) => (
                                        <span key={i} className="px-4 py-2 rounded-xl bg-background-alt border border-border flex items-center gap-2">
                                            <span>{tool.icon}</span>
                                            <span className="text-foreground">{tool.name}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Course Content */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-foreground">Course Content</h2>
                                    <div className="text-sm text-foreground-muted">
                                        {mockCourse.modules.length} modules • {totalLessons} lessons • {mockCourse.duration}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-border overflow-hidden">
                                    {mockCourse.modules.map((module) => (
                                        <div key={module.id} className="border-b border-border last:border-b-0">
                                            <button
                                                onClick={() => toggleModule(module.id)}
                                                className="w-full flex items-center justify-between p-4 bg-background-alt hover:bg-background-muted transition-colors"
                                            >
                                                <div className="flex items-center gap-3 text-left">
                                                    <span className={`text-lg transition-transform ${expandedModules.includes(module.id) ? "rotate-90" : ""}`}>
                                                        ▶
                                                    </span>
                                                    <div>
                                                        <h3 className="font-medium text-foreground">{module.title}</h3>
                                                        <p className="text-xs text-foreground-muted">
                                                            {module.lessons.length} lessons • {module.duration}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>

                                            {expandedModules.includes(module.id) && (
                                                <div className="bg-background">
                                                    {module.lessons.map((lesson) => (
                                                        <div
                                                            key={lesson.id}
                                                            className="flex items-center justify-between px-4 py-3 border-t border-border hover:bg-background-alt/50 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-foreground-muted">
                                                                    {lessonTypeIcons[lesson.type]}
                                                                </span>
                                                                <div>
                                                                    <p className="text-foreground">{lesson.title}</p>
                                                                    {lesson.isFree && (
                                                                        <span className="text-xs text-primary">Preview available</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {lesson.isFree && (
                                                                    <button className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                                                                        Preview
                                                                    </button>
                                                                )}
                                                                <span className="text-xs text-foreground-muted">
                                                                    {lesson.duration}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <p className="text-center text-sm text-foreground-muted mt-4">
                                    {freeLessons} free preview lessons available
                                </p>
                            </div>

                            {/* Requirements */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-foreground mb-4">Requirements</h2>
                                <ul className="space-y-2">
                                    {mockCourse.requirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-2 text-foreground-muted">
                                            <span className="text-foreground-muted">•</span>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Who This Is For */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-foreground mb-4">Who this course is for</h2>
                                <ul className="space-y-2">
                                    {mockCourse.targetAudience.map((audience, i) => (
                                        <li key={i} className="flex items-start gap-2 text-foreground-muted">
                                            <span className="text-primary">✓</span>
                                            {audience}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Instructor */}
                            <div className="p-6 rounded-2xl border border-border bg-background mb-8">
                                <h2 className="text-xl font-bold text-foreground mb-4">Your Instructor</h2>
                                <div className="flex items-start gap-4">
                                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-3xl font-bold">{mockCourse.instructor.avatar}</span>
                                    </div>
                                    <div>
                                        <Link href="/about/stephen-atcheler" className="text-lg font-bold text-primary hover:underline">
                                            {mockCourse.instructor.name}
                                        </Link>
                                        <p className="text-foreground-muted mb-2">{mockCourse.instructor.title}</p>
                                        <div className="flex items-center gap-4 text-sm text-foreground-muted mb-3">
                                            <span>⭐ {mockCourse.instructor.rating} Rating</span>
                                            <span>👥 {mockCourse.instructor.students.toLocaleString()} Students</span>
                                            <span>📚 {mockCourse.instructor.courses} Courses</span>
                                        </div>
                                        <p className="text-foreground-muted">{mockCourse.instructor.bio}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-foreground">Student Reviews</h2>
                                    <span className="text-foreground">⭐ {mockCourse.stats.rating} ({mockCourse.stats.reviews} reviews)</span>
                                </div>

                                <div className="space-y-4">
                                    {mockCourse.reviews.map((review, i) => (
                                        <div key={i} className="p-5 rounded-xl bg-background-alt border border-border">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <span className="font-bold">{review.name.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{review.name}</p>
                                                        <p className="text-xs text-foreground-muted">{review.date}</p>
                                                    </div>
                                                </div>
                                                <span className="text-primary">{"⭐".repeat(review.rating)}</span>
                                            </div>
                                            <p className="text-foreground-muted">{review.comment}</p>
                                            <div className="mt-3 flex items-center gap-2 text-xs text-foreground-muted">
                                                <button className="hover:text-primary">👍 Helpful ({review.helpful})</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-4 py-3 rounded-xl border border-border text-foreground hover:border-primary/50 transition-colors">
                                    Show all reviews
                                </button>
                            </div>

                            {/* FAQ */}
                            <div>
                                <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    {mockCourse.faqs.map((faq, i) => (
                                        <div key={i} className="p-5 rounded-xl bg-background-alt border border-border">
                                            <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                                            <p className="text-foreground-muted">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="sticky bottom-0 z-40 bg-background border-t border-border lg:hidden">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <span className="text-2xl font-bold text-foreground">{mockCourse.priceDisplay}</span>
                            {mockCourse.originalPrice && (
                                <span className="text-sm text-foreground-muted line-through ml-2">
                                    {mockCourse.originalPrice}
                                </span>
                            )}
                        </div>
                        <button className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">
                            Enroll Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
