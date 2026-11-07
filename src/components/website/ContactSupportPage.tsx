/**
 * Wonder World Kids Website - Contact & Support Page
 */

import React, { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

interface ContactSupportPageProps {
  onNavigate: (route: string) => void;
}

export const ContactSupportPage: React.FC<ContactSupportPageProps> = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playVictory();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body py-12 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">
        
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-fun">Get in Touch</span>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-white mt-1 mb-3">
            Contact & Support
          </h1>
          <p className="text-sm text-slate-300">
            Have questions about offline installation, licensing, or gameplay? We're here to help!
          </p>
        </div>

        {submitted ? (
          <div className="bg-slate-800 rounded-3xl border-2 border-emerald-400 p-8 text-center shadow-xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold font-fun text-white mb-2">Message Sent Successfully!</h2>
            <p className="text-xs text-slate-300 mb-6">Our parent support team will get back to you within 24 hours.</p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-amber-950 font-fun font-bold text-xs"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 font-fun">Your Name</label>
              <input
                type="text"
                required
                placeholder="Parent Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 font-fun">Email Address</label>
              <input
                type="email"
                required
                placeholder="wonderworldkidslearning@gmail.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 font-fun">Message or Question</label>
              <textarea
                required
                rows={4}
                placeholder="How can we assist your family?"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer border border-amber-500"
            >
              <Send className="w-4 h-4" />
              <span>Send Support Message</span>
            </button>
          </form>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
            <Mail className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold font-fun text-white mb-1">Direct Email</h3>
            <p className="text-xs text-amber-300 font-bold">wonderworldkidslearning@gmail.com</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold font-fun text-white mb-1">Response Time</h3>
            <p className="text-xs text-slate-400">Within 24 hours (Mon - Fri)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
