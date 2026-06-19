/**
 * @file 日报生成 API 路由
 * @description 自动搜索最新AI创业项目，生成日报内容
 * @endpoint POST /api/daily-report
 * @response { success: boolean, report: string, results: Array }
 */

import { NextRequest, NextResponse } from 'next/server';

// 日报系统提示词（合规版：原创分析 + 来源标注）
const DAILY_REPORT_PROMPT = `你是一位AI创业领域的分析师。请根据搜索结果，生成一份原创的日报分析。

重要规则：
1. 不要直接复制原文内容，要用你自己的语言重新表述和分析
2. 每条资讯末尾必须标注来源格式：【来源：网站名】
3. 重点关注趋势分析和价值解读，而非简单罗列信息

请按以下结构输出（使用中文）：

## 今日AI创业热点
原创分析3-5个热点话题，每个包含：
- 一句话原创解读（为什么重要、有什么影响）
- 来源标注：【来源：xxx】

## 重点项目推荐
挑选2-3个值得关注的项目，每个包含：
- 项目名称 + 一句话原创点评
- 为什么值得关注的原创分析
- 来源标注：【来源：xxx】

## 行业趋势（原创观点）
基于搜索结果，给出你对当前AI创业趋势的原创判断和分析。

总字数控制在500字以内。记住：你是分析师，不是搬运工。`;

/**
 * POST 处理函数：生成日报
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale = 'zh' } = body;

    // 从环境变量读取 API Keys
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

    if (!tavilyApiKey) {
      return NextResponse.json({ success: false, error: '搜索服务未配置' }, { status: 500 });
    }
    if (!deepseekApiKey) {
      return NextResponse.json({ success: false, error: 'AI服务未配置' }, { status: 500 });
    }

    // 搜索最新AI创业项目
    const searchQuery = 'AI创业项目 最新融资 今日';
    const tavilyResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tavilyApiKey}`,
      },
      body: JSON.stringify({
        query: searchQuery,
        max_results: 10,
        include_answer: true,
        search_depth: 'advanced',
      }),
    });

    if (!tavilyResponse.ok) {
      return NextResponse.json({ error: '搜索失败' }, { status: 502 });
    }

    const tavilyData = await tavilyResponse.json();

    // 格式化搜索结果（合规版：只传标题+来源+链接，减少原文传入）
    const results = (tavilyData.results || []).map(
      (item: { title?: string; content?: string; url?: string }, index: number) => {
        // 从 URL 提取来源网站名
        let sourceName = '网络';
        if (item.url) {
          try {
            const hostname = new URL(item.url).hostname;
            // 常见网站名映射
            const siteMap: Record<string, string> = {
              '36kr.com': '36氪',
              'techcrunch.com': 'TechCrunch',
              'venturebeat.com': 'VentureBeat',
              'www.infoq.cn': 'InfoQ',
              'www.pingwest.com': 'PingWest',
              'www.huxiu.com': '虎嗅',
              'www.ifanr.com': '爱范儿',
              'www.leiphone.com': '雷锋网',
              'www.jiqizhixin.com': '机器之心',
              'www.oschina.net': '开源中国',
              'github.com': 'GitHub',
              'www.producthunt.com': 'ProductHunt',
            };
            sourceName = siteMap[hostname] || hostname.replace('www.', '').split('.')[0];
          } catch {
            sourceName = '网络';
          }
        }
        return {
          id: item.url || `daily-${index}`,
          title: item.title || '',
          snippet: item.content?.slice(0, 100) || '', // 只取前100字符作为简要信息
          url: item.url || '',
          source: sourceName,
        };
      },
    );

    // 构建搜索结果上下文（合规版：标题+来源+链接，不含全文）
    const resultsContext = results
      .slice(0, 8)
      .map((r: { title: string; source: string; url: string; snippet: string }, i: number) => 
        `${i + 1}. 【${r.source}】${r.title}\n   链接：${r.url}\n   简要信息：${r.snippet}`
      )
      .join('\n\n');

    // 调用 DeepSeek 生成日报
    const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: DAILY_REPORT_PROMPT },
          { role: 'user', content: `今日搜索关键词：${searchQuery}\n\n搜索结果：\n${resultsContext}` },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!deepseekResponse.ok) {
      return NextResponse.json({ error: '日报生成失败' }, { status: 502 });
    }

    const deepseekData = await deepseekResponse.json();
    const report = deepseekData.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      report,
      results,
      date: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('[Daily Report API Error]', error);
    return NextResponse.json({ 
      success: false,
      error: '日报生成失败',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// GET: 测试日报生成（用于浏览器直接访问）
export async function GET() {
  const mockRequest = new NextRequest('http://localhost:5000/api/daily-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locale: 'zh' })
  });
  return POST(mockRequest);
}