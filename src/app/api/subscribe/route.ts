import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function createClient(url: string, key: string) {
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
  return createSupabaseClient(url, key);
}

// POST: 订阅
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Subscribe API: Missing Supabase credentials');
      return NextResponse.json(
        { error: '服务配置错误，请稍后重试' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 构建 tags：将 role 转为数组
    const tagsArray = role ? [role] : [];
    const tagsStr = tagsArray.length > 0 ? JSON.stringify(tagsArray) : null;

    // 检查是否已订阅
    const { data: existing, error: queryError } = await supabase
      .from('subscribers')
      .select('id, is_active')
      .eq('email', email)
      .maybeSingle();

    if (queryError) {
      console.error('Query subscriber error:', queryError);
      return NextResponse.json(
        { error: '查询失败，请稍后重试' },
        { status: 500 }
      );
    }

    if (existing) {
      // 已存在，更新状态为活跃
      const { error } = await supabase
        .from('subscribers')
        .update({
          is_active: 'true',
          tags: tagsStr,
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
        message: '该邮箱已订阅，无需重复订阅'
      });
    }

    // 新订阅
    const { error } = await supabase
      .from('subscribers')
      .insert({
        email,
        tags: tagsStr,
        is_active: 'true'
      });

    if (error) {
      console.error('Insert subscriber error:', error);
      return NextResponse.json(
        { error: `订阅失败: ${error.message || JSON.stringify(error)}` },
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

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: '服务配置错误' },
        { status: 500 }
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
