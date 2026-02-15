/**
 * Centralized Error Handling Utilities
 * Provides consistent error handling and user notifications
 */

import { toast } from "sonner";
import {
    TOAST_ERROR_DURATION,
    TOAST_SUCCESS_DURATION,
    TOAST_WARNING_DURATION,
    TOAST_INFO_DURATION,
} from "./constants";

export interface ErrorContext {
    operation?: string;
    step?: number;
    userId?: string;
    timestamp?: string;
    additionalData?: Record<string, unknown>;
}

/**
 * Handles errors with proper logging and user notification
 *
 * @param error - The error object
 * @param context - Optional context information
 *
 * @example
 * try {
 *   await saveArticle();
 * } catch (error) {
 *   handleError(error, { operation: "Save Article", step: 4 });
 * }
 */
export function handleError(error: unknown, context?: ErrorContext | string): void {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    const contextStr = typeof context === "string" ? context : context?.operation;

    // Log to console with full context
    console.error(`Error${contextStr ? ` in ${contextStr}` : ""}:`, {
        message: errorMessage,
        error,
        context: typeof context === "object" ? context : undefined,
        timestamp: new Date().toISOString(),
    });

    // Show user-friendly toast notification
    toast.error(contextStr || "Error", {
        description: errorMessage,
        duration: TOAST_ERROR_DURATION,
    });
}

/**
 * Handles success notifications
 *
 * @param message - Success message title
 * @param description - Optional detailed description
 *
 * @example
 * handleSuccess("Article Saved", "Your changes have been saved successfully.");
 */
export function handleSuccess(message: string, description?: string): void {
    toast.success(message, {
        description,
        duration: TOAST_SUCCESS_DURATION,
    });
}

/**
 * Handles warning notifications
 *
 * @param message - Warning message title
 * @param description - Optional detailed description
 *
 * @example
 * handleWarning("Autosave Failed", "Your changes may not be saved. Please save manually.");
 */
export function handleWarning(message: string, description?: string): void {
    toast.warning(message, {
        description,
        duration: TOAST_WARNING_DURATION,
    });
}

/**
 * Handles info notifications
 *
 * @param message - Info message title
 * @param description - Optional detailed description
 *
 * @example
 * handleInfo("Processing", "Your article is being generated...");
 */
export function handleInfo(message: string, description?: string): void {
    toast.info(message, {
        description,
        duration: TOAST_INFO_DURATION,
    });
}

/**
 * Creates a promise-based error handler for async operations
 *
 * @param operation - The async operation to perform
 * @param context - Context for error handling
 * @returns Result of the operation or throws error
 *
 * @example
 * const result = await withErrorHandling(
 *   () => fetch('/api/save'),
 *   { operation: "Save Draft", step: 3 }
 * );
 */
export async function withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: ErrorContext | string
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        handleError(error, context);
        throw error;
    }
}

/**
 * Type guard to check if an error is a specific type
 *
 * @param error - The error to check
 * @returns True if error is an Error instance
 */
export function isError(error: unknown): error is Error {
    return error instanceof Error;
}

/**
 * Extracts error message from various error types
 *
 * @param error - The error to extract message from
 * @returns Error message string
 */
export function getErrorMessage(error: unknown): string {
    if (isError(error)) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    if (error && typeof error === "object" && "message" in error) {
        return String(error.message);
    }
    return "An unknown error occurred";
}

/**
 * Handles API response errors
 *
 * @param response - Fetch response object
 * @param context - Context for error handling
 * @throws Error if response is not OK
 */
export async function handleApiError(
    response: Response,
    context?: ErrorContext | string
): Promise<void> {
    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
            const data = await response.json();
            errorMessage = data.error || data.message || errorMessage;
        } catch {
            // Response body is not JSON, use status text
        }

        handleError(new Error(errorMessage), context);
        throw new Error(errorMessage);
    }
}
