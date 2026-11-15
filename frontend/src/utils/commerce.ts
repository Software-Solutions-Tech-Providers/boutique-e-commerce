import { Product, UnitType } from '../types/store';

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

export const calculateUnitPrice = (
  basePricePerMetreOrPiece: number,
  measureQuantity: number,
  unitType: UnitType
): number => {
  if (unitType === 'piece') return basePricePerMetreOrPiece;
  const factor = unitType === 'yard' ? 0.9144 : 1;
  return Math.round(basePricePerMetreOrPiece * measureQuantity * factor);
};

export interface PincodeEstimate {
  valid: boolean;
  serviceable: boolean;
  cityHint: string;
  estimatedDays: string;
  codAvailable: boolean;
  expressAvailable: boolean;
  message: string;
}

const METRO_PREFIXES: Record<string, string> = {
  '11': 'Delhi NCR',
  '40': 'Mumbai Metropolitan',
  '56': 'Bengaluru',
  '60': 'Chennai',
  '70': 'Kolkata',
  '50': 'Hyderabad',
  '41': 'Pune',
  '38': 'Ahmedabad',
  '30': 'Jaipur',
  '22': 'Lucknow / Varanasi',
  '68': 'Kochi',
  '64': 'Coimbatore',
};

export const checkPincodeServiceability = (pincode: string): PincodeEstimate => {
  const clean = pincode.trim();
  if (!/^[1-9][0-9]{5}$/.test(clean)) {
    return {
      valid: false,
      serviceable: false,
      cityHint: '',
      estimatedDays: '',
      codAvailable: false,
      expressAvailable: false,
      message: 'Please enter a valid 6-digit Indian PIN code.',
    };
  }

  const prefix2 = clean.slice(0, 2);
  const city = METRO_PREFIXES[prefix2];
  if (city) {
    return {
      valid: true,
      serviceable: true,
      cityHint: city,
      estimatedDays: '2–3 business days',
      codAvailable: true,
      expressAvailable: true,
      message: `Insured atelier delivery to ${city} in 2–3 business days. Cash on Delivery available.`,
    };
  }

  return {
    valid: true,
    serviceable: true,
    cityHint: 'Standard Domestic Zone',
    estimatedDays: '4–6 business days',
    codAvailable: Number(clean[0]) <= 7,
    expressAvailable: false,
    message:
      Number(clean[0]) <= 7
        ? 'Standard insured courier delivery in 4–6 business days. Cash on Delivery available.'
        : 'Standard insured courier delivery in 5–7 business days. Prepaid Razorpay orders only for this zone.',
  };
};

export const buildWhatsAppEnquiryUrl = (
  product: Product,
  selectedColor: string,
  measureLabel: string
): string => {
  const text = `Hello Vastra Atelier, I would like to enquire about "${product.name}" (SKU: ${product.sku}) in ${selectedColor}${
    measureLabel ? ` (${measureLabel})` : ''
  }. Priced at ${formatINR(product.price)}.`;
  return `https://wa.me/919820011223?text=${encodeURIComponent(text)}`;
};

export const trackStoreEvent = (eventName: string, payload: Record<string, unknown> = {}) => {
  // Integrates cleanly with GA4 gtag / Meta Pixel fbq when configured in production
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  if (typeof w.gtag === 'function') {
    w.gtag('event', eventName, payload);
  }
  if (typeof w.fbq === 'function') {
    w.fbq('trackCustom', eventName, payload);
  }
};
