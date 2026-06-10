/**
 * @file 搜索 API 路由
 * @description 接收前端搜索请求，使用 Tavily Search API 进行 Web 搜索，
 *              支持按分类（融资/产品/开源/模型）和语言（中/英）构建本地化搜索词。
 *              不依赖 coze-coding-dev-sdk，可部署到任何平台（Vercel/Railway 等）。
 * @endpoint POST /api/search
 * @requestBody { query: string, category?: string, count?: number, locale?: string }
 * @response { success: boolean, summary: string, results: Array<SearchResult> }
 */

// 导入 Next.js 请求/响应类型
import { NextRequest, NextResponse } from 'next/server';

/**
 * 按语言区分的分类关键词映射
 * - en: 英文搜索关键词，用于补充搜索上下文
 * - zh: 中文搜索关键词，用于补充搜索上下文
 * 键名对应前端传入的 category 参数值
 */
const categoryKeywords: Record<string, Record<string, string>> = {
  en: {
    funding: 'AI startup funding investment',     // 融资类英文关键词
    product: 'AI software product launch',        // 产品类英文关键词
    opensource: 'AI open source project',         // 开源类英文关键词
    model: 'AI model release',                    // 模型类英文关键词
  },
  zh: {
    funding: 'AI创业 融资 投资',                   // 融资类中文关键词
    product: 'AI软件 产品发布',                     // 产品类中文关键词
    opensource: 'AI开源项目',                       // 开源类中文关键词
    model: 'AI模型发布',                            // 模型类中文关键词
  },
};

// 默认分类关键词：不支持的语言回退到英文
const defaultCategoryKeywords = categoryKeywords.en;

/**
 * 根据用户 locale 获取对应的分类关键词字典
 * @param locale - 用户语言标识，如 "zh-CN"、"en-US"
 * @returns 分类关键词映射对象
 */
function getCategoryKeywords(locale: string): Record<string, string> {
  // 提取主语言代码，如 "zh-CN" -> "zh"
  const lang = locale.split('-')[0];
  // 优先返回匹配的语言关键词，否则回退到英文
  return categoryKeywords[lang] || defaultCategoryKeywords;
}

/**
 * POST 处理函数：执行 AI 创业项目搜索
 * 1. 解析请求体中的 query、category、count、locale 参数
 * 2. 根据语言和分类构建增强搜索词
 * 3. 调用 Tavily Search API 执行 Web 搜索
 * 4. 格式化并返回搜索结果
 */
export async function POST(request: NextRequest) {
  // 标记当前请求是否为中文环境，用于本地化错误消息
  let isZh = false;
  try {
    // 解析请求体 JSON
    const body = await request.json();
    // 提取搜索关键词
    const { query, category, count, locale } = body;
    // 判断是否为中文语言环境
    isZh = locale?.startsWith('zh');
    // 智能语言检测保底：如果 locale 不是中文，但搜索词包含中文字符，自动切换为中文环境
    if (!isZh && query && /[\u4e00-\u9fff]/.test(query)) {
      isZh = true;
    }

    // 校验：必须提供搜索关键词
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        // 根据语言返回对应的错误提示
        { error: isZh ? '请提供搜索关键词' : 'Please provide a search query' },
        { status: 400 }, // 400 Bad Request
      );
    }

    // 从环境变量读取 Tavily API Key
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    // 校验 API Key 是否已配置
    if (!tavilyApiKey) {
      console.error('[Search API Error] TAVILY_API_KEY not configured');
      return NextResponse.json(
        { error: isZh ? '搜索服务未配置' : 'Search service not configured' },
        { status: 500 },
      );
    }

    // 构建搜索查询词：默认使用用户原始查询
    let searchQuery = query;
    // 根据语言获取分类关键词
    const lang = (locale || 'en').split('-')[0];
    const keywords = getCategoryKeywords(locale || 'en');

    // 英文模式下的语言优化策略：
    // 拼接语言引导词，帮助搜索引擎理解期望结果语言
    if (lang === 'en') {
      searchQuery = `${query} in English`;
    }

    // 如果指定了分类且非"全部"，则追加分类关键词增强搜索精确度
    if (category && category !== 'all' && keywords[category]) {
      searchQuery = `${searchQuery} ${keywords[category]}`;
    }

    // 调用 Tavily Search API
    const tavilyResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',  // Tavily 使用 POST 请求
      headers: {
        'Content-Type': 'application/json',           // JSON 请求体
        'Authorization': `Bearer ${tavilyApiKey}`,     // API Key 认证
      },
      body: JSON.stringify({
        query: searchQuery,         // 搜索查询词
        max_results: count || 10,   // 返回结果数量，默认 10
        include_answer: true,       // 包含 AI 生成的摘要回答
        include_raw_content: false, // 不包含原始网页内容（节省 token）
        search_depth: 'advanced',   // 高级搜索模式，结果更精准
      }),
    });

    // 检查 Tavily API 响应状态
    if (!tavilyResponse.ok) {
      const errorText = await tavilyResponse.text();
      console.error('[Tavily API Error]', tavilyResponse.status, errorText);
      return NextResponse.json(
        { error: isZh ? '搜索服务暂时不可用' : 'Search service temporarily unavailable' },
        { status: 502 }, // 502 Bad Gateway
      );
    }

    // 解析 Tavily API 响应
    const tavilyData = await tavilyResponse.json();

    // 格式化搜索结果：提取关键字段，补充默认值
    const results = (tavilyData.results || []).map(
      (item: {
        title?: string;      // 结果标题
        content?: string;    // 结果内容摘要
        url?: string;        // 来源链接
        source?: string;     // 来源域名
        published_date?: string; // 发布日期
      }, index: number) => ({
        id: item.url || `tavily-${index}`,              // 使用 URL 作为唯一标识（URL 天然不重复），无 URL 时回退到索引
        title: item.title || '',                     // 标题
        snippet: item.content || '',                 // 摘要片段（Tavily 用 content 字段）
        url: item.url || '',                         // 来源链接
        siteName: item.source || '',                 // 站点名称（Tavily 用 source 字段）
        logoUrl: '',                                 // Tavily 不提供 Logo，留空
        publishTime: item.published_date || '',      // 发布时间
      }),
    );

    // 返回成功响应：包含 AI 摘要和格式化后的结果列表
    return NextResponse.json({
      success: true,
      summary: tavilyData.answer || '',  // Tavily AI 生成的搜索摘要
      results,                           // 格式化后的结果数组
    });
  } catch (error) {
    // 捕获异常，记录错误日志
    console.error('[Search API Error]', error);
    // 返回 500 错误响应，根据语言本地化消息
    return NextResponse.json(
      { error: isZh ? '搜索失败，请稍后重试' : 'Search failed, please try again later' },
      { status: 500 },
    );
  }
}
