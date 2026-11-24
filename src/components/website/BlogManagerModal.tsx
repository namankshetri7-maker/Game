/**
 * Wonder World Kids - Blog Management Modal & Admin CMS
 * Allows parents and administrators to create, edit, save drafts, schedule,
 * assign categories, update SEO metadata, and feature articles.
 */

import React, { useState } from 'react';
import { X, Plus, Edit3, Trash2, Eye, Sparkles, CheckCircle2, AlertCircle, Save, FileText, Globe } from 'lucide-react';
import { BlogPostRecord, getAllBlogPosts, saveBlogPost, deleteBlogPost } from '../../data/blogData';
import { soundEngine } from '../../services/soundEngine';

interface BlogManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated: () => void;
  onPreviewPost: (slug: string) => void;
}

export const BlogManagerModal: React.FC<BlogManagerModalProps> = ({
  isOpen,
  onClose,
  onPostUpdated,
  onPreviewPost,
}) => {
  const [posts, setPosts] = useState<BlogPostRecord[]>(() => getAllBlogPosts());
  const [editingPost, setEditingPost] = useState<BlogPostRecord | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleNewPost = () => {
    soundEngine.playPop();
    setIsCreating(true);
    setEditingPost({
      id: `custom_blog_${Date.now()}`,
      slug: `new-article-${Date.now()}`,
      title: '',
      description: '',
      category: 'Modern Parenting',
      readTime: '5 min read',
      publishedDate: new Date().toISOString().split('T')[0],
      author: 'Wonder World Kids Editorial Team',
      coverImage: '/assets/aistudio/pwa-512x512_ba215e1b.png',
      coverAlt: '',
      keywords: '',
      isPublished: true,
      isFeatured: false,
      content: [
        {
          heading: 'Introduction',
          paragraphs: ['Write your introduction paragraph here...']
        }
      ],
      faqs: [
        { question: 'Sample Question?', answer: 'Sample Answer.' }
      ]
    });
  };

  const handleEditPost = (post: BlogPostRecord) => {
    soundEngine.playPop();
    setIsCreating(false);
    setEditingPost({ ...post });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog article?')) {
      soundEngine.playPop();
      const updated = deleteBlogPost(id);
      setPosts(updated);
      setSuccessMessage('Article deleted successfully.');
      onPostUpdated();
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    if (!editingPost.title.trim() || !editingPost.slug.trim()) {
      alert('Please provide a valid title and slug.');
      return;
    }
    soundEngine.playPop();
    const updated = saveBlogPost(editingPost);
    setPosts(updated);
    setEditingPost(null);
    setIsCreating(false);
    setSuccessMessage('Article saved and published successfully!');
    onPostUpdated();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto font-body">
      <div className="bg-white rounded-3xl border-2 border-sky-300 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-black font-fun">Wonder World Blog CMS</h2>
              <p className="text-xs text-sky-100 font-medium">Create, edit, and manage expert parenting articles</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {editingPost ? (
            /* Edit / Create Form */
            <form onSubmit={handleSave} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-sky-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-sky-100 pb-4">
                <h3 className="text-lg font-black font-fun text-[#0F294A]">
                  {isCreating ? 'Create New Article' : 'Edit Article'}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-fun font-bold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-fun font-bold text-xs shadow-sm transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save &amp; Publish</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium"
                    placeholder="e.g. 10 Ways to Teach Numbers"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingPost.slug}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium"
                    placeholder="e.g. 10-ways-to-teach-numbers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium bg-white"
                  >
                    <option value="Modern Parenting">Modern Parenting</option>
                    <option value="Screen Time to Learning Time">Screen Time to Learning Time</option>
                    <option value="Toddler Learning & Development">Toddler Learning & Development</option>
                    <option value="Kindergarten & Preschool Preparation">Kindergarten & Preschool Preparation</option>
                    <option value="Offline Activities">Offline Activities</option>
                    <option value="Learning Through Play">Learning Through Play</option>
                    <option value="Wonder World Kids Products">Wonder World Kids Products</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={editingPost.readTime}
                    onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={editingPost.author}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meta Description (SEO Summary)</label>
                <textarea
                  rows={2}
                  value={editingPost.description}
                  onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium"
                  placeholder="Brief summary for Google search results..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SEO Keywords (comma separated)</label>
                <input
                  type="text"
                  value={editingPost.keywords}
                  onChange={(e) => setEditingPost({ ...editingPost, keywords: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium"
                  placeholder="toddler learning, educational games, ..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingPost.isPublished}
                    onChange={(e) => setEditingPost({ ...editingPost, isPublished: e.target.checked })}
                    className="w-4 h-4 text-sky-600 rounded border-sky-300 focus:ring-sky-500"
                  />
                  <span>Published (Visible on site)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingPost.isFeatured}
                    onChange={(e) => setEditingPost({ ...editingPost, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-sky-300 focus:ring-amber-500"
                  />
                  <span>Featured Article (Show on Homepage / Top Banner)</span>
                </label>
              </div>
            </form>
          ) : (
            /* Article List View */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black font-fun text-[#0F294A]">
                    Published &amp; Draft Articles ({posts.length})
                  </h3>
                  <p className="text-xs text-slate-500">Manage all blog posts, metadata, and categories</p>
                </div>
                <button
                  onClick={handleNewPost}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-fun font-bold text-xs shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Article</span>
                </button>
              </div>

              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl border border-sky-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-sky-300 transition"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                          {post.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${post.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {post.isFeatured && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            Featured
                          </span>
                        )}
                        <span className="text-slate-400">{post.readTime}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black font-fun text-[#0F294A] leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {post.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          soundEngine.playPop();
                          onClose();
                          onPreviewPost(post.slug);
                        }}
                        className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition"
                        title="View Article"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-sky-200 px-6 py-4 flex items-center justify-between text-xs text-slate-500">
          <span>Wonder World Kids CMS v2.4</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-fun font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
