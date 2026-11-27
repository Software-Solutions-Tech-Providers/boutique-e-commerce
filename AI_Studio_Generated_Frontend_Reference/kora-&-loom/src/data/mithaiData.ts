export type MithaiCategory =
  | 'Traditional Sweets'
  | 'Real-Fruit Mithai'
  | 'Crisp Savouries'
  | 'Healthy Snacks'
  | 'Celebration Combos'
  | 'Return Gifts';

export interface MithaiProduct {
  id: string;
  name: string;
  category: MithaiCategory;
  shortDesc: string;
  weightOptions: Array<{ label: string; multiplier: number }>;
  defaultWeight: string;
  originalPrice: number;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  offerLabel?: string;
  shelfLife: string;
  keyIngredients: string;
  sectionTags: Array<'bestseller' | 'featured' | 'new'>;
}

export interface CategoryTile {
  id: MithaiCategory;
  title: string;
  subtitle: string;
  itemCount: string;
  image: string;
}

export interface SpecialCollection {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  filterCategory: MithaiCategory;
  image: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  city: string;
  purchasedItem: string;
  rating: number;
  comment: string;
}

export interface SocialPost {
  id: string;
  image: string;
  handle: string;
  caption: string;
  linkedProductId: string;
}

const IMG_HERO = '/src/assets/images/mithai_hero_hamper_1795272447716.jpg';
const IMG_MYSORE = '/src/assets/images/mithai_mysore_pak_1795272447270.jpg';
const IMG_KAJU = '/src/assets/images/mithai_kaju_katli_1795272447238.jpg';
const IMG_FRUIT = '/src/assets/images/mithai_fruit_sweets_1795272447516.jpg';
const IMG_KARAM = '/src/assets/images/mithai_savouries_karam_1795272447413.jpg';
const IMG_COMBO = '/src/assets/images/mithai_gift_combo_1795272446901.jpg';
const IMG_HEALTHY = '/src/assets/images/mithai_healthy_snacks_1795272447176.jpg';
const IMG_KITCHEN = '/src/assets/images/mithai_craft_kitchen_1795272447917.jpg';

export const MITHAI_IMAGES = {
  hero: IMG_HERO,
  mysore: IMG_MYSORE,
  kaju: IMG_KAJU,
  fruit: IMG_FRUIT,
  karam: IMG_KARAM,
  combo: IMG_COMBO,
  healthy: IMG_HEALTHY,
  kitchen: IMG_KITCHEN,
};

export const CATEGORY_TILES: CategoryTile[] = [
  {
    id: 'Traditional Sweets',
    title: 'Traditional Sweets',
    subtitle: 'Pure cow-ghee classics',
    itemCount: '18 items',
    image: IMG_MYSORE,
  },
  {
    id: 'Real-Fruit Mithai',
    title: 'Real-Fruit Mithai',
    subtitle: 'Mango, rose & fig infusions',
    itemCount: '12 items',
    image: IMG_FRUIT,
  },
  {
    id: 'Crisp Savouries',
    title: 'Crisp Savouries',
    subtitle: 'Murukku & Madras mixture',
    itemCount: '16 items',
    image: IMG_KARAM,
  },
  {
    id: 'Healthy Snacks',
    title: 'Healthy Snacks',
    subtitle: 'Roasted makhana & millets',
    itemCount: '10 items',
    image: IMG_HEALTHY,
  },
  {
    id: 'Celebration Combos',
    title: 'Celebration Combos',
    subtitle: 'Sweet & karam pairings',
    itemCount: '9 boxes',
    image: IMG_COMBO,
  },
  {
    id: 'Return Gifts',
    title: 'Return Gifts',
    subtitle: 'Weddings & corporate packs',
    itemCount: 'Custom',
    image: IMG_HERO,
  },
];

