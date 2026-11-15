import React, { useMemo } from 'react';
import { Grid, Heart, Home, ShoppingBag, User as UserIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const { view, navigate, cart, wishlist, setCartOpen, currentUser, setAuthOpen } = useStore();

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Hide on Product Detail page so mobile sticky Buy Bar sits cleanly without stacking
  if (view.page === 'product') return null;

  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      active: view.page === 'home',
      onClick: () => navigate({ page: 'home' }),
    },
    {
      id: 'categories',
      label: 'Shop',
      icon: Grid,
      active: view.page === 'categories' || view.page === 'catalog',
      onClick: () => navigate({ page: 'categories' }),
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      badge: wishlist.length,
      active: view.page === 'wishlist',
      onClick: () => navigate({ page: 'wishlist' }),
    },
    {
      id: 'bag',
      label: 'Bag',
      icon: ShoppingBag,
      badge: cartCount,
      active: view.page === 'checkout',
      onClick: () => setCartOpen(true),
    },
    {
      id: 'account',
      label: currentUser ? 'Account' : 'Sign In',
      icon: UserIcon,
      active: view.page === 'account',
      onClick: () =>
        currentUser ? navigate({ page: 'account', tab: 'orders' }) : setAuthOpen(true),
    },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-color)] grid grid-cols-5 items-center no-print"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] text-[10px] font-medium transition-colors cursor-pointer ${
              item.active
                ? 'text-[var(--accent)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className="relative">
              <Icon className="w-[18px] h-[18px]" />
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-[var(--accent)] text-white dark:text-[#141416] text-[9px] font-semibold flex items-center justify-center tabular-nums">
                  {item.badge}
                </span>
              )}
            </span>
            <span className="mt-0.5 leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
