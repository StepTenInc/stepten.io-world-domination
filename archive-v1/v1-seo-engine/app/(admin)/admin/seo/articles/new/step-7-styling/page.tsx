"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceFeedback } from "@/components/seo/VoiceFeedback";
import { motion, AnimatePresence } from "framer-motion";
import { seoStorage } from "@/lib/seo-storage";
import { imageStorage } from "@/lib/image-storage";
import { validateStepAccess } from "@/lib/seo-step-validator";
import { StepErrorBoundary } from "@/components/seo/StepErrorBoundary";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import {
    Sparkles,
    Palette,
    Image as ImageIcon,
    Video,
    Type,
    Package,
    Eye,
    Lightbulb,
    MessageSquare,
    BarChart3,
    CheckSquare,
    RefreshCw,
    Edit3,
    Upload,
    ArrowRight,
    Loader2,
    Film,
    Save,
    X,
    Check,
    Play
} from "lucide-react";

interface ImageData {
    id: string;
    type: "hero" | "section";
    prompt: string;
    suggestedAlt: string;
    insertAfter?: string;
    position: number | "hero";
    status: "empty" | "generating" | "ready";
    editingPrompt?: boolean;
    imageData?: string; // base64 data URL from Nano Banana
}

interface Section {
    heading: string;
    content: string;
}

interface ContentBlock {
    id: string;
    type: "callout" | "quote" | "stats" | "checklist" | "comparison" | "faq";
    name: string;
    enabled: boolean;
    data?: any; // Structured data from AI extraction
    editing?: boolean; // Whether user is editing this block
}

interface VideoData {
    file: File | null;
    preview: string | null;
    duration: number;
    format: string;
    useAsHero: boolean;
}

