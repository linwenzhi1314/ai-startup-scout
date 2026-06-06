/**
 * @file AI 分析 API 路由
 * @description 接收搜索结果，使用 coze-coding-dev-sdk 的 LLMClient 进行流式 AI 分析，
 *              通过 SSE (Server-Sent Events) 协议实时推送生成内容到前端。
 * @endpoint POST /api/analyze
 * @requestBody { query: string, results: Array<{ title, snippet, url }>, locale?: string }
 * @response SSE stream: data: { content: string } | data: [DONE]
 */

// 导入 Next.js 请求/响应类型
import { NextRequest, NextResponse } from 'next/server';
// 导入 LLM 客户端、配置工具、请求头转发工具
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

/**
 * 按语言区分的 AI 系统提示词
 * - 英文版：英文输出，投资分析师角色
 * - 中文版：中文输出，投资分析师角色
 * 两者结构一致，包含：市场洞察、重点推荐项目、投资建议三个板块
 */
const systemPrompts: Record<string, string> = {
  en: `You are an investment analyst specializing in the AI startup sector. The user is searching for AI software startup projects, and you need to provide in-depth analysis based on the search results.

Please output in the following structure (in English):

## Market Insights
Briefly summarize the market trends and opportunities in the current search direction.

## Top Picks
Select 3-5 most noteworthy AI startup projects from the search results, each including:
- Project name
- Core highlight (one sentence)
- Recommendation reason (2-3 sentences)

## Investment Advice
Provide 2-3 investment or follow-up recommendations for this direction.

Stay professional and objective, prioritize data-driven insights, avoid vague statements.`,
  zh: `你是一位专注于AI创业领域的投资分析师。用户正在搜索AI软件创业项目，你需要基于搜索结果提供深度分析。

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

保持专业客观，数据优先，避免空洞的表述。`,
};

/**
 * 按语言区分的错误消息
 * 用于请求校验失败和流式生成异常时的本地化提示
 */
const errorMessage: Record<string, { badRequest: string; streamError: string; serverError: string }> = {
  en: {
    badRequest: 'Please provide content for analysis',      // 请求参数缺失
    streamError: 'Analysis generation interrupted',         // 流式生成中断
    serverError: 'Analysis failed, please try again later', // 服务端错误
  },
  zh: {
    badRequest: '请提供分析内容',
    streamError: '分析生成中断',
    serverError: '分析失败，请稍后重试',
  },
};

/**
 * 根据用户 locale 获取对应的系统提示词和错误消息
 * @param locale - 用户语言标识，如 "zh-CN"、"en-US"
 * @returns { prompt: 系统提示词, errors: 错误消息对象 }
 */
function getMessages(locale: string) {
  // 提取主语言代码，默认英文
  const lang = locale?.split('-')[0] || 'en';
  return {
    // 返回匹配语言的提示词，回退到英文
    prompt: systemPrompts[lang] || systemPrompts.en,
    // 返回匹配语言的错误消息，回退到英文
    errors: errorMessage[lang] || errorMessage.en,
  };
}

/**
 * POST 处理函数：执行 AI 流式分析
 * 1. 解析请求体中的 query、results、locale 参数
 * 2. 根据语言构建系统提示词和用户消息
 * 3. 通过 LLMClient 流式调用大模型
 * 4. 以 SSE 格式逐块推送生成内容
 */
export async function POST(request: NextRequest) {
  // 默认语言为英文
  let locale = 'en';
  try {
    // 解析请求体 JSON
    const body = await request.json();
    // 提取搜索关键词
    const { query, results } = body;
    // 提取语言标识，默认英文
    locale = body.locale || 'en';
    // 获取当前语言对应的提示词和错误消息
    const { prompt, errors } = getMessages(locale);

    // 校验：必须提供分析内容（搜索关键词）
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: errors.badRequest },
        { status: 400 }, // 400 Bad Request
      );
    }

    // 提取需要转发的请求头（SDK 鉴权需要）
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    // 初始化 SDK 配置（自动从环境变量读取 API 凭据）
    const config = new Config();
    // 创建 LLM 客户端实例
    const client = new LLMClient(config, customHeaders);

    // 将搜索结果格式化为文本上下文，最多取前 8 条
    const resultsContext = (results || [])
      .slice(0, 8) // 限制上下文长度，避免 token 超限
      .map(
        // 格式化为 "序号. 标题: 摘要 (URL)" 的文本行
        (r: { title?: string; snippet?: string; url?: string }, i: number) =>
          `${i + 1}. ${r.title}: ${r.snippet} (${r.url})`,
      )
      .join('\n'); // 用换行连接

    // 根据语言构建用户消息内容
    const userContent = locale?.startsWith('zh')
      ? `搜索关键词：${query}\n\n搜索结果：\n${resultsContext || '暂无搜索结果'}`
      : `Search query: ${query}\n\nSearch results:\n${resultsContext || 'No search results available'}`;

    // 构建对话消息列表
    const messages = [
      { role: 'system' as const, content: prompt },   // 系统提示词：定义 AI 角色和输出格式
      { role: 'user' as const, content: userContent }, // 用户消息：搜索关键词 + 搜索结果上下文
    ];

    // 创建文本编码器，用于将字符串转为 Uint8Array
    const encoder = new TextEncoder();

    // 创建可读流，用于 SSE 流式输出
    const stream = new ReadableStream({
      /**
       * 流启动回调：连接 LLM 并逐块转发内容
       * @param controller - 流控制器，用于向客户端发送数据
       */
      async start(controller) {
        try {
          // 调用 LLM 客户端的流式接口
          const llmStream = client.stream(messages, {
            model: 'doubao-seed-2-0-lite-260215', // 使用豆包轻量模型，平衡速度和质量
            temperature: 0.7,                      // 适度创造性，避免过于保守或发散
          });

          // 逐块读取 LLM 生成的内容
          for await (const chunk of llmStream) {
            // 过滤掉空内容块
            if (chunk.content) {
              // 确保内容为字符串类型
              const text =
                typeof chunk.content === 'string'
                  ? chunk.content
                  : String(chunk.content);
              // 以 SSE 格式发送：data: {json}\n\n
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`),
              );
            }
          }
          // 流结束：发送 [DONE] 标记
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          // 关闭流
          controller.close();
        } catch (streamError) {
          // 捕获流式生成中的异常
          console.error('[Analyze Stream Error]', streamError);
          try {
            // 尝试向客户端发送错误信息
            const { errors: errs } = getMessages(locale);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: errs.streamError })}\n\n`,
              ),
            );
            // 关闭流
            controller.close();
          } catch (_e) {
            // 流已关闭，忽略二次关闭错误
          }
        }
      },
    });

    // 返回 SSE 流响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream', // SSE 内容类型
        'Cache-Control': 'no-cache',          // 禁止缓存，确保实时性
        Connection: 'keep-alive',             // 保持连接
      },
    });
  } catch (error) {
    // 捕获请求解析等非流式异常
    console.error('[Analyze API Error]', error);
    // 获取当前语言的错误消息
    const { errors } = getMessages(locale);
    // 返回 500 错误响应
    return NextResponse.json(
      { error: errors.serverError },
      { status: 500 },
    );
  }
}
