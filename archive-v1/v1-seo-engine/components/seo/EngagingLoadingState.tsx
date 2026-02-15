"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    Sparkles,
    Zap,
    Search,
    FileSearch,
    Lightbulb,
    Target,
    TrendingUp,
    Globe,
    BookOpen
} from "lucide-react";

interface LoadingStage {
    icon: React.ReactNode;
    text: string;
    subtext?: string;
}

interface EngagingLoadingStateProps {
    stepName: string;
    stages: LoadingStage[];
    funFacts?: string[];
    estimatedSeconds?: number;
}

// Default fun facts about SEO if none provided
const defaultFunFacts = [
    "💡 Google processes over 8.5 billion searches per day",
    "🎯 The first 5 organic results get 67.6% of all clicks",
    "📈 Long-form content gets 77% more backlinks than short articles",
    "⚡ A 1-second delay in page load can reduce conversions by 7%",
    "🔍 75% of users never scroll past the first page of results",
    "✨ Featured snippets can increase CTR by up to 8%",
    "📊 Pages ranking #1 have an average of 3.8x more backlinks",
    "🎨 Visual content is 40x more likely to be shared on social media",
    "🚀 Mobile searches make up over 60% of all Google searches",
    "💎 Quality content can generate 3x more leads than paid search",
];

