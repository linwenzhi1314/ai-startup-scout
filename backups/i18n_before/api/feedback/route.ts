import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

const FEEDBACK_TYPES = ['bug', 'feature', 'other'] as const;
type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email, content } = body as {
      type?: string;
      email?: string;
      content?: string;
    };

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Content must be less than 2000 characters' },
        { status: 400 }
      );
    }

    const feedbackType: FeedbackType = FEEDBACK_TYPES.includes(type as FeedbackType)
      ? (type as FeedbackType)
      : 'other';

    const sanitizedEmail =
      email && typeof email === 'string' && email.length <= 255
        ? email.trim()
        : null;

    const userAgent = request.headers.get('user-agent') || null;

    const supabase = getSupabaseClient();
    const { error } = await supabase.from('feedback').insert({
      type: feedbackType,
      email: sanitizedEmail,
      content: content.trim(),
      user_agent: userAgent,
    });

    if (error) {
      console.error('Failed to insert feedback:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Feedback API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
