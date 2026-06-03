export default function PrivacyPage() {
  return (
    <article className="min-h-screen bg-[#0F1117] text-[#F1F5F9]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2 text-white">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: June 3, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">1. Introduction</h2>
          <p className="text-slate-300 leading-relaxed">
            AI Startup Scout (&quot;we&quot;, &quot;our&quot;, &quot;the Extension&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we handle data when you use our Chrome browser extension.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">2. Data We Collect</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            We do <strong>not</strong> collect, store, or transmit any personal information. Specifically:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>No personal identification data (name, email, age, etc.)</li>
            <li>No health information</li>
            <li>No financial or payment information</li>
            <li>No authentication credentials</li>
            <li>No personal communications</li>
            <li>No location data</li>
            <li>No web browsing history</li>
            <li>No user activity tracking (clicks, keystrokes, etc.)</li>
            <li>No website content from pages you visit</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">3. Local Storage</h2>
          <p className="text-slate-300 leading-relaxed">
            The Extension uses <code className="bg-[#1A1D27] px-2 py-0.5 rounded text-[#F59E0B]">chrome.storage.local</code> to
            save your bookmarked (favorited) AI startup projects on your device. This data:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-3">
            <li>Is stored <strong>only on your device</strong></li>
            <li>Is <strong>never transmitted</strong> to our servers or any third party</li>
            <li>Can be cleared at any time by removing the Extension or clearing browser data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">4. Search Queries</h2>
          <p className="text-slate-300 leading-relaxed">
            When you perform a search, your search query is sent to our backend API to retrieve relevant AI startup
            information. The query is processed in real-time and is <strong>not stored or logged</strong> on our servers
            after the response is returned. No personal information is included in or associated with search queries.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">5. Third-Party Services</h2>
          <p className="text-slate-300 leading-relaxed">
            The Extension uses backend APIs to provide search and AI analysis features. These services process your
            search queries and return results. They do not receive any personal information from the Extension.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">6. Children&apos;s Privacy</h2>
          <p className="text-slate-300 leading-relaxed">
            The Extension does not knowingly collect information from children under 13 years of age.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">7. Changes to This Policy</h2>
          <p className="text-slate-300 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an
            updated revision date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#6366F1] mb-3">8. Contact</h2>
          <p className="text-slate-300 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:privacy@aistartupscout.com" className="text-[#6366F1] hover:underline">
              privacy@aistartupscout.com
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