export function EngagingLoadingState({
    stepName,
    stages,
    funFacts = defaultFunFacts,
    estimatedSeconds = 30,
}: EngagingLoadingStateProps) {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    // Cycle through stages
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStageIndex((prev) => (prev + 1) % stages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [stages.length]);

    // Cycle through fun facts
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFactIndex((prev) => (prev + 1) % funFacts.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [funFacts.length]);

    // Progress bar animation
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) return 95; // Never reach 100% until actually done
                return prev + (100 / estimatedSeconds) * 0.5;
            });
            setElapsedSeconds((prev) => prev + 0.5);
        }, 500);
        return () => clearInterval(interval);
    }, [estimatedSeconds]);

    const currentStage = stages[currentStageIndex];
    const remainingSeconds = Math.max(0, estimatedSeconds - elapsedSeconds);

    return (
        <div className="relative py-12 px-6 overflow-hidden">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-primary/30"
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: "100%",
                            opacity: 0,
                        }}
                        animate={{
                            y: "-10%",
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* Neural Network Visualization */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                    {[...Array(12)].map((_, i) => (
                        <motion.circle
                            key={i}
                            cx={50 + (i % 4) * 100}
                            cy={50 + Math.floor(i / 4) * 50}
                            r="4"
                            fill="currentColor"
                            className="text-primary"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.15,
                            }}
                        />
                    ))}
                    {/* Connection Lines */}
                    {[...Array(8)].map((_, i) => (
                        <motion.line
                            key={`line-${i}`}
                            x1={50 + (i % 4) * 100}
                            y1={50 + Math.floor(i / 4) * 50}
                            x2={50 + ((i + 1) % 4) * 100}
                            y2={50 + Math.floor((i + 1) / 4) * 50}
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-primary"
                            animate={{
                                opacity: [0.1, 0.5, 0.1],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </svg>
            </div>

            {/* Main Content */}
            <div className="relative z-10 space-y-8">
                {/* Pulsing AI Brain Icon */}
                <div className="flex justify-center">
                    <motion.div
                        className="relative"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {/* Outer Glow Rings */}
                        <motion.div
                            className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 to-info/20 blur-xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute -inset-2 rounded-full border-2 border-primary/30"
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />

                        {/* Core Icon */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-info/20 flex items-center justify-center border-2 border-primary/40">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <Brain className="w-10 h-10 text-primary" />
                            </motion.div>
                        </div>

                        {/* Orbiting Sparkles */}
                        {[0, 120, 240].map((degree, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-4 h-4"
                                style={{
                                    top: "50%",
                                    left: "50%",
                                }}
                                animate={{
                                    rotate: [degree, degree + 360],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                <motion.div
                                    style={{ x: 35, y: -2 }}
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                >
                                    <Sparkles className="w-3 h-3 text-info" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Current Stage Display */}
                <div className="text-center space-y-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStageIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-center gap-3"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                            >
                                {currentStage.icon}
                            </motion.div>
                            <span className="text-white font-semibold text-lg">
                                {currentStage.text}
                            </span>
                        </motion.div>
                    </AnimatePresence>

                    {currentStage.subtext && (
                        <p className="text-sm text-foreground-muted">
                            {currentStage.subtext}
                        </p>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="max-w-sm mx-auto space-y-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary via-info to-primary rounded-full relative"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                        </motion.div>
                    </div>
                    <div className="flex justify-between text-xs text-foreground-muted">
                        <span>Processing {stepName}...</span>
                        <span>
                            {remainingSeconds > 0
                                ? `~${Math.ceil(remainingSeconds)}s remaining`
                                : "Almost there..."}
                        </span>
                    </div>
                </div>

                {/* Stage Indicators */}
                <div className="flex justify-center gap-2">
                    {stages.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${index === currentStageIndex
                                    ? "bg-primary"
                                    : index < currentStageIndex
                                        ? "bg-primary/50"
                                        : "bg-white/20"
                                }`}
                            animate={
                                index === currentStageIndex
                                    ? { scale: [1, 1.3, 1] }
                                    : {}
                            }
                            transition={{ duration: 0.5 }}
                        />
                    ))}
                </div>

                {/* Fun Facts Carousel */}
                <div className="mt-8 max-w-md mx-auto">
                    <motion.div
                        className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-xs text-foreground-muted mb-2 flex items-center gap-2">
                            <Lightbulb className="w-3 h-3 text-info" />
                            Did you know?
                        </p>
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentFactIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="text-sm text-white/80"
                            >
                                {funFacts[currentFactIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// Pre-configured stages for each step
export const RESEARCH_STAGES: LoadingStage[] = [
    { icon: <Search className="w-5 h-5 text-primary" />, text: "Decomposing your topic...", subtext: "Identifying key angles and subtopics" },
    { icon: <Globe className="w-5 h-5 text-info" />, text: "Querying 50+ sources...", subtext: "Using Perplexity Sonar-Pro" },
    { icon: <FileSearch className="w-5 h-5 text-primary" />, text: "Analyzing competitor content...", subtext: "Finding content gaps" },
    { icon: <Target className="w-5 h-5 text-info" />, text: "Extracting semantic keywords...", subtext: "Building keyword clusters" },
    { icon: <TrendingUp className="w-5 h-5 text-primary" />, text: "Scoring link opportunities...", subtext: "Evaluating domain authority" },
    { icon: <Sparkles className="w-5 h-5 text-info" />, text: "Synthesizing insights...", subtext: "Almost done!" },
];

export const FRAMEWORK_STAGES: LoadingStage[] = [
    { icon: <BookOpen className="w-5 h-5 text-primary" />, text: "Analyzing research data...", subtext: "Processing your findings" },
    { icon: <Target className="w-5 h-5 text-info" />, text: "Structuring for Rank Math 100/100...", subtext: "Optimizing SEO signals" },
    { icon: <Zap className="w-5 h-5 text-primary" />, text: "Generating outline...", subtext: "Creating section hierarchy" },
    { icon: <Sparkles className="w-5 h-5 text-info" />, text: "Adding writing guidelines...", subtext: "Finalizing framework" },
];

export const WRITING_STAGES: LoadingStage[] = [
    { icon: <BookOpen className="w-5 h-5 text-primary" />, text: "Loading framework...", subtext: "Preparing writing context" },
    { icon: <Zap className="w-5 h-5 text-info" />, text: "Generating introduction...", subtext: "Hooking your readers" },
    { icon: <Target className="w-5 h-5 text-primary" />, text: "Writing main sections...", subtext: "Crafting quality content" },
    { icon: <Sparkles className="w-5 h-5 text-info" />, text: "Adding transitions...", subtext: "Ensuring smooth flow" },
    { icon: <TrendingUp className="w-5 h-5 text-primary" />, text: "Optimizing keywords...", subtext: "Natural placement" },
];

export const HUMANIZE_STAGES: LoadingStage[] = [
    { icon: <Brain className="w-5 h-5 text-primary" />, text: "Analyzing AI patterns...", subtext: "Detecting robotic phrases" },
    { icon: <Sparkles className="w-5 h-5 text-info" />, text: "Adding human touches...", subtext: "Injecting personality" },
    { icon: <Zap className="w-5 h-5 text-primary" />, text: "Varying sentence structure...", subtext: "Breaking predictable patterns" },
    { icon: <Target className="w-5 h-5 text-info" />, text: "Running AI detection...", subtext: "Validating humanization" },
];

export const OPTIMIZE_STAGES: LoadingStage[] = [
    { icon: <Target className="w-5 h-5 text-primary" />, text: "Scanning for SEO issues...", subtext: "Checking all signals" },
    { icon: <TrendingUp className="w-5 h-5 text-info" />, text: "Optimizing meta tags...", subtext: "Title and description" },
    { icon: <Sparkles className="w-5 h-5 text-primary" />, text: "Enhancing readability...", subtext: "Improving flow" },
    { icon: <Zap className="w-5 h-5 text-info" />, text: "Finalizing optimizations...", subtext: "Targeting 100/100" },
];
