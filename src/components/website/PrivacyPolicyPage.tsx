/**
 * Wonder World Kids Website - Privacy Policy & COPPA/GDPR-K Compliance Page (/privacy)
 */

import React from 'react';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { getRoutePath } from '../../services/seoManager';
import { soundEngine } from '../../services/soundEngine';

interface PrivacyPolicyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const handleLink = (e: React.MouseEvent, route: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FBFF] text-[#0F294A] font-body pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sky-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleLink(e, 'home')}
              className="hover:text-[#0F294A] transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0F294A] font-bold">Privacy Policy</span>
          </nav>
          <span className="font-semibold text-emerald-700 inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Child Data Tracking</span>
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-10">
        <div className="bg-white rounded-3xl border-2 border-sky-200 p-8 sm:p-12 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-sky-100 pb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-700 font-fun mb-1">
              COPPA &amp; GDPR-K Compliance
            </p>
            <h1 className="text-2xl sm:text-4xl font-black font-fun text-[#0F294A] mb-2">
              Privacy Policy &amp; Children&apos;s Privacy
            </h1>
            <p className="text-xs text-slate-500">Last updated: November 2026</p>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-black font-fun text-[#0F294A]">1. Overview</h2>
            <p>
              Wonder World Kids Learning (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is deeply committed to protecting the privacy of children and families worldwide. This Privacy Policy explains our practices when you use our offline educational game suite, website, and digital printables marketplace.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black font-fun text-[#0F294A]">
              2. Children&apos;s Online Privacy Protection Act (COPPA), UK Children&apos;s Code &amp; GDPR-K
            </h2>
            <p>
              We strictly comply with COPPA, GDPR-K, and international children&apos;s privacy standards. We do not collect personal information from children under 13. All gameplay progress, avatars, sticker albums, and star ratings are stored locally on your device via browser local storage and are never transmitted to external servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black font-fun text-[#0F294A]">
              3. Zero Third-Party Ads &amp; Zero Behavioral Tracking
            </h2>
            <p>
              Wonder World Kids Learning contains <strong className="text-[#0F294A]">zero ads</strong>, zero behavioral tracking pixels, and zero third-party advertising SDKs inside children&apos;s games. External marketplace links and license verification are gated for parents.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black font-fun text-[#0F294A]">4. Contact Us</h2>
            <p>
              If you have any questions regarding our privacy practices, please contact us at{' '}
              <a
                href="mailto:wonderworldkidslearning@gmail.com"
                className="text-sky-700 font-bold hover:underline"
              >
                wonderworldkidslearning@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
