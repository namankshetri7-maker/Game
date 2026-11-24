/**
 * Wonder World Kids Website - Individual Blog Post Page (/blog/:slug)
 * Displays expert article content, breadcrumbs, FAQs, related resources, and natural product CTAs.
 */

import React, { useState } from 'react';
import { 
  ChevronRight, Calendar, Clock, User, ArrowLeft, BookOpen, 
  Share2, Sparkles, Play, CheckCircle2, HelpCircle, ArrowRight 
} from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';
import { getAllBlogPosts, BlogPostRecord } from '../../data/blogData';

interface BlogPostPageProps {
  post: BlogPostRecord | undefined;
  onNavigate: (route: string, param?: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, onNavigate }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const allPosts = getAllBlogPosts();

  const handleLink = (e: React.MouseEvent, route: string, param?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route, param);
    }
  };

  const handleShare = () => {
    soundEngine.playPop();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F6FBFF] text-[#0F294A] py-20 px-4 text-center font-body">
        <div className="max-w-lg mx-auto bg-white p-10 rounded-3xl border border-sky-200 shadow-sm space-y-4">
          <BookOpen className="w-12 h-12 text-amber-500 mx-auto" />
          <h1 className="text-2xl font-black font-fun text-[#0F294A]">
            Article Not Found
          </h1>
          <p className="text-sm text-slate-600">
            The article you requested could not be located in our resource center.
          </p>
          <a
            href={getRoutePath('home')}
            onClick={(e) => handleLink(e, 'home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-fun font-bold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    );
  }

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category && p.isPublished)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F6FBFF] text-[#0F294A] font-body pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sky-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium flex-wrap">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleLink(e, 'home')}
              className="hover:text-[#0F294A] transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <a
              href="/blog"
              onClick={(e) => handleLink(e, 'blog' as any)}
              className="hover:text-[#0F294A] transition-colors"
            >
              Journal
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0F294A] font-bold truncate max-w-[200px] sm:max-w-none">
              {post.title}
            </span>
          </nav>
          <span className="font-semibold text-sky-700">{post.category}</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14">
        {/* Article Header */}
        <header className="mb-10 pb-8 border-b border-sky-200">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
              <span className="px-3 py-1 rounded-xl bg-sky-100 text-sky-800 font-fun">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {post.publishedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {post.author}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-fun font-bold text-xs transition border border-sky-200"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-fun text-[#0F294A] tracking-tight leading-[1.15] mb-6">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
            {post.description}
          </p>
        </header>

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl border-2 border-sky-200 p-6 sm:p-12 shadow-xs space-y-8 mb-12">
          {post.content.map((section, idx) => (
            <section key={idx} className="space-y-4">
              {section.heading && (
                <h2 className="text-xl sm:text-2xl font-black font-fun text-[#0F294A] pt-4 border-t border-sky-100">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base text-slate-700 leading-relaxed font-body">
                  {p}
                </p>
              ))}
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-3 bg-sky-50/70 p-6 rounded-2xl border border-sky-100 my-4">
                  {section.bulletPoints.map((bp, bpIdx) => (
                    <li key={bpIdx} className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* FAQ Section */}
        {post.faqs && post.faqs.length > 0 && (
          <div className="bg-white rounded-3xl border-2 border-sky-200 p-6 sm:p-10 shadow-xs mb-12 space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-sky-600" />
              <h2 className="text-xl font-black font-fun text-[#0F294A]">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {post.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="bg-sky-50/60 p-5 rounded-2xl border border-sky-100 space-y-2">
                  <h3 className="text-sm sm:text-base font-black font-fun text-[#0F294A]">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Natural Product CTA Box (80/20 ratio) */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 shadow-lg text-center space-y-5 mb-16">
          <Sparkles className="w-10 h-10 text-amber-300 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black font-fun">
            Make Screen Time into Learning Time with Wonder World Kids
          </h2>
          <p className="text-sm sm:text-base text-sky-100 max-w-xl mx-auto font-medium leading-relaxed">
            Explore 45 offline educational mini-games across 5 learning worlds for kids ages 3–8. One-time purchase, zero subscriptions, and 100% offline.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={getRoutePath('demo')}
              onClick={(e) => handleLink(e, 'demo')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-fun font-black text-sm shadow-md transition"
            >
              <Play className="w-4 h-4 fill-slate-900" />
              <span>Try Free Game Demo</span>
            </a>
            <a
              href={getRoutePath('store')}
              onClick={(e) => handleLink(e, 'store')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-fun font-bold text-sm transition border border-white/30"
            >
              <span>Explore Printable Books</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-black font-fun text-[#0F294A]">Related Parenting Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <a
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                      e.preventDefault();
                      soundEngine.playPop();
                      onNavigate('blog_post', rel.slug);
                    }
                  }}
                  className="bg-white rounded-2xl border border-sky-200 p-5 hover:border-sky-400 hover:shadow-sm transition flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-sky-700 px-2 py-0.5 rounded bg-sky-50 font-fun">
                      {rel.category}
                    </span>
                    <h3 className="text-sm font-black font-fun text-[#0F294A] group-hover:text-sky-700 transition leading-snug">
                      {rel.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-sky-600 inline-flex items-center gap-1">
                    <span>Read Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
