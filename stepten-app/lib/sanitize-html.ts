export function sanitizeHtml(input: string): string {
    if (!input) return "";

    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
        .replace(/\son\w+=["'][^"']*["']/gi, "")
        .replace(/\son\w+=\{[^}]*\}/gi, "");
}
