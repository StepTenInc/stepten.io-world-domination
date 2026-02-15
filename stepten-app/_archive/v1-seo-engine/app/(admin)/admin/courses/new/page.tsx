"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ModuleIdea {
    id: string;
    title: string;
    description: string;
    lessons: string[];
    isExpanded: boolean;
}

interface CourseForm {
    title: string;
    slug: string;
    description: string;
    category: string;
    difficulty: string;
    targetAudience: string;
    whatYouWillLearn: string[];
    voiceTranscript: string;
    modules: ModuleIdea[];
    price: string;
    priceDisplay: string;
    membershipAccess: boolean;
    status: string;
}

export default function NewCoursePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessingAI, setIsProcessingAI] = useState(false);

    const [course, setCourse] = useState<CourseForm>({
        title: "",
        slug: "",
        description: "",
        category: "AI & Automation",
        difficulty: "intermediate",
        targetAudience: "",
        whatYouWillLearn: [""],
        voiceTranscript: "",
        modules: [],
        price: "",
        priceDisplay: "",
        membershipAccess: false,
        status: "draft",
    });

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    const handleTitleChange = (title: string) => {
        setCourse({
            ...course,
            title,
            slug: generateSlug(title),
        });
    };

    // Simulate voice recording
    const startRecording = () => {
        setIsRecording(true);
        // In production, this would use Web Speech API or similar
    };

    const stopRecording = () => {
        setIsRecording(false);
        // Simulate transcript
        const sampleTranscript = `
I want to create a course about AI automation for businesses. 
The course should cover the basics of what AI is and how it can help automate business processes.
We should start with an introduction module explaining the fundamentals.
Then move into specific tools like Make.com and Zapier.
Show them how to connect AI models like ChatGPT to their workflows.
Include hands-on exercises where they build actual automations.
Cover error handling and monitoring.
End with scaling and best practices.
        `.trim();
        setCourse({ ...course, voiceTranscript: sampleTranscript });
    };

    // Simulate AI structuring the course
    const structureWithAI = async () => {
        setIsProcessingAI(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulated AI-generated structure
        const aiModules: ModuleIdea[] = [
            {
                id: "m1",
                title: "Introduction to AI Automation",
                description: "Foundation concepts and understanding the AI automation landscape",
                lessons: [
                    "Welcome & What You'll Learn",
                    "What is AI Automation?",
                    "The Business Case for Automation",
                    "Setting Up Your Learning Environment",
                ],
                isExpanded: true,
            },
            {
                id: "m2",
                title: "Automation Tools Deep Dive",
                description: "Explore the leading automation platforms and their capabilities",
                lessons: [
                    "Introduction to Make.com",
                    "Getting Started with Zapier",
                    "Comparing n8n vs Make vs Zapier",
                    "Choosing the Right Tool",
                ],
                isExpanded: false,
            },
            {
                id: "m3",
                title: "Connecting AI Models",
                description: "Learn to integrate ChatGPT and other AI models into your workflows",
                lessons: [
                    "Understanding AI APIs",
                    "Setting Up OpenAI Connection",
                    "Building Your First AI Action",
                    "Prompt Engineering for Automation",
                ],
                isExpanded: false,
            },
            {
                id: "m4",
                title: "Hands-On Project Workshop",
                description: "Build real-world automations step by step",
                lessons: [
                    "Project Overview: Lead Enrichment Bot",
                    "Building the Trigger",
                    "Adding AI Processing",
                    "Output Actions & Testing",
                ],
                isExpanded: false,
            },
            {
                id: "m5",
                title: "Error Handling & Monitoring",
                description: "Make your automations production-ready",
                lessons: [
                    "Common Automation Errors",
                    "Building Robust Error Handling",
                    "Setting Up Monitoring",
                    "Alerts & Notifications",
                ],
                isExpanded: false,
            },
            {
                id: "m6",
                title: "Scaling & Best Practices",
                description: "Take your automations to enterprise scale",
                lessons: [
                    "Performance Optimization",
                    "Managing Multiple Workflows",
                    "Documentation & Maintenance",
                    "Next Steps & Resources",
                ],
                isExpanded: false,
            },
        ];

        setCourse({ ...course, modules: aiModules });
        setIsProcessingAI(false);
    };

    const toggleModuleExpand = (moduleId: string) => {
        setCourse({
            ...course,
            modules: course.modules.map(m =>
                m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
            ),
        });
    };

    const addLesson = (moduleId: string) => {
        setCourse({
            ...course,
            modules: course.modules.map(m =>
                m.id === moduleId ? { ...m, lessons: [...m.lessons, "New Lesson"] } : m
            ),
        });
    };

    const updateLesson = (moduleId: string, lessonIndex: number, value: string) => {
        setCourse({
            ...course,
            modules: course.modules.map(m =>
                m.id === moduleId
                    ? { ...m, lessons: m.lessons.map((l, i) => i === lessonIndex ? value : l) }
                    : m
            ),
        });
    };

    const addModule = () => {
        const newModule: ModuleIdea = {
            id: `m${course.modules.length + 1}`,
            title: "New Module",
            description: "",
            lessons: ["Lesson 1"],
            isExpanded: true,
        };
        setCourse({ ...course, modules: [...course.modules, newModule] });
    };

    const handleSave = () => {
        console.log("Saving course:", course);
        router.push("/admin/courses");
    };

    const steps = [
        { id: 1, label: "Course Info", icon: "📝" },
        { id: 2, label: "Voice Input", icon: "🎤" },
        { id: 3, label: "AI Structure", icon: "🤖" },
        { id: 4, label: "Refine", icon: "✏️" },
        { id: 5, label: "Pricing", icon: "💰" },
        { id: 6, label: "Review", icon: "✓" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/courses" className="text-foreground-muted hover:text-primary">
                        ← Back
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Create New Course</h1>
                        <p className="text-foreground-muted">Use voice and AI to structure your course</p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between max-w-4xl overflow-x-auto pb-2">
                {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                        <button
                            onClick={() => setStep(s.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${step === s.id
                                    ? "bg-primary text-primary-foreground"
                                    : step > s.id
                                        ? "bg-primary/20 text-primary"
                                        : "bg-background-alt text-foreground-muted"
                                }`}
                        >
                            <span>{s.icon}</span>
                            <span className="hidden md:inline text-sm">{s.label}</span>
                        </button>
                        {i < steps.length - 1 && (
                            <div className={`w-4 md:w-8 h-0.5 mx-1 ${step > s.id ? "bg-primary" : "bg-border"}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="max-w-4xl">
                {/* Step 1: Course Info */}
                {step === 1 && (
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Course Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Course Title *</label>
                                <input
                                    type="text"
                                    value={course.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary text-lg"
                                    placeholder="e.g., AI Automation Mastery"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">URL Slug</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-foreground-muted">/courses/</span>
                                    <input
                                        type="text"
                                        value={course.slug}
                                        onChange={(e) => setCourse({ ...course, slug: e.target.value })}
                                        className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Short Description</label>
                                <textarea
                                    value={course.description}
                                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary resize-none"
                                    placeholder="One or two sentences about your course"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
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
                                    <label className="text-sm font-medium text-foreground mb-2 block">Difficulty</label>
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
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Who is this course for?</label>
                                <textarea
                                    value={course.targetAudience}
                                    onChange={(e) => setCourse({ ...course, targetAudience: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary resize-none"
                                    placeholder="Describe your ideal student..."
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={() => setStep(2)} className="bg-primary text-primary-foreground">
                                    Next: Voice Input →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Voice Input */}
                {step === 2 && (
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                🎤 Voice to Course
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-6 rounded-xl bg-background-alt border border-border text-center">
                                <p className="text-foreground-muted mb-6">
                                    Describe your course content naturally. Talk about what you want to teach,
                                    the topics to cover, and the structure you have in mind. AI will help
                                    organize it into modules and lessons.
                                </p>

                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`w-32 h-32 rounded-full flex items-center justify-center transition-all mx-auto ${isRecording
                                            ? "bg-error animate-pulse scale-110"
                                            : "bg-primary/20 hover:bg-primary/30 hover:scale-105"
                                        }`}
                                >
                                    <span className="text-5xl">
                                        {isRecording ? "⏹️" : "🎤"}
                                    </span>
                                </button>

                                <p className="text-sm text-foreground-muted mt-4">
                                    {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                                </p>
                            </div>

                            {course.voiceTranscript && (
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Transcript</label>
                                    <textarea
                                        value={course.voiceTranscript}
                                        onChange={(e) => setCourse({ ...course, voiceTranscript: e.target.value })}
                                        rows={8}
                                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary resize-none"
                                    />
                                    <p className="text-xs text-foreground-muted mt-1">
                                        Edit the transcript if needed before AI processing
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(1)} className="border-border text-foreground-muted">
                                    ← Back
                                </Button>
                                <Button
                                    onClick={() => setStep(3)}
                                    disabled={!course.voiceTranscript}
                                    className="bg-primary text-primary-foreground"
                                >
                                    Next: AI Structure →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: AI Structure */}
                {step === 3 && (
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                🤖 AI Course Structuring
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {course.modules.length === 0 ? (
                                <div className="p-8 rounded-xl bg-gradient-to-br from-primary/10 to-info/10 border border-border text-center">
                                    <span className="text-5xl block mb-4">🧠</span>
                                    <h3 className="text-lg font-bold text-foreground mb-2">
                                        Ready to Structure Your Course
                                    </h3>
                                    <p className="text-foreground-muted mb-6 max-w-md mx-auto">
                                        Claude will analyze your transcript and create a logical course
                                        structure with modules and lessons.
                                    </p>
                                    <Button
                                        onClick={structureWithAI}
                                        disabled={isProcessingAI}
                                        className="bg-primary text-primary-foreground"
                                    >
                                        {isProcessingAI ? (
                                            <>
                                                <span className="animate-spin mr-2">⚙️</span>
                                                Processing with AI...
                                            </>
                                        ) : (
                                            "🤖 Structure with Claude"
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                                        <p className="text-success font-medium">
                                            ✓ AI Generated {course.modules.length} modules with {
                                                course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
                                            } lessons
                                        </p>
                                    </div>

                                    {course.modules.map((module) => (
                                        <div key={module.id} className="rounded-xl border border-border overflow-hidden">
                                            <button
                                                onClick={() => toggleModuleExpand(module.id)}
                                                className="w-full flex items-center justify-between p-4 bg-background-alt hover:bg-background-muted transition-colors"
                                            >
                                                <div className="flex items-center gap-3 text-left">
                                                    <span className="text-xl">📖</span>
                                                    <div>
                                                        <h3 className="font-medium text-foreground">{module.title}</h3>
                                                        <p className="text-xs text-foreground-muted">{module.lessons.length} lessons</p>
                                                    </div>
                                                </div>
                                                <span className={`text-lg transition-transform ${module.isExpanded ? "rotate-180" : ""}`}>
                                                    ▼
                                                </span>
                                            </button>
                                            {module.isExpanded && (
                                                <div className="p-4 border-t border-border space-y-2">
                                                    <p className="text-sm text-foreground-muted mb-3">{module.description}</p>
                                                    {module.lessons.map((lesson, i) => (
                                                        <div key={i} className="flex items-center gap-2 p-2 bg-background-alt rounded-lg">
                                                            <span className="text-foreground-muted">{i + 1}.</span>
                                                            <span className="text-foreground">{lesson}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <Button
                                        onClick={structureWithAI}
                                        variant="outline"
                                        className="w-full border-border text-foreground-muted"
                                    >
                                        🔄 Regenerate Structure
                                    </Button>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(2)} className="border-border text-foreground-muted">
                                    ← Back
                                </Button>
                                <Button
                                    onClick={() => setStep(4)}
                                    disabled={course.modules.length === 0}
                                    className="bg-primary text-primary-foreground"
                                >
                                    Next: Refine →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Refine */}
                {step === 4 && (
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Refine Course Structure</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-foreground-muted">
                                Edit module titles, descriptions, and lessons. Drag to reorder.
                            </p>

                            <div className="space-y-4">
                                {course.modules.map((module, moduleIndex) => (
                                    <div key={module.id} className="rounded-xl border border-border overflow-hidden">
                                        <div className="p-4 bg-background-alt">
                                            <div className="flex items-start gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                                                    {moduleIndex + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={module.title}
                                                        onChange={(e) => {
                                                            const updated = [...course.modules];
                                                            updated[moduleIndex].title = e.target.value;
                                                            setCourse({ ...course, modules: updated });
                                                        }}
                                                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground font-medium focus:outline-none focus:border-primary"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={module.description}
                                                        onChange={(e) => {
                                                            const updated = [...course.modules];
                                                            updated[moduleIndex].description = e.target.value;
                                                            setCourse({ ...course, modules: updated });
                                                        }}
                                                        className="w-full h-8 px-3 mt-2 rounded-lg border border-border bg-background text-foreground-muted text-sm focus:outline-none focus:border-primary"
                                                        placeholder="Module description..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            {module.lessons.map((lesson, lessonIndex) => (
                                                <div key={lessonIndex} className="flex items-center gap-2">
                                                    <span className="text-foreground-muted w-6 text-center">{lessonIndex + 1}.</span>
                                                    <input
                                                        type="text"
                                                        value={lesson}
                                                        onChange={(e) => updateLesson(module.id, lessonIndex, e.target.value)}
                                                        className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                                    />
                                                    <select className="h-9 px-2 rounded-lg border border-border bg-background text-foreground-muted text-sm">
                                                        <option value="video">🎬 Video</option>
                                                        <option value="download">📥 Download</option>
                                                        <option value="quiz">❓ Quiz</option>
                                                    </select>
                                                </div>
                                            ))}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => addLesson(module.id)}
                                                className="text-primary w-full border border-dashed border-primary/30"
                                            >
                                                + Add Lesson
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    variant="outline"
                                    onClick={addModule}
                                    className="w-full border-dashed border-border text-foreground-muted py-4"
                                >
                                    + Add New Module
                                </Button>
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(3)} className="border-border text-foreground-muted">
                                    ← Back
                                </Button>
                                <Button onClick={() => setStep(5)} className="bg-primary text-primary-foreground">
                                    Next: Pricing →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 5: Pricing */}
                {step === 5 && (
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Pricing & Access</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                {[
                                    { value: "free", label: "Free", icon: "🎁", desc: "No charge, open access" },
                                    { value: "paid", label: "One-Time", icon: "💰", desc: "Single purchase" },
                                    { value: "membership", label: "Members Only", icon: "👑", desc: "Free for members" },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setCourse({ ...course, membershipAccess: option.value === "membership", price: option.value === "free" ? "0" : course.price })}
                                        className={`p-6 rounded-xl border text-center transition-all ${(option.value === "membership" && course.membershipAccess) ||
                                                (option.value === "free" && course.price === "0") ||
                                                (option.value === "paid" && !course.membershipAccess && course.price !== "0")
                                                ? "border-primary bg-primary/10"
                                                : "border-border bg-background hover:border-primary/50"
                                            }`}
                                    >
                                        <span className="text-4xl block mb-2">{option.icon}</span>
                                        <h3 className="font-bold text-foreground">{option.label}</h3>
                                        <p className="text-xs text-foreground-muted mt-1">{option.desc}</p>
                                    </button>
                                ))}
                            </div>

                            {course.price !== "0" && !course.membershipAccess && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Price (USD)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted">$</span>
                                            <input
                                                type="text"
                                                value={course.price}
                                                onChange={(e) => setCourse({ ...course, price: e.target.value })}
                                                className="w-full h-12 pl-8 pr-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary text-lg"
                                                placeholder="297"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Display Price</label>
                                        <input
                                            type="text"
                                            value={course.priceDisplay}
                                            onChange={(e) => setCourse({ ...course, priceDisplay: e.target.value })}
                                            className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary text-lg"
                                            placeholder="$297"
                                        />
                                    </div>
                                </div>
                            )}

                            {course.membershipAccess && (
                                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                                    <p className="text-foreground">
                                        ✓ This course will be <strong>free for members</strong> and can also be purchased separately.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(4)} className="border-border text-foreground-muted">
                                    ← Back
                                </Button>
                                <Button onClick={() => setStep(6)} className="bg-primary text-primary-foreground">
                                    Next: Review →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 6: Review */}
                {step === 6 && (
                    <div className="space-y-6">
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Course Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Preview Card */}
                                    <div className="rounded-xl border border-border overflow-hidden">
                                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                                            <span className="text-5xl">🎓</span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-foreground text-lg">{course.title || "Course Title"}</h3>
                                            <p className="text-sm text-foreground-muted mt-1">{course.description || "Course description"}</p>
                                            <div className="flex items-center gap-4 mt-4 text-sm text-foreground-muted">
                                                <span>{course.category}</span>
                                                <span>•</span>
                                                <span>{course.difficulty}</span>
                                            </div>
                                            <p className="text-2xl font-bold text-primary mt-4">
                                                {course.membershipAccess ? "Free w/ Membership" : course.priceDisplay || "Free"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg bg-background-alt">
                                            <div className="flex justify-between">
                                                <span className="text-foreground-muted">Modules</span>
                                                <span className="font-bold text-foreground">{course.modules.length}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-background-alt">
                                            <div className="flex justify-between">
                                                <span className="text-foreground-muted">Lessons</span>
                                                <span className="font-bold text-foreground">
                                                    {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-background-alt">
                                            <div className="flex justify-between">
                                                <span className="text-foreground-muted">Category</span>
                                                <span className="font-bold text-foreground">{course.category}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-background-alt">
                                            <div className="flex justify-between">
                                                <span className="text-foreground-muted">Difficulty</span>
                                                <span className="font-bold text-foreground capitalize">{course.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Publish Options */}
                        <Card className="bg-background border-border">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <select
                                        value={course.status}
                                        onChange={(e) => setCourse({ ...course, status: e.target.value })}
                                        className="h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                    >
                                        <option value="draft">Save as Draft</option>
                                        <option value="published">Publish Now</option>
                                    </select>
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={() => setStep(5)} className="border-border text-foreground-muted">
                                            ← Back
                                        </Button>
                                        <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                                            {course.status === "published" ? "🚀 Publish Course" : "💾 Save Draft"}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
