/**
 * @file Support Page（支持/反馈页）
 * @description 用户反馈收集页面，包含：
 *              - 反馈类型选择（Bug / 功能建议 / 其他）
 *              - 邮箱输入（可选）
 *              - 反馈内容输入
 *              - 提交成功/失败提示
 */

'use client';

import { useState, FormEvent } from 'react';

type FeedbackType = 'bug' | 'feature' | 'other';

const feedbackTypes: { value: FeedbackType; label: string; labelEn: string; icon: string }[] = [
  { value: 'bug', label: '问题反馈', labelEn: 'Bug Report', icon: '🐛' },
  { value: 'feature', label: '功能建议', labelEn: 'Feature Request', icon: '💡' },
  { value: 'other', label: '其他', labelEn: 'Other', icon: '💬' },
];

export default function SupportPage() {
  const [type, setType] = useState<FeedbackType>('bug');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          email: email.trim() || null,
          content: content.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult('success');
        setContent('');
        setEmail('');
      } else {
        setResult('error');
      }
    } catch {
      setResult('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0F1117', color: '#F1F5F9' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: '#2D3348' }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: '#6366F1', color: '#fff' }}
          >
            AI
          </div>
          <span className="font-semibold text-base">AI Startup Scout</span>
          <a
            href="/"
            className="ml-auto text-sm hover:underline"
            style={{ color: '#94A3B8' }}
          >
            ← 返回首页
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">帮助与反馈</h1>
        <p className="mb-8" style={{ color: '#94A3B8' }}>
          遇到问题或有改进建议？我们很乐意听取您的反馈。
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium mb-3">反馈类型</label>
            <div className="flex gap-3">
              {feedbackTypes.map((ft) => (
                <button
                  key={ft.value}
                  type="button"
                  onClick={() => setType(ft.value)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: type === ft.value ? '#6366F1' : '#1A1D27',
                    color: type === ft.value ? '#fff' : '#94A3B8',
                    border: type === ft.value ? '1px solid #6366F1' : '1px solid #2D3348',
                  }}
                >
                  <span>{ft.icon}</span>
                  <span>{ft.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              邮箱 <span style={{ color: '#94A3B8' }}>(可选，方便我们回复您)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all focus:ring-2"
              style={{
                background: '#1A1D27',
                color: '#F1F5F9',
                border: '1px solid #2D3348',
              }}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">反馈内容 *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请描述您遇到的问题或建议..."
              rows={6}
              maxLength={2000}
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-y transition-all focus:ring-2"
              style={{
                background: '#1A1D27',
                color: '#F1F5F9',
                border: '1px solid #2D3348',
              }}
            />
            <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>
              {content.length} / 2000
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="w-full py-3 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
            style={{
              background: submitting || !content.trim() ? '#2D3348' : '#6366F1',
              color: '#fff',
            }}
          >
            {submitting ? '提交中...' : '提交反馈'}
          </button>
        </form>

        {/* Result */}
        {result === 'success' && (
          <div
            className="mt-6 p-4 rounded-lg text-sm"
            style={{ background: '#064E3B', color: '#6EE7B7', border: '1px solid #065F46' }}
          >
            感谢您的反馈！我们会认真阅读每一条建议。
          </div>
        )}
        {result === 'error' && (
          <div
            className="mt-6 p-4 rounded-lg text-sm"
            style={{ background: '#7F1D1D', color: '#FCA5A5', border: '1px solid #991B1B' }}
          >
            提交失败，请稍后重试。您也可以发送邮件至 support@aistartupscout.com
          </div>
        )}

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-lg font-bold mb-6">常见问题</h2>
          <div className="space-y-4">
            {[
              {
                q: '搜索结果加载较慢怎么办？',
                a: '搜索服务部署在海外服务器，国内访问可能有一定延迟。我们正在优化网络链路以提升速度。',
              },
              {
                q: '如何安装 Chrome 扩展？',
                a: '访问首页下载 ZIP 文件，解压后在 chrome://extensions/ 中开启开发者模式，点击"加载已解压的扩展程序"选择解压文件夹即可。',
              },
              {
                q: '支持哪些浏览器？',
                a: '目前仅支持 Chrome 浏览器（基于 Chromium 的浏览器如 Edge 也可使用）。移动端暂不支持。',
              },
              {
                q: '搜索数据来源是什么？',
                a: '我们使用 Tavily 搜索引擎聚合全网 AI 创业项目信息，并通过 AI 进行深度分析和整理。',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-4 rounded-lg"
                style={{ background: '#1A1D27', border: '1px solid #2D3348' }}
              >
                <div className="font-medium text-sm mb-1">{faq.q}</div>
                <div className="text-sm" style={{ color: '#94A3B8' }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-12"
        style={{ borderColor: '#2D3348' }}
      >
        <div className="max-w-2xl mx-auto px-6 py-6 text-center text-xs" style={{ color: '#94A3B8' }}>
          © {new Date().getFullYear()} AI Startup Scout · All rights reserved
        </div>
      </footer>
    </div>
  );
}
