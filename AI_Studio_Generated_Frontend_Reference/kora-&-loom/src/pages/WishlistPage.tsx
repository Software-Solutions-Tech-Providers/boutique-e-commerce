import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';

export function WishlistPage() {
  const { wishlistIds } = useStore();
  const savedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-8">
      <div className="border-b border-[#E5E0D8] pb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#14532D]">Saved Shortlist</p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-[#1C1917]">
          Your Boutique Wishlist ({savedProducts.length})
        </h1>
      </div>

      {savedProducts.length === 0 ? (
        <div className="rounded-xl border border-[#E5E0D8] bg-white p-12 text-center space-y-4">
          <Heart className="h-8 w-8 mx-auto text-[#57534E]" />
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">No saved weaves yet</h2>
          <p className="text-sm text-[#57534E]">
            Tap the heart icon on any saree, blouse, or temple jhumka to compare shades later.
          </p>
          <Link
            to="/collections"
            className="inline-block rounded-md bg-[#14532D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0F3F22]"
          >
            Browse Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} showRemoveFromWishlist />
          ))}
        </div>
      )}
    </div>
  );
}
