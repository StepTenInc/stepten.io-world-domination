"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock User Data - Full Profile
const mockUser = {
    id: "1",
    email: "sarah.johnson@example.com",
    fullName: "Sarah Johnson",
    avatarUrl: null,
    role: "paid_user",
    subscriptionTier: "pro",
    stripeCustomerId: "cus_PrN8K32JdKz9Aa",
    status: "active",
    createdAt: "2025-10-15T08:30:00Z",
    lastActive: "2026-01-10T16:00:00Z",

    // Profile Details
    phone: "+1 (555) 123-4567",
    company: "TechStart Inc",
    jobTitle: "CEO",
    location: "San Francisco, CA",
    timezone: "America/Los_Angeles",
    bio: "Entrepreneur building SaaS products. Passionate about AI and automation.",

    // Preferences
    emailNotifications: true,
    marketingEmails: false,

    // Stats
    stats: {
        coursesEnrolled: 3,
        coursesCompleted: 2,
        lessonsCompleted: 45,
        totalLearningTime: "12h 30m",
        productsOwned: 1,
        totalSpent: 594,
        avgSessionTime: "18 min",
        loginCount: 47,
    },

    // Courses
    courses: [
        { id: "c1", title: "AI Automation Mastery", status: "completed", progress: 100, enrolledAt: "2025-10-18", completedAt: "2025-11-25", price: 297 },
        { id: "c2", title: "Voice-to-App Workshop", status: "completed", progress: 100, enrolledAt: "2025-12-01", completedAt: "2025-12-20", price: 0 },
        { id: "c3", title: "SEO Content Engine Blueprint", status: "in_progress", progress: 35, enrolledAt: "2026-01-02", completedAt: null, price: 297 },
    ],

    // Products
    products: [
        { id: "p1", name: "AI Audit", purchasedAt: "2025-10-18", price: 0, accessType: "membership" },
    ],

    // Transactions
    transactions: [
        { id: "t1", type: "subscription", description: "Pro Membership - Monthly", amount: 97, status: "succeeded", date: "2026-01-01" },
        { id: "t2", type: "subscription", description: "Pro Membership - Monthly", amount: 97, status: "succeeded", date: "2025-12-01" },
        { id: "t3", type: "subscription", description: "Pro Membership - Monthly", amount: 97, status: "succeeded", date: "2025-11-01" },
        { id: "t4", type: "purchase", description: "AI Automation Mastery (Course)", amount: 297, status: "succeeded", date: "2025-10-18" },
        { id: "t5", type: "purchase", description: "SEO Content Engine Blueprint (Course)", amount: 297, status: "succeeded", date: "2026-01-02" },
    ],

    // Activity Timeline
    activityTimeline: [
        { id: "a1", type: "login", description: "Logged in from Chrome on MacOS", timestamp: "2026-01-10 16:00", ip: "192.168.1.xxx" },
        { id: "a2", type: "lesson", description: "Completed lesson: Building the Trigger", timestamp: "2026-01-10 15:30", meta: "SEO Content Engine Blueprint" },
        { id: "a3", type: "lesson", description: "Started lesson: Planning Your Automation", timestamp: "2026-01-10 15:00", meta: "SEO Content Engine Blueprint" },
        { id: "a4", type: "course_enrolled", description: "Enrolled in course", timestamp: "2026-01-02 10:15", meta: "SEO Content Engine Blueprint" },
        { id: "a5", type: "payment", description: "Payment succeeded - $297", timestamp: "2026-01-02 10:15", meta: "SEO Content Engine Blueprint" },
        { id: "a6", type: "subscription", description: "Monthly subscription renewed", timestamp: "2026-01-01 00:00", meta: "Pro Membership" },
        { id: "a7", type: "course_completed", description: "Completed course", timestamp: "2025-12-20 14:30", meta: "Voice-to-App Workshop" },
        { id: "a8", type: "course_enrolled", description: "Enrolled in course", timestamp: "2025-12-01 09:00", meta: "Voice-to-App Workshop" },
        { id: "a9", type: "course_completed", description: "Completed course", timestamp: "2025-11-25 16:45", meta: "AI Automation Mastery" },
        { id: "a10", type: "account_created", description: "Account created", timestamp: "2025-10-15 08:30", meta: null },
    ],

    // Agent Conversations
    agentConversations: [
        { id: "conv1", agent: "Support Agent", messages: 12, lastMessage: "2026-01-08", topic: "Billing question resolved" },
        { id: "conv2", agent: "Onboarding Agent", messages: 8, lastMessage: "2025-10-15", topic: "Initial setup guidance" },
    ],

    // Notes (admin notes)
    adminNotes: [
        { id: "n1", author: "Stephen", content: "VIP customer - helped with custom implementation", createdAt: "2025-11-15" },
    ],

    // Tags
    tags: ["paid", "member", "completed_course", "vip"],
};

