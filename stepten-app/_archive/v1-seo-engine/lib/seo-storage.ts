/**
 * LocalStorage wrapper for SEO article data
 * Provides type-safe persistence during development/testing
 * WITH DATABASE BACKUP AND RESTORE
 */

import { ArticleData, ArticleIdea, ArticleResearch, ResearchVersion } from "./seo-types";
import { imageStorage } from "./image-storage";

const STORAGE_KEY = "seo-article-data";
const createDraftId = () => `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const seoStorage = {
    /**
     * Save complete article data to localStorage
     */
    saveArticleData(data: Partial<ArticleData>): void {
        try {
            const existing = this.getArticleData();
            const updated: ArticleData = {
                ...existing,
                ...data,
                lastUpdated: new Date().toISOString(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error("Failed to save article data:", error);
        }
    },

    /**
     * Get complete article data from localStorage
     */
    getArticleData(): ArticleData {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) {
                const draftId = createDraftId();
                const freshData = {
                    currentStep: 1,
                    lastUpdated: new Date().toISOString(),
                    draftId,
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
                return {
                    currentStep: 1,
                    lastUpdated: new Date().toISOString(),
                    draftId,
                };
            }
            const parsed = JSON.parse(data) as ArticleData;
            if (!parsed.draftId) {
                parsed.draftId = createDraftId();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            }
            return parsed;
        } catch (error) {
            console.error("Failed to load article data:", error);
            return {
                currentStep: 1,
                lastUpdated: new Date().toISOString(),
            };
        }
    },

    /**
     * Get or create draft ID for autosave and media storage
     */
    getDraftId(): string {
        const data = this.getArticleData();
        if (!data.draftId) {
            const draftId = createDraftId();
            this.saveArticleData({ draftId });
            return draftId;
        }
        return data.draftId;
    },

    /**
     * Restore draft from database (called on app initialization)
     */
    async restoreFromDatabase(draftId: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/articles/draft/${draftId}`);
            if (!response.ok) {
                return false;
            }

            const result = await response.json();
            if (result.draft && result.draft.data) {
                // Restore to localStorage
                localStorage.setItem(STORAGE_KEY, JSON.stringify(result.draft.data));
                console.log("✅ Draft restored from database");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to restore draft from database:", error);
            return false;
        }
    },

    /**
     * Check if localStorage is empty but database might have a backup
     */
    async checkForDatabaseBackup(): Promise<string | null> {
        try {
            const localData = localStorage.getItem(STORAGE_KEY);
            if (localData) {
                // Already have local data, no need to restore
                return null;
            }

            // Check if there's a recent draft in the database
            const response = await fetch('/api/articles/draft/recent');
            if (!response.ok) {
                return null;
            }

            const result = await response.json();
            if (result.draftId) {
                return result.draftId;
            }
            return null;
        } catch (error) {
            console.error("Failed to check for database backup:", error);
            return null;
        }
    },

    /**
     * Save Step 1 idea data
     */
    saveStep1(idea: ArticleIdea): void {
        this.saveArticleData({
            step1: idea,
            currentStep: 1,
        });
    },

    /**
     * Get Step 1 idea data
     */
    getStep1(): ArticleIdea | undefined {
        return this.getArticleData().step1;
    },

    /**
     * Save Step 2 research data (with version support)
     */
    saveStep2(research: ArticleResearch): void {
        this.saveArticleData({
            step2: research,
            currentStep: 2,
        });
    },

    /**
     * Get Step 2 research data
     */
    getStep2(): ArticleResearch | undefined {
        return this.getArticleData().step2;
    },

    /**
     * Update Step 2 with refined version
     */
    saveStep2Refined(refined: ResearchVersion, feedback: string): void {
        const current = this.getStep2();
        if (!current) return;

        this.saveStep2({
            ...current,
            versions: {
                ...current.versions,
                refined: {
                    ...refined,
                    feedback,
                },
            },
            activeVersion: "refined",
            hasRefined: true,
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Toggle active version
     */
    setStep2ActiveVersion(version: "original" | "refined"): void {
        const current = this.getStep2();
        if (!current) return;

        this.saveStep2({
            ...current,
            activeVersion: version,
        });
    },

    /**
     * Clear all article data
     */
    clearArticleData(): void {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error("Failed to clear article data:", error);
        }
    },

    /**
     * Check if article data exists
     */
    hasArticleData(): boolean {
        return localStorage.getItem(STORAGE_KEY) !== null;
    },

    /**
     * Save Step 3 framework data
     */
    saveStep3(framework: any): void {
        this.saveArticleData({
            step3: framework,
            currentStep: 3,
        });
    },

    /**
     * Get Step 3 framework data
     */
    getStep3(): any {
        return this.getArticleData().step3;
    },

    /**
     * Save Step 4 writing data
     */
    saveStep4(writing: any): void {
        this.saveArticleData({
            step4: writing,
            currentStep: 4,
        });
    },

    /**
     * Get Step 4 writing data
     */
    getStep4(): any {
        return this.getArticleData().step4;
    },

    /**
     * Save Step 5 humanization data
     */
    saveStep5(humanization: any): void {
        this.saveArticleData({
            step5: humanization,
            currentStep: 5,
        });
    },

    /**
     * Get Step 5 humanization data
     */
    getStep5(): any {
        return this.getArticleData().step5;
    },

    /**
     * Save Step 6 SEO optimization data
     */
    saveStep6(optimization: any): void {
        this.saveArticleData({
            step6: optimization,
            currentStep: 6,
        });
    },

    /**
     * Get Step 6 SEO optimization data
     */
    getStep6(): any {
        return this.getArticleData().step6;
    },

    /**
     * Save Step 7 styling data
     */
    saveStep7(styling: any): void {
        const draftId = this.getDraftId();
        const heroImageId = styling.heroImageId;
        const sectionImageIds = styling.sectionImageIds;

        if (typeof window !== "undefined") {
            if (heroImageId && styling.heroImageData) {
                imageStorage.saveImage(`${draftId}:${heroImageId}`, styling.heroImageData)
                    .catch(() => console.warn("Could not save hero image to IndexedDB"));
            }

            if (sectionImageIds && styling.sectionImagesData) {
                sectionImageIds.forEach((id: string, index: number) => {
                    const imageData = styling.sectionImagesData?.[index];
                    if (imageData) {
                        imageStorage.saveImage(`${draftId}:${id}`, imageData)
                            .catch(() => console.warn("Could not save section image to IndexedDB"));
                    }
                });
            }
        }

        // Save everything else without image data
        const stylingWithoutImages = {
            ...styling,
            heroImageData: undefined,
            sectionImagesData: undefined
        };

        this.saveArticleData({
            step7: stylingWithoutImages,
            currentStep: 7,
        });
    },

    /**
     * Get Step 7 styling data
     */
    getStep7(): any {
        return this.getArticleData().step7;
    },

    /**
     * Save Step 8 publish data
     */
    saveStep8(publish: any): void {
        this.saveArticleData({
            step8: publish,
            currentStep: 8,
        });
    },

    /**
     * Get Step 8 publish data
     */
    getStep8(): any {
        return this.getArticleData().step8;
    },

    /**
     * Auto-save helper - debounced save
     */
    autoSave(stepNumber: number, data: any): void {
        const methodName = `saveStep${stepNumber}` as keyof typeof seoStorage;
        if (typeof this[methodName] === 'function') {
            (this[methodName] as any)(data);
        }
    },

    /**
     * Save article to published articles list
     */
    savePublishedArticle(article: any): void {
        try {
            const articles = this.getAllArticles();
            const exists = articles.findIndex(a => a.slug === article.slug);

            if (exists >= 0) {
                // Update existing
                articles[exists] = { ...articles[exists], ...article, updatedAt: new Date().toISOString() };
            } else {
                // Add new
                articles.push({
                    ...article,
                    id: `article-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            }

            localStorage.setItem('seo-published-articles', JSON.stringify(articles));
        } catch (error) {
            console.error("Failed to save published article:", error);
        }
    },

    /**
     * Get all published articles
     */
    getAllArticles(): any[] {
        try {
            const data = localStorage.getItem('seo-published-articles');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Failed to load articles:", error);
            return [];
        }
    },

    /**
     * Delete an article
     */
    deleteArticle(id: string): void {
        try {
            const articles = this.getAllArticles().filter(a => a.id !== id);
            localStorage.setItem('seo-published-articles', JSON.stringify(articles));
        } catch (error) {
            console.error("Failed to delete article:", error);
        }
    },

    /**
     * Clear current draft (start new article)
     */
    clearDraft(): void {
        try {
            const data = this.getArticleData();
            const draftId = data.draftId;
            const step7 = data.step7 as any;

            if (draftId && step7?.heroImageId) {
                imageStorage.deleteImage(`${draftId}:${step7.heroImageId}`)
                    .catch(() => console.warn("Failed to clear hero image from IndexedDB"));
            }
            if (draftId && step7?.sectionImageIds) {
                step7.sectionImageIds.forEach((id: string) => {
                    imageStorage.deleteImage(`${draftId}:${id}`)
                        .catch(() => console.warn("Failed to clear section image from IndexedDB"));
                });
            }

            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem("seo-version-history");
        } catch (error) {
            console.error("Failed to clear draft:", error);
        }
    },
};
