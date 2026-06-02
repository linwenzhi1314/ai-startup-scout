import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { query, results } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: '请提供分析内容' },
        { status: 400 },
      );
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // Build context from search results
    const resultsContext = (results || [])
      .slice(0, 8)
      .map(
        (r: { title?: string; snippet?: string; url?: string }, i: number) =>
          `${i + 1}. ${r.title}: ${r.snippet} (${r.url})`,
      )
      .join('\n');

    const systemPrompt = `你是一位专注于AI创业领域的投资分析师。用户正在搜索AI软件创业项目，你需要基于搜索结果提供深度分析。

请按以下结构输出（使用中文）：

## 市场洞察
简要总结当前搜索方向的市场趋势和机会。

## 重点推荐项目
从搜索结果中挑选3-5个最值得关注的AI创业项目，每个项目包含：
- 项目名称
- 核心亮点（一句话）
- 推荐理由（2-3句话）

## 投资建议
给出针对该方向的2-3条投资或关注建议。

保持专业客观，数据优先，避免空洞的表述。`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      {
        role: 'user' as const,
        content: `搜索关键词：${query}\n\n搜索结果：\n${resultsContext || '暂无搜索结果'}`,
      },
    ];

    // Use streaming for real-time response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const llmStream = client.stream(messages, {
            model: 'doubao-seed-2-0-lite-260215',
            temperature: 0.7,
          });

          for await (const chunk of llmStream) {
            if (chunk.content) {
              const text =
                typeof chunk.content === 'string'
                  ? chunk.content
                  : String(chunk.content);
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`),
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (streamError) {
          console.error('[Analyze Stream Error]', streamError);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: '分析生成中断' })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[Analyze API Error]', error);
    return NextResponse.json(
      { error: '分析失败，请稍后重试' },
      { status: 500 },
    );
  }
}
