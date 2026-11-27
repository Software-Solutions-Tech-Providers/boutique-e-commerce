import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getBoutiqueProductId, getProductToBoutiqueId, SareeProduct } from '../data/boutiqueData';
import { PRODUCTS } from '../data/products';
import { getCartKey, useStore } from './StoreContext';

export interface BoutiqueCartItem {
  cartKey: string;
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

const BoutiqueCartContext = createContext<BoutiqueCartContextValue | null>(null);

export function getBoutiqueCartKey(item: Pick<BoutiqueCartItem, 'cartKey' | 'productId' | 'optionLabel'>): string {
  return item.cartKey || `${item.productId}::${item.optionLabel}`;
}

/**
 * Adapts the unified StoreContext cart & wishlist state for the BoutiqueHomePage components
 * so bag items, wishlists, and promo codes stay in sync across all routes.
 */
export function BoutiqueCartProvider({ children }: { children: React.ReactNode }) {
  const store = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<SareeProduct | null>(null);

  const cart = useMemo<BoutiqueCartItem[]>(
    () =>
      store.cart.map((item) => ({
        cartKey: getCartKey(item),
        productId: getProductToBoutiqueId(item.productId),
        sku: item.sku,
        name: item.name,
        image: item.image,
        optionLabel: item.variant || 'Standard',
        unitPrice: item.unitPrice,
        originalUnitPrice: item.mrp,
        quantity: item.quantity,
      })),
    [store.cart]
  );

  const wishlistIds = useMemo(() => {
    const ids = new Set<string>(store.wishlistIds);
    for (const id of store.wishlistIds) {
      ids.add(getProductToBoutiqueId(id));
    }
    return Array.from(ids);
  }, [store.wishlistIds]);

  const addToCart = useCallback(
    (product: SareeProduct, optionLabel?: string, quantity = 1) => {
      const chosenOpt = optionLabel || product.defaultOption;
      const optObj = product.drapeOptions.find((o) => o.label === chosenOpt) || product.drapeOptions[0];
      const unitPrice = Math.round(product.price * optObj.multiplier);
      const canonicalId = getBoutiqueProductId(product);
      const canonicalProduct = PRODUCTS.find((p) => p.id === canonicalId) ?? {
        id: canonicalId,
        sku: product.sku,
        name: product.name,
        category: 'Silk Sarees' as const,
        weave: product.fabricSpec,
        occasion: 'Festive' as const,
        price: product.price,
        mrp: product.originalPrice,
        oneLineBenefit: product.shortDesc,
        rating: product.rating,
        reviewCount: product.reviewCount,
        blouseIncluded: product.blouseDetails,
        lengthSpec: '6.4m',
        fabricCare: 'Dry clean recommended.',
        images: [{ url: product.image, label: 'Product Showcase' as const, alt: product.name }],
        hasVideoPreview: false,
        videoCaption: '',
        benefits: [],
        faqs: [],
        complementaryIds: [],
      };

      store.addToCart(canonicalProduct, {
        quantity,
        variant: optObj.label,
        unitPriceOverride: unitPrice,
        openDrawer: false,
      });
    },
    [store]
  );

  const toggleWishlist = useCallback(
    (productId: string, name?: string) => {
      const canonicalId = getBoutiqueProductId({ id: productId });
      store.toggleWishlist(canonicalId, name);
    },
    [store]
  );

  return (
    <BoutiqueCartContext.Provider
      value={{
        cart,
        cartCount: store.cartCount,
        subtotal: store.cartSubtotal,
        promoCode: store.promoCode,
        promoDiscount: store.promoDiscount,
        shippingFee: store.shippingFee,
        freeShippingRemaining: store.freeShippingRemaining,
        totalPayable: store.cartTotal,
        isCartOpen: store.isCartOpen,
        openCart: store.openCart,
        closeCart: store.closeCart,
        addToCart,
        updateQty: store.updateCartQuantity,
        removeItem: store.removeFromCart,
        clearCart: store.clearCart,
        applyPromo: store.applyPromoCode,
        clearPromo: store.clearPromoCode,
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
