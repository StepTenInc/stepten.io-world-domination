# 14 — Component Library

---

## Overview

All reusable components organized by type and usage. Components are shared across public, dashboard, and admin areas where applicable.

---

## Component Organization

```
components/
├── ui/                     # Base UI components (ShadCN + custom)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── tabs.tsx
│   ├── toast.tsx
│   ├── tooltip.tsx
│   ├── skeleton.tsx
│   ├── avatar.tsx
│   ├── separator.tsx
│   └── ... (other ShadCN components)
│
├── shared/                 # Shared complex components
│   ├── Logo.tsx
│   ├── ThemeProvider.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   ├── EmptyState.tsx
│   ├── ConfirmDialog.tsx
│   ├── SearchInput.tsx
│   ├── Pagination.tsx
│   ├── DataTable.tsx
│   ├── StatusBadge.tsx
│   ├── UserAvatar.tsx
│   └── FileUpload.tsx
│
├── layouts/                # Layout components
│   ├── PublicLayout.tsx
│   ├── AuthLayout.tsx
│   ├── DashboardLayout.tsx
│   ├── AdminLayout.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   ├── MobileNav.tsx
│   └── PageContainer.tsx
│
├── marketing/              # Public site components
│   ├── Hero.tsx
│   ├── FeatureGrid.tsx
│   ├── PricingCard.tsx
│   ├── TestimonialCard.tsx
│   ├── CTASection.tsx
│   ├── BusinessCard.tsx
│   ├── ProductCard.tsx
│   ├── ArticleCard.tsx
│   └── SocialLinks.tsx
│
├── dashboard/              # User dashboard components
│   ├── DashboardCard.tsx
│   ├── ProgressBar.tsx
│   ├── CourseCard.tsx
│   ├── ProductAccessCard.tsx
│   ├── BillingInfo.tsx
│   └── SettingsForm.tsx
│
├── admin/                  # Admin-only components
│   ├── StatsCard.tsx
│   ├── ChartCard.tsx
│   ├── UserTable.tsx
│   ├── ArticleTable.tsx
│   ├── LeadTable.tsx
│   └── ActivityFeed.tsx
│
├── agents/                 # AI agent components
│   ├── ChatWidget.tsx
│   ├── ChatMessage.tsx
│   ├── ChatInput.tsx
│   ├── VoiceInput.tsx
│   ├── AgentAvatar.tsx
│   ├── TypingIndicator.tsx
│   └── ConversationList.tsx
│
├── seo/                    # SEO engine components
│   ├── ArticleEditor.tsx
│   ├── ArticlePreview.tsx
│   ├── SiloVisualizer.tsx
│   ├── ResearchPanel.tsx
│   ├── KeywordInput.tsx
│   ├── ScoreCard.tsx
│   ├── LinkSuggestions.tsx
│   └── VoiceFeedback.tsx
│
├── articles/               # Article display components
│   ├── ArticleTemplate.tsx
│   ├── SiloPillarTemplate.tsx
│   ├── TableOfContents.tsx
│   ├── AuthorBox.tsx
│   ├── RelatedArticles.tsx
│   ├── ShareButtons.tsx
│   └── ArticleMeta.tsx
│
└── effects/                # Visual effects (use sparingly)
    ├── ParticleBackground.tsx
    ├── GlowOrb.tsx
    ├── AnimatedGradient.tsx
    └── ScrollReveal.tsx
```

---

## Component Rules

### 1. Before Creating a Component

```
□ Search codebase for existing similar component
□ Check if ShadCN has a base component to extend
□ Determine if component will be used in 2+ places
□ If yes → create in appropriate shared folder
□ If no → create locally in the page/feature folder
```

### 2. Component Structure

```tsx
// components/shared/StatusBadge.tsx

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// 1. Define variants using CVA
const statusBadgeVariants = cva(
  "inline-flex items-center px-xs py-4xs text-caption font-medium rounded-full",
  {
    variants: {
      variant: {
        success: "bg-success-muted text-success",
        warning: "bg-warning-muted text-warning",
        error: "bg-error-muted text-error",
        info: "bg-info-muted text-info",
        default: "bg-background-muted text-foreground-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// 2. Define props interface
interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

// 3. Export component
export function StatusBadge({
  className,
  variant,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </span>
  );
}
```

### 3. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component file | PascalCase.tsx | `StatusBadge.tsx` |
| Component name | PascalCase | `StatusBadge` |
| Props interface | ComponentNameProps | `StatusBadgeProps` |
| CSS class | kebab-case | `status-badge` |
| Utility function | camelCase | `formatDate` |

### 4. Required Exports

Every component should export:
- Default or named component
- Props interface (for TypeScript)
- Variants type (if using CVA)

```tsx
// Exports
export { StatusBadge };
export type { StatusBadgeProps };
```

---

## ShadCN Components

### Installed Components

Use ShadCN CLI to add components:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
# etc.
```

### Customization

ShadCN components are copied to `/components/ui/`. Customize them directly:

```tsx
// components/ui/button.tsx
// Modify the variants to match our style guide

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-background hover:bg-primary-muted hover:shadow-glow-sm",
        secondary: "bg-transparent border border-border text-foreground hover:border-primary hover:text-primary",
        ghost: "bg-transparent text-foreground-muted hover:text-foreground hover:bg-background-muted",
        destructive: "bg-error text-foreground hover:bg-error/90",
        link: "text-info underline-offset-4 hover:underline hover:text-primary",
      },
      size: {
        default: "px-lg py-sm",
        sm: "px-md py-xs text-body-sm",
        lg: "px-xl py-md text-body-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

## Shared Component Examples

### LoadingSpinner

```tsx
// components/shared/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <svg
      className={cn(
        "animate-spin text-primary",
        sizeClasses[size],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
```

### EmptyState

```tsx
// components/shared/EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-3xl text-center">
      {icon && (
        <div className="mb-lg text-foreground-muted">{icon}</div>
      )}
      <h3 className="text-heading-4 font-semibold text-foreground mb-xs">
        {title}
      </h3>
      {description && (
        <p className="text-body text-foreground-muted mb-lg max-w-md">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
```

### ConfirmDialog

```tsx
// components/shared/ConfirmDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-background-alt border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-foreground-muted">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-border text-foreground hover:bg-background-muted">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              variant === "destructive"
                ? "bg-error hover:bg-error/90"
                : "bg-primary hover:bg-primary-muted"
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## Component Usage

### Importing

```tsx
// Always use absolute imports
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ArticleCard } from "@/components/marketing/ArticleCard";
```

### Composition

```tsx
// Compose components together
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <StatusBadge variant="success">Active</StatusBadge>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## When to Create New Components

### Create Shared Component When:
- Used in 2+ different pages/features
- Has consistent behavior/appearance everywhere
- Is a common UI pattern (cards, badges, inputs)

### Create Local Component When:
- Only used in one page/feature
- Has page-specific logic
- Unlikely to be reused

### Refactoring to Shared:
1. Identify duplicate code
2. Create new component in appropriate folder
3. Test in isolation
4. Replace all instances
5. Delete old duplicate code

---

## Component Checklist

Before committing a component:

```
□ Uses design tokens (no hardcoded colors/spacing)
□ Has TypeScript props interface
□ Handles loading/error states (if applicable)
□ Is accessible (keyboard nav, ARIA labels)
□ Has responsive design
□ Follows naming conventions
□ Is in correct folder
□ Has no duplicate functionality
```
