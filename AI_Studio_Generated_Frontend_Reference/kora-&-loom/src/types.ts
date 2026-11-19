export type ProductCategory =
  | 'Silk Sarees'
  | 'Cotton Sarees'
  | 'Linen Sarees'
  | 'Blouses'
  | 'Jewellery'
  | 'Saree Care'
  | 'Festive Sets';

export type OccasionType =
  | 'Bridal & Festive'
  | 'Festive'
  | 'Office & Daywear'
  | 'Casual & Office'
  | 'Wardrobe Care';

export type PaymentMethod = 'UPI' | 'Card' | 'COD';

export interface ProductImageSlot {
  url: string;
  label: 'Product Showcase' | 'Draped in Use' | 'Scale & Pleats' | 'Weave Detail';
  alt: string;
}

export interface DiscountTier {
  quantity: number;
  totalPrice: number;
  savings: number;
  label?: string;
  freeShipping: boolean;
}

export interface ProductBenefit {
  feature: string;
  benefit: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductVariant {
  label: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  weave: string;
  occasion: OccasionType;
  price: number;
  mrp: number;
  oneLineBenefit: string;
  rating: number;
  reviewCount: number;
  tag?: 'Bestseller' | 'Pre-Booking' | 'Subscribe & Save' | 'Limited Loom';
  blouseIncluded: string;
  lengthSpec: string;
  fabricCare: string;
  images: ProductImageSlot[];
  hasVideoPreview: boolean;
  videoCaption: string;
  benefits: ProductBenefit[];
  discountLadder?: DiscountTier[];
  subscriptionOption?: {
    monthlyPrice: number;
    cadenceLabel: string;
    savingsText: string;
  };
  variants?: ProductVariant[];
  hasSizeGuide?: boolean;
  faqs: ProductFAQ[];
  isFestiveFeatured?: boolean;
  complementaryIds: string[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: number;
  verified: boolean;
  date: string;
  occasionPurchased: string;
  title: string;
  comment: string;
}

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  image: string;
  unitPrice: number;
  mrp: number;
  quantity: number;
  variant?: string;
  isSubscription?: boolean;
  subscriptionPrice?: number;
  tierPriceOverride?: number;
}

export type OrderStatus = 'Confirmed' | 'Weaving & QC' | 'Dispatched' | 'Out for Delivery' | 'Delivered';

export interface OrderRecord {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  isGuest: boolean;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  estimatedDelivery: string;
  exchangeRequested?: {
    itemSku: string;
    reason: string;
    resolution: 'Size/Drape Exchange' | 'Instant 110% Store Credit';
    requestedAt: string;
  };
  surveyRating?: number;
}

export interface CollectionMeta {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  filterCategory?: ProductCategory;
  maxPrice?: number;
}
