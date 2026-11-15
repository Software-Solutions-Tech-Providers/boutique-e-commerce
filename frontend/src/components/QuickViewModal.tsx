import React, { useEffect, useState } from 'react';
import { ArrowRight, Heart, Minus, Plus, Ruler, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UnitType } from '../types/store';
import { calculateUnitPrice, formatINR } from '../utils/commerce';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    navigate,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [unitType, setUnitType] = useState<UnitType>('piece');
  const [measureQty, setMeasureQty] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors[0]?.name || 'Default');
      setSelectedSize(quickViewProduct.sizes[0] || 'Standard');
      setUnitType(quickViewProduct.unitType);
      setMeasureQty(quickViewProduct.unitType === 'piece' ? 1 : Math.max(2, quickViewProduct.minMeasure));
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);
  const computedPrice = calculateUnitPrice(quickViewProduct.price, measureQty, unitType);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={quickViewProduct.name}
    >
      <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl grid grid-cols-1 md:grid-cols-2 relative">
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[var(--bg-surface)]/95 text-[var(--text-primary)] border border-[var(--border-color)] flex items-center justify-center shadow-sm cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="aspect-[3/4] md:aspect-auto bg-[var(--bg-subtle)]">
          <img
            src={quickViewProduct.modelImage || quickViewProduct.images[0]}
            alt={quickViewProduct.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs text-[var(--text-secondary)]">
              {quickViewProduct.fabricType} · {quickViewProduct.weaveOrigin}
            </p>
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] leading-snug">
              {quickViewProduct.name}
            </h2>
            <div className="flex flex-wrap items-baseline gap-2.5 tabular-nums">
              <span className="text-xl font-semibold text-[var(--text-primary)]">
                {formatINR(computedPrice)}
              </span>
              {quickViewProduct.originalPrice > quickViewProduct.price && (
                <span className="text-sm text-[var(--text-secondary)] opacity-75 line-through">
                  {formatINR(
                    calculateUnitPrice(quickViewProduct.originalPrice, measureQty, unitType)
                  )}
                </span>
              )}
              {quickViewProduct.discountPercent > 0 && (
                <span className="text-xs font-medium text-emerald-600">
                  Save {quickViewProduct.discountPercent}%
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-3">{quickViewProduct.description}</p>

            {/* Colour Selection */}
            {quickViewProduct.colors.length > 0 && (
              <div className="pt-1">
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Shade: <span className="text-[var(--text-primary)]">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-[var(--accent)] scale-110'
                          : 'border-[var(--border-color)]'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Metre / Yard selector if yardage */}
            {quickViewProduct.unitType !== 'piece' ? (
              <div className="pt-1 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--text-secondary)] flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5" /> Fabric Length
                  </span>
                  <div className="flex items-center bg-[var(--bg-subtle)] rounded p-0.5">
                    {(['metre', 'yard'] as UnitType[]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnitType(u)}
                        className={`px-2 py-0.5 rounded text-xs capitalize cursor-pointer ${
                          unitType === u
                            ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-medium'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {u}s
                      </button>
                    ))}
                  </div>
                </div>
                <div className="inline-flex items-center border border-[var(--border-color)] rounded-md">
                  <button
                    type="button"
                    onClick={() =>
                      setMeasureQty((q) => Math.max(quickViewProduct.minMeasure, Number((q - 0.5).toFixed(1))))
                    }
                    className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-medium tabular-nums">
                    {measureQty} {unitType}
                    {measureQty > 1 ? 's' : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setMeasureQty((q) => Math.min(quickViewProduct.maxMeasure, Number((q + 0.5).toFixed(1))))
                    }
                    className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              quickViewProduct.sizes.length > 1 && (
                <div className="pt-1">
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-1.5">Size</p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickViewProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-2.5 py-1 text-xs rounded border cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)]'
                            : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={quickViewProduct.stockCount === 0}
                onClick={() => {
                  addToCart(quickViewProduct, {
                    selectedColor,
                    selectedSize,
                    measureQuantity: measureQty,
                    unitType,
                  });
                  setQuickViewProduct(null);
                }}
                className="flex-1 py-2.5 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white dark:text-[#141416] text-sm font-medium rounded-md transition-colors cursor-pointer min-h-[42px]"
              >
                {quickViewProduct.stockCount === 0 ? 'Out of Stock' : 'Add to Bag'}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className="p-2.5 border border-[var(--border-color)] rounded-md hover:border-[var(--text-primary)] cursor-pointer min-h-[42px]"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-[var(--accent)] text-[var(--accent)]' : ''}`}
                />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                const slug = quickViewProduct.slug;
                setQuickViewProduct(null);
                navigate({ page: 'product', slug });
              }}
              className="w-full py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center gap-1 cursor-pointer"
            >
              View full weave specs &amp; texture zoom <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
