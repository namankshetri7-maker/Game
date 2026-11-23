/**
 * Wonder World Kids Store – Learn, Play & Create
 * Central data-driven e-commerce storefront showcasing digital learning apps
 * and printable children's colouring & activity books across Etsy, Gumroad, Payhip & Amazon KDP.
 */

import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  ExternalLink,
  ArrowRight,
  Check,
  SlidersHorizontal,
  BookOpen,
  Compass,
  Play,
  BookmarkCheck,
  Plus,
} from 'lucide-react';
import {
  StoreProduct,
  StoreCategory,
  STORE_CATEGORIES,
} from '../../data/storeCatalog';
import { getRoutePath } from '../../services/seoManager';
import { soundEngine } from '../../services/soundEngine';

interface StoreSectionProps {
  products: StoreProduct[];
  allProductsWithInactive: StoreProduct[];
  bagIds: string[];
  onToggleBagItem: (productId: string) => void;
  onOpenBag: () => void;
  onViewProduct: (slug: string) => void;
  onNavigate: (route: string, worldId?: string) => void;
  onOpenManager: () => void;
  compactHeader?: boolean;
}

const ProductCoverImage: React.FC<{
  src: string;
  alt: string;
  aspectClass: string;
  fallbackTitle: string;
}> = ({ src, alt, aspectClass, fallbackTitle }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`w-full ${aspectClass} bg-sky-50 flex flex-col items-center justify-center p-6 text-center text-slate-500`}
      >
        <BookOpen className="w-10 h-10 text-amber-500 mb-2" />
        <span className="text-xs font-bold font-fun text-slate-700 line-clamp-2">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full ${aspectClass} overflow-hidden bg-gradient-to-b from-sky-50 via-white to-amber-50/50 p-2.5 flex items-center justify-center`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-contain rounded-2xl transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </div>
  );
};

export const StoreSection: React.FC<StoreSectionProps> = ({
  products,
  bagIds,
  onToggleBagItem,
  onOpenBag,
  onViewProduct,
  onNavigate,
  onOpenManager,
  compactHeader = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | StoreCategory>('All');

  const featuredApp = useMemo(
    () => products.find((p) => p.isFeatured) || null,
    [products]
  );

  const filteredProducts = useMemo(() => {
    const nonFeatured = products.filter((p) => !p.isFeatured);
    if (selectedCategory === 'All') {
      return nonFeatured;
    }
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const showFeaturedBanner =
    featuredApp && (selectedCategory === 'All' || selectedCategory === 'Learning Games');

  const isFeaturedInBag = featuredApp ? bagIds.includes(featuredApp.id) : false;

  const handleLinkClick = (e: React.MouseEvent, route: string, worldId?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route, worldId);
    }
  };

  return (
    <section
      id="store"
      aria-labelledby="store-section-heading"
      className="relative z-10 bg-[#FFFDF7] text-[#0F294A] py-14 sm:py-20 px-4 sm:px-8 border-y border-sky-200 font-body"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Store Header & Bag / Catalog Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-amber-200/80">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-wider uppercase text-sky-700 font-fun mb-2">
              Official Store · Learning Games &amp; Printable Books
            </p>
            {compactHeader ? (
              <h2
                id="store-section-heading"
                className="text-3xl sm:text-4xl font-black font-fun text-[#0F294A] tracking-tight text-balance"
              >
                Wonder World Kids Store – Learn, Play &amp; Create
              </h2>
            ) : (
              <h1
                id="store-section-heading"
                className="text-3xl sm:text-5xl font-black font-fun text-[#0F294A] tracking-tight text-balance"
              >
                Wonder World Kids Store – Learn, Play &amp; Create
              </h1>
            )}
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Explore our offline children&apos;s learning app and printable colouring and activity books. Each item links directly to its official Gumroad or Etsy listing for safe, instant digital access.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playPop();
                onOpenManager();
              }}
              className="px-4 py-2.5 rounded-2xl border border-sky-200 bg-white hover:bg-sky-50 text-[#0F294A] font-fun font-bold text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              <span>Manage Products</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playPop();
                onOpenBag();
              }}
              className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-fun font-bold text-xs shadow-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Saved Bag</span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-white font-mono text-[11px] tabular-nums">
                {bagIds.length}
              </span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="py-6 flex items-center justify-between gap-4 flex-wrap">
          <div
            role="tablist"
            aria-label="Product Categories"
            className="flex items-center gap-2 flex-wrap"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'All'}
              onClick={() => {
                soundEngine.playPop();
                setSelectedCategory('All');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-fun font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-sky-200 hover:border-sky-300 hover:bg-sky-50'
              }`}
            >
              All Products
            </button>
            {STORE_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    soundEngine.playPop();
                    setSelectedCategory(category);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-fun font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-sky-200 hover:border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <a
            href={getRoutePath('store')}
            onClick={(e) => handleLinkClick(e, 'store')}
            className="inline-flex items-center gap-1.5 text-xs font-bold font-fun text-sky-700 hover:text-sky-900 whitespace-nowrap shrink-0"
          >
            <span>Open Full Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Featured Product Spotlight: Wonder World Kids Learning App */}
        {showFeaturedBanner && featuredApp && (
          <article className="mb-10 bg-white rounded-3xl border-2 border-amber-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch group">
            <div className="lg:col-span-6 bg-gradient-to-br from-sky-100 via-[#F8FCFF] to-emerald-50 p-5 sm:p-6 flex items-center justify-center">
              <a
                href={getRoutePath('store_product', featuredApp.slug)}
                onClick={(e) => handleLinkClick(e, 'store_product', featuredApp.slug)}
                className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 items-center"
              >
                {featuredApp.galleryImages && featuredApp.galleryImages.length > 0 ? (
                  featuredApp.galleryImages.map((shot) => (
                    <div
                      key={shot.src}
                      className="aspect-[9/16] rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md transition-transform duration-200 group-hover:scale-[1.02]"
                    >
                      <img
                        src={shot.src}
                        alt={shot.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-sky-200">
                    <img
                      src={featuredApp.coverImage}
                      alt={featuredApp.coverAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </a>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between gap-6">
              <div>
                <div className="text-xs font-semibold text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                  <span className="text-indigo-700 font-bold">Featured Learning App</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredApp.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredApp.marketplace}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-fun text-slate-900 mb-3">
                  <a
                    href={getRoutePath('store_product', featuredApp.slug)}
                    onClick={(e) => handleLinkClick(e, 'store_product', featuredApp.slug)}
                    className="hover:text-indigo-700 transition-colors"
                  >
                    {featuredApp.name}
                  </a>
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {featuredApp.description}
                </p>

                {featuredApp.highlights && featuredApp.highlights.length > 0 && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    {featuredApp.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-5 border-t border-slate-200 space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    {featuredApp.price ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black font-fun text-slate-900 tabular-nums">
                          ${featuredApp.price}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {featuredApp.priceCurrency || 'USD'} · One-time payment
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-600">
                        Available on {featuredApp.marketplace}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <a
                      href={getRoutePath('worlds')}
                      onClick={(e) => handleLinkClick(e, 'worlds')}
                      className="inline-flex items-center gap-1 text-indigo-700 hover:underline whitespace-nowrap"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Explore Worlds</span>
                    </a>
                    <a
                      href={getRoutePath('demo')}
                      onClick={(e) => handleLinkClick(e, 'demo')}
                      className="inline-flex items-center gap-1 text-emerald-700 hover:underline whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Free Demo</span>
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={featuredApp.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.playPop()}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-sm shadow-sm flex items-center justify-center gap-2 transition active:scale-95 whitespace-nowrap shrink-0"
                  >
                    <span>{featuredApp.buttonLabel || 'Download Now'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      onViewProduct(featuredApp.slug);
                    }}
                    className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-fun font-bold text-xs sm:text-sm transition cursor-pointer whitespace-nowrap shrink-0"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      onToggleBagItem(featuredApp.id);
                    }}
                    className={`px-4 py-3 rounded-xl border font-fun font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0 ${
                      isFeaturedInBag
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isFeaturedInBag ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Save to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold font-fun text-slate-900 mb-1.5">
              No active products in {selectedCategory} yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md mx-auto">
              Switch back to all products or add a new Etsy, Gumroad, Payhip, or Amazon KDP listing in this category.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  setSelectedCategory('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-fun font-bold text-xs cursor-pointer"
              >
                Show All Products
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onOpenManager();
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-fun font-bold text-xs cursor-pointer"
              >
                Add Product Listing
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts
              .filter((p) => !(showFeaturedBanner && p.id === featuredApp?.id))
              .map((product) => {
                const isSaved = bagIds.includes(product.id);
                const cardAspect =
                  product.category === 'Learning Games' ? 'aspect-[4/3]' : 'aspect-[4/5]';

                return (
                  <article
                    key={product.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group"
                  >
                    <a
                      href={getRoutePath('store_product', product.slug)}
                      onClick={(e) => handleLinkClick(e, 'store_product', product.slug)}
                      className="block"
                    >
                      <ProductCoverImage
                        src={product.coverImage}
                        alt={product.coverAlt}
                        aspectClass={cardAspect}
                        fallbackTitle={product.name}
                      />
                    </a>

                    <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                      <div>
                        <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1.5">
                          <span>{product.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-indigo-700">{product.marketplace}</span>
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
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold font-fun text-slate-900 mb-2 leading-snug">
                          <a
                            href={getRoutePath('store_product', product.slug)}
                            onClick={(e) => handleLinkClick(e, 'store_product', product.slug)}
                            className="hover:text-indigo-700 transition-colors"
                          >
                            {product.name}
                          </a>
                        </h3>

                        <p className="text-sm text-slate-600 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          {product.price ? (
                            <span className="text-base font-black font-fun text-slate-900 tabular-nums">
                              ${product.price}{' '}
                              <span className="text-xs font-semibold text-slate-500">
                                {product.priceCurrency || 'USD'}
                              </span>
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-slate-600">
                              See live price on {product.marketplace}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playPop();
                              onToggleBagItem(product.id);
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold font-fun transition cursor-pointer whitespace-nowrap shrink-0 ${
                              isSaved
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Saved</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <a
                            href={product.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundEngine.playPop()}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-95 whitespace-nowrap shrink-0 shadow-xs"
                          >
                            <span>{product.buttonLabel || 'Buy Now'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playPop();
                              onViewProduct(product.slug);
                            }}
                            className="py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-fun font-bold text-xs sm:text-sm transition cursor-pointer whitespace-nowrap shrink-0"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        )}
      </div>
    </section>
  );
};
