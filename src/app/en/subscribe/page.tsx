/**
 * @file Email subscription landing page (English)
 * @description Users can subscribe to AI Startup Daily Report
 */

'use client';

import { useState } from 'react';

// Interest tag options
const INTEREST_TAGS = [
  { id: 'investor', label: 'Investor', desc: 'Focus on investment opportunities and market trends' },
  { id: 'founder', label: 'Founder', desc: 'Find startup ideas and competitor insights' },
  { id: 'worker', label: 'Professional', desc: 'Explore industry opportunities and career growth' },
];

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle tag selection
  const handleTagClick = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId) 
        : [...prev, tagId]
    );
  };

  // Submit subscription
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    if (selectedTags.length === 0) {
      setErrorMessage('Please select at least one interest tag');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tags: selectedTags }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSubmitStatus('success');
        setEmail('');
        setSelectedTags([]);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Subscription failed, please try again');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Network error, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[100px]" style={{ animationDuration: '4s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <a href="/en" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">AI Startup Scout</span>
        </a>
        <a href="/en" className="text-sm text-slate-400 hover:text-white transition-colors">Back to Home</a>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="w-full max-w-md">
          {/* Title section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="text-xs text-amber-300">Daily Delivery</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Subscribe to AI Startup Daily
            </h1>
            <p className="text-slate-400 text-base md:text-lg">
              Curated AI startup insights delivered to your inbox every morning at 8 AM
            </p>
          </div>

          {/* Subscription form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-[#1A1D27] border border-[#2D3348] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            {/* Interest tags */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Your Role (Multi-select)
              </label>
              <div className="space-y-3">
                {INTEREST_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagClick(tag.id)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${
                      selectedTags.includes(tag.id)
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                        : 'bg-[#1A1D27] border-[#2D3348] text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedTags.includes(tag.id)
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-slate-500'
                      }`}>
                        {selectedTags.includes(tag.id) && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">{tag.label}</span>
                        <span className="text-xs ml-2 opacity-70">{tag.desc}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Success message */}
            {submitStatus === 'success' && (
              <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                Successfully subscribed! We'll send daily reports to your inbox every morning at 8 AM.
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/25'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Subscribe Now
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-500">
            We respect your privacy and won't use your email for other purposes. Unsubscribe anytime.
          </p>
        </div>
      </main>
    </div>
  );
}