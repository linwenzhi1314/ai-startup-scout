/**
 * @file 中文版隐私政策页面 (zh-Hans)
 * @description AI Startup Scout 扩展的隐私政策
 * @route /zh-Hans/privacy
 */
export default function PrivacyPage() {
  return (
    <article className="min-h-screen bg-[#0F1117] text-[#F1F5F9]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* 页面标题 */}
        <h1 className="text-3xl font-bold mb-2 text-white">隐私政策</h1>
        <p className="text-slate-400 text-sm mb-10">最后更新：2026年6月3日</p>

        {/* 第 1 章：介绍 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">1. 介绍</h2>
          <p className="text-slate-300 leading-relaxed">
            AI Startup Scout（"我们"、"本扩展"）致力于保护您的隐私。本隐私政策说明了您在使用我们的 Chrome 浏览器扩展时，我们如何处理数据。
          </p>
        </section>

        {/* 第 2 章：数据收集 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">2. 我们收集的数据</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            我们<strong>不会</strong>收集、存储或传输任何个人信息。具体而言：
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>无个人身份数据（姓名、邮箱、年龄等）</li>
            <li>无健康信息</li>
            <li>无财务或支付信息</li>
            <li>无身份验证凭据</li>
            <li>无个人通信内容</li>
            <li>无位置数据</li>
            <li>无网页浏览历史</li>
            <li>无用户活动追踪（点击、按键等）</li>
            <li>无您访问页面的网站内容</li>
          </ul>
        </section>

        {/* 第 3 章：本地存储 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">3. 本地存储</h2>
          <p className="text-slate-300 leading-relaxed">
            本扩展使用 <code className="bg-[#1A1D27] px-2 py-0.5 rounded text-[#F59E0B]">chrome.storage.local</code> 在您的设备上保存收藏的 AI 创业项目。此数据：
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-3">
            <li><strong>仅存储在您的设备上</strong></li>
            <li><strong>绝不会传输</strong>到我们的服务器或任何第三方</li>
            <li>可随时通过移除扩展或清除浏览器数据来删除</li>
          </ul>
        </section>

        {/* 第 4 章：搜索查询 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">4. 搜索查询</h2>
          <p className="text-slate-300 leading-relaxed">
            当您执行搜索时，您的搜索查询会发送到我们的后端 API 以获取相关 AI 创业项目信息。查询会实时处理，在响应返回后<strong>不会在我们的服务器上存储或记录</strong>。搜索查询中不包含也不会关联任何个人信息。
          </p>
        </section>

        {/* 第 5 章：第三方服务 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">5. 第三方服务</h2>
          <p className="text-slate-300 leading-relaxed">
            本扩展使用后端 API 提供搜索和 AI 分析功能。这些服务处理您的搜索查询并返回结果，不会从扩展接收任何个人信息。
          </p>
        </section>

        {/* 第 6 章：儿童隐私 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">6. 儿童隐私</h2>
          <p className="text-slate-300 leading-relaxed">
            本扩展不会故意收集 13 岁以下儿童的信息。
          </p>
        </section>

        {/* 第 7 章：政策变更 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">7. 政策变更</h2>
          <p className="text-slate-300 leading-relaxed">
            我们可能会不时更新本隐私政策。任何变更将在此页面上以更新日期的形式体现。
          </p>
        </section>

        {/* 第 8 章：联系方式 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">8. 联系方式</h2>
          <p className="text-slate-300 leading-relaxed">
            如果您对本隐私政策有疑问，请通过我们的{' '}
            <a href="/zh-Hans/support" className="text-[#6366F1] hover:underline">
              支持与反馈
            </a>{' '}
            页面联系我们。
          </p>
        </section>
      </div>
    </article>
  );
}