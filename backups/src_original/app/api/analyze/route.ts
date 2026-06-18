/**
 * @file AI 分析 API 路由
 * @description 接收搜索结果，使用 DeepSeek API 进行流式 AI 分析，
 *              通过 SSE (Server-Sent Events) 协议实时推送生成内容到前端。
 *              不依赖 coze-coding-dev-sdk，可部署到任何平台（Vercel/Railway 等）。
 * @endpoint POST /api/analyze
 * @requestBody { query: string, results: Array<{ title, snippet, url }>, locale?: string }
 * @response SSE stream: data: { content: string } | data: [DONE]
 */

// 导入 Next.js 请求/响应类型
import { NextRequest, NextResponse } from 'next/server';

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
 * 3. 通过 DeepSeek API 流式调用大模型
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
    // 智能语言检测保底：如果 locale 不是中文，但搜索词包含中文字符，自动切换为中文输出
    if (!locale.startsWith('zh') && query && /[\u4e00-\u9fff]/.test(query)) {
      locale = 'zh';
    }
    // 获取当前语言对应的提示词和错误消息
    const { prompt, errors } = getMessages(locale);

    // 校验：必须提供分析内容（搜索关键词）
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: errors.badRequest },
        { status: 400 }, // 400 Bad Request
      );
    }

    // 从环境变量读取 DeepSeek API Key
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    // 校验 API Key 是否已配置
    if (!deepseekApiKey) {
      console.error('[Analyze API Error] DEEPSEEK_API_KEY not configured');
      return NextResponse.json(
        { error: errors.serverError },
        { status: 500 },
      );
    }

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

    // 创建文本编码器，用于将字符串转为 Uint8Array
    const encoder = new TextEncoder();

    // 创建可读流，用于 SSE 流式输出
    const stream = new ReadableStream({
      /**
       * 流启动回调：调用 DeepSeek API 并逐块转发内容
       * @param controller - 流控制器，用于向客户端发送数据
       */
      async start(controller) {
        try {
          // 调用 DeepSeek Chat Completions API（兼容 OpenAI 格式）
          const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',                 // JSON 请求体
              'Authorization': `Bearer ${deepseekApiKey}`,        // API Key 认证
            },
            body: JSON.stringify({
              model: 'deepseek-chat',    // DeepSeek 对话模型
              messages: [
                { role: 'system', content: prompt },       // 系统提示词：定义 AI 角色和输出格式
                { role: 'user', content: userContent },    // 用户消息：搜索关键词 + 搜索结果上下文
              ],
              stream: true,            // 启用流式输出
              temperature: 0.7,        // 适度创造性，避免过于保守或发散
              max_tokens: 2000,        // 限制最大输出长度，控制成本
            }),
          });

          // 检查 DeepSeek API 响应状态
          if (!deepseekResponse.ok) {
            const errorText = await deepseekResponse.text();
            console.error('[DeepSeek API Error]', deepseekResponse.status, errorText);
            // 向客户端发送错误信息
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: errors.streamError })}\n\n`),
            );
            controller.close();
            return;
          }

          // 获取响应体的 Reader，用于逐块读取 SSE 数据
          const reader = deepseekResponse.body?.getReader();
          // 如果无法获取 Reader，报错退出
          if (!reader) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: errors.streamError })}\n\n`),
            );
            controller.close();
            return;
          }

          // 用于累积未完成的 SSE 数据行（可能跨 chunk 分割）
          let buffer = '';

          // 循环读取 DeepSeek 的 SSE 响应流
          while (true) {
            // 读取下一个数据块
            const { done, value } = await reader.read();
            // 流结束，退出循环
            if (done) break;

            // 将二进制数据块解码为文本
            buffer += new TextDecoder().decode(value, { stream: true });

            // 按换行符分割 SSE 数据行
            const lines = buffer.split('\n');
            // 最后一行可能不完整，保留到下次处理
            buffer = lines.pop() || '';

            // 逐行处理 SSE 数据
            for (const line of lines) {
              // 去除首尾空白
              const trimmedLine = line.trim();
              // 跳过空行和非 data 行
              if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

              // 提取 data: 后面的 JSON 内容
              const data = trimmedLine.slice(6); // 去掉 "data: " 前缀

              // DeepSeek 流结束标记
              if (data === '[DONE]') {
                // 向客户端发送结束标记
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              try {
                // 解析 DeepSeek 的 SSE JSON 数据
                const parsed = JSON.parse(data);
                // 提取生成的内容片段
                const content = parsed.choices?.[0]?.delta?.content;
                // 过滤掉空内容块
                if (content) {
                  // 以统一的 SSE 格式转发给客户端
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
                  );
                }
              } catch {
                // JSON 解析失败，跳过该行（可能是格式异常的 SSE 行）
                continue;
              }
            }
          }

          // 处理 buffer 中剩余的未处理数据
          if (buffer.trim()) {
            const trimmedLine = buffer.trim();
            if (trimmedLine.startsWith('data: ')) {
              const data = trimmedLine.slice(6);
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              } else {
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
                    );
                  }
                } catch {
                  // 忽略解析错误
                }
              }
            }
          }

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
