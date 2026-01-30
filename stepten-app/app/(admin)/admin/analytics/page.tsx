"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Users, MousePointerClick, BookOpen, DollarSign, Target, Zap, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

// --- Mock Data ---

const funnelData = [
    { name: "Visitors", value: 12500, fill: "#94a3b8" },
    { name: "Return Visitors", value: 4500, fill: "#60a5fa" },
    { name: "Leads Captured", value: 1200, fill: "#facc15" },
    { name: "Users (Free)", value: 850, fill: "#4ade80" },
    { name: "Paid Customers", value: 120, fill: "#22c55e" },
];

const trafficData = [
    { date: "Mon", visitors: 1200, pageviews: 2400 },
    { date: "Tue", visitors: 1400, pageviews: 2800 },
    { date: "Wed", visitors: 1100, pageviews: 2200 },
    { date: "Thu", visitors: 1600, pageviews: 3200 },
    { date: "Fri", visitors: 1800, pageviews: 3800 },
    { date: "Sat", visitors: 900, pageviews: 1800 },
    { date: "Sun", visitors: 800, pageviews: 1600 },
];

const contentPerformance = [
    { id: 1, title: "The Future of AI Agents", type: "Article", views: 4520, leads: 85, conversion: "1.8%" },
    { id: 2, title: "NextJS 14 SEO Masterclass", type: "Course", views: 3200, leads: 120, conversion: "3.7%" },
    { id: 3, title: "Building a SaaS in 24h", type: "Article", views: 2800, leads: 45, conversion: "1.6%" },
    { id: 4, title: "Automation Blueprint", type: "Lead Magnet", views: 1500, leads: 380, conversion: "25.3%" },
    { id: 5, title: "VS Code Setup Guide", type: "Article", views: 1200, leads: 12, conversion: "1.0%" },
];

const leadSourceData = [
    { name: "Newsletter Popup", value: 45, color: "#8884d8" },
    { name: "Course Waitlist", value: 25, color: "#82ca9d" },
    { name: "Consultation Form", value: 15, color: "#ffc658" },
    { name: "Direct Signup", value: 15, color: "#ff8042" },
];

const aiInsights = [
    {
        type: "opportunity",
        text: "Your 'Automation Blueprint' lead magnet has a 25.3% conversion rate. Consider creating a 'Part 2' or advanced version to retarget these leads.",
        impact: "High Impact"
    },
    {
        type: "warning",
        text: "Mobile conversion rate dropped by 12% this week. Check the load time of the pricing page on mobile devices.",
        impact: "Urgent"
    },
    {
        type: "success",
        text: "Organic traffic form search increased by 15% after publishing 'The Future of AI Agents'. Continue focusing on AI-related long-tail keywords.",
        impact: "Positive Trend"
    }
];

export default function AdminAnalyticsPage() {
    const [timeRange, setTimeRange] = useState("7d");

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                        Platform Analytics
                    </h1>
                    <p className="text-foreground-muted text-lg">CEO-level view of growth, meaningful engagement, and revenue</p>
                </div>
                <div className="flex bg-background-alt p-1 rounded-lg border border-border">
                    {["24h", "7d", "30d", "90d"].map((range) => (
                        <motion.button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${timeRange === range ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground-muted hover:text-foreground"
                                }`}
                        >
                            {range}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* KPI Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Revenue", value: "$12,450", change: "+15% from last month", trend: "up", icon: DollarSign, color: "from-success/20 to-primary/20", iconColor: "text-success" },
                    { title: "Active Users", value: "854", change: "+8% new signups", trend: "up", icon: Users, color: "from-primary/20 to-info/20", iconColor: "text-primary" },
                    { title: "Lead Conversion", value: "3.2%", change: "-0.4% this week", trend: "down", icon: Target, color: "from-warning/20 to-primary/20", iconColor: "text-warning" },
                    { title: "Avg. Session", value: "4m 12s", change: "+12s from last week", trend: "up", icon: MousePointerClick, color: "from-info/20 to-primary/20", iconColor: "text-info" },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
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

                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                    <CardTitle className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">{stat.title}</CardTitle>
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className={`p-2 rounded-lg bg-white/5 border border-white/10 ${stat.iconColor}`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </motion.div>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                                    <p className={`text-xs flex items-center gap-1 font-bold ${stat.trend === "up" ? "text-success" : "text-error"}`}>
                                        {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                        {stat.change}
                                    </p>
                                </CardContent>

                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                {/* Traffic Chart */}
                <Card className="lg:col-span-4 bg-background border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Traffic & Engagement</CardTitle>
                        <CardDescription>Daily visitors vs. pageviews tracking.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="pageviews" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                                <Area type="monotone" dataKey="visitors" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Conversion Funnel */}
                <Card className="lg:col-span-3 bg-background border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Conversion Funnel</CardTitle>
                        <CardDescription>Anonymous Visitor → Paid Customer journey.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4 p-4 rounded-lg bg-background-alt/50 border border-border">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-foreground-muted">Overall Conversion Rate</span>
                                <span className="text-success font-bold font-mono">0.96%</span>
                            </div>
                            <div className="w-full bg-background mt-2 rounded-full h-2 overflow-hidden">
                                <div className="bg-success h-full" style={{ width: "0.96%" }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Content Performance */}
                <Card className="lg:col-span-2 bg-background border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Top Performing Content</CardTitle>
                        <CardDescription>Which pages are driving the most leads?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-foreground-muted">
                                    <th className="text-left font-medium py-2">Title</th>
                                    <th className="text-left font-medium py-2">Type</th>
                                    <th className="text-right font-medium py-2">Views</th>
                                    <th className="text-right font-medium py-2">Leads</th>
                                    <th className="text-right font-medium py-2">Conv. Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contentPerformance.map((item) => (
                                    <tr key={item.id} className="border-b border-border/50 hover:bg-background-alt/50">
                                        <td className="py-3 font-medium text-foreground">{item.title}</td>
                                        <td className="py-3 text-foreground-muted">
                                            <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">{item.type}</span>
                                        </td>
                                        <td className="py-3 text-right text-foreground">{item.views.toLocaleString()}</td>
                                        <td className="py-3 text-right text-foreground">{item.leads}</td>
                                        <td className="py-3 text-right text-success font-bold">{item.conversion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Lead Sources */}
                <Card className="bg-background border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Lead Source Breakdown</CardTitle>
                        <CardDescription>Where are leads coming from?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={leadSourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {leadSourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 mt-2">
                            {leadSourceData.map((source) => (
                                <div key={source.name} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                                        <span className="text-foreground-muted">{source.name}</span>
                                    </div>
                                    <span className="font-medium text-foreground">{source.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Insights Section */}
            <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-warning" fill="currentColor" />
                        <CardTitle className="text-foreground">AI Strategic Insights</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {aiInsights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border">
                                <div className={`mt-1 p-1 rounded-full ${insight.type === "opportunity" ? "bg-success/20 text-success" :
                                        insight.type === "warning" ? "bg-error/20 text-error" :
                                            "bg-primary/20 text-primary"
                                    }`}>
                                    <Zap className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold opacity-80 mb-1">{insight.impact.toUpperCase()}</p>
                                    <p className="text-foreground leading-relaxed">"{insight.text}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
