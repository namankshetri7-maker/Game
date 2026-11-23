/**
 * SEO Manager & Clean Multi-Page Route Path Helper for Wonder World Kids Learning
 * Dynamically synchronizes:
 * 1. Document title
 * 2. Meta description (120-160 chars with target keywords)
 * 3. Meta keywords + Geo targeting + OpenGraph locale
 * 4. Canonical URL + per-route international hreflang alternate links
 * 5. OpenGraph & Twitter Cards
 * 6. Structured Data JSON-LD (Product, SoftwareApplication, CollectionPage, LearningResource, FAQPage, BreadcrumbList)
 */

import {
  findStoreProductRecordBySlug,
  STORE_CANONICAL_BASE,
  StoreProductRecord,
} from '../data/storeMeta';

export interface PageSEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt?: string;
  jsonLd: object[];
}

const BASE_URL = STORE_CANONICAL_BASE;
const DEFAULT_IMAGE = `${BASE_URL}/pwa-512x512.png`;
const DEFAULT_KEYWORDS =
  'wonder world kids, kids learning game, educational games for kids, preschool learning app, kindergarten games, toddler math games, phonics reading app, homeschool printables, kids colouring books, offline PWA kids app';

const INTERNATIONAL_HREFLANGS = [
  'en-us',
  'en-gb',
  'en-in',
  'en-ca',
  'en-au',
  'en-sg',
  'en-ae',
  'ar-ae',
  'en-nz',
  'de-de',
  'fr-fr',
  'es-es',
  'en-za',
  'x-default',
] as const;

const SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: {
    '@type': 'MonetaryAmount',
    value: '0.00',
    currency: 'USD',
  },
  shippingDestination: [
    { '@type': 'DefinedRegion', addressCountry: 'US' },
    { '@type': 'DefinedRegion', addressCountry: 'GB' },
    { '@type': 'DefinedRegion', addressCountry: 'IN' },
    { '@type': 'DefinedRegion', addressCountry: 'CA' },
    { '@type': 'DefinedRegion', addressCountry: 'AU' },
    { '@type': 'DefinedRegion', addressCountry: 'SG' },
    { '@type': 'DefinedRegion', addressCountry: 'AE' },
  ],
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 0,
      unitCode: 'DAY',
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 0,
      unitCode: 'DAY',
    },
  },
};

const MERCHANT_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: ['US', 'GB', 'IN', 'CA', 'AU', 'SG', 'AE'],
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 14,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
};

export const MERCHANT_OFFER_SCHEMA = {
  '@type': 'Offer',
  url: 'https://namank3.gumroad.com/l/wvpisb',
  priceCurrency: 'USD',
  price: '9.00',
  validFrom: '2025-01-01',
  priceValidUntil: '2027-12-31',
  availability: 'https://schema.org/InStock',
  itemCondition: 'https://schema.org/NewCondition',
  shippingDetails: SHIPPING_DETAILS,
  hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
  seller: {
    '@type': 'Organization',
    name: 'Wonder World Kids Learning',
    email: 'wonderworldkidslearning@gmail.com',
  },
};

const WORLD_SEO_MAP: Record<
  string,
  { title: string; description: string; keywords: string; ogTitle: string; label: string }
