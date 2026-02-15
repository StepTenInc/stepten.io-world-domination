"use client";

import Link from "next/link";
import { Mail, Twitter, Github, Linkedin, Youtube, ArrowRight, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FooterLogo } from "@/components/ui/animated-logo";

export default function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [email, setEmail] = useState("");

    return (
        <footer ref={ref} className="relative bg-background border-t border-white/5 overflow-hidden">
            {/* Animated Background Effects */}
            <motion.div
                className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none"
                animate={{
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            <div className="container mx-auto px-4 py-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
                >

                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="space-y-6"
                    >
                        <Link href="/" className="flex items-center gap-3 group">
                            <FooterLogo />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white/60 group-hover:from-primary group-hover:via-white group-hover:to-primary transition-all duration-300">
                                StepTen
                            </span>
                        </Link>
                        <p className="text-foreground-muted leading-relaxed">
                            Empowering the next generation of builders with AI agents, automation, and full-stack mastery. Build faster, scale smarter.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} label="Twitter" />
                            <SocialLink href="#" icon={<Github className="w-5 h-5" />} label="GitHub" />
                            <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
                            <SocialLink href="#" icon={<Youtube className="w-5 h-5" />} label="YouTube" />
                        </div>
                    </motion.div>

                    {/* Product Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h3 className="text-lg font-semibold text-white">Products</h3>
                        <ul className="space-y-4">
                            <FooterLink href="/courses">AI Mastery Course</FooterLink>
                            <FooterLink href="/products">Digital Templates</FooterLink>
                            <FooterLink href="/services">Consulting</FooterLink>
                            <FooterLink href="/agents">Custom AI Agents</FooterLink>
                            <li className="pt-2">
                                <motion.span
                                    animate={{
                                        boxShadow: [
                                            '0 0 0px rgba(0, 255, 65, 0)',
                                            '0 0 20px rgba(0, 255, 65, 0.3)',
                                            '0 0 0px rgba(0, 255, 65, 0)'
                                        ]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary/20 to-info/20 text-primary border border-primary/20"
                                >
                                    <Zap className="w-3 h-3 fill-current" />
                                    New: SEO Engine
                                </motion.span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Company Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h3 className="text-lg font-semibold text-white">Company</h3>
                        <ul className="space-y-4">
                            <FooterLink href="/about">About Stephen</FooterLink>
                            <FooterLink href="/blog">Insight Blog</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                            <FooterLink href="/contact">Contact Support</FooterLink>
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                        </ul>
                    </motion.div>

                    {/* Newsletter Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            Stay Ahead of AI
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-4 h-4 text-primary" />
                            </motion.div>
                        </h3>
                        <p className="text-foreground-muted">
                            Join 10,000+ builders getting our weekly breakdown of the latest AI tools and automation strategies.
                        </p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative group" suppressHydrationWarning>
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground-muted group-focus-within:text-primary transition-colors z-10" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:bg-white/10 transition-all focus:shadow-lg focus:shadow-primary/20"
                                />
                                <div className="absolute inset-0 rounded-md bg-primary/5 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity -z-10" />
                            </div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button className="w-full bg-gradient-to-r from-primary via-info to-primary hover:shadow-xl hover:shadow-primary/40 transition-all text-background font-bold relative overflow-hidden group">
                                    <span className="relative z-10">Subscribe Now</span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-info via-primary to-info"
                                        animate={{
                                            x: ['-100%', '100%']
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        style={{ opacity: 0.3 }}
                                    />
                                </Button>
                            </motion.div>
                        </form>
                    </motion.div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground-muted/60"
                >
                    <motion.p
                        whileHover={{ color: 'rgba(250, 250, 250, 0.8)' }}
                        transition={{ duration: 0.2 }}
                        suppressHydrationWarning
                    >
                        © {new Date().getFullYear()} StepTen.io. All rights reserved.
                    </motion.p>
                    <div className="flex gap-8">
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <motion.a
            href={href}
            aria-label={label}
            className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground-muted overflow-hidden group"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-info/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-primary/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Icon */}
            <span className="relative z-10 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                {icon}
            </span>

            {/* Border Glow */}
            <div className="absolute inset-0 rounded-full border border-primary/0 group-hover:border-primary/50 transition-colors duration-300" />
        </motion.a>
    )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <motion.li
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Link href={href} className="text-foreground-muted hover:text-primary transition-colors flex items-center gap-2 group">
                <motion.span
                    className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary"
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.2 }}
                />
                <span className="relative">
                    {children}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" />
                </span>
            </Link>
        </motion.li>
    )
}
