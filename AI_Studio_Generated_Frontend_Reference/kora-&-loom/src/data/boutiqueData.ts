export type BoutiqueCategory =
  | 'Kanchipuram Silks'
  | 'Banarasi & Soft Silks'
  | 'Cotton & Maheshwari'
  | 'Tissue Linen'
  | 'Ready-Made Blouses'
  | 'Bridal & Gift Combos';

export interface SareeProduct {
  id: string;
  sku: string;
  name: string;
  category: BoutiqueCategory;
  shortDesc: string;
  drapeOptions: Array<{ label: string; multiplier: number }>;
  defaultOption: string;
  originalPrice: number;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  secondaryImage: string;
  offerLabel?: string;
  fabricSpec: string;
  blouseDetails: string;
  sectionTags: Array<'bestseller' | 'featured' | 'new'>;
}

export interface BoutiqueCategoryTile {
  id: BoutiqueCategory;
  title: string;
  subtitle: string;
  itemCount: string;
  image: string;
}

export interface SpecialBoutiqueCollection {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  filterCategory: BoutiqueCategory;
  image: string;
}

export interface BoutiqueReview {
  id: string;
  name: string;
  city: string;
  purchasedItem: string;
  rating: 5 | 4 | 3;
  sentiment: 'positive' | 'constructive';
  comment: string;
  careNote?: string;
}

export interface BoutiqueSocialPost {
  id: string;
  image: string;
  handle: string;
  caption: string;
  linkedProductId: string;
}

export const BRAND_INFO = {
  name: 'Kora & Loom',
  firstWord: 'Kora',
  secondWord: 'Loom',
  tagline: 'Handpicked Heritage Sarees',
  addressLine1: '12 Sample Loom Street,',
  addressLine2: 'Heritage Market, Sample City – 600001',
  fullAddress: '12 Sample Loom Street, Heritage Market, Sample City – 600001',
  phone: '+91 81245 36947',
  email: 'hello@koraandloom-demo.example',
  instagramHandle: '@koraandloom_demo',
  instagramUrl: 'https://www.instagram.com/koraandloom_demo',
};

const IMG_HERO = '/src/assets/images/hero_kanchipuram_editorial_1795082278166.jpg';
const IMG_BANARASI = '/src/assets/images/product_banarasi_crimson_1795082277292.jpg';
const IMG_EMERALD = '/src/assets/images/product_emerald_drape_1795082277045.jpg';
const IMG_IVORY = '/src/assets/images/product_ivory_linen_1795082277269.jpg';
const IMG_OCHRE = '/src/assets/images/product_maheshwari_ochre_1795082277630.jpg';
const IMG_ZARI = '/src/assets/images/detail_zari_weave_1795082278018.jpg';
const IMG_BLOUSE = '/src/assets/images/product_blouse_jewellery_1795082278000.jpg';
const IMG_DIWALI = '/src/assets/images/product_festive_diwali_1795082278294.jpg';

export const BOUTIQUE_IMAGES = {
  hero: IMG_HERO,
  banarasi: IMG_BANARASI,
  emerald: IMG_EMERALD,
  ivory: IMG_IVORY,
  ochre: IMG_OCHRE,
  zari: IMG_ZARI,
  blouse: IMG_BLOUSE,
  diwali: IMG_DIWALI,
};

export const BOUTIQUE_CATEGORIES: BoutiqueCategoryTile[] = [
  {
    id: 'Kanchipuram Silks',
    title: 'Kanchipuram Silks',
    subtitle: 'Temple zari & bridal drapes',
    itemCount: '24 weaves',
    image: IMG_EMERALD,
  },
  {
    id: 'Banarasi & Soft Silks',
    title: 'Banarasi & Soft Silks',
    subtitle: 'Featherlight festive pallus',
    itemCount: '19 weaves',
    image: IMG_BANARASI,
  },
  {
    id: 'Cotton & Maheshwari',
    title: 'Cotton & Maheshwari',
    subtitle: 'Breezy all-day handlooms',
    itemCount: '22 weaves',
    image: IMG_OCHRE,
  },
  {
    id: 'Tissue Linen',
    title: 'Tissue Linen',
    subtitle: 'Crisp sunlit daywear',
    itemCount: '14 weaves',
    image: IMG_IVORY,
  },
  {
    id: 'Ready-Made Blouses',
    title: 'Ready-Made Blouses',
    subtitle: 'Kalamkari & temple jhumkas',
    itemCount: '16 styles',
    image: IMG_BLOUSE,
  },
  {
    id: 'Bridal & Gift Combos',
    title: 'Bridal & Gift Combos',
    subtitle: 'Trousseau & festive sets',
    itemCount: '10 sets',
    image: IMG_DIWALI,
  },
];