> = {
  world_math: {
    title: 'Math Magic Valley (10 Kids Math Games) – Wonder World Kids',
    description:
      'Play 10 fun kids math learning games in Math Magic Valley: addition, counting, subtraction, shapes & telling time offline for ages 3–8.',
    keywords:
      'kids math games, dinosaur addition game, counting games for toddlers, preschool math app, kindergarten subtraction, shape sorter kids, multiplication games ages 3-8',
    ogTitle: 'Math Magic Valley – 10 Offline Kids Math Games',
    label: 'Math Magic Valley',
  },
  world_phonics: {
    title: 'English & Phonics Jungle (10 Reading Games) – Wonder World Kids',
    description:
      'Boost reading with 10 offline phonics and spelling kids learning games: ABC tracing, rhyming, sight words & sentences for ages 3–8.',
    keywords:
      'phonics games for kids, abc letter tracing app, early reading games, kindergarten spelling game, sight words practice, toddler alphabet games offline',
    ogTitle: 'English & Phonics Jungle – 10 Kids Reading Games',
    label: 'English & Phonics Jungle',
  },
  world_geography: {
    title: 'World Geography & Cultures (10 Map Games) – Wonder World Kids',
    description:
      'Explore continents, flags, landmarks & oceans with 10 interactive geography kids learning games playable 100% offline for ages 4–8.',
    keywords:
      'kids geography games, world continents puzzle for kids, kids flags game, oceans and landmarks learning app, homeschool geography ages 4-8',
    ogTitle: 'World Geography & Cultures – 10 Kids Map Games',
    label: 'World Geography & Cultures',
  },
  world_science: {
    title: 'Animal Kingdom & Science (10 STEM Games) – Wonder World Kids',
    description:
      'Discover planets, animal sounds, fossils & habitats with 10 offline STEM kids learning games built for curious kids ages 3–8.',
    keywords:
      'kids science games, animal sound memory game, solar system game for kids, stem learning app preschool, animal habitats kids quiz',
    ogTitle: 'Animal Kingdom & Science – 10 Kids STEM Games',
    label: 'Animal Kingdom & Science',
  },
  world_logic: {
    title: 'Logic, Brain & Creativity (5 Puzzle Games) – Wonder World Kids',
    description:
      'Train focus and creativity with 5 offline brain puzzle kids learning games: shadow match, mazes, pixel art & memory for ages 3–8.',
    keywords:
      'brain games for kids, kids memory card flip, logic puzzles kindergarten, pixel art kids creativity, shadow match toddler game',
    ogTitle: 'Logic, Brain & Creativity – 5 Kids Brain Games',
    label: 'Logic, Brain & Creativity',
  },
};

/**
 * Resolve canonical clean path for any website route.
 */
export function getRoutePath(route: string, worldOrSlug?: string): string {
  switch (route) {
    case 'home':
      return '/';
    case 'store':
      return '/store';
    case 'store_product':
      return `/store/${worldOrSlug || 'wonder-world-kids-learning-app'}`;
    case 'worlds':
      return '/worlds';
    case 'world_detail':
      return `/worlds/${worldOrSlug || 'world_math'}`;
    case 'demo':
      return '/demo';
    case 'pricing':
      return '/pricing';
    case 'downloads':
      return '/downloads';
    case 'parents':
      return '/parents';
    case 'about':
      return '/about';
    case 'faq':
      return '/faq';
    case 'privacy':
      return '/privacy';
    case 'contact':
      return '/contact';
    case 'my_games':
      return '/my-games';
    case 'activate':
      return '/activate';
    case 'success':
      return '/success';
    default:
      return '/';
  }
}

