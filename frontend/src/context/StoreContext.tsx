import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  SEED_BANNERS,
  SEED_CATEGORIES,
  SEED_COUPONS,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_REVIEWS,
  SEED_USERS,
} from '../data/seedCatalog';
import {
  Address,
  AppView,
  Banner,
  CartItem,
  Category,
  Coupon,
  MarketingCampaign,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Product,
  Review,
  UnitType,
  User,
  UserRole,
} from '../types/store';
import { calculateUnitPrice, trackStoreEvent } from '../utils/commerce';
import {
  AnalyticsEvent,
  AnalyticsEventType,
  AttributionChannel,
  AttributionState,
  ConversionMetricsSnapshot,
  StoredAnalyticsState,
  computeConversionMetrics,
  detectVisitorType,
  getInitialAnalyticsState,
  parseAttributionFromSearch,
  saveAnalyticsState,
} from '../utils/analytics';
import {
  LanguageCode,
  ThemeId,
  TRANSLATIONS,
  TranslationPack,
} from '../i18n/translations';

const STORAGE_KEY = 'vastra_atelier_store_v1';

interface ToastMessage {
  id: string;
  text: string;
  tone: 'info' | 'success' | 'error';
}

interface PersistedState {
  categories: Category[];
  products: Product[];
  reviews: Review[];
  coupons: Coupon[];
  banners: Banner[];
  users: User[];
  orders: Order[];
  campaigns: MarketingCampaign[];
  newsletterSubscribers: { contact: string; channel: 'email' | 'whatsapp'; optInAt: string }[];
  currentUserId: string | null;
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  appliedCouponCode: string;
  compareList: string[];
  loyaltyPoints: number;
  referralSharesCount: number;
  theme: ThemeId;
  language: LanguageCode;
}

const normalizeTheme = (value: unknown): ThemeId =>
  value === 'dark' || value === 'obsidian' ? 'dark' : 'light';

const hydrateProducts = (saved?: Product[]): Product[] => {
  if (!saved || saved.length === 0) return SEED_PRODUCTS;
  const seedById = new Map(SEED_PRODUCTS.map((p) => [p.id, p]));
  return saved.map((prod) => {
    const seed = seedById.get(prod.id);
    const cleanUrl =
      prod.videoUrl &&
      !prod.videoUrl.includes('flower.mp4') &&
      !prod.videoUrl.includes('interactive-examples.mdn.mozilla.net')
        ? prod.videoUrl
        : undefined;
    const modelImage = prod.modelImage || seed?.modelImage;
    let images = prod.images;
    if (!prod.modelImage && seed?.modelImage && !images.includes(seed.modelImage)) {
      images = [seed.modelImage, ...images];
    }
    return {
      ...prod,
      modelImage,
      images,
      videoUrl: cleanUrl,
    };
  });
};

const hydrateBanners = (saved?: Banner[]): Banner[] => {
  if (!saved || saved.length === 0) return SEED_BANNERS;
  const heroSeed = SEED_BANNERS[0];
  return saved.map((b) => {
    if (b.id === heroSeed.id && b.image.includes('hero_silk_atelier')) {
      return { ...b, image: heroSeed.image };
    }
    return b;
  });
};

const hydrateReviews = (saved?: Review[]): Review[] => {
  if (!saved || saved.length === 0) return SEED_REVIEWS;
  const seedById = new Map(SEED_REVIEWS.map((r) => [r.id, r]));
  return saved.map((rev) => {
    const seed = seedById.get(rev.id);
    if (!seed) return rev;
    return {
      ...rev,
      photoUrl: rev.photoUrl || seed.photoUrl,
      purchasedVariant: rev.purchasedVariant || seed.purchasedVariant,
    };
  });
};

