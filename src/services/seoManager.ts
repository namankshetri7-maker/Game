/**
/**
 * SEO Manager for Wonder World Kids Learning
 * Dynamically synchronizes:
 * 1. Document title
 * 2. Meta description (120-160 chars with target keywords)
 * 3. Canonical URL
 * 4. OpenGraph tags (og:type, og:site_name, og:title, og:description, og:url, og:image)
 * 5. Twitter cards (twitter:card, twitter:title, twitter:description, twitter:image)
 * 6. Structured Data JSON-LD for rich Google Search indexing
 */

export interface PageSEOConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  jsonLd: object[];
}

const BASE_URL = 'https://wonderworldkidslearning.space';
const DEFAULT_IMAGE = `${BASE_URL}/pwa-512x512.png`;

export const SEO_CONFIGS: Record<string, PageSEOConfig> = {
  home: {
    title: 'Wonder World Kids – Kids Learning Game & 45 Educational Mini-Games',
    description: 'Play 45 safe, ad-free offline kids learning games across 5 magical worlds. Boost math, reading & STEM skills with Wonder World Kids for ages 3–8. Start now!',
    canonicalUrl: `${BASE_URL}/`,
    ogType: 'website',
    ogTitle: 'Wonder World Kids – 45 Offline Kids Learning Games for Ages 3–8',
    ogDescription: '45 ad-free offline kids learning games across 5 magical worlds. Boost preschool math, phonics & STEM skills safely with lifetime family access.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Wonder World Kids Learning',
        alternateName: ['Wonder World Kids', 'WonderWorldKids'],
        url: `${BASE_URL}/`,
        description: 'Safe, ad-free, 100% offline educational game suite featuring 45 mini-games across 5 learning worlds for children aged 3–8.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/?page=worlds&q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': ['SoftwareApplication', 'VideoGame'],
        name: 'Wonder World Kids Learning',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Android, iOS, iPadOS, Windows, macOS, ChromeOS',
        gamePlatform: ['Web Browser', 'Progressive Web App', 'Android', 'iOS', 'iPadOS', 'Windows', 'macOS'],
        numberOfPlayers: {
          '@type': 'QuantitativeValue',
          value: 1
        },
        genre: ['Kids Learning Game', 'Educational Game', 'Preschool Games', 'Math Games', 'Phonics Games'],
        audience: {
          '@type': 'PeopleAudience',
          suggestedMinAge: '3',
          suggestedMaxAge: '8'
        },
        offers: {
          '@type': 'Offer',
          price: '9.00',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://namank3.gumroad.com/l/wvpisb'
        },
        description: 'Wonder World Kids is a comprehensive kids learning game platform featuring 45 offline mini-games across math, reading phonics, science, dinosaurs, and art for ages 3–8.'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Wonder World Kids Learning',
        url: BASE_URL,
        logo: DEFAULT_IMAGE,
        email: 'wonderworldkidslearning@gmail.com',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'wonderworldkidslearning@gmail.com',
          contactType: 'customer support',
          availableLanguage: ['English', 'Arabic', 'German', 'French', 'Spanish', 'Hindi']
        }
      }
    ]
  },

  pricing: {
    title: 'Lifetime Family Access ($9 One-Time) – Wonder World Kids Learning Games',
    description: 'Get lifetime access to Wonder World Kids for $9 USD one-time. Unlock 45 offline kids learning games, 5 worlds, and parent tools with zero subscriptions.',
    canonicalUrl: `${BASE_URL}/?page=pricing`,
    ogType: 'product',
    ogTitle: 'Unlock 45 Kids Learning Games – $9 USD Lifetime Family License',
    ogDescription: 'Get full lifetime family access to 45 ad-free offline kids learning games across 5 worlds. One-time $9 USD payment with zero recurring subscriptions.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': ['Product', 'SoftwareApplication'],
        name: 'Wonder World Kids Learning – Lifetime Family License',
        image: DEFAULT_IMAGE,
        description: 'Unlock 45 ad-free offline kids learning games across 5 magical worlds. One-time $9 USD family license with zero subscriptions, offline PWA installation, and progress tracking for up to 4 child profiles.',
        category: 'Kids Learning Game / Educational Software',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Android, iOS, iPadOS, Windows, macOS, ChromeOS',
        brand: {
          '@type': 'Brand',
          name: 'Wonder World Kids Learning'
        },
        audience: {
          '@type': 'PeopleAudience',
          suggestedMinAge: '3',
          suggestedMaxAge: '8'
        },
        offers: {
          '@type': 'Offer',
          url: 'https://namank3.gumroad.com/l/wvpisb',
          priceCurrency: 'USD',
          price: '9.00',
          priceValidUntil: '2027-12-31',
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'Wonder World Kids Learning',
            email: 'wonderworldkidslearning@gmail.com'
          }
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '128',
          bestRating: '5',
          worstRating: '1'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${BASE_URL}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Pricing ($9 Lifetime License)',
            item: `${BASE_URL}/?page=pricing`
          }
        ]
      }
    ]
  },

  worlds: {
    title: 'Explore 5 Magical Learning Worlds (45 Mini-Games) – Wonder World Kids',
    description: 'Explore 5 magical learning worlds with 45 interactive kids educational games. Discover Math Safari, Phonics Island, Science Lab, Dino Discovery & Art Studio.',
    canonicalUrl: `${BASE_URL}/?page=worlds`,
    ogType: 'website',
    ogTitle: 'Explore 5 Learning Worlds – Wonder World Kids Educational Suite',
    ogDescription: '45 interactive mini-games across math, reading, science, logic, and creativity. 100% ad-free & offline PWA.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${BASE_URL}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Explore Worlds',
            item: `${BASE_URL}/?page=worlds`
          }
        ]
      }
    ]
  },

  downloads: {
    title: 'Install Wonder World Kids Offline PWA – iPad, Android, PC, Mac',
    description: 'Install Wonder World Kids offline PWA on iPad, Android, Windows & Mac. Follow 3 easy steps to activate your $9 lifetime family license and play anywhere.',
    canonicalUrl: `${BASE_URL}/?page=downloads`,
    ogType: 'website',
    ogTitle: 'Install Wonder World Kids Offline PWA – No Internet Needed',
    ogDescription: 'Install our safe, ad-free educational game directly to your home screen. Full offline play on iPhone, iPad, Android, Windows, and Mac.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: []
  },

  demo: {
    title: 'Free Interactive Demo Simulator (Play Levels 1 & 2) – Wonder World Kids',
    description: 'Try free interactive demo levels of Wonder World Kids. Play math and phonics mini-games with zero sign-up required. Perfect educational games for ages 3–8.',
    canonicalUrl: `${BASE_URL}/?page=demo`,
    ogType: 'website',
    ogTitle: 'Free Kids Learning Game Demo – Wonder World Kids',
    ogDescription: 'Play sample levels of dinosaur addition, spelling bee, and memory match with no registration needed.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: []
  },

  parents: {
    title: 'Parent Dashboard, Milestones & Safe Screen Time Gate – Wonder World Kids',
    description: 'Safe screen time for kids. Manage child profiles, view learning milestones, and set time limits with COPPA-compliant parental controls in Wonder World Kids.',
    canonicalUrl: `${BASE_URL}/?page=parents`,
    ogType: 'website',
    ogTitle: 'Parent Dashboard & Screen Time Safety – Wonder World Kids',
    ogDescription: 'Track learning progress, star achievements, and playtime limits with zero ads and complete privacy protection.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: []
  },

  activate: {
    title: 'Activate Etsy Order & Claim Lifetime Key – Wonder World Kids Learning',
    description: 'Purchased Wonder World Kids on Etsy for $8.99? Enter your Etsy Order Number to verify your purchase and receive your unique lifetime offline activation key.',
    canonicalUrl: `${BASE_URL}/?page=activate`,
    ogType: 'website',
    ogTitle: 'Activate Your Etsy Purchase – Wonder World Kids Learning',
    ogDescription: 'Instant order verification and unique lifetime activation key assignment for Etsy customers ($8.99 listing). 100% offline play.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: []
  },

  etsy: {
    title: 'Activate Etsy Order & Claim Lifetime Key – Wonder World Kids Learning',
    description: 'Purchased Wonder World Kids on Etsy for $8.99? Enter your Etsy Order Number to verify your purchase and receive your unique lifetime offline activation key.',
    canonicalUrl: `${BASE_URL}/?page=activate`,
    ogType: 'website',
    ogTitle: 'Activate Your Etsy Purchase – Wonder World Kids Learning',
    ogDescription: 'Instant order verification and unique lifetime activation key assignment for Etsy customers ($8.99 listing). 100% offline play.',
    ogImage: DEFAULT_IMAGE,
    jsonLd: []
  }
};

/**
 * Apply SEO metadata, OpenGraph tags, and JSON-LD structured data for the current route.
 */
export function applyRouteSEO(route: string): void {
  const config = SEO_CONFIGS[route] || SEO_CONFIGS['home'];

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

  // 2. Meta Description
  setMetaTag('name', 'description', config.description);

  // 3. OpenGraph Tags
  setMetaTag('property', 'og:type', config.ogType);
  setMetaTag('property', 'og:site_name', 'Wonder World Kids Learning');
  setMetaTag('property', 'og:title', config.ogTitle);
  setMetaTag('property', 'og:description', config.ogDescription);
  setMetaTag('property', 'og:url', config.canonicalUrl);
  setMetaTag('property', 'og:image', config.ogImage);
  setMetaTag('property', 'og:image:width', '512');
  setMetaTag('property', 'og:image:height', '512');
  setMetaTag('property', 'og:image:alt', `${config.title} - Wonder World Kids`);

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

  // 6. Dynamic Page-Specific Structured Data JSON-LD
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
