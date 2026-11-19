import { CollectionMeta } from '../types';

export const COLLECTIONS: CollectionMeta[] = [
  {
    slug: 'silk-sarees',
    title: 'Heirloom Silks',
    subtitle: 'Kanchipuram, Banarasi & Arani Soft Silk',
    description: 'Handwoven mulberry and Katan silks tested for zari purity, crisp pleating, and effortless drape.',
    image: '/src/assets/images/product_emerald_drape_1795082277045.jpg',
    filterCategory: 'Silk Sarees',
  },
  {
    slug: 'cotton-linen',
    title: 'Summer Cottons & Linens',
    subtitle: 'Maheshwari, Chanderi & Kalyani Weaves',
    description: 'Featherlight 320-gram weaves engineered to stay cool and poised through long workdays.',
    image: '/src/assets/images/product_ivory_linen_1795082277269.jpg',
    filterCategory: 'Cotton Sarees',
  },
  {
    slug: 'blouses-jewellery',
    title: 'Blouses & Temple Jewellery',
    subtitle: 'Ready-to-Wear Fit & Antique Craft',
    description: 'Tailored cotton-lined blouses with 2-inch margins paired with featherlight 14g temple jhumkas.',
    image: '/src/assets/images/product_blouse_jewellery_1795082278000.jpg',
    filterCategory: 'Blouses',
  },
  {
    slug: 'under-1500',
    title: 'Everyday Under ₹1,500',
    subtitle: 'Accessible Handloom & Gifting',
    description: 'Honest weaver-direct pricing on everyday cottons, semi-silks, and ready-made blouses.',
    image: '/src/assets/images/product_maheshwari_ochre_1795082277630.jpg',
    maxPrice: 1500,
  },
];

export const DIWALI_CAMPAIGN = {
  title: 'The Diwali Loom Edit',
  headline: 'Handwoven Festive Silks, Ready Before Celebrations Begin',
  subcopy:
    'Dispatched within 24 hours with guaranteed pre-Diwali delivery, free shipping above ₹2,500, and transparent festive bundle savings.',
  bannerImage: '/src/assets/images/product_festive_diwali_1795082278294.jpg',
  featuredProductIds: [
    'festive-duo-gift-set',
    'kanchipuram-temple-emerald',
    'banarasi-katan-crimson',
    'kanchi-semi-silk-peacock',
    'kalamkari-silk-blouse',
    'temple-gold-jhumka',
  ],
};
