/**
 * Wonder World Kids Store - Data-Driven Product Catalog Manager Modal
 * Allows site owners to add new products (Etsy, Gumroad, Payhip, Amazon KDP),
 * edit existing product URLs (e.g. Gumroad checkout URL), toggle active/inactive status,
 * or reset back to defaults.
 */

import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit3,
  CheckCircle2,
  RotateCcw,
  Trash2,
  Eye,
  EyeOff,
  SlidersHorizontal,
} from 'lucide-react';
import {
  StoreProduct,
  StoreCategory,
  StoreMarketplace,
  ProductStatus,
  STORE_CATEGORIES,
  STORE_MARKETPLACES,
  STORE_COVER_PRESETS,
  isSafeExternalHttpUrl,
  isSafeCoverImageUrl,
  slugifyProductName,
  getDefaultMarketplaceButtonLabel,
} from '../../data/storeCatalog';
import { soundEngine } from '../../services/soundEngine';

interface StoreProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: StoreProduct[];
  onSaveProduct: (product: StoreProduct) => void;
  onToggleStatus: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onResetDefaults: () => void;
}

interface ProductFormState {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  category: StoreCategory;
  pages: string;
  format: string;
  price: string;
  marketplace: StoreMarketplace;
  externalUrl: string;
  buttonLabel: string;
  status: ProductStatus;
}

const createEmptyForm = (): ProductFormState => ({
  id: '',
  slug: '',
  name: '',
  description: '',
  coverImage: STORE_COVER_PRESETS[1]?.image || '/pwa-512x512.png',
  category: 'Colouring Books',
  pages: '',
  format: 'Digital PDF',
  price: '',
  marketplace: 'Etsy',
  externalUrl: '',
  buttonLabel: 'Buy on Etsy',
  status: 'active',
});

