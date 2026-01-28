# No Duplicates Rule

## Core Principle
NEVER create duplicate functionality. Always search first.

## Before Creating Anything
1. Search codebase for similar code
2. Check if functionality already exists
3. If exists → use it, extend it, or refactor it
4. If doesn't exist → create in appropriate location

## Search Commands
* Component: grep -r "ComponentName" components/
* Function: grep -r "functionName" lib/
* Hook: grep -r "useHookName" hooks/

## Common Duplicates to Avoid
* Button variants - use existing Button with variant prop
* Loading states - use LoadingSpinner component
* Error handling - use existing error utilities
* API calls - check if endpoint already exists
