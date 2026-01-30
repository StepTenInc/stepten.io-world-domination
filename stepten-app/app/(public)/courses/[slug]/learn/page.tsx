"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

// Mock Course Data for Player
const mockEnrolledCourse = {
    id: "1",
    title: "AI Automation Mastery",
    slug: "ai-automation-mastery",
    progress: 35,
    completedLessons: ["l1", "l2", "l3", "l4", "l5", "l6", "l7"],
    currentLesson: "l8",
    modules: [
        {
            id: "m1",
            title: "Getting Started with AI Automation",
            duration: "45 min",
            isCompleted: true,
            lessons: [
                { id: "l1", title: "Welcome & Course Overview", type: "video", duration: "8:00", videoUrl: "https://example.com/video1.mp4", isCompleted: true },
                { id: "l2", title: "What is AI Automation?", type: "video", duration: "12:00", videoUrl: "https://example.com/video2.mp4", isCompleted: true },
                { id: "l3", title: "Setting Up Your Tools", type: "video", duration: "15:00", videoUrl: "https://example.com/video3.mp4", isCompleted: true },
                { id: "l4", title: "Quick Start Guide", type: "download", duration: "5:00", downloadUrl: "/downloads/quick-start.pdf", isCompleted: true },
            ]
        },
        {
            id: "m2",
            title: "Understanding AI Models",
            duration: "1h 30min",
            isCompleted: false,
            lessons: [
                { id: "l5", title: "Types of AI Models", type: "video", duration: "20:00", videoUrl: "https://example.com/video5.mp4", isCompleted: true },
                { id: "l6", title: "OpenAI vs Claude vs Gemini", type: "video", duration: "25:00", videoUrl: "https://example.com/video6.mp4", isCompleted: true },
                { id: "l7", title: "Choosing the Right Model", type: "video", duration: "15:00", videoUrl: "https://example.com/video7.mp4", isCompleted: true },
                { id: "l8", title: "Hands-On: Your First API Call", type: "video", duration: "20:00", videoUrl: "https://example.com/video8.mp4", isCompleted: false },
                { id: "l9", title: "AI Model Cheat Sheet", type: "download", duration: "5:00", downloadUrl: "/downloads/ai-cheat-sheet.pdf", isCompleted: false },
            ]
        },
        {
            id: "m3",
            title: "Building Your First Automation",
            duration: "2h",
            isCompleted: false,
            lessons: [
                { id: "l10", title: "Planning Your Automation", type: "video", duration: "15:00", videoUrl: "https://example.com/video10.mp4", isCompleted: false },
                { id: "l11", title: "Building the Trigger", type: "video", duration: "20:00", videoUrl: "https://example.com/video11.mp4", isCompleted: false },
                { id: "l12", title: "Adding AI Processing", type: "video", duration: "25:00", videoUrl: "https://example.com/video12.mp4", isCompleted: false },
                { id: "l13", title: "Output & Actions", type: "video", duration: "20:00", videoUrl: "https://example.com/video13.mp4", isCompleted: false },
                { id: "l14", title: "Testing & Debugging", type: "video", duration: "15:00", videoUrl: "https://example.com/video14.mp4", isCompleted: false },
                { id: "l15", title: "Automation Template", type: "download", duration: "5:00", downloadUrl: "/downloads/automation-template.zip", isCompleted: false },
            ]
        },
        {
            id: "m4",
            title: "Advanced Automation Patterns",
            duration: "2h 30min",
            isCompleted: false,
            lessons: [
                { id: "l16", title: "Multi-Step Workflows", type: "video", duration: "25:00", videoUrl: "https://example.com/video16.mp4", isCompleted: false },
                { id: "l17", title: "Conditional Logic", type: "video", duration: "20:00", videoUrl: "https://example.com/video17.mp4", isCompleted: false },
                { id: "l18", title: "Loops & Iterations", type: "video", duration: "20:00", videoUrl: "https://example.com/video18.mp4", isCompleted: false },
                { id: "l19", title: "Error Handling", type: "video", duration: "25:00", videoUrl: "https://example.com/video19.mp4", isCompleted: false },
                { id: "l20", title: "Monitoring & Alerts", type: "video", duration: "20:00", videoUrl: "https://example.com/video20.mp4", isCompleted: false },
            ]
        },
    ],
    milestones: [
        { id: "ms1", title: "Course Started", description: "You've begun your automation journey!", isCompleted: true, completedAt: "Jan 5, 2026" },
        { id: "ms2", title: "First Module Complete", description: "Mastered the fundamentals", isCompleted: true, completedAt: "Jan 6, 2026" },
        { id: "ms3", title: "Halfway There", description: "50% course progress", isCompleted: false, completedAt: null },
        { id: "ms4", title: "Final Project", description: "Complete the capstone project", isCompleted: false, completedAt: null },
        { id: "ms5", title: "Course Completed", description: "Earn your certificate!", isCompleted: false, completedAt: null },
    ],
    notes: [
        { id: "n1", lessonId: "l2", timestamp: "3:45", content: "Key point: AI automation = rules + AI processing", createdAt: "Jan 5, 2026" },
        { id: "n2", lessonId: "l6", timestamp: "12:30", content: "Claude better for long-form, GPT-4 better for structured", createdAt: "Jan 6, 2026" },
    ],
};