export const StoreProductManagerModal: React.FC<StoreProductManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProduct,
  onToggleStatus,
  onDeleteProduct,
  onResetDefaults,
}) => {
  const [form, setForm] = useState<ProductFormState>(createEmptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  if (!isOpen) return null;

  const startEditing = (product: StoreProduct) => {
    soundEngine.playPop();
    setFormError(null);
    setSavedBanner(null);
    setForm({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      coverImage: product.coverImage,
      category: product.category,
      pages: product.pages ? String(product.pages) : '',
      format: product.format || '',
      price: product.price || '',
      marketplace: product.marketplace,
      externalUrl: product.externalUrl,
      buttonLabel: product.buttonLabel || getDefaultMarketplaceButtonLabel(product.marketplace),
      status: product.status,
    });
  };

  const resetForm = () => {
    soundEngine.playPop();
    setFormError(null);
    setForm(createEmptyForm());
  };

  const handleMarketplaceChange = (marketplace: StoreMarketplace) => {
    setForm((prev) => ({
      ...prev,
      marketplace,
      buttonLabel: getDefaultMarketplaceButtonLabel(marketplace),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSavedBanner(null);

    if (!form.name.trim()) {
      setFormError('Please enter a product name.');
      return;
    }
    if (!form.description.trim()) {
      setFormError('Please enter a short product description.');
      return;
    }
    if (!isSafeExternalHttpUrl(form.externalUrl)) {
      setFormError('External purchase URL must start with https:// or http://.');
      return;
    }
    if (form.coverImage.trim() && !isSafeCoverImageUrl(form.coverImage)) {
      setFormError('Cover image must be a valid https:// URL or local asset path.');
      return;
    }

    const parsedPages = form.pages.trim() ? Number(form.pages.trim()) : undefined;
    if (form.pages.trim() && (!Number.isFinite(parsedPages) || (parsedPages ?? 0) <= 0)) {
      setFormError('Number of pages must be a positive number.');
      return;
    }

    const cleanPrice = form.price.trim().replace(/^\$/, '');
    const existing = form.id ? products.find((p) => p.id === form.id) : undefined;
    const nextId = form.id || `prod_custom_${Date.now()}`;
    const nextSlug = form.slug.trim() || slugifyProductName(form.name);

    const payload: StoreProduct = {
      id: nextId,
      slug: nextSlug,
      name: form.name.trim(),
      description: form.description.trim(),
      longDescription: existing?.longDescription || form.description.trim(),
      coverImage: form.coverImage.trim() || STORE_COVER_PRESETS[0].image,
      coverAlt: existing?.coverAlt || `${form.name.trim()} cover illustration`,
      category: form.category,
      pages: parsedPages,
      format: form.format.trim() || undefined,
      price: cleanPrice || undefined,
      priceCurrency: cleanPrice ? 'USD' : undefined,
      marketplace: form.marketplace,
      externalUrl: form.externalUrl.trim(),
      buttonLabel: form.buttonLabel.trim() || getDefaultMarketplaceButtonLabel(form.marketplace),
      status: form.status,
      isFeatured: existing?.isFeatured,
      highlights: existing?.highlights,
      ageRange: existing?.ageRange || 'Ages 3–8',
      isCustom: existing ? existing.isCustom : true,
    };

    soundEngine.playVictory();
    onSaveProduct(payload);
    setSavedBanner(`Saved "${payload.name}" (${payload.status}).`);
    setForm(createEmptyForm());
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="store-manager-title"
    >
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 font-body">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 id="store-manager-title" className="text-lg font-bold font-fun text-slate-900 truncate">
                Store Product Catalog Manager
              </h2>
              <p className="text-xs text-slate-500">
                Add or update Etsy, Gumroad, Payhip and Amazon KDP listings stored locally in this browser.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0"
            aria-label="Close product manager"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[80vh] overflow-y-auto">
          {/* Left: Product Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-fun text-slate-900">
                {form.id ? 'Edit Product Configuration' : 'Add New Product'}
              </h3>
              {form.id && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  + Switch to New Product
                </button>
              )}
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {formError}
              </div>
            )}

            {savedBanner && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{savedBanner}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Space Explorer Activity Pack"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short, clear summary shown on the product card..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as StoreCategory })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500"
                >
                  {STORE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Marketplace</label>
                <select
                  value={form.marketplace}
                  onChange={(e) => handleMarketplaceChange(e.target.value as StoreMarketplace)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500"
                >
                  {STORE_MARKETPLACES.map((mkt) => (
                    <option key={mkt} value={mkt}>
                      {mkt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of Pages (Optional)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.pages}
                  onChange={(e) => setForm({ ...form, pages: e.target.value })}
                  placeholder="30"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm tabular-nums focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Verified Price USD (Optional)
                </label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Leave blank if live on Etsy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm tabular-nums focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  External Purchase URL
                </label>
                <input
                  type="url"
                  required
                  value={form.externalUrl}
                  onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                  placeholder="https://www.etsy.com/listing/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Button Label</label>
                <input
                  type="text"
                  value={form.buttonLabel}
                  onChange={(e) => setForm({ ...form, buttonLabel: e.target.value })}
                  placeholder="Buy on Etsy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="active">Active (Visible in Store)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://... or select preset below"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {STORE_COVER_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setForm({ ...form, coverImage: preset.image })}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-fun font-bold text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{form.id ? 'Update Product Listing' : 'Add Product to Store'}</span>
            </button>
          </form>

          {/* Right: Existing Catalog List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-fun text-slate-900">
                Catalog Listings ({products.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onResetDefaults();
                  setForm(createEmptyForm());
                  setSavedBanner('Restored default store catalog.');
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`p-3.5 rounded-2xl border ${
                    product.status === 'active'
                      ? 'border-slate-200 bg-white'
                      : 'border-slate-200 bg-slate-50 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-bold font-fun text-slate-900 truncate">
                        {product.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {product.marketplace} · {product.category} ·{' '}
                        <span
                          className={
                            product.status === 'active'
                              ? 'text-emerald-700 font-semibold'
                              : 'text-slate-500 font-semibold'
                          }
                        >
                          {product.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditing(product)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                        title="Edit product"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playPop();
                          onToggleStatus(product.id);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                        title={product.status === 'active' ? 'Hide product' : 'Activate product'}
                        aria-label={`Toggle visibility for ${product.name}`}
                      >
                        {product.status === 'active' ? (
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                      {product.isCustom && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playPop();
                            onDeleteProduct(product.id);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600 cursor-pointer"
                          title="Delete custom product"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
