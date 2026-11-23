/**
 * Wonder World Kids Website - Parent FAQ Page (/faq)
 */

import React from 'react';
import { HelpCircle, ArrowLeft, Mail, ChevronRight } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';

interface FAQPageProps {
  onNavigate: (route: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'What is Wonder World Kids Learning?',
      a: 'An ad-free, 100% offline educational game suite featuring 45 interactive mini-games across 5 magical worlds (Math, Reading & Phonics, World Geography, Animal Science, and Logic) plus printable colouring and early learning workbooks for children aged 3–8.',
    },
    {
      q: 'Does it work 100% offline without Wi-Fi?',
      a: 'Yes! Once installed to your home screen as a Progressive Web App (PWA) on iPhone, iPad, Android, Windows, or Mac, all 45 games, audio feedback, and local progress tracking work completely offline without internet.',
    },
    {
      q: 'How much does it cost and are there any subscriptions?',
      a: 'It is a simple one-time payment of $9.00 USD via Gumroad for lifetime family access to all 45 games and 225 difficulty levels. Zero recurring fees, zero in-app upsells, and up to 4 local child profiles.',
    },
    {
      q: 'How do I unlock the full version after purchasing?',
      a: 'After completing checkout, you receive an activation key. Click "Enter Activation Key" anywhere on the site or visit /activate to permanently unlock all 5 worlds on your device.',
    },
    {
      q: 'Which devices and countries are supported?',
      a: 'Wonder World Kids supports Mac, Windows PC, iPhone, iPad, Android tablets & phones, and Chromebooks worldwide across the US, UK, India, Canada, Australia, Singapore, Dubai / UAE, and Europe.',
    },
    {
      q: 'Is Wonder World Kids safe and COPPA-compliant?',
      a: 'Absolutely. There are zero third-party ads, zero behavioral tracking pixels, and all parent controls and billing links are protected behind a parental math gate.',
    },
  ];

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
            <span className="text-[#0F294A] font-bold">Frequently Asked Questions</span>
          </nav>
          <span className="font-semibold text-sky-700">Parent Help Center</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-10 sm:pt-12">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-sky-700 font-fun">
            Parent Answers
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-[#0F294A] mt-1 mb-3 flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-amber-500 shrink-0" />
            <span>Frequently Asked Questions</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Everything parents need to know about offline gameplay, licensing, printable books, and child safety.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-xs border-2 border-sky-200">
              <h2 className="text-base sm:text-lg font-black font-fun text-[#0F294A] mb-2">{faq.q}</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white border-2 border-amber-200 rounded-3xl p-8 text-center shadow-xs">
          <Mail className="w-8 h-8 text-sky-600 mx-auto mb-3" />
          <h2 className="text-xl font-black font-fun text-[#0F294A] mb-2">Still have questions?</h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            Our parent support team is ready to help with setup or licensing!
          </p>
          <a
            href="mailto:wonderworldkidslearning@gmail.com"
            className="text-sky-700 font-black text-base sm:text-lg underline hover:text-sky-900 transition-colors"
          >
            wonderworldkidslearning@gmail.com
          </a>
        </div>

        <div className="mt-8 text-center">
          <a
            href={getRoutePath('home')}
            onClick={(e) => handleLink(e, 'home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-sm shadow-xs active:scale-95 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  );
};
