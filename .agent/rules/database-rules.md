# Database Rules

## ORM Strategy
* Drizzle ORM for complex queries (joins, transactions)
* Supabase client for simple queries, realtime, auth

## Before Any Database Operation
1. READ the current schema in /supabase/migrations/
2. CHECK /types/database.ts for generated types
3. CHECK /lib/db/schema.ts for Drizzle schema
4. VERIFY table and column names exist

## Schema Changes
1. Write migration file in /supabase/migrations/
2. Update Drizzle schema in /lib/db/schema.ts
3. Run: npx drizzle-kit generate:pg
4. Test affected features

## Never Do
* NEVER use Prisma - we use Drizzle
* NEVER modify production database directly
* NEVER skip migrations
* NEVER hardcode IDs or secrets