export const BOUTIQUE_TO_PRODUCT_ID: Record<string, string> = {
  'kanchipuram-emerald-temple': 'kanchipuram-temple-emerald',
  'banarasi-crimson-katan': 'banarasi-katan-crimson',
  'maheshwari-ochre-cotton-silk': 'maheshwari-ochre-rose',
  'chanderi-ivory-linen': 'chanderi-ivory-linen',
  'arani-soft-silk-peacock': 'emerald-soft-silk',
  'kalamkari-blouse-jhumka-set': 'kalamkari-silk-blouse',
  'festive-maroon-teal-duo': 'festive-duo-gift-set',
  'kanchi-korvai-zari-heirloom': 'kanchi-korvai-zari-heirloom',
};

const PRODUCT_TO_BOUTIQUE_ID: Record<string, string> = Object.fromEntries(
  Object.entries(BOUTIQUE_TO_PRODUCT_ID).map(([boutiqueId, productId]) => [productId, boutiqueId])
);

/** Resolves a boutique product id to the canonical Product id in src/data/products.ts. */
export function getBoutiqueProductId(product: Pick<SareeProduct, 'id'>): string {
  return BOUTIQUE_TO_PRODUCT_ID[product.id] ?? product.id;
}

/** Resolves a canonical Product id back to its boutique product id when available. */
export function getProductToBoutiqueId(productId: string): string {
  return PRODUCT_TO_BOUTIQUE_ID[productId] ?? productId;
}

/** Maps a boutique homepage card to its corresponding ProductDetailPage route. */
export function getBoutiqueProductDetailPath(product: Pick<SareeProduct, 'id'>): string {
  return `/product/${getBoutiqueProductId(product)}`;
}

const BOUTIQUE_CATEGORY_PATHS: Record<'All' | BoutiqueCategory, string> = {
  All: '/collections',
  'Kanchipuram Silks': '/collections/silk-sarees?weave=kanchipuram',
  'Banarasi & Soft Silks': '/collections/silk-sarees?weave=banarasi-soft',
  'Cotton & Maheshwari': '/collections?cat=Cotton+Sarees',
  'Tissue Linen': '/collections?cat=Linen+Sarees',
  'Ready-Made Blouses': '/collections?cat=Blouses',
  'Bridal & Gift Combos': '/collections?occasion=Bridal+%26+Festive',
};

/** Maps a boutique category tile to the filtered CollectionPage route. */
export function getBoutiqueCategoryPath(category: 'All' | BoutiqueCategory): string {
  return BOUTIQUE_CATEGORY_PATHS[category] ?? '/collections';
}

