/**
 * Wonder World Kids Store - Data-Driven Catalog, Image Asset Binding & Shopping Bag Storage
 */

import dinoCoverImg from '../assets/images/store_dinosaur_colouring_1795363036486.jpg';
import abcCoverImg from '../assets/images/store_abc_alphabet_book_1795363036462.jpg';
import christmasCoverImg from '../assets/images/store_christmas_colouring_1795363037005.jpg';
import learningAppCoverImg from '../assets/images/store_learning_app_featured_1795363037165.jpg';

import {
  StoreProductRecord,
  StoreCategory,
  StoreMarketplace,
  ProductStatus,
  STORE_CATEGORIES,
  STORE_MARKETPLACES,
  STORE_CATALOG_STORAGE_KEY,
  STORE_BAG_STORAGE_KEY,
  INITIAL_STORE_PRODUCT_RECORDS,
  readStoredProductRecords,
  isSafeExternalHttpUrl,
  isSafeCoverImageUrl,
  slugifyProductName,
  getDefaultMarketplaceButtonLabel,
} from './storeMeta';

export type { StoreProductRecord as StoreProduct, StoreCategory, StoreMarketplace, ProductStatus };
export {
  STORE_CATEGORIES,
  STORE_MARKETPLACES,
  isSafeExternalHttpUrl,
  isSafeCoverImageUrl,
  slugifyProductName,
  getDefaultMarketplaceButtonLabel,
};

const BUNDLED_COVERS_BY_ID: Record<string, string> = {
  prod_learning_app: learningAppCoverImg,
  prod_dinosaur_colouring: dinoCoverImg,
  prod_abc_alphabet_book: abcCoverImg,
  prod_christmas_colouring: christmasCoverImg,
};

export const STORE_COVER_PRESETS: Array<{ label: string; image: string }> = [
  { label: 'Learning App Showcase', image: learningAppCoverImg },
  { label: 'Dinosaur Colouring Artwork', image: dinoCoverImg },
  { label: 'ABC Alphabet Artwork', image: abcCoverImg },
  { label: 'Christmas Wonderland Artwork', image: christmasCoverImg },
];

function hydrateProductImages(products: StoreProductRecord[]): StoreProductRecord[] {
  return products.map((product) => {
    const bundled = BUNDLED_COVERS_BY_ID[product.id];
    const shouldUseBundled =
      bundled &&
      (!product.coverImage ||
        product.coverImage === '/pwa-512x512.png' ||
        product.coverImage.startsWith('/src/assets/images/'));
    return {
      ...product,
      coverImage: shouldUseBundled ? bundled : product.coverImage || bundled || '/pwa-512x512.png',
    };
  });
}

export function getStoreProducts(includeInactive: boolean = false): StoreProductRecord[] {
  const all = hydrateProductImages(readStoredProductRecords());
  return includeInactive ? all : all.filter((p) => p.status === 'active');
}

export function getStoreProductBySlug(slug: string): StoreProductRecord | undefined {
  const cleanSlug = (slug || '').trim().toLowerCase();
  return getStoreProducts(true).find((p) => p.slug.toLowerCase() === cleanSlug);
}

export function saveStoreCatalog(products: StoreProductRecord[]): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    // Store portable cover references for built-in defaults so image paths never break across rebuilds
    const serializable = products.map((item) => {
      const def = INITIAL_STORE_PRODUCT_RECORDS.find((d) => d.id === item.id);
      const isUsingBundled = def && BUNDLED_COVERS_BY_ID[def.id] === item.coverImage;
      return {
        ...item,
        coverImage: isUsingBundled ? '/pwa-512x512.png' : item.coverImage,
      };
    });
    localStorage.setItem(STORE_CATALOG_STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function upsertStoreProduct(product: StoreProductRecord): StoreProductRecord[] {
  const current = getStoreProducts(true);
  const existingIdx = current.findIndex((p) => p.id === product.id);
  const updated =
    existingIdx >= 0
      ? current.map((p, idx) => (idx === existingIdx ? product : p))
      : [...current, { ...product, isCustom: true }];
  saveStoreCatalog(updated);
  return getStoreProducts(true);
}

export function toggleStoreProductStatus(productId: string): StoreProductRecord[] {
  const updated = getStoreProducts(true).map((p) =>
    p.id === productId
      ? { ...p, status: p.status === 'active' ? ('inactive' as const) : ('active' as const) }
      : p
  );
  saveStoreCatalog(updated);
  return getStoreProducts(true);
}

export function deleteCustomStoreProduct(productId: string): StoreProductRecord[] {
  const defaultIds = new Set(INITIAL_STORE_PRODUCT_RECORDS.map((d) => d.id));
  if (defaultIds.has(productId)) return getStoreProducts(true);
  const updated = getStoreProducts(true).filter((p) => p.id !== productId);
  saveStoreCatalog(updated);
  return getStoreProducts(true);
}

export function resetStoreCatalog(): StoreProductRecord[] {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORE_CATALOG_STORAGE_KEY);
  }
  return getStoreProducts(true);
}

export function getSavedBagIds(): string[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORE_BAG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function saveBagIds(ids: string[]): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORE_BAG_STORAGE_KEY, JSON.stringify(Array.from(new Set(ids))));
  } catch {
    // Ignore storage quota issues
  }
}
