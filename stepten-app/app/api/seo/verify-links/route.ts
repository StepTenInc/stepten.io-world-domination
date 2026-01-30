import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { links } = await request.json();

        if (!links || !Array.isArray(links)) {
            return NextResponse.json(
                { error: "Links array is required" },
                { status: 400 }
            );
        }

        // Verify each link in parallel with retry logic
        const verificationPromises = links.map(async (link) => {
            // Try HEAD first, fallback to GET if HEAD fails
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                // Try HEAD request first
                let response = await fetch(link.url, {
                    method: "HEAD",
                    signal: controller.signal,
                    redirect: "follow",
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; StepTen/1.0; +https://stepten.io)',
                    },
                });

                clearTimeout(timeoutId);

                // If HEAD fails with 405 (Method Not Allowed) or 403, try GET
                if (!response.ok && (response.status === 405 || response.status === 403)) {
                    console.log(`HEAD failed for ${link.url}, trying GET`);
                    const controller2 = new AbortController();
                    const timeoutId2 = setTimeout(() => controller2.abort(), 10000);

                    response = await fetch(link.url, {
                        method: "GET",
                        signal: controller2.signal,
                        redirect: "follow",
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (compatible; StepTen/1.0; +https://stepten.io)',
                        },
                    });

                    clearTimeout(timeoutId2);
                }

                const isWorking = response.ok && response.status < 400;

                return {
                    ...link,
                    verified: isWorking,
                    status: response.status,
                    finalUrl: response.url, // After redirects
                };
            } catch (error: any) {
                console.error(`Link verification failed for ${link.url}:`, error.message);

                // Don't mark as broken if it's a CORS or network error
                // These might work for users but not from server
                const isCORSOrNetwork = error.message.includes('CORS') ||
                                       error.message.includes('network') ||
                                       error.name === 'TypeError';

                return {
                    ...link,
                    verified: isCORSOrNetwork ? null : false, // null = unknown (might work for users)
                    status: null,
                    error: error.name === "AbortError" ? "Timeout (may still be valid)" : error.message,
                };
            }
        });

        const verifiedLinks = await Promise.all(verificationPromises);

        return NextResponse.json({
            verifiedLinks,
            summary: {
                total: links.length,
                verified: verifiedLinks.filter((l) => l.verified).length,
                broken: verifiedLinks.filter((l) => !l.verified).length,
            },
            success: true,
        });
    } catch (error: any) {
        console.error("Link verification error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to verify links",
                success: false,
            },
            { status: 500 }
        );
    }
}
