/**
 * Wonder World Kids Website - Full Dedicated Storefront Page (/store)
 */

import React from 'react';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { StoreProduct } from '../../data/storeCatalog';
import { StoreSection } from './StoreSection';
import { getRoutePath } from '../../services/seoManager';
import { soundEngine } from '../../services/soundEngine';

interface StorePageProps {
  products: StoreProduct[];
  allProductsWithInactive: StoreProduct[];
  bagIds: string[];
  onToggleBagItem: (productId: string) => void;
  onOpenBag: () => void;
  onViewProduct: (slug: string) => void;
  onNavigate: (route: string, worldId?: string) => void;
  onOpenManager: () => void;
}

export const StorePage: React.FC<StorePageProps> = ({
  products,
  allProductsWithInactive,
  bagIds,
  onToggleBagItem,
  onOpenBag,
  onViewProduct,
  onNavigate,
  onOpenManager,
}) => {
  const handleHomeNav = (e: React.MouseEvent) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body">
      {/* Clean Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium">
            <a
              href={getRoutePath('home')}
              onClick={handleHomeNav}
              className="hover:text-slate-900 transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Store</span>
          </nav>

          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Official external checkout via Etsy &amp; Gumroad</span>
          </div>
        </div>
      </div>

      <StoreSection
        products={products}
        allProductsWithInactive={allProductsWithInactive}
        bagIds={bagIds}
        onToggleBagItem={onToggleBagItem}
        onOpenBag={onOpenBag}
        onViewProduct={onViewProduct}
        onNavigate={onNavigate}
        onOpenManager={onOpenManager}
        compactHeader={false}
      />
    </div>
  );
};