const getInitialState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (parsed.products && parsed.categories) {
        return {
          categories: parsed.categories,
          products: hydrateProducts(parsed.products),
          reviews: hydrateReviews(parsed.reviews),
          coupons: parsed.coupons || SEED_COUPONS,
          banners: hydrateBanners(parsed.banners),
          users: parsed.users || SEED_USERS,
          orders: parsed.orders || SEED_ORDERS,
          campaigns: parsed.campaigns || [],
          newsletterSubscribers: parsed.newsletterSubscribers || [],
          currentUserId: parsed.currentUserId ?? 'usr-cust-1',
          cart: parsed.cart || [],
          wishlist: parsed.wishlist || ['prod-2', 'prod-7'],
          recentlyViewed: parsed.recentlyViewed || ['prod-1', 'prod-4', 'prod-5'],
          appliedCouponCode: parsed.appliedCouponCode || '',
          compareList: parsed.compareList || [],
          loyaltyPoints: typeof parsed.loyaltyPoints === 'number' ? parsed.loyaltyPoints : 850,
          referralSharesCount:
            typeof parsed.referralSharesCount === 'number' ? parsed.referralSharesCount : 2,
          theme: normalizeTheme(parsed.theme),
          language: parsed.language || 'en',
        };
      }
    }
  } catch {
    // Fallback to clean seed state if localStorage is unavailable or corrupt
  }

  return {
    categories: SEED_CATEGORIES,
    products: SEED_PRODUCTS,
    reviews: SEED_REVIEWS,
    coupons: SEED_COUPONS,
    banners: SEED_BANNERS,
    users: SEED_USERS,
    orders: SEED_ORDERS,
    campaigns: [
      {
        id: 'cmp-1',
        channel: 'whatsapp',
        title: 'Autumn Loom Archive Launch',
        message: 'New Banarasi Katan & Jamdani weaves are now live at Vastra Atelier.',
        segment: 'WhatsApp Opt-In Customers',
        recipientsCount: 142,
        sentAt: '2026-11-05T10:30:00Z',
      },
    ],
    newsletterSubscribers: [
      { contact: 'ananya.rao@example.com', channel: 'email', optInAt: '2026-08-12T08:00:00Z' },
    ],
    currentUserId: 'usr-cust-1',
    cart: [
      {
        id: 'ci-init-1',
        productId: 'prod-5',
        selectedColor: 'Sage Celadon',
        selectedSize: 'Unstitched 3-Piece Set',
        measureQuantity: 1,
        unitType: 'piece',
        quantity: 1,
      },
    ],
    wishlist: ['prod-2', 'prod-7'],
    recentlyViewed: ['prod-1', 'prod-4', 'prod-5'],
    appliedCouponCode: '',
    compareList: [],
    loyaltyPoints: 850,
    referralSharesCount: 2,
    theme: 'light',
    language: 'en',
  };
};

interface CartPricingSummary {
  subtotal: number;
  discountAmount: number;
  coupon: Coupon | null;
  taxAmount: number;
  shippingCharge: number;
  totalAmount: number;
  freeShippingThreshold: number;
}

interface PlaceOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Omit<Address, 'id' | 'isDefault'>;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayPaymentId?: string;
}

interface StoreContextValue {
  view: AppView;
  navigate: (next: AppView) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  toasts: ToastMessage[];
  notify: (text: string, tone?: 'info' | 'success' | 'error') => void;

  categories: Category[];
  products: Product[];
  reviews: Review[];
  coupons: Coupon[];
  banners: Banner[];
  users: User[];
  orders: Order[];
  campaigns: MarketingCampaign[];
  newsletterSubscribers: { contact: string; channel: 'email' | 'whatsapp'; optInAt: string }[];

  currentUser: User | null;
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  appliedCouponCode: string;
  cartSummary: CartPricingSummary;
  compareList: string[];
  compareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  loyaltyPoints: number;
  referralSharesCount: number;
  redeemLoyaltyVoucher: () => boolean;
  recordReferralShare: () => void;
  reorderOrder: (orderId: string) => void;
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationPack;

  addToCart: (
    product: Product,
    options?: {
      selectedColor?: string;
      selectedSize?: string;
      measureQuantity?: number;
      unitType?: UnitType;
      quantity?: number;
      openDrawer?: boolean;
    }
  ) => void;
  updateCartItemQty: (cartItemId: string, delta: number) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;

  toggleWishlist: (productId: string) => void;
  moveWishlistToCart: (productId: string) => void;
  markProductViewed: (productId: string) => void;
  subscribeBackInStock: (productId: string, contact: string) => void;
  subscribeMarketing: (contact: string, channel: 'email' | 'whatsapp') => void;

