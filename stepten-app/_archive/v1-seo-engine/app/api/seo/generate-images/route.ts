import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI (Gemini) for Nano Banana image generation
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

// Brand color scheme constants
const BRAND_COLORS = {
    matrixGreen: "#00FF41",
    aquaCyan: "#22D3EE",
    colorScheme: "Matrix green (#00FF41) and aqua cyan (#22D3EE) color scheme",
    background: "Dark background with neon accents",
    aesthetic: "Modern tech aesthetic, futuristic, cyberpunk style",
};

interface Section {
    heading: string;
    content: string;
}

interface ImageGenerationRequest {
    article: string;
    title: string;
    sections: Section[];
    type?: "hero" | "section"; // Specify which type to generate
}

interface GeneratedImage {
    id: string;
    imageData: string; // base64 data URL
    prompt: string;
    suggestedAlt: string;
    insertAfter?: string;
    position: number | "hero";
}

interface ImageGenerationResponse {
    image: GeneratedImage;
    success: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const { article, title, sections, type = "hero" }: ImageGenerationRequest = await request.json();

        if (!article || !title) {
            return NextResponse.json(
                { error: "Article and title are required" },
                { status: 400 }
            );
        }

        // Initialize Nano Banana model (gemini-2.5-flash-image)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-image"
        });

        let generatedImage: GeneratedImage;

        if (type === "hero") {
            // Generate hero image
            generatedImage = await generateHeroImage(model, title, article);
        } else {
            // Generate section images (up to 3)
            const numberOfSectionImages = Math.min(sections?.length || 3, 3);
            const selectedSections = sections?.slice(0, numberOfSectionImages) || [];

            // For now, generate the first section image
            // In production, you'd want to handle multiple images in separate requests
            generatedImage = await generateSectionImage(model, selectedSections[0], article, 0);
        }

        return NextResponse.json({
            image: generatedImage,
            success: true,
        });
    } catch (error: any) {
        console.error("Image generation error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to generate image",
                success: false,
            },
            { status: 500 }
        );
    }
}

/**
 * Generate hero image using Nano Banana
 */
async function generateHeroImage(
    model: any,
    title: string,
    article: string
): Promise<GeneratedImage> {
    // Extract first 200 words for context
    const text = article.replace(/<[^>]*>/g, " ");
    const intro = text.split(/\s+/).slice(0, 200).join(" ");

    // Create detailed prompt with brand colors
    const prompt = `Create a stunning hero image for an article titled "${title}".

Context: ${intro}

Style requirements:
- ${BRAND_COLORS.colorScheme}
- ${BRAND_COLORS.background}
- ${BRAND_COLORS.aesthetic}
- High-tech, futuristic composition
- Professional, eye-catching design
- No text in the image
- Modern gradient effects with neon accents
- 16:9 aspect ratio
- Sharp, high contrast, vibrant colors`;

    console.log("Generating hero image with Nano Banana...");

    // Call Nano Banana API (correct format for @google/generative-ai)
    const result = await model.generateContent(prompt);

    // Extract base64 image data from response
    const imagePart = result.response.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData);

    if (!imagePart?.inlineData?.data) {
        throw new Error("No image data returned from Nano Banana");
    }

    // Convert to data URL
    const mimeType = imagePart.inlineData.mimeType || "image/png";
    const base64Data = imagePart.inlineData.data;
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return {
        id: "hero",
        imageData: dataUrl,
        prompt: prompt,
        suggestedAlt: `Hero image for ${title}`,
        position: "hero"
    };
}

/**
 * Generate section image using Nano Banana
 */
async function generateSectionImage(
    model: any,
    section: Section,
    article: string,
    index: number
): Promise<GeneratedImage> {
    if (!section) {
        throw new Error("Section data is required");
    }

    // Extract section content (first 150 words)
    const sectionText = section.content.replace(/<[^>]*>/g, " ");
    const context = sectionText.split(/\s+/).slice(0, 150).join(" ");

    // Create detailed prompt
    const prompt = `Create a professional section image for "${section.heading}".

Context: ${context}

Style requirements:
- ${BRAND_COLORS.colorScheme}
- ${BRAND_COLORS.background}
- ${BRAND_COLORS.aesthetic}
- Illustrate the key concept from this section
- Modern, tech-forward design
- No text in the image
- Complementary to the section content
- High contrast, vibrant neon colors
- 16:9 aspect ratio`;

    console.log(`Generating section image ${index + 1} with Nano Banana...`);

    // Call Nano Banana API (correct format for @google/generative-ai)
    const result = await model.generateContent(prompt);

    // Extract base64 image data
    const imagePart = result.response.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData);

    if (!imagePart?.inlineData?.data) {
        throw new Error("No image data returned from Nano Banana");
    }

    // Convert to data URL
    const mimeType = imagePart.inlineData.mimeType || "image/png";
    const base64Data = imagePart.inlineData.data;
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return {
        id: `section-${index}`,
        imageData: dataUrl,
        prompt: prompt,
        suggestedAlt: `Illustration for ${section.heading}`,
        insertAfter: section.heading,
        position: index + 1
    };
}
