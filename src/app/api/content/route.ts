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
      // Use RPC to bypass PostgREST schema cache issues
      const { data, error } = await supabase
        .rpc('get_site_content', { p_section: section });

      if (error || !data || data.length === 0) {
        console.error('[content API] Query error:', error, 'section:', section);
        return NextResponse.json({ error: 'Content not found', section, details: error?.message }, { status: 404 });
      }

      const row = data[0];

      // Return locale-specific content if requested
      const localizedContent = locale && row?.content?.[locale] 
        ? row.content[locale] 
        : row?.content;

      return NextResponse.json({
        success: true,
        section: row.section,
        content: localizedContent,
        fullContent: row.content,
        updatedAt: row.updated_at,
      });
    }

    // Get all sections
    const { data: allData, error: allError } = await supabase
      .rpc('get_site_content', { p_section: null });

    if (allError) {
      return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }

    // Return list with summaries
    const sections = (allData || []).map((item: { section: string; content: Record<string, unknown>; updated_at: string }) => ({
      section: item.section,
      updatedAt: item.updated_at,
      hasZh: !!(item.content?.zh),
      hasEn: !!(item.content?.en),
    }));

    return NextResponse.json({ success: true, sections, total: sections.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/content — update a section
export async function PUT(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section, locale, content } = body as {
      section: string;
      locale: string;
      content: unknown;
    };

    if (!section || !locale || content === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: section, locale, content' },
        { status: 400 }
      );
    }

    if (!['zh', 'en'].includes(locale)) {
      return NextResponse.json({ error: 'Invalid locale. Must be zh or en' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Get current content first using RPC
    const { data: existingRows, error: fetchError } = await supabase
      .rpc('get_site_content', { p_section: section });

    if (fetchError || !existingRows || existingRows.length === 0) {
      return NextResponse.json({ error: 'Section not found', section }, { status: 404 });
    }

    // Merge new locale content into existing
    const currentContent = (existingRows[0]?.content || {}) as Record<string, unknown>;
    const updatedContent = { ...currentContent, [locale]: content };

    // Update using RPC - need direct SQL since RPC is read-only
    const { error: updateError } = await supabase
      .from('site_content')
      .update({ content: updatedContent, updated_at: new Date().toISOString(), updated_by: 'admin' })
      .eq('section', section);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update content', details: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Content updated: ${section}/${locale}`,
      section,
      locale,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
