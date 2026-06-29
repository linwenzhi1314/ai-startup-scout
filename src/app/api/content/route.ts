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

      if (error) {
        return NextResponse.json({ error: 'Content not found', section }, { status: 404 });
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
    const { data, error } = await supabase
      .from('site_content')
      .select('section, content, updated_at')
      .order('section');

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }

    // Return list with summaries
    const sections = (data || []).map((item: { section: string; content: Record<string, unknown>; updated_at: string }) => ({
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

    // Get current content first
    const { data: existing, error: fetchError } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', section)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Section not found', section }, { status: 404 });
    }

    // Merge new locale content into existing
    const currentContent = (existing?.content || {}) as Record<string, unknown>;
    const updatedContent = { ...currentContent, [locale]: content };

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
