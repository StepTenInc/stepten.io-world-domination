"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
    className?: string;
    size?: number | string;
    showText?: boolean;
    priority?: boolean;
}

/**
 * StepTen Official Logo Component
 * 
 * Renders the official 2026 StepTen brand asset (3D "S" Design).
 * Uses the scale-independent SVG file.
 */
export function Logo({
    className = "",
    size = 40,
    showText = false,
    priority = false, // Set true for LCP candidates like Navbar
}: LogoProps) {
    // Parse size to number if possible for Image width/height
    const numSize = typeof size === 'number' ? size : parseInt(String(size), 10) || 40;

    return (
        <div className={`relative inline-flex items-center gap-3 ${className}`}>
            <div className="relative">
                <Image
                    src="/logo.svg"
                    alt="StepTen Logo"
                    width={numSize}
                    height={numSize}
                    className="object-contain"
                    priority={priority}
                />

                {/* Optional: Add a subtle behind-the-scenes glow for that "neon" feel 
                    without altering the logo itself */}
                <div
                    className="absolute inset-0 bg-primary/20 blur-xl opacity-50 -z-10 rounded-full pointer-events-none"
                    style={{ transform: 'scale(0.8)' }}
                />
            </div>

            {showText && (
                <span className="text-xl font-bold tracking-tight text-white">
                    StepTen
                </span>
            )}
        </div>
    );
}
