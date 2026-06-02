import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AI Startup Scout - AI创业项目搜索',
    template: '%s | AI Startup Scout',
  },
  description:
    '智能搜索AI软件创业项目，获取市场洞察与投资分析。Chrome浏览器扩展，一站式发现AI创业机会。',
  keywords: [
    'AI创业',
    'AI startup',
    '创业项目搜索',
    'AI投资',
    'Chrome扩展',
    'AI工具',
    '创业雷达',
  ],
  authors: [{ name: 'AI Startup Scout' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
