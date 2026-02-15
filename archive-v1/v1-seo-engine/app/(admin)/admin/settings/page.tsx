"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
    Settings,
    Shield,
    CreditCard,
    Globe,
    Bell,
    Key,
    Cpu,
    Users,
    Save,
    Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="space-y-8 pb-20">
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
                        Platform Settings
                    </h1>
                    <p className="text-foreground-muted text-lg">Manage global configuration, integrations, and security policies</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/30 font-bold relative overflow-hidden group h-12 px-6 min-w-[140px]">
                        <span className="relative z-10 flex items-center gap-2">
                            {isSaving ? "Saving..." : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </span>
                        {!isSaving && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        )}
                    </Button>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="bg-background-alt border border-border p-1 rounded-lg">
                        <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
                            <Settings className="w-4 h-4 mr-2" /> General
                        </TabsTrigger>
                        <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
                            <Shield className="w-4 h-4 mr-2" /> Security
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
                            <CreditCard className="w-4 h-4 mr-2" /> Billing
                        </TabsTrigger>
                        <TabsTrigger value="integrations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
                            <Cpu className="w-4 h-4 mr-2" /> AI & APIs
                        </TabsTrigger>
                        <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
                            <Bell className="w-4 h-4 mr-2" /> Email
                        </TabsTrigger>
                    </TabsList>

                {/* --- GENERAL SETTINGS --- */}
                <TabsContent value="general" className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="group relative"
                    >
                        <motion.div
                            className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-info/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                            whileHover={{ scale: 1.02 }}
                        />

                        <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>

                            <CardHeader className="relative z-10">
                                <CardTitle className="text-white">Platform Branding</CardTitle>
                                <CardDescription>Configure how your platform appears to users.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 relative z-10">
                                <div className="grid gap-2">
                                    <Label htmlFor="siteName" className="text-foreground">Site Name</Label>
                                    <Input id="siteName" defaultValue="StepTen.io" className="max-w-md bg-background-alt border-border hover:border-primary/50 transition-colors" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="supportEmail" className="text-foreground">Support Email</Label>
                                    <Input id="supportEmail" defaultValue="support@stepten.io" className="max-w-md bg-background-alt border-border hover:border-primary/50 transition-colors" />
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox id="maintenance" />
                                    <Label htmlFor="maintenance" className="text-foreground">Enable Maintenance Mode (Public site will be hidden)</Label>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="group relative"
                    >
                        <motion.div
                            className="absolute -inset-0.5 bg-gradient-to-r from-info/20 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                            whileHover={{ scale: 1.02 }}
                        />

                        <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>

                            <CardHeader className="relative z-10">
                                <CardTitle className="text-white">Feature Modules</CardTitle>
                                <CardDescription>Toggle platform capabilities on or off.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Course Platform</Label>
                                    <p className="text-sm text-foreground-muted">Enable LMS features, lessons, and student progress tracking.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Digital Store</Label>
                                    <p className="text-sm text-foreground-muted">Sell digital products, templates, and downloads.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">SEO Content Engine</Label>
                                    <p className="text-sm text-foreground-muted">AI-powered article generation pipeline (Internal tool).</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Community Forum</Label>
                                    <p className="text-sm text-foreground-muted">Discussion boards for users (Coming Soon).</p>
                                </div>
                                <Switch disabled />
                            </div>
                            </CardContent>
                        </Card>
                </motion.div>
                </TabsContent>

                {/* --- SECURITY SETTINGS --- */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle>Authentication Policy</CardTitle>
                            <CardDescription>Manage how users sign in and access the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Allow New Registrations</Label>
                                    <p className="text-sm text-foreground-muted">If disabled, only admins can create users.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enforce 2FA for Admins</Label>
                                    <p className="text-sm text-foreground-muted">Require Two-Factor Authentication for staff roles.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Session Timeout</Label>
                                    <p className="text-sm text-foreground-muted">Automatically log out inactive users after 30 minutes.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle>Role Management</CardTitle>
                            <CardDescription>Review the active role hierarchy (read-only).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-background-alt p-4 rounded-lg border border-border font-mono text-sm leading-relaxed">
                                <div className="text-primary font-bold">superadmin</div>
                                <div className="pl-4 border-l border-border/50">
                                    <span className="text-foreground">admin</span>
                                    <div className="pl-4 border-l border-border/50 text-foreground-muted">
                                        <div>account_manager, sales, seo, ops, dev</div>
                                        <div className="pl-4 border-l border-border/50">
                                            <div>paid_user (pro/starter)</div>
                                            <div className="pl-4 border-l border-border/50 text-foreground-muted/70">
                                                user (free)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-foreground-muted">* To modify permissions, update the system configuration files.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- BILLING SETTINGS --- */}
                <TabsContent value="billing" className="space-y-6">
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle>Payment Gateway (Stripe)</CardTitle>
                            <CardDescription>Manage your connection to Stripe for processing payments.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Publishable Key</Label>
                                <Input defaultValue="pk_test_..." className="font-mono bg-background-alt border-border" readOnly />
                            </div>
                            <div className="grid gap-2">
                                <Label>Secret Key</Label>
                                <Input type="password" defaultValue="sk_test_..." className="font-mono bg-background-alt border-border" readOnly />
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <div className="space-y-0.5">
                                    <Label>Test Mode</Label>
                                    <p className="text-sm text-foreground-muted">Process transactions without real charges.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle>Currency & Localization</CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Default Currency</Label>
                                <Input defaultValue="USD" className="bg-background-alt border-border" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Tax Rate (%)</Label>
                                <Input type="number" defaultValue="0" className="bg-background-alt border-border" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- INTEGRATIONS (AI) --- */}
                <TabsContent value="integrations" className="space-y-6">
                    <Card className="bg-background border-border border-primary/20">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-primary" />
                                <CardTitle>AI Model Configuration</CardTitle>
                            </div>
                            <CardDescription>Manage connections to LLM providers for the SEO Engine.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">OpenAI (Primary)</h3>
                                <div className="grid gap-2">
                                    <Label>API Key</Label>
                                    <div className="flex gap-2">
                                        <Input type="password" defaultValue="sk-proj-..." className="font-mono bg-background-alt border-border flex-1" />
                                        <Button variant="outline">Test</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border">
                                <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Anthropic (Claude)</h3>
                                <div className="grid gap-2">
                                    <Label>API Key</Label>
                                    <div className="flex gap-2">
                                        <Input type="password" defaultValue="sk-ant-..." className="font-mono bg-background-alt border-border flex-1" />
                                        <Button variant="outline">Test</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border">
                                <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Perplexity (Research)</h3>
                                <div className="grid gap-2">
                                    <Label>API Key</Label>
                                    <div className="flex gap-2">
                                        <Input type="password" value="" placeholder="Enter API Key" className="font-mono bg-background-alt border-border flex-1" />
                                        <Button variant="outline">Test</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- EMAIL settings --- */}
                <TabsContent value="email" className="space-y-6">
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle>SMTP Configuration</CardTitle>
                            <CardDescription>Server details for sending transactional emails.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Host</Label>
                                <Input placeholder="smtp.resend.com" className="bg-background-alt border-border" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Port</Label>
                                    <Input placeholder="587" className="bg-background-alt border-border" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Username</Label>
                                    <Input placeholder="resend" className="bg-background-alt border-border" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Password / API Key</Label>
                                <Input type="password" placeholder="re_..." className="bg-background-alt border-border" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle>Sender Identity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>From Name</Label>
                                <Input defaultValue="StepTen Team" className="bg-background-alt border-border" />
                            </div>
                            <div className="grid gap-2">
                                <Label>From Email</Label>
                                <Input defaultValue="noreply@stepten.io" className="bg-background-alt border-border" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            </motion.div>
        </div>
    );
}
