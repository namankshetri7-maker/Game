/**
 * Wonder World Kids Store - Individual Product Detail Page (/store/:slug)
 * Contiguous Purchase Module + cover gallery + verified pricing rules + internal links.
 */

import React, { useEffect, useState } from 'react';
import {
  ChevronRight,
  ExternalLink,
  Check,
  ShoppingBag,
  BookmarkCheck,
  ArrowLeft,
  ShieldCheck,
  BookOpen,
  Compass,
} from 'lucide-react';
import { StoreProduct, getDefaultMarketplaceButtonLabel } from '../../data/storeCatalog';
import { getRoutePath } from '../../services/seoManager';
import { soundEngine } from '../../services/soundEngine';

interface ProductDetailPageProps {
  product: StoreProduct | undefined;
  relatedProducts: StoreProduct[];
  bagIds: string[];
  onToggleBagItem: (productId: string) => void;
  onOpenBag: () => void;
  onViewProduct: (slug: string) => void;
  onNavigate: (route: string, worldId?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  relatedProducts,
  bagIds,
  onToggleBagItem,
  onOpenBag,
  onViewProduct,
  onNavigate,
}) => {
  const [imgError, setImgError] = useState(false);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  useEffect(() => {
    setSelectedGalleryIdx(0);
    setImgError(false);
  }, [product?.id]);

  const handleNav = (e: React.MouseEvent, route: string, worldId?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route, worldId);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8FCFF] text-[#0F294A] py-20 px-4 text-center font-body">
        <div className="max-w-lg mx-auto bg-white p-10 rounded-3xl border border-sky-200 shadow-sm">
          <BookOpen className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black font-fun text-[#0F294A] mb-2">
            Product Listing Not Found
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            The product you were looking for could not be located in the active catalog.
          </p>
          <a
            href={getRoutePath('store')}
            onClick={(e) => handleNav(e, 'store')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-fun font-bold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Wonder World Store</span>
          </a>
        </div>
      </div>
    );
  }

  const isSaved = bagIds.includes(product.id);
  const buyButtonLabel =
    product.buttonLabel || getDefaultMarketplaceButtonLabel(product.marketplace);
  const galleryItems = product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages : null;
  const activeDisplayImage = galleryItems
    ? galleryItems[selectedGalleryIdx]?.src || product.coverImage
    : product.coverImage;
  const activeDisplayAlt = galleryItems
    ? galleryItems[selectedGalleryIdx]?.alt || product.coverAlt
    : product.coverAlt;
  const galleryAspect = galleryItems ? 'aspect-[9/16] max-w-[300px] mx-auto' : 'aspect-[4/5] max-w-md mx-auto';

  return (
    <div className="min-h-screen bg-[#F8FCFF] text-[#0F294A] font-body pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sky-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium flex-wrap">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleNav(e, 'home')}
              className="hover:text-[#0F294A] transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <a
              href={getRoutePath('store')}
              onClick={(e) => handleNav(e, 'store')}
              className="hover:text-[#0F294A] transition-colors"
            >
              Store
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0F294A] font-bold truncate max-w-[220px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          <button
            type="button"
            onClick={() => {
              soundEngine.playPop();
              onOpenBag();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold font-fun text-sky-700 hover:text-sky-900 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Saved Bag ({bagIds.length})</span>
          </button>
        </div>
      </div>

      {/* Contiguous PDP Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Product Cover / Screenshot Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`w-full ${galleryAspect} rounded-3xl overflow-hidden bg-gradient-to-b from-sky-50 via-white to-amber-50/50 border-2 border-sky-200 shadow-sm p-3 flex items-center justify-center`}
            >
              {imgError || !activeDisplayImage ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center text-slate-500 bg-sky-50">
                  <BookOpen className="w-12 h-12 text-amber-500 mb-3" />
                  <span className="text-sm font-bold font-fun text-[#0F294A]">
                    {product.name}
                  </span>
                </div>
              ) : (
                <img
                  src={activeDisplayImage}
                  alt={activeDisplayAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain rounded-2xl"
                />
              )}
            </div>

            {galleryItems && (
              <div className="grid grid-cols-4 gap-2.5 max-w-md mx-auto">
                {galleryItems.map((shot, idx) => (
                  <button
                    key={shot.src}
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      setImgError(false);
                      setSelectedGalleryIdx(idx);
                    }}
                    className={`rounded-xl overflow-hidden border-2 p-0.5 bg-white transition cursor-pointer ${
                      idx === selectedGalleryIdx
                        ? 'border-amber-400 ring-2 ring-amber-200'
                        : 'border-sky-200 hover:border-sky-400 opacity-80 hover:opacity-100'
                    }`}
                    title={shot.label}
                  >
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-16 object-cover object-top rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-bold text-indigo-700">{product.marketplace}</span>
                {product.pages ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{product.pages} Pages</span>
                  </>
                ) : null}
                {product.format ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{product.format}</span>
                  </>
                ) : null}
                {product.ageRange ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{product.ageRange}</span>
                  </>
                ) : null}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-fun text-slate-900 tracking-tight mb-4">
                {product.name}
              </h1>

              {/* Price Display (strictly verified pricing only) */}
              <div className="pb-5 border-b border-slate-200">
                {product.price ? (
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black font-fun text-slate-900 tabular-nums">
                      ${product.price}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                      {product.priceCurrency || 'USD'} · Verified listing price
                    </span>
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-slate-700">
                    Live regional pricing available directly on {product.marketplace}.
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {product.longDescription || product.description}
            </p>

            {product.highlights && product.highlights.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-sm font-bold font-fun text-slate-900 uppercase tracking-wide">
                  What's Included
                </h2>
                <ul className="space-y-2 text-sm text-slate-700">
                  {product.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Primary Marketplace Redirect + Bag Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={product.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.playPop()}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 transition active:scale-95 whitespace-nowrap"
                >
                  <span>{buyButtonLabel}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playPop();
                    onToggleBagItem(product.id);
                  }}
                  className={`py-3.5 px-5 rounded-xl border font-fun font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap shrink-0 ${
                    isSaved
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                      <span>Saved in Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Save to Bag</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Clicking <strong>{buyButtonLabel}</strong> takes you directly to our official {product.marketplace} product page to complete your purchase securely.
                </span>
              </div>
            </div>

            {/* Internal Cross-Links */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold font-fun text-indigo-700">
              <a
                href={getRoutePath('store')}
                onClick={(e) => handleNav(e, 'store')}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Store Products</span>
              </a>
              <a
                href={getRoutePath('worlds')}
                onClick={(e) => handleNav(e, 'worlds')}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Learning App Worlds</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-sky-200">
            <h2 className="text-2xl font-black font-fun text-[#0F294A] mb-6">
              More from Wonder World Kids Store
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((rel) => (
                <article
                  key={rel.id}
                  className="bg-white rounded-3xl border-2 border-sky-200 shadow-xs overflow-hidden flex flex-col group hover:border-sky-300 transition"
                >
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      onViewProduct(rel.slug);
                    }}
                    className="w-full aspect-[4/5] overflow-hidden bg-gradient-to-b from-sky-50 via-white to-amber-50/50 p-3 flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={rel.coverImage}
                      alt={rel.coverAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </button>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 mb-1">
                        {rel.category} · {rel.marketplace}
                      </div>
                      <h3 className="text-base font-bold font-fun text-[#0F294A] mb-1">
                        {rel.name}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{rel.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPop();
                        onViewProduct(rel.slug);
                      }}
                      className="text-xs font-bold font-fun text-sky-700 hover:underline text-left cursor-pointer"
                    >
                      View Product Details →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
