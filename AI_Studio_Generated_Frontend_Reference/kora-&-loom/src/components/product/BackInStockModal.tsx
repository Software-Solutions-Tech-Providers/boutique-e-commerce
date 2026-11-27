import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductModalShell } from './ProductModalShell';

interface BackInStockModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  variant: string;
}

export function BackInStockModal({ open, onClose, productId, productName, variant }: BackInStockModalProps) {
  const { subscribeBackInStock } = useStore();
  const [contact, setContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    subscribeBackInStock(productId, variant, contact.trim());
    setContact('');
    onClose();
  };

  return (
    <ProductModalShell
      open={open}
      onClose={onClose}
      ariaLabel="Back-in-Stock Alert"
      maxWidthClass="max-w-md"
      backdropClassName="bg-black/50"
      panelClassName="bg-white p-4 sm:p-6"
    >
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E5E0D8]">
        <div className="flex items-center gap-2 min-w-0">
          <Bell className="h-4 w-4 text-[#14532D] shrink-0" />
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1C1917] truncate">
            Back-in-Stock Alert
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="p-1.5 text-[#57534E] hover:text-[#1C1917] shrink-0 touch-manipulation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-3 text-sm text-[#57534E]">
        Our next weaver batch of <strong className="text-[#1C1917]">{productName}</strong> ({variant}) finishes soon. Leave your WhatsApp number or email for priority dispatch notice.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="WhatsApp number or email address"
          className="w-full rounded-md border border-[#E5E0D8] px-3 py-2.5 text-base sm:text-sm text-[#1C1917] focus:border-[#14532D] focus:outline-none"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-[#14532D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0F3F22] touch-manipulation"
        >
          Notify Me on Restock
        </button>
      </form>
    </ProductModalShell>
  );
}
