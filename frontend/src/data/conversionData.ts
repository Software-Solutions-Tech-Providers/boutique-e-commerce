export interface AudienceSegment {
  id:
    | 'daily-wear'
    | 'designer-boutique'
    | 'festive-traditional'
    | 'wedding-bridal'
    | 'pure-fabric-yardage'
    | 'budget-gifting'
    | 'new-collections';
  label: string;
  shortLabel: string;
  customerIntent: string;
  filterPreset: {
    category?: string;
    occasion?: string;
    maxPrice?: number;
    filter?: 'new' | 'bestseller' | 'limited' | 'festive';
    unitType?: 'piece' | 'yardage';
  };
}

export const AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    id: 'daily-wear',
    label: 'Daily-Wear Cottons',
    shortLabel: 'Daily Wear',
    customerIntent: 'Breathable handloom comfort for work & everyday elegance',
    filterPreset: {
      occasion: 'Everyday',
      maxPrice: 9000,
    },
  },
  {
    id: 'budget-gifting',
    label: 'Under ₹5,000 · Gifting',
    shortLabel: 'Under ₹5,000',
    customerIntent: 'Accessible heirloom quality & thoughtful celebratory gifts',
    filterPreset: {
      maxPrice: 5000,
    },
  },
  {
    id: 'festive-traditional',
    label: 'Festive & Traditional',
    shortLabel: 'Festive',
    customerIntent: 'Pure zari & luminous heritage weaves for pujas & gatherings',
    filterPreset: {
      occasion: 'Festive',
    },
  },
  {
    id: 'wedding-bridal',
    label: 'Wedding & Bridal',
    shortLabel: 'Bridal Trousseau',
    customerIntent: 'Master-weaver Kanjeevaram & Banarasi bridal heirlooms',
    filterPreset: {
      occasion: 'Bridal',
    },
  },
  {
    id: 'designer-boutique',
    label: 'Designer & Limited Editions',
    shortLabel: 'Boutique Editions',
    customerIntent: 'Small-batch artisanal designs crafted in numbered loom runs',
    filterPreset: {
      filter: 'limited',
    },
  },
  {
    id: 'pure-fabric-yardage',
    label: 'Pure Yardage by Metre',
    shortLabel: 'Custom Yardage',
    customerIntent: 'Unstitched natural fabrics measured precisely for tailoring',
    filterPreset: {
      unitType: 'yardage',
    },
  },
  {
    id: 'new-collections',
    label: 'Latest Loom Arrivals',
    shortLabel: 'New Arrivals',
    customerIntent: 'Freshly finished weaves for returning collectors',
    filterPreset: {
      filter: 'new',
    },
  },
];

export interface FabricQualityPromise {
  weaveExpectation: string;
  colorAccuracyNote: string;
  packagingStandard: string;
  returnPolicyNote: string;
}

export function getFabricQualityPromise(fabricType: string): FabricQualityPromise {
  const lower = fabricType.toLowerCase();

  if (lower.includes('silk') || lower.includes('katan') || lower.includes('kanjeevaram')) {
    return {
      weaveExpectation:
        'Handwoven pure mulberry silk with natural slubs and authentic zari selvedge—slight irregularity is the hallmark of genuine pit-loom weaving.',
      colorAccuracyNote:
        'Photographed in calibrated natural north-daylight so zari lustre and dye depth match what arrives in your parcel.',
      packagingStandard:
        'Steamed, acid-free tissue folded, and packed inside a reusable breathable unbleached cotton muslin bag.',
      returnPolicyNote:
        '7-day easy return or exchange on unwashed pieces with intact Silk Mark & atelier tags.',
    };
  }

  if (lower.includes('cotton') || lower.includes('linen') || lower.includes('khadi')) {
    return {
      weaveExpectation:
        'Spun from long-staple natural fibres that soften noticeably after the first cold wash while holding crisp architectural drape.',
      colorAccuracyNote:
        'Macro weave photos show true yarn density (thread-count) under neutral studio daylight without colour filters.',
      packagingStandard:
        'Pre-inspected for uniform selvedge & cut accurately to your selected metre/yard requirement with cotton protective wrap.',
      returnPolicyNote:
        '7-day return window on unwashed sarees & uncut full-piece orders; full support via WhatsApp for any measurement concern.',
    };
  }

  return {
    weaveExpectation:
      'Hand-finished boutique textile inspected under 3-point weave & embroidery quality checks prior to dispatch.',
    colorAccuracyNote:
      'High-resolution daylight photography plus close-up macro view ensure zero surprise between screen and physical drape.',
    packagingStandard:
      'Sealed in moisture-safe recyclable outer wrap with breathable cotton storage pouch.',
    returnPolicyNote:
      'Transparent 7-day unwashed return & instant store-credit or original-method Razorpay refund.',
  };
}

export interface CampaignLandingPreset {
  id: string;
  source: 'Instagram' | 'Facebook' | 'WhatsApp';
  campaignName: string;
  headline: string;
  subline: string;
  category: string;
  audience?: AudienceSegment['id'];
}

export const SOCIAL_CAMPAIGN_PRESETS: CampaignLandingPreset[] = [
  {
    id: 'ig-bridal-reel',
    source: 'Instagram',
    campaignName: 'ig_bridal_drape_2026',
    headline: 'From Instagram Reel: Handloom Bridal Trousseau',
    subline: 'Curated Kanjeevaram & Banarasi Katan pieces featured in our studio drape reel.',
    category: 'cat-bridal',
    audience: 'wedding-bridal',
  },
  {
    id: 'fb-festive-edit',
    source: 'Facebook',
    campaignName: 'fb_festive_silk_guide',
    headline: 'Festive Silk & Gifting Edit',
    subline: 'Transparent weaver-direct pricing with Silk Mark certification and insured dispatch.',
    category: 'cat-festive',
    audience: 'festive-traditional',
  },
  {
    id: 'wa-vip-restock',
    source: 'WhatsApp',
    campaignName: 'wa_patron_early_access',
    headline: 'WhatsApp Patron Early Access',
    subline: 'First look at newly completed loom batches & custom yardage releases.',
    category: 'all',
    audience: 'new-collections',
  },
];
