import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get("audio") as File;

        if (!audioFile) {
            return NextResponse.json(
                { error: "No audio file provided" },
                { status: 400 }
            );
        }

        // Convert File to Buffer for OpenAI
        const buffer = Buffer.from(await audioFile.arrayBuffer());

        // Create a File object for OpenAI (needs name property)
        const file = new File([buffer], "audio.webm", { type: audioFile.type });

        // Transcribe using Whisper
        const transcription = await openai.audio.transcriptions.create({
            file: file,
            model: "whisper-1",
            language: "en",
            response_format: "text",
        });

        return NextResponse.json({
            text: transcription,
            success: true,
        });
    } catch (error: any) {
        console.error("Transcription error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to transcribe audio",
                success: false,
            },
            { status: 500 }
        );
    }
}
