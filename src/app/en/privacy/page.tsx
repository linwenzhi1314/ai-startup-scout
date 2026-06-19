export default function EnglishPrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0F1117] text-white">
      {/* Navigation */}
      <nav className="border-b border-[#2D3348] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/en" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold">AI Startup Scout</span>
          </a>
          <a href="/en" className="text-slate-400 hover:text-white">← Back to Home</a>
        </div>
      </nav>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">1. Information We Collect</h2>
            <p className="leading-relaxed">
              When you subscribe to our AI Startup Daily newsletter, we collect your email address and optionally your identity type (Investor, Founder, or Enthusiast). When you use our Chrome extension, we collect usage statistics through Google Analytics, including:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Extension open/close events</li>
              <li>Search queries performed</li>
              <li>AI analysis usage</li>
              <li>Favorite/bookmark actions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">2. How We Use Your Information</h2>
            <p className="leading-relaxed">
              We use your email address solely to send the AI Startup Daily newsletter. We use analytics data to improve our product and understand user behavior. We do not sell, rent, or share your personal information with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">3. Data Storage</h2>
            <p className="leading-relaxed">
              Your subscription data is stored securely using Supabase, a PostgreSQL database with enterprise-grade security. Analytics data is processed by Google Analytics 4 following their data retention policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">4. Your Rights</h2>
            <p className="leading-relaxed">
              You can unsubscribe from our newsletter at any time by clicking the unsubscribe link in any email. You can opt out of analytics tracking by disabling analytics in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">5. Cookies</h2>
            <p className="leading-relaxed">
              Our website uses cookies for analytics and to remember your language preference. You can disable cookies in your browser settings if you prefer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">6. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:daily@aistartupscout.com" className="text-indigo-400 hover:text-indigo-300">
                daily@aistartupscout.com
              </a>
            </p>
          </section>

          <section>
            <p className="text-slate-500 text-sm">
              Last updated: June 2024
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}