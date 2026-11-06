import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

interface FAQPageProps {
  onNavigate: (route: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'What is Wonder World Kids Learning?',
      a: 'An ad-free, 100% offline educational game suite designed for children aged 3–8.'
    },
    {
      q: 'Does it work offline?',
      a: 'Yes, once installed, no internet is required. It works 100% offline.'
    },
    {
      q: 'How much does it cost?',
      a: 'It is a simple one-time payment of $9 for lifetime access to all content.'
    },
    {
      q: 'Is it safe for kids?',
      a: 'Absolutely. No ads, no data tracking, and a secure parental PIN gate.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black font-fun text-slate-900 mb-8 text-center flex items-center justify-center gap-3">
          <HelpCircle className="text-amber-500" />
          Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black font-fun text-slate-900 mb-2">{faq.q}</h2>
              <p className="text-slate-600 font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
            <button 
              onClick={() => onNavigate('home')}
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold cursor-pointer"
            >
              Back to Home
            </button>
        </div>
      </div>
    </div>
  );
};
