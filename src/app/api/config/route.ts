import { NextResponse } from 'next/server';

export async function GET() {
  const domain = process.env.COZE_PROJECT_DOMAIN_DEFAULT || '';

  return NextResponse.json({
    apiBase: domain || '',
    extensionVersion: '1.1.0',
  });
}
