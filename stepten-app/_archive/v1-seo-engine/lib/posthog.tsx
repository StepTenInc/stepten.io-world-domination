"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

/**
 * PostHog Analytics Provider
 * Wraps the app to enable analytics tracking
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Only initialize in browser and if key is set
        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                api_host:
                    process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
                // Capture pageviews automatically
                capture_pageview: true,
                // Capture pageleaves for session analysis
                capture_pageleave: true,
                // Disable in development
                loaded: (posthog) => {
                    if (process.env.NODE_ENV === "development") {
                        posthog.opt_out_capturing();
                    }
                },
            });
        }
    }, []);

    // Only wrap with provider if PostHog is available
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        return <>{children}</>;
    }

    return <PHProvider client={posthog}>{children}</PHProvider>;
}

/**
 * Track custom events
 * @example trackEvent("article_published", { articleId: "123", wordCount: 1500 })
 */
export function trackEvent(
    eventName: string,
    properties?: Record<string, unknown>
) {
    if (typeof window !== "undefined" && posthog) {
        posthog.capture(eventName, properties);
    }
}

/**
 * Identify a user
 * @example identifyUser("user-123", { email: "user@example.com", plan: "pro" })
 */
export function identifyUser(
    userId: string,
    properties?: Record<string, unknown>
) {
    if (typeof window !== "undefined" && posthog) {
        posthog.identify(userId, properties);
    }
}

/**
 * Reset user identity (for logout)
 */
export function resetUser() {
    if (typeof window !== "undefined" && posthog) {
        posthog.reset();
    }
}
