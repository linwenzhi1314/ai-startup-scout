/**
 * @file 隐私政策页面
 * @description AI Startup Scout 扩展的隐私政策，中英文对照版本
 * @route /privacy
 */
export default function PrivacyPage() {
  return (
    <article className="min-h-screen bg-[#0F1117] text-[#F1F5F9]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* 页面标题 */}
        <h1 className="text-3xl font-bold mb-2 text-white">Privacy Policy / 隐私政策</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: June 3, 2026 / 最后更新：2026年6月3日</p>

        {/* 第 1 章：介绍 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">1. Introduction / 介绍</h2>
          <p className="text-slate-300 leading-relaxed">
            AI Startup Scout (&quot;we&quot;, &quot;our&quot;, &quot;the Extension&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we handle data when you use our Chrome browser extension.
          </p>
          <p className="text-slate-300 leading-relaxed mt-3">
            AI Startup Scout（"我们"、"本扩展"）致力于保护您的隐私。本隐私政策说明了您在使用我们的 Chrome 浏览器扩展时，我们如何处理数据。
          </p>
        </section>

        {/* 第 2 章：数据收集 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">2. Data We Collect / 我们收集的数据</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            We do <strong>not</strong> collect, store, or transmit any personal information. Specifically:
          </p>
          <p className="text-slate-300 leading-relaxed mb-3">
            我们<strong>不会</strong>收集、存储或传输任何个人信息。具体而言：
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>No personal identification data (name, email, age, etc.) / 无个人身份数据（姓名、邮箱、年龄等）</li>
            <li>No health information / 无健康信息</li>
            <li>No financial or payment information / 无财务或支付信息</li>
            <li>No authentication credentials / 无身份验证凭据</li>
            <li>No personal communications / 无个人通信内容</li>
            <li>No location data / 无位置数据</li>
            <li>No web browsing history / 无网页浏览历史</li>
            <li>No user activity tracking (clicks, keystrokes, etc.) / 无用户活动追踪（点击、按键等）</li>
            <li>No website content from pages you visit / 无您访问页面的网站内容</li>
          </ul>
        </section>

        {/* 第 3 章：本地存储 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">3. Local Storage / 本地存储</h2>
          <p className="text-slate-300 leading-relaxed">
            The Extension uses <code className="bg-[#1A1D27] px-2 py-0.5 rounded text-[#F59E0B]">chrome.storage.local</code> to
            save your bookmarked (favorited) AI startup projects on your device. This data:
          </p>
          <p className="text-slate-300 leading-relaxed mt-3">
            本扩展使用 <code className="bg-[#1A1D27] px-2 py-0.5 rounded text-[#F59E0B]">chrome.storage.local</code> 在您的设备上保存收藏的 AI 创业项目。此数据：
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-3">
            <li>Is stored <strong>only on your device</strong> / <strong>仅存储在您的设备上</strong></li>
            <li>Is <strong>never transmitted</strong> to our servers or any third party / <strong>绝不会传输</strong>到我们的服务器或任何第三方</li>
            <li>Can be cleared at any time by removing the Extension or clearing browser data / 可随时通过移除扩展或清除浏览器数据来删除</li>
          </ul>
        </section>

        {/* 第 4 章：搜索查询 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">4. Search Queries / 搜索查询</h2>
          <p className="text-slate-300 leading-relaxed">
            When you perform a search, your search query is sent to our backend API to retrieve relevant AI startup
            information. The query is processed in real-time and is <strong>not stored or logged</strong> on our servers
            after the response is returned. No personal information is included in or associated with search queries.
          </p>
          <p className="text-slate-300 leading-relaxed mt-3">
            当您执行搜索时，您的搜索查询会发送到我们的后端 API 以获取相关 AI 创业项目信息。查询会实时处理，在响应返回后<strong>不会在我们的服务器上存储或记录</strong>。搜索查询中不包含也不会关联任何个人信息。
          </p>
        </section>

        {/* 第 5 章：第三方服务 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">5. Third-Party Services / 第三方服务</h2>
          <p className="text-slate-300 leading-relaxed">
            The Extension uses backend APIs to provide search and AI analysis features. These services process your
            search queries and return results. They do not receive any personal information from the Extension.
          </p>
          <p className="text-slate-300 leading-relaxed mt-3">
            本扩展使用后端 API 提供搜索和 AI 分析功能。这些服务处理您的搜索查询并返回结果，不会从扩展接收任何个人信息。
          </p>
        </section>

        {/* 第 6 章：儿童隐私 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">6. Children&apos;s Privacy / 儿童隐私</h2>
          <p className="text-slate-300 leading-relaxed">
            The Extension does not knowingly collect information from children under 13 years of age.
          </p>
          <p className="text-slate-300 leading-relaxed mt-3">
            本扩展不会故意收集 13 岁以下儿童的信息。
          </p>
        </section>

        {/* 第 7 章：政策变更 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">7. Changes to This Policy / 政策变更</h2>
          <p className="text-slate-300 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an
            updated revision date.
          </p>
          <p className="text-slate-300 leading-relaxed mt-3">
            我们可能会不时更新本隐私政策。任何变更将在此页面上以更新日期的形式体现。
          </p>
        </section>

        {/* 第 8 章：联系方式 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">8. Contact / 联系方式</h2>
          <p className="text-slate-300 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:privacy@aistartupscout.com" className="text-[#6366F1] hover:underline">
              privacy@aistartupscout.com
            </a>
          </p>
          <p className="text-slate-300 leading-relaxed mt-3">
            如果您对本隐私政策有疑问，请通过以下邮箱联系我们：{' '}
            <a href="mailto:privacy@aistartupscout.com" className="text-[#6366F1] hover:underline">
              privacy@aistartupscout.com
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
