import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FREE_SHIPPING_THRESHOLD, PRODUCTS, STANDARD_SHIPPING_FEE } from '../data/products';
import { INITIAL_REVIEWS } from '../data/reviews';
import { CartItem, Product, Review } from '../types';
import { useToast } from './ToastContext';

interface BackInStockSubscription {
  productId: string;
  variant: string;
  contact: string;
}

interface StoreContextValue {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  promoCode: string;
  promoDiscount: number;
  shippingFee: number;
  freeShippingRemaining: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: Product,
    options?: {
      quantity?: number;
      variant?: string;
      isSubscription?: boolean;
      tierTotalOverride?: number;
      openDrawer?: boolean;
    }
  ) => void;
  updateCartQuantity: (skuKey: string, nextQty: number) => void;
  removeFromCart: (skuKey: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { ok: boolean; message: string };
  clearPromoCode: () => void;
  wishlistIds: string[];
  toggleWishlist: (productId: string, productName?: string) => void;
  recentlyViewedIds: string[];
  recordProductView: (productId: string) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  backInStockList: BackInStockSubscription[];
  subscribeBackInStock: (productId: string, variant: string, contact: string) => void;
  whatsappRecoveryPhone: string;
  saveWhatsappRecovery: (phone: string) => void;
  bannerDismissed: boolean;
  dismissBanner: () => void;
  browseNudgeProduct: Product | null;
  dismissBrowseNudge: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function getCartKey(item: Pick<CartItem, 'productId' | 'variant' | 'isSubscription'>): string {
  return `${item.productId}::${item.variant || 'default'}::${item.isSubscription ? 'sub' : 'once'}`;
}

export function getEffectiveLineTotal(item: CartItem): number {
  if (item.isSubscription && item.subscriptionPrice) {
    return item.subscriptionPrice * item.quantity;
  }
  const product = PRODUCTS.find((p) => p.id === item.productId);
  if (product?.discountLadder && !item.isSubscription) {
    const matchedTier = [...product.discountLadder]
      .sort((a, b) => b.quantity - a.quantity)
      .find((t) => item.quantity === t.quantity);
    if (matchedTier) return matchedTier.totalPrice;
  }
  if (item.tierPriceOverride && item.quantity > 1) {
    return item.tierPriceOverride;
  }
  return item.unitPrice * item.quantity;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kl_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kl_wishlist_v1');
      return saved ? JSON.parse(saved) : ['kanchipuram-temple-emerald', 'kalamkari-silk-blouse'];
    } catch {
      return [];
    }
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kl_recent_v1');
      return saved ? JSON.parse(saved) : ['kanchipuram-temple-emerald', 'maheshwari-ochre-rose'];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('kl_reviews_v1');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [backInStockList, setBackInStockList] = useState<BackInStockSubscription[]>([]);
  const [whatsappRecoveryPhone, setWhatsappRecoveryPhone] = useState<string>(() => {
    return localStorage.getItem('kl_wa_recovery') || '';
  });
  const [promoCode, setPromoCode] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [browseNudgeDismissed, setBrowseNudgeDismissed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('kl_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore storage quota
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kl_wishlist_v1', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('kl_recent_v1', JSON.stringify(recentlyViewedIds));
    } catch {
      // ignore
    }
  }, [recentlyViewedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('kl_reviews_v1', JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback(
    (
      product: Product,
      options?: {
        quantity?: number;
        variant?: string;
        isSubscription?: boolean;
        tierTotalOverride?: number;
        openDrawer?: boolean;
      }
    ) => {
      const qty = options?.quantity ?? 1;
      const isSub = Boolean(options?.isSubscription && product.subscriptionOption);
      const unitPrice = isSub && product.subscriptionOption ? product.subscriptionOption.monthlyPrice : product.price;
      const chosenVariant = options?.variant ?? product.variants?.find((v) => v.inStock)?.label;

      setCart((prev) => {
        const key = getCartKey({ productId: product.id, variant: chosenVariant, isSubscription: isSub });
        const existingIndex = prev.findIndex((i) => getCartKey(i) === key);
        if (existingIndex >= 0) {
          const updated = [...prev];
          const nextQty = updated[existingIndex].quantity + qty;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: nextQty,
            tierPriceOverride: options?.tierTotalOverride,
          };
          return updated;
        }
        return [
          ...prev,
          {
            productId: product.id,
            sku: product.sku,
            name: product.name,
            image: product.images[0].url,
            unitPrice,
            mrp: product.mrp,
            quantity: qty,
            variant: chosenVariant,
            isSubscription: isSub,
            subscriptionPrice: product.subscriptionOption?.monthlyPrice,
            tierPriceOverride: options?.tierTotalOverride,
          },
        ];
      });

      showToast(`Added ${qty > 1 ? `${qty} × ` : ''}${product.name} to bag`);
      if (options?.openDrawer !== false) {
        setIsCartOpen(true);
      }
    },
    [showToast]
  );

  const updateCartQuantity = useCallback((skuKey: string, nextQty: number) => {
    setCart((prev) => {
      if (nextQty <= 0) {
        return prev.filter((item) => getCartKey(item) !== skuKey);
      }
      return prev.map((item) =>
        getCartKey(item) === skuKey ? { ...item, quantity: nextQty, tierPriceOverride: undefined } : item
      );
    });
  }, []);

  const removeFromCart = useCallback(
    (skuKey: string) => {
      setCart((prev) => prev.filter((item) => getCartKey(item) !== skuKey));
      showToast('Removed item from bag', 'info');
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setPromoCode('');
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + getEffectiveLineTotal(item), 0), [cart]);

  const promoDiscount = useMemo(() => {
    if (!promoCode || cartSubtotal === 0) return 0;
    if (promoCode === 'DIWALI10') return Math.round(cartSubtotal * 0.1);
    if (promoCode === 'LOOM200' && cartSubtotal >= 1500) return 200;
    return 0;
  }, [promoCode, cartSubtotal]);

  const discountedSubtotal = Math.max(0, cartSubtotal - promoDiscount);
  const shippingFee = cartSubtotal === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const cartTotal = discountedSubtotal + shippingFee;

  const applyPromoCode = useCallback(
    (rawCode: string) => {
      const code = rawCode.trim().toUpperCase();
      if (!code) return { ok: false, message: 'Enter a promo code.' };
      if (code === 'DIWALI10') {
        setPromoCode(code);
        showToast('Applied DIWALI10 (10% festive savings)');
        return { ok: true, message: '10% festive discount applied.' };
      }
      if (code === 'LOOM200') {
        if (cartSubtotal < 1500) {
          return { ok: false, message: 'LOOM200 applies on orders ₹1,500 and above.' };
        }
        setPromoCode(code);
        showToast('Applied LOOM200 (₹200 off)');
        return { ok: true, message: '₹200 instant savings applied.' };
      }
      return { ok: false, message: 'Invalid code. Try DIWALI10 or LOOM200.' };
    },
    [cartSubtotal, showToast]
  );

  const clearPromoCode = useCallback(() => setPromoCode(''), []);

  const toggleWishlist = useCallback(
    (productId: string, productName?: string) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast(productName ? `Removed ${productName} from wishlist` : 'Removed from wishlist', 'info');
          return prev.filter((id) => id !== productId);
        }
        showToast(productName ? `Saved ${productName} to wishlist` : 'Saved to wishlist');
        return [productId, ...prev];
      });
    },
    [showToast]
  );

  const recordProductView = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 6);
    });
  }, []);

  const addReview = useCallback(
    (review: Omit<Review, 'id' | 'date'>) => {
      const newRev: Review = {
        ...review,
        id: `rev-${Date.now()}`,
        date: 'Just now',
      };
      setReviews((prev) => [newRev, ...prev]);
      showToast('Thank you! Your verified review is now live.');
    },
    [showToast]
  );

  const subscribeBackInStock = useCallback(
    (productId: string, variant: string, contact: string) => {
      setBackInStockList((prev) => [...prev, { productId, variant, contact }]);
      showToast(`Alert set for ${variant}. We’ll message you first on restock.`);
    },
    [showToast]
  );

  const saveWhatsappRecovery = useCallback(
    (phone: string) => {
      const clean = phone.replace(/\D/g, '').slice(-10);
      setWhatsappRecoveryPhone(clean);
      try {
        localStorage.setItem('kl_wa_recovery', clean);
      } catch {
        // ignore
      }
      showToast('Bag link saved to WhatsApp. Complete checkout anytime.');
    },
    [showToast]
  );

  // Browse abandonment subtle resume helper: if user viewed products and has an empty bag
  const browseNudgeProduct = useMemo(() => {
    if (browseNudgeDismissed || cart.length > 0 || recentlyViewedIds.length === 0) return null;
    return PRODUCTS.find((p) => p.id === recentlyViewedIds[0]) || null;
  }, [browseNudgeDismissed, cart.length, recentlyViewedIds]);

  const value: StoreContextValue = {
    cart,
    cartCount,
    cartSubtotal,
    promoCode,
    promoDiscount,
    shippingFee,
    freeShippingRemaining,
    cartTotal,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    clearPromoCode,
    wishlistIds,
    toggleWishlist,
    recentlyViewedIds,
    recordProductView,
    reviews,
    addReview,
    backInStockList,
    subscribeBackInStock,
    whatsappRecoveryPhone,
    saveWhatsappRecovery,
    bannerDismissed,
    dismissBanner: () => setBannerDismissed(true),
    browseNudgeProduct,
    dismissBrowseNudge: () => setBrowseNudgeDismissed(true),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
