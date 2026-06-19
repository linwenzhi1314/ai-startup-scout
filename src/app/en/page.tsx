'use client';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function EnglishHomePage() {
  return (
    <main className="min-h-screen bg-[#0F1117] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1117]/80 backdrop-blur-sm border-b border-[#2D3348]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-lg">AI Startup Scout</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/en" className="text-slate-400 hover:text-white transition-colors">Home</a>
            <a href="/en#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="/en#subscribe" className="text-slate-400 hover:text-white transition-colors">Subscribe</a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href="/api/download"
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-colors"
            >
              Install Extension
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover <span className="text-indigo-400">AI Startup</span> Projects Instantly
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-xl">
              A Chrome extension that helps you search and analyze AI startup projects, funding trends, and market insights with AI-powered deep analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="/api/download"
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Install Now
              </a>
              <a
                href="https://chromewebstore.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
              >
                Chrome Web Store
              </a>
            </div>
          </div>

          {/* Right Visual */}
          <div className="flex-1">
            <div className="bg-[#1A1D27] rounded-2xl p-6 border border-[#2D3348] shadow-xl">
              <div className="bg-[#0F1117] rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="bg-slate-700 rounded px-3 py-1 text-sm text-slate-300 flex-1">
                      AI healthcare startup...
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-400">Search AI startup projects instantly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-[#1A1D27]/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#1A1D27] rounded-xl p-6 border border-indigo-500/30 hover:border-indigo-500 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Search</h3>
              <p className="text-slate-400 text-sm">
                Search AI startup projects by keywords, categories, and funding status. Get comprehensive project profiles instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1A1D27] rounded-xl p-6 border border-[#2D3348] hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.954-.192-1.874-.548-2.87l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
              <p className="text-slate-400 text-sm">
                Deep analysis powered by AI. Get market insights, competitive landscape, and investment recommendations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1A1D27] rounded-xl p-6 border border-[#2D3348] hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Daily Report</h3>
              <p className="text-slate-400 text-sm">
                Subscribe to daily AI startup digest. Stay updated with the latest funding news and trending projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How to Use</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Install Extension</h3>
              <p className="text-slate-400 text-sm max-w-xs">
                Download and install from Chrome Web Store or directly from our website.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Search Projects</h3>
              <p className="text-slate-400 text-sm max-w-xs">
                Click the extension icon and search for AI startup projects by keywords.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Get Insights</h3>
              <p className="text-slate-400 text-sm max-w-xs">
                Use AI Analysis to get deep insights and market trends for any project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section id="subscribe" className="py-20 px-6 bg-[#1A1D27]/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to AI Startup Daily</h2>
          <p className="text-slate-400 mb-8">
            Every morning at 8 AM, curated AI startup news delivered to your inbox.
          </p>

          {/* Subscribe Form */}
          <form action="/api/subscribe" method="POST" className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              className="px-4 py-3 bg-[#1A1D27] border border-[#2D3348] rounded-lg text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none flex-1 max-w-md"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-medium transition-colors"
            >
              Subscribe
            </button>
          </form>

          {/* Identity Selection */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <button type="button" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
              Investor
            </button>
            <button type="button" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
              Founder
            </button>
            <button type="button" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
              Enthusiast
            </button>
          </div>

          <p className="text-slate-500 text-sm">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#2D3348]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left - Logo */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm text-slate-400">© 2024 AI Startup Scout</span>
          </div>

          {/* Center - Links */}
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="/en/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/en/support" className="hover:text-white transition-colors">Support</a>
          </div>

          {/* Right - Language */}
          <LanguageSwitcher />
        </div>
      </footer>
    </main>
  );
}