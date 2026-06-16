import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

//兼容NEXT_PUBLIC前缀的变量名
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY;

interface Subscriber {
  email: string;
  tags: string | null;
}

// 发送日报邮件给所有订阅者
export async function POST(request: NextRequest) {
  try {
    // 1. 获取日报内容（调用daily-report API）
    const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || `http://localhost:${process.env.DEPLOY_RUN_PORT || 5000}`;
    const reportResponse = await fetch(`${baseUrl}/api/daily-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'AI创业', days: 1 })
    });

    const reportData = await reportResponse.json();
    
    if (!reportData.success) {
      return NextResponse.json({
        error: '日报生成失败',
        details: reportData.error
      }, { status: 500 });
    }

    // 2. 获取所有活跃订阅者
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: subscribers, error: subError } = await supabase
      .from('subscribers')
      .select('email, tags')
      .eq('is_active', true);

    if (subError) {
      console.error('Fetch subscribers error:', subError);
      return NextResponse.json({
        error: '获取订阅者失败'
      }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        message: '暂无活跃订阅者'
      });
    }

    // 3. 发送邮件（使用Resend）
    if (!resendApiKey) {
      // 如果没有配置Resend，返回日报内容供手动发送
      return NextResponse.json({
        message: '邮件服务未配置，日报内容如下',
        subscribers_count: subscribers.length,
        report: reportData.content,
        note: '请在环境变量中配置 RESEND_API_KEY 以启用自动邮件发送'
      });
    }

    // 使用Resend发送邮件
    const emailResults = [];
    for (const subscriber of subscribers as Subscriber[]) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'AI Startup Scout <onboarding@resend.dev>',
            to: subscriber.email,
            subject: `AI创业日报 - ${reportData.date}`,
            html: generateEmailHtml(reportData.content, reportData.date, subscriber.email)
          })
        });

        const emailData = await emailResponse.json();
        emailResults.push({
          email: subscriber.email,
          success: emailResponse.ok,
          id: emailData.id
        });

      } catch (emailError) {
        console.error(`Send email to ${subscriber.email} failed:`, emailError);
        emailResults.push({
          email: subscriber.email,
          success: false,
          error: '发送失败'
        });
      }
    }

    const successCount = emailResults.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      date: reportData.date,
      subscribers_total: subscribers.length,
      emails_sent: successCount,
      results: emailResults
    });

  } catch (error) {
    console.error('Send daily report error:', error);
    return NextResponse.json({
      error: '发送日报失败',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// 生成邮件HTML内容
function generateEmailHtml(content: string, date: string, email: string): string {
  const unsubscribeUrl = `https://ai-startup-scout.vercel.app/api/subscribe?email=${encodeURIComponent(email)}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1A1A1F; color: #F1F5F9; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #252530; border-radius: 12px; padding: 30px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #6366F1; font-size: 24px; margin: 0; }
    .header .date { color: #94A3B8; font-size: 14px; margin-top: 8px; }
    .content { line-height: 1.8; white-space: pre-wrap; }
    .footer { margin-top: 30px; text-align: center; color: #94A3B8; font-size: 12px; }
    .footer a { color: #6366F1; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 AI创业日报</h1>
      <div class="date">${date}</div>
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      <p>由 AI Startup Scout 提供</p>
      <p><a href="${unsubscribeUrl}">取消订阅</a></p>
    </div>
  </div>
</body>
</html>`;
}

// GET: 测试发送日报（用于浏览器直接访问测试）
export async function GET() {
  // 调用 POST 方法进行测试
  const mockRequest = new NextRequest('http://localhost:5000/api/send-daily', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  return POST(mockRequest);
}