export const MITHAI_PRODUCTS: MithaiProduct[] = [
  {
    id: 'ghee-mysore-pak',
    name: 'Heritage Cow-Ghee Mysore Pak',
    category: 'Traditional Sweets',
    shortDesc: 'Warm, melt-in-mouth porous besan squares slow-cooked in A2 cow ghee.',
    weightOptions: [
      { label: '250g', multiplier: 1 },
      { label: '500g', multiplier: 1.9 },
      { label: '1kg', multiplier: 3.65 },
    ],
    defaultWeight: '250g',
    originalPrice: 360,
    price: 299,
    rating: 4.9,
    reviewCount: 418,
    image: IMG_MYSORE,
    offerLabel: 'Bestseller',
    shelfLife: '12 days at room temperature',
    keyIngredients: 'Roasted Bengal gram flour, pure cow ghee, cane sugar, cardamom',
    sectionTags: ['bestseller', 'featured'],
  },
  {
    id: 'royal-kaju-katli',
    name: 'Pistachio Kaju Katli',
    category: 'Traditional Sweets',
    shortDesc: 'Silky W180 Goa cashew fudge finished with toasted Iranian pistachios.',
    weightOptions: [
      { label: '250g', multiplier: 1 },
      { label: '500g', multiplier: 1.92 },
      { label: '1kg', multiplier: 3.7 },
    ],
    defaultWeight: '250g',
    originalPrice: 450,
    price: 385,
    rating: 4.8,
    reviewCount: 312,
    image: IMG_KAJU,
    offerLabel: 'Save ₹65',
    shelfLife: '15 days in airtight tin',
    keyIngredients: 'Whole W180 cashews, unrefined sugar, crushed pistachios',
    sectionTags: ['bestseller', 'featured'],
  },
  {
    id: 'alphonso-mango-barfi',
    name: 'Real Alphonso Mango Barfi',
    category: 'Real-Fruit Mithai',
    shortDesc: 'Crafted with Ratnagiri mango pulp and slow-reduced milk khoya—zero essence.',
    weightOptions: [
      { label: '250g', multiplier: 1 },
      { label: '500g', multiplier: 1.9 },
    ],
    defaultWeight: '250g',
    originalPrice: 390,
    price: 325,
    rating: 4.9,
    reviewCount: 204,
    image: IMG_FRUIT,
    offerLabel: 'Real Fruit',
    shelfLife: '10 days refrigerated',
    keyIngredients: 'Alphonso mango pulp, fresh milk khoya, cardamom, pistachio slivers',
    sectionTags: ['bestseller', 'new'],
  },
  {
    id: 'madras-butter-murukku',
    name: 'Hand-Twisted Butter Murukku & Mixture',
    category: 'Crisp Savouries',
    shortDesc: 'Light, crunchy rice-urad spirals & curry-leaf mixture fried in cold-pressed groundnut oil.',
    weightOptions: [
      { label: '250g', multiplier: 1 },
      { label: '500g', multiplier: 1.85 },
    ],
    defaultWeight: '250g',
    originalPrice: 240,
    price: 195,
    rating: 4.8,
    reviewCount: 276,
    image: IMG_KARAM,
    offerLabel: 'Tea-Time Hit',
    shelfLife: '25 days crisp-sealed',
    keyIngredients: 'Raw rice flour, urad dal, white butter, sesame, groundnut oil, curry leaves',
    sectionTags: ['bestseller', 'featured'],
  },
  {
    id: 'festive-four-treasure-box',
    name: 'Grand Celebration Four-Compartment Box',
    category: 'Celebration Combos',
    shortDesc: 'Dry-fruit barfi, besan ladoo, rose kalakand & pepper cashews in a ribbon-tied hamper.',
    weightOptions: [
      { label: '600g Box', multiplier: 1 },
      { label: '1.2kg Box', multiplier: 1.9 },
    ],
    defaultWeight: '600g Box',
    originalPrice: 1099,
    price: 899,
    rating: 4.9,
    reviewCount: 189,
    image: IMG_COMBO,
    offerLabel: '18% Off Combo',
    shelfLife: '14 days insulated pack',
    keyIngredients: 'Assorted pure-ghee mithai and dry-roasted spiced cashews',
    sectionTags: ['bestseller', 'featured'],
  },
  {
    id: 'roasted-makhana-millet-trio',
    name: 'Ghee-Roasted Makhana & Millet Ladoo Trio',
    category: 'Healthy Snacks',
    shortDesc: 'Zero-maida, palm-oil-free roasted foxnuts, sesame chikki & ragi-date ladoos.',
    weightOptions: [
      { label: '300g Pack', multiplier: 1 },
      { label: '600g Pack', multiplier: 1.88 },
    ],
    defaultWeight: '300g Pack',
    originalPrice: 420,
    price: 349,
    rating: 4.7,
    reviewCount: 152,
    image: IMG_HEALTHY,
    offerLabel: 'Zero Maida',
    shelfLife: '30 days airtight',
    keyIngredients: 'Himalayan foxnuts, finger millet, organic jaggery, roasted sesame, black pepper',
    sectionTags: ['new', 'featured'],
  },
  {
    id: 'rose-gulkand-dryfruit-rolls',
    name: 'Rose Petal & Gulkand Dry-Fruit Rolls',
    category: 'Real-Fruit Mithai',
    shortDesc: 'Sun-steeped damask rose gulkand wrapped in toasted almond-pistachio paste.',
    weightOptions: [
      { label: '250g', multiplier: 1 },
      { label: '500g', multiplier: 1.9 },
    ],
    defaultWeight: '250g',
    originalPrice: 440,
    price: 375,
    rating: 4.8,
    reviewCount: 98,
    image: IMG_FRUIT,
    offerLabel: 'New Batch',
    shelfLife: '14 days',
    keyIngredients: 'Damask rose gulkand, California almonds, dates, pistachios',
    sectionTags: ['new'],
  },
  {
    id: 'royal-wedding-return-hamper',
    name: 'Heirloom Wedding & Return Gift Hamper',
    category: 'Return Gifts',
    shortDesc: 'Keepsake box of Mysore Pak, Kaju Katli & saffron besan ladoos with custom note card.',
    weightOptions: [
      { label: '750g Hamper', multiplier: 1 },
      { label: '1.5kg Hamper', multiplier: 1.92 },
    ],
    defaultWeight: '750g Hamper',
    originalPrice: 1350,
    price: 1099,
    rating: 4.9,
    reviewCount: 143,
    image: IMG_HERO,
    offerLabel: 'Free Delivery',
    shelfLife: '12 days',
    keyIngredients: 'Assorted signature cow-ghee mithai in keepsake chest',
    sectionTags: ['featured', 'new'],
  },
];

