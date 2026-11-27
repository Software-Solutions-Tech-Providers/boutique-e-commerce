import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MITHAI_PRODUCTS, MithaiProduct } from '../data/mithaiData';
import { useToast } from './ToastContext';

export interface MithaiCartItem {
  productId: string;
  name: string;
  image: string;
  weightLabel: string;
  unitPrice: number;
  originalUnitPrice: number;
  quantity: number;
}

interface MithaiCartContextValue {
  cart: MithaiCartItem[];
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
  addToCart: (product: MithaiProduct, weightLabel?: string, quantity?: number) => void;
  updateQty: (key: string, nextQty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  clearPromo: () => void;
  wishlistIds: string[];
  toggleWishlist: (productId: string, name?: string) => void;
  quickViewProduct: MithaiProduct | null;
  openQuickView: (product: MithaiProduct) => void;
  closeQuickView: () => void;
}

const FREE_DELIVERY_THRESHOLD = 799;
const DELIVERY_FEE = 79;

const MithaiCartContext = createContext<MithaiCartContextValue | null>(null);

export function getMithaiCartKey(item: Pick<MithaiCartItem, 'productId' | 'weightLabel'>): string {
  return `${item.productId}::${item.weightLabel}`;
}

export function MithaiCartProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  const [cart, setCart] = useState<MithaiCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mm_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mm_wishlist_v1');
      return saved ? JSON.parse(saved) : ['ghee-mysore-pak'];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<MithaiProduct | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mm_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('mm_wishlist_v1', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const addToCart = useCallback(
    (product: MithaiProduct, weightLabel?: string, quantity = 1) => {
      const chosenWeight = weightLabel || product.defaultWeight;
      const weightObj =
        product.weightOptions.find((w) => w.label === chosenWeight) || product.weightOptions[0];
      const unitPrice = Math.round(product.price * weightObj.multiplier);
      const originalUnitPrice = Math.round(product.originalPrice * weightObj.multiplier);

      setCart((prev) => {
        const key = `${product.id}::${weightObj.label}`;
        const idx = prev.findIndex((i) => getMithaiCartKey(i) === key);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            image: product.image,
            weightLabel: weightObj.label,
            unitPrice,
            originalUnitPrice,
            quantity,
          },
        ];
      });

      showToast(`Added ${product.name} (${weightObj.label}) to bag`);
    },
    [showToast]
  );

  const updateQty = useCallback((key: string, nextQty: number) => {
    setCart((prev) => {
      if (nextQty <= 0) return prev.filter((i) => getMithaiCartKey(i) !== key);
      return prev.map((i) => (getMithaiCartKey(i) === key ? { ...i, quantity: nextQty } : i));
    });
  }, []);

  const removeItem = useCallback(
    (key: string) => {
      setCart((prev) => prev.filter((i) => getMithaiCartKey(i) !== key));
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
    if (promoCode === 'SWEET10' && subtotal >= 1499) return Math.round(subtotal * 0.1);
    if (promoCode === 'FESTIVE15' && subtotal >= 2499) return Math.round(subtotal * 0.15);
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
      if (code === 'SWEET10') {
        if (subtotal < 1499) {
          return { ok: false, message: 'Add ₹1,499+ to unlock 10% off with SWEET10.' };
        }
        setPromoCode('SWEET10');
        showToast('SWEET10 applied — 10% off!');
        return { ok: true, message: '10% festive discount applied.' };
      }
      if (code === 'FESTIVE15') {
        if (subtotal < 2499) {
          return { ok: false, message: 'Add ₹2,499+ to unlock 15% off with FESTIVE15.' };
        }
        setPromoCode('FESTIVE15');
        showToast('FESTIVE15 applied — 15% off!');
        return { ok: true, message: '15% combo discount applied.' };
      }
      return { ok: false, message: 'Try SWEET10 (on ₹1,499+) or FESTIVE15 (on ₹2,499+).' };
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

  // Ensure initial quick view helper stays valid if needed
  void MITHAI_PRODUCTS;

  return (
    <MithaiCartContext.Provider
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
    </MithaiCartContext.Provider>
  );
}

export function useMithaiCart() {
  const ctx = useContext(MithaiCartContext);
  if (!ctx) throw new Error('useMithaiCart must be used within MithaiCartProvider');
  return ctx;
}