export default function Step7StylingPage() {
    const router = useRouter();
    const videoInputRef = useRef<HTMLInputElement>(null);

    // State management
    const [article, setArticle] = useState("");
    const [title, setTitle] = useState("");
    const [sections, setSections] = useState<Section[]>([]);

    // Hero Image State
    const [heroImage, setHeroImage] = useState<ImageData | null>(null);
    const [isGeneratingHero, setIsGeneratingHero] = useState(false);

    // Section Images State (3 images)
    const [sectionImages, setSectionImages] = useState<ImageData[]>([]);
    const [isGeneratingSection, setIsGeneratingSection] = useState(false);

    // Content Blocks State
    const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
        {
            id: "1",
            type: "callout",
            name: "Key Takeaway Box",
            enabled: true,
        },
        {
            id: "2",
            type: "quote",
            name: "Expert Quote Block",
            enabled: true,
        },
        {
            id: "3",
            type: "stats",
            name: "Stats Highlight",
            enabled: true,
        },
        {
            id: "4",
            type: "checklist",
            name: "Action Checklist",
            enabled: true,
        },
        {
            id: "5",
            type: "comparison",
            name: "Before/After Table",
            enabled: false,
        },
        {
            id: "6",
            type: "faq",
            name: "FAQ Accordion",
            enabled: false,
        },
    ]);

    // AI Extraction State
    const [isExtractingBlocks, setIsExtractingBlocks] = useState(false);
    const [hasExtractedBlocks, setHasExtractedBlocks] = useState(false);

    // Typography State
    const [typography, setTypography] = useState({
        headingFont: "Space Grotesk",
        bodyFont: "Inter",
        codeFont: "JetBrains Mono",
    });

    // Color Accent State
    const [selectedColor, setSelectedColor] = useState("#00FF41"); // Matrix Green default

    // Video Upload State
    const [videoData, setVideoData] = useState<VideoData>({
        file: null,
        preview: null,
        duration: 0,
        format: "",
        useAsHero: false,
    });

    // Edit state for content blocks
    const [editingBlockData, setEditingBlockData] = useState<any>(null);

    // Toast notification state
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: "success" | "error" | "warning";
    }>({ show: false, message: "", type: "success" });
    useDraftAutosave();

    // Load data from previous steps
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            const validation = validateStepAccess(7);
            if (!validation.canAccess) {
                showToast(validation.reason || "Complete previous steps first", "error");
                setTimeout(() => router.push(validation.redirectTo || "/admin/seo/articles/new/step-6-optimize"), 100);
                return;
            }

            const currentDraftId = seoStorage.getDraftId();
            const step5Data = seoStorage.getStep5();
            const step3Data = seoStorage.getStep3();

            if (isMounted) {
                setArticle(step5Data.humanized);
                setTitle(step3Data.metadata.title);

                // Extract sections from article HTML
                const extractedSections = extractSections(step5Data.humanized);
                setSections(extractedSections);

                // Load saved Step 7 data if exists
                const step7Data = seoStorage.getStep7();
                if (step7Data) {
                    // Restore hero image with full data
                    if (step7Data.heroImage) {
                        let heroImageData = step7Data.heroImageData || step7Data.heroImage.imageData;
                        if (step7Data.heroImageId) {
                            try {
                                heroImageData = await imageStorage.getImage(`${currentDraftId}:${step7Data.heroImageId}`);
                            } catch (error) {
                                console.warn("Failed to load hero image from IndexedDB:", error);
                                showToast("Hero image couldn't be loaded. You may need to regenerate it.", "warning");
                            }
                        }
                        setHeroImage({
                            ...step7Data.heroImage,
                            imageData: heroImageData || undefined
                        });
                    }
                    // Restore section images with full data
                    if (step7Data.sectionImages) {
                        const sectionImageIds = step7Data.sectionImageIds || step7Data.sectionImages.map((img: any) => img.id);
                        let sectionImagesData: Array<string | null> = [];
                        let hasLoadErrors = false;
                        try {
                            sectionImagesData = await Promise.all(
                                sectionImageIds.map((id: string) => imageStorage.getImage(`${currentDraftId}:${id}`))
                            );
                        } catch (error) {
                            console.warn("Failed to load section images from IndexedDB:", error);
                            hasLoadErrors = true;
                            showToast("Some section images couldn't be loaded. You may need to regenerate them.", "warning");
                        }
                        setSectionImages(step7Data.sectionImages.map((img: any, idx: number) => ({
                            ...img,
                            imageData: sectionImagesData?.[idx] || step7Data.sectionImagesData?.[idx] || img.imageData
                        })));
                    }
                    if (step7Data.contentBlocks) {
                        setContentBlocks(step7Data.contentBlocks);
                        setHasExtractedBlocks(true);
                    }
                    if (step7Data.typography) setTypography(step7Data.typography);
                    if (step7Data.selectedColor) setSelectedColor(step7Data.selectedColor);
                    if (step7Data.videoData) setVideoData(step7Data.videoData);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [router]);


    // Extract sections from HTML
    const extractSections = (html: string): Section[] => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        const headings = tempDiv.querySelectorAll("h2, h3");
        const sections: Section[] = [];

        headings.forEach((heading) => {
            const headingText = heading.textContent || "";
            let content = "";
            let nextElement = heading.nextElementSibling;

            while (nextElement && !nextElement.matches("h2, h3")) {
                content += nextElement.outerHTML;
                nextElement = nextElement.nextElementSibling;
            }

            if (headingText && content) {
                sections.push({
                    heading: headingText,
                    content: content.substring(0, 500), // First 500 chars
                });
            }
        });

        return sections.slice(0, 5); // Max 5 sections
    };

    // Show toast notification
    const showToast = (message: string, type: "success" | "error" | "warning" = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "success" });
        }, 3000);
    };

    // Generate Hero Image with Nano Banana
    const handleGenerateHeroImage = async () => {
        setIsGeneratingHero(true);

        try {
            const response = await fetch("/api/seo/generate-images", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    article,
                    title,
                    sections: [],
                    type: "hero", // Specify hero image generation
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate hero image");
            }

            const data = await response.json();

            if (data.success && data.image) {
                const newHeroImage = {
                    id: "hero",
                    type: "hero" as "hero" | "section",
                    prompt: data.image.prompt,
                    suggestedAlt: data.image.suggestedAlt,
                    position: "hero" as number | "hero",
                    status: "ready" as "empty" | "generating" | "ready",
                    imageData: data.image.imageData, // base64 data URL
                };
                setHeroImage(newHeroImage);

                // Save with image data to IndexedDB
                seoStorage.saveStep7({
                    heroImage: { ...newHeroImage, imageData: undefined },
                    heroImageId: newHeroImage.id,
                    heroImageData: data.image.imageData,
                    sectionImages: sectionImages.map(img => ({ ...img, imageData: undefined })),
                    sectionImageIds: sectionImages.map(img => img.id),
                    sectionImagesData: sectionImages.map(img => img.imageData),
                    contentBlocks,
                    typography,
                    selectedColor,
                    timestamp: new Date().toISOString(),
                });

                showToast("Hero image generated with Nano Banana!");
            }
        } catch (error: any) {
            console.error("Hero image generation error:", error);
            showToast(error.message || "Failed to generate hero image", "error");
        } finally {
            setIsGeneratingHero(false);
        }
    };

    // Generate All Section Images (3 images) with Nano Banana
    const handleGenerateAllImages = async () => {
        if (sections.length === 0) {
            showToast("No sections found in article", "error");
            return;
        }

        setIsGeneratingSection(true);

        try {
            // Generate up to 3 section images
            const numberOfImages = Math.min(sections.length, 3);
            const selectedSections = sections.slice(0, numberOfImages);

            const imagePromises = selectedSections.map((section, index) =>
                fetch("/api/seo/generate-images", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        article,
                        title,
                        sections: [section],
                        type: "section",
                    }),
                }).then(async (response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to generate image ${index + 1}`);
                    }
                    return response.json();
                })
            );

            const results = await Promise.all(imagePromises);
            const generatedImages: ImageData[] = results.map((data, index) => {
                if (!data?.success || !data.image) {
                    throw new Error(`Image ${index + 1} failed to generate`);
                }
                return {
                    id: `section-${index}`,
                    type: "section",
                    prompt: data.image.prompt,
                    suggestedAlt: data.image.suggestedAlt,
                    insertAfter: data.image.insertAfter,
                    position: index + 1,
                    status: "ready",
                    imageData: data.image.imageData,
                };
            });

            setSectionImages(generatedImages);

            // Save with image data to IndexedDB
            seoStorage.saveStep7({
                heroImage: heroImage ? { ...heroImage, imageData: undefined } : null,
                heroImageId: heroImage?.id,
                heroImageData: heroImage?.imageData,
                sectionImages: generatedImages.map(img => ({ ...img, imageData: undefined })),
                sectionImageIds: generatedImages.map(img => img.id),
                sectionImagesData: generatedImages.map(img => img.imageData),
                contentBlocks,
                typography,
                selectedColor,
                timestamp: new Date().toISOString(),
            });

            showToast(`${generatedImages.length} section images generated with Nano Banana!`);
        } catch (error: any) {
            console.error("Section images generation error:", error);
            showToast("Failed to generate section images", "error");
        } finally {
            setIsGeneratingSection(false);
        }
    };

    // Extract content blocks with AI
    const handleExtractContentBlocks = async () => {
        if (!article || !title) {
            showToast("Article content not found", "error");
            return;
        }

        setIsExtractingBlocks(true);

        try {
            const response = await fetch("/api/seo/extract-content-blocks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ article, title }),
            });

            if (!response.ok) {
                throw new Error("Failed to extract content blocks");
            }

            const data = await response.json();

            if (data.success && data.contentBlocks) {
                // Map AI-extracted data to content blocks
                setContentBlocks([
                    {
                        id: "1",
                        type: "callout",
                        name: "Key Takeaway Box",
                        enabled: true,
                        data: data.contentBlocks.keyTakeaway,
                    },
                    {
                        id: "2",
                        type: "quote",
                        name: "Expert Quote Block",
                        enabled: true,
                        data: data.contentBlocks.expertQuote,
                    },
                    {
                        id: "3",
                        type: "stats",
                        name: "Stats Highlight",
                        enabled: true,
                        data: data.contentBlocks.statsHighlight,
                    },
                    {
                        id: "4",
                        type: "checklist",
                        name: "Action Checklist",
                        enabled: true,
                        data: data.contentBlocks.actionChecklist,
                    },
                    {
                        id: "5",
                        type: "comparison",
                        name: "Before/After Table",
                        enabled: true,
                        data: data.contentBlocks.beforeAfter,
                    },
                    {
                        id: "6",
                        type: "faq",
                        name: "FAQ Accordion",
                        enabled: true,
                        data: data.contentBlocks.faq,
                    },
                ]);

                setHasExtractedBlocks(true);
                showToast("Content blocks extracted successfully!");
            }
        } catch (error: any) {
            console.error("Content blocks extraction error:", error);
            showToast(error.message || "Failed to extract content blocks", "error");
        } finally {
            setIsExtractingBlocks(false);
        }
    };

    // Toggle content block
    const toggleContentBlock = (blockId: string) => {
        setContentBlocks(blocks =>
            blocks.map(block =>
                block.id === blockId ? { ...block, enabled: !block.enabled } : block
            )
        );
    };

    // Edit content block data
    const editContentBlock = (blockId: string) => {
        const block = contentBlocks.find(b => b.id === blockId);
        if (block && block.data) {
            setEditingBlockData(block.data);
            setContentBlocks(blocks =>
                blocks.map(b =>
                    b.id === blockId ? { ...b, editing: true } : b
                )
            );
        }
    };

    // Save edited content block
    const saveContentBlockEdit = (blockId: string, newData: any) => {
        setContentBlocks(blocks =>
            blocks.map(block =>
                block.id === blockId ? { ...block, data: newData, editing: false } : block
            )
        );
        showToast("Content block updated!");
    };

    // Cancel editing
    const cancelContentBlockEdit = (blockId: string) => {
        setContentBlocks(blocks =>
            blocks.map(block =>
                block.id === blockId ? { ...block, editing: false } : block
            )
        );
    };

    // Render edit interface for content blocks
    const renderBlockEditor = (block: ContentBlock) => {
        if (!block.data) return null;

        const tempData = editingBlockData || block.data;

        switch (block.type) {
            case "callout":
                return (
                    <div className="space-y-3">
                        <textarea
                            value={tempData}
                            onChange={(e) => setEditingBlockData(e.target.value)}
                            className="w-full h-32 p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white text-sm resize-none focus:border-primary/50 outline-none"
                            placeholder="Enter key takeaway..."
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() => {
                                    saveContentBlockEdit(block.id, editingBlockData);
                                    setEditingBlockData(null);
                                }}
                                className="bg-success text-white"
                            >
                                <Check className="w-4 h-4 mr-1" />
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    cancelContentBlockEdit(block.id);
                                    setEditingBlockData(null);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                );

            case "quote":
                return (
                    <div className="space-y-3">
                        <textarea
                            value={tempData.quote}
                            onChange={(e) => setEditingBlockData({ ...tempData, quote: e.target.value })}
                            className="w-full h-24 p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white text-sm resize-none focus:border-primary/50 outline-none"
                            placeholder="Enter quote..."
                        />
                        <input
                            type="text"
                            value={tempData.attribution}
                            onChange={(e) => setEditingBlockData({ ...tempData, attribution: e.target.value })}
                            className="w-full p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white text-sm focus:border-primary/50 outline-none"
                            placeholder="Attribution (e.g., Dr. Jane Smith, CEO)"
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() => {
                                    saveContentBlockEdit(block.id, editingBlockData);
                                    setEditingBlockData(null);
                                }}
                                className="bg-success text-white"
                            >
                                <Check className="w-4 h-4 mr-1" />
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    cancelContentBlockEdit(block.id);
                                    setEditingBlockData(null);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                );

            case "checklist":
                return (
                    <div className="space-y-3">
                        {tempData.map((item: string, idx: number) => (
                            <input
                                key={idx}
                                type="text"
                                value={item}
                                onChange={(e) => {
                                    const newData = [...tempData];
                                    newData[idx] = e.target.value;
                                    setEditingBlockData(newData);
                                }}
                                className="w-full p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white text-sm focus:border-primary/50 outline-none"
                                placeholder={`Action item ${idx + 1}`}
                            />
                        ))}
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() => {
                                    saveContentBlockEdit(block.id, editingBlockData);
                                    setEditingBlockData(null);
                                }}
                                className="bg-success text-white"
                            >
                                <Check className="w-4 h-4 mr-1" />
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    cancelContentBlockEdit(block.id);
                                    setEditingBlockData(null);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-4">
                        <p className="text-foreground-muted text-sm">Editing not yet implemented for this block type</p>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                cancelContentBlockEdit(block.id);
                                setEditingBlockData(null);
                            }}
                            className="mt-3"
                        >
                            Close
                        </Button>
                    </div>
                );
        }
    };

    // Handle video upload
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("video/")) {
            showToast("Please upload a valid video file", "error");
            return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        // Create video element to extract metadata
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = () => {
            setVideoData({
                file,
                preview: previewUrl,
                duration: Math.round(video.duration),
                format: file.type.split("/")[1].toUpperCase(),
                useAsHero: false,
            });
            showToast("Video uploaded successfully!");
        };

        video.src = previewUrl;
    };

    // Edit image prompt
    const editImagePrompt = (imageId: string, isHero: boolean) => {
        if (isHero && heroImage) {
            setHeroImage({ ...heroImage, editingPrompt: true });
        } else {
            setSectionImages(images =>
                images.map(img =>
                    img.id === imageId ? { ...img, editingPrompt: true } : img
                )
            );
        }
    };

    // Save edited prompt
    const saveEditedPrompt = (imageId: string, newPrompt: string, isHero: boolean) => {
        if (isHero && heroImage) {
            setHeroImage({ ...heroImage, prompt: newPrompt, editingPrompt: false });
            showToast("Hero image prompt updated!");
        } else {
            setSectionImages(images =>
                images.map(img =>
                    img.id === imageId ? { ...img, prompt: newPrompt, editingPrompt: false } : img
                )
            );
            showToast("Section image prompt updated!");
        }
    };

    // Save all progress (including images)
    const handleSaveProgress = () => {
        seoStorage.saveStep7({
            heroImage: heroImage ? { ...heroImage, imageData: undefined } : null,
            heroImageId: heroImage?.id,
            heroImageData: heroImage?.imageData,
            sectionImages: sectionImages.map(img => ({ ...img, imageData: undefined })),
            sectionImageIds: sectionImages.map(img => img.id),
            sectionImagesData: sectionImages.map(img => img.imageData),
            contentBlocks,
            typography,
            selectedColor,
            videoData: {
                ...videoData,
                file: null, // Don't save file object
                preview: null, // Don't save preview URL
            },
            timestamp: new Date().toISOString(),
        });

        showToast("Progress saved with all images!");
    };

    // Get block icon
    const getBlockIcon = (type: string) => {
        switch (type) {
            case "callout": return Lightbulb;
            case "quote": return MessageSquare;
            case "stats": return BarChart3;
            case "checklist": return CheckSquare;
            case "comparison": return Package;
            case "faq": return Lightbulb;
            default: return Package;
        }
    };

    // Render content block preview
    const renderBlockPreview = (block: ContentBlock) => {
        if (!block.data) {
            return <p className="text-foreground-muted text-sm">No content extracted yet</p>;
        }

        switch (block.type) {
            case "callout":
                return (
                    <div className="p-4 rounded-lg bg-primary/5 border-l-4 border-primary">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-white text-sm leading-relaxed">{block.data}</p>
                        </div>
                    </div>
                );

            case "quote":
                return (
                    <div className="p-4 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <MessageSquare className="w-6 h-6 text-primary mb-3" />
                        <blockquote className="text-white text-base italic mb-2">
                            "{block.data.quote}"
                        </blockquote>
                        <p className="text-foreground-muted text-sm">— {block.data.attribution}</p>
                    </div>
                );

            case "stats":
                return (
                    <div className="grid grid-cols-3 gap-3">
                        {block.data.map((stat: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-info/5 border border-primary/20 text-center">
                                <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
                                <p className="text-xs text-foreground-muted">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                );

            case "checklist":
                return (
                    <div className="space-y-2">
                        {block.data.map((item: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <CheckSquare className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                                <p className="text-white text-sm">{item}</p>
                            </div>
                        ))}
                    </div>
                );

            case "comparison":
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-error font-semibold text-sm mb-3 flex items-center gap-2">
                                <X className="w-4 h-4" />
                                Before
                            </p>
                            {block.data.before.map((item: string, idx: number) => (
                                <div key={idx} className="p-3 rounded-lg bg-error/5 border border-error/20">
                                    <p className="text-white text-sm">{item}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <p className="text-success font-semibold text-sm mb-3 flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                After
                            </p>
                            {block.data.after.map((item: string, idx: number) => (
                                <div key={idx} className="p-3 rounded-lg bg-success/5 border border-success/20">
                                    <p className="text-white text-sm">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "faq":
                return (
                    <div className="space-y-3">
                        {block.data.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                                <p className="text-primary font-semibold text-sm mb-2">{item.question}</p>
                                <p className="text-white text-sm leading-relaxed">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                );

            default:
                return <p className="text-foreground-muted text-sm">Preview not available</p>;
        }
    };

    // Auto-trigger content block extraction on first visit
    useEffect(() => {
        let isMounted = true;

        const autoExtract = async () => {
            // Only auto-extract if we have article data and haven't extracted yet
            if (article && title && !hasExtractedBlocks && !isExtractingBlocks) {
                const step7Data = seoStorage.getStep7();
                // Only extract if no saved content blocks exist
                if (!step7Data?.contentBlocks) {
                    // Wait a bit to ensure the page has loaded
                    setTimeout(() => {
                        if (isMounted) {
                            handleExtractContentBlocks();
                        }
                    }, 500);
                }
            }
        };

        autoExtract();

        return () => {
            isMounted = false;
        };
    }, [article, title]);

    // Auto-save content blocks when they change
    useEffect(() => {
        if (hasExtractedBlocks && contentBlocks.some(block => block.data)) {
            seoStorage.saveStep7({
                heroImage: heroImage ? { ...heroImage, imageData: undefined } : null,
                heroImageId: heroImage?.id,
                heroImageData: heroImage?.imageData,
                sectionImages: sectionImages.map(img => ({ ...img, imageData: undefined })),
                sectionImageIds: sectionImages.map(img => img.id),
                sectionImagesData: sectionImages.map(img => img.imageData),
                contentBlocks,
                typography,
                selectedColor,
                videoData: {
                    ...videoData,
                    file: null,
                    preview: null,
                },
                timestamp: new Date().toISOString(),
            });
        }
    }, [contentBlocks]);

    return (
        <StepErrorBoundary>
            <div className="space-y-8 max-w-5xl mx-auto">
                {/* Toast Notification */}
                <AnimatePresence>
                    {toast.show && (
                        <motion.div
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -100 }}
                            className="fixed top-4 right-4 z-50"
                        >
                            <div className={`px-6 py-4 rounded-xl shadow-lg border ${toast.type === "success"
                                    ? "bg-success/10 border-success/30 text-success"
                                    : "bg-error/10 border-error/30 text-error"
                                }`}>
                                <div className="flex items-center gap-2">
                                    {toast.type === "success" ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <X className="w-5 h-5" />
                                    )}
                                    <p className="font-semibold">{toast.message}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


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
                            <span className="relative z-10">7</span>
                        </motion.div>
                        <div className="h-2 flex-1 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-full overflow-hidden border border-white/10 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary via-info to-primary rounded-full relative"
                                initial={{ width: 0 }}
                                animate={{ width: "87.5%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                        </div>
                        <span className="text-sm text-foreground-muted font-semibold">Step 7 of 8</span>
                    </div>

                    {/* Title */}
                    <div>
                        <Link href="/admin/seo/articles/new/step-6-optimize" className="text-sm text-primary hover:text-info transition-colors mb-2 inline-flex items-center gap-1 group">
                            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to Step 6
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
                            Styling & Media
                        </h1>
                        <p className="text-foreground-muted text-lg">
                            Visual styling, AI-generated images, content blocks, and typography
                        </p>
                    </div>
                </motion.div>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.3 }}
                    className="mb-6"
                >
                    <div className="bg-gradient-to-r from-success/10 to-primary/10 border border-success/30 rounded-lg p-4 flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="text-white font-semibold mb-1">🎨 Nano Banana Image Generation</p>
                            <p className="text-foreground-muted">
                                Powered by <strong>Google's Gemini Nano Banana</strong> - generating high-quality 2K images with your Matrix green (#00FF41) and aqua cyan (#22D3EE) color scheme automatically enforced. Images include SynthID watermark for authenticity.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Image Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
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
                                <ImageIcon className="w-6 h-6 text-primary" />
                                Hero Image
                            </CardTitle>
                            <CardDescription>Generate stunning hero images with Google's Nano Banana AI (Matrix green color scheme enforced)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <div className="aspect-video rounded-xl border border-white/10 overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] relative">
                                {!heroImage ? (
                                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                        <ImageIcon className="w-16 h-16 text-primary mb-3" />
                                        <p className="text-white font-medium mb-2">No hero image generated yet</p>
                                        <p className="text-sm text-foreground-muted">Click below to generate with Nano Banana</p>
                                    </div>
                                ) : heroImage.imageData ? (
                                    // Display actual generated image from Nano Banana
                                    <div className="h-full relative group">
                                        <img
                                            src={heroImage.imageData}
                                            alt={heroImage.suggestedAlt}
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-semibold bg-success/80 text-white border border-success backdrop-blur-sm">
                                            ✓ Generated with Nano Banana
                                        </span>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-xs text-white/80 mb-1">Alt Text:</p>
                                            <p className="text-sm text-white">{heroImage.suggestedAlt}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full p-6 flex flex-col justify-center">
                                        <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-semibold bg-primary/20 text-primary border border-primary/30">
                                            HERO
                                        </span>

                                        {heroImage.editingPrompt ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    className="w-full h-32 p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white text-sm resize-none focus:border-primary/50 outline-none"
                                                    defaultValue={heroImage.prompt}
                                                    id={`hero-prompt-edit`}
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            const textarea = document.getElementById(`hero-prompt-edit`) as HTMLTextAreaElement;
                                                            saveEditedPrompt("hero", textarea.value, true);
                                                        }}
                                                        className="bg-success text-white"
                                                    >
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setHeroImage({ ...heroImage, editingPrompt: false })}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs text-foreground-muted mb-1 flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3" />
                                                            Generated Prompt
                                                        </p>
                                                        <p className="text-sm text-white leading-relaxed">{heroImage.prompt}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-foreground-muted mb-1">Suggested Alt Text</p>
                                                        <p className="text-sm text-info">{heroImage.suggestedAlt}</p>
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-2 right-2 flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => editImagePrompt("hero", true)}
                                                        className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white hover:border-primary/30 transition-all flex items-center gap-1"
                                                    >
                                                        <Edit3 className="w-3 h-3" />
                                                        Edit
                                                    </motion.button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {!heroImage && (
                                <div className="text-center">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={handleGenerateHeroImage}
                                            disabled={isGeneratingHero}
                                            className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {isGeneratingHero ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-5 h-5" />
                                                        Generate Hero Image
                                                    </>
                                                )}
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
                            )}
                        </CardContent>

                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Card>
                </motion.div>

                {/* Section Images (3 images) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
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
                                <ImageIcon className="w-6 h-6 text-primary" />
                                Section Images (Up to 3)
                            </CardTitle>
                            <CardDescription>AI-generated section images with Nano Banana - Automatically placed after key headings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <div className="grid gap-4 sm:grid-cols-3">
                                {sectionImages.length === 0 ? (
                                    <>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="aspect-video rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] flex flex-col items-center justify-center p-4 text-center">
                                                <ImageIcon className="w-10 h-10 text-primary mb-2" />
                                                <p className="text-xs text-foreground-muted">Section {i}</p>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    sectionImages.map((img, index) => (
                                        <div key={img.id} className="aspect-video rounded-xl border border-success/30 bg-gradient-to-br from-white/5 to-white/[0.02] relative overflow-hidden group">
                                            {img.imageData ? (
                                                // Display actual generated image
                                                <>
                                                    <img
                                                        src={img.imageData}
                                                        alt={img.suggestedAlt}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold bg-success/80 text-white border border-success backdrop-blur-sm">
                                                        Section {index + 1}
                                                    </span>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-xs text-white/60">Insert after:</p>
                                                        <p className="text-xs text-white font-semibold line-clamp-1">{img.insertAfter}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                // Fallback to prompt display
                                                <div className="p-3 h-full relative">
                                                    <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold bg-info/20 text-info border border-info/30">
                                                        Section {index + 1}
                                                    </span>

                                                    {img.editingPrompt ? (
                                                        <div className="space-y-2 mt-6">
                                                            <textarea
                                                                className="w-full h-20 p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white text-xs resize-none focus:border-primary/50 outline-none"
                                                                defaultValue={img.prompt}
                                                                id={`section-prompt-${img.id}`}
                                                            />
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const textarea = document.getElementById(`section-prompt-${img.id}`) as HTMLTextAreaElement;
                                                                        saveEditedPrompt(img.id, textarea.value, false);
                                                                    }}
                                                                    className="bg-success text-white text-xs px-2 py-1 h-auto"
                                                                >
                                                                    <Check className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setSectionImages(images =>
                                                                            images.map(i => i.id === img.id ? { ...i, editingPrompt: false } : i)
                                                                        );
                                                                    }}
                                                                    className="text-xs px-2 py-1 h-auto"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-6 space-y-2">
                                                            <div>
                                                                <p className="text-xs text-foreground-muted">After:</p>
                                                                <p className="text-xs font-semibold text-white line-clamp-1">{img.insertAfter}</p>
                                                            </div>
                                                            <p className="text-xs text-white/80 line-clamp-3">{img.prompt}</p>
                                                            <div className="absolute bottom-2 right-2">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => editImagePrompt(img.id, false)}
                                                                    className="text-xs px-2 py-1 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white hover:border-primary/30 transition-all flex items-center gap-1"
                                                                >
                                                                    <Edit3 className="w-3 h-3" />
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {sectionImages.length === 0 && (
                                <div className="text-center pt-2">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={handleGenerateAllImages}
                                            disabled={isGeneratingSection || sections.length === 0}
                                            className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {isGeneratingSection ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ImageIcon className="w-5 h-5" />
                                                        Generate All Section Images
                                                    </>
                                                )}
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
                                    {sections.length === 0 && (
                                        <p className="text-xs text-foreground-muted mt-2">No sections found in article</p>
                                    )}
                                </div>
                            )}
                        </CardContent>

                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Card>
                </motion.div>

                {/* Content Blocks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
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
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Package className="w-6 h-6 text-primary" />
                                        AI Content Blocks
                                    </CardTitle>
                                    <CardDescription>AI-extracted content blocks enhance your article</CardDescription>
                                </div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        onClick={handleExtractContentBlocks}
                                        disabled={isExtractingBlocks}
                                        size="sm"
                                        className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold"
                                    >
                                        {isExtractingBlocks ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                {hasExtractedBlocks ? "Regenerate" : "Extract Blocks"}
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            {isExtractingBlocks && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-info/5 border border-primary/20 mb-4 text-center"
                                >
                                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                                    <p className="text-white font-semibold mb-1">Analyzing article for content blocks...</p>
                                    <p className="text-foreground-muted text-sm">Claude is extracting key insights, quotes, stats, and more</p>
                                </motion.div>
                            )}

                            {!isExtractingBlocks && hasExtractedBlocks && (
                                <div className="space-y-4">
                                    {contentBlocks.map((block, index) => {
                                        const BlockIcon = getBlockIcon(block.type);

                                        return (
                                            <motion.div
                                                key={block.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                                className={`p-4 rounded-xl border transition-all ${block.enabled
                                                        ? "bg-gradient-to-br from-primary/10 to-info/5 border-primary/30"
                                                        : "bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10"
                                                    }`}
                                            >
                                                {/* Block Header */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <BlockIcon className={`w-5 h-5 ${block.enabled ? "text-primary" : "text-foreground-muted"}`} />
                                                        <span className={`text-sm font-semibold ${block.enabled ? "text-white" : "text-foreground-muted"}`}>
                                                            {block.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {block.enabled && !block.editing && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => editContentBlock(block.id)}
                                                                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                                                                title="Edit content"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </motion.button>
                                                        )}
                                                        <button
                                                            onClick={() => toggleContentBlock(block.id)}
                                                            className={`w-10 h-5 rounded-full transition-colors ${block.enabled ? "bg-primary" : "bg-white/10"
                                                                }`}
                                                        >
                                                            <motion.div
                                                                className="w-4 h-4 mt-0.5 rounded-full bg-white"
                                                                animate={{
                                                                    x: block.enabled ? 20 : 2
                                                                }}
                                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Block Content */}
                                                {block.enabled && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-3"
                                                    >
                                                        {block.editing ? renderBlockEditor(block) : renderBlockPreview(block)}
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {!isExtractingBlocks && !hasExtractedBlocks && (
                                <div className="text-center py-8">
                                    <Package className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                                    <p className="text-white font-semibold mb-2">No content blocks extracted yet</p>
                                    <p className="text-foreground-muted text-sm mb-4">Click "Extract Blocks" to let AI analyze your article</p>
                                </div>
                            )}
                        </CardContent>

                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Card>
                </motion.div>

                {/* Typography Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
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
                                <Type className="w-6 h-6 text-primary" />
                                Typography
                            </CardTitle>
                            <CardDescription>Font settings for this article (saved automatically)</CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    whileHover={{ scale: 1.03 }}
                                    className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-primary/30"
                                >
                                    <p className="text-xs text-foreground-muted mb-2">Headings</p>
                                    <p className="text-white font-bold text-lg" style={{ fontFamily: typography.headingFont }}>
                                        {typography.headingFont}
                                    </p>
                                    <p className="text-xs text-primary mt-2">Active</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{ scale: 1.03 }}
                                    className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-primary/30"
                                >
                                    <p className="text-xs text-foreground-muted mb-2">Body</p>
                                    <p className="text-white" style={{ fontFamily: typography.bodyFont }}>
                                        {typography.bodyFont}
                                    </p>
                                    <p className="text-xs text-primary mt-2">Active</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ scale: 1.03 }}
                                    className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-primary/30"
                                >
                                    <p className="text-xs text-foreground-muted mb-2">Code</p>
                                    <p className="text-white font-mono" style={{ fontFamily: typography.codeFont }}>
                                        {typography.codeFont}
                                    </p>
                                    <p className="text-xs text-primary mt-2">Active</p>
                                </motion.div>
                            </div>
                        </CardContent>

                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Card>
                </motion.div>

                {/* Color Theme */}
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

                        <CardHeader className="relative z-10">
                            <CardTitle className="text-white flex items-center gap-2">
                                <Palette className="w-6 h-6 text-primary" />
                                Color Accents
                            </CardTitle>
                            <CardDescription>Choose accent color for this article (default: Matrix Green)</CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex gap-3 flex-wrap">
                                {[
                                    { name: "Matrix Green", color: "#00FF41" },
                                    { name: "Aqua Cyan", color: "#22D3EE" },
                                    { name: "Warning", color: "#FBBF24" },
                                    { name: "Purple", color: "#A855F7" },
                                ].map((accent, index) => (
                                    <motion.button
                                        key={accent.name}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setSelectedColor(accent.color);
                                            showToast(`Color changed to ${accent.name}!`);
                                        }}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selectedColor === accent.color
                                                ? "border-primary/50 bg-primary/10"
                                                : "border-white/10 hover:border-primary/30 bg-gradient-to-br from-white/5 to-white/[0.02]"
                                            }`}
                                    >
                                        <div className="relative">
                                            <div
                                                className="w-10 h-10 rounded-full"
                                                style={{ backgroundColor: accent.color }}
                                            />
                                            {selectedColor === accent.color && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                                                >
                                                    <Check className="w-3 h-3 text-background" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <span className={`text-xs font-semibold ${selectedColor === accent.color ? "text-primary" : "text-foreground-muted"}`}>
                                            {accent.name}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </CardContent>

                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Card>
                </motion.div>

                {/* Video Upload */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
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
                                <Video className="w-6 h-6 text-primary" />
                                Video Upload (Optional)
                            </CardTitle>
                            <CardDescription>Upload a custom video for your article hero</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="hidden"
                            />

                            {videoData.preview ? (
                                <div className="space-y-4">
                                    <div className="aspect-video rounded-xl overflow-hidden bg-black border border-success/30">
                                        <video
                                            src={videoData.preview}
                                            controls
                                            className="w-full h-full object-contain"
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                                        >
                                            <p className="text-xs text-foreground-muted mb-1">Duration</p>
                                            <p className="text-white font-semibold">{videoData.duration}s</p>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                                        >
                                            <p className="text-xs text-foreground-muted mb-1">Format</p>
                                            <p className="text-white font-semibold">{videoData.format}</p>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                                        >
                                            <p className="text-xs text-foreground-muted mb-1">Use as Hero</p>
                                            <button
                                                onClick={() => {
                                                    setVideoData({ ...videoData, useAsHero: !videoData.useAsHero });
                                                    showToast(
                                                        !videoData.useAsHero
                                                            ? "Video will be used as hero media"
                                                            : "Video will not be used as hero media"
                                                    );
                                                }}
                                                className={`w-10 h-5 rounded-full transition-colors ${videoData.useAsHero ? "bg-primary" : "bg-white/10"
                                                    }`}
                                            >
                                                <motion.div
                                                    className="w-4 h-4 mt-0.5 rounded-full bg-white"
                                                    animate={{
                                                        x: videoData.useAsHero ? 20 : 2
                                                    }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            </button>
                                        </motion.div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => videoInputRef.current?.click()}
                                            className="border-white/10 text-white hover:bg-white/5"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Replace Video
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setVideoData({
                                                    file: null,
                                                    preview: null,
                                                    duration: 0,
                                                    format: "",
                                                    useAsHero: false,
                                                });
                                                showToast("Video removed");
                                            }}
                                            className="border-error/30 text-error hover:bg-error/10"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    onClick={() => videoInputRef.current?.click()}
                                    className="aspect-video rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-primary/30 transition-all cursor-pointer"
                                >
                                    <Video className="w-20 h-20 text-primary" />
                                    <div className="text-center">
                                        <p className="text-white font-semibold">No video uploaded</p>
                                        <p className="text-sm text-foreground-muted mt-1">Click to upload a video file</p>
                                    </div>
                                    <Button className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Video
                                    </Button>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 rounded-xl bg-info/5 border border-info/20"
                            >
                                <p className="text-sm text-info flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" />
                                    Supported formats: MP4, WebM, MOV. Max file size: 50MB
                                </p>
                            </motion.div>
                        </CardContent>

                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Card>
                </motion.div>

                {/* Voice Feedback */}
                <VoiceFeedback
                    title="Feedback on Styling"
                    description="Record your feedback to adjust images, blocks, or styling"
                />

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center justify-between pt-4 border-t border-white/10"
                >
                    <Link href="/admin/seo/articles/new/step-6-optimize">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all">
                            <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
                            Back to Step 6
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleSaveProgress}
                                variant="secondary"
                                className="bg-gradient-to-br from-white/5 to-white/[0.02] text-white hover:from-white/10 hover:to-white/5 border border-white/10"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Progress
                            </Button>
                        </motion.div>
                        <Link href="/admin/seo/articles/new/step-8-publish">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    className="bg-gradient-to-r from-primary to-info text-background hover:shadow-lg hover:shadow-primary/50 font-bold relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Continue to Publish
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
                        </Link>
                    </div>
                </motion.div>
            </div>
        </StepErrorBoundary>
    );
}
