// Sentry configuration for Next.js
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Set sample rate for performance monitoring
    // Adjust based on traffic volume (1.0 = 100%)
    tracesSampleRate: 1.0,

    // Only enable debug in development
    debug: process.env.NODE_ENV === "development",

    // Disable Sentry in development by default
    enabled: process.env.NODE_ENV === "production",

    // Set environment
    environment: process.env.NODE_ENV,

    // Capture unhandled promise rejections
    integrations: [
        Sentry.captureConsoleIntegration({
            levels: ["error", "warn"],
        }),
    ],

    // Filter out noisy errors
    beforeSend(event, hint) {
        // Ignore network errors from ad blockers
        if (event.exception?.values?.[0]?.value?.includes("Failed to fetch")) {
            return null;
        }
        return event;
    },
});
