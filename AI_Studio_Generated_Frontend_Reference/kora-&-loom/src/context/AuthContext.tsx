import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CartItem, OrderRecord, PaymentMethod } from '../types';
import { useToast } from './ToastContext';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  login: (email: string, name?: string) => void;
  register: (profile: UserProfile) => void;
  logout: () => void;
  orders: OrderRecord[];
  storeCredit: number;
  reorderReminders: string[];
  toggleReorderReminder: (productId: string, label: string) => void;
  placeOrder: (payload: {
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
    useStoreCredit?: boolean;
  }) => OrderRecord;
  requestExchange: (
    orderId: string,
    itemSku: string,
    reason: string,
    resolution: 'Size/Drape Exchange' | 'Instant 110% Store Credit',
    itemValue: number
  ) => void;
  submitSurvey: (orderId: string, rating: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SEED_ORDERS: OrderRecord[] = [
  {
    id: 'KL-1042',
    createdAt: '14 Nov 2026',
    customerName: 'Ananya Sundaram',
    phone: '8124536947',
    email: 'ananya@example.com',
    address: '18 Kasturi Ranga Road, Alwarpet',
    city: 'Chennai',
    pincode: '600018',
    isGuest: false,
    paymentMethod: 'UPI',
    items: [
      {
        productId: 'kanchipuram-temple-emerald',
        sku: 'KL-KNC-101',
        name: 'Kanchipuram Temple Zari Silk Saree',
        image: '/src/assets/images/product_emerald_drape_1795082277045.jpg',
        unitPrice: 3499,
        mrp: 4699,
        quantity: 1,
      },
      {
        productId: 'silk-care-kit',
        sku: 'KL-CAR-501',
        name: 'Heirloom Muslin Saree Care & Cedar Refill Kit',
        image: '/src/assets/images/product_ivory_linen_1795082277269.jpg',
        unitPrice: 450,
        mrp: 650,
        quantity: 1,
        isSubscription: true,
        subscriptionPrice: 450,
      },
    ],
    subtotal: 3949,
    discount: 0,
    shippingFee: 0,
    total: 3949,
    status: 'Delivered',
    estimatedDelivery: 'Delivered on 17 Nov 2026',
  },
  {
    id: 'KL-1051',
    createdAt: '18 Nov 2026',
    customerName: 'Ananya Sundaram',
    phone: '9840123456',
    email: 'ananya@example.com',
    address: '18 Kasturi Ranga Road, Alwarpet',
    city: 'Chennai',
    pincode: '600018',
    isGuest: false,
    paymentMethod: 'COD',
    items: [
      {
        productId: 'kalamkari-silk-blouse',
        sku: 'KL-BLS-301',
        name: 'Kalamkari Artisanal Ready-Made Silk Blouse',
        image: '/src/assets/images/product_blouse_jewellery_1795082278000.jpg',
        unitPrice: 899,
        mrp: 1199,
        quantity: 1,
        variant: 'M (36")',
      },
    ],
    subtotal: 899,
    discount: 0,
    shippingFee: 120,
    total: 1019,
    status: 'Dispatched',
    estimatedDelivery: 'Arriving by 21 Nov 2026',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('kl_user_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('kl_orders_v1');
      return saved ? JSON.parse(saved) : SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  });

  const [storeCredit, setStoreCredit] = useState<number>(() => {
    const saved = localStorage.getItem('kl_credit_v1');
    return saved ? Number(saved) : 0;
  });

  const [reorderReminders, setReorderReminders] = useState<string[]>(['silk-care-kit']);

  useEffect(() => {
    try {
      if (user) localStorage.setItem('kl_user_v1', JSON.stringify(user));
      else localStorage.removeItem('kl_user_v1');
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('kl_orders_v1', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('kl_credit_v1', String(storeCredit));
    } catch {
      // ignore
    }
  }, [storeCredit]);

  const login = useCallback(
    (email: string, name = 'Ananya Sundaram') => {
      setUser({
        name,
        email,
        phone: '9840123456',
        address: '18 Kasturi Ranga Road, Alwarpet',
        city: 'Chennai',
        pincode: '600018',
      });
      showToast(`Signed in as ${name}`);
    },
    [showToast]
  );

  const register = useCallback(
    (profile: UserProfile) => {
      setUser(profile);
      showToast(`Welcome to Kora & Loom, ${profile.name}`);
    },
    [showToast]
  );

  const logout = useCallback(() => {
    setUser(null);
    showToast('Signed out', 'info');
  }, [showToast]);

  const placeOrder = useCallback(
    (payload: {
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
      useStoreCredit?: boolean;
    }) => {
      let creditApplied = 0;
      if (payload.useStoreCredit && storeCredit > 0) {
        creditApplied = Math.min(storeCredit, payload.total);
        setStoreCredit((prev) => Math.max(0, prev - creditApplied));
      }

      const order: OrderRecord = {
        id: `KL-${Math.floor(1100 + Math.random() * 8800)}`,
        createdAt: 'Today',
        customerName: payload.customerName,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        city: payload.city,
        pincode: payload.pincode,
        isGuest: payload.isGuest,
        paymentMethod: payload.paymentMethod,
        items: payload.items,
        subtotal: payload.subtotal,
        discount: payload.discount + creditApplied,
        shippingFee: payload.shippingFee,
        total: Math.max(0, payload.total - creditApplied),
        status: 'Confirmed',
        estimatedDelivery: 'Arrives in 2 to 4 business days',
      };

      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [storeCredit]
  );

  const requestExchange = useCallback(
    (
      orderId: string,
      itemSku: string,
      reason: string,
      resolution: 'Size/Drape Exchange' | 'Instant 110% Store Credit',
      itemValue: number
    ) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
              ...o,
              exchangeRequested: {
                itemSku,
                reason,
                resolution,
                requestedAt: 'Just now',
              },
            }
            : o
        )
      );
      if (resolution === 'Instant 110% Store Credit') {
        const bonusCredit = Math.round(itemValue * 1.1);
        setStoreCredit((prev) => prev + bonusCredit);
        showToast(`₹${bonusCredit} instant store credit added (includes +10% bonus)!`);
      } else {
        showToast('Free reverse pickup scheduled for your exchange tomorrow.');
      }
    },
    [showToast]
  );

  const submitSurvey = useCallback(
    (orderId: string, rating: number) => {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, surveyRating: rating } : o)));
      showToast('Thank you for sharing your checkout experience!');
    },
    [showToast]
  );

  const toggleReorderReminder = useCallback(
    (productId: string, label: string) => {
      setReorderReminders((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast(`Paused 30-day reorder reminder for ${label}`, 'info');
          return prev.filter((id) => id !== productId);
        }
        showToast(`30-day reorder reminder enabled for ${label}`);
        return [...prev, productId];
      });
    },
    [showToast]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        orders,
        storeCredit,
        reorderReminders,
        toggleReorderReminder,
        placeOrder,
        requestExchange,
        submitSurvey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
