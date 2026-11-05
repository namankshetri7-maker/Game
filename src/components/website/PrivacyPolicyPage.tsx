/**
 * Wonder World Kids Website - Privacy Policy & COPPA/GDPR-K Compliance Page
 */

import React from 'react';

interface PrivacyPolicyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-3xl border border-slate-700 p-8 sm:p-12 shadow-xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        <h1 className="text-3xl font-black font-fun text-white mb-4">Privacy Policy & Children's Privacy</h1>
        <p className="text-xs text-slate-400">Last updated: November 2026</p>

        <h2 className="text-lg font-bold font-fun text-white pt-4">1. Overview</h2>
        <p>
          Wonder World Kids ("we", "our", or "us") is deeply committed to protecting the privacy of children and families. This Privacy Policy explains our practices regarding information collection when you use our educational game suite and website.
        </p>

        <h2 className="text-lg font-bold font-fun text-white pt-4">2. Children's Online Privacy Protection Act (COPPA) & GDPR-K</h2>
        <p>
          We strictly comply with COPPA, GDPR-K, and international children's privacy standards. We do not knowingly collect personal information from children under 13. All gameplay progress, avatars, and star ratings are stored locally on your device via browser local storage and are never transmitted to our servers.
        </p>

        <h2 className="text-lg font-bold font-fun text-white pt-4">3. Third-Party Ads & Tracking</h2>
        <p>
          Wonder World Kids contains <strong className="text-white">zero ads</strong>, zero behavioral tracking pixels, and zero third-party analytics SDKs.
        </p>

        <h2 className="text-lg font-bold font-fun text-white pt-4">4. Contact Us</h2>
        <p>
          If you have any questions regarding our privacy practices, please contact us at <span className="text-amber-300 font-bold">privacy@wonderworldkidslearning.space</span>.
        </p>
      </div>
    </div>
  );
};
