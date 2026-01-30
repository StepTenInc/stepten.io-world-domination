"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

// Mock User Enrolled Courses
const mockEnrolledCourses = [
    {
        id: "1",
        title: "AI Automation Mastery",
        slug: "ai-automation-mastery",
        thumbnail: "/images/courses/ai-automation.jpg",
        progress: 35,
        completedLessons: 7,
        totalLessons: 20,
        lastAccessed: "2 hours ago",
        nextLesson: "Hands-On: Your First API Call",
        status: "in_progress",
        enrolledAt: "Jan 5, 2026",
    },
    {
        id: "2",
        title: "Voice-to-App Workshop",
        slug: "voice-to-app-workshop",
        thumbnail: "/images/courses/voice-app.jpg",
        progress: 100,
        completedLessons: 16,
        totalLessons: 16,
        lastAccessed: "3 days ago",
        nextLesson: null,
        status: "completed",
        enrolledAt: "Dec 20, 2025",
        completedAt: "Dec 28, 2025",
        certificate: "/certificates/voice-to-app-workshop.pdf",
    },
    {
        id: "3",
        title: "SEO Content Engine Blueprint",
        slug: "seo-content-engine-blueprint",
        thumbnail: "/images/courses/seo-engine.jpg",
        progress: 0,
        completedLessons: 0,
        totalLessons: 64,
        lastAccessed: null,
        nextLesson: "Welcome & Course Overview",
        status: "not_started",
        enrolledAt: "Jan 8, 2026",
    },
];

// Mock Achievements
const mockAchievements = [
    { id: "a1", title: "First Steps", description: "Started your first course", icon: "🚀", unlockedAt: "Jan 5, 2026" },
    { id: "a2", title: "Quick Learner", description: "Completed a lesson in under 10 mins", icon: "⚡", unlockedAt: "Jan 5, 2026" },
    { id: "a3", title: "Graduate", description: "Completed your first course", icon: "🎓", unlockedAt: "Dec 28, 2025" },
    { id: "a4", title: "Note Taker", description: "Added 5 notes to lessons", icon: "📝", unlockedAt: null },
    { id: "a5", title: "Consistent", description: "Studied 7 days in a row", icon: "🔥", unlockedAt: null },
];

