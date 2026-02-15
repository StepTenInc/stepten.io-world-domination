# Supabase Setup Guide for SEO Engine

This guide will walk you through setting up Supabase to store your published articles so they appear on the frontend.

## 📋 Prerequisites

- Supabase account (free tier works fine)
- Articles ready to publish from SEO Engine

## 🚀 Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Project Name**: `stepten-seo-engine` (or any name)
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
5. Click "Create New Project"
6. Wait 1-2 minutes for provisioning

## 🔑 Step 2: Get API Keys

1. In your Supabase project, click "Settings" (gear icon in sidebar)
2. Click "API" in the settings menu
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (long string, under "service_role" section)

4. Copy these values!

## 🔧 Step 3: Add Keys to .env File

1. Open `/stepten-app/.env` file
2. Find the Supabase section (already added)
3. Replace the placeholder values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (paste your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (paste your service role key)
```

4. Save the file

## 📊 Step 4: Create Database Table

1. In your Supabase project, click "SQL Editor" in the sidebar
2. Click "New Query"
3. Open the file: `/stepten-app/supabase/migrations/001_create_articles_table.sql`
4. Copy ALL the SQL code from that file
5. Paste it into the Supabase SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. You should see: "Success. No rows returned"

## ✅ Step 5: Verify Table Creation

1. Click "Table Editor" in sidebar
2. You should see a new table called "articles"
3. Click on it to see columns:
   - id, created_at, updated_at, published_at
   - title, slug, content, excerpt
   - status, article_type, silo, depth
   - word_count, seo_score, human_score
   - hero_image, meta_title, meta_description
   - etc.

## 🔄 Step 6: Restart Dev Server

1. Stop your Next.js dev server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   cd "/Users/stepten/Desktop/Dev Projects/StepTen.io/stepten-app"
   npm run dev
   ```

## 🎉 Step 7: Test the Full Flow

### Publish Your First Article

1. Go to: `http://localhost:33333/admin/seo/articles/new/step-1-idea`
2. Complete all 8 steps (or use an article you already created)
3. On Step 8, click "Publish Now"
4. Wait for success message
5. Click "View Published Article" or copy the URL

### View on Frontend

1. Go to: `http://localhost:33333/articles/your-article-slug`
2. Your article should display with:
   - Title, content, hero image
   - Author info (Stephen Ten with your logo)
   - SEO metadata
   - All styling from Step 7

### Verify in Supabase

1. Go back to Supabase → Table Editor → articles
2. Click on the "articles" table
3. You should see your published article!
4. All the data should be there

## 🐛 Troubleshooting

### Error: "Failed to publish article"

**Possible causes:**
1. **API keys not set correctly**
   - Double-check .env file
   - Make sure you saved it
   - Restart dev server

2. **Table not created**
   - Go to Supabase SQL Editor
   - Run the migration again
   - Check for errors

3. **Network issue**
   - Check your internet connection
   - Try again in a few seconds

### Error: "Article not found" on frontend

**Possible causes:**
1. **Article published as draft**
   - Check Supabase table, status should be "published"

2. **Slug mismatch**
   - Check the URL matches the article slug exactly

3. **Database query failed**
   - Open browser console (F12)
   - Look for API errors
   - Check Supabase logs

### Images not showing

**Possible causes:**
1. **Base64 images too large**
   - Hero images stored in database are base64 encoded
   - If > 1MB, might have issues
   - Consider using image hosting (Cloudinary, S3) for production

## 📈 What's Next?

### Production Deployment

When you deploy to production (Vercel, etc.):

1. **Add environment variables** to your deployment platform:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Update URLs** in Step 8:
   - Change `http://localhost:33333/articles/${slug}`
   - To: `https://stepten.io/articles/${slug}`

3. **Enable RLS** (Row Level Security) in Supabase:
   - Already configured in migration
   - Public can only read published articles
   - Authenticated users can do everything

### Image Optimization

For production, consider:

1. **Use Cloudinary or AWS S3** for images:
   - Upload images in Step 7
   - Store URL instead of base64
   - Better performance

2. **Compress images** before upload:
   - Use TinyPNG or similar
   - Target < 500KB per image

### Analytics

Track article views:

1. Add view counter in API route
2. Increment on each article load
3. Display in admin dashboard

## 🎓 Understanding the Flow

```
SEO Engine (Admin)
      ↓
 Steps 1-8
      ↓
 Step 8: Publish
      ↓
 POST /api/articles/publish
      ↓
 Supabase Database
      ↓
 Frontend /articles/[slug]
      ↓
 GET /api/articles/[slug]
      ↓
 Display Article
```

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] API keys added to .env
- [ ] Database table created
- [ ] Dev server restarted
- [ ] First article published successfully
- [ ] Article visible on frontend
- [ ] Article visible in Supabase table editor
- [ ] Images displaying correctly
- [ ] Meta tags working (check page source)

## 🆘 Need Help?

If you're stuck:

1. Check browser console (F12) for errors
2. Check terminal for server errors
3. Check Supabase logs (Logs section in dashboard)
4. Re-run the migration SQL
5. Verify API keys are correct

## 🎊 You're Done!

Your SEO Engine is now connected to a real database!

**What you can do now:**
- Publish articles from admin
- View them on frontend
- Share URLs with others
- Edit and re-publish
- Delete articles
- Track in Supabase

**Next steps:**
- Add more articles
- Customize article layouts
- Add analytics
- Deploy to production
- Share your content!
