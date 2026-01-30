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

const sidebarLinks = [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/products", label: "My Products", icon: "📦" },
    { href: "/dashboard/my-courses", label: "My Courses", icon: "🎓" },
    { href: "/dashboard/bookings", label: "Bookings", icon: "📅" },
    { href: "/dashboard/billing", label: "Billing", icon: "💳" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border bg-background">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-border px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <span className="text-lg font-bold text-primary-foreground">S</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">
                            Step<span className="text-primary">Ten</span>
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground-muted hover:bg-background-alt hover:text-foreground"
                                )}
                            >
                                <span className="text-lg">{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="border-t border-border p-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-foreground-muted hover:text-primary"
                    >
                        ← Back to Website
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Top Header */}
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
                    <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <Button variant="ghost" size="sm" className="relative">
                            🔔
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                3
                            </span>
                        </Button>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder-avatar.jpg" />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            U
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">User</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/billing">Billing</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-error">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 bg-background-alt p-6">{children}</main>
            </div>
        </div>
    );
}
