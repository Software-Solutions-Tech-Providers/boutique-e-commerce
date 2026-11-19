import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

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

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    subscribeBackInStock(productId, variant, contact.trim());
    setContact('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-[#E5E0D8] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#14532D]" />
            <h3 className="font-display text-2xl font-semibold text-[#1C1917]">Back-in-Stock Alert</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close modal" className="p-1.5 text-[#57534E]">
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
            className="w-full rounded-md border border-[#E5E0D8] px-3 py-2.5 text-sm text-[#1C1917] focus:border-[#14532D] focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-[#14532D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0F3F22]"
          >
            Notify Me on Restock
          </button>
        </form>
      </div>
    </div>
  );
}
