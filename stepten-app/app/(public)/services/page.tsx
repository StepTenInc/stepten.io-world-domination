"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Zap, Rocket, Star, Users, Target, Lightbulb, Palette, Code2, Briefcase } from "lucide-react";
import MatrixRain from "@/components/effects/MatrixRain";
import FloatingParticles from "@/components/effects/FloatingParticles";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: 1,
    name: "AI Audit",
    tagline: "Discover your AI transformation opportunities",
    description: "Get a comprehensive analysis of how AI can transform your operations. Includes a 30+ page report, ROI projections, and implementation roadmap.",
    price: "$2,500",
    features: ["30+ page report", "ROI projections", "Implementation roadmap", "90-min presentation"],
    icon: Target,
    color: "from-primary/20 to-info/20"
  },
  {
    id: 2,
    name: "One-Off Consulting",
    tagline: "1-hour strategy session with actionable insights",
    description: "Get focused advice on your biggest challenge. Walk away with a clear action plan and recording of our session.",
    price: "$500",
    features: ["1-hour call", "Strategy focus", "Recording provided", "Action plan delivered"],
    icon: Lightbulb,
    color: "from-info/20 to-primary/20"
  },
  {
    id: 3,
    name: "Monthly Retainer",
    tagline: "Ongoing strategic support and priority access",
    description: "2 sessions per month with async support. Get continuous guidance as your business evolves.",
    price: "$750/mo",
    features: ["2 sessions/month", "Async support", "Priority access", "Ongoing strategy"],
    icon: Rocket,
    color: "from-primary/20 to-purple-500/20"
  },
  {
    id: 4,
    name: "Development Blocks",
    tagline: "10-hour blocks at $250/hour",
    description: "Web apps, AI integrations, automation - full stack builds with expert execution.",
    price: "$2,500",
    features: ["10-hour blocks", "Full stack builds", "AI integrations", "Automation systems"],
    icon: Code2,
    color: "from-info/20 to-primary/20"
  },
  {
    id: 5,
    name: "Custom Projects",
    tagline: "MVPs, full apps, AI integrations",
    description: "Full scoping & proposal for your unique needs. From idea to deployed product.",
    price: "Custom Quote",
    features: ["Full scoping", "Custom builds", "AI integrations", "End-to-end delivery"],
    icon: Palette,
    color: "from-primary/20 to-info/20"
  }
];

export default function ServicesPage() {
  const heroRef = useRef(null);

  return (
    <div className="min-h-screen bg-background relative">
      <MatrixRain />
      <FloatingParticles count={20} />

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-info/10 to-background"
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-info/20 blur-[120px]"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] opacity-30" />
        </div>

        <div className="relative px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-xl mb-8 hover:bg-white/15 hover:border-primary/30 transition-all shadow-xl shadow-black/20"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-2.5 h-2.5 rounded-full bg-primary"
              />
              <span className="text-sm font-semibold text-white">Services & Consulting</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]"
            >
              <span className="text-white">Work With </span>
              <span className="relative inline-block">
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-info to-primary"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Me
                </motion.span>
                <motion.div
                  className="absolute inset-0 blur-3xl opacity-50"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: 'linear-gradient(90deg, #00FF41, #22D3EE, #00FF41)' }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              From <span className="text-white font-bold">strategic consulting</span> to <span className="text-primary font-bold">custom development</span>, find the right way to accelerate your business with AI and automation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-12 mb-12"
            >
              {[
                { label: 'Projects Delivered', value: '50+' },
                { label: 'Years Experience', value: '20+' },
                { label: 'Client Satisfaction', value: '100%' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="text-3xl md:text-4xl font-black text-white">{stat.value}</div>
                  <p className="text-sm text-foreground-muted font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Choose Your Service</h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Each service is designed to deliver maximum value and measurable results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-info/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  whileHover={{ scale: 1.05 }}
                />

                <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-primary/30 transition-all">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-30 rounded-3xl transition-opacity`}
                  />

                  <div className="relative z-10">
                    <div className="mb-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 inline-block">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                    <p className="text-primary font-bold text-sm mb-4 uppercase tracking-wider">{service.tagline}</p>
                    <p className="text-foreground-muted leading-relaxed mb-6">{service.description}</p>

                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-foreground-muted">
                          <Check className="w-4 h-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <span className="text-2xl font-black text-primary">{service.price}</span>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="text-white font-bold flex items-center gap-2 group-hover:text-primary transition-colors cursor-pointer"
                      >
                        Learn More
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-32 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Not Sure What You Need?
            </h2>
            <p className="text-xl text-foreground-muted mb-10 max-w-2xl mx-auto">
              Let's chat about your goals and find the right solution together. No pressure, just honest advice.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-16 px-10 text-lg bg-gradient-to-r from-primary to-info text-background font-bold rounded-full relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Book a Free Call
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </motion.button>
              </Link>

              <Link href="/about/stephen-atcheler">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-16 px-10 text-lg border-2 border-white/30 hover:bg-white/10 hover:border-primary/50 text-white rounded-full backdrop-blur-xl font-semibold shadow-xl"
                >
                  Learn About Me
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