export const SEO_CONFIGS: Record<string, PageSEOConfig> = {
  home: {
    title: 'Wonder World Kids – Kids Learning Game & 45 Educational Mini-Games',
    description:
      'Play 45 safe, ad-free offline kids learning games across 5 magical worlds. Boost math, reading & STEM skills with Wonder World Kids for ages 3–8. Start now!',
    keywords:
      'wonder world kids, kids learning game, educational games for kids, preschool learning app, kindergarten games, printable kids colouring books, printable maths workbook, offline pwa kids app',
    canonicalUrl: `${BASE_URL}/`,
    ogType: 'website',
    ogTitle: 'Wonder World Kids – 45 Offline Kids Learning Games for Ages 3–8',
    ogDescription:
      '45 ad-free offline kids learning games across 5 magical worlds. Boost preschool math, phonics & STEM skills safely with lifetime family access.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Wonder World Kids Learning',
        alternateName: ['Wonder World Kids', 'WonderWorldKids'],
        url: `${BASE_URL}/`,
        inLanguage: 'en',
        description:
          'Safe, ad-free, 100% offline educational game suite featuring 45 mini-games across 5 learning worlds for children aged 3–8.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/worlds?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': ['SoftwareApplication', 'VideoGame'],
        name: 'Wonder World Kids Learning',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Android, iOS, iPadOS, Windows, macOS, ChromeOS',
        gamePlatform: [
          'Web Browser',
          'Progressive Web App',
          'Android',
          'iOS',
          'iPadOS',
          'Windows',
          'macOS',
        ],
        numberOfPlayers: {
          '@type': 'QuantitativeValue',
          value: 1,
        },
        genre: [
          'Kids Learning Game',
          'Educational Game',
          'Preschool Games',
          'Math Games',
          'Phonics Games',
        ],
        audience: {
          '@type': 'PeopleAudience',
          suggestedMinAge: '3',
          suggestedMaxAge: '8',
        },
        offers: MERCHANT_OFFER_SCHEMA,
        description:
          'Wonder World Kids is a comprehensive kids learning game platform featuring 45 offline mini-games across math, reading phonics, geography, science, and logic for ages 3–8.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Wonder World Kids Learning',
        url: BASE_URL,
        logo: DEFAULT_IMAGE,
        email: 'wonderworldkidslearning@gmail.com',
        areaServed: ['US', 'GB', 'IN', 'CA', 'AU', 'SG', 'AE', 'DE', 'FR', 'ES', 'NZ', 'ZA'],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'wonderworldkidslearning@gmail.com',
          contactType: 'customer support',
          availableLanguage: ['English', 'Arabic', 'German', 'French', 'Spanish', 'Hindi'],
        },
      },
    ],
  },

  pricing: {
    title: 'Lifetime Family Access ($9 USD) – Wonder World Kids Games',
    description:
      'Get lifetime access to Wonder World Kids on Gumroad ($9) or activate your family license key. Unlock 45 offline kids learning games, 5 worlds & parent controls.',
    keywords:
      'wonder world kids pricing, kids learning app lifetime license, gumroad educational games kids, offline preschool games unlock key, ad free kids app $9',
    canonicalUrl: `${BASE_URL}/pricing`,
    ogType: 'product',
    ogTitle: 'Unlock 45 Kids Learning Games – Lifetime Family License',
    ogDescription:
      'Get full lifetime family access to 45 ad-free offline kids learning games across 5 worlds via Gumroad ($9) or your activation key with zero subscriptions.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': ['Product', 'SoftwareApplication'],
        name: 'Wonder World Kids Learning – Lifetime Family License',
        image: DEFAULT_IMAGE,
        description:
          'Unlock 45 ad-free offline kids learning games across 5 magical worlds. One-time family license with zero subscriptions, offline PWA installation, and progress tracking for up to 4 child profiles.',
        category: 'Kids Learning Game / Educational Software',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Android, iOS, iPadOS, Windows, macOS, ChromeOS',
        brand: {
          '@type': 'Brand',
          name: 'Wonder World Kids Learning',
        },
        audience: {
          '@type': 'PeopleAudience',
          suggestedMinAge: '3',
          suggestedMaxAge: '8',
        },
        offers: MERCHANT_OFFER_SCHEMA,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '128',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Pricing (Lifetime License)',
            item: `${BASE_URL}/pricing`,
          },
        ],
      },
    ],
  },

  worlds: {
    title: 'Explore 5 Magical Learning Worlds (45 Mini-Games) – Wonder World Kids',
    description:
      'Explore 5 magical learning worlds with 45 interactive kids educational games: Math Magic Valley, Phonics Jungle, Geography, Science & Logic.',
    keywords:
      '5 kids learning worlds, 45 educational mini games, math phonics geography science logic for kids, preschool kindergarten games offline',
    canonicalUrl: `${BASE_URL}/worlds`,
    ogType: 'website',
    ogTitle: 'Explore 5 Learning Worlds – Wonder World Kids Educational Suite',
    ogDescription:
      '45 interactive mini-games across math, reading, geography, science, and logic. 100% ad-free & offline PWA.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: 'Wonder World Kids 5 Educational Worlds',
        educationalLevel: ['Preschool', 'Kindergarten', 'Grade 1', 'Grade 2'],
        learningResourceType: 'Interactive Educational Game Suite',
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
        },
        url: `${BASE_URL}/worlds`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Explore Worlds', item: `${BASE_URL}/worlds` },
        ],
      },
    ],
  },

  downloads: {
    title: 'Install Wonder World Kids Offline PWA – iPad, Android, PC, Mac',
    description:
      'Install Wonder World Kids offline PWA on iPad, Android, Windows & Mac. Enter your activation key or purchase on Gumroad to play anywhere offline.',
    keywords:
      'install offline kids learning app, kids game ipad iphone safari pwa, android kids educational game offline, mac windows offline kids learning software',
    canonicalUrl: `${BASE_URL}/downloads`,
    ogType: 'website',
    ogTitle: 'Install Wonder World Kids Offline PWA – No Internet Needed',
    ogDescription:
      'Install our safe, ad-free kids learning game directly to your home screen on iPhone, iPad, Android, Windows, and Mac.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Install Offline App',
            item: `${BASE_URL}/downloads`,
          },
        ],
      },
    ],
  },

  demo: {
    title: 'Free Interactive Demo Simulator (Play Levels 1 & 2) – Wonder World Kids',
    description:
      'Try free interactive demo levels of Wonder World Kids. Play 10 kids learning mini-games across math, phonics, science & logic with zero sign-up.',
    keywords:
      'free kids learning games online demo, try preschool math phonics games free, free dinosaur addition simulator, word builder bee kids demo',
    canonicalUrl: `${BASE_URL}/demo`,
    ogType: 'website',
    ogTitle: 'Free Kids Learning Game Demo – Wonder World Kids',
    ogDescription: 'Play sample levels across all 5 learning worlds with zero registration needed.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Free Demo Simulator',
            item: `${BASE_URL}/demo`,
          },
        ],
      },
    ],
  },

  parents: {
    title: 'Parent Dashboard, Milestones & Safe Screen Time – Wonder World Kids',
    description:
      'Safe screen time for kids. Manage child profiles, view learning milestones for parent meetings & set limits with COPPA-safe parental controls.',
    keywords:
      'safe screen time for kids, coppa compliant kids educational app, parental controls kids learning game, preschool kindergarten learning milestones',
    canonicalUrl: `${BASE_URL}/parents`,
    ogType: 'website',
    ogTitle: 'Parent Dashboard & Screen Time Safety – Wonder World Kids',
    ogDescription:
      'Track learning progress, star achievements, and playtime limits with zero ads and complete privacy protection.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Parents & Safety',
            item: `${BASE_URL}/parents`,
          },
        ],
      },
    ],
  },

  about: {
    title: 'About Wonder World Kids Learning – Ad-Free Educational Mission',
    description:
      'Learn how Wonder World Kids empowers children ages 3–8 across India, US, UK, UAE, Singapore & Australia with 45 offline educational games.',
    keywords:
      'about wonder world kids learning, ad free early childhood education, global kids learning marketplace, homeschool preschool curriculum app',
    canonicalUrl: `${BASE_URL}/about`,
    ogType: 'website',
    ogTitle: 'About Wonder World Kids Learning',
    ogDescription:
      'Our mission to deliver ad-free, 100% offline interactive education for families worldwide.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About Wonder World Kids',
            item: `${BASE_URL}/about`,
          },
        ],
      },
    ],
  },

  faq: {
    title: 'Frequently Asked Questions (FAQ) – Wonder World Kids Learning',
    description:
      'Answers about Wonder World Kids offline PWA setup, Gumroad & activation keys, iPad/Android install, and 45 kids learning games.',
    keywords:
      'wonder world kids faq, offline pwa setup help kids, gumroad key activation help, ad free kids app questions',
    canonicalUrl: `${BASE_URL}/faq`,
    ogType: 'website',
    ogTitle: 'FAQ – Wonder World Kids Learning',
    ogDescription: 'Everything parents need to know about offline setup, lifetime keys, and safety.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Wonder World Kids Learning?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'An ad-free, 100% offline educational game suite featuring 45 interactive mini-games across 5 worlds plus printable colouring and early learning workbooks for children aged 3–8.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does Wonder World Kids work 100% offline without Wi-Fi?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Install it once as a Progressive Web App (PWA) on Mac, Windows, iPhone, iPad, or Android and all 45 games work completely offline.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I activate my license key?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Open /activate or click Enter Activation Key on the pricing, demo, or download pages to permanently unlock all 45 games on your device.',
            },
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${BASE_URL}/faq` },
        ],
      },
    ],
  },

  privacy: {
    title: 'COPPA Safe Privacy Policy & Zero Data Tracking – Wonder World Kids',
    description:
      'Wonder World Kids collects zero personal data, shows zero ads, and stores all child game progress locally on your device for total privacy.',
    keywords:
      'coppa kids app privacy policy, gdpr-k kids safe game, zero telemetry children app, local offline kids learning',
    canonicalUrl: `${BASE_URL}/privacy`,
    ogType: 'website',
    ogTitle: 'Privacy Policy – Wonder World Kids Learning',
    ogDescription: '100% local offline storage with zero advertising and zero third-party telemetry.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${BASE_URL}/privacy` },
        ],
      },
    ],
  },

  contact: {
    title: 'Parent Support & Contact Us – Wonder World Kids Learning',
    description:
      'Need help with activation keys or offline PWA installation? Contact Wonder World Kids support at wonderworldkidslearning@gmail.com anytime.',
    keywords:
      'wonder world kids support, license key activation help, parents help desk educational games',
    canonicalUrl: `${BASE_URL}/contact`,
    ogType: 'website',
    ogTitle: 'Contact Support – Wonder World Kids Learning',
    ogDescription: 'Direct family support for activation keys, Gumroad orders, and device setup.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Contact Support', item: `${BASE_URL}/contact` },
        ],
      },
    ],
  },

  my_games: {
    title: 'My Purchased Games & License Activation – Wonder World Kids',
    description:
      'Enter your activation key to unlock all 45 offline kids learning games and install Wonder World Kids on your device.',
    keywords:
      'my purchased kids games, retrieve wonder world kids license, activate offline learning games',
    canonicalUrl: `${BASE_URL}/my-games`,
    ogType: 'website',
    ogTitle: 'My Purchased Games – Wonder World Kids',
    ogDescription: 'Enter your license activation key for lifetime offline access.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [],
  },

  activate: {
    title: 'Activate Lifetime License Key – Wonder World Kids Learning',
    description:
      'Have a Wonder World Kids license key? Enter your activation key to permanently unlock all 45 offline kids learning games.',
    keywords:
      'activate wonder world kids key, enter license key kids learning app, unlock 45 offline games',
    canonicalUrl: `${BASE_URL}/activate`,
    ogType: 'website',
    ogTitle: 'Activate Your Lifetime Key – Wonder World Kids Learning',
    ogDescription: 'Instant lifetime key verification for 45 ad-free offline kids learning games.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [],
  },

  store: {
    title: 'Wonder World Kids Store – Learn, Play & Create',
    description:
      'Shop Wonder World Kids educational offline learning games and printable colouring, maths & alphabet activity books for children aged 3–8.',
    keywords:
      'kids learning store, printable kids colouring books pdf, dinosaur world colouring book, abc alphabet activity book, first maths adventure printable workbook, offline kids learning app store',
    canonicalUrl: `${BASE_URL}/store`,
    ogType: 'website',
    ogTitle: 'Wonder World Kids Store – Learn, Play & Create',
    ogDescription:
      'Explore our offline kids learning app and printable dinosaur, ABC alphabet, maths, and seasonal colouring books.',
    ogImage: DEFAULT_IMAGE,
    ogImageAlt: 'Wonder World Kids Store collection of offline learning games and printable books',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Wonder World Kids Store – Learn, Play & Create',
        url: `${BASE_URL}/store`,
        description:
          'Central catalog showcasing the Wonder World Kids Learning App and printable children colouring, maths & activity books.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Store', item: `${BASE_URL}/store` },
        ],
      },
    ],
  },
};

