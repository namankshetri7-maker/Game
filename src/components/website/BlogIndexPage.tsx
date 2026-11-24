/**
 * Wonder World Kids Website - Blog Index Page (/blog)
 * The Wonder World Kids Parenting & Learning Journal
 * Features category navigation, live search, featured articles, newsletter subscription,
 * and admin CMS access.
 */

import React, { useState, useMemo } from 'react';
import { 
  BookOpen, ChevronRight, Calendar, Clock, ArrowRight, Sparkles, 
  Search, ShieldCheck, Heart, Send, CheckCircle2, Settings 
} from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';
import { getAllBlogPosts, BlogPostRecord } from '../../data/blogData';
import { BlogManagerModal } from './BlogManagerModal';

interface BlogIndexPageProps {
  onNavigate: (route: string, param?: string) => void;
}

const CATEGORIES = [
  'All Categories',
  'Modern Parenting',
  'Screen Time to Learning Time',
  'Toddler Learning & Development',
  'Kindergarten & Preschool Preparation',
  'Offline Activities',
  'Learning Through Play',
  'Wonder World Kids Products'
] as const;

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<BlogPostRecord[]>(() => getAllBlogPosts());
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCmsOpen, setIsCmsOpen] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);

  const handleArticleClick = (e: React.MouseEvent, slug: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate('blog_post', slug);
    }
  };

  const handleLink = (e: React.MouseEvent, route: string, param?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route, param);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (!post.isPublished) return false;
      const matchesCategory = selectedCategory === 'All Categories' || post.category === selectedCategory;
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.keywords.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPosts = useMemo(() => {
    return posts.filter((p) => p.isPublished && p.isFeatured);
  }, [posts]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    soundEngine.playPop();
    setNewsletterSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-[#F6FBFF] text-[#0F294A] font-body pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sky-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleLink(e, 'home')}
              className="hover:text-[#0F294A] transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0F294A] font-bold">Parenting &amp; Learning Journal</span>
          </nav>
          
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sky-700">Expert Early Childhood Resources</span>
            <button
              onClick={() => {
                soundEngine.playPop();
                setIsCmsOpen(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 font-fun font-bold text-xs transition"
              title="Open Blog Article CMS Manager"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Manage Articles</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-white via-sky-50/60 to-[#F6FBFF] py-12 sm:py-16 px-4 sm:px-8 border-b border-sky-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 font-fun font-bold text-xs shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>The Wonder World Kids Parenting &amp; Learning Journal</span>
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-fun text-[#0F294A] tracking-tight">
            Helping little minds grow through play, discovery and everyday learning.
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium max-w-2xl mx-auto">
            Expert parenting guides, screen-free activity ideas, toddler developmental milestones, and kindergarten readiness tips for families worldwide.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by topic, e.g. toddler games, screen time, phonics..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-sky-300 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm font-medium text-[#0F294A]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundEngine.playPop();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl font-fun font-bold text-xs sm:text-sm whitespace-nowrap transition shadow-xs ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-sky-200 hover:bg-sky-50 hover:border-sky-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Banner (if on All Categories & no search) */}
        {selectedCategory === 'All Categories' && !searchQuery && featuredPosts.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-black font-fun text-[#0F294A]">Featured Parenting Guides</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <div
                  key={post.id}
                  className="bg-gradient-to-br from-white via-sky-50/50 to-sky-100/60 rounded-3xl border-2 border-sky-300 p-6 sm:p-8 shadow-md flex flex-col justify-between gap-6 group hover:border-sky-400 transition"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span className="px-3 py-1 rounded-lg bg-sky-200/80 text-sky-900 font-fun">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black font-fun text-[#0F294A] group-hover:text-sky-700 transition-colors leading-snug">
                      <a
                        href={`/blog/${post.slug}`}
                        onClick={(e) => handleArticleClick(e, post.slug)}
                      >
                        {post.title}
                      </a>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-sky-200/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">By {post.author}</span>
                    <a
                      href={`/blog/${post.slug}`}
                      onClick={(e) => handleArticleClick(e, post.slug)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-fun font-bold text-xs shadow-xs transition group-hover:translate-x-1"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black font-fun text-[#0F294A]">
              {selectedCategory === 'All Categories' ? 'Latest Articles & Resources' : selectedCategory}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredPosts.length} articles
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-sky-200 p-12 text-center max-w-lg mx-auto space-y-4">
              <BookOpen className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-black font-fun text-[#0F294A]">No articles found</h3>
              <p className="text-xs text-slate-600">
                Try searching with different keywords or selecting another category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Categories');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-fun font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-3xl border-2 border-sky-200 shadow-xs hover:border-sky-400 hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-5">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-500 mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-fun">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black font-fun text-[#0F294A] group-hover:text-sky-700 transition-colors mb-3 leading-snug">
                        <a
                          href={`/blog/${post.slug}`}
                          onClick={(e) => handleArticleClick(e, post.slug)}
                        >
                          {post.title}
                        </a>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-sky-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {post.publishedDate}
                      </span>
                      <a
                        href={`/blog/${post.slug}`}
                        onClick={(e) => handleArticleClick(e, post.slug)}
                        className="inline-flex items-center gap-1 text-xs font-bold font-fun text-sky-700 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Subscription Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-fun font-bold text-xs">
              <Heart className="w-3.5 h-3.5 fill-amber-300" />
              <span>Join 50,000+ Parents Worldwide</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-fun tracking-tight">
              Get Weekly Parenting Tips &amp; Screen-Free Activity Ideas
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 font-medium">
              Receive expert early childhood advice, free printable activity samples, and updates directly in your inbox. No spam, ever.
            </p>

            {newsletterSubscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-300 text-emerald-100 text-xs font-bold flex items-center justify-center gap-2 max-w-md mx-auto">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>Thank you for subscribing! Check your inbox for your welcome guide.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your parent email..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-sky-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-fun font-black text-xs sm:text-sm transition shadow-sm inline-flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* CMS Modal */}
      <BlogManagerModal
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        onPostUpdated={() => setPosts(getAllBlogPosts())}
        onPreviewPost={(slug) => onNavigate('blog_post', slug)}
      />
    </div>
  );
};
