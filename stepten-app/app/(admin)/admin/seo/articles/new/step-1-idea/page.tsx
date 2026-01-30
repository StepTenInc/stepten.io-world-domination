"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
    Sparkles,
    Mic,
    FileText,
    Upload,
    Lightbulb,
    Wand2,
    CheckCircle2,
    Loader2,
    ArrowRight,
    Trash2,
    Play,
    Square,
    Activity
} from "lucide-react";
import { seoStorage } from "@/lib/seo-storage";
import { InputMethod, ArticleIdea, TextCorrection } from "@/lib/seo-types";
import { StepErrorBoundary } from "@/components/seo/StepErrorBoundary";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { handleError, handleSuccess, handleInfo, handleWarning } from "@/lib/error-handler";

export default function Step1IdeaPage() {
    const router = useRouter();
    const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [textIdea, setTextIdea] = useState("");
    const [articleTitle, setArticleTitle] = useState("");
    const [transcription, setTranscription] = useState("");
    const [corrections, setCorrections] = useState<TextCorrection[]>([]);
    const [showCorrections, setShowCorrections] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    useDraftAutosave();

    // Load from localStorage on mount
    useEffect(() => {
        const savedData = seoStorage.getStep1();
        if (savedData) {
            setInputMethod(savedData.inputMethod);
            setTextIdea(savedData.ideaText);
            setArticleTitle(savedData.articleTitle || "");
            setTranscription(savedData.transcriptionRaw || savedData.ideaText);
        }
    }, []);

    // Auto-save to localStorage whenever data changes
    useEffect(() => {
        if (textIdea || articleTitle) {
            const data: ArticleIdea = {
                inputMethod: inputMethod || "text",
                ideaText: textIdea,
                articleTitle: articleTitle || undefined,
                transcriptionRaw: transcription || undefined,
                timestamp: new Date().toISOString(),
            };
            seoStorage.saveStep1(data);
        }
    }, [textIdea, articleTitle, inputMethod, transcription]);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                await handleTranscription(audioBlob);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Failed to start recording:", error);
            handleError(new Error("Could not access microphone. Please check permissions."), "Voice Recording");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleTranscription = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");

            const response = await fetch("/api/seo/transcribe", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setTranscription(data.text);
                setTextIdea(data.text);
            } else {
                handleError(new Error(data.error), "Transcription");
            }
        } catch (error) {
            console.error("Transcription error:", error);
            handleError(new Error("Failed to transcribe audio. Please try again."), "Transcription");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFixText = async () => {
        if (!textIdea.trim()) return;

        setIsProcessing(true);
        try {
            const response = await fetch("/api/seo/suggest-corrections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textIdea }),
            });

            const data = await response.json();

            if (data.success && data.corrections.length > 0) {
                setCorrections(data.corrections);
                setShowCorrections(true);
            } else {
                handleSuccess("Text Looks Good", "No corrections needed!");
            }
        } catch (error) {
            console.error("Correction error:", error);
            handleError(new Error("Failed to suggest corrections. Please try again."), "Text Correction");
        } finally {
            setIsProcessing(false);
        }
    };

    const applyCorrection = (correction: TextCorrection) => {
        const updatedText = textIdea.replace(correction.original, correction.suggestion);
        setTextIdea(updatedText);
        setCorrections(corrections.filter((c) => c.original !== correction.original));
        if (corrections.length === 1) {
            setShowCorrections(false);
        }
    };

    const handleGenerateTitle = async () => {
        if (!textIdea.trim()) return;

        setIsProcessing(true);
        try {
            const response = await fetch("/api/seo/generate-title", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textIdea }),
            });

            const data = await response.json();

            if (data.success) {
                setArticleTitle(data.title);
            } else {
                handleError(new Error(data.error), "Title Generation");
            }
        } catch (error) {
            console.error("Title generation error:", error);
            handleError(new Error("Failed to generate title. Please try again."), "Title Generation");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileType = file.name.split(".").pop()?.toLowerCase();
        if (!["txt", "md", "pdf"].includes(fileType || "")) {
            handleWarning("Invalid File Type", "Please upload a .txt, .md, or .pdf file");
            return;
        }

        setIsProcessing(true);
        setUploadedFileName(file.name);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/seo/extract-document", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setTextIdea(data.text);
                setTranscription(data.text);
            } else {
                handleError(new Error(data.error), "Document Extraction");
            }
        } catch (error) {
            console.error("Document extraction error:", error);
            handleError(new Error("Failed to extract document text. Please try again."), "Document Extraction");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleContinue = () => {
        if (!textIdea.trim()) {
            handleWarning("Missing Idea", "Please provide an article idea before continuing.");
            return;
        }

        const currentData = seoStorage.getArticleData();
        const previousIdea = currentData.step1?.ideaText;

        if (previousIdea && previousIdea !== textIdea) {
            const confirmClear = confirm(
                "You've changed your article idea. This will clear all research and content from Steps 2-8. Continue?"
            );
            if (!confirmClear) return;

            seoStorage.saveArticleData({
                step1: currentData.step1,
                step2: undefined,
                step3: undefined,
                step4: undefined,
                step5: undefined,
                step6: undefined,
                step7: undefined,
                step8: undefined,
                currentStep: 1,
            });
        }

        // Data is already saved via useEffect, just navigate
        router.push("/admin/seo/articles/new/step-2-research");
    };

    const handleSaveDraft = () => {
        if (!textIdea.trim()) {
            handleWarning("Missing Idea", "Please provide an article idea before saving.");
            return;
        }

        // Data is already saved via useEffect
        handleSuccess("Draft Saved", "Your idea has been saved successfully.");
    };

    const handleClearStorage = () => {
        if (confirm("Are you sure you want to clear all saved data and start fresh? This cannot be undone.")) {
            // Clear all SEO article data
            seoStorage.clearDraft();

            // Reset component state
            setInputMethod(null);
            setTextIdea("");
            setArticleTitle("");
            setTranscription("");
            setCorrections([]);
            setShowCorrections(false);
            setUploadedFileName("");

            handleSuccess("Data Cleared", "All data cleared! Starting fresh.");
        }
    };

    const inputMethods = [
        { id: "voice" as InputMethod, icon: Mic, title: "Voice Recording", desc: "Speak your idea", color: "from-purple-500/20 to-info/20" },
        { id: "text" as InputMethod, icon: FileText, title: "Text Input", desc: "Type your idea", color: "from-primary/20 to-info/20" },
        { id: "document" as InputMethod, icon: Upload, title: "Upload Document", desc: ".md, .txt, .pdf", color: "from-info/20 to-primary/20" },
        { id: "existing" as InputMethod, icon: Lightbulb, title: "Existing Idea", desc: "From saved ideas", color: "from-primary/20 to-success/20" },
    ];

    return (
        <StepErrorBoundary>
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header with Progress */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
            >
                {/* Enhanced Progress Bar */}
                <div className="flex items-center gap-3">
                    <motion.div
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-info text-background text-sm font-black relative"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-info rounded-full blur-md opacity-50" />
                        <span className="relative z-10">1</span>
                    </motion.div>
                    <div className="h-2 flex-1 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-full overflow-hidden border border-white/10 relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary via-info to-primary rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{ width: "12.5%" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    </div>
                    <span className="text-sm text-foreground-muted font-semibold">Step 1 of 8</span>
                </div>

                {/* Title */}
                <div className="flex items-start justify-between">
                    <div>
                        <Link href="/admin/seo" className="text-sm text-primary hover:text-info transition-colors mb-2 inline-flex items-center gap-1 group">
                            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to SEO Engine
                        </Link>
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
                            Voice to Idea Capture
                        </h1>
                        <p className="text-foreground-muted text-lg">
                            Capture your article idea via voice recording, text input, or document upload
                        </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearStorage}
                            className="border-error/30 text-error hover:bg-error/10 hover:border-error/50 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear & Start Fresh
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Input Method Selection */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {inputMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                        <motion.div
                            key={method.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="group relative cursor-pointer"
                            onClick={() => setInputMethod(method.id)}
                        >
                            {/* Glow Effect */}
                            <motion.div
                                className={`absolute -inset-0.5 bg-gradient-to-r ${method.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
                                whileHover={{ scale: 1.02 }}
                            />

                            <Card className={`relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border transition-all duration-300 overflow-hidden h-full ${
                                inputMethod === method.id
                                    ? "border-primary/50 shadow-lg shadow-primary/20"
                                    : "border-white/10 hover:border-primary/30"
                            }`}>
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <CardContent className="pt-6 text-center relative z-10">
                                    <motion.div
                                        className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-colors ${
                                            inputMethod === method.id
                                                ? "bg-primary/20 border-2 border-primary/30"
                                                : "bg-primary/10 border border-primary/20 group-hover:bg-primary/20"
                                        }`}
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Icon className="w-8 h-8 text-primary" />
                                    </motion.div>
                                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{method.title}</h3>
                                    <p className="text-sm text-foreground-muted mt-1">{method.desc}</p>
                                    {inputMethod === method.id && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="mt-3 flex items-center justify-center gap-1 text-primary text-sm font-semibold"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Selected
                                        </motion.div>
                                    )}
                                </CardContent>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Voice Recording Section */}
            {inputMethod === "voice" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="group relative"
                >
                    <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-info/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                        whileHover={{ scale: 1.02 }}
                    />

                    <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                        </div>

                        <CardHeader className="relative z-10">
                            <CardTitle className="text-white flex items-center gap-2">
                                <Mic className="w-6 h-6 text-primary" />
                                Voice Recording
                            </CardTitle>
                            <CardDescription>
                                Click to start recording. Speak naturally about your article idea.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            {/* Recording Button */}
                            <div className="flex flex-col items-center gap-4">
                                <motion.button
                                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                                    disabled={isProcessing}
                                    className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                                        isRecording
                                            ? "bg-error/20 border-4 border-error"
                                            : "bg-primary/10 border-4 border-primary/30 hover:border-primary/50"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    whileHover={!isProcessing ? { scale: 1.05 } : {}}
                                    whileTap={!isProcessing ? { scale: 0.95 } : {}}
                                >
                                    {isRecording && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-error/20"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}
                                    {isProcessing ? (
                                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                    ) : isRecording ? (
                                        <Square className="w-12 h-12 text-error" />
                                    ) : (
                                        <Play className="w-12 h-12 text-primary ml-1" />
                                    )}
                                </motion.button>
                                <p className="text-foreground-muted font-medium">
                                    {isProcessing
                                        ? "Transcribing with OpenAI Whisper..."
                                        : isRecording
                                        ? "Recording... Click to stop"
                                        : "Click to start recording"}
                                </p>
                                {isRecording && (
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-error rounded-full"
                                                animate={{
                                                    height: [8, 24, 8],
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    repeat: Infinity,
                                                    delay: i * 0.1,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Transcription Output */}
                            {transcription && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-white flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-primary" />
                                            Transcription
                                        </label>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleFixText}
                                            disabled={isProcessing}
                                            className="border-primary/30 text-primary hover:bg-primary/10"
                                        >
                                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                            <span className="ml-2">Fix Text</span>
                                        </Button>
                                    </div>
                                    <textarea
                                        value={textIdea}
                                        onChange={(e) => setTextIdea(e.target.value)}
                                        className="w-full min-h-[150px] p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-white placeholder:text-foreground-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
                                        placeholder="Your transcription will appear here..."
                                    />
                                    <p className="text-xs text-foreground-muted">
                                        Powered by OpenAI Whisper • Edit above if needed
                                    </p>
                                </motion.div>
                            )}

                            {/* Corrections UI */}
                            {showCorrections && corrections.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-2 p-4 bg-primary/5 border border-primary/20 rounded-xl"
                                >
                                    <h4 className="font-semibold text-white flex items-center gap-2">
                                        <Wand2 className="w-4 h-4 text-primary" />
                                        Suggested Corrections
                                    </h4>
                                    {corrections.map((correction, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-lg border border-white/10"
                                        >
                                            <div>
                                                <span className="line-through text-error">{correction.original}</span>
                                                <span className="mx-2 text-foreground-muted">→</span>
                                                <span className="text-primary font-semibold">{correction.suggestion}</span>
                                                <span className="text-xs text-foreground-muted ml-2">
                                                    ({correction.reason})
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => applyCorrection(correction)}
                                                    className="bg-primary text-background hover:bg-primary/90"
                                                >
                                                    Apply
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setCorrections(
                                                            corrections.filter((c) => c.original !== correction.original)
                                                        )
                                                    }
                                                    className="border-white/10 hover:bg-white/5"
                                                >
                                                    Ignore
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Text Input Section */}
            {inputMethod === "text" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
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
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileText className="w-6 h-6 text-primary" />
                                Text Input
                            </CardTitle>
                            <CardDescription>
                                Type or paste your article idea. Be as detailed as you want.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-white">
                                        Article Title (optional)
                                    </label>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleGenerateTitle}
                                            disabled={isProcessing || !textIdea.trim()}
                                            className="border-primary/30 text-primary hover:bg-primary/10 flex items-center gap-2"
                                        >
                                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                            Auto-Generate
                                        </Button>
                                    </motion.div>
                                </div>
                                <Input
                                    value={articleTitle}
                                    onChange={(e) => setArticleTitle(e.target.value)}
                                    placeholder="e.g., How AI is Transforming Small Business Operations"
                                    className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 text-white placeholder:text-foreground-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white">Your Idea</label>
                                <textarea
                                    value={textIdea}
                                    onChange={(e) => setTextIdea(e.target.value)}
                                    placeholder="Describe your article idea in detail. What's the main topic? What angle do you want to take? Who's the target audience? What unique insights do you want to share?"
                                    className="w-full min-h-[200px] p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-white placeholder:text-foreground-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-foreground-muted">{textIdea.length} characters</p>
                                    {textIdea.length > 50 && (
                                        <p className="text-xs text-success flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Good length
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Document Upload Section */}
            {inputMethod === "document" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
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
                            <CardTitle className="text-white flex items-center gap-2">
                                <Upload className="w-6 h-6 text-primary" />
                                Upload Document
                            </CardTitle>
                            <CardDescription>
                                Upload a markdown, text, or PDF file with your idea or research
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <motion.div
                                className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:border-primary/50 transition-all cursor-pointer bg-gradient-to-br from-white/[0.02] to-transparent"
                                onClick={() => fileInputRef.current?.click()}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="mb-4">
                                    {isProcessing ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Loader2 className="w-16 h-16 mx-auto text-primary" />
                                        </motion.div>
                                    ) : uploadedFileName ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", duration: 0.5 }}
                                        >
                                            <CheckCircle2 className="w-16 h-16 mx-auto text-success" />
                                        </motion.div>
                                    ) : (
                                        <Upload className="w-16 h-16 mx-auto text-primary" />
                                    )}
                                </div>
                                {uploadedFileName ? (
                                    <>
                                        <p className="text-white font-semibold mb-2 flex items-center justify-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-success" />
                                            {uploadedFileName}
                                        </p>
                                        <p className="text-sm text-foreground-muted">Click to upload a different file</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-white font-semibold mb-2">
                                            {isProcessing ? "Extracting text..." : "Drop your file here or click to browse"}
                                        </p>
                                        <p className="text-sm text-foreground-muted">
                                            Supported formats: .md, .txt, .pdf (max 10MB)
                                        </p>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".md,.txt,.pdf"
                                    onChange={handleFileUpload}
                                    disabled={isProcessing}
                                />
                            </motion.div>

                            {/* Show extracted text */}
                            {textIdea && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 space-y-2"
                                >
                                    <label className="text-sm font-semibold text-white">Extracted Text</label>
                                    <textarea
                                        value={textIdea}
                                        onChange={(e) => setTextIdea(e.target.value)}
                                        className="w-full min-h-[200px] p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
                                    />
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Existing Ideas Section */}
            {inputMethod === "existing" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="group relative"
                >
                    <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-success/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                        whileHover={{ scale: 1.02 }}
                    />

                    <Card className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                        </div>

                        <CardHeader className="relative z-10">
                            <CardTitle className="text-white flex items-center gap-2">
                                <Lightbulb className="w-6 h-6 text-primary" />
                                Saved Ideas
                            </CardTitle>
                            <CardDescription>Select from previously saved article ideas</CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-center py-12 text-foreground-muted">
                                <Lightbulb className="w-16 h-16 mx-auto mb-4 text-foreground-muted/50" />
                                <p className="text-lg mb-2 font-semibold">No saved ideas yet</p>
                                <p className="text-sm">
                                    Save drafts from other input methods to see them here
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between pt-4 border-t border-white/10"
            >
                <Link href="/admin/seo">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all">
                        Cancel
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="secondary"
                            className="bg-gradient-to-br from-white/5 to-white/[0.02] text-white hover:from-white/10 hover:to-white/5 border border-white/10"
                            onClick={handleSaveDraft}
                            disabled={!textIdea.trim()}
                        >
                            Save as Draft
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                            onClick={handleContinue}
                            disabled={!textIdea.trim()}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Continue to Research
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                </div>
            </motion.div>
        </div>
        </StepErrorBoundary>
    );
}
