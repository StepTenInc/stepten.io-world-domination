#!/usr/bin/env python3
"""Generate hero images for Clark articles using Nano Banana Pro."""

import os
import sys
import base64
import subprocess
import time

# Clark article slugs and their descriptions for prompts
CLARK_ARTICLES = [
    ("building-shoreagents-pricing-calculator", "Backend developer building a complex pricing calculator, multiple monitors showing code and spreadsheets"),
    ("google-workspace-51-api-scopes", "Developer managing Google API permissions, 51 scopes displayed on holographic screens"),
    ("xero-api-integration-finance", "Backend engineer connecting financial systems, Xero and accounting dashboards"),
    ("database-design-bpo-operations", "Database architect designing schema, ER diagrams and tables floating"),
    ("individual-sa-per-person-employment", "Tech lead implementing employee management system, profiles and data"),
    ("security-philosophy-credential-management", "Security-focused developer managing API keys, vaults and encryption"),
    ("postgresql-semantic-search-brain", "Developer building AI brain with PostgreSQL, vector embeddings visualized"),
    ("how-i-audit-a-codebase", "Code auditor reviewing massive codebase, files and functions analyzed"),
    ("content-engine-database-schema", "Backend dev designing content engine, database schema diagrams"),
    ("supabase-vs-postgresql-when-to-use", "Developer choosing between Supabase and PostgreSQL, comparison on screens"),
    ("logging-that-actually-helps", "Developer debugging at 3am, log entries streaming across screens"),
    ("api-versioning-without-tears", "API architect managing version transitions, v1 v2 v3 endpoints"),
    ("background-jobs-done-right", "Backend engineer managing job queues, processing status dashboards"),
    ("caching-strategies-that-work", "Developer implementing cache layers, Redis and memory visualized"),
    ("typescript-strict-mode-why-it-matters", "TypeScript developer enabling strict mode, type errors highlighted"),
    ("migration-scripts-without-breaking-prod", "DevOps engineer running database migrations carefully"),
    ("api-rate-limiting-patterns", "Backend dev implementing rate limits, request counters"),
    ("debugging-production-issues-remotely", "Developer debugging production from laptop, trace logs"),
    ("docker-compose-local-dev-setup", "Developer setting up Docker containers, compose files"),
    ("git-branching-strategy-for-solo-devs", "Solo developer managing git branches, merge visualization"),
    ("environment-variables-secrets-management", "Security engineer managing env vars and secrets"),
    ("error-handling-patterns-typescript", "Developer implementing error handling, try-catch patterns"),
    ("testing-strategy-when-time-is-limited", "Developer writing strategic tests, test coverage displayed"),
    ("code-review-checklist-backend", "Tech lead reviewing pull requests, checklist items"),
]

# Base prompt style
STYLE = """GTA V comic book art style, 16:9 cinematic, matrix green code rain in background, dark cyberpunk atmosphere, neon purple and green accents, Filipino male backend developer character - Clark Singh, wearing glasses, black t-shirt, serious focused expression, professional tech environment"""

def generate_hero(slug: str, scene: str):
    """Generate a single hero image."""
    prompt = f"{STYLE}. Scene: {scene}"
    filename = f"/tmp/clark-hero-{slug}.png"
    
    cmd = [
        "uv", "run",
        "/opt/homebrew/lib/node_modules/clawdbot/skills/nano-banana-pro/scripts/generate_image.py",
        "--prompt", prompt,
        "--filename", filename,
        "--resolution", "1K"
    ]
    
    print(f"\n=== Generating: {slug} ===")
    print(f"Prompt: {scene[:60]}...")
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"✅ Generated: {filename}")
        return filename
    else:
        print(f"❌ Failed: {result.stderr}")
        return None

def main():
    print(f"Generating {len(CLARK_ARTICLES)} Clark hero images...")
    
    generated = []
    failed = []
    
    for slug, scene in CLARK_ARTICLES:
        result = generate_hero(slug, scene)
        if result:
            generated.append((slug, result))
        else:
            failed.append(slug)
        
        # Rate limit
        time.sleep(2)
    
    print(f"\n=== SUMMARY ===")
    print(f"Generated: {len(generated)}")
    print(f"Failed: {len(failed)}")
    
    if failed:
        print(f"Failed slugs: {failed}")
    
    # Output paths for upload
    print("\n=== GENERATED FILES ===")
    for slug, path in generated:
        print(f"{slug}: {path}")

if __name__ == "__main__":
    main()