export function getWorldSEO(worldId: string): PageSEOConfig {
  const world = WORLD_SEO_MAP[worldId] || WORLD_SEO_MAP.world_math;
  const canonicalUrl = `${BASE_URL}/worlds/${worldId || 'world_math'}`;
  return {
    title: world.title,
    description: world.description,
    keywords: world.keywords,
    canonicalUrl,
    ogType: 'website',
    ogTitle: world.ogTitle,
    ogDescription: world.description,
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: world.label,
        description: world.description,
        url: canonicalUrl,
        educationalLevel: ['Preschool', 'Kindergarten', 'Grade 1', 'Grade 2'],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Explore Worlds', item: `${BASE_URL}/worlds` },
          { '@type': 'ListItem', position: 3, name: world.label, item: canonicalUrl },
        ],
      },
    ],
  };
}

function buildStoreProductJsonLd(
  product: StoreProductRecord,
  canonicalUrl: string
): object[] {
  const productNode: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    url: canonicalUrl,
    brand: {
      '@type': 'Brand',
      name: 'Wonder World Kids Learning',
    },
  };

  if (product.price) {
    productNode.offers = {
      '@type': 'Offer',
      url: product.externalUrl,
      price: product.price,
      priceCurrency: product.priceCurrency || 'USD',
    };
  }

  return [
    productNode,
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Store', item: `${BASE_URL}/store` },
        { '@type': 'ListItem', position: 3, name: product.name, item: canonicalUrl },
      ],
    },
  ];
}

