'use client';

import Link from 'next/link';
import { translations, Locale } from '@/lib/i18n/translations';

interface TermsPageContentProps {
  locale: Locale;
}

export default function TermsPageContent({ locale }: TermsPageContentProps) {
  const t = translations[locale];
  const basePath = locale === 'zh-Hans' ? '/zh-Hans' : '/en';

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#F1F5F9]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0F1117]/80 backdrop-blur-md border-b border-[#2D3348] z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={basePath} className="text-xl font-bold text-[#F1F5F9]">
            AI Startup Scout
          </Link>
          <Link href={basePath} className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">
            {locale === 'zh-Hans' ? '返回首页' : 'Back to Home'}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {locale === 'zh-Hans' ? '服务条款' : 'Terms of Service'}
        </h1>
        
        <div className="space-y-6 text-[#94A3B8] leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '1. 服务说明' : '1. Service Description'}
            </h2>
            <p>
              {locale === 'zh-Hans' 
                ? 'AI Startup Scout 是一款 Chrome 浏览器扩展，用于搜索 AI 软件创业项目，提供市场洞察与投资分析。我们提供免费版和付费订阅服务。'
                : 'AI Startup Scout is a Chrome browser extension designed to search for AI software startup projects, providing market insights and investment analysis. We offer both free and paid subscription services.'}
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '2. 用户注册' : '2. User Registration'}
            </h2>
            <p>
              {locale === 'zh-Hans'
                ? '使用我们的服务需要注册账户。您需要提供真实、准确的个人信息，并对其安全性负责。我们有权拒绝或终止违反条款的账户。'
                : 'Registration is required to use our services. You must provide true and accurate personal information and be responsible for its security. We reserve the right to reject or terminate accounts that violate these terms.'}
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '3. 付费订阅' : '3. Paid Subscriptions'}
            </h2>
            <p>
              {locale === 'zh-Hans'
                ? '付费订阅服务按月或按次收费。订阅将在每个计费周期开始时自动续费，除非您在当前周期结束前取消。取消订阅后，您仍可使用服务直至当前周期结束。'
                : 'Paid subscription services are charged monthly or per use. Subscriptions will automatically renew at the beginning of each billing cycle unless you cancel before the current cycle ends. After cancellation, you can still use the service until the end of the current cycle.'}
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '4. 退款政策' : '4. Refund Policy'}
            </h2>
            <p>
              {locale === 'zh-Hans'
                ? '订阅服务不支持退款，但您可以随时取消订阅。一次性服务（如企业对接服务）在服务开始前可申请退款，服务开始后不支持退款。'
                : 'Subscription services do not support refunds, but you can cancel at any time. One-time services (such as enterprise matchmaking services) can be refunded before the service starts, but not after the service has begun.'}
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '5. 内容与数据' : '5. Content and Data'}
            </h2>
            <p>
              {locale === 'zh-Hans'
                ? '我们提供的 AI 创业项目信息来源于公开渠道和网络搜索。我们不保证信息的完整性和准确性。日报内容为 AI 生成的分析摘要，仅供参考，不构成投资建议。'
                : 'The AI startup project information we provide comes from public sources and web searches. We do not guarantee the completeness or accuracy of the information. The daily report content is AI-generated analysis summaries for reference only and does not constitute investment advice.'}
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '6. 用户行为' : '6. User Conduct'}
            </h2>
            <p>
              {locale === 'zh-Hans'
                ? '您同意不会利用我们的服务从事违法行为，包括但不限于：侵犯知识产权、传播恶意软件、进行网络攻击等。违反这些规定将导致账户终止。'
                : 'You agree not to use our services for illegal activities, including but not limited to: infringing intellectual property rights, spreading malware, conducting cyber attacks, etc. Violation of these rules will result in account termination.'}
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '7. 隐私保护' : '7. Privacy Protection'}
            </h2>
            <p>
              {locale === 'zh-Hans'
                ? '我们重视用户隐私，请参阅我们的隐私政策了解我们如何收集、使用和保护您的个人信息。'
                : 'We value user privacy. Please refer to our Privacy Policy to learn how we collect, use, and protect your personal information.'}
            </p>
            <Link 
              href={`${basePath}/privacy`} 
              className="text-[#6366F1] hover:text-[#6366F1]/80 underline mt-2 inline-block"
            >
              {locale === 'zh-Hans' ? '查看隐私政策' : 'View Privacy Policy'}
            </Link>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '8. 服务变更与终止' : '8. Service Changes and Termination'}
            </h2>
            <p>
              {locale === 'zh-Hans'
                ? '我们有权随时修改或终止服务。重大变更将提前通知用户。如因服务终止导致付费用户损失，我们将按比例退还剩余订阅费用。'
                : 'We reserve the right to modify or terminate services at any time. Major changes will be notified to users in advance. If service termination causes losses to paid users, we will refund the remaining subscription fees proportionally.'}
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '9. 责任限制' : '9. Limitation of Liability'}
            </h2>
            <p>
              {locale === 'zh-Hans'
                ? '在法律允许范围内，我们对因使用或无法使用服务而产生的任何损失不承担责任。我们不保证服务不会中断或无错误。'
                : 'To the extent permitted by law, we are not liable for any losses resulting from the use or inability to use our services. We do not guarantee that the service will be uninterrupted or error-free.'}
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '10. 条款更新' : '10. Terms Updates'}
            </h2>
            <p>
              {locale === 'zh-Hans'
                ? '我们可能会不时更新本服务条款。更新后的条款将在本页面发布，继续使用服务即表示您接受更新后的条款。'
                : 'We may update these Terms of Service from time to time. Updated terms will be published on this page, and continued use of the service indicates your acceptance of the updated terms.'}
            </p>
          </section>

          {/* Contact */}
          <section className="pt-8 border-t border-[#2D3348]">
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '联系我们' : 'Contact Us'}
            </h2>
            <p>
              {locale === 'zh-Hans'
                ? '如果您对服务条款有任何疑问，请联系我们：'
                : 'If you have any questions about our Terms of Service, please contact us:'}
            </p>
            <Link 
              href={`${basePath}/support`} 
              className="text-[#6366F1] hover:text-[#6366F1]/80 underline mt-2 inline-block"
            >
              {locale === 'zh-Hans' ? '支持与反馈' : 'Support & Feedback'}
            </Link>
          </section>

          {/* Last Updated */}
          <p className="text-sm text-[#64748B] pt-4">
            {locale === 'zh-Hans' 
              ? '最后更新：2025年1月'
              : 'Last updated: January 2025'}
          </p>
        </div>
      </main>
    </div>
  );
}