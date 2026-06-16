import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

//兼容NEXT_PUBLIC前缀的变量名
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY;

// 测试邮箱 - 只在测试模式下使用
const TEST_EMAIL = 'linwenzhi1314@gmail.com';

interface Subscriber {
  email: string;
  tags: string | null;
}

// 发送日报邮件给所有订阅者
export async function POST(request: NextRequest) {
  try {
    // 检查是否是测试模式
    const requestUrl = new URL(request.url);
    const isTestMode = requestUrl.searchParams.get('test') === 'true';
    
    // 1. 获取日报内容（调用daily-report API）
    // 在 Vercel 环境中使用 VERCEL_URL 或 COZE_PROJECT_DOMAIN_DEFAULT
    let baseUrl: string;
    const vercelUrl = process.env.VERCEL_URL;
    const cozeDomain = process.env.COZE_PROJECT_DOMAIN_DEFAULT;
    
    if (vercelUrl) {
      baseUrl = `https://${vercelUrl}`;
      console.log('Using VERCEL_URL:', vercelUrl);
    } else if (cozeDomain) {
      baseUrl = cozeDomain;
      console.log('Using COZE_PROJECT_DOMAIN_DEFAULT:', cozeDomain);
    } else {
      // Fallback: 使用硬编码的生产域名
      baseUrl = 'https://ai-startup-scout.vercel.app';
      console.log('Using fallback URL:', baseUrl);
    }
    
    console.log('Calling daily-report API:', `${baseUrl}/api/daily-report`);
    console.log('Mode:', isTestMode ? 'TEST (only send to test email)' : 'PRODUCTION (send to all subscribers)');
    
    const reportResponse = await fetch(`${baseUrl}/api/daily-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: 'zh' })
    });

    const reportData = await reportResponse.json();
    
    if (!reportData.success) {
      return NextResponse.json({
        error: '日报生成失败',
        details: reportData.error
      }, { status: 500 });
    }

    // 2. 获取订阅者列表
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    let subscribers: Subscriber[];
    
    if (isTestMode) {
      // 测试模式：只发送到测试邮箱
      subscribers = [{ email: TEST_EMAIL, tags: 'test' }];
      console.log('Test mode: sending only to', TEST_EMAIL);
    } else {
      // 正式模式：获取所有活跃订阅者
      const { data, error: subError } = await supabase
        .from('subscribers')
        .select('email, tags')
        .eq('is_active', true);

      if (subError) {
        console.error('Fetch subscribers error:', subError);
        return NextResponse.json({
          error: '获取订阅者失败'
        }, { status: 500 });
      }

      subscribers = data || [];
      console.log('Production mode: found', subscribers.length, 'subscribers');
    }

    if (subscribers.length === 0) {
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
            html: generateEmailHtml(reportData.report, reportData.date, subscriber.email)
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
  
  // 简单的 Markdown 转 HTML
  const htmlContent = content
    .replace(/## (.*)/g, '<h2 style="color: #6366F1; font-size: 18px; margin: 20px 0 10px 0;">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #6366F1;">$1</strong>')
    .replace(/\n\n/g, '</p><p style="margin: 10px 0; line-height: 1.6;">')
    .replace(/^\d+\. /g, '<br/><span style="color: #F59E0B;">•</span> ')
    .replace(/"/g, '"');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #333333; padding: 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
    <div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #6366F1;">
      <h1 style="color: #6366F1; font-size: 24px; margin: 0;">🚀 AI创业日报</h1>
      <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0 0;">${date}</p>
    </div>
    <div style="line-height: 1.6; color: #333333;">
      <p style="margin: 10px 0; line-height: 1.6;">${htmlContent}</p>
    </div>
    <div style="margin-top: 30px; text-align: center; color: #94a3b8; font-size: 12px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 5px 0;">由 AI Startup Scout 提供</p>
      <p style="margin: 5px 0;"><a href="${unsubscribeUrl}" style="color: #6366F1; text-decoration: none;">取消订阅</a></p>
    </div>
  </div>
</body>
</html>`;
}

// GET: 测试发送日报（用于浏览器直接访问测试）
export async function GET(request: NextRequest) {
  // 使用真实请求的 URL
  return POST(request);
}