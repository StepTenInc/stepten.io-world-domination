"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VoiceFeedbackProps {
    title?: string;
    description?: string;
    onFeedbackSubmit?: (feedback: string) => void;
    disabled?: boolean;
}

export function VoiceFeedback({
    title = "Voice Feedback",
    description = "Record your feedback to refine the research",
    onFeedbackSubmit,
    disabled = false
}: VoiceFeedbackProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

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
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Failed to start recording:", error);
            alert("Could not access microphone. Please check permissions.");
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
            formData.append("audio", audioBlob, "feedback.webm");

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
            } else {
                throw new Error(data.error || "Transcription failed");
            }
        } catch (error: any) {
            console.error("Transcription error:", error);
            alert(`Failed to transcribe: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApplyFeedback = () => {
        if (transcription && onFeedbackSubmit) {
            onFeedbackSubmit(transcription);
        }
    };

    const handleClear = () => {
        setTranscription("");
    };

    return (
        <Card className="border-border bg-background">
            <CardHeader className="pb-3">
                <CardTitle className="text-foreground flex items-center gap-2">
                    <span className="text-xl">🎤</span> {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Recording Button */}
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        disabled={isProcessing || disabled}
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-300 ${disabled
                                ? "bg-muted cursor-not-allowed opacity-50"
                                : isRecording
                                    ? "bg-error animate-pulse"
                                    : isProcessing
                                        ? "bg-primary/20 cursor-not-allowed"
                                        : "bg-primary/10 hover:bg-primary/20 hover:scale-105"
                            }`}
                        style={isRecording ? { boxShadow: "0 0 40px rgba(255, 71, 87, 0.4)" } : {}}
                    >
                        {isProcessing ? (
                            <span className="text-2xl animate-spin">⏳</span>
                        ) : isRecording ? (
                            "⏹️"
                        ) : (
                            "🎙️"
                        )}
                    </button>
                    <p className="text-sm text-foreground-muted text-center">
                        {disabled
                            ? "Feedback already applied"
                            : isProcessing
                                ? "Transcribing with Whisper..."
                                : isRecording
                                    ? "Recording... Click to stop"
                                    : "Click to record feedback"}
                    </p>

                    {/* Audio Waveform */}
                    {isRecording && (
                        <div className="flex items-center gap-1 h-8">
                            {[...Array(7)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-error rounded-full animate-pulse"
                                    style={{
                                        height: `${Math.random() * 24 + 8}px`,
                                        animationDelay: `${i * 0.1}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Transcription Display */}
                {transcription && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground">Your Feedback</label>
                            <button
                                onClick={handleClear}
                                className="text-xs text-foreground-muted hover:text-foreground"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="p-4 rounded-lg bg-background-alt border border-border">
                            <p className="text-foreground text-sm whitespace-pre-wrap">{transcription}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-foreground-muted">
                                Powered by OpenAI Whisper
                            </p>
                            <Button
                                onClick={handleApplyFeedback}
                                disabled={disabled}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                size="sm"
                            >
                                Apply Feedback →
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
