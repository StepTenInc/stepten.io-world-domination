"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Code, Zap, Globe, Cpu, Database, Layout, Sparkles, TrendingUp, Users, Rocket, Star, Crown, Award, BookOpen, MessageSquare } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import MatrixRain from "@/components/effects/MatrixRain";
import FloatingParticles from "@/components/effects/FloatingParticles";
import AnimatedCounter from "@/components/effects/AnimatedCounter";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// Mock Data for "Admin" Content
const businesses = [
  { name: "ShoreAgents", role: "Real Estate Outsourcing", desc: "Successfully scaled to 150+ staff", color: "from-blue-500 to-cyan-500" },
  { name: "BPOC", role: "BPO Consultancy", desc: "Helping agencies build offshore teams", color: "from-purple-500 to-pink-500" },
  { name: "StepTen.io", role: "AI Education", desc: "Teaching the next gen of builders", color: "from-green-500 to-emerald-500" },
];

const featuredProducts = [
  { id: 1, title: "The AI Agency Blueprint", category: "Course", price: "$297", image: "/placeholder-course.jpg" },
  { id: 2, title: "NextJS SaaS Starter Kit", category: "Template", price: "$97", image: "/placeholder-saas.jpg" },
  { id: 3, title: "100+ Custom GPT Prompts", category: "Resource", price: "$27", image: "/placeholder-prompts.jpg" },
];

const articles = [
  { title: "Replacing My Dev Team with AI Agents", category: "AI Engineering", readTime: "8 min read" },
  { title: "How to Build a SaaS in 24 Hours", category: "Tutorial", readTime: "12 min read" },
  { title: "The Future of SEO is Automated", category: "Strategy", readTime: "5 min read" },
];