  loginWithIdentifier: (identifier: string, roleHint?: UserRole) => User;
  registerCustomer: (data: {
    name: string;
    email: string;
    phone: string;
    whatsappOptIn: boolean;
  }) => User;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  updateProfile: (
    patch: Partial<Pick<User, 'name' | 'email' | 'phone' | 'marketingOptIn' | 'celebrationDates'>>
  ) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;

  placeOrder: (input: PlaceOrderInput) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  requestOrderReturn: (orderId: string, reason: string) => void;
  refundOrder: (orderId: string) => void;

  submitReview: (review: Omit<Review, 'id' | 'createdAt' | 'approved'>) => void;
  toggleReviewApproval: (reviewId: string) => void;

  saveCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;
  saveProduct: (prod: Product) => void;
  deleteProduct: (id: string) => void;
  saveCoupon: (coupon: Coupon) => void;
  toggleCouponActive: (code: string) => void;
  updateBanner: (banner: Banner) => void;
  sendCampaign: (campaign: Omit<MarketingCampaign, 'id' | 'sentAt'>) => void;

  visitorType: 'new' | 'returning';
  attribution: AttributionState;
  analyticsEvents: AnalyticsEvent[];
  conversionMetrics: ConversionMetricsSnapshot;
  applyCampaignAttribution: (opts: {
    channel: AttributionChannel;
    campaign: string;
    headline?: string;
    targetCategory?: string;
    audience?: string;
  }) => void;
  clearAttribution: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(getInitialState);
  const [view, setView] = useState<AppView>({ page: 'home' });
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [visitorType] = useState<'new' | 'returning'>(() => detectVisitorType());
  const [analytics, setAnalytics] = useState<StoredAnalyticsState>(getInitialAnalyticsState);

