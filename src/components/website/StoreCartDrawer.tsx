/**
 * Wonder World Kids Store - Multi-Marketplace Shopping Bag Drawer
 * Allows visitors to save products across Etsy, Gumroad, Payhip & Amazon KDP,
 * remove items, and redirect directly to each marketplace listing for checkout.
 * Never simulates payment or claims an order is complete on our website.
 */

import React from 'react';
import { X, ShoppingBag, Trash2, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { StoreProduct, getDefaultMarketplaceButtonLabel } from '../../data/storeCatalog';
import { soundEngine } from '../../services/soundEngine';

interface StoreCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: StoreProduct[];
  onRemoveItem: (productId: string) => void;
  onClearBag: () => void;
  onViewProduct: (slug: string) => void;
}

export const StoreCartDrawer: React.FC<StoreCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearBag,
  onViewProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex justify-end bg-slate-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="store-bag-title"
    >
      {/* Backdrop Click Dismiss */}
      <button
        type="button"
        onClick={() => {
          soundEngine.playPop();
          onClose();
        }}
        className="flex-1 cursor-default"
        aria-label="Close shopping bag"
      />

      {/* Slide-over Panel */}
      <aside className="w-full max-w-md bg-white text-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 font-body">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 id="store-bag-title" className="text-lg font-bold font-fun text-slate-900 truncate">
                Saved Collection
              </h2>
              <p className="text-xs text-slate-500 font-medium tabular-nums">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved across marketplaces
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bag Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-14 px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold font-fun text-slate-900 mb-1.5">
                Your collection bag is empty
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Save printable books or the Wonder World Kids Learning App here to open each marketplace checkout when you are ready.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const ctaText =
                item.buttonLabel || getDefaultMarketplaceButtonLabel(item.marketplace);
              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/70 transition hover:border-slate-300"
                >
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      onClose();
                      onViewProduct(item.slug);
                    }}
                    className="w-20 h-24 rounded-xl overflow-hidden bg-gradient-to-b from-sky-50 via-white to-amber-50/40 border border-sky-200 p-1 shrink-0 cursor-pointer flex items-center justify-center"
                  >
                    <img
                      src={item.coverImage}
                      alt={item.coverAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </button>

                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playPop();
                            onClose();
                            onViewProduct(item.slug);
                          }}
                          className="text-sm font-bold font-fun text-slate-900 hover:text-indigo-700 text-left leading-snug cursor-pointer"
                        >
                          {item.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playPop();
                            onRemoveItem(item.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                          aria-label={`Remove ${item.name} from bag`}
                          title="Remove from bag"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 font-medium">
                        <span className="font-semibold text-indigo-700">{item.marketplace}</span>
                        {item.pages ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{item.pages} Pages</span>
                          </>
                        ) : null}
                        {item.price ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-bold text-slate-900 tabular-nums">
                              ${item.price} {item.priceCurrency || 'USD'}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEngine.playPop()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-xs transition whitespace-nowrap shrink-0"
                      >
                        <span>{ctaText}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playPop();
                          onClose();
                          onViewProduct(item.slug);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Disclosure */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Checkout is completed directly on each official marketplace (Etsy, Gumroad, Payhip, or Amazon KDP). Wonder World Kids never collects card details here.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playPop();
                onClearBag();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-fun font-bold text-xs transition cursor-pointer"
            >
              Clear Saved Collection
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
