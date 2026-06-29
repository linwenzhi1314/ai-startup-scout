import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'ai-startup-scout-admin-2024';

function verifyAdmin(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key');
  return key === ADMIN_KEY;
}

// GET /api/content?section=pricing  or  /api/content (all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const locale = searchParams.get('locale') || 'zh';

    const supabase = getSupabaseClient();

    if (section) {
      const { data, error } = await supabase
        .from('site_content')
        .select('section, content, updated_at')
        .eq('section', section)
        .single();

      if (error || !data) {
        console.error('[content API] Query error:', error?.message, 'section:', section);
        return NextResponse.json({ 
          error: 'Content not found', 
          section, 
          details: error?.message 
        }, { status: 404 });
      }

      // Return locale-specific content if requested
      const localizedContent = locale && data?.content?.[locale] 
        ? data.content[locale] 
        : data?.content;

      return NextResponse.json({
        success: true,
        section: data.section,
        content: localizedContent,
        fullContent: data.content,
        updatedAt: data.updated_at,
      });
    }

    // Get all sections
    const { data: allData, error: allError } = await supabase
      .from('site_content')
      .select('section, content, updated_at')
      .order('section');

    if (allError) {
      console.error('[content API] All query error:', allError.message);
      return NextResponse.json({ error: 'Failed to fetch content', details: allError.message }, { status: 500 });
    }

    // Build localized map
    const contentMap: Record<string, { content: Record<string, unknown>; updatedAt: string }> = {};
    for (const row of allData || []) {
      contentMap[row.section] = {
        content: locale && row.content?.[locale] ? row.content[locale] as Record<string, unknown> : row.content as Record<string, unknown>,
        updatedAt: row.updated_at,
      };
    }

    return NextResponse.json({ success: true, data: contentMap });
  } catch (err) {
    console.error('[content API] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/content - Update a section's content
export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as { section?: string; content?: Record<string, unknown> };
    const { section, content } = body;

    if (!section || !content) {
      return NextResponse.json({ error: 'Section and content are required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('site_content')
      .upsert({
        section,
        content,
        updated_at: new Date().toISOString(),
        updated_by: 'admin',
      }, { onConflict: 'section' })
      .select('section, content, updated_at')
      .single();

    if (error) {
      console.error('[content API] Upsert error:', error.message);
      return NextResponse.json({ error: 'Failed to update content', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      section: data.section, 
      updatedAt: data.updated_at 
    });
  } catch (err) {
    console.error('[content API] PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
