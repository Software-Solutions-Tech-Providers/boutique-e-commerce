import React from 'react';
import { Scale, ShoppingBag, Star, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/commerce';

export const CompareModal: React.FC = () => {
  const {
    products,
    compareList,
    compareOpen,
    setCompareOpen,
    toggleCompare,
    clearCompare,
    addToCart,
    navigate,
  } = useStore();

  const comparedProducts = compareList
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (comparedProducts.length === 0) return null;

  return (
    <>
      {/* Compact Compare Trigger Pill-Free Bar */}
      {!compareOpen && (
        <div className="fixed bottom-[72px] md:bottom-4 left-4 z-30 no-print">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg shadow-lg px-3.5 py-2 flex items-center gap-3 text-xs">
            <Scale className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span className="font-medium text-[var(--text-primary)] whitespace-nowrap tabular-nums">
              Compare ({comparedProducts.length}/3)
            </span>
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className="px-2.5 py-1 bg-[var(--accent)] text-white dark:text-[#141416] font-semibold rounded cursor-pointer whitespace-nowrap"
            >
              View Specs
            </button>
            <button
              type="button"
              onClick={clearCompare}
              aria-label="Clear comparison"
              className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Full Side-by-Side Comparison Modal */}
      {compareOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Compare Textiles"
          onClick={() => setCompareOpen(false)}
        >
          <div
            className="bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 sm:px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                  Compare Handloom Weaves
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearCompare}
                  className="text-xs text-[var(--text-secondary)] hover:text-rose-600 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  aria-label="Close comparison"
                  className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto p-5 sm:p-6">
              <table className="w-full min-w-[600px] text-left text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="w-36 py-3 pr-4 align-top text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                      Specification
                    </th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="py-3 px-3 align-top border-l border-[var(--border-color)]">
                        <div className="space-y-2.5">
                          <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-[var(--bg-subtle)]">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => toggleCompare(p.id)}
                              aria-label={`Remove ${p.name} from comparison`}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/65 text-white flex items-center justify-center cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCompareOpen(false);
                              navigate({ page: 'product', slug: p.slug });
                            }}
                            className="font-sans text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] text-left line-clamp-2 cursor-pointer"
                          >
                            {p.name}
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--text-secondary)]">Price</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-3 border-l border-[var(--border-color)] tabular-nums">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {formatINR(p.price)}
                          {p.unitType !== 'piece' && `/${p.unitType}`}
                        </span>
                        {p.originalPrice > p.price && (
                          <span className="ml-2 text-emerald-600 font-medium">
                            {p.discountPercent}% off
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--text-secondary)]">Fabric</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-3 border-l border-[var(--border-color)]">
                        {p.fabricType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--text-secondary)]">Composition</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-3 border-l border-[var(--border-color)]">
                        {p.materialComposition}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--text-secondary)]">Origin</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-3 border-l border-[var(--border-color)]">
                        {p.weaveOrigin}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--text-secondary)]">Occasion</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-3 border-l border-[var(--border-color)]">
                        {p.occasion}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--text-secondary)]">Dimensions</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-3 border-l border-[var(--border-color)]">
                        {p.dimensions}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--text-secondary)]">Rating</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-3 border-l border-[var(--border-color)] tabular-nums">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Star className="w-3.5 h-3.5 fill-[#9A7B3E] text-[#9A7B3E]" />
                          {p.rating.toFixed(1)} ({p.reviewCount})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--text-secondary)]">Availability</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-3 border-l border-[var(--border-color)]">
                        <span
                          className={
                            p.stockCount > 0
                              ? 'text-emerald-600 font-medium'
                              : 'text-rose-600 font-medium'
                          }
                        >
                          {p.stockCount > 0 ? `In Stock (${p.stockCount})` : 'Out of Stock'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4" />
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-3 border-l border-[var(--border-color)]">
                        <button
                          type="button"
                          disabled={p.stockCount === 0}
                          onClick={() => {
                            addToCart(p);
                            setCompareOpen(false);
                          }}
                          className="w-full py-2 px-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white dark:text-[#141416] font-semibold rounded-md inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          {p.stockCount === 0 ? 'Sold Out' : 'Add to Bag'}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
