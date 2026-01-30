"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import {
    Sparkles,
    LayoutList,
    LayoutGrid,
    Plus,
    Eye,
    TrendingUp,
    Users,
    Target,
    CheckCircle2,
    Mail
} from "lucide-react";

// Mock Leads Data
const initialLeads = [
    {
        id: "l1",
        name: "Unknown Visitor #492",
        email: null,
        company: "Tech Corp (Detected)",
        status: "visited_site",
        score: 15,
        lastActive: "10 mins ago",
        source: "Google Search",
        pagesViewed: 3,
        location: "San Francisco, US",
        device: "Mac desktop",
    },
    {
        id: "l2",
        name: "Unknown Visitor #881",
        email: null,
        company: null,
        status: "visited_site",
        score: 5,
        lastActive: "2 hours ago",
        source: "Direct",
        pagesViewed: 1,
        location: "London, UK",
        device: "iPhone",
    },
    {
        id: "l3",
        name: "Return Visitor #12",
        email: null,
        company: "Agency Ltd (Detected)",
        status: "return_visitor",
        score: 45,
        lastActive: "5 mins ago",
        source: "LinkedIn",
        pagesViewed: 12,
        visits: 4,
        location: "New York, US",
        device: "Windows desktop",
    },
    {
        id: "l4",
        name: "Michael Ross",
        email: "mike.ross@example.com",
        company: "Law & Co",
        status: "lead_with_details",
        score: 85,
        lastActive: "1 day ago",
        source: "Contact Form",
        pagesViewed: 25,
        enriched: true,
        industry: "Legal Services",
        budget: "$5k - $10k",
    },
    {
        id: "l5",
        name: "Sarah Connors",
        email: "sarah@skynet.com",
        company: "Cyber Systems",
        status: "lead_with_details",
        score: 92,
        lastActive: "3 days ago",
        source: "AI Chat Agent",
        pagesViewed: 18,
        enriched: true,
        industry: "Technology",
        budget: "$10k+",
    },
    {
        id: "l6",
        name: "David Chen",
        email: "david@startup.io",
        company: "Startup IO",
        status: "converted",
        score: 100,
        lastActive: "Yesterday",
        source: "Course Purchase",
        pagesViewed: 45,
        convertedAt: "2026-01-10",
        userId: "u123",
    },
];

const stages = [
    { id: "visited_site", label: "Visited Site", color: "bg-foreground-muted/10 text-foreground-muted" },
    { id: "return_visitor", label: "Return Visitor", color: "bg-info/10 text-info" },
    { id: "lead_with_details", label: "Lead with Details", color: "bg-warning/10 text-warning" },
    { id: "converted", label: "Converted", color: "bg-success/10 text-success" },
];

