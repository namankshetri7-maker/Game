/**
 * Wonder World Kids Website - Contact & Support Page (/contact)
 */

import React, { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';
import { Mail, Send, CheckCircle2, ChevronRight } from 'lucide-react';

interface ContactSupportPageProps {
  onNavigate: (route: string) => void;
}

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState('mailto:wonderworldkidslearning@gmail.com');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Wonder World Kids Support Request from ${form.name.trim() || 'Parent'}`
    );
    const body = encodeURIComponent(
      `Parent Name: ${form.name.trim()}\nReply Email: ${form.email.trim()}\n\nMessage:\n${form.message.trim()}`
    );
    const nextMailto = `mailto:wonderworldkidslearning@gmail.com?subject=${subject}&body=${body}`;
    setMailtoUrl(nextMailto);
    soundEngine.playVictory();
    setSubmitted(true);
    window.location.href = nextMailto;
  };

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
            <span className="text-[#0F294A] font-bold">Contact Support</span>
          </nav>
          <span className="font-semibold text-sky-700">24-Hour Family Response</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-10 sm:pt-12">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-sky-700 font-fun">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-[#0F294A] mt-1 mb-3">
            Contact &amp; Support
          </h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Have questions about offline installation on Mac, iPhone, iPad, or Android, licensing, or printable books? We&apos;re here to help!
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl border-2 border-emerald-400 p-8 text-center shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl font-black font-fun text-[#0F294A] mb-2">Email Draft Ready!</h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Your mail app should open with your message pre-filled for{' '}
              <span className="text-sky-700 font-bold">wonderworldkidslearning@gmail.com</span>. If it
              did not open automatically, tap below:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={mailtoUrl}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs shadow-xs transition"
              >
                Open Email Draft
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', message: '' });
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs cursor-pointer transition"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border-2 border-sky-200 p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-[#0F294A] mb-1 font-fun">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Parent Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#F8FCFF] border border-sky-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0F294A] focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F294A] mb-1 font-fun">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#F8FCFF] border border-sky-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0F294A] focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F294A] mb-1 font-fun">
                Message or Question
              </label>
              <textarea
                required
                rows={4}
                placeholder="How can we assist your family?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-[#F8FCFF] border border-sky-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0F294A] focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer border border-amber-500/40"
            >
              <Send className="w-4 h-4" />
              <span>Send Support Message</span>
            </button>
          </form>
        )}

        {/* Email & Response Time Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-sky-200 text-center shadow-xs">
            <Mail className="w-7 h-7 text-sky-600 mx-auto mb-2" />
            <h2 className="text-sm font-black font-fun text-[#0F294A] mb-1">Direct Support Email</h2>
            <a
              href="mailto:wonderworldkidslearning@gmail.com"
              className="text-xs text-sky-700 font-bold hover:underline"
            >
              wonderworldkidslearning@gmail.com
            </a>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 text-center shadow-xs">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
            <h2 className="text-sm font-black font-fun text-[#0F294A] mb-1">Response Time</h2>
            <p className="text-xs text-slate-600">Within 24 hours (Worldwide Support)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
