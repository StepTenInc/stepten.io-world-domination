"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface AnimatedPageHeroProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  descriptionHighlights?: { text: string; className: string }[];
  stats?: { label: string; value: string | number }[];
  actions?: ReactNode;
}

export default function AnimatedPageHero({
  badge,
  title,
  titleHighlight,
  description,
  descriptionHighlights,
  stats,
  actions
}: AnimatedPageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
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
        <motion.div
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-info/20 blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] opacity-30" />
      </div>

      <div className="relative px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-xl mb-8 hover:bg-white/15 hover:border-primary/30 transition-all shadow-xl shadow-black/20"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-2.5 h-2.5 rounded-full bg-primary"
              />
              <span className="text-sm font-semibold text-white">{badge}</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="text-white">{title} </span>
              {titleHighlight && (
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
                    {titleHighlight}
                  </motion.span>
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
                </span>
              )}
            </motion.div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-12 mb-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.2, duration: 0.5 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="text-3xl md:text-4xl font-black text-white">
                    {stat.value}
                  </div>
                  <p className="text-sm text-foreground-muted font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Actions */}
          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              {actions}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