export default function CoursePlayerPage() {
    const params = useParams();
    const [course, setCourse] = useState(mockEnrolledCourse);
    const [currentLessonId, setCurrentLessonId] = useState(course.currentLesson);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<"content" | "notes" | "milestones">("content");
    const [newNote, setNewNote] = useState("");

    // Find current lesson data
    const currentLesson = course.modules.flatMap(m => m.lessons).find(l => l.id === currentLessonId);
    const currentModule = course.modules.find(m => m.lessons.some(l => l.id === currentLessonId));

    // Calculate progress
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedCount = course.completedLessons.length;
    const progressPercent = Math.round((completedCount / totalLessons) * 100);

    // Get next lesson
    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    const nextLesson = allLessons[currentIndex + 1];
    const prevLesson = allLessons[currentIndex - 1];

    const markComplete = () => {
        if (!course.completedLessons.includes(currentLessonId)) {
            setCourse({
                ...course,
                completedLessons: [...course.completedLessons, currentLessonId],
            });
        }
        if (nextLesson) {
            setCurrentLessonId(nextLesson.id);
        }
    };

    const selectLesson = (lessonId: string) => {
        setCurrentLessonId(lessonId);
    };

    const lessonTypeIcons: Record<string, string> = {
        video: "🎬",
        download: "📥",
        quiz: "❓",
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? "w-80" : "w-0"} flex-shrink-0 border-r border-border bg-background-alt overflow-hidden transition-all duration-300`}>
                <div className="w-80 h-screen overflow-y-auto">
                    {/* Course Header */}
                    <div className="p-4 border-b border-border">
                        <Link href={`/courses/${course.slug}`} className="text-sm text-foreground-muted hover:text-primary">
                            ← Back to Overview
                        </Link>
                        <h2 className="font-bold text-foreground mt-2 line-clamp-2">{course.title}</h2>

                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-foreground-muted">Progress</span>
                                <span className="text-primary font-medium">{progressPercent}%</span>
                            </div>
                            <div className="h-2 bg-background rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-info transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="text-xs text-foreground-muted mt-1">
                                {completedCount} of {totalLessons} lessons completed
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        {(["content", "notes", "milestones"] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-foreground-muted hover:text-foreground"
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === "content" && (
                        <div className="p-2">
                            {course.modules.map((module) => (
                                <div key={module.id} className="mb-2">
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-background">
                                        <span className={module.isCompleted ? "text-primary" : "text-foreground-muted"}>
                                            {module.isCompleted ? "✓" : "○"}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-foreground">{module.title}</p>
                                            <p className="text-xs text-foreground-muted">{module.duration}</p>
                                        </div>
                                    </div>
                                    <div className="ml-2 mt-1 space-y-1">
                                        {module.lessons.map((lesson) => (
                                            <button
                                                key={lesson.id}
                                                onClick={() => selectLesson(lesson.id)}
                                                className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${currentLessonId === lesson.id
                                                        ? "bg-primary/10 border border-primary/30"
                                                        : "hover:bg-background-muted"
                                                    }`}
                                            >
                                                <span className={course.completedLessons.includes(lesson.id) ? "text-primary" : "text-foreground-muted"}>
                                                    {course.completedLessons.includes(lesson.id) ? "✓" : lessonTypeIcons[lesson.type]}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm truncate ${currentLessonId === lesson.id ? "text-primary" : "text-foreground"
                                                        }`}>
                                                        {lesson.title}
                                                    </p>
                                                    <p className="text-xs text-foreground-muted">{lesson.duration}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "notes" && (
                        <div className="p-4 space-y-4">
                            <div>
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Add a note for this lesson..."
                                    className="w-full h-24 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary resize-none"
                                />
                                <button className="mt-2 w-full py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                                    Add Note
                                </button>
                            </div>
                            <div className="space-y-3">
                                {course.notes.map((note) => (
                                    <div key={note.id} className="p-3 rounded-lg bg-background border border-border">
                                        <p className="text-xs text-primary mb-1">⏱️ {note.timestamp}</p>
                                        <p className="text-sm text-foreground">{note.content}</p>
                                        <p className="text-xs text-foreground-muted mt-2">{note.createdAt}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "milestones" && (
                        <div className="p-4">
                            <div className="space-y-4">
                                {course.milestones.map((milestone, i) => (
                                    <div key={milestone.id} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${milestone.isCompleted ? "bg-primary text-primary-foreground" : "bg-background-muted text-foreground-muted"
                                                }`}>
                                                {milestone.isCompleted ? "✓" : i + 1}
                                            </div>
                                            {i < course.milestones.length - 1 && (
                                                <div className={`w-0.5 h-12 ${milestone.isCompleted ? "bg-primary" : "bg-border"}`} />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <h4 className={`font-medium ${milestone.isCompleted ? "text-foreground" : "text-foreground-muted"}`}>
                                                {milestone.title}
                                            </h4>
                                            <p className="text-xs text-foreground-muted">{milestone.description}</p>
                                            {milestone.completedAt && (
                                                <p className="text-xs text-primary mt-1">✓ {milestone.completedAt}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-background-alt transition-colors"
                        >
                            {isSidebarOpen ? "◀" : "▶"}
                        </button>
                        <div>
                            <p className="text-xs text-foreground-muted">{currentModule?.title}</p>
                            <p className="text-sm font-medium text-foreground">{currentLesson?.title}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => prevLesson && selectLesson(prevLesson.id)}
                            disabled={!prevLesson}
                            className="p-2 rounded-lg hover:bg-background-alt transition-colors disabled:opacity-50"
                        >
                            ◀ Prev
                        </button>
                        <button
                            onClick={() => nextLesson && selectLesson(nextLesson.id)}
                            disabled={!nextLesson}
                            className="p-2 rounded-lg hover:bg-background-alt transition-colors disabled:opacity-50"
                        >
                            Next ▶
                        </button>
                    </div>
                </header>

                {/* Video/Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {currentLesson?.type === "video" && (
                        <div className="relative bg-black">
                            <div className="aspect-video max-h-[60vh] mx-auto flex items-center justify-center bg-gradient-to-br from-primary/20 to-info/20">
                                <button className="w-24 h-24 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform">
                                    <span className="text-4xl ml-1">▶️</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {currentLesson?.type === "download" && (
                        <div className="p-8 max-w-2xl mx-auto">
                            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-info/10 border border-border text-center">
                                <span className="text-6xl block mb-4">📥</span>
                                <h2 className="text-xl font-bold text-foreground mb-2">{currentLesson.title}</h2>
                                <p className="text-foreground-muted mb-6">
                                    Download this resource to enhance your learning experience.
                                </p>
                                <button className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                                    Download Resource
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Lesson Content */}
                    <div className="p-6 max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{currentLesson?.title}</h1>
                                <p className="text-foreground-muted">Duration: {currentLesson?.duration}</p>
                            </div>
                            <button
                                onClick={markComplete}
                                className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${course.completedLessons.includes(currentLessonId)
                                        ? "bg-primary/10 text-primary"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                    }`}
                            >
                                {course.completedLessons.includes(currentLessonId) ? "✓ Completed" : "Mark Complete"}
                            </button>
                        </div>

                        {/* Lesson Description / Transcript */}
                        <div className="prose-custom">
                            <h3 className="text-lg font-bold text-foreground mb-4">About This Lesson</h3>
                            <p className="text-foreground-muted mb-6">
                                In this lesson, you'll learn the fundamentals of making your first API call to an AI model.
                                We'll cover authentication, request formatting, and handling responses.
                            </p>

                            <h3 className="text-lg font-bold text-foreground mb-4">Key Takeaways</h3>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-start gap-2 text-foreground-muted">
                                    <span className="text-primary">✓</span>
                                    Understanding API authentication and keys
                                </li>
                                <li className="flex items-start gap-2 text-foreground-muted">
                                    <span className="text-primary">✓</span>
                                    Formatting requests for OpenAI and Claude
                                </li>
                                <li className="flex items-start gap-2 text-foreground-muted">
                                    <span className="text-primary">✓</span>
                                    Parsing and using AI responses in your applications
                                </li>
                            </ul>

                            <h3 className="text-lg font-bold text-foreground mb-4">Resources</h3>
                            <div className="flex flex-wrap gap-3">
                                <button className="px-4 py-2 rounded-lg bg-background-alt border border-border text-foreground hover:border-primary/50 transition-colors">
                                    📄 Lesson Slides
                                </button>
                                <button className="px-4 py-2 rounded-lg bg-background-alt border border-border text-foreground hover:border-primary/50 transition-colors">
                                    💻 Code Examples
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <footer className="h-16 border-t border-border bg-background flex items-center justify-between px-6 flex-shrink-0">
                    <button
                        onClick={() => prevLesson && selectLesson(prevLesson.id)}
                        disabled={!prevLesson}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-alt transition-colors disabled:opacity-50"
                    >
                        ◀ {prevLesson?.title || "Previous"}
                    </button>
                    <button
                        onClick={markComplete}
                        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                        {course.completedLessons.includes(currentLessonId)
                            ? nextLesson ? "Continue to Next Lesson →" : "Course Complete!"
                            : "Mark Complete & Continue →"
                        }
                    </button>
                </footer>
            </main>
        </div>
    );
}
