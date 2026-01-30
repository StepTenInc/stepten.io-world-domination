import { useEffect, useRef } from 'react';
import { seoStorage } from '@/lib/seo-storage';

/**
 * Auto-save hook with debouncing
 * Automatically saves data to localStorage after a delay
 *
 * @param stepNumber - The step number (1-8)
 * @param data - The data to save
 * @param delay - Debounce delay in milliseconds (default: 1000ms)
 * @param enabled - Whether auto-save is enabled (default: true)
 */
export function useAutoSave(
    stepNumber: number,
    data: any,
    delay: number = 1000,
    enabled: boolean = true
) {
    const timeoutRef = useRef<NodeJS.Timeout>(null);
    const previousDataRef = useRef<string>(undefined);

    useEffect(() => {
        if (!enabled || !data) return;

        // Convert data to string for comparison
        const dataString = JSON.stringify(data);

        // Skip if data hasn't changed
        if (dataString === previousDataRef.current) {
            return;
        }

        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for debounced save
        timeoutRef.current = setTimeout(() => {
            try {
                seoStorage.autoSave(stepNumber, data);
                previousDataRef.current = dataString;
                console.log(`[AutoSave] Step ${stepNumber} data saved automatically`);
            } catch (error) {
                console.error(`[AutoSave] Failed to save Step ${stepNumber}:`, error);
            }
        }, delay);

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [stepNumber, data, delay, enabled]);
}

/**
 * Manual save function
 * For immediate saves without debouncing (e.g., on button click)
 */
export function manualSave(stepNumber: number, data: any): boolean {
    try {
        seoStorage.autoSave(stepNumber, data);
        console.log(`[ManualSave] Step ${stepNumber} data saved`);
        return true;
    } catch (error) {
        console.error(`[ManualSave] Failed to save Step ${stepNumber}:`, error);
        return false;
    }
}
