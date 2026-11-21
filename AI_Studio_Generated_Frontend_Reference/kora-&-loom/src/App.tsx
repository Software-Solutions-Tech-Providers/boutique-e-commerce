import { useEffect, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CartDrawer } from './components/cart/CartDrawer';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { VirtualTryOnModal } from './components/product/VirtualTryOnModal';
import { BrowseAbandonmentStrip } from './components/retention/BrowseAbandonmentStrip';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import { PRODUCTS } from './data/products';
import { AccountPage } from './pages/AccountPage';
import { CampaignPage } from './pages/CampaignPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CollectionPage } from './pages/CollectionPage';
import { HomePage } from './pages/HomePage';
import { OffersPage } from './pages/OffersPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { QuizPage } from './pages/QuizPage';
import { SupportPage } from './pages/SupportPage';
import { WishlistPage } from './pages/WishlistPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function MainLayout() {
  const { addToCart } = useStore();
  const [globalTryOnOpen, setGlobalTryOnOpen] = useState(false);
  const featuredProduct = PRODUCTS[0];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1917]">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionPage />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/campaign/diwali" element={<CampaignPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <BrowseAbandonmentStrip />

      {/* Floating & Fixed Mobile Navigation Bar matching Screenshots */}
      <MobileBottomNav onOpenVirtualTryOn={() => setGlobalTryOnOpen(true)} />

      {/* Global Virtual Try-On Modal */}
      <VirtualTryOnModal
        open={globalTryOnOpen}
        onClose={() => setGlobalTryOnOpen(false)}
        product={featuredProduct}
        onAddToCart={() => addToCart(featuredProduct, { quantity: 1, openDrawer: true })}
      />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <StoreProvider>
            <ScrollToTop />
            <MainLayout />
          </StoreProvider>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
}
