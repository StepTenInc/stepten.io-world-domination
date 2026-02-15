"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Search,
    FileText,
    Package,
    GraduationCap,
    Users,
    Target,
    TrendingUp,
    Settings,
    Bell,
    ArrowLeft,
    Plus
} from "lucide-react";

const adminSidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/seo", label: "SEO Engine", icon: Search, badge: "New" },
    { href: "/admin/seo/articles", label: "Articles", icon: FileText },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/courses", label: "Courses", icon: GraduationCap },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/leads", label: "Leads", icon: Target },
    { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen">
            {/* Admin Sidebar - Distinct dark style */}
            <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border bg-[#0d0d0d] relative overflow-hidden">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

                {/* Logo with Admin Badge */}
                <div className="flex h-16 items-center justify-between border-b border-border px-4 relative z-10">
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary group-hover:bg-primary/80 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-lg font-bold text-primary-foreground">S</span>
                        </motion.div>
                        <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            Step<span className="text-primary">Ten</span>
                        </span>
                    </Link>
                    <motion.span
                        className="rounded bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary border border-primary/30"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        Admin
                    </motion.span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4 relative z-10">
                    {adminSidebarLinks.map((link, index) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                        const Icon = link.icon;
                        return (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-primary/10 text-primary border border-primary/20"
                                            : "text-foreground-muted hover:bg-background-alt hover:text-foreground hover:border hover:border-white/10"
                                    )}
                                >
                                    {/* Active indicator glow */}
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50"
                                            animate={{ x: ['-100%', '100%'] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        />
                                    )}

                                    <div className="flex items-center gap-3 relative z-10">
                                        <motion.div
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <Icon className={cn(
                                                "w-4 h-4 transition-colors",
                                                isActive ? "text-primary" : "text-foreground-muted group-hover:text-primary"
                                            )} />
                                        </motion.div>
                                        {link.label}
                                    </div>
                                    {link.badge && (
                                        <motion.span
                                            className="rounded bg-info/20 px-1.5 py-0.5 text-[10px] font-medium text-info border border-info/30 relative z-10"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            {link.badge}
                                        </motion.span>
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Quick Actions */}
                <div className="border-t border-border p-4 relative z-10">
                    <Link href="/admin/seo/articles/new/step-1-idea">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button className="w-full bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/30 font-bold relative overflow-hidden group">
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    New Article
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    animate={{ x: ['-200%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                            </Button>
                        </motion.div>
                    </Link>
                </div>

                {/* Back to Site */}
                <div className="border-t border-border p-4 relative z-10">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-foreground-muted hover:text-primary transition-colors group"
                    >
                        <motion.div
                            animate={{ x: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </motion.div>
                        <span className="group-hover:underline">Back to Website</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Top Header */}
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md relative">
                    {/* Subtle gradient line at top */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
                        <motion.span
                            className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success border border-success/30"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Live
                        </motion.span>
                    </motion.div>

                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-9 w-64 rounded-lg border border-border bg-background-alt pl-9 pr-3 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none transition-all"
                                suppressHydrationWarning
                            />
                        </div>

                        {/* Notifications */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" className="relative group">
                                <Bell className="w-4 h-4 text-foreground-muted group-hover:text-primary transition-colors" />
                                <motion.span
                                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    5
                                </motion.span>
                            </Button>
                        </motion.div>

                        {/* Admin Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8 border border-primary">
                                        <AvatarImage src="/placeholder-avatar.jpg" />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            A
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <span className="block text-sm font-medium">Admin</span>
                                        <span className="block text-[10px] text-foreground-muted">Superadmin</span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href="/admin/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard">User Dashboard</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-error">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
                </header>

                {/* Page Content */}
                <main className="flex-1 bg-background-alt relative">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-30" />
                    <motion.div
                        className="relative z-10 p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
