"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Users as UsersIcon,
    UserPlus,
    Search,
    TrendingUp,
    DollarSign,
    Sparkles,
    Eye,
    Edit,
    Ban,
    Award,
    CheckCircle2
} from "lucide-react";

// Mock Users Data
const mockUsers = [
    {
        id: "1",
        email: "sarah.johnson@example.com",
        fullName: "Sarah Johnson",
        avatarUrl: null,
        role: "paid_user",
        subscriptionTier: "pro",
        status: "active",
        createdAt: "2025-10-15",
        lastActive: "2 hours ago",
        coursesCompleted: 2,
        coursesEnrolled: 3,
        productsOwned: 1,
        totalSpent: 594,
        tags: ["paid", "member", "completed_course"],
    },
    {
        id: "2",
        email: "mike.chen@example.com",
        fullName: "Mike Chen",
        avatarUrl: null,
        role: "paid_user",
        subscriptionTier: "starter",
        status: "active",
        createdAt: "2025-11-20",
        lastActive: "5 hours ago",
        coursesCompleted: 1,
        coursesEnrolled: 2,
        productsOwned: 2,
        totalSpent: 847,
        tags: ["paid", "member"],
    },
    {
        id: "3",
        email: "emily.davis@gmail.com",
        fullName: "Emily Davis",
        avatarUrl: null,
        role: "user",
        subscriptionTier: "free",
        status: "active",
        createdAt: "2025-12-05",
        lastActive: "Yesterday",
        coursesCompleted: 0,
        coursesEnrolled: 1,
        productsOwned: 0,
        totalSpent: 0,
        tags: ["free"],
    },
    {
        id: "4",
        email: "alex.thompson@company.com",
        fullName: "Alex Thompson",
        avatarUrl: null,
        role: "paid_user",
        subscriptionTier: "enterprise",
        status: "active",
        createdAt: "2025-09-01",
        lastActive: "1 hour ago",
        coursesCompleted: 4,
        coursesEnrolled: 4,
        productsOwned: 3,
        totalSpent: 2497,
        tags: ["paid", "member", "enterprise", "completed_course", "vip"],
    },
    {
        id: "5",
        email: "jessica.brown@email.com",
        fullName: "Jessica Brown",
        avatarUrl: null,
        role: "user",
        subscriptionTier: "free",
        status: "banned",
        createdAt: "2025-11-10",
        lastActive: "2 weeks ago",
        coursesCompleted: 0,
        coursesEnrolled: 0,
        productsOwned: 0,
        totalSpent: 0,
        tags: ["free", "banned"],
    },
    {
        id: "6",
        email: "david.wilson@work.com",
        fullName: "David Wilson",
        avatarUrl: null,
        role: "paid_user",
        subscriptionTier: "pro",
        status: "active",
        createdAt: "2026-01-02",
        lastActive: "3 hours ago",
        coursesCompleted: 0,
        coursesEnrolled: 2,
        productsOwned: 1,
        totalSpent: 297,
        tags: ["paid", "member", "new"],
    },
    {
        id: "7",
        email: "amanda.lee@gmail.com",
        fullName: "Amanda Lee",
        avatarUrl: null,
        role: "user",
        subscriptionTier: "free",
        status: "active",
        createdAt: "2026-01-08",
        lastActive: "Just now",
        coursesCompleted: 0,
        coursesEnrolled: 0,
        productsOwned: 0,
        totalSpent: 0,
        tags: ["free", "new"],
    },
];

const roleColors: Record<string, string> = {
    user: "bg-foreground-muted/20 text-foreground-muted border-foreground-muted/30",
    paid_user: "bg-primary/10 text-primary border-primary/30",
    ops: "bg-info/10 text-info border-info/30",
    seo: "bg-info/10 text-info border-info/30",
    dev: "bg-info/10 text-info border-info/30",
    sales: "bg-warning/10 text-warning border-warning/30",
    account_manager: "bg-warning/10 text-warning border-warning/30",
    admin: "bg-error/10 text-error border-error/30",
    superadmin: "bg-primary/20 text-primary border-primary/30",
};

const tierColors: Record<string, string> = {
    free: "bg-foreground-muted/20 text-foreground-muted border-foreground-muted/30",
    starter: "bg-info/10 text-info border-info/30",
    pro: "bg-primary/10 text-primary border-primary/30",
    enterprise: "bg-warning/10 text-warning border-warning/30",
};

const statusColors: Record<string, string> = {
    active: "bg-success/10 text-success border-success/30",
    inactive: "bg-foreground-muted/20 text-foreground-muted border-foreground-muted/30",
    banned: "bg-error/10 text-error border-error/30",
};

const tagColors: Record<string, string> = {
    paid: "bg-primary/10 text-primary border-primary/30",
    member: "bg-info/10 text-info border-info/30",
    free: "bg-foreground-muted/20 text-foreground-muted border-foreground-muted/30",
    new: "bg-success/10 text-success border-success/30",
    banned: "bg-error/10 text-error border-error/30",
    completed_course: "bg-primary/10 text-primary border-primary/30",
    enterprise: "bg-warning/10 text-warning border-warning/30",
    vip: "bg-warning/10 text-warning border-warning/30",
};

