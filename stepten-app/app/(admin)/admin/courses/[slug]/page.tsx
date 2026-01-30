"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock Course Data
const mockCourse = {
    id: "1",
    title: "AI Automation Mastery",
    slug: "ai-automation-mastery",
    description: "Learn to build powerful AI automation systems from scratch. This comprehensive course takes you from understanding the basics to implementing enterprise-grade solutions.",
    thumbnail: "/images/courses/ai-automation.jpg",
    previewVideoUrl: "https://example.com/preview.mp4",
    marketingVideoUrl: "https://example.com/marketing.mp4",
    status: "published",
    price: 29700,
    priceDisplay: "$297",
    membershipAccess: true,
    isFeatured: true,
    category: "AI & Automation",
    difficulty: "intermediate",
    duration: "8 hours",
    instructor: "Stephen Atcheler",
    lastUpdated: "2026-01-08",
    createdAt: "2025-10-15",
    whatYouWillLearn: [
        "Build complete AI automation workflows from scratch",
        "Connect AI models to real-world business processes",
        "Create custom AI agents that work 24/7",
        "Implement error handling and monitoring",
        "Scale your automations for enterprise use",
        "Save 20+ hours per week with smart automation",
    ],
    requirements: [
        "Basic programming knowledge (any language)",
        "Understanding of APIs and webhooks",
        "A computer with internet access",
        "Curiosity and willingness to experiment",
    ],
    targetAudience: [
        "Entrepreneurs looking to automate their business",
        "Developers wanting to add AI to their toolkit",
        "Operations managers seeking efficiency gains",
        "Anyone curious about practical AI applications",
    ],
    tools: [
        { name: "OpenAI API", icon: "🤖" },
        { name: "Claude API", icon: "🧠" },
        { name: "Make.com", icon: "⚙️" },
        { name: "Zapier", icon: "⚡" },
        { name: "n8n", icon: "🔗" },
    ],
    stats: {
        enrolledStudents: 234,
        completionRate: 68,
        rating: 4.8,
        reviews: 89,
        revenue: 69498,
        activeStudents: 156,
        completedStudents: 78,
    },
    modules: [
        {
            id: "m1",
            order: 1,
            title: "Getting Started with AI Automation",
            description: "Foundation concepts and setting up your environment",
            duration: "45 min",
            lessons: [
                { id: "l1", title: "Welcome & Course Overview", type: "video", duration: "8:00", isFree: true, isCompleted: false },
                { id: "l2", title: "What is AI Automation?", type: "video", duration: "12:00", isFree: true, isCompleted: false },
                { id: "l3", title: "Setting Up Your Tools", type: "video", duration: "15:00", isFree: false, isCompleted: false },
                { id: "l4", title: "Quick Start Guide", type: "download", duration: "5:00", isFree: false, isCompleted: false },
            ]
        },
        {
            id: "m2",
            order: 2,
            title: "Understanding AI Models",
            description: "Deep dive into different AI models and their use cases",
            duration: "1h 30min",
            lessons: [
                { id: "l5", title: "Types of AI Models", type: "video", duration: "20:00", isFree: false, isCompleted: false },
                { id: "l6", title: "OpenAI vs Claude vs Gemini", type: "video", duration: "25:00", isFree: false, isCompleted: false },
                { id: "l7", title: "Choosing the Right Model", type: "video", duration: "15:00", isFree: false, isCompleted: false },
                { id: "l8", title: "Hands-On: Your First API Call", type: "video", duration: "20:00", isFree: false, isCompleted: false },
                { id: "l9", title: "AI Model Cheat Sheet", type: "download", duration: "5:00", isFree: false, isCompleted: false },
            ]
        },
        {
            id: "m3",
            order: 3,
            title: "Building Your First Automation",
            description: "Create a complete workflow from start to finish",
            duration: "2h",
            lessons: [
                { id: "l10", title: "Planning Your Automation", type: "video", duration: "15:00", isFree: false, isCompleted: false },
                { id: "l11", title: "Building the Trigger", type: "video", duration: "20:00", isFree: false, isCompleted: false },
                { id: "l12", title: "Adding AI Processing", type: "video", duration: "25:00", isFree: false, isCompleted: false },
                { id: "l13", title: "Output & Actions", type: "video", duration: "20:00", isFree: false, isCompleted: false },
                { id: "l14", title: "Testing & Debugging", type: "video", duration: "15:00", isFree: false, isCompleted: false },
                { id: "l15", title: "Automation Template", type: "download", duration: "5:00", isFree: false, isCompleted: false },
            ]
        },
    ],
    downloadableAssets: [
        { name: "Quick Start Guide.pdf", size: "2.4 MB", downloads: 189 },
        { name: "AI Model Cheat Sheet.pdf", size: "1.1 MB", downloads: 156 },
        { name: "Automation Templates.zip", size: "5.8 MB", downloads: 134 },
        { name: "Resource Links.pdf", size: "0.5 MB", downloads: 98 },
    ],
    reviews: [
        { name: "Sarah J.", rating: 5, comment: "This course changed how I approach automation. Worth every penny!", date: "2026-01-05" },
        { name: "Mike C.", rating: 5, comment: "Practical, no-fluff content. Stephen explains complex concepts simply.", date: "2026-01-02" },
        { name: "Alex T.", rating: 4, comment: "Great course, would love to see more advanced examples.", date: "2025-12-28" },
    ],
};