export function getStoreProductSEO(slug: string): PageSEOConfig {
  const product = findStoreProductRecordBySlug(slug);
  if (!product) {
    return SEO_CONFIGS.store;
  }

  const canonicalUrl = `${BASE_URL}/store/${product.slug}`;
  const pageTitle = `${product.name} – Wonder World Kids Store`;
  const imageUrl = product.coverImage.startsWith('http')
    ? product.coverImage
    : product.coverImage.startsWith('/')
    ? `${BASE_URL}${product.coverImage}`
    : DEFAULT_IMAGE;

  return {
    title: pageTitle,
    description: product.description,
    keywords: `${product.name.toLowerCase()}, ${product.category.toLowerCase()}, kids learning printable, wonder world kids store, ages 3-8`,
    canonicalUrl,
    ogType: 'product',
    ogTitle: pageTitle,
    ogDescription: product.description,
    ogImage: imageUrl,
    ogImageAlt: product.coverAlt,
    jsonLd: buildStoreProductJsonLd(product, canonicalUrl),
  };
}

/**
 * Apply SEO metadata, keywords, geo/locale tags, hreflang alternates, OpenGraph,
 * canonical link, and JSON-LD structured data for the current route.
 */
export function applyRouteSEO(route: string, worldOrSlug?: string): void {
  const config =
    route === 'world_detail' && worldOrSlug
      ? getWorldSEO(worldOrSlug)
      : route === 'store_product' && worldOrSlug
      ? getStoreProductSEO(worldOrSlug)
      : SEO_CONFIGS[route] || SEO_CONFIGS['home'];

  // 1. Update Document Title
  document.title = config.title;

  // Helper for meta tags
  const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
    let meta = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attrName, attrValue);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // 2. Meta Description & High-Intent Route Keywords
  setMetaTag('name', 'description', config.description);
  setMetaTag('name', 'keywords', config.keywords || DEFAULT_KEYWORDS);
  setMetaTag('name', 'geo.region', 'US;GB;IN;CA;AU;SG;AE;DE;FR;ES;NZ;ZA;SA;QA');
  setMetaTag(
    'name',
    'geo.placename',
    'Global Worldwide - United States, United Kingdom, India, Canada, Australia, Singapore, Dubai UAE, Middle East, Europe'
  );
  setMetaTag('name', 'ICBM', '20.0, 0.0');

  // 3. OpenGraph Tags + Locale
  setMetaTag('property', 'og:type', config.ogType);
  setMetaTag('property', 'og:locale', 'en_US');
  setMetaTag('property', 'og:site_name', 'Wonder World Kids Learning');
  setMetaTag('property', 'og:title', config.ogTitle);
  setMetaTag('property', 'og:description', config.ogDescription);
  setMetaTag('property', 'og:url', config.canonicalUrl);
  setMetaTag('property', 'og:image', config.ogImage);
  setMetaTag('property', 'og:image:width', '512');
  setMetaTag('property', 'og:image:height', '512');
  setMetaTag('property', 'og:image:alt', config.ogImageAlt || `${config.title} - Wonder World Kids`);

  // 4. Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', config.ogTitle);
  setMetaTag('name', 'twitter:description', config.ogDescription);
  setMetaTag('name', 'twitter:image', config.ogImage);

  // 5. Canonical Link
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = config.canonicalUrl;

  // 6. Per-Route International Hreflang Alternates
  for (const hreflang of INTERNATIONAL_HREFLANGS) {
    let linkEl = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.rel = 'alternate';
      linkEl.setAttribute('hreflang', hreflang);
      document.head.appendChild(linkEl);
    }
    linkEl.href = config.canonicalUrl;
  }

  // 7. Dynamic Page-Specific Structured Data JSON-LD
  let scriptTag = document.querySelector<HTMLScriptElement>('#page-route-jsonld');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.id = 'page-route-jsonld';
    scriptTag.type = 'application/ld+json';
    document.head.appendChild(scriptTag);
  }

  if (config.jsonLd && config.jsonLd.length > 0) {
    scriptTag.textContent = JSON.stringify(
      config.jsonLd.length === 1 ? config.jsonLd[0] : config.jsonLd,
      null,
      2
    );
  } else {
    scriptTag.textContent = '';
  }
}
