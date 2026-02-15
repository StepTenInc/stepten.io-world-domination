"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Code, Database, Zap } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface APIEndpoint {
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    description: string;
}

interface AdvancedFeatureTemplateProps {
    title: string;
    description: string;
    icon: LucideIcon;
    status: "active" | "beta" | "coming-soon";
    apiEndpoints: APIEndpoint[];
    databaseTables?: string[];
    features: string[];
    usageExample?: string;
}

export default function AdvancedFeatureTemplate({
    title,
    description,
    icon: Icon,
    status,
    apiEndpoints,
    databaseTables = [],
    features,
    usageExample
}: AdvancedFeatureTemplateProps) {
    const getStatusColor = () => {
        switch (status) {
            case "active": return "text-success bg-success/10 border-success/20";
            case "beta": return "text-warning bg-warning/10 border-warning/20";
            case "coming-soon": return "text-info bg-info/10 border-info/20";
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "active": return "Production Ready";
            case "beta": return "Beta";
            case "coming-soon": return "Coming Soon";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link href="/admin/seo/advanced">
                    <Button variant="ghost" className="mb-4 text-foreground-muted hover:text-white">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Advanced Features
                    </Button>
                </Link>

                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                        <motion.div
                            className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20"
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            <Icon className="w-8 h-8 text-primary" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2">{title}</h1>
                            <p className="text-foreground-muted text-lg max-w-2xl">{description}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 text-sm font-bold border rounded-full whitespace-nowrap ${getStatusColor()}`}>
                        {getStatusText()}
                    </span>
                </div>
            </motion.div>

            {/* Status Banner */}
            {status === "active" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-success/10 via-primary/10 to-success/10 border border-success/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Feature Active & Ready</h3>
                            <p className="text-foreground-muted text-sm">
                                All API endpoints are live and connected to your database. Ready for production use.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 h-full">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" />
                                Key Features
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {features.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.05 }}
                                        className="flex items-start gap-3 text-foreground-muted"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* API Endpoints */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 h-full">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Code className="w-5 h-5 text-primary" />
                                API Endpoints
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {apiEndpoints.map((endpoint, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.05 }}
                                        className="p-3 rounded-lg bg-black/30 border border-white/5"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                                                endpoint.method === "GET" ? "bg-blue-500/20 text-blue-400" :
                                                endpoint.method === "POST" ? "bg-green-500/20 text-green-400" :
                                                endpoint.method === "PUT" ? "bg-yellow-500/20 text-yellow-400" :
                                                "bg-red-500/20 text-red-400"
                                            }`}>
                                                {endpoint.method}
                                            </span>
                                            <code className="text-xs text-primary font-mono">{endpoint.path}</code>
                                        </div>
                                        <p className="text-xs text-foreground-muted">{endpoint.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Database Tables */}
            {databaseTables.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Database className="w-5 h-5 text-primary" />
                                Database Tables
                            </CardTitle>
                            <CardDescription>Supabase tables used by this feature</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {databaseTables.map((table, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 + index * 0.05 }}
                                        className="px-3 py-1 text-sm font-mono bg-primary/10 text-primary border border-primary/20 rounded-lg"
                                    >
                                        {table}
                                    </motion.span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Usage Example */}
            {usageExample && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Usage Example</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="p-4 bg-black/50 border border-white/5 rounded-lg overflow-x-auto">
                                <code className="text-sm text-primary font-mono">{usageExample}</code>
                            </pre>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