export const SPECIAL_COLLECTIONS: SpecialCollection[] = [
  {
    id: 'wedding-return',
    title: 'Wedding & Return Gifts',
    subtitle: 'Bespoke gold-foil keepsake boxes & custom family message cards for 25 to 1,000+ guests.',
    ctaLabel: 'Explore Gift Boxes',
    filterCategory: 'Return Gifts',
    image: IMG_HERO,
  },
  {
    id: 'festive-combos',
    title: 'Festive Sweet & Karam Combos',
    subtitle: 'Balanced sweet-and-savoury family assortments packed fresh for Diwali, Pongal & housewarmings.',
    ctaLabel: 'Shop Combos',
    filterCategory: 'Celebration Combos',
    image: IMG_COMBO,
  },
  {
    id: 'clean-snacking',
    title: 'Zero-Palm-Oil Healthy Munchies',
    subtitle: 'Ghee-roasted makhana, millet ladoos & sesame jaggery bites crafted for guilt-free 4 PM cravings.',
    ctaLabel: 'Browse Healthy',
    filterCategory: 'Healthy Snacks',
    image: IMG_HEALTHY,
  },
];

export const SAMPLE_REVIEWS: CustomerReview[] = [
  {
    id: 'r1',
    name: 'Lakshmi Narayanan',
    city: 'Chennai',
    purchasedItem: 'Heritage Cow-Ghee Mysore Pak',
    rating: 5,
    comment:
      'Opened the insulated box and the warm cow-ghee aroma filled the kitchen. Soft, crumbly, and arrived the very next afternoon.',
  },
  {
    id: 'r2',
    name: 'Rohan Kulkarni',
    city: 'Pune',
    purchasedItem: 'Grand Celebration Four-Compartment Box',
    rating: 5,
    comment:
      'Ordered 14 boxes for Diwali team gifting. Every compartment stayed intact in transit and the spiced cashews were a standout.',
  },
  {
    id: 'r3',
    name: 'Swathi Balasubramanian',
    city: 'Bengaluru',
    purchasedItem: 'Real Alphonso Mango Barfi',
    rating: 5,
    comment:
      'You can immediately tell it uses real mango pulp instead of artificial essence. Lightly sweetened and loved by both kids and elders.',
  },
];

export const SOCIAL_GALLERY: SocialPost[] = [
  {
    id: 'ig-1',
    image: IMG_MYSORE,
    handle: '@madhuramithai',
    caption: 'Morning batch of warm cow-ghee Mysore Pak cut fresh off the brass tray.',
    linkedProductId: 'ghee-mysore-pak',
  },
  {
    id: 'ig-2',
    image: IMG_FRUIT,
    handle: '@madhuramithai',
    caption: 'Alphonso mango barfi, rose gulkand rolls & fig-walnut bites—zero artificial colours.',
    linkedProductId: 'alphonso-mango-barfi',
  },
  {
    id: 'ig-3',
    image: IMG_KARAM,
    handle: '@madhuramithai',
    caption: '4 PM filter coffee pairs best with crisp hand-twisted butter murukku.',
    linkedProductId: 'madras-butter-murukku',
  },
  {
    id: 'ig-4',
    image: IMG_COMBO,
    handle: '@madhuramithai',
    caption: 'Ribbon-tied celebration boxes ready for weekend housewarmings.',
    linkedProductId: 'festive-four-treasure-box',
  },
  {
    id: 'ig-5',
    image: IMG_KAJU,
    handle: '@madhuramithai',
    caption: 'Slow-ground W180 Goa cashews topped with crushed green pistachios.',
    linkedProductId: 'royal-kaju-katli',
  },
  {
    id: 'ig-6',
    image: IMG_KITCHEN,
    handle: '@madhuramithai',
    caption: 'Inside our brass-uruli kitchen at 6:30 AM before daily dispatches begin.',
    linkedProductId: 'royal-wedding-return-hamper',
  },
];
