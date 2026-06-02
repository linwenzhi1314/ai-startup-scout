import { NextRequest, NextResponse } from 'next/server';
import { SearchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { query, category, count } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: '请提供搜索关键词' },
        { status: 400 },
      );
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new SearchClient(config, customHeaders);

    // Build search query with category context
    let searchQuery = query;
    if (category && category !== 'all') {
      const categoryMap: Record<string, string> = {
        funding: 'AI startup funding investment',
        product: 'AI software product launch',
        opensource: 'AI open source project',
        model: 'AI model release',
      };
      if (categoryMap[category]) {
        searchQuery = `${query} ${categoryMap[category]}`;
      }
    }

    const response = await client.advancedSearch(searchQuery, {
      searchType: 'web',
      count: count || 10,
      needSummary: true,
      needUrl: true,
    });

    const results = (response.web_items || []).map((item) => ({
      id: item.id,
      title: item.title || '',
      snippet: item.snippet || '',
      url: item.url || '',
      siteName: item.site_name || '',
      logoUrl: item.logo_url || '',
      publishTime: item.publish_time || '',
    }));

    return NextResponse.json({
      success: true,
      summary: response.summary || '',
      results,
    });
  } catch (error) {
    console.error('[Search API Error]', error);
    return NextResponse.json(
      { error: '搜索失败，请稍后重试' },
      { status: 500 },
    );
  }
}