export const SAREE_PRODUCTS: SareeProduct[] = [
  {
    id: 'kanchipuram-emerald-temple',
    sku: 'KL-KNC-101',
    name: 'Kanchipuram Temple Zari Emerald Saree',
    category: 'Kanchipuram Silks',
    shortDesc: 'Handpicked 3-ply mulberry silk with antique gold temple border & crisp pleat fall.',
    drapeOptions: [
      { label: 'Unstitched Blouse (6.4m)', multiplier: 1 },
      { label: 'With Fall & Pico Finished', multiplier: 1.06 },
    ],
    defaultOption: 'Unstitched Blouse (6.4m)',
    originalPrice: 4699,
    price: 3499,
    rating: 4.9,
    reviewCount: 214,
    image: IMG_EMERALD,
    secondaryImage: IMG_ZARI,
    offerLabel: 'Bestseller',
    fabricSpec: 'Pure Mulberry Kanchipuram Silk · 540g',
    blouseDetails: 'Includes 0.9m matching emerald silk blouse piece with zari sleeve border',
    sectionTags: ['bestseller', 'featured'],
  },
  {
    id: 'banarasi-crimson-katan',
    sku: 'KL-BNR-204',
    name: 'Banarasi Katan Crimson Bridal Saree',
    category: 'Banarasi & Soft Silks',
    shortDesc: 'Sindoor-crimson Katan silk with floral kadhua zari border & hand-knotted tassels.',
    drapeOptions: [
      { label: 'Unstitched Blouse (6.35m)', multiplier: 1 },
      { label: 'With Fall & Pico Finished', multiplier: 1.06 },
    ],
    defaultOption: 'Unstitched Blouse (6.35m)',
    originalPrice: 3999,
    price: 2899,
    rating: 4.9,
    reviewCount: 168,
    image: IMG_BANARASI,
    secondaryImage: IMG_ZARI,
    offerLabel: 'Save ₹1,100',
    fabricSpec: 'Twisted Katan Silk · Hand-knotted Pallu',
    blouseDetails: 'Includes 0.85m crimson brocade unstitched blouse piece',
    sectionTags: ['bestseller', 'featured'],
  },
  {
    id: 'maheshwari-ochre-cotton-silk',
    sku: 'KL-MHS-089',
    name: 'Maheshwari Ochre & Rose Cotton Silk',
    category: 'Cotton & Maheshwari',
    shortDesc: '320g featherlight handloom drape engineered for warm weather & effortless workdays.',
    drapeOptions: [
      { label: 'Single Saree', multiplier: 1 },
      { label: 'Pack of 2 (Save ₹100)', multiplier: 1.9 },
      { label: 'Pack of 3 (Save ₹300)', multiplier: 2.7 },
    ],
    defaultOption: 'Single Saree',
    originalPrice: 1499,
    price: 1000,
    rating: 4.8,
    reviewCount: 312,
    image: IMG_OCHRE,
    secondaryImage: IMG_IVORY,
    offerLabel: '33% Off',
    fabricSpec: 'Mercerized Cotton-Silk · 320g',
    blouseDetails: 'Includes 0.85m dusty-rose contrast blouse piece',
    sectionTags: ['bestseller', 'new'],
  },
  {
    id: 'chanderi-ivory-linen',
    sku: 'KL-CHN-118',
    name: 'Chanderi Ivory & Gold Tissue Linen Saree',
    category: 'Tissue Linen',
    shortDesc: 'Translucent ivory flax-linen with champagne gold stripes for serene daytime poise.',
    drapeOptions: [
      { label: 'Unstitched Blouse (6.35m)', multiplier: 1 },
      { label: 'With Fall & Pico Finished', multiplier: 1.07 },
    ],
    defaultOption: 'Unstitched Blouse (6.35m)',
    originalPrice: 2299,
    price: 1699,
    rating: 4.8,
    reviewCount: 129,
    image: IMG_IVORY,
    secondaryImage: IMG_OCHRE,
    offerLabel: '26% Off',
    fabricSpec: 'Pure Flax Linen & Silk Warp',
    blouseDetails: 'Includes 0.85m ivory zari-border unstitched blouse piece',
    sectionTags: ['bestseller', 'featured'],
  },
  {
    id: 'arani-soft-silk-peacock',
    sku: 'KL-ARN-142',
    name: 'Arani Soft Silk Courtyard Drape',
    category: 'Banarasi & Soft Silks',
    shortDesc: 'Supple, zero-stiffness Arani soft silk that pleats cleanly in under three minutes.',
    drapeOptions: [
      { label: 'Unstitched Blouse (6.4m)', multiplier: 1 },
      { label: 'With Fall & Pico Finished', multiplier: 1.06 },
    ],
    defaultOption: 'Unstitched Blouse (6.4m)',
    originalPrice: 2999,
    price: 2199,
    rating: 4.9,
    reviewCount: 185,
    image: IMG_HERO,
    secondaryImage: IMG_EMERALD,
    offerLabel: 'New Batch',
    fabricSpec: 'Unstarched Arani Soft Silk · 430g',
    blouseDetails: 'Includes 0.9m matching forest emerald silk blouse piece',
    sectionTags: ['new', 'featured'],
  },
  {
    id: 'kalamkari-blouse-jhumka-set',
    sku: 'KL-BLS-301',
    name: 'Kalamkari Padded Silk Blouse & Jhumka Pair',
    category: 'Ready-Made Blouses',
    shortDesc: 'Cotton-lined stitched Kalamkari blouse (2" margin) paired with 14g temple jhumkas.',
    drapeOptions: [
      { label: 'Size S (34")', multiplier: 1 },
      { label: 'Size M (36")', multiplier: 1 },
      { label: 'Size L (38")', multiplier: 1 },
    ],
    defaultOption: 'Size M (36")',
    originalPrice: 1799,
    price: 1299,
    rating: 4.8,
    reviewCount: 154,
    image: IMG_BLOUSE,
    secondaryImage: IMG_ZARI,
    offerLabel: 'Ready-to-Wear',
    fabricSpec: 'Mul-Cotton Lined Silk + Matte Gold Brass',
    blouseDetails: 'Fully stitched back-open padded blouse with 2-inch inner seam allowance',
    sectionTags: ['bestseller', 'new'],
  },
  {
    id: 'festive-maroon-teal-duo',
    sku: 'KL-GFT-601',
    name: 'Royal Maroon & Peacock Teal Saree Duo',
    category: 'Bridal & Gift Combos',
    shortDesc: 'Two handpicked festive silk sarees boxed together with ₹400 instant combo savings.',
    drapeOptions: [
      { label: '2-Saree Gift Box', multiplier: 1 },
      { label: 'With 2 Ready Blouses', multiplier: 1.38 },
    ],
    defaultOption: '2-Saree Gift Box',
    originalPrice: 4998,
    price: 3598,
    rating: 4.9,
    reviewCount: 112,
    image: IMG_DIWALI,
    secondaryImage: IMG_BANARASI,
    offerLabel: 'Save ₹1,400',
    fabricSpec: 'Banarasi & Kanchi Semi-Silk Pair',
    blouseDetails: 'Includes 2 unstitched silk blouse pieces & boutique gift sleeves',
    sectionTags: ['featured', 'new'],
  },
  {
    id: 'kanchi-korvai-zari-heirloom',
    sku: 'KL-KNC-309',
    name: 'Kanchipuram Korvai Peacock Pallu Heirloom',
    category: 'Kanchipuram Silks',
    shortDesc: 'Handloom-interlocked Korvai temple border crafted for weddings & muhurthams.',
    drapeOptions: [
      { label: 'Unstitched Blouse (6.4m)', multiplier: 1 },
      { label: 'With Fall & Pico Finished', multiplier: 1.05 },
    ],
    defaultOption: 'Unstitched Blouse (6.4m)',
    originalPrice: 5499,
    price: 4299,
    rating: 5.0,
    reviewCount: 94,
    image: IMG_ZARI,
    secondaryImage: IMG_BANARASI,
    offerLabel: 'Heirloom Loom',
    fabricSpec: 'Pure Mulberry Silk · Korvai Gold Zari',
    blouseDetails: 'Includes 0.9m contrast maroon silk blouse piece',
    sectionTags: ['new', 'featured'],
  },
];