export default function AdminCourseDetailPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "students" | "analytics" | "settings">("overview");
    const [course, setCourse] = useState(mockCourse);
    const [expandedModules, setExpandedModules] = useState<string[]>([mockCourse.modules[0]?.id]);

    const tabs = [
        { id: "overview", label: "Overview", icon: "📋" },
        { id: "curriculum", label: "Curriculum", icon: "📚" },
        { id: "students", label: "Students", icon: "👥" },
        { id: "analytics", label: "Analytics", icon: "📊" },
        { id: "settings", label: "Settings", icon: "⚙️" },
    ];

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
        assignment: "📝",
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/courses" className="text-foreground-muted hover:text-primary">
                        ← Back
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
                            {course.isFeatured && <span className="text-lg">⭐</span>}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${course.status === "published" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                                }`}>
                                {course.status}
                            </span>
                        </div>
                        <p className="text-foreground-muted text-sm">{course.category} • {course.difficulty} • {course.duration}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/courses/${course.slug}`} target="_blank">
                        <Button variant="outline" className="border-border text-foreground-muted hover:text-foreground">
                            👁️ Preview
                        </Button>
                    </Link>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        💾 Save Changes
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-foreground-muted">Students</p>
                                <p className="text-2xl font-bold text-foreground">{course.stats.enrolledStudents}</p>
                            </div>
                            <span className="text-xl">👥</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-foreground-muted">Completion</p>
                                <p className="text-2xl font-bold text-foreground">{course.stats.completionRate}%</p>
                            </div>
                            <span className="text-xl">✅</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-foreground-muted">Rating</p>
                                <p className="text-2xl font-bold text-primary">⭐ {course.stats.rating}</p>
                            </div>
                            <span className="text-xs text-foreground-muted">{course.stats.reviews} reviews</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-foreground-muted">Revenue</p>
                                <p className="text-2xl font-bold text-primary">${course.stats.revenue.toLocaleString()}</p>
                            </div>
                            <span className="text-xl">💰</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-foreground-muted">Active Now</p>
                                <p className="text-2xl font-bold text-success">{course.stats.activeStudents}</p>
                            </div>
                            <span className="text-xl">🟢</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border pb-4 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
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
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Course Info */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Course Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
                                    <input
                                        type="text"
                                        value={course.title}
                                        onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                                    <textarea
                                        value={course.description}
                                        onChange={(e) => setCourse({ ...course, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
                                        <select
                                            value={course.category}
                                            onChange={(e) => setCourse({ ...course, category: e.target.value })}
                                            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                        >
                                            <option value="AI & Automation">AI & Automation</option>
                                            <option value="SEO & Content">SEO & Content</option>
                                            <option value="Development">Development</option>
                                            <option value="Business">Business</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-1 block">Difficulty</label>
                                        <select
                                            value={course.difficulty}
                                            onChange={(e) => setCourse({ ...course, difficulty: e.target.value })}
                                            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* What You'll Learn */}
                        <Card className="bg-background border-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-foreground">What You'll Learn</CardTitle>
                                <Button variant="ghost" size="sm" className="text-primary">+ Add</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {course.whatYouWillLearn.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-background-alt group">
                                            <span className="text-primary">✓</span>
                                            <span className="flex-1 text-foreground">{item}</span>
                                            <button className="text-error opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tools Covered */}
                        <Card className="bg-background border-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-foreground">Tools Covered</CardTitle>
                                <Button variant="ghost" size="sm" className="text-primary">+ Add</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {course.tools.map((tool, i) => (
                                        <span key={i} className="px-3 py-2 rounded-lg bg-background-alt border border-border flex items-center gap-2">
                                            <span>{tool.icon}</span>
                                            <span className="text-foreground">{tool.name}</span>
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Media */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground text-sm">Course Media</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-xs text-foreground-muted mb-2 block">Thumbnail</label>
                                    <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors">
                                        <span className="text-3xl">📷</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-foreground-muted mb-2 block">Marketing Video</label>
                                    <div className="aspect-video rounded-lg bg-background-alt flex items-center justify-center border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors">
                                        <span className="text-3xl">🎬</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground text-sm">Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-xs text-foreground-muted mb-1 block">Price</label>
                                    <input
                                        type="text"
                                        value={course.priceDisplay}
                                        onChange={(e) => setCourse({ ...course, priceDisplay: e.target.value })}
                                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={course.membershipAccess}
                                        onChange={(e) => setCourse({ ...course, membershipAccess: e.target.checked })}
                                        className="rounded border-border"
                                    />
                                    <label className="text-sm text-foreground">Free with membership</label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Downloadable Assets */}
                        <Card className="bg-background border-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-foreground text-sm">Downloadable Assets</CardTitle>
                                <Button variant="ghost" size="sm" className="text-primary">+ Add</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {course.downloadableAssets.map((asset, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background-alt text-sm">
                                            <div className="flex items-center gap-2">
                                                <span>📄</span>
                                                <span className="text-foreground">{asset.name}</span>
                                            </div>
                                            <span className="text-xs text-foreground-muted">{asset.downloads} DL</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "curriculum" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Course Curriculum</h2>
                            <p className="text-foreground-muted text-sm">
                                {course.modules.length} modules • {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="border-border text-foreground-muted">
                                🎤 Voice Input
                            </Button>
                            <Button className="bg-primary text-primary-foreground">
                                + Add Module
                            </Button>
                        </div>
                    </div>

                    {/* Modules */}
                    <div className="space-y-4">
                        {course.modules.map((module, moduleIndex) => (
                            <Card key={module.id} className="bg-background border-border overflow-hidden">
                                {/* Module Header */}
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full flex items-center justify-between p-4 bg-background-alt hover:bg-background-muted transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {module.order}
                                        </span>
                                        <div className="text-left">
                                            <h3 className="font-medium text-foreground">{module.title}</h3>
                                            <p className="text-xs text-foreground-muted">{module.lessons.length} lessons • {module.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" size="sm" className="text-foreground-muted">
                                            ✏️
                                        </Button>
                                        <span className={`text-lg transition-transform ${expandedModules.includes(module.id) ? "rotate-180" : ""}`}>
                                            ▼
                                        </span>
                                    </div>
                                </button>

                                {/* Lessons */}
                                {expandedModules.includes(module.id) && (
                                    <div className="p-4 border-t border-border">
                                        <div className="space-y-2">
                                            {module.lessons.map((lesson, lessonIndex) => (
                                                <div
                                                    key={lesson.id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-background-alt hover:bg-background-muted transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg">{lessonTypeIcons[lesson.type]}</span>
                                                        <div>
                                                            <p className="text-foreground font-medium">{lesson.title}</p>
                                                            <p className="text-xs text-foreground-muted">{lesson.duration}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {lesson.isFree && (
                                                            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">
                                                                Free Preview
                                                            </span>
                                                        )}
                                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-foreground-muted">
                                                            ✏️
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-error">
                                                            🗑️
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="ghost" className="w-full mt-3 text-primary border border-dashed border-primary/30">
                                            + Add Lesson
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>

                    {/* Add Module */}
                    <Button variant="outline" className="w-full border-dashed border-border text-foreground-muted py-6">
                        + Add New Module
                    </Button>
                </div>
            )}

            {activeTab === "students" && (
                <Card className="bg-background border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Enrolled Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full sm:w-64 h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
                                suppressHydrationWarning
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Student</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Enrolled</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Progress</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Last Active</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: "Sarah Johnson", email: "sarah@example.com", enrolled: "2026-01-05", progress: 85, lastActive: "2 hours ago", status: "active" },
                                        { name: "Mike Chen", email: "mike@example.com", enrolled: "2026-01-02", progress: 100, lastActive: "Yesterday", status: "completed" },
                                        { name: "Emily Davis", email: "emily@example.com", enrolled: "2025-12-28", progress: 45, lastActive: "3 days ago", status: "active" },
                                    ].map((student, i) => (
                                        <tr key={i} className="border-b border-border hover:bg-background-alt/50">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-xs font-bold">{student.name.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{student.name}</p>
                                                        <p className="text-xs text-foreground-muted">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-foreground-muted">{student.enrolled}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-background-alt rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary" style={{ width: `${student.progress}%` }} />
                                                    </div>
                                                    <span className="text-sm text-foreground">{student.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-foreground-muted">{student.lastActive}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${student.status === "completed" ? "bg-success/10 text-success" : "bg-info/10 text-info"
                                                    }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "analytics" && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Enrollment Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-background-alt rounded-lg">
                                <p className="text-foreground-muted">📊 Enrollment chart</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Revenue Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-background-alt rounded-lg">
                                <p className="text-foreground-muted">📈 Revenue chart</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Lesson Completion Rates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {course.modules.map(module => (
                                    <div key={module.id}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-foreground">{module.title}</span>
                                            <span className="text-foreground-muted">{Math.floor(Math.random() * 30) + 60}%</span>
                                        </div>
                                        <div className="h-2 bg-background-alt rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${Math.floor(Math.random() * 30) + 60}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Recent Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {course.reviews.map((review, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-background-alt">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-primary">{"⭐".repeat(review.rating)}</span>
                                            <span className="text-xs text-foreground-muted">{review.date}</span>
                                        </div>
                                        <p className="text-sm text-foreground-muted mb-2">{review.comment}</p>
                                        <p className="text-xs text-foreground">— {review.name}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "settings" && (
                <div className="max-w-2xl space-y-6">
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Course Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">Status</label>
                                <select
                                    value={course.status}
                                    onChange={(e) => setCourse({ ...course, status: e.target.value })}
                                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={course.isFeatured} onChange={(e) => setCourse({ ...course, isFeatured: e.target.checked })} className="rounded border-border" />
                                <label className="text-sm text-foreground">Featured Course</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={course.membershipAccess} onChange={(e) => setCourse({ ...course, membershipAccess: e.target.checked })} className="rounded border-border" />
                                <label className="text-sm text-foreground">Free for Members</label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-background border-border border-error/50">
                        <CardHeader>
                            <CardTitle className="text-error">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="border-error text-error hover:bg-error/10">
                                🗑️ Archive Course
                            </Button>
                            <p className="text-xs text-foreground-muted">
                                This will hide the course from new enrollments but preserve all student data.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
