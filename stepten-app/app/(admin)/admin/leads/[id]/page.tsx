"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock Lead Detail Data
const mockLead = {
    id: "l4",
    name: "Michael Ross",
    email: "mike.ross@example.com",
    phone: "+1 (555) 987-6543",
    company: "Law & Co",
    jobTitle: "Senior Partner",
    status: "lead_with_details",
    score: 85,
    lastActive: "1 day ago",
    createdAt: "2026-01-05T14:30:00",

    // Technical Metadata
    ip: "203.0.113.45",
    location: "New York, NY, US",
    device: "MacBook Pro (macOS 14.2)",
    browser: "Chrome 120.0",
    resolution: "1920x1080",

    // Enrichment Data
    industry: "Legal Services",
    employeeCount: "50-200",
    annualRevenue: "$10M - $50M",
    linkedinUrl: "linkedin.com/in/michaelross-law",
    website: "lawandco.com",
    techStack: ["WordPress", "HubSpot", "Google Analytics"],

    // Qualification
    budget: "$5k - $10k",
    timeline: "Immediately",
    intent: "High - Visited pricing page 3 times",
    leadType: "consulting",

    // Journey
    journey: [
        { id: "j1", type: "page_view", detail: "Visited /pricing", time: "1 day ago" },
        { id: "j2", type: "form_submit", detail: "Submitted 'Consultation Request'", time: "1 day ago" },
        { id: "j3", type: "page_view", detail: "Visited /services/ai-automation", time: "2 days ago" },
        { id: "j4", type: "page_view", detail: "Landed on Homepage (Referral: LinkedIn)", time: "2 days ago" },
    ],

    // AI Analysis
    aiSummary: "Michael is a high-intent lead looking to modernize his law firm with AI automation. He has specifically looked at automation services and has the budget/authority to purchase. Recommend immediate follow-up with 'Legal Tech Automation' case study.",
    suggestedAction: "Email with 'Law Firm Automation Blueprint' PDF",

    // Notes
    notes: [
        { id: "n1", author: "AI System", text: "Enriched profile from LinkedIn data", time: "1 day ago" },
    ],
};

const statusColors: Record<string, string> = {
    visited_site: "bg-foreground-muted/10 text-foreground-muted",
    return_visitor: "bg-info/10 text-info",
    lead_with_details: "bg-warning/10 text-warning",
    converted: "bg-success/10 text-success",
};

export default function AdminLeadDetailPage() {
    const params = useParams();
    const [note, setNote] = useState("");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Link href="/admin/leads" className="text-foreground-muted hover:text-primary mt-1">
                        ← Back
                    </Link>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warning/20 to-primary/20 flex items-center justify-center text-2xl font-bold text-warning">
                        {mockLead.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-foreground">{mockLead.name}</h1>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[mockLead.status]}`}>
                                {mockLead.status.replace(/_/g, " ")}
                            </span>
                        </div>
                        <p className="text-foreground-muted">{mockLead.jobTitle} at {mockLead.company}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-foreground-muted">
                            <span className="flex items-center gap-1">📍 {mockLead.location}</span>
                            <span className="flex items-center gap-1">💻 {mockLead.device}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-border text-foreground-muted">
                        ✉️ Email Lead
                    </Button>
                    <Button className="bg-success text-success-foreground hover:bg-success/90">
                        ✨ Convert to User
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Qualification & Enrichment */}
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                🔍 Lead Enrichment & Qualification
                                <span className="text-xs font-normal px-2 py-0.5 rounded bg-primary/10 text-primary">Score: {mockLead.score}/100</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-medium text-foreground-muted text-sm uppercase tracking-wider">Company Data</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground-muted">Industry</span>
                                        <span className="text-foreground font-medium">{mockLead.industry}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground-muted">Size</span>
                                        <span className="text-foreground font-medium">{mockLead.employeeCount} employees</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground-muted">Revenue</span>
                                        <span className="text-foreground font-medium">{mockLead.annualRevenue}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground-muted">Website</span>
                                        <a href={`https://${mockLead.website}`} target="_blank" className="text-primary hover:underline">{mockLead.website}</a>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-medium text-foreground-muted text-sm uppercase tracking-wider">Signals</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground-muted">Budget</span>
                                        <span className="text-foreground font-medium">{mockLead.budget}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground-muted">Timeline</span>
                                        <span className="text-foreground font-medium">{mockLead.timeline}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground-muted">Lead Type</span>
                                        <span className="text-foreground font-medium capitalize">{mockLead.leadType}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground-muted">Tech Stack</span>
                                        <span className="text-foreground text-right font-medium text-xs">{mockLead.techStack.join(", ")}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Analysis */}
                    <Card className="bg-background border-border bg-gradient-to-br from-primary/5 to-transparent">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                🤖 AI Agent Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-background/50 rounded-lg border border-primary/20">
                                <p className="text-foreground italic leading-relaxed">"{mockLead.aiSummary}"</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-foreground-muted">Recommended Action:</span>
                                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform">
                                    {mockLead.suggestedAction}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Journey Timeline */}
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Visitor Journey</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 relative pl-4 border-l border-border">
                                {mockLead.journey.map((step) => (
                                    <div key={step.id} className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                                        <div>
                                            <p className="text-foreground font-medium">{step.detail}</p>
                                            <p className="text-xs text-foreground-muted">{step.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground text-sm">Contact Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 font-mono text-sm">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">📧</span>
                                <span className="text-foreground">{mockLead.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg">📞</span>
                                <span className="text-foreground">{mockLead.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg">🔗</span>
                                <a href={`https://${mockLead.linkedinUrl}`} target="_blank" className="text-primary hover:underline">LinkedIn Profile</a>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical Details */}
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground text-sm">Session Meta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-foreground-muted">
                            <p>IP: <span className="text-foreground">{mockLead.ip}</span></p>
                            <p>Browser: <span className="text-foreground">{mockLead.browser}</span></p>
                            <p>First Seen: <span className="text-foreground">{new Date(mockLead.createdAt).toLocaleDateString()}</span></p>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground text-sm">Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {mockLead.notes.map((n) => (
                                    <div key={n.id} className="p-3 bg-background-alt rounded-lg text-sm">
                                        <p className="text-foreground mb-1">{n.text}</p>
                                        <p className="text-xs text-foreground-muted">{n.author} • {n.time}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add a note..."
                                    className="w-full text-sm bg-background border border-border rounded-lg p-2 min-h-[80px] mb-2"
                                />
                                <Button size="sm" className="w-full">Add Note</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