const roleColors: Record<string, string> = {
    user: "bg-foreground-muted/20 text-foreground-muted",
    paid_user: "bg-primary/10 text-primary",
    admin: "bg-error/10 text-error",
    superadmin: "bg-primary/20 text-primary",
};

const tierColors: Record<string, string> = {
    free: "bg-foreground-muted/20 text-foreground-muted",
    starter: "bg-info/10 text-info",
    pro: "bg-primary/10 text-primary",
    enterprise: "bg-warning/10 text-warning",
};

const statusColors: Record<string, string> = {
    active: "bg-success/10 text-success",
    inactive: "bg-foreground-muted/20 text-foreground-muted",
    banned: "bg-error/10 text-error",
};

const activityIcons: Record<string, string> = {
    login: "🔑",
    lesson: "📚",
    course_enrolled: "🎓",
    course_completed: "🏆",
    payment: "💳",
    subscription: "♻️",
    account_created: "✨",
};

export default function AdminUserDetailPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState<"overview" | "courses" | "transactions" | "activity" | "settings">("overview");
    const [showBanModal, setShowBanModal] = useState(false);
    const [newNote, setNewNote] = useState("");

    const tabs = [
        { id: "overview", label: "Overview", icon: "📋" },
        { id: "courses", label: "Courses & Products", icon: "🎓" },
        { id: "transactions", label: "Transactions", icon: "💳" },
        { id: "activity", label: "Activity", icon: "📊" },
        { id: "settings", label: "Settings", icon: "⚙️" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Link href="/admin/users" className="text-foreground-muted hover:text-primary mt-1">
                        ← Back
                    </Link>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center">
                        {mockUser.avatarUrl ? (
                            <img src={mockUser.avatarUrl} alt={mockUser.fullName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-primary">{mockUser.fullName.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-foreground">{mockUser.fullName}</h1>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[mockUser.status]}`}>
                                {mockUser.status}
                            </span>
                        </div>
                        <p className="text-foreground-muted mb-2">{mockUser.email}</p>
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[mockUser.role]}`}>
                                {mockUser.role.replace("_", " ")}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[mockUser.subscriptionTier]}`}>
                                {mockUser.subscriptionTier} tier
                            </span>
                            {mockUser.tags.includes("vip") && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                                    ⭐ VIP
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 lg:flex-col">
                    <Button variant="outline" className="border-border text-foreground-muted hover:bg-background-muted">
                        ✉️ Email User
                    </Button>
                    <Button variant="outline" className="border-border text-foreground-muted hover:bg-background-muted">
                        ✏️ Edit Profile
                    </Button>
                    <Button variant="outline" className="border-error text-error hover:bg-error/10" onClick={() => setShowBanModal(true)}>
                        🚫 Ban User
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <p className="text-xs text-foreground-muted">Total Spent</p>
                        <p className="text-2xl font-bold text-primary">${mockUser.stats.totalSpent}</p>
                    </CardContent>
                </Card>
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <p className="text-xs text-foreground-muted">Courses</p>
                        <p className="text-2xl font-bold text-foreground">
                            <span className="text-primary">{mockUser.stats.coursesCompleted}</span>
                            <span className="text-lg text-foreground-muted">/{mockUser.stats.coursesEnrolled}</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <p className="text-xs text-foreground-muted">Learning Time</p>
                        <p className="text-2xl font-bold text-foreground">{mockUser.stats.totalLearningTime}</p>
                    </CardContent>
                </Card>
                <Card className="bg-background border-border">
                    <CardContent className="p-4">
                        <p className="text-xs text-foreground-muted">Login Count</p>
                        <p className="text-2xl font-bold text-foreground">{mockUser.stats.loginCount}</p>
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
                        {/* Profile Details */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Profile Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-xs text-foreground-muted">Full Name</label>
                                        <p className="text-foreground">{mockUser.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-foreground-muted">Email</label>
                                        <p className="text-foreground">{mockUser.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-foreground-muted">Phone</label>
                                        <p className="text-foreground">{mockUser.phone || "—"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-foreground-muted">Company</label>
                                        <p className="text-foreground">{mockUser.company || "—"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-foreground-muted">Job Title</label>
                                        <p className="text-foreground">{mockUser.jobTitle || "—"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-foreground-muted">Location</label>
                                        <p className="text-foreground">{mockUser.location || "—"}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs text-foreground-muted">Bio</label>
                                        <p className="text-foreground">{mockUser.bio || "—"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="bg-background border-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-foreground">Recent Activity</CardTitle>
                                <button onClick={() => setActiveTab("activity")} className="text-sm text-primary hover:underline">
                                    View All →
                                </button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockUser.activityTimeline.slice(0, 5).map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3">
                                            <span className="text-lg">{activityIcons[activity.type] || "📌"}</span>
                                            <div className="flex-1">
                                                <p className="text-foreground">{activity.description}</p>
                                                {activity.meta && (
                                                    <p className="text-xs text-foreground-muted">{activity.meta}</p>
                                                )}
                                            </div>
                                            <p className="text-xs text-foreground-muted whitespace-nowrap">{activity.timestamp}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Account Info */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground text-sm">Account Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-foreground-muted">Member Since</span>
                                    <span className="text-foreground">{new Date(mockUser.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground-muted">Last Active</span>
                                    <span className="text-foreground">{new Date(mockUser.lastActive).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground-muted">Timezone</span>
                                    <span className="text-foreground">{mockUser.timezone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground-muted">Stripe ID</span>
                                    <span className="text-foreground font-mono text-xs">{mockUser.stripeCustomerId}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card className="bg-background border-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-foreground text-sm">Tags</CardTitle>
                                <Button variant="ghost" size="sm" className="text-primary">+ Add</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {mockUser.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
                                            {tag}
                                            <button className="hover:text-error">×</button>
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Notes */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground text-sm">Admin Notes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {mockUser.adminNotes.map((note) => (
                                    <div key={note.id} className="p-3 rounded-lg bg-background-alt">
                                        <p className="text-sm text-foreground mb-2">{note.content}</p>
                                        <p className="text-xs text-foreground-muted">— {note.author}, {note.createdAt}</p>
                                    </div>
                                ))}
                                <div>
                                    <textarea
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Add a note..."
                                        rows={2}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary resize-none"
                                    />
                                    <Button size="sm" className="mt-2 bg-primary text-primary-foreground">
                                        Add Note
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Agent Conversations */}
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground text-sm">Agent Conversations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {mockUser.agentConversations.map((conv) => (
                                    <div key={conv.id} className="flex items-center justify-between p-2 rounded-lg bg-background-alt hover:bg-background-muted transition-colors cursor-pointer">
                                        <div>
                                            <p className="text-sm text-foreground">{conv.agent}</p>
                                            <p className="text-xs text-foreground-muted">{conv.topic}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-foreground-muted">{conv.messages} messages</p>
                                            <p className="text-xs text-foreground-muted">{conv.lastMessage}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "courses" && (
                <div className="space-y-6">
                    {/* Courses */}
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Enrolled Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockUser.courses.map((course) => (
                                    <div key={course.id} className="flex items-center justify-between p-4 rounded-lg bg-background-alt">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                                                <span>🎓</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{course.title}</p>
                                                <p className="text-xs text-foreground-muted">
                                                    Enrolled: {course.enrolledAt}
                                                    {course.completedAt && ` • Completed: ${course.completedAt}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className={`text-sm font-medium ${course.status === "completed" ? "text-success" : "text-primary"
                                                    }`}>
                                                    {course.progress}%
                                                </p>
                                                <p className="text-xs text-foreground-muted">{course.status}</p>
                                            </div>
                                            <p className="text-sm font-medium text-foreground">
                                                {course.price === 0 ? "Free" : `$${course.price}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products */}
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Owned Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mockUser.products.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-background-alt">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                                                <span>📦</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{product.name}</p>
                                                <p className="text-xs text-foreground-muted">Purchased: {product.purchasedAt}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-foreground">
                                                {product.price === 0 ? "—" : `$${product.price}`}
                                            </p>
                                            <p className="text-xs text-foreground-muted">{product.accessType}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "transactions" && (
                <Card className="bg-background border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-foreground">Transaction History</CardTitle>
                        <p className="text-sm text-foreground-muted">
                            Total: <span className="text-primary font-bold">${mockUser.stats.totalSpent}</span>
                        </p>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockUser.transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-border hover:bg-background-alt/50">
                                        <td className="px-4 py-4 text-sm text-foreground-muted">{tx.date}</td>
                                        <td className="px-4 py-4 text-sm text-foreground">{tx.description}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tx.type === "subscription" ? "bg-info/10 text-info" : "bg-primary/10 text-primary"
                                                }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm font-medium text-foreground">
                                            ${tx.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {activeTab === "activity" && (
                <Card className="bg-background border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Full Activity Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-0">
                            {mockUser.activityTimeline.map((activity, i) => (
                                <div key={activity.id} className="flex gap-4 pb-6 last:pb-0">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span>{activityIcons[activity.type] || "📌"}</span>
                                        </div>
                                        {i < mockUser.activityTimeline.length - 1 && (
                                            <div className="w-0.5 h-full bg-border mt-2" />
                                        )}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className="text-foreground">{activity.description}</p>
                                        {activity.meta && (
                                            <p className="text-sm text-primary">{activity.meta}</p>
                                        )}
                                        {activity.ip && (
                                            <p className="text-xs text-foreground-muted">IP: {activity.ip}</p>
                                        )}
                                        <p className="text-xs text-foreground-muted mt-1">{activity.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "settings" && (
                <div className="max-w-2xl space-y-6">
                    {/* Role & Access */}
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Role & Access</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">User Role</label>
                                <select
                                    defaultValue={mockUser.role}
                                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                >
                                    <option value="user">Free User</option>
                                    <option value="paid_user">Paid User</option>
                                    <option value="ops">Ops Team</option>
                                    <option value="seo">SEO Team</option>
                                    <option value="dev">Dev Team</option>
                                    <option value="sales">Sales</option>
                                    <option value="account_manager">Account Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">Subscription Tier</label>
                                <select
                                    defaultValue={mockUser.subscriptionTier}
                                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                >
                                    <option value="free">Free</option>
                                    <option value="starter">Starter</option>
                                    <option value="pro">Pro</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-foreground">Email Notifications</p>
                                    <p className="text-xs text-foreground-muted">Receive course updates and reminders</p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked={mockUser.emailNotifications}
                                    className="rounded border-border"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-foreground">Marketing Emails</p>
                                    <p className="text-xs text-foreground-muted">Receive promotions and offers</p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked={mockUser.marketingEmails}
                                    className="rounded border-border"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="bg-background border-border border-error/50">
                        <CardHeader>
                            <CardTitle className="text-error">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-foreground">Ban User</p>
                                    <p className="text-xs text-foreground-muted">Prevent this user from accessing the platform</p>
                                </div>
                                <Button variant="outline" className="border-error text-error hover:bg-error/10">
                                    🚫 Ban
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-foreground">Delete User</p>
                                    <p className="text-xs text-foreground-muted">Permanently delete this user and all their data</p>
                                </div>
                                <Button variant="outline" className="border-error text-error hover:bg-error/10">
                                    🗑️ Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
