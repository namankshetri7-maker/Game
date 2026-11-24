/**
 * Wonder World Kids Store - Data-Driven Catalog, Original Image Asset Binding & Bag Storage
 */

import {
  StoreProductRecord,
  StoreCategory,
  StoreMarketplace,
  ProductStatus,
  OFFICIAL_LOGO_IMAGE,
  ORIGINAL_GAME_SCREENSHOTS,
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
  OFFICIAL_LOGO_IMAGE,
  ORIGINAL_GAME_SCREENSHOTS,
  STORE_CATEGORIES,
  STORE_MARKETPLACES,
  isSafeExternalHttpUrl,
  isSafeCoverImageUrl,
  slugifyProductName,
  getDefaultMarketplaceButtonLabel,
};

export const STORE_COVER_PRESETS: Array<{ label: string; image: string }> = [
  {
    label: 'Word Builder Bee (Phonics Game)',
    image: '/assets/aistudio/Screenshot_20261111-220142_2_ee4c78de.jpg',
  },
  {
    label: 'Food Chain Sorting (Science Game)',
    image: '/assets/aistudio/Screenshot_20261111-220218_2_0367a967.jpg',
  },
  {
    label: 'Dino Addition (Math Game)',
    image: '/assets/aistudio/Screenshot_20261111-220204_2_627c41af.jpg',
  },
  {
    label: 'Multiplication Blitz (Math Game)',
    image: '/assets/aistudio/Screenshot_20261111-220250_2_d2ea05cd.jpg',
  },
  {
    label: 'Dinosaur World Colouring Cover',
    image: '/assets/aistudio/Dinosaur_World_Front_Cover__1__d7e7601e.png',
  },
  {
    label: 'ABC Alphabet Adventure Cover',
    image: '/assets/aistudio/Wonder_World_ABC_Adventure__2__de9ce0c1.png',
  },
  {
    label: 'Christmas Wonderland Cover',
    image: '/assets/aistudio/christmas-wonderland-my-christmas-colouring-book_front_Cover_f4007897.png',
  },
  {
    label: 'My First Maths Adventure Cover',
    image: '/assets/maths_adventure_cover.jpg',
  },
];

export function getStoreProducts(includeInactive: boolean = false): StoreProductRecord[] {
  const all = readStoredProductRecords();
  return includeInactive ? all : all.filter((p) => p.status === 'active');
}

export function getStoreProductBySlug(slug: string): StoreProductRecord | undefined {
  const cleanSlug = (slug || '').trim().toLowerCase();
  return getStoreProducts(true).find((p) => p.slug.toLowerCase() === cleanSlug);
}

export function saveStoreCatalog(products: StoreProductRecord[]): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORE_CATALOG_STORAGE_KEY, JSON.stringify(products));
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
