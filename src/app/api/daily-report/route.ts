import { NextRequest, NextResponse } from 'next/server';
import { SearchClient, Config, LLMClient } from 'coze-coding-dev-sdk';

//日报生成API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic = 'AI创业', days = 1 } = body;

    // 1. 搜索最新AI创业项目
    const config = new Config();
    const searchClient = new SearchClient(config);

    const searchResults = await searchClient.webSearch(
      `${topic} 最新融资 创业项目`,
      10,
      false
    );

    if (!searchResults.web_items || searchResults.web_items.length === 0) {
      return NextResponse.json({
        error: '未找到相关内容'
      }, { status: 404 });
    }

    // 2. 使用AI生成日报内容
    const llmClient = new LLMClient(config);

    const projectsSummary = searchResults.web_items.map((item, i) => 
      `${i + 1}. ${item.title}\n   摘要: ${item.snippet}\n   来源: ${item.url}`
    ).join('\n\n');

    const dailyReportPrompt = `你是一位专业的AI创投分析师。请根据以下搜索结果，生成一份简洁的AI创业日报。

今日搜索到的AI创业项目信息：
${projectsSummary}

请生成日报内容，包含：
1. 今日头条（1-2个最值得关注的项目）
2. 融资动态（近期融资项目简报）
3. 市场趋势分析（一句话总结当前AI创业热点）
4. 推荐关注（值得持续跟踪的领域）

格式要求：
- 每个板块控制在50-100字
- 使用简洁的新闻风格
- 突出关键数据（融资金额、赛道、团队背景等）`;

    // 流式生成日报
    const stream = await llmClient.stream([
      { role: 'user', content: dailyReportPrompt }
    ], { model: 'doubao-seed-2-0-lite-260215' });

    // 收集流式输出
    let reportContent = '';
    for await (const chunk of stream) {
      if (chunk.content) {
        reportContent += chunk.content;
      }
    }

    // 3. 返回日报内容
    return NextResponse.json({
      success: true,
      date: new Date().toISOString().split('T')[0],
      topic,
      sources: searchResults.web_items.map((item) => ({
        title: item.title,
        url: item.url
      })),
      content: reportContent
    });

  } catch (error) {
    console.error('Daily report generation error:', error);
    return NextResponse.json({
      error: '日报生成失败'
    }, { status: 500 });
  }
}

// GET: 获取日报（简化版）
export async function GET() {
  try {
    // 使用预设话题生成日报
    const config = new Config();
    const searchClient = new SearchClient(config);

    const searchResults = await searchClient.webSearch(
      'AI创业 最新融资 今日',
      5,
      false
    );

    return NextResponse.json({
      date: new Date().toISOString().split('T')[0],
      projects: searchResults.web_items?.map((item) => ({
        title: item.title,
        snippet: item.snippet,
        url: item.url
      })) || []
    });

  } catch (error) {
    console.error('Daily report fetch error:', error);
    return NextResponse.json({
      error: '获取日报失败'
    }, { status: 500 });
  }
}