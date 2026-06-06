/**
 * @file 搜索 API 路由
 * @description 接收前端搜索请求，使用 coze-coding-dev-sdk 的 SearchClient 进行 Web 搜索，
 *              支持按分类（融资/产品/开源/模型）和语言（中/英）构建本地化搜索词。
 * @endpoint POST /api/search
 * @requestBody { query: string, category?: string, count?: number, locale?: string }
 * @response { success: boolean, summary: string, results: Array<SearchResult> }
 */

// 导入 Next.js 请求/响应类型
import { NextRequest, NextResponse } from 'next/server';
// 导入搜索客户端、配置工具、请求头转发工具
import { SearchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

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
 * 3. 调用 SearchClient 执行 Web 搜索
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

    // 提取需要转发的请求头（SDK 鉴权需要）
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    // 初始化 SDK 配置（自动从环境变量读取 API 凭据）
    const config = new Config();
    // 创建搜索客户端实例
    const client = new SearchClient(config, customHeaders);

    // 构建搜索查询词：默认使用用户原始查询
    let searchQuery = query;
    // 根据语言获取分类关键词
    const keywords = getCategoryKeywords(locale || 'en');
    // 如果指定了分类且非"全部"，则追加分类关键词增强搜索精确度
    if (category && category !== 'all' && keywords[category]) {
      searchQuery = `${query} ${keywords[category]}`;
    }

    // 调用 SDK 高级搜索接口
    const response = await client.advancedSearch(searchQuery, {
      searchType: 'web',           // Web 搜索类型
      count: count || 10,          // 返回结果数量，默认 10
      needSummary: true,           // 需要搜索摘要
      needUrl: true,               // 需要结果 URL
    });

    // 格式化搜索结果：提取关键字段，补充默认值
    const results = (response.web_items || []).map((item) => ({
      id: item.id,                           // 结果唯一标识
      title: item.title || '',               // 标题
      snippet: item.snippet || '',           // 摘要片段
      url: item.url || '',                   // 来源链接
      siteName: item.site_name || '',        // 站点名称
      logoUrl: item.logo_url || '',          // 站点 Logo URL
      publishTime: item.publish_time || '',  // 发布时间
    }));

    // 返回成功响应：包含搜索摘要和格式化后的结果列表
    return NextResponse.json({
      success: true,
      summary: response.summary || '',  // 搜索结果总摘要
      results,                          // 格式化后的结果数组
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