  const appendFunnelEvent = (
    type: AnalyticsEventType,
    extra: {
      productId?: string;
      orderId?: string;
      value?: number;
      overrideAttribution?: AttributionState;
    } = {}
  ) => {
    setAnalytics((prev) => {
      const attr = extra.overrideAttribution || prev.attribution;
      const evt: AnalyticsEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        visitorType,
        channel: attr.source,
        campaign: attr.campaign,
        productId: extra.productId,
        orderId: extra.orderId,
        value: extra.value,
        timestamp: new Date().toISOString(),
      };
      const nextState: StoredAnalyticsState = {
        attribution: attr,
        events: [...prev.events, evt].slice(-400),
      };
      saveAnalyticsState(nextState);
      return nextState;
    });
  };

  useEffect(() => {
    const urlAttr = parseAttributionFromSearch(window.location.search);
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    const audienceParam = params.get('audience');

    if (urlAttr) {
      appendFunnelEvent('campaign_click', { overrideAttribution: urlAttr });
    }
    appendFunnelEvent('session_start', {
      overrideAttribution: urlAttr || undefined,
    });

    if (catParam || audienceParam) {
      setView({
        page: 'catalog',
        category: catParam || 'all',
        audience: audienceParam || undefined,
      });
    }
    // Run once on initial page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-ivory', 'theme-obsidian', 'theme-heritage', 'theme-light', 'theme-dark');
    root.classList.add(`theme-${state.theme}`);
    if (state.theme === 'dark') {
      root.classList.add('dark');
    }
    root.lang = state.language;
  }, [state.theme, state.language]);

  const setTheme = (theme: ThemeId) => {
    setState((prev) => ({ ...prev, theme }));
  };

  const setLanguage = (language: LanguageCode) => {
    setState((prev) => ({ ...prev, language }));
  };

  const t = TRANSLATIONS[state.language] || TRANSLATIONS.en;

  const notify = (text: string, tone: 'info' | 'success' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  };

  const navigate = (next: AppView) => {
    if (next.page === 'checkout' && state.cart.length > 0) {
      appendFunnelEvent('checkout_start', { value: cartSummary.totalAmount });
    }
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyCampaignAttribution: StoreContextValue['applyCampaignAttribution'] = ({
    channel,
    campaign,
    headline,
    targetCategory,
    audience,
  }) => {
    const nextAttr: AttributionState = {
      source: channel,
      campaign,
      landingHeadline: headline,
      capturedAt: new Date().toISOString(),
    };
    appendFunnelEvent('campaign_click', { overrideAttribution: nextAttr });
    navigate({
      page: 'catalog',
      category: targetCategory || 'all',
      audience,
    });
    notify(`Viewing ${channel} campaign collection (${campaign})`, 'info');
  };

  const clearAttribution = () => {
    const resetAttr: AttributionState = {
      source: 'Direct',
      capturedAt: new Date().toISOString(),
    };
    setAnalytics((prev) => {
      const next = { ...prev, attribution: resetAttr };
      saveAnalyticsState(next);
      return next;
    });
  };

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) || null,
    [state.users, state.currentUserId]
  );

  const cartSummary = useMemo<CartPricingSummary>(() => {
    const freeShippingThreshold = 4999;
    let subtotal = 0;

    for (const item of state.cart) {
      const product = state.products.find((p) => p.id === item.productId);
      if (!product) continue;
      const unitPrice = calculateUnitPrice(product.price, item.measureQuantity, item.unitType);
      subtotal += unitPrice * item.quantity;
    }

    const coupon =
      state.coupons.find(
        (c) =>
          c.code.toUpperCase() === state.appliedCouponCode.toUpperCase() &&
          c.active &&
          subtotal >= c.minOrder
      ) || null;

    let discountAmount = 0;
    if (coupon) {
      discountAmount =
        coupon.discountType === 'percent'
          ? Math.round((subtotal * coupon.value) / 100)
          : Math.min(subtotal, coupon.value);
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * 0.05); // 5% Handloom / Textile GST slab
    const shippingCharge =
      subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 149;
    const totalAmount = taxableAmount + taxAmount + shippingCharge;

    return {
      subtotal,
      discountAmount,
      coupon,
      taxAmount,
      shippingCharge,
      totalAmount,
      freeShippingThreshold,
    };
  }, [state.cart, state.products, state.coupons, state.appliedCouponCode]);

  const addToCart: StoreContextValue['addToCart'] = (product, options = {}) => {
    if (product.stockCount <= 0) {
      notify('This piece is currently out of stock. Subscribe for restock alerts.', 'error');
      return;
    }

    const selectedColor = options.selectedColor || product.colors[0]?.name || 'Default';
    const selectedSize = options.selectedSize || product.sizes[0] || 'Standard';
    const unitType = options.unitType || product.unitType;
    const measureQuantity = options.measureQuantity ?? product.minMeasure ?? 1;
    const quantity = options.quantity ?? 1;

    setState((prev) => {
      const existingIdx = prev.cart.findIndex(
        (ci) =>
          ci.productId === product.id &&
          ci.selectedColor === selectedColor &&
          ci.selectedSize === selectedSize &&
          ci.unitType === unitType &&
          ci.measureQuantity === measureQuantity
      );

      let nextCart: CartItem[];
      if (existingIdx >= 0) {
        nextCart = prev.cart.map((ci, idx) =>
          idx === existingIdx ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      } else {
        nextCart = [
          ...prev.cart,
          {
            id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            productId: product.id,
            selectedColor,
            selectedSize,
            measureQuantity,
            unitType,
            quantity,
          },
        ];
      }
      return { ...prev, cart: nextCart };
    });

    appendFunnelEvent('add_to_cart', { productId: product.id, value: product.price });

    trackStoreEvent('add_to_cart', {
      item_id: product.sku,
      item_name: product.name,
      value: product.price,
      channel: analytics.attribution.source,
    });

    notify(`Added "${product.name}" to your bag`, 'success');
    if (options.openDrawer !== false) {
      setCartOpen(true);
    }
  };

  const updateCartItemQty = (cartItemId: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart
        .map((ci) => (ci.id === cartItemId ? { ...ci, quantity: ci.quantity + delta } : ci))
        .filter((ci) => ci.quantity > 0),
    }));
  };

  const removeCartItem = (cartItemId: string) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((ci) => ci.id !== cartItemId),
    }));
  };

  const clearCart = () => {
    setState((prev) => ({ ...prev, cart: [], appliedCouponCode: '' }));
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = state.coupons.find((c) => c.code.toUpperCase() === clean && c.active);
    if (!found) {
      return { ok: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSummary.subtotal < found.minOrder) {
      return {
        ok: false,
        message: `Requires a minimum subtotal of ₹${found.minOrder.toLocaleString('en-IN')}.`,
      };
    }
    setState((prev) => ({ ...prev, appliedCouponCode: clean }));
    notify(`Coupon ${clean} applied`, 'success');
    return { ok: true, message: found.description };
  };

  const removeCoupon = () => {
    setState((prev) => ({ ...prev, appliedCouponCode: '' }));
  };

  const toggleWishlist = (productId: string) => {
    const exists = state.wishlist.includes(productId);
    setState((prev) => ({
      ...prev,
      wishlist: exists
        ? prev.wishlist.filter((id) => id !== productId)
        : [productId, ...prev.wishlist],
    }));
    if (!exists) {
      appendFunnelEvent('wishlist_add', { productId });
    }
    notify(exists ? 'Removed from wishlist' : 'Saved to wishlist', 'info');
  };

  const moveWishlistToCart = (productId: string) => {
    const prod = state.products.find((p) => p.id === productId);
    if (!prod) return;
    addToCart(prod, { openDrawer: true });
    setState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((id) => id !== productId),
    }));
  };

  const markProductViewed = (productId: string) => {
    setState((prev) => ({
      ...prev,
      recentlyViewed: [productId, ...prev.recentlyViewed.filter((id) => id !== productId)].slice(
        0,
        8
      ),
    }));
    appendFunnelEvent('product_view', { productId });
  };

  const toggleCompare = (productId: string) => {
    const exists = state.compareList.includes(productId);
    if (!exists && state.compareList.length >= 3) {
      notify('You can compare up to 3 textiles side by side.', 'info');
      return;
    }
    setState((prev) => ({
      ...prev,
      compareList: exists
        ? prev.compareList.filter((id) => id !== productId)
        : [...prev.compareList, productId],
    }));
    if (!exists) {
      appendFunnelEvent('compare_add', { productId });
    }
    notify(exists ? 'Removed from weave comparison' : 'Added to weave comparison', 'info');
  };

  const clearCompare = () => {
    setState((prev) => ({ ...prev, compareList: [] }));
    setCompareOpen(false);
  };

  const redeemLoyaltyVoucher = (): boolean => {
    if (state.loyaltyPoints < 500) {
      notify('You need at least 500 Loyalty Points to unlock a ₹500 voucher.', 'error');
      return false;
    }
    const loyaltyCoupon: Coupon = {
      code: 'LOYALTY500',
      description: '₹500 Atelier Loyalty Reward on orders above ₹2,000',
      discountType: 'flat',
      value: 500,
      minOrder: 2000,
      active: true,
    };
    setState((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints - 500,
      coupons: prev.coupons.some((c) => c.code === 'LOYALTY500')
        ? prev.coupons.map((c) => (c.code === 'LOYALTY500' ? loyaltyCoupon : c))
        : [loyaltyCoupon, ...prev.coupons],
      appliedCouponCode: 'LOYALTY500',
    }));
    notify('500 points redeemed! Coupon LOYALTY500 (₹500 off) applied to your bag.', 'success');
    return true;
  };

  const recordReferralShare = () => {
    setState((prev) => ({
      ...prev,
      referralSharesCount: prev.referralSharesCount + 1,
      loyaltyPoints: prev.loyaltyPoints + 100,
    }));
    notify('Referral link shared! +100 Patron Points credited.', 'success');
  };

  const reorderOrder = (orderId: string) => {
    const ord = state.orders.find((o) => o.id === orderId);
    if (!ord) return;
    let added = 0;
    for (const item of ord.items) {
      const prod = state.products.find((p) => p.id === item.productId);
      if (prod && prod.stockCount > 0) {
        addToCart(prod, {
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          measureQuantity: item.measureQuantity,
          unitType: item.unitType,
          quantity: item.quantity,
          openDrawer: false,
        });
        added += 1;
      }
    }
    if (added > 0) {
      setCartOpen(true);
      notify(`Added ${added} weave${added > 1 ? 's' : ''} from ${ord.orderNumber} to your bag.`, 'success');
    } else {
      notify('Items from this order are currently out of stock.', 'error');
    }
  };

  const subscribeBackInStock = (productId: string, contact: string) => {
    const clean = contact.trim();
    if (!clean) return;
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId && !p.backInStockSubscribers.includes(clean)
          ? { ...p, backInStockSubscribers: [...p.backInStockSubscribers, clean] }
          : p
      ),
    }));
    notify('You will be notified via WhatsApp / Email when restocked.', 'success');
  };

  const subscribeMarketing = (contact: string, channel: 'email' | 'whatsapp') => {
    const clean = contact.trim();
    if (!clean) return;
    setState((prev) => ({
      ...prev,
      newsletterSubscribers: [
        { contact: clean, channel, optInAt: new Date().toISOString() },
        ...prev.newsletterSubscribers.filter((s) => s.contact !== clean),
      ],
    }));
    notify('Subscribed to Vastra Atelier new collection announcements.', 'success');
  };

  const loginWithIdentifier = (identifier: string, roleHint?: UserRole): User => {
    const clean = identifier.trim().toLowerCase();
    const existing = state.users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, '') ||
        (roleHint && u.role === roleHint)
    );
    if (existing) {
      setState((prev) => ({ ...prev, currentUserId: existing.id }));
      notify(`Signed in as ${existing.name}`, 'success');
      return existing;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: clean.includes('@') ? clean.split('@')[0] : 'Atelier Patron',
      email: clean.includes('@') ? clean : `${clean.replace(/[^0-9]/g, '')}@patron.vastra.in`,
      phone: clean.includes('@') ? '+91 98000 00000' : clean,
      role: roleHint || 'customer',
      otpVerified: true,
      addresses: [],
      marketingOptIn: { whatsapp: true, email: true, sms: false },
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUserId: newUser.id,
    }));
    notify(`Welcome to Vastra Atelier, ${newUser.name}`, 'success');
    return newUser;
  };

  const registerCustomer: StoreContextValue['registerCustomer'] = ({
    name,
    email,
    phone,
    whatsappOptIn,
  }) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: 'customer',
      otpVerified: true,
      addresses: [],
      marketingOptIn: { whatsapp: whatsappOptIn, email: true, sms: false },
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUserId: newUser.id,
    }));
    notify(`Account created for ${newUser.name}`, 'success');
    return newUser;
  };

  const logout = () => {
    setState((prev) => ({ ...prev, currentUserId: null }));
    if (view.page === 'admin' || view.page === 'account') {
      navigate({ page: 'home' });
    }
    notify('Signed out', 'info');
  };

  const switchDemoRole = (role: UserRole) => {
    const target = state.users.find((u) => u.role === role);
    if (target) {
      setState((prev) => ({ ...prev, currentUserId: target.id }));
      notify(`Switched active profile to ${target.name} (${role.toUpperCase()})`, 'info');
    }
  };

  const updateProfile: StoreContextValue['updateProfile'] = (patch) => {
    if (!currentUser) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === currentUser.id ? { ...u, ...patch } : u)),
    }));
    notify('Profile preferences saved', 'success');
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddr: Address = { ...addr, id: `addr-${Date.now()}` };
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => {
        if (u.id !== currentUser.id) return u;
        const base = addr.isDefault
          ? u.addresses.map((a) => ({ ...a, isDefault: false }))
          : u.addresses;
        return { ...u, addresses: [newAddr, ...base] };
      }),
    }));
    notify('Delivery address saved', 'success');
  };

  const removeAddress = (id: string) => {
    if (!currentUser) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === currentUser.id
          ? { ...u, addresses: u.addresses.filter((a) => a.id !== id) }
          : u
      ),
    }));
  };

  const placeOrder = (input: PlaceOrderInput): Order => {
    const orderNumber = `VA-2026-${Math.floor(1050 + Math.random() * 8900)}`;
    const now = new Date().toISOString();

    const items = state.cart
      .map((ci) => {
        const product = state.products.find((p) => p.id === ci.productId);
        if (!product) return null;
        const unitPrice = calculateUnitPrice(product.price, ci.measureQuantity, ci.unitType);
        return {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          image: product.images[0] || '',
          selectedColor: ci.selectedColor,
          selectedSize: ci.selectedSize,
          measureQuantity: ci.measureQuantity,
          unitType: ci.unitType,
          quantity: ci.quantity,
          unitPrice,
          lineTotal: unitPrice * ci.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser?.id || null,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      shippingAddress: input.shippingAddress,
      items,
      subtotal: cartSummary.subtotal,
      discountAmount: cartSummary.discountAmount,
      couponCode: cartSummary.coupon?.code,
      taxAmount: cartSummary.taxAmount,
      shippingCharge: cartSummary.shippingCharge,
      totalAmount: cartSummary.totalAmount,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentStatus,
      razorpayPaymentId: input.razorpayPaymentId,
      orderStatus: 'Confirmed',
      attribution: {
        source: analytics.attribution.source,
        campaign: analytics.attribution.campaign,
      },
      timeline: [
        {
          status: 'Confirmed',
          note:
            input.paymentMethod === 'cod'
              ? 'Cash on Delivery order confirmed. Automated WhatsApp & Email receipt queued.'
              : `Payment verified via Razorpay (${input.razorpayPaymentId}). Automated WhatsApp & Email receipt sent.`,
          timestamp: now,
        },
      ],
      createdAt: now,
    };

    setState((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      products: prev.products.map((p) => {
        const ordered = items.find((i) => i.productId === p.id);
        if (!ordered) return p;
        const deduct = ordered.unitType === 'piece' ? ordered.quantity : Math.ceil(ordered.measureQuantity * ordered.quantity);
        return { ...p, stockCount: Math.max(0, p.stockCount - deduct) };
      }),
      loyaltyPoints: prev.loyaltyPoints + Math.max(50, Math.round(newOrder.totalAmount / 100)),
      cart: [],
      appliedCouponCode: '',
    }));

    appendFunnelEvent('purchase_complete', {
      orderId: newOrder.id,
      value: newOrder.totalAmount,
    });

    trackStoreEvent('purchase', {
      transaction_id: orderNumber,
      value: newOrder.totalAmount,
      currency: 'INR',
      channel: analytics.attribution.source,
    });

    notify(`Order ${orderNumber} placed successfully`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              orderStatus: status,
              timeline: [
                ...ord.timeline,
                {
                  status,
                  note: note || `Order status updated to ${status}. WhatsApp notification dispatched.`,
                  timestamp: now,
                },
              ],
            }
          : ord
      ),
    }));
    notify(`Order updated to ${status}`, 'success');
  };

  const requestOrderReturn = (orderId: string, reason: string) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              orderStatus: 'Return Requested',
              returnReason: reason,
              timeline: [
                ...ord.timeline,
                {
                  status: 'Return Requested',
                  note: `Return requested: ${reason}`,
                  timestamp: now,
                },
              ],
            }
          : ord
      ),
    }));
    notify('Return request submitted for atelier inspection.', 'info');
  };

  const refundOrder = (orderId: string) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              orderStatus: 'Refunded',
              paymentStatus: 'refunded',
              timeline: [
                ...ord.timeline,
                {
                  status: 'Refunded',
                  note: 'Refund initiated via original Razorpay payment source.',
                  timestamp: now,
                },
              ],
            }
          : ord
      ),
    }));
    notify('Refund processed.', 'success');
  };

  const submitReview: StoreContextValue['submitReview'] = (reviewInput) => {
    const newRev: Review = {
      ...reviewInput,
      id: `rev-${Date.now()}`,
      approved: true,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => {
      const nextReviews = [newRev, ...prev.reviews];
      const productRevs = nextReviews.filter((r) => r.productId === reviewInput.productId && r.approved);
      const avg =
        productRevs.length > 0
          ? Number((productRevs.reduce((s, r) => s + r.rating, 0) / productRevs.length).toFixed(1))
          : 5;
      return {
        ...prev,
        reviews: nextReviews,
        loyaltyPoints: prev.loyaltyPoints + 150,
        products: prev.products.map((p) =>
          p.id === reviewInput.productId
            ? { ...p, rating: avg, reviewCount: productRevs.length }
            : p
        ),
      };
    });
    appendFunnelEvent('review_submit', { productId: reviewInput.productId });
    notify('Thank you — your review is now live (+150 Patron Points earned).', 'success');
  };

  const toggleReviewApproval = (reviewId: string) => {
    setState((prev) => ({
      ...prev,
      reviews: prev.reviews.map((r) => (r.id === reviewId ? { ...r, approved: !r.approved } : r)),
    }));
  };

  const saveCategory = (cat: Category) => {
    setState((prev) => {
      const exists = prev.categories.some((c) => c.id === cat.id);
      return {
        ...prev,
        categories: exists
          ? prev.categories.map((c) => (c.id === cat.id ? cat : c))
          : [...prev.categories, cat],
      };
    });
    notify(`Category "${cat.name}" saved`, 'success');
  };

  const deleteCategory = (id: string) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
    notify('Category removed', 'info');
  };

  const saveProduct = (prod: Product) => {
    setState((prev) => {
      const exists = prev.products.some((p) => p.id === prod.id);
      return {
        ...prev,
        products: exists
          ? prev.products.map((p) => (p.id === prod.id ? prod : p))
          : [prod, ...prev.products],
      };
    });
    notify(`Product "${prod.name}" saved`, 'success');
  };

  const deleteProduct = (id: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
    notify('Product removed from catalogue', 'info');
  };

  const saveCoupon = (coupon: Coupon) => {
    setState((prev) => {
      const exists = prev.coupons.some((c) => c.code === coupon.code);
      return {
        ...prev,
        coupons: exists
          ? prev.coupons.map((c) => (c.code === coupon.code ? coupon : c))
          : [coupon, ...prev.coupons],
      };
    });
    notify(`Coupon ${coupon.code} saved`, 'success');
  };

  const toggleCouponActive = (code: string) => {
    setState((prev) => ({
      ...prev,
      coupons: prev.coupons.map((c) => (c.code === code ? { ...c, active: !c.active } : c)),
    }));
  };

  const updateBanner = (banner: Banner) => {
    setState((prev) => ({
      ...prev,
      banners: prev.banners.map((b) => (b.id === banner.id ? banner : b)),
    }));
    notify('Storefront banner updated', 'success');
  };

  const sendCampaign: StoreContextValue['sendCampaign'] = (camp) => {
    const newCamp: MarketingCampaign = {
      ...camp,
      id: `cmp-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, campaigns: [newCamp, ...prev.campaigns] }));
    notify(`${camp.channel.toUpperCase()} campaign sent to ${camp.recipientsCount} recipients`, 'success');
  };

  const conversionMetrics = useMemo(
    () =>
      computeConversionMetrics(
        analytics.events,
        state.orders,
        state.products,
        state.reviews,
        state.users
      ),
    [analytics.events, state.orders, state.products, state.reviews, state.users]
  );

  return (
    <StoreContext.Provider
      value={{
        view,
        navigate,
        cartOpen,
        setCartOpen,
        authOpen,
        setAuthOpen,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        notify,
        categories: state.categories,
        products: state.products,
        reviews: state.reviews,
        coupons: state.coupons,
        banners: state.banners,
        users: state.users,
        orders: state.orders,
        campaigns: state.campaigns,
        newsletterSubscribers: state.newsletterSubscribers,
        currentUser,
        cart: state.cart,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        appliedCouponCode: state.appliedCouponCode,
        cartSummary,
        compareList: state.compareList,
        compareOpen,
        setCompareOpen,
        toggleCompare,
        clearCompare,
        loyaltyPoints: state.loyaltyPoints,
        referralSharesCount: state.referralSharesCount,
        redeemLoyaltyVoucher,
        recordReferralShare,
        reorderOrder,
        theme: state.theme,
        setTheme,
        language: state.language,
        setLanguage,
        t,
        addToCart,
        updateCartItemQty,
        removeCartItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        moveWishlistToCart,
        markProductViewed,
        subscribeBackInStock,
        subscribeMarketing,
        loginWithIdentifier,
        registerCustomer,
        logout,
        switchDemoRole,
        updateProfile,
        addAddress,
        removeAddress,
        placeOrder,
        updateOrderStatus,
        requestOrderReturn,
        refundOrder,
        submitReview,
        toggleReviewApproval,
        saveCategory,
        deleteCategory,
        saveProduct,
        deleteProduct,
        saveCoupon,
        toggleCouponActive,
        updateBanner,
        sendCampaign,
        visitorType,
        attribution: analytics.attribution,
        analyticsEvents: analytics.events,
        conversionMetrics,
        applyCampaignAttribution,
        clearAttribution,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
