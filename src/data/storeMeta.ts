/**
 * Wonder World Kids Store - Pure Product Metadata & Configuration
 * Shared safely across SEO utilities and client catalog without binary imports.
 */

export type StoreCategory =
  | 'Learning Games'
  | 'Colouring Books'
  | 'Educational Activity Books'
  | 'Seasonal Collections'
  | 'Digital Learning Resources';

export type StoreMarketplace = 'Etsy' | 'Gumroad' | 'Payhip' | 'Amazon KDP';

export type ProductStatus = 'active' | 'inactive';

export interface StoreProductRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  coverImage: string;
  coverAlt: string;
  category: StoreCategory;
  pages?: number;
  format?: string;
  /** Populate ONLY with verified listing prices. Never fabricate estimates. */
  price?: string;
  priceCurrency?: string;
  marketplace: StoreMarketplace;
  externalUrl: string;
  buttonLabel: string;
  status: ProductStatus;
  isFeatured?: boolean;
  highlights?: string[];
  ageRange?: string;
  isCustom?: boolean;
}

export const STORE_CATEGORIES: readonly StoreCategory[] = [
  'Learning Games',
  'Colouring Books',
  'Educational Activity Books',
  'Seasonal Collections',
  'Digital Learning Resources',
];

export const STORE_MARKETPLACES: readonly StoreMarketplace[] = [
  'Etsy',
  'Gumroad',
  'Payhip',
  'Amazon KDP',
];

export const DEFAULT_GUMROAD_APP_URL = 'https://namank3.gumroad.com/l/wvpisb';
export const STORE_CANONICAL_BASE = 'https://wonderworldkidslearning.space';
export const STORE_CATALOG_STORAGE_KEY = 'wwk_store_catalog_v1';
export const STORE_BAG_STORAGE_KEY = 'wwk_store_bag_v1';

export function isSafeExternalHttpUrl(url: string): boolean {
  const trimmed = (url || '').trim();
  return /^https?:\/\/[^\s]+$/i.test(trimmed);
}

export function isSafeCoverImageUrl(url: string): boolean {
  const trimmed = (url || '').trim();
  return (
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image/') ||
    /^https?:\/\/[^\s]+$/i.test(trimmed)
  );
}

