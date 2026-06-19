'use client';

import { useState } from 'react';

export default function EnglishSupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
    } catch {
      // Handle error silently
    }
  };

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
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Support & Feedback</h1>

        {submitted ? (
          <div className="bg-indigo-500/20 border border-indigo-500/50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
            <p className="text-slate-300">Your feedback has been submitted. We&apos;ll get back to you soon.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-[#1A1D27] border border-[#2D3348] rounded-lg focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-[#1A1D27] border border-[#2D3348] rounded-lg focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 bg-[#1A1D27] border border-[#2D3348] rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-medium transition-colors"
            >
              Submit Feedback
            </button>
          </form>
        )}

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-[#2D3348]">
          <h2 className="text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
          <div className="space-y-3 text-slate-400">
            <p>
              Email:{' '}
              <a href="mailto:daily@aistartupscout.com" className="text-indigo-400 hover:text-indigo-300">
                daily@aistartupscout.com
              </a>
            </p>
            <p>
              GitHub:{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300">
                Report issues or contribute
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}