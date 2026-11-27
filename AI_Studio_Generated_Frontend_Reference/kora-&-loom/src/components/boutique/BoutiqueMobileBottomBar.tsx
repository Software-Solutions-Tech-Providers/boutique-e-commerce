import { Grid, Heart, Home, ShoppingBag, User } from 'lucide-react';
import { useBoutiqueCart } from '../../context/BoutiqueCartContext';
import { useLanguage } from '../../context/LanguageContext';

interface BoutiqueMobileBottomBarProps {
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
}

export function BoutiqueMobileBottomBar({ onOpenWishlist, onOpenAccount }: BoutiqueMobileBottomBarProps) {
  const { cartCount, wishlistIds, openCart } = useBoutiqueCart();
  const { t } = useLanguage();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Mobile quick actions"
      className="fixed inset-x-0 bottom-0 z-40 grid h-12 grid-cols-5 items-center border-t border-[#E6DDD0] bg-[#FCF9F4]/95 backdrop-blur-md md:hidden"
    >
      <button
        type="button"
        onClick={() => scrollToId('top')}
        className="flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-[#231712] active:text-[#7C1D26] cursor-pointer"
      >
        <Home className="h-4 w-4" />
        <span className="truncate max-w-full px-1">{t.home}</span>
      </button>

      <button
        type="button"
        onClick={() => scrollToId('shop-by-category')}
        className="flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-[#231712] active:text-[#7C1D26] cursor-pointer"
      >
        <Grid className="h-4 w-4" />
        <span className="truncate max-w-full px-1">{t.weaves}</span>
      </button>

      <button
        type="button"
        onClick={onOpenWishlist}
        aria-label={`${t.wishlist} (${wishlistIds.length})`}
        className="relative flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-[#231712] active:text-[#7C1D26] cursor-pointer"
      >
        <Heart className="h-4 w-4" />
        <span className="tabular-nums truncate max-w-full px-1">{t.wishlist} ({wishlistIds.length})</span>
      </button>

      <button
        type="button"
        onClick={onOpenAccount}
        className="flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-[#231712] active:text-[#7C1D26] cursor-pointer"
      >
        <User className="h-4 w-4" />
        <span className="truncate max-w-full px-1">{t.account}</span>
      </button>

      <button
        type="button"
        onClick={openCart}
        className="flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-[#7C1D26] cursor-pointer"
      >
        <ShoppingBag className="h-4 w-4" />
        <span className="tabular-nums truncate max-w-full px-1">{t.bag} ({cartCount})</span>
      </button>
    </nav>
  );
}
