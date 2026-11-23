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
  galleryImages?: Array<{ src: string; alt: string; label: string }>;
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

export const OFFICIAL_LOGO_IMAGE = '/assets/aistudio/pwa-512x512_ba215e1b.png';

export const ORIGINAL_GAME_SCREENSHOTS: Array<{ src: string; alt: string; label: string }> = [
  {
    src: '/assets/aistudio/Screenshot_20261111-220142_2_ee4c78de.jpg',
    alt: 'Dino Addition #1 math counting game inside Wonder World Kids Learning',
    label: 'Dino Addition (Math)',
  },
  {
    src: '/assets/aistudio/Screenshot_20261111-220218_2_0367a967.jpg',
    alt: 'Word Builder Bee phonics spelling game inside Wonder World Kids Learning',
    label: 'Word Builder Bee (English)',
  },
  {
    src: '/assets/aistudio/Screenshot_20261111-220204_2_627c41af.jpg',
    alt: 'Multiplication Blitz equation game inside Wonder World Kids Learning',
    label: 'Multiplication Blitz (Math)',
  },
  {
    src: '/assets/aistudio/Screenshot_20261111-220250_2_d2ea05cd.jpg',
    alt: 'Food Chain Sorting animal science game inside Wonder World Kids Learning',
    label: 'Food Chain Sorting (Science)',
  },
];

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
export const STORE_CATALOG_STORAGE_KEY = 'wwk_store_catalog_v2';
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
    coverImage: '/assets/aistudio/Screenshot_20261111-220142_2_ee4c78de.jpg',
    coverAlt:
      'Wonder World Kids Learning App featuring Dino Addition, Word Builder Bee, Multiplication Blitz, and Food Chain Sorting games',
    galleryImages: ORIGINAL_GAME_SCREENSHOTS,
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
    coverImage: '/assets/aistudio/Dinosaur_World_Front_Cover__1__d7e7601e.png',
    coverAlt:
      'Dinosaur World Colouring Book cover showing friendly dinosaurs, volcano, and tropical jungle for ages 3-5',
    category: 'Colouring Books',
    pages: 30,
    format: 'Digital PDF',
    marketplace: 'Etsy',
    externalUrl: 'https://www.etsy.com/listing/4615484511/dinosaur-world-coloring-book-30',
    buttonLabel: 'Buy on Etsy',
    status: 'active',
    ageRange: 'Ages 3–5',
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
    coverImage: '/assets/aistudio/Wonder_World_ABC_Adventure__2__de9ce0c1.png',
    coverAlt:
      'Wonder World Kids Learning ABC World — My First Alphabet Adventure cover showing ABC letters, kids, bear, and early learning highlights',
    category: 'Educational Activity Books',
    format: 'Digital Printable',
    marketplace: 'Etsy',
    externalUrl: 'https://www.etsy.com/listing/4618473268/abc-alphabet-activity-book-for-kids',
    buttonLabel: 'Buy on Etsy',
    status: 'active',
    ageRange: 'Ages 3–8',
    highlights: [
      'Screen-free alphabet practice and early phonics fun',
      'Designed to boost memory, confidence, and early skills',
      'Printable pages for home learning or classroom corners',
    ],
  },
  {
    id: 'prod_christmas_colouring',
    slug: 'christmas-wonderland-colouring-book',
    name: 'Christmas Wonderland Colouring Book',
    description: 'Christmas-themed printable colouring book for children.',
    longDescription:
      'Celebrate the festive season with 30 printable Christmas Wonderland colouring pages featuring Santa, cheerful snowman, woodland reindeer, and decorated Christmas trees ready to print whenever creativity strikes.',
    coverImage: '/assets/aistudio/christmas-wonderland-my-christmas-colouring-book_front_Cover_f4007897.png',
    coverAlt:
      'Christmas Wonderland My Christmas Colouring Book front cover featuring Santa, snowman, reindeer and Christmas tree for ages 3-8',
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
  {
    id: 'prod_maths_adventure_book',
    slug: 'my-first-maths-adventure-printable',
    name: 'My First Maths Adventure Printable Book',
    description: 'Printable early maths activity book for young learners covering counting, addition and shapes.',
    longDescription:
      'Make early numeracy exciting with My First Maths Adventure Printable Book! Crafted for young learners aged 3–8, this printable activity workbook builds number recognition, counting confidence, simple addition, pattern spotting and early shape skills at home or in the classroom.',
    coverImage: '/assets/maths_adventure_cover.jpg',
    coverAlt:
      'My First Maths Adventure Printable Book cover featuring children, baby dinosaur, colorful numbers 1 to 5, apples, and geometric shapes',
    category: 'Educational Activity Books',
    format: 'Digital Printable',
    marketplace: 'Etsy',
    externalUrl: 'https://www.etsy.com/listing/4623674119/my-first-maths-adventure-printable',
    buttonLabel: 'Buy on Etsy',
    status: 'active',
    ageRange: 'Ages 3–8',
    highlights: [
      'Early counting, numbers and playful addition activities',
      'Visual puzzles with shapes, fruit counting and patterns',
      'Instant Digital Printable for screen-free home or classroom practice',
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
      const overrideCover =
        typeof override.coverImage === 'string' &&
        override.coverImage.trim() &&
        override.coverImage !== '/pwa-512x512.png' &&
        !override.coverImage.includes('store_')
          ? override.coverImage
          : def.coverImage;
      return {
        ...def,
        ...override,
        id: def.id,
        coverImage: overrideCover,
        galleryImages: def.galleryImages,
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
