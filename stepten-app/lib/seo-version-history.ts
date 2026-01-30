import { seoStorage } from "@/lib/seo-storage";
import type { ArticleData } from "@/lib/seo-types";

interface VersionSnapshot {
    stepNumber: number;
    timestamp: string;
    data: Partial<ArticleData>;
    label: string;
}

const STORAGE_KEY = "seo-version-history";
const MAX_SNAPSHOTS = 10;

export const versionHistory = {
    saveSnapshot(label: string, data: Partial<ArticleData>) {
        try {
            const history = this.getHistory();
            history.push({
                stepNumber: data.currentStep || 1,
                timestamp: new Date().toISOString(),
                data,
                label,
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_SNAPSHOTS)));
        } catch (error) {
            console.warn("Failed to save version snapshot:", error);
        }
    },

    getHistory(): VersionSnapshot[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.warn("Failed to load version history:", error);
            return [];
        }
    },

    restoreVersion(timestamp: string) {
        const history = this.getHistory();
        const snapshot = history.find((item) => item.timestamp === timestamp);
        if (snapshot) {
            seoStorage.saveArticleData(snapshot.data);
        }
    },
};
