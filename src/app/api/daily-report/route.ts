/**
 * @file 日报生成 API 路由
 * @description 自动搜索最新AI创业项目，生成日报内容
 * @endpoint POST /api/daily-report
 * @response { success: boolean, report: string, results: Array }
 */

import { NextRequest, NextResponse } from 'next/server';

// 日报系统提示词
const DAILY_REPORT_PROMPT = `你是一位AI创业领域的研究员。请根据今天的搜索结果，生成一份简洁的日报。

请按以下结构输出（使用中文）：

## 今日AI创业热点
总结今天搜索结果中的3-5个热点话题或项目。

## 重点项目推荐
挑选2-3个最值得关注的项目，每个包含：
- 项目名称
- 一句话亮点
- 为什么值得关注

## 行业动态
简述当前AI创业领域的整体趋势。

保持简洁，总字数控制在500字以内。`;

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

    // 格式化搜索结果
    const results = (tavilyData.results || []).map(
      (item: { title?: string; content?: string; url?: string }, index: number) => ({
        id: item.url || `daily-${index}`,
        title: item.title || '',
        snippet: item.content || '',
        url: item.url || '',
      }),
    );

    // 构建搜索结果上下文
    const resultsContext = results
      .slice(0, 8)
      .map((r: { title: string; snippet: string }, i: number) => `${i + 1}. ${r.title}: ${r.snippet}`)
      .join('\n');

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