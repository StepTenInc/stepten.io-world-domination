/**
 * API Route: Publish Article to Supabase
 * POST /api/articles/publish
 *
 * Publishes an article from the SEO Engine to the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import type { Article } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createServerClient();

    // Prepare article data
    const articleData: Partial<Article> = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || body.metaDescription,
      content: body.content,

      // SEO & Classification
      main_keyword: body.mainKeyword || '',
      status: body.status || 'published',
      article_type: body.articleType || 'supporting',
      silo: body.silo || 'AI & Automation',
      depth: body.depth || 2,
      is_pillar: body.articleType === 'pillar',

      // Metrics
      word_count: body.wordCount || 0,
      read_time: body.readTime,
      seo_score: body.seoScore,
      human_score: body.humanScore,

      // Media
      hero_image: body.heroImage,
      hero_video: body.heroVideo,

      // Metadata
      meta_title: body.metaTitle || body.title,
      meta_description: body.metaDescription,

      // URLs
      url: body.url,

      // Timestamps
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    };

    if (body.authorName) {
      articleData.author_name = body.authorName;
    }
    if (body.authorAvatar) {
      articleData.author_avatar = body.authorAvatar;
    }

    // Check if article with this slug already exists
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', body.slug)
      .single();

    let result;

    if (existing) {
      // Update existing article
      result = await supabase
        .from('articles')
        .update(articleData)
        .eq('slug', body.slug)
        .select()
        .single();
    } else {
      // Insert new article
      result = await supabase
        .from('articles')
        .insert(articleData)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Supabase error:', result.error);
      return NextResponse.json(
        { error: 'Failed to save article to database', details: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      article: result.data,
      message: existing ? 'Article updated successfully' : 'Article published successfully',
    });

  } catch (error: any) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
