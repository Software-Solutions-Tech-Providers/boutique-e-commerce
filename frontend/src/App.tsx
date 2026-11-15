import React, { Suspense, lazy } from 'react';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CompareModal } from './components/CompareModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Navbar } from './components/Navbar';
import { QuickViewModal } from './components/QuickViewModal';
import { WhatsAppBot } from './components/WhatsAppBot';
import { StoreProvider, useStore } from './context/StoreContext';
import { HomePage } from './pages/HomePage';

const CatalogPage = lazy(() =>
  import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage }))
);
const CategoriesPage = lazy(() =>
  import('./pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const WishlistPage = lazy(() =>
  import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage }))
);
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const AccountPage = lazy(() =>
  import('./pages/AccountPage').then((m) => ({ default: m.AccountPage }))
);
const ReviewsPage = lazy(() =>
  import('./pages/ReviewsPage').then((m) => ({ default: m.ReviewsPage }))
);
const InfoPage = lazy(() =>
  import('./pages/InfoPage').then((m) => ({ default: m.InfoPage }))
);
const AdminDashboard = lazy(() =>
  import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

const StorefrontShell: React.FC = () => {
  const { view, toasts } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-200 overflow-x-clip pb-16 md:pb-0">
      <Navbar />

      <div className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 text-center text-sm text-[var(--text-secondary)]">
              Loading atelier collection...
            </div>
          }
        >
          {view.page === 'home' && <HomePage />}
          {view.page === 'categories' && <CategoriesPage />}
          {view.page === 'catalog' && <CatalogPage />}
          {view.page === 'product' && <ProductDetailPage />}
          {view.page === 'wishlist' && <WishlistPage />}
          {view.page === 'checkout' && <CheckoutPage />}
          {view.page === 'account' && <AccountPage />}
          {view.page === 'reviews' && <ReviewsPage />}
          {view.page === 'info' && <InfoPage />}
          {view.page === 'admin' && <AdminDashboard />}
        </Suspense>
      </div>

      <Footer />

      <MobileBottomNav />
      <CompareModal />
      <CartDrawer />
      <QuickViewModal />
      <AuthModal />
      <WhatsAppBot />

      {/* Subtle Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-20 md:bottom-4 left-4 right-4 sm:right-auto z-50 space-y-2 no-print sm:max-w-sm">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`px-4 py-2.5 rounded-md shadow-lg text-xs font-medium text-white ${
                t.tone === 'error'
                  ? 'bg-rose-700'
                  : t.tone === 'success'
                  ? 'bg-[#141416]'
                  : 'bg-[#1E2B4F]'
              }`}
            >
              {t.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StorefrontShell />
    </StoreProvider>
  );
}