export default function AdminLeadsPage() {
    const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
    const [leads, setLeads] = useState(initialLeads);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { draggableId, source, destination } = result;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const newLeads = Array.from(leads);
        const movedLead = newLeads.find(l => l.id === draggableId);

        if (movedLead) {
            movedLead.status = destination.droppableId;
            setLeads(newLeads);
        }
    };

    return (
        <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0"
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
                        Lead Pipeline
                    </h1>
                    <p className="text-foreground-muted text-lg">Track visitors from first touch to conversion</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-background-alt p-1 rounded-lg border border-border">
                        <motion.button
                            onClick={() => setViewMode("list")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground-muted hover:text-foreground"
                                }`}
                        >
                            <LayoutList className="w-4 h-4" />
                            List
                        </motion.button>
                        <motion.button
                            onClick={() => setViewMode("kanban")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "kanban" ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground-muted hover:text-foreground"
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Kanban
                        </motion.button>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/30 font-bold relative overflow-hidden group h-10 px-6">
                            <span className="relative z-10 flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Manual Lead
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Kanban Board */}
            {viewMode === "kanban" && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex-1 overflow-x-auto">
                        <div className="flex gap-4 min-w-[1000px] h-full pb-4">
                            {stages.map((stage) => {
                                const stageLeads = leads.filter(l => l.status === stage.id);
                                return (
                                    <div key={stage.id} className="flex-1 flex flex-col min-w-[280px] bg-background-alt/50 rounded-xl border border-border">
                                        {/* Column Header */}
                                        <div className="p-3 border-b border-border flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${stage.color.split(' ')[0].replace('/10', '')}`} />
                                                <span className="font-medium text-foreground">{stage.label}</span>
                                                <span className="text-xs text-foreground-muted bg-background px-2 py-0.5 rounded-full">
                                                    {stageLeads.length}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Drop Area */}
                                        <Droppable droppableId={stage.id}>
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={`flex-1 p-2 space-y-2 overflow-y-auto ${snapshot.isDraggingOver ? "bg-primary/5" : ""}`}
                                                >
                                                    {stageLeads.map((lead, index) => (
                                                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <Link href={`/admin/leads/${lead.id}`} onClick={e => { if (snapshot.isDragging) e.preventDefault(); }}>
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            ...provided.draggableProps.style,
                                                                        }}
                                                                        className={`p-3 bg-gradient-to-br from-white/[0.07] to-white/[0.02] rounded-lg border border-white/10 shadow-sm hover:border-primary/50 transition-all group mb-2 relative overflow-hidden ${snapshot.isDragging ? "rotate-2 shadow-xl ring-2 ring-primary scale-105" : ""}`}
                                                                    >
                                                                        {/* Background Pattern */}
                                                                        <div className="absolute inset-0 opacity-5">
                                                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                                                        </div>

                                                                        <div className="relative z-10">
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <div>
                                                                                    <p className="font-semibold text-white text-sm group-hover:text-primary transition-colors">{lead.name}</p>
                                                                                    {lead.company && (
                                                                                        <p className="text-xs text-foreground-muted">{lead.company}</p>
                                                                                    )}
                                                                                </div>
                                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${lead.score > 80 ? "bg-success/10 text-success border-success/30" :
                                                                                        lead.score > 40 ? "bg-warning/10 text-warning border-warning/30" : "bg-foreground-muted/10 text-foreground-muted border-foreground-muted/30"
                                                                                    }`}>
                                                                                    {lead.score}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center justify-between text-xs text-foreground-muted gap-2">
                                                                                <span className="truncate">{lead.lastActive}</span>
                                                                                <span className="text-[10px] bg-background-alt px-1.5 py-0.5 rounded">{lead.source}</span>
                                                                            </div>
                                                                            {lead.enriched && (
                                                                                <div className="mt-2 text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full inline-flex items-center gap-1 border border-primary/30">
                                                                                    <Sparkles className="w-3 h-3" />
                                                                                    Enriched
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </DragDropContext>
            )}

            {/* List View */}
            {viewMode === "list" && (
                <div className="bg-background border border-border rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-background-alt">
                                <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Lead Identity</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Stage</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Score</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Location / Device</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Last Active</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id} className="border-b border-border hover:bg-background-alt/50">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                {lead.name.charAt(0)}
                                            </div>
                                            <div>
                                                <Link href={`/admin/leads/${lead.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                                                    {lead.name}
                                                </Link>
                                                <p className="text-xs text-foreground-muted">{lead.email || "No email captured"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stages.find(s => s.id === lead.status)?.color}`}>
                                            {stages.find(s => s.id === lead.status)?.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-background-alt rounded-full overflow-hidden">
                                                <div className={`h-full ${lead.score > 80 ? "bg-success" : lead.score > 40 ? "bg-warning" : "bg-foreground-muted"
                                                    }`} style={{ width: `${lead.score}%` }} />
                                            </div>
                                            <span className="text-xs font-medium">{lead.score}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-sm text-foreground">{lead.location}</p>
                                        <p className="text-xs text-foreground-muted">{lead.device}</p>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-foreground-muted">
                                        {lead.lastActive}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/leads/${lead.id}`}>View</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
