export type UserRole = 'customer' | 'staff' | 'admin';

export type UnitType = 'piece' | 'metre' | 'yard';

export interface ProductColorVariant {
  name: string;
  hex: string;
  image?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  parentGroup: string;
  description: string;
  image: string;
  featured: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  subtitle: string;
  categoryId: string;
  subcategory: string;
  description: string;
  fabricType: string;
  materialComposition: string;
  weaveOrigin: string;
  careInstructions: string;
  dimensions: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  stockCount: number;
  unitType: UnitType;
  minMeasure: number;
  maxMeasure: number;
  colors: ProductColorVariant[];
  sizes: string[];
  occasion: 'Bridal' | 'Festive' | 'Everyday' | 'Evening' | 'Bespoke Tailoring';
  images: string[];
  modelImage?: string;
  videoUrl?: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  rating: number;
  reviewCount: number;
  backInStockSubscribers: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  photoUrl?: string;
  purchasedVariant?: string;
  verifiedPurchase: boolean;
  approved: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  selectedColor: string;
  selectedSize: string;
  measureQuantity: number;
  unitType: UnitType;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  otpVerified: boolean;
  addresses: Address[];
  marketingOptIn: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };
  celebrationDates?: {
    birthdayMonth?: string;
    anniversaryMonth?: string;
    consent: boolean;
  };
  createdAt: string;
}

export type PaymentMethod =
  | 'razorpay_upi'
  | 'razorpay_card'
  | 'razorpay_netbanking'
  | 'razorpay_wallet'
  | 'cod';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export type OrderStatus =
  | 'Confirmed'
  | 'Weaving & QC'
  | 'Dispatched'
  | 'In Transit'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Refunded';

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  image: string;
  selectedColor: string;
  selectedSize: string;
  measureQuantity: number;
  unitType: UnitType;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderTimelineEvent {
  status: string;
  note: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Omit<Address, 'id' | 'isDefault'>;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number;
  shippingCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayPaymentId?: string;
  orderStatus: OrderStatus;
  returnReason?: string;
  attribution?: {
    source: 'Direct' | 'Instagram' | 'Facebook' | 'WhatsApp' | 'Referral';
    campaign?: string;
  };
  timeline: OrderTimelineEvent[];
  createdAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percent' | 'flat';
  value: number;
  minOrder: number;
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  kicker: string;
  subtitle: string;
  ctaLabel: string;
  targetCategory: string;
  image: string;
  kind: 'hero' | 'seasonal';
  active: boolean;
}

export interface MarketingCampaign {
  id: string;
  channel: 'whatsapp' | 'email';
  title: string;
  message: string;
  segment: string;
  recipientsCount: number;
  sentAt: string;
}

export type InfoSectionSlug =
  | 'about'
  | 'contact'
  | 'faq'
  | 'returns'
  | 'privacy'
  | 'terms';

export type AppView =
  | { page: 'home' }
  | { page: 'categories' }
  | {
      page: 'catalog';
      category?: string;
      search?: string;
      occasion?: string;
      audience?: string;
      maxPrice?: number;
      filter?: 'new' | 'bestseller' | 'limited' | 'festive';
    }
  | { page: 'product'; slug: string }
  | { page: 'wishlist' }
  | { page: 'checkout' }
  | {
      page: 'account';
      tab?: 'profile' | 'orders' | 'addresses' | 'track' | 'rewards';
      orderNumber?: string;
    }
  | { page: 'reviews' }
  | { page: 'info'; section: InfoSectionSlug }
  | { page: 'admin' };