export const SPECIAL_BOUTIQUE_COLLECTIONS: SpecialBoutiqueCollection[] = [
  {
    id: 'bridal-muhurtham',
    title: 'Muhurtham & Bridal Trousseau',
    subtitle: 'Handpicked Kanchipuram & Banarasi Katan sarees woven with rich korvai zari for wedding ceremonies.',
    ctaLabel: 'Explore Bridal Silks',
    filterCategory: 'Kanchipuram Silks',
    image: IMG_HERO,
  },
  {
    id: 'festive-combos',
    title: 'Festive & Family Gifting Sets',
    subtitle: 'Curated 2-saree and blouse pairings packaged in keepsake boxes for Diwali, Pongal & housewarmings.',
    ctaLabel: 'Shop Gift Combos',
    filterCategory: 'Bridal & Gift Combos',
    image: IMG_DIWALI,
  },
  {
    id: 'summer-handlooms',
    title: 'Breezy Workwear & Summer Drapes',
    subtitle: '320g Maheshwari cotton-silks and breathable Chanderi linens designed for warm Tamil Nadu days.',
    ctaLabel: 'Browse Summer Weaves',
    filterCategory: 'Cotton & Maheshwari',
    image: IMG_OCHRE,
  },
];

export const BOUTIQUE_SAMPLE_REVIEWS: BoutiqueReview[] = [
  {
    id: 'rev-1',
    name: 'Meenakshi Sundaram',
    city: 'Theni',
    purchasedItem: 'Kanchipuram Temple Zari Emerald Saree',
    rating: 5,
    sentiment: 'positive',
    comment:
      'Ordered online after browsing their heritage silk curation—exact emerald tone and super soft pleats.',
  },
  {
    id: 'rev-2',
    name: 'Kavitha Rajendran',
    city: 'Madurai',
    purchasedItem: 'Banarasi Katan Crimson Bridal Saree',
    rating: 4,
    sentiment: 'positive',
    comment:
      'Handpicked quality shows immediately in the zari finish. Rich crimson drape arrived in 2 days; wish the matching blouse piece was slightly wider.',
  },
  {
    id: 'rev-3',
    name: 'Revathi Mohan',
    city: 'Salem',
    purchasedItem: 'Banarasi Katan Crimson Bridal Saree',
    rating: 3,
    sentiment: 'constructive',
    comment:
      'The saree zari work is lovely, though courier delivery arrived one day later than the festive estimate and one corner of the outer box was dented.',
    careNote:
      'Thank you for flagging this honestly. The saree stayed protected inside its inner sleeve, and we have upgraded to double-walled festive boxes with priority dispatch alerts.',
  },
  {
    id: 'rev-4',
    name: 'Divya Krishnan',
    city: 'Coimbatore',
    purchasedItem: 'Maheshwari Ochre & Rose Cotton Silk',
    rating: 5,
    sentiment: 'positive',
    comment:
      'Picked the 3-saree bundle for office wear. Featherlight, zero stiffness, and holds neat pleats through an entire workday.',
  },
  {
    id: 'rev-5',
    name: 'Lakshmi Narayanan',
    city: 'Chennai',
    purchasedItem: 'Kanchipuram Korvai Peacock Pallu Heirloom',
    rating: 5,
    sentiment: 'positive',
    comment:
      'Wore this Korvai heirloom for my sister’s muhurtham. The peacock pallu glowed naturally in temple light without feeling heavy.',
  },
  {
    id: 'rev-6',
    name: 'Nandhini Venkatesh',
    city: 'Erode',
    purchasedItem: 'Kalamkari Padded Silk Blouse & Jhumka Pair',
    rating: 3,
    sentiment: 'constructive',
    comment:
      'The Kalamkari weave and jhumkas look wonderful, but my Medium blouse felt snug near the upper arm and the lining needed a gentle wash to soften.',
    careNote:
      'We appreciate your candid fit note! New ready-made batches now carry an extra 2-inch armhole margin and pre-softened cotton lining, backed by free size exchange.',
  },
  {
    id: 'rev-7',
    name: 'Priya Dharshini',
    city: 'Trichy',
    purchasedItem: 'Arani Soft Silk Courtyard Drape',
    rating: 5,
    sentiment: 'positive',
    comment:
      'Unstarched soft silk drapes effortlessly in five minutes. Used KORA10 and got free express shipping right on time.',
  },
  {
    id: 'rev-8',
    name: 'Subbulakshmi K.',
    city: 'Theni',
    purchasedItem: 'Royal Maroon & Peacock Teal Saree Duo',
    rating: 5,
    sentiment: 'positive',
    comment:
      'Ordered the festive duo for gifting our relatives. Both colours look richer in person and the gift box packaging was spotless.',
  },
  {
    id: 'rev-9',
    name: 'Anitha Balasubramanian',
    city: 'Tirunelveli',
    purchasedItem: 'Chanderi Ivory & Gold Tissue Linen Saree',
    rating: 3,
    sentiment: 'constructive',
    comment:
      'Breathable fabric and neat selvedge finish, though under warm indoor bulbs the ivory tone looked noticeably warmer cream-gold than on my phone screen.',
    careNote:
      'Thank you for sharing this helpful detail—our WhatsApp team now happily sends unedited natural daylight photos and video clips before shipping.',
  },
  {
    id: 'rev-10',
    name: 'Sangeetha Ramesh',
    city: 'Bengaluru',
    purchasedItem: 'Kanchipuram Temple Zari Emerald Saree',
    rating: 5,
    sentiment: 'positive',
    comment:
      'Ordered via COD to Bengaluru and received it in 48 hours. Zero loose threads on the reverse side of the zari border.',
  },
  {
    id: 'rev-11',
    name: 'Harini Natarajan',
    city: 'Thanjavur',
    purchasedItem: 'Chanderi Ivory & Gold Tissue Linen Saree',
    rating: 4,
    sentiment: 'positive',
    comment:
      'Crisp tissue linen with subtle gold shimmer—ideal for morning housewarming functions. Needs light steam ironing after unfolding.',
  },
  {
    id: 'rev-12',
    name: 'Valliappan Selvam',
    city: 'Karaikudi',
    purchasedItem: 'Kanchipuram Korvai Peacock Pallu Heirloom',
    rating: 5,
    sentiment: 'positive',
    comment:
      'Bought as an anniversary gift for my wife. The Bazaar Street team helped verify the shade on WhatsApp within ten minutes.',
  },
  {
    id: 'rev-13',
    name: 'Deepika Senthil',
    city: 'Pollachi',
    purchasedItem: 'Maheshwari Ochre & Rose Cotton Silk',
    rating: 5,
    sentiment: 'positive',
    comment:
      'At ₹1,000 this Maheshwari drape beats sarees twice the price. Comfortable in warm weather and very graceful fall.',
  },
  {
    id: 'rev-14',
    name: 'Gayathri Subramanian',
    city: 'Kumbakonam',
    purchasedItem: 'Arani Soft Silk Courtyard Drape',
    rating: 4,
    sentiment: 'positive',
    comment:
      'Lovely emerald-gold sheen and easy to pleat. Would love to see this same Arani border in deep navy blue soon!',
  },
  {
    id: 'rev-15',
    name: 'Padmavathi R.',
    city: 'Dindigul',
    purchasedItem: 'Royal Maroon & Peacock Teal Saree Duo',
    rating: 5,
    sentiment: 'positive',
    comment:
      'Picked this combo for Diwali family gifting. Every saree came neatly folded with silica pack and care card.',
  },
  {
    id: 'rev-16',
    name: 'Aishwarya Menon',
    city: 'Kochi',
    purchasedItem: 'Chanderi Ivory & Gold Tissue Linen Saree',
    rating: 5,
    sentiment: 'positive',
    comment:
      'Delivered to Kochi cleanly packed. Looks just like a handloom boutique find and pairs beautifully with temple gold jewellery.',
  },
  {
    id: 'rev-17',
    name: 'Bhuvaneswari T.',
    city: 'Hosur',
    purchasedItem: 'Banarasi Katan Crimson Bridal Saree',
    rating: 5,
    sentiment: 'positive',
    comment:
      'Rich Katan texture and crisp pallu tassels. Applied TROUSSEAU15 on our wedding shopping cart and saved nicely.',
  },
  {
    id: 'rev-18',
    name: 'Kalyani Deshmukh',
    city: 'Hyderabad',
    purchasedItem: 'Kalamkari Padded Silk Blouse & Jhumka Pair',
    rating: 4,
    sentiment: 'positive',
    comment:
      'Stitched finish and Kalamkari motifs are very neat. Jhumkas matched my antique gold bangles right out of the box.',
  },
  {
    id: 'rev-19',
    name: 'Saranya Murugan',
    city: 'Nagercoil',
    purchasedItem: 'Kanchipuram Temple Zari Emerald Saree',
    rating: 5,
    sentiment: 'positive',
    comment:
      'My mother loved the classic temple border! Authentic feel and polite follow-up call from Kora & Loom.',
  },
  {
    id: 'rev-20',
    name: 'Shruti Kulkarni',
    city: 'Mysuru',
    purchasedItem: 'Arani Soft Silk Courtyard Drape',
    rating: 5,
    sentiment: 'positive',
    comment:
      'Second order from Kora & Loom—consistent weaving quality, accurate SKU details, and zero colour bleeding.',
  },
];