export default function MyCoursesPage() {
    const [filter, setFilter] = useState<"all" | "in_progress" | "completed" | "not_started">("all");

    const filteredCourses = mockEnrolledCourses.filter(course => {
        if (filter === "all") return true;
        return course.status === filter;
    });

    const inProgressCount = mockEnrolledCourses.filter(c => c.status === "in_progress").length;
    const completedCount = mockEnrolledCourses.filter(c => c.status === "completed").length;
    const totalLessonsCompleted = mockEnrolledCourses.reduce((sum, c) => sum + c.completedLessons, 0);
    const unlockedAchievements = mockAchievements.filter(a => a.unlockedAt).length;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="px-4 py-8 bg-gradient-to-br from-primary/10 via-background to-info/10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Learning</h1>
                    <p className="text-foreground-muted">Track your progress and continue learning</p>
                </div>
            </section>

            <div className="px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Stats Overview */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <Card className="bg-background border-border">
                            <CardContent className="p-4 text-center">
                                <p className="text-3xl font-bold text-foreground">{mockEnrolledCourses.length}</p>
                                <p className="text-sm text-foreground-muted">Enrolled Courses</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-background border-border">
                            <CardContent className="p-4 text-center">
                                <p className="text-3xl font-bold text-primary">{inProgressCount}</p>
                                <p className="text-sm text-foreground-muted">In Progress</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-background border-border">
                            <CardContent className="p-4 text-center">
                                <p className="text-3xl font-bold text-success">{completedCount}</p>
                                <p className="text-sm text-foreground-muted">Completed</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-background border-border">
                            <CardContent className="p-4 text-center">
                                <p className="text-3xl font-bold text-foreground">{totalLessonsCompleted}</p>
                                <p className="text-sm text-foreground-muted">Lessons Done</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:flex lg:gap-8">
                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Continue Learning */}
                            {inProgressCount > 0 && (
                                <section className="mb-8">
                                    <h2 className="text-xl font-bold text-foreground mb-4">Continue Learning</h2>
                                    {mockEnrolledCourses.filter(c => c.status === "in_progress").map(course => (
                                        <Link key={course.id} href={`/courses/${course.slug}/learn`}>
                                            <Card className="bg-background border-border hover:border-primary/50 transition-all mb-4">
                                                <CardContent className="p-0">
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        {/* Thumbnail */}
                                                        <div className="relative w-full md:w-48 flex-shrink-0 aspect-video md:aspect-[4/3] bg-gradient-to-br from-primary/20 to-info/20 rounded-t-xl md:rounded-l-xl md:rounded-tr-none flex items-center justify-center">
                                                            <span className="text-4xl">🎓</span>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 p-4 md:py-4 md:pr-4">
                                                            <h3 className="font-bold text-foreground mb-2">{course.title}</h3>

                                                            {/* Progress */}
                                                            <div className="mb-3">
                                                                <div className="flex items-center justify-between text-sm mb-1">
                                                                    <span className="text-foreground-muted">
                                                                        {course.completedLessons} of {course.totalLessons} lessons
                                                                    </span>
                                                                    <span className="text-primary font-medium">{course.progress}%</span>
                                                                </div>
                                                                <div className="h-2 bg-background-alt rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-primary to-info"
                                                                        style={{ width: `${course.progress}%` }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-sm text-foreground-muted">Next up:</p>
                                                                    <p className="text-sm text-foreground">{course.nextLesson}</p>
                                                                </div>
                                                                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
                                                                    Continue →
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </section>
                            )}

                            {/* Filter Tabs */}
                            <div className="flex gap-2 mb-6">
                                {(["all", "in_progress", "completed", "not_started"] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-background-alt text-foreground-muted hover:text-foreground"
                                            }`}
                                    >
                                        {f === "all" ? "All" :
                                            f === "in_progress" ? "In Progress" :
                                                f === "completed" ? "Completed" : "Not Started"}
                                    </button>
                                ))}
                            </div>

                            {/* All Courses Grid */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {filteredCourses.map(course => (
                                    <Link key={course.id} href={course.status === "completed" ? `/courses/${course.slug}` : `/courses/${course.slug}/learn`}>
                                        <Card className="bg-background border-border hover:border-primary/50 transition-all h-full">
                                            <CardContent className="p-0">
                                                {/* Thumbnail */}
                                                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                                                    <span className="text-4xl">🎓</span>
                                                    {course.status === "completed" && (
                                                        <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-success text-white text-xs font-bold">
                                                            ✓ Completed
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-4">
                                                    <h3 className="font-bold text-foreground mb-2">{course.title}</h3>

                                                    {/* Progress Bar */}
                                                    <div className="mb-3">
                                                        <div className="h-2 bg-background-alt rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${course.status === "completed" ? "bg-success" : "bg-gradient-to-r from-primary to-info"}`}
                                                                style={{ width: `${course.progress}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-foreground-muted mt-1">
                                                            {course.progress}% complete • {course.completedLessons}/{course.totalLessons} lessons
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-foreground-muted">
                                                            {course.lastAccessed ? `Last: ${course.lastAccessed}` : "Not started yet"}
                                                        </span>
                                                        {course.status === "completed" && course.certificate && (
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); }}
                                                                className="text-primary hover:underline"
                                                            >
                                                                📜 Certificate
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                            {filteredCourses.length === 0 && (
                                <div className="text-center py-16">
                                    <span className="text-5xl">📚</span>
                                    <p className="text-foreground-muted mt-4">No courses found in this category.</p>
                                    <Link href="/courses" className="text-primary hover:underline mt-2 inline-block">
                                        Browse courses →
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-72 flex-shrink-0 mt-8 lg:mt-0">
                            {/* Achievements */}
                            <Card className="bg-background border-border mb-4">
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-foreground mb-4">🏆 Achievements</h3>
                                    <div className="space-y-3">
                                        {mockAchievements.map(achievement => (
                                            <div
                                                key={achievement.id}
                                                className={`flex items-center gap-3 p-2 rounded-lg ${achievement.unlockedAt ? "bg-primary/10" : "bg-background-alt opacity-50"
                                                    }`}
                                            >
                                                <span className="text-2xl">{achievement.icon}</span>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${achievement.unlockedAt ? "text-foreground" : "text-foreground-muted"}`}>
                                                        {achievement.title}
                                                    </p>
                                                    <p className="text-xs text-foreground-muted">{achievement.description}</p>
                                                </div>
                                                {achievement.unlockedAt && (
                                                    <span className="text-primary">✓</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-center text-xs text-foreground-muted mt-4">
                                        {unlockedAchievements}/{mockAchievements.length} unlocked
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Learning Streak */}
                            <Card className="bg-background border-border mb-4">
                                <CardContent className="p-4 text-center">
                                    <span className="text-4xl block mb-2">🔥</span>
                                    <p className="text-2xl font-bold text-foreground">3 Day Streak</p>
                                    <p className="text-sm text-foreground-muted">Keep learning to maintain your streak!</p>
                                </CardContent>
                            </Card>

                            {/* Explore More */}
                            <Card className="bg-gradient-to-br from-primary/10 to-info/10 border-primary/30">
                                <CardContent className="p-4 text-center">
                                    <span className="text-3xl block mb-2">🎓</span>
                                    <h3 className="font-bold text-foreground mb-2">Explore More Courses</h3>
                                    <p className="text-sm text-foreground-muted mb-4">
                                        Discover new skills and expand your knowledge
                                    </p>
                                    <Link href="/courses">
                                        <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                                            Browse Courses
                                        </button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}
