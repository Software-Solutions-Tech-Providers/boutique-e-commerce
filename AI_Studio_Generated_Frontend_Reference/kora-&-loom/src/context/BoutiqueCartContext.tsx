import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SareeProduct } from '../data/boutiqueData';
import { useToast } from './ToastContext';

export interface BoutiqueCartItem {
  productId: string;
  sku: string;
  name: string;
  image: string;
  optionLabel: string;
  unitPrice: number;
  originalUnitPrice: number;
  quantity: number;
}

interface BoutiqueCartContextValue {
  cart: BoutiqueCartItem[];
  cartCount: number;
  subtotal: number;
  promoCode: string;
  promoDiscount: number;
  shippingFee: number;
  freeShippingRemaining: number;
  totalPayable: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: SareeProduct, optionLabel?: string, quantity?: number) => void;
  updateQty: (key: string, nextQty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  clearPromo: () => void;
  wishlistIds: string[];
  toggleWishlist: (productId: string, name?: string) => void;
  quickViewProduct: SareeProduct | null;
  openQuickView: (product: SareeProduct) => void;
  closeQuickView: () => void;
}

const FREE_DELIVERY_THRESHOLD = 1999;
const DELIVERY_FEE = 99;

const BoutiqueCartContext = createContext<BoutiqueCartContextValue | null>(null);

export function getBoutiqueCartKey(item: Pick<BoutiqueCartItem, 'productId' | 'optionLabel'>): string {
  return `${item.productId}::${item.optionLabel}`;
}

export function BoutiqueCartProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  const [cart, setCart] = useState<BoutiqueCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kl_boutique_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kl_boutique_wishlist_v1');
      return saved ? JSON.parse(saved) : ['kanchipuram-emerald-temple'];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<SareeProduct | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('kl_boutique_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kl_boutique_wishlist_v1', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const addToCart = useCallback(
    (product: SareeProduct, optionLabel?: string, quantity = 1) => {
      const chosenOpt = optionLabel || product.defaultOption;
      const optObj = product.drapeOptions.find((o) => o.label === chosenOpt) || product.drapeOptions[0];
      const unitPrice = Math.round(product.price * optObj.multiplier);
      const originalUnitPrice = Math.round(product.originalPrice * optObj.multiplier);

      setCart((prev) => {
        const key = `${product.id}::${optObj.label}`;
        const idx = prev.findIndex((i) => getBoutiqueCartKey(i) === key);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [
          ...prev,
          {
            productId: product.id,
            sku: product.sku,
            name: product.name,
            image: product.image,
            optionLabel: optObj.label,
            unitPrice,
            originalUnitPrice,
            quantity,
          },
        ];
      });

      showToast(`Added ${product.name} to bag`);
    },
    [showToast]
  );

  const updateQty = useCallback((key: string, nextQty: number) => {
    setCart((prev) => {
      if (nextQty <= 0) return prev.filter((i) => getBoutiqueCartKey(i) !== key);
      return prev.map((i) => (getBoutiqueCartKey(i) === key ? { ...i, quantity: nextQty } : i));
    });
  }, []);

  const removeItem = useCallback(
    (key: string) => {
      setCart((prev) => prev.filter((i) => getBoutiqueCartKey(i) !== key));
      showToast('Removed from bag', 'info');
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setPromoCode('');
  }, []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0), [cart]);

  const promoDiscount = useMemo(() => {
    if (!promoCode || subtotal === 0) return 0;
    if (promoCode === 'KORA10' && subtotal >= 3999) return Math.round(subtotal * 0.1);
    if (promoCode === 'TROUSSEAU15' && subtotal >= 6999) return Math.round(subtotal * 0.15);
    return 0;
  }, [promoCode, subtotal]);

  const afterPromo = Math.max(0, subtotal - promoDiscount);
  const shippingFee = subtotal === 0 || afterPromo >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const freeShippingRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - afterPromo);
  const totalPayable = afterPromo + shippingFee;

  const applyPromo = useCallback(
    (rawCode: string) => {
      const code = rawCode.trim().toUpperCase();
      if (!code) return { ok: false, message: 'Enter a promo code.' };
      if (code === 'KORA10') {
        if (subtotal < 3999) {
          return { ok: false, message: 'Add ₹3,999+ to unlock 10% off with KORA10.' };
        }
        setPromoCode('KORA10');
        showToast('KORA10 applied — 10% off!');
        return { ok: true, message: '10% boutique discount applied.' };
      }
      if (code === 'TROUSSEAU15') {
        if (subtotal < 6999) {
          return { ok: false, message: 'Add ₹6,999+ to unlock 15% off with TROUSSEAU15.' };
        }
        setPromoCode('TROUSSEAU15');
        showToast('TROUSSEAU15 applied — 15% off!');
        return { ok: true, message: '15% bridal trousseau discount applied.' };
      }
      return { ok: false, message: 'Try KORA10 (on ₹3,999+) or TROUSSEAU15 (on ₹6,999+).' };
    },
    [subtotal, showToast]
  );

  const toggleWishlist = useCallback(
    (productId: string, name?: string) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast(name ? `Removed ${name} from wishlist` : 'Removed from wishlist', 'info');
          return prev.filter((id) => id !== productId);
        }
        showToast(name ? `Saved ${name} to wishlist` : 'Saved to wishlist');
        return [productId, ...prev];
      });
    },
    [showToast]
  );

  return (
    <BoutiqueCartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        promoCode,
        promoDiscount,
        shippingFee,
        freeShippingRemaining,
        totalPayable,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        applyPromo,
        clearPromo: () => setPromoCode(''),
        wishlistIds,
        toggleWishlist,
        quickViewProduct,
        openQuickView: (p) => setQuickViewProduct(p),
        closeQuickView: () => setQuickViewProduct(null),
      }}
    >
      {children}
    </BoutiqueCartContext.Provider>
  );
}

export function useBoutiqueCart() {
  const ctx = useContext(BoutiqueCartContext);
  if (!ctx) throw new Error('useBoutiqueCart must be used within BoutiqueCartProvider');
  return ctx;
}
