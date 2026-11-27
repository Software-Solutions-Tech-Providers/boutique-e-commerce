import { Grid, Home, Search, ShoppingBag } from 'lucide-react';
import { useMithaiCart } from '../../context/MithaiCartContext';

interface MobileBottomBarProps {
  onOpenSearch: () => void;
}

export function MobileBottomBar({ onOpenSearch }: MobileBottomBarProps) {
  const { cartCount, openCart } = useMithaiCart();

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Mobile quick actions"
      className="fixed bottom-0 left-0 right-0 z-40 grid h-12 grid-cols-4 items-center border-t border-[#E6DDD0] bg-[#FCF9F4]/95 backdrop-blur-md md:hidden"
    >
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex h-full flex-col items-center justify-center text-[#7C1D26]"
      >
        <Home className="h-4 w-4" />
        <span className="mt-0.5 text-[10px] font-semibold leading-none">Home</span>
      </button>

      <button
        type="button"
        onClick={() => jumpTo('shop-by-category')}
        className="flex h-full flex-col items-center justify-center text-[#231712]"
      >
        <Grid className="h-4 w-4" />
        <span className="mt-0.5 text-[10px] font-medium leading-none">Categories</span>
      </button>

      <button
        type="button"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onOpenSearch();
        }}
        className="flex h-full flex-col items-center justify-center text-[#231712]"
      >
        <Search className="h-4 w-4" />
        <span className="mt-0.5 text-[10px] font-medium leading-none">Search</span>
      </button>

      <button
        type="button"
        onClick={openCart}
        className="flex h-full flex-col items-center justify-center text-[#231712]"
      >
        <ShoppingBag className="h-4 w-4" />
        <span className="mt-0.5 text-[10px] font-medium leading-none tabular-nums">
          Bag ({cartCount})
        </span>
      </button>
    </nav>
  );
}
