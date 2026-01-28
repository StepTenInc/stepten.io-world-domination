---
trigger: always_on
---

# Code Style Rules

## TypeScript
* Use TypeScript for all code
* Define interfaces for all props
* Export prop types alongside components
* Use absolute imports with @ prefix
* No `any` types — use proper typing

## Naming Conventions
* Components: PascalCase (e.g., `StatusBadge.tsx`)
* Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
* Utilities: camelCase (e.g., `formatDate.ts`)
* CSS classes: kebab-case
* Constants: UPPER_SNAKE_CASE

## Import Order
1. React/Next.js imports
2. Third-party imports
3. Internal components (@/components)
4. Internal utilities (@/lib)
5. Types
6. Styles

## File Organization
* One component per file
* Co-locate tests with components
* Keep files under 300 lines — split if larger
