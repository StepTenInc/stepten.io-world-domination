import { useEffect } from "react";

export function useDebouncedSave(
    callback: () => void,
    deps: any[],
    delay = 1000,
    enabled = true
) {
    useEffect(() => {
        if (!enabled) return;
        const timeout = setTimeout(() => {
            callback();
        }, delay);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, enabled, delay]);
}
