import { NextRequest, NextResponse } from "next/server";
import CloudConvert from "cloudconvert";

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const fileType = file.name.split(".").pop()?.toLowerCase();

        let extractedText = "";

        // Handle different file types
        if (fileType === "txt" || fileType === "md") {
            // Direct text extraction for text files
            extractedText = await file.text();
        } else if (fileType === "pdf") {
            // Use CloudConvert for PDF extraction
            try {
                const buffer = Buffer.from(await file.arrayBuffer());

                // Create a job for converting PDF to TXT
                const job = await cloudConvert.jobs.create({
                    tasks: {
                        "import-file": {
                            operation: "import/upload",
                        },
                        "convert-pdf": {
                            operation: "convert",
                            input: "import-file",
                            output_format: "txt",
                            engine: "pdf2txt",
                        },
                        "export-txt": {
                            operation: "export/url",
                            input: "convert-pdf",
                        },
                    },
                });

                // Upload the file
                const uploadTask = job.tasks.filter(
                    (task) => task.name === "import-file"
                )[0];

                await cloudConvert.tasks.upload(uploadTask, buffer, file.name);

                // Wait for the job to complete
                const completedJob = await cloudConvert.jobs.wait(job.id);

                // Get the export task
                const exportTask = completedJob.tasks.filter(
                    (task) => task.name === "export-txt"
                )[0];

                // Download the converted file from the URL
                if (!exportTask.result?.files?.[0]?.url) {
                    throw new Error("No download URL available from CloudConvert");
                }

                const response = await fetch(exportTask.result.files[0].url);
                if (!response.ok) {
                    throw new Error(`Failed to download converted file: ${response.statusText}`);
                }

                extractedText = await response.text();
            } catch (cloudConvertError: any) {
                console.error("CloudConvert PDF extraction error:", cloudConvertError);

                // Fallback to pdf-parse if CloudConvert fails
                try {
                    const pdfParseModule = await import("pdf-parse");
                    const pdfParse = (pdfParseModule as any).default || pdfParseModule;
                    const buffer = Buffer.from(await file.arrayBuffer());
                    const data = await pdfParse(buffer);
                    extractedText = data.text;
                } catch (pdfError) {
                    console.error("PDF parsing fallback error:", pdfError);
                    return NextResponse.json(
                        {
                            error: "PDF extraction failed. Please try uploading as .txt or .md",
                            success: false,
                        },
                        { status: 500 }
                    );
                }
            }
        } else {
            return NextResponse.json(
                {
                    error: "Unsupported file type. Please upload .txt, .md, or .pdf",
                    success: false,
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            text: extractedText,
            metadata: {
                fileName: file.name,
                fileSize: file.size,
                fileType: fileType,
            },
            success: true,
        });
    } catch (error: any) {
        console.error("Document extraction error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to extract document text",
                success: false,
            },
            { status: 500 }
        );
    }
}
