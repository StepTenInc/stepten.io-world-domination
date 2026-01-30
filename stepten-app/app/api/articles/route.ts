/**
 * API Route: Get All Articles
 * GET /api/articles
 *
 * Returns all published articles (for public frontend)
 * or all articles (for admin)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    const supabase = createServerClient();

    let query = supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by status unless includeUnpublished is true (for admin)
    if (!includeUnpublished) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch articles', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      articles: data || [],
      count: data?.length || 0,
    });

  } catch (error: any) {
    console.error('Fetch articles error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
