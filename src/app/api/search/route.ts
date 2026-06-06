import { NextRequest, NextResponse } from 'next/server';
import { SearchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// Locale-aware category keywords
const categoryKeywords: Record<string, Record<string, string>> = {
  en: {
    funding: 'AI startup funding investment',
    product: 'AI software product launch',
    opensource: 'AI open source project',
    model: 'AI model release',
  },
  zh: {
    funding: 'AI创业 融资 投资',
    product: 'AI软件 产品发布',
    opensource: 'AI开源项目',
    model: 'AI模型发布',
  },
};

// Default category keywords for unsupported locales (fallback to English)
const defaultCategoryKeywords = categoryKeywords.en;

function getCategoryKeywords(locale: string): Record<string, string> {
  const lang = locale.split('-')[0]; // e.g. "zh-CN" -> "zh"
  return categoryKeywords[lang] || defaultCategoryKeywords;
}

export async function POST(request: NextRequest) {
  let isZh = false;
  try {
    const body = await request.json();
    const { query, category, count, locale } = body;
    isZh = locale?.startsWith('zh');

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: isZh ? '请提供搜索关键词' : 'Please provide a search query' },
        { status: 400 },
      );
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new SearchClient(config, customHeaders);

    // Build search query with locale-aware category context
    let searchQuery = query;
    const keywords = getCategoryKeywords(locale || 'en');
    if (category && category !== 'all' && keywords[category]) {
      searchQuery = `${query} ${keywords[category]}`;
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
      { error: isZh ? '搜索失败，请稍后重试' : 'Search failed, please try again later' },
      { status: 500 },
    );
  }
}
