import { seoStorage } from "@/lib/seo-storage";

interface StepValidation {
    canAccess: boolean;
    redirectTo?: string;
    reason?: string;
}

export const stepRoutes: Record<number, string> = {
    1: "/admin/seo/articles/new/step-1-idea",
    2: "/admin/seo/articles/new/step-2-research",
    3: "/admin/seo/articles/new/step-3-framework",
    4: "/admin/seo/articles/new/step-4-writing",
    5: "/admin/seo/articles/new/step-5-humanize",
    6: "/admin/seo/articles/new/step-6-optimize",
    7: "/admin/seo/articles/new/step-7-styling",
    8: "/admin/seo/articles/new/step-8-publish",
};

export function validateStepAccess(targetStep: number): StepValidation {
    const data = seoStorage.getArticleData();

    if (targetStep >= 2 && !data.step1?.ideaText) {
        return {
            canAccess: false,
            redirectTo: stepRoutes[1],
            reason: "Please provide an article idea first.",
        };
    }

    if (targetStep >= 3 && !data.step2?.versions?.original) {
        return {
            canAccess: false,
            redirectTo: stepRoutes[2],
            reason: "Complete research before creating the framework.",
        };
    }

    if (targetStep >= 4 && !data.step3) {
        return {
            canAccess: false,
            redirectTo: stepRoutes[3],
            reason: "Generate the framework before writing the article.",
        };
    }

    if (targetStep >= 5 && !(data.step4?.original || data.step4?.revised)) {
        return {
            canAccess: false,
            redirectTo: stepRoutes[4],
            reason: "Write the article before humanizing it.",
        };
    }

    if (targetStep >= 6 && !data.step5?.humanized) {
        return {
            canAccess: false,
            redirectTo: stepRoutes[5],
            reason: "Humanize the article before SEO optimization.",
        };
    }

    if (targetStep >= 7 && (!data.step5?.humanized || !data.step6?.seoChecks)) {
        return {
            canAccess: false,
            redirectTo: stepRoutes[6],
            reason: "Complete SEO optimization before styling.",
        };
    }

    if (targetStep >= 8 && !data.step6?.seoChecks) {
        return {
            canAccess: false,
            redirectTo: stepRoutes[6],
            reason: "Complete SEO optimization before publishing.",
        };
    }

    return { canAccess: true };
}
