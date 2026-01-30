"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2, Check, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceInputProps {
    onTranscription: (text: string) => void;
    placeholder?: string;
    className?: string;
    buttonPosition?: "inline" | "floating";
    autoInsert?: boolean; // If true, automatically insert transcription without confirmation
}

export function VoiceInput({
    onTranscription,
    placeholder = "Click the microphone to start recording...",
    className = "",
    buttonPosition = "inline",
    autoInsert = false
}: VoiceInputProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcription, setTranscription] = useState("");
    const [error, setError] = useState("");
    const [audioLevel, setAudioLevel] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startAudioVisualization = (stream: MediaStream) => {
        try {
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateLevel = () => {
                if (!analyserRef.current) return;

                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setAudioLevel(Math.min(100, (average / 255) * 200));

                animationFrameRef.current = requestAnimationFrame(updateLevel);
            };

            updateLevel();
        } catch (err) {
            console.error("Audio visualization error:", err);
        }
    };

    const handleStartRecording = async () => {
        try {
            setError("");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

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
                stream.getTracks().forEach(track => track.stop());
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            startAudioVisualization(stream);
        } catch (error: any) {
            console.error("Failed to start recording:", error);
            setError("Could not access microphone. Please check permissions.");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            setAudioLevel(0);
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

            if (!response.ok) {
                throw new Error("Transcription failed");
            }

            const data = await response.json();

            if (data.success && data.text) {
                setTranscription(data.text);
                if (autoInsert) {
                    onTranscription(data.text);
                    setTranscription("");
                }
            } else {
                throw new Error(data.error || "Transcription failed");
            }
        } catch (error: any) {
            console.error("Transcription error:", error);
            setError(`Failed to transcribe: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInsert = () => {
        if (transcription) {
            onTranscription(transcription);
            setTranscription("");
        }
    };

    const handleClear = () => {
        setTranscription("");
        setError("");
    };

    const RecordButton = () => (
        <motion.button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isProcessing}
            className={`relative flex items-center justify-center transition-all duration-300 ${
                buttonPosition === "floating"
                    ? "w-16 h-16 rounded-full shadow-2xl"
                    : "w-12 h-12 rounded-full"
            } ${
                isProcessing
                    ? "bg-gradient-to-br from-white/10 to-white/5 cursor-not-allowed"
                    : isRecording
                    ? "bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-500"
                    : "bg-gradient-to-br from-primary/20 to-info/20 border-2 border-primary/30 hover:border-primary/50"
            }`}
            whileHover={!isProcessing ? { scale: 1.05 } : {}}
            whileTap={!isProcessing ? { scale: 0.95 } : {}}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
            {/* Pulse animation when recording */}
            {isRecording && (
                <motion.div
                    className="absolute inset-0 rounded-full bg-red-500/30"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            )}

            {/* Icon */}
            {isProcessing ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
            ) : isRecording ? (
                <Square className="w-5 h-5 text-red-500 fill-red-500" />
            ) : (
                <Mic className="w-6 h-6 text-primary" />
            )}
        </motion.button>
    );

    const Waveform = () => (
        <AnimatePresence>
            {isRecording && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1 h-12"
                >
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-1 bg-gradient-to-t from-red-500 to-red-300 rounded-full"
                            animate={{
                                height: [
                                    8 + audioLevel * 0.2,
                                    Math.max(8, Math.min(40, 8 + audioLevel * 0.4 + Math.random() * 16)),
                                    8 + audioLevel * 0.2,
                                ],
                            }}
                            transition={{
                                duration: 0.4 + i * 0.05,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (buttonPosition === "floating") {
        return (
            <>
                {/* Floating Button */}
                <motion.div
                    className="fixed bottom-8 right-8 z-50"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <RecordButton />
                </motion.div>

                {/* Floating Status Card */}
                <AnimatePresence>
                    {(isRecording || isProcessing || transcription || error) && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-28 right-8 z-40 w-80"
                        >
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
                                {isRecording && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-white font-semibold flex items-center gap-2">
                                                <Volume2 className="w-4 h-4 text-red-500" />
                                                Listening...
                                            </p>
                                            <span className="text-xs text-foreground-muted">Click to stop</span>
                                        </div>
                                        <Waveform />
                                    </div>
                                )}

                                {isProcessing && (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                        <p className="text-white">Transcribing with Whisper...</p>
                                    </div>
                                )}

                                {transcription && !isProcessing && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-white">Transcription</p>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={handleClear}
                                                className="h-6 w-6 p-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-foreground-muted bg-black/20 rounded-lg p-3 max-h-32 overflow-y-auto">
                                            {transcription}
                                        </p>
                                        <Button
                                            onClick={handleInsert}
                                            className="w-full bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50"
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Insert Text
                                        </Button>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex items-start gap-2 text-red-400">
                                        <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    // Inline mode
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center gap-4">
                <RecordButton />

                <div className="flex-1">
                    {isRecording ? (
                        <div className="space-y-2">
                            <p className="text-sm text-white font-medium flex items-center gap-2">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    <Volume2 className="w-4 h-4 text-red-500" />
                                </motion.div>
                                Recording... Click stop when done
                            </p>
                            <Waveform />
                        </div>
                    ) : isProcessing ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            <p className="text-sm text-white">Transcribing with OpenAI Whisper...</p>
                        </div>
                    ) : (
                        <p className="text-sm text-foreground-muted">{placeholder}</p>
                    )}
                </div>
            </div>

            {/* Transcription Display */}
            <AnimatePresence>
                {transcription && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-white">Transcribed Text</label>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleClear}
                                className="h-8 text-foreground-muted hover:text-white"
                            >
                                Clear
                            </Button>
                        </div>
                        <div className="p-3 bg-black/20 rounded-lg">
                            <p className="text-sm text-white whitespace-pre-wrap">{transcription}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-foreground-muted">Powered by OpenAI Whisper</p>
                            <Button
                                onClick={handleInsert}
                                size="sm"
                                className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Insert Text
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setError("")}
                            className="h-6 w-6 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