export default function Home() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.95]);
  const heroBlur = useTransform(heroScrollProgress, [0, 1], [0, 10]);

  // Smooth spring animations
  const springConfig = { stiffness: 150, damping: 30 };
  const smoothHeroY = useSpring(heroY, springConfig);

  // Track mouse for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div ref={containerRef} className="relative bg-background overflow-hidden selection:bg-primary/30 selection:text-white">
        {/* Matrix Rain Background Effect */}
        <MatrixRain />

        {/* Floating Particles */}
        <FloatingParticles count={30} />

        {/* --- HERO SECTION --- */}
        <section ref={heroRef} className="relative h-screen min-h-[900px] flex items-center justify-center overflow-hidden pt-20">
          {/* Animated Background Layers */}
          <div className="absolute inset-0 z-0">
            {/* Radial Gradient */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-info/10 to-background"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Floating Orbs with Mouse Parallax */}
            <motion.div
              className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-info/20 blur-[120px]"
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
                scale: [1, 1.2, 1],
              }}
              style={{
                x: mousePosition.x * 30,
                y: mousePosition.y * 30,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-primary/20 blur-[140px]"
              animate={{
                x: [0, -50, 0],
                y: [0, -30, 0],
                scale: [1, 1.3, 1],
              }}
              style={{
                x: mousePosition.x * -40,
                y: mousePosition.y * -40,
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Animated Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] opacity-30" />

            {/* Scanline Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
              animate={{
                y: ['-100%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <motion.div
            style={{
              y: smoothHeroY,
              opacity: heroOpacity,
              scale: heroScale,
              filter: `blur(${heroBlur}px)`,
            }}
            className="container relative z-10 px-4 text-center max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-xl mb-10 hover:bg-white/15 hover:border-primary/30 transition-all cursor-pointer group shadow-xl shadow-black/20"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-lg shadow-primary/50"></span>
              </span>
              <span className="text-sm font-semibold text-white">Accepting New Students for 2026</span>
              <Sparkles className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight mb-8 leading-[1.05]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <span className="inline-block text-white">Build Faster.</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <span className="inline-block text-white">Scale Smarter.</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="relative inline-block"
                >
                  <motion.span
                    className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-info to-primary"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: '200% 200%',
                    }}
                  >
                    With AI Agents.
                  </motion.span>
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 blur-3xl opacity-50"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      background: 'linear-gradient(90deg, #00FF41, #22D3EE, #00FF41)',
                    }}
                  />
                </motion.div>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
            >
              Stop trading time for money. Learn how to build{' '}
              <span className="text-white font-bold">full-stack applications</span> and deploy{' '}
              <span className="text-primary font-bold">autonomous AI agents</span> that work while you sleep.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="h-16 px-10 text-lg bg-gradient-to-r from-primary to-info text-background hover:shadow-2xl hover:shadow-primary/50 font-bold rounded-full border-0 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Learning Now
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
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

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-2 border-white/30 hover:bg-white/10 hover:border-primary/50 text-white rounded-full backdrop-blur-xl font-semibold shadow-xl group">
                  <Play className="mr-2 w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="mt-20 flex flex-wrap items-center justify-center gap-12"
            >
              {[
                { icon: Users, label: 'Active Students', value: 10000, suffix: '+' },
                { icon: Star, label: 'Average Rating', value: 4.9, suffix: '/5' },
                { icon: Rocket, label: 'Projects Launched', value: 2500, suffix: '+' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + index * 0.2, duration: 0.5 }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="p-2 rounded-lg bg-primary/10 border border-primary/20"
                    >
                      <stat.icon className="w-5 h-5 text-primary" />
                    </motion.div>
                    <div className="text-3xl md:text-4xl font-black text-white">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                  </div>
                  <p className="text-sm text-foreground-muted font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* --- TECH STACK MARQUEE --- */}
        <section className="relative py-16 border-y border-white/10 bg-black/30 backdrop-blur-xl overflow-hidden">
          {/* Animated Background Line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center flex-wrap gap-10 md:gap-16 mb-8"
            >
              {[
                { Icon: Code, label: 'NextJS' },
                { Icon: Database, label: 'Supabase' },
                { Icon: Globe, label: 'Vercel' },
                { Icon: Cpu, label: 'AI Agents' },
                { Icon: Layout, label: 'TailwindCSS' },
                { Icon: Zap, label: 'TypeScript' }
              ].map((tech, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.4 }
                  }}
                  className="flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Icon Container */}
                    <div className="relative p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-white/10 transition-all">
                      <tech.Icon className="w-8 h-8 text-foreground-muted group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-foreground-muted group-hover:text-white transition-colors">
                    {tech.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center"
            >
              <p className="text-sm text-foreground-muted font-bold tracking-wider uppercase flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Trusted by <AnimatedCounter end={10000} suffix="+" /> builders worldwide
              </p>
            </motion.div>
          </div>

          {/* Bottom Border */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-info to-transparent"
            animate={{
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
        </section>

        {/* --- BUSINESS PORTFOLIO --- */}
        <section className="py-32 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background-alt to-background" />
          <motion.div
            className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mb-20"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">Real World Results</span>
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Built on Experience.{' '}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground-muted to-foreground-muted/50">
                  Not just theory.
                </span>
              </h2>
              <p className="text-xl text-foreground-muted leading-relaxed">
                I don't just teach this stuff. I use these exact systems to run{' '}
                <span className="text-white font-bold">multi-million dollar companies</span> with minimal staff.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {businesses.map((biz, i) => (
                <motion.div
                  key={biz.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                >
                  {/* Animated Background Glow */}
                  <motion.div
                    className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${biz.color} opacity-0 blur-3xl rounded-full`}
                    whileHover={{ opacity: 0.3, scale: 1.5 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Shimmer Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8 }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <motion.h3
                      className="text-3xl font-black text-white mb-3 group-hover:text-primary transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {biz.name}
                    </motion.h3>
                    <p className="text-primary font-bold text-sm mb-5 uppercase tracking-wider">{biz.role}</p>
                    <p className="text-foreground-muted leading-relaxed mb-8 text-base">{biz.desc}</p>

                    <motion.div
                      className="flex items-center text-sm font-bold text-white group-hover:text-primary transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                    >
                      View Case Study
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FEATURED PRODUCTS --- */}
        <section className="py-32 bg-background-alt/50 relative overflow-hidden">
          {/* Top Border Line */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            animate={{
              opacity: [0.5, 1, 0.5],
              scaleX: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Background Orbs */}
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-info/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6"
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-info/10 border border-info/20 mb-6"
                >
                  <Rocket className="w-4 h-4 text-info" />
                  <span className="text-sm font-bold text-info">Launch Faster</span>
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                  Featured Resources
                </h2>
                <p className="text-xl text-foreground-muted max-w-xl leading-relaxed">
                  Premium templates and courses designed to{' '}
                  <span className="text-white font-bold">fast-track your success</span>.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="border-2 border-white/30 hover:bg-white/10 hover:border-primary/50 text-white font-bold px-6 h-12 rounded-full backdrop-blur-xl"
                >
                  View All Products
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="group relative"
                >
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-info/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    whileHover={{ scale: 1.05 }}
                  />

                  <div className="relative bg-background border border-white/10 rounded-3xl overflow-hidden group-hover:border-primary/30 transition-all">
                    {/* Product Image */}
                    <div className="aspect-video bg-gradient-to-br from-white/5 to-white/[0.02] relative flex items-center justify-center overflow-hidden">
                      {/* Animated Background Pattern */}
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: 'radial-gradient(circle, rgba(0,255,65,0.1) 1px, transparent 1px)',
                          backgroundSize: '30px 30px'
                        }}
                        animate={{
                          backgroundPosition: ['0px 0px', '30px 30px']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />

                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Zap className="w-16 h-16 text-white/30 group-hover:text-primary transition-colors relative z-10" />
                      </motion.div>

                      {/* Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Button className="rounded-full bg-white text-black hover:bg-white/90 font-bold shadow-xl">
                            Quick View
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <motion.span
                          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20"
                          whileHover={{ scale: 1.05 }}
                        >
                          {product.category}
                        </motion.span>
                        <span className="text-2xl font-black text-white group-hover:text-primary transition-colors">
                          {product.price}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                        {product.title}
                      </h3>

                      {/* CTA Link */}
                      <motion.div
                        className="flex items-center text-sm font-semibold text-foreground-muted group-hover:text-white transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        Learn More
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- LATEST INSIGHTS (BENTO GRID) --- */}
        <section className="py-32 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background to-background-alt" />
          <motion.div
            className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-sm font-bold text-foreground-muted">Fresh Insights</span>
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Latest from the Lab
              </h2>
              <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
                Deep dives into{' '}
                <span className="text-white font-bold">engineering</span>,{' '}
                <span className="text-primary font-bold">AI</span>, and{' '}
                <span className="text-white font-bold">business strategy</span>.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 grid-rows-2 gap-6 min-h-[700px]">
              {/* Large Featured Article */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 0.98, y: -5 }}
                className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 group cursor-pointer"
              >
                {/* Background Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-info/20" />

                {/* Animated Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
                  whileHover={{ opacity: 0.9 }}
                />

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <motion.span
                    className="px-4 py-2 rounded-full bg-primary text-background text-xs font-black mb-6 inline-flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </motion.span>

                  <motion.h3
                    className="text-4xl font-black text-white mb-4 leading-tight"
                    whileHover={{ x: 5 }}
                  >
                    Building the Operating System for Your Life
                  </motion.h3>

                  <p className="text-foreground-muted leading-relaxed text-lg mb-6">
                    How I use Notion, AI, and excessive automation to manage 3 companies and a family without going insane.
                  </p>

                  <motion.div
                    className="flex items-center text-white font-bold group-hover:text-primary transition-colors"
                    whileHover={{ x: 10 }}
                  >
                    Read Article
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-3xl transition-colors" />
              </motion.div>

              {/* Secondary Article 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 0.98, y: -5 }}
                className="md:col-span-2 bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-10 flex flex-col justify-between group cursor-pointer hover:border-primary/30 transition-all relative overflow-hidden"
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-info/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-info/10 text-info border border-info/20">
                      Engineering
                    </span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                      The Modern Stack: Next.js + Supabase + Trim
                    </h3>
                    <p className="text-foreground-muted leading-relaxed">
                      Why this stack is the ultimate choice for rapid SaaS development in 2026.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Secondary Article 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{ scale: 0.98, y: -5 }}
                className="md:col-span-1 bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-8 flex flex-col justify-end group cursor-pointer hover:border-primary/30 transition-all relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-primary transition-colors leading-tight">
                    AI Agents vs. Humans
                  </h3>
                  <p className="text-sm text-foreground-muted">The cost benefit analysis.</p>
                </div>
              </motion.div>

              {/* View All CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover={{ scale: 0.98, y: -5 }}
                className="md:col-span-1 bg-gradient-to-br from-primary/20 via-info/20 to-primary/20 border border-primary/30 rounded-3xl p-8 flex flex-col justify-center items-center text-center group cursor-pointer relative overflow-hidden"
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/30 to-info/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white mb-4">View All Posts</h3>
                  <motion.div
                    className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="py-32 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background-alt to-background" />

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Radial Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,65,0.03)_1px,_transparent_1px)] bg-[length:40px_40px]" />

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-info/10 to-primary/10 border border-primary/30 mb-10"
              >
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Rocket className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="text-sm font-bold text-white">Join <AnimatedCounter end={10000} suffix="+" /> Successful Builders</span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
              >
                <span className="text-white">Ready to start</span>{' '}
                <span className="relative inline-block">
                  <motion.span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-info to-primary"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    building?
                  </motion.span>
                  {/* Underline Effect */}
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-primary to-info rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </span>
              </motion.h2>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-2xl text-foreground-muted mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Join the community of builders{' '}
                <span className="text-white font-bold">shipping products</span> and{' '}
                <span className="text-primary font-bold">changing their lives</span>.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block relative"
                >
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-primary/30 rounded-full blur-2xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  <Button
                    size="lg"
                    className="relative h-20 px-12 text-2xl font-black bg-gradient-to-r from-primary via-info to-primary text-background hover:shadow-2xl border-0 rounded-full overflow-hidden group"
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    <motion.span
                      className="relative z-10 flex items-center gap-3"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      Get Instant Access
                      <motion.div
                        animate={{
                          x: [0, 5, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Sparkles className="w-6 h-6" />
                      </motion.div>
                    </motion.span>

                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
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

              {/* Subtext */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-sm text-foreground-muted flex items-center justify-center gap-2"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-4 h-4 text-primary fill-current" />
                </motion.div>
                No credit card required for free intro course
              </motion.div>
            </motion.div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