export function slugifyProductName(name: string): string {
  const base = (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `product-${Date.now()}`;
}

export function getDefaultMarketplaceButtonLabel(marketplace: StoreMarketplace): string {
  switch (marketplace) {
    case 'Etsy':
      return 'Buy on Etsy';
    case 'Gumroad':
      return 'Download Now';
    case 'Payhip':
      return 'Buy on Payhip';
    case 'Amazon KDP':
      return 'Buy on Amazon KDP';
    default:
      return 'Buy Now';
  }
}

export const INITIAL_STORE_PRODUCT_RECORDS: StoreProductRecord[] = [
  {
    id: 'prod_learning_app',
    slug: 'wonder-world-kids-learning-app',
    name: 'Wonder World Kids Learning App',
    description:
      'Complete 45-game offline learning adventure across Maths, English, Geography, Science and Animal Kingdom for ages 3–8.',
    longDescription:
      'Unlock the entire Wonder World Kids interactive universe with one lifetime family pass. Children explore 5 vibrant learning islands packed with 40+ educational mini-games across Maths, English Phonics, Geography, Science and the Animal Kingdom — all playable 100% offline with zero ads and zero recurring subscriptions.',
    coverImage: '/pwa-512x512.png',
    coverAlt:
      'Wonder World Kids Learning App displayed on a child-friendly tablet with puzzle islands, numbers, planets and animals',
    category: 'Learning Games',
    format: 'Offline Interactive App',
    price: '9.00',
    priceCurrency: 'USD',
    marketplace: 'Gumroad',
    externalUrl: DEFAULT_GUMROAD_APP_URL,
    buttonLabel: 'Download Now',
    status: 'active',
    isFeatured: true,
    ageRange: 'Ages 3–8',
    highlights: [
      '40+ learning games',
      'Ages 3–8',
      'Maths, English, Geography, Science and Animal Kingdom',
      'Multiple levels',
      '100% offline gameplay',
      'One-time payment, no recurring subscription',
    ],
  },
  {
    id: 'prod_dinosaur_colouring',
    slug: 'dinosaur-world-colouring-book',
    name: 'Dinosaur World Colouring Book',
    description: 'Printable dinosaur colouring book for children.',
    longDescription:
      'Step back into a joyful prehistoric valley with 30 printable colouring pages starring friendly T-Rex, Triceratops, Stegosaurus and gentle dinosaurs. Clean bold outlines make every page inviting for crayons, coloured pencils and markers at home or on family trips.',
    coverImage: '/pwa-512x512.png',
    coverAlt:
      'Dinosaur World Colouring Book cover showing friendly T-Rex and Triceratops in a sunlit jungle valley',
    category: 'Colouring Books',
    pages: 30,
    format: 'Digital PDF',
    marketplace: 'Etsy',
    externalUrl: 'https://www.etsy.com/listing/4615484511/dinosaur-world-coloring-book-30',
    buttonLabel: 'Buy on Etsy',
    status: 'active',
    ageRange: 'Ages 3–8',
    highlights: [
      '30 printable dinosaur illustration pages',
      'Digital PDF for instant printing at home',
      'Clean bold outlines designed for young hands',
    ],
  },
  {
    id: 'prod_abc_alphabet_book',
    slug: 'abc-alphabet-activity-book',
    name: 'ABC Alphabet Activity Book',
    description: 'Educational alphabet activity book for young learners.',
    longDescription:
      'Help early readers build letter recognition, phonics confidence and pencil control through playful ABC tracing, matching and vocabulary activities crafted for preschool and kindergarten learners.',
    coverImage: '/pwa-512x512.png',
    coverAlt:
      'ABC Alphabet Activity Book cover illustration with wooden letter blocks, smiling bee and storybook stars',
    category: 'Educational Activity Books',
    format: 'Digital Printable',
    marketplace: 'Etsy',
    externalUrl: 'https://www.etsy.com/listing/4618473268/abc-alphabet-activity-book-for-kids',
    buttonLabel: 'Buy on Etsy',
    status: 'active',
    ageRange: 'Ages 3–6',
    highlights: [
      'Screen-free alphabet practice and early phonics fun',
      'Designed for preschool and kindergarten skill building',
      'Printable pages for home learning or classroom corners',
    ],
  },
  {
    id: 'prod_christmas_colouring',
    slug: 'christmas-wonderland-colouring-book',
    name: 'Christmas Wonderland Colouring Book',
    description: 'Christmas-themed printable colouring book for children.',
    longDescription:
      'Celebrate the festive season with 30 printable Christmas Wonderland colouring pages featuring cheerful snowmen, woodland reindeer, holiday cottages and sparkling winter trees ready to print whenever creativity strikes.',
    coverImage: '/pwa-512x512.png',
    coverAlt:
      'Christmas Wonderland Colouring Book cover featuring a cheerful snowman and reindeer in a snowy holiday village',
    category: 'Seasonal Collections',
    pages: 30,
    format: 'Digital PDF',
    marketplace: 'Etsy',
    externalUrl: 'https://www.etsy.com/listing/4623136130/christmas-wonderland-printable-colouring',
    buttonLabel: 'Buy on Etsy',
    status: 'active',
    ageRange: 'Ages 3–8',
    highlights: [
      '30 festive winter and holiday colouring scenes',
      'Instant Digital PDF printable anytime',
      'Cozy, child-friendly seasonal illustrations',
    ],
  },
];

export function readStoredProductRecords(): StoreProductRecord[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return INITIAL_STORE_PRODUCT_RECORDS;
  }

  try {
    const raw = localStorage.getItem(STORE_CATALOG_STORAGE_KEY);
    if (!raw) return INITIAL_STORE_PRODUCT_RECORDS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_STORE_PRODUCT_RECORDS;
    }

    const byId = new Map<string, Partial<StoreProductRecord>>();
    for (const item of parsed) {
      if (item && typeof item.id === 'string') {
        byId.set(item.id, item);
      }
    }

    const mergedDefaults = INITIAL_STORE_PRODUCT_RECORDS.map((def) => {
      const override = byId.get(def.id);
      if (!override) return def;
      return {
        ...def,
        ...override,
        id: def.id,
        slug: typeof override.slug === 'string' && override.slug.trim() ? override.slug : def.slug,
        status: override.status === 'inactive' ? ('inactive' as const) : ('active' as const),
      };
    });

    const defaultIds = new Set(INITIAL_STORE_PRODUCT_RECORDS.map((p) => p.id));
    const customItems = parsed.filter(
      (item): item is StoreProductRecord =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        !defaultIds.has(item.id) &&
        typeof item.name === 'string' &&
        typeof item.slug === 'string'
    );

    return [...mergedDefaults, ...customItems];
  } catch {
    return INITIAL_STORE_PRODUCT_RECORDS;
  }
}

export function findStoreProductRecordBySlug(slug: string): StoreProductRecord | undefined {
  const cleanSlug = (slug || '').trim().toLowerCase();
  return readStoredProductRecords().find((p) => p.slug.toLowerCase() === cleanSlug);
}
