/**
 * Draft Auto-save Hook
 * Automatically saves draft to Supabase at regular intervals
 */

import { useEffect } from "react";
import { seoStorage } from "@/lib/seo-storage";
import { AUTOSAVE_INTERVAL_MS } from "@/lib/constants";
import { handleError, handleWarning } from "@/lib/error-handler";

/**
 * Auto-saves article draft to Supabase at regular intervals
 *
 * @param intervalMs - Save interval in milliseconds (default: 60 seconds)
 * @param enabled - Whether autosave is enabled (default: true)
 *
 * @example
 * // In any step page
 * useDraftAutosave(); // Uses default 60s interval
 * useDraftAutosave(30000); // Custom 30s interval
 * useDraftAutosave(60000, false); // Disabled
 */
export function useDraftAutosave(intervalMs = AUTOSAVE_INTERVAL_MS, enabled = true) {
    useEffect(() => {
        if (!enabled || typeof window === "undefined") return;

        let failureCount = 0;
        const MAX_CONSECUTIVE_FAILURES = 3;

        const saveDraft = async () => {
            try {
                const data = seoStorage.getArticleData();
                const draftId = seoStorage.getDraftId();

                const response = await fetch("/api/articles/draft/autosave", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        draftId,
                        data,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Autosave failed: ${response.status} ${response.statusText}`);
                }

                // Reset failure count on success
                failureCount = 0;
            } catch (error) {
                failureCount++;
                console.error("Draft autosave failed:", error);

                // Only show warning after multiple consecutive failures
                if (failureCount >= MAX_CONSECUTIVE_FAILURES) {
                    handleWarning(
                        "Autosave Failed",
                        "Your changes may not be saved automatically. Please save manually or check your connection."
                    );
                    // Reset count to avoid spamming notifications
                    failureCount = 0;
                }
            }
        };

        // Initial save
        saveDraft();

        // Set up interval
        const interval = setInterval(saveDraft, intervalMs);

        // Cleanup
        return () => clearInterval(interval);
    }, [intervalMs, enabled]);
}