export default function AdminUsersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState<string>("all");
    const [filterTier, setFilterTier] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch =
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesTier = filterTier === "all" || user.subscriptionTier === filterTier;
        const matchesStatus = filterStatus === "all" || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesTier && matchesStatus;
    });

    const totalUsers = mockUsers.length;
    const paidUsers = mockUsers.filter(u => u.subscriptionTier !== "free").length;
    const activeUsers = mockUsers.filter(u => u.status === "active").length;
    const totalRevenue = mockUsers.reduce((sum, u) => sum + u.totalSpent, 0);

    return (
        <div className="space-y-8 p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
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
                        Users
                    </h1>
                    <p className="text-foreground-muted text-lg">
                        Manage your platform users and their access
                    </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="h-12 px-6 bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group">
                        <span className="relative z-10 flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Invite User
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                                x: ['-200%', '200%']
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </Button>
                </motion.div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Users", value: totalUsers, icon: UsersIcon, color: "from-primary/20 to-info/20" },
                    { title: "Paid Users", value: paidUsers, icon: Award, color: "from-info/20 to-primary/20" },
                    { title: "Active Users", value: activeUsers, icon: CheckCircle2, color: "from-success/20 to-primary/20" },
                    { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-primary/20 to-success/20" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
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

                            <CardContent className="p-4 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-foreground-muted uppercase tracking-wider font-semibold mb-1">{stat.title}</p>
                                        <p className="text-3xl font-black text-white">{stat.value}</p>
                                    </div>
                                    <motion.div
                                        className="p-3 rounded-xl bg-primary/10 border border-primary/20"
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <stat.icon className="w-6 h-6 text-primary" />
                                    </motion.div>
                                </div>
                            </CardContent>

                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-wrap gap-3 items-center"
            >
                <div className="flex-1 min-w-[200px] max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-lg bg-background-alt border border-white/10 hover:border-primary/30 focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-foreground-muted"
                    />
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-background-alt border border-white/10 hover:border-primary/30 focus:border-primary focus:outline-none transition-all text-foreground"
                >
                    <option value="all">All Roles</option>
                    <option value="user">Free User</option>
                    <option value="paid_user">Paid User</option>
                    <option value="admin">Admin</option>
                </select>
                <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-background-alt border border-white/10 hover:border-primary/30 focus:border-primary focus:outline-none transition-all text-foreground"
                >
                    <option value="all">All Tiers</option>
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-background-alt border border-white/10 hover:border-primary/30 focus:border-primary focus:outline-none transition-all text-foreground"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                </select>
            </motion.div>

            {/* Users Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
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

                    <CardContent className="p-0 relative z-10">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Role / Tier</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Tags</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Courses</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Products</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Spent</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Last Active</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + index * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-4 py-4">
                                                <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3 group/link">
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center border border-white/10"
                                                    >
                                                        {user.avatarUrl ? (
                                                            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                                                        ) : (
                                                            <span className="font-bold text-primary">{user.fullName.charAt(0)}</span>
                                                        )}
                                                    </motion.div>
                                                    <div>
                                                        <p className="font-medium text-foreground group-hover/link:text-primary transition-colors">
                                                            {user.fullName}
                                                        </p>
                                                        <p className="text-xs text-foreground-muted">{user.email}</p>
                                                    </div>
                                                </Link>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium w-fit border ${roleColors[user.role]}`}>
                                                        {user.role.replace("_", " ")}
                                                    </span>
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium w-fit border ${tierColors[user.subscriptionTier]}`}>
                                                        {user.subscriptionTier}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                    {user.tags.slice(0, 3).map((tag, i) => (
                                                        <span key={i} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${tagColors[tag] || "bg-foreground-muted/20 text-foreground-muted border-foreground-muted/30"}`}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {user.tags.length > 3 && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-foreground-muted/10 text-foreground-muted border border-foreground-muted/30">
                                                            +{user.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="text-sm text-foreground">
                                                    <span className="text-primary">{user.coursesCompleted}</span>
                                                    <span className="text-foreground-muted">/{user.coursesEnrolled}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-foreground">
                                                {user.productsOwned}
                                            </td>

                                            <td className="px-4 py-4 text-sm font-medium text-primary">
                                                ${user.totalSpent.toLocaleString()}
                                            </td>

                                            <td className="px-4 py-4 text-sm text-foreground-muted">
                                                {user.lastActive}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[user.status]}`}>
                                                    {user.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`/admin/users/${user.id}`}>
                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                            <Button variant="ghost" size="sm" className="text-foreground-muted hover:text-primary">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </motion.div>
                                                    </Link>
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Button variant="ghost" size="sm" className="text-foreground-muted hover:text-info">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Button variant="ghost" size="sm" className="text-foreground-muted hover:text-error">
                                                            <Ban className="w-4 h-4" />
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <UsersIcon className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
                                <p className="text-foreground-muted text-lg">No users found matching your criteria</p>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