export const BOUTIQUE_SOCIAL_POSTS: BoutiqueSocialPost[] = [
  {
    id: 'soc-1',
    image: IMG_HERO,
    handle: '@koraandloom_demo',
    caption: 'Sunlit courtyard drape of our handpicked Kanchipuram emerald zari saree.',
    linkedProductId: 'kanchipuram-emerald-temple',
  },
  {
    id: 'soc-2',
    image: IMG_BANARASI,
    handle: '@koraandloom_demo',
    caption: 'Fresh crimson Banarasi Katan batch ready for wedding shoppers.',
    linkedProductId: 'banarasi-crimson-katan',
  },
  {
    id: 'soc-3',
    image: IMG_ZARI,
    handle: '@koraandloom_demo',
    caption: 'Close-up of handwoven peacock motifs & tested antique gold zari.',
    linkedProductId: 'kanchi-korvai-zari-heirloom',
  },
  {
    id: 'soc-4',
    image: IMG_BLOUSE,
    handle: '@koraandloom_demo',
    caption: 'Ready-made Kalamkari silk blouses paired with 14g temple jhumkas.',
    linkedProductId: 'kalamkari-blouse-jhumka-set',
  },
  {
    id: 'soc-5',
    image: IMG_IVORY,
    handle: '@koraandloom_demo',
    caption: 'Ivory & gold Chanderi tissue linen—effortless grace for daytime events.',
    linkedProductId: 'chanderi-ivory-linen',
  },
  {
    id: 'soc-6',
    image: IMG_DIWALI,
    handle: '@koraandloom_demo',
    caption: 'Festive showroom curation from our heritage silk atelier.',
    linkedProductId: 'festive-maroon-teal-duo',
  },
];
