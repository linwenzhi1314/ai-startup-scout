import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

//兼容NEXT_PUBLIC前缀的变量名
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, tags } = body;

    // 验证邮箱
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 使用service role client（绕过RLS）
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 检查是否已订阅
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single();

    if (existing) {
      // 已存在，更新状态为活跃
      const { error } = await supabase
        .from('subscribers')
        .update({
          is_active: 'true',
          tags: tags ? JSON.stringify(tags) : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Update subscriber error:', error);
        return NextResponse.json(
          { error: '更新订阅失败' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '订阅已重新激活'
      });
    }

    // 新订阅
    const { error } = await supabase
      .from('subscribers')
      .insert({
        email,
        tags: tags ? JSON.stringify(tags) : null,
        is_active: 'true'
      });

    if (error) {
      console.error('Insert subscriber error:', error);
      return NextResponse.json(
        { error: '订阅失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '订阅成功！您将收到每日AI创业项目日报。'
    });

  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// GET: 取消订阅
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: '缺少邮箱参数' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('subscribers')
      .update({
        is_active: 'false',
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) {
      console.error('Unsubscribe error:', error);
      return NextResponse.json(
        { error: '取消订阅失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '已取消订阅'
    });

  } catch (error) {
    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}