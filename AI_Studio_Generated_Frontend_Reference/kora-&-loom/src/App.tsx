import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CartDrawer } from './components/cart/CartDrawer';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { VirtualTryOnModal } from './components/product/VirtualTryOnModal';
import { BrowseAbandonmentStrip } from './components/retention/BrowseAbandonmentStrip';
import { AuthProvider } from './context/AuthContext';
import { BoutiqueCartProvider } from './context/BoutiqueCartContext';
import { LanguageProvider } from './context/LanguageContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import { PRODUCTS } from './data/products';
import { BoutiqueHomePage } from './pages/BoutiqueHomePage';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const CollectionPage = lazy(() => import('./pages/CollectionPage').then((m) => ({ default: m.CollectionPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CampaignPage = lazy(() => import('./pages/CampaignPage').then((m) => ({ default: m.CampaignPage })));
const QuizPage = lazy(() => import('./pages/QuizPage').then((m) => ({ default: m.QuizPage })));
const OffersPage = lazy(() => import('./pages/OffersPage').then((m) => ({ default: m.OffersPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() =>
  import('./pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage }))
);
const AccountPage = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const SupportPage = lazy(() => import('./pages/SupportPage').then((m) => ({ default: m.SupportPage })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-[#FAF9F6] text-sm text-[#57534E]">
      Loading Kora &amp; Loom...
    </div>
  );
}

function MainLayout() {
  const { addToCart } = useStore();
  const [globalTryOnOpen, setGlobalTryOnOpen] = useState(false);
  const featuredProduct = PRODUCTS[0];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1917]">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/classic" element={<HomePage />} />
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
        </Suspense>
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
        onAddToCart={({ drapeLabel, addonProductId, blouseAddonPrice, blouseLabel }) => {
          addToCart(featuredProduct, {
            quantity: 1,
            variant: `Drape: ${drapeLabel}`,
            openDrawer: !addonProductId,
          });
          if (addonProductId && blouseAddonPrice > 0) {
            const addonProduct = PRODUCTS.find((p) => p.id === addonProductId);
            if (addonProduct) {
              addToCart(addonProduct, {
                quantity: 1,
                variant: blouseLabel,
                unitPriceOverride: blouseAddonPrice,
                openDrawer: true,
              });
            }
          }
        }}
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
            <LanguageProvider>
              <ScrollToTop />
              <Routes>
                <Route
                  path="/"
                  element={
                    <BoutiqueCartProvider>
                      <BoutiqueHomePage />
                    </BoutiqueCartProvider>
                  }
                />
                <Route path="*" element={<MainLayout />} />
              </Routes>
            </LanguageProvider>
          </StoreProvider>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
}
