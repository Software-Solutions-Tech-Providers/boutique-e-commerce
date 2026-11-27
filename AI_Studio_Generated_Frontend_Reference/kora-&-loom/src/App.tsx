import { useEffect, useState } from 'react';
import { BoutiqueCartProvider } from './context/BoutiqueCartContext';
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
import { BoutiqueHomePage } from './pages/BoutiqueHomePage';

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
        <LanguageProvider>
      <ToastProvider>
        <BoutiqueCartProvider>
          <BoutiqueHomePage />
        </BoutiqueCartProvider>
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
    </LanguageProvider>
  );
}
