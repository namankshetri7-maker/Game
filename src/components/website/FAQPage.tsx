import React from 'react';
import { HelpCircle, ArrowLeft, Mail } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';

interface FAQPageProps {
  onNavigate: (route: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'What is Wonder World Kids Learning?',
      a: 'An ad-free, 100% offline educational game suite featuring 45 interactive mini-games across 5 magical worlds (Math, Reading, Logic, Science & Art) designed for children aged 3–8.'
    },
    {
      q: 'Does it work 100% offline without Wi-Fi?',
      a: 'Yes! Once installed to your home screen as a Progressive Web App (PWA) on iPhone, iPad, Android, Windows, or Mac, all 45 games, sounds, and local progress tracking work completely offline.'
    },
    {
      q: 'How much does it cost and are there any subscriptions?',
      a: 'It is a simple one-time payment of $9 USD via Gumroad for lifetime family access to all 45 games and 225 difficulty levels. Zero recurring fees, zero in-app upsells.'
    },
    {
      q: 'How do I unlock the full version after purchasing?',
      a: 'After completing checkout, you receive an activation key. Click "Enter Activation Key" anywhere on the site or inside the app to permanently unlock all 5 worlds on your device.'
    },
    {
      q: 'Is Wonder World Kids safe and COPPA-compliant?',
      a: 'Absolutely. There are zero third-party ads, zero analytics or personal data tracking, and all parent settings and external store links are protected behind a parental math gate.'
    }
  ];

  const handleBackHome = (e: React.MouseEvent) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-fun">Parent Answers</span>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-white mt-1 mb-3 flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-amber-400 shrink-0" />
            <span>Frequently Asked Questions</span>
          </h1>
          <p className="text-sm text-slate-300">
            Everything parents need to know about offline gameplay, licensing, and child safety.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
              <h2 className="text-base sm:text-lg font-black font-fun text-amber-300 mb-2">{faq.q}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-slate-800/80 border border-indigo-500/40 rounded-3xl p-8 text-center shadow-xl">
          <Mail className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-black font-fun text-white mb-2">Still have questions?</h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-4">Our parent support team is ready to help with setup or licensing!</p>
          <a
            href="mailto:wonderworldkidslearning@gmail.com"
            className="text-amber-300 font-black text-base sm:text-lg underline hover:text-amber-200 transition-colors"
          >
            wonderworldkidslearning@gmail.com
          </a>
        </div>

        <div className="mt-10 text-center">
          <a
            href={getRoutePath('home')}
            onClick={handleBackHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-sm shadow-lg active:scale-95 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  );
};
