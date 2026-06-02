import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET() {
  const extensionDir = path.join(process.cwd(), 'public', 'extension');

  if (!fs.existsSync(extensionDir)) {
    return NextResponse.json({ error: 'Extension directory not found' }, { status: 404 });
  }

  try {
    const zipPath = path.join(process.cwd(), 'public', 'ai-startup-scout.zip');

    // Create zip file
    execSync(`cd ${extensionDir} && zip -r ${zipPath} .`, { stdio: 'pipe' });

    const zipBuffer = fs.readFileSync(zipPath);

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="ai-startup-scout.zip"',
      },
    });
  } catch (error) {
    console.error('[Download Error]', error);
    return NextResponse.json({ error: 'Failed to package extension' }, { status: 500 });
  }
}
