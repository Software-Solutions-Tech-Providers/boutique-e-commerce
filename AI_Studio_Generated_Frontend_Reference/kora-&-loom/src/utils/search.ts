import { Product, ProductCategory } from '../types';

export type SearchScope = 'All' | ProductCategory;

export const SEARCH_SCOPES: ReadonlyArray<{ value: SearchScope; label: string; shortLabel: string }> = [
  { value: 'All', label: 'All Departments', shortLabel: 'All' },
  { value: 'Silk Sarees', label: 'Silk Sarees', shortLabel: 'Silk' },
  { value: 'Cotton Sarees', label: 'Cotton Sarees', shortLabel: 'Cotton' },
  { value: 'Linen Sarees', label: 'Linen Sarees', shortLabel: 'Linen' },
  { value: 'Blouses', label: 'Ready-Made Blouses', shortLabel: 'Blouses' },
  { value: 'Jewellery', label: 'Temple Jewellery', shortLabel: 'Jewellery' },
  { value: 'Saree Care', label: 'Saree Care', shortLabel: 'Care' },
  { value: 'Festive Sets', label: 'Festive Sets', shortLabel: 'Festive' },
];

export const TRENDING_SEARCHES: ReadonlyArray<{ query: string; scope: SearchScope }> = [
  { query: 'Kanchipuram Silk', scope: 'All' },
  { query: 'Banarasi Bridal', scope: 'Silk Sarees' },
  { query: 'Under 1500', scope: 'All' },
  { query: 'Ready-Made Blouse', scope: 'Blouses' },
  { query: 'Temple Jhumka', scope: 'Jewellery' },
];

export interface SearchSuggestion {
  id: string;
  text: string;
  scope: SearchScope;
  hint?: string;
}

export interface ScoredProduct {
  product: Product;
  score: number;
}

/**
 * Computes Damerau/Levenshtein edit distance bounded to max 2 for typo tolerance.
 */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;

  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

/**
 * Parses natural price constraints like "under 1500", "below ₹2,500", or "< 1000"
 * and returns remaining descriptive search tokens.
 */
export function parseSearchQuery(raw: string): {
  cleanedText: string;
  tokens: string[];
  maxPrice?: number;
} {
  let working = raw.trim().toLowerCase();
  let maxPrice: number | undefined;

  const priceMatch = working.match(/(?:under|below|less than|<)\s*(?:rs\.?|inr|₹)?\s*([\d,]+)/i);
  if (priceMatch) {
    const parsed = Number(priceMatch[1].replace(/,/g, ''));
    if (!Number.isNaN(parsed) && parsed > 0) {
      maxPrice = parsed;
      working = working.replace(priceMatch[0], ' ').trim();
    }
  }

  const tokens = working
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 0 && !['for', 'in', 'with', 'and', 'the', 'a'].includes(t));

  return { cleanedText: working, tokens, maxPrice };
}

function tokenMatchesWordList(token: string, words: string[]): 'exact' | 'prefix' | 'substring' | 'fuzzy' | null {
  for (const w of words) {
    if (w === token) return 'exact';
  }
  for (const w of words) {
    if (w.startsWith(token)) return 'prefix';
  }
  for (const w of words) {
    if (token.length >= 3 && w.includes(token)) return 'substring';
  }
  if (token.length >= 4) {
    const allowed = token.length >= 7 ? 2 : 1;
    for (const w of words) {
      if (w.length >= 4 && editDistance(token, w) <= allowed) return 'fuzzy';
    }
  }
  return null;
}

/**
 * Amazon-style weighted relevance retrieval with multi-token matching,
 * exact SKU boost, natural price intent, and 1-2 char typo tolerance.
 */
export function searchProducts(
  products: Product[],
  rawQuery: string,
  scope: SearchScope = 'All'
): ScoredProduct[] {
  const { cleanedText, tokens, maxPrice } = parseSearchQuery(rawQuery);

  const scoped = scope === 'All' ? products : products.filter((p) => p.category === scope);

  if (!cleanedText && maxPrice === undefined) {
    return scoped.map((product) => ({
      product,
      score: product.rating * Math.log10(product.reviewCount + 10),
    }));
  }

  const results: ScoredProduct[] = [];

  for (const product of scoped) {
    if (maxPrice !== undefined && product.price > maxPrice) continue;

    if (tokens.length === 0) {
      results.push({
        product,
        score: 40 + product.rating * Math.log10(product.reviewCount + 10),
      });
      continue;
    }

    const skuLower = product.sku.toLowerCase();
    const nameLower = product.name.toLowerCase();
    const nameWords = nameLower.split(/[\s/&,-]+/).filter(Boolean);
    const metaWords = `${product.category} ${product.weave} ${product.occasion} ${product.tag || ''}`
      .toLowerCase()
      .split(/[\s/&,-]+/)
      .filter(Boolean);
    const bodyWords = `${product.oneLineBenefit} ${product.blouseIncluded} ${product.benefits
      .map((b) => `${b.feature} ${b.benefit}`)
      .join(' ')} ${product.faqs.map((f) => f.question).join(' ')}`
      .toLowerCase()
      .split(/[\s/&,-]+/)
      .filter(Boolean);

    let score = 0;
    let matchedTokens = 0;

    if (skuLower === cleanedText) score += 140;
    else if (skuLower.startsWith(cleanedText)) score += 95;
    else if (skuLower.includes(cleanedText)) score += 70;

    if (cleanedText.length >= 3 && nameLower.includes(cleanedText)) {
      score += 65;
    }

    for (const token of tokens) {
      if (skuLower.includes(token)) {
        score += 50;
        matchedTokens++;
        continue;
      }

      const nameHit = tokenMatchesWordList(token, nameWords);
      const metaHit = tokenMatchesWordList(token, metaWords);
      const bodyHit = tokenMatchesWordList(token, bodyWords);

      if (nameHit === 'exact') score += 45;
      else if (nameHit === 'prefix') score += 34;
      else if (nameHit === 'substring') score += 22;
      else if (nameHit === 'fuzzy') score += 16;

      if (metaHit === 'exact') score += 30;
      else if (metaHit === 'prefix') score += 22;
      else if (metaHit === 'substring') score += 14;
      else if (metaHit === 'fuzzy') score += 10;

      if (bodyHit === 'exact' || bodyHit === 'prefix') score += 10;
      else if (bodyHit === 'substring') score += 6;

      if (nameHit || metaHit || bodyHit) {
        matchedTokens++;
      }
    }

    // Require all tokens to match (or strong SKU/phrase match) for high-precision retrieval
    if (matchedTokens === tokens.length || (tokens.length > 1 && matchedTokens >= tokens.length - 1 && score >= 45)) {
      const popularityBoost = product.rating * Math.log10(product.reviewCount + 10);
      results.push({ product, score: score + popularityBoost });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

/**
 * Generates Amazon-style autocomplete keyword suggestions from catalog weaves,
 * categories, occasions, and product titles.
 */
export function getSearchSuggestions(
  products: Product[],
  rawQuery: string,
  scope: SearchScope = 'All'
): SearchSuggestion[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];

  const pool = new Map<string, SearchSuggestion>();
  const scoped = scope === 'All' ? products : products.filter((p) => p.category === scope);

  const addCandidate = (text: string, candidateScope: SearchScope, hint?: string) => {
    const key = `${text.toLowerCase()}::${candidateScope}`;
    if (!pool.has(key)) {
      pool.set(key, { id: key, text, scope: candidateScope, hint });
    }
  };

  for (const p of scoped) {
    if (p.weave.toLowerCase().includes(q)) {
      addCandidate(p.weave, scope, scope === 'All' ? p.category : undefined);
    }
    if (p.name.toLowerCase().includes(q)) {
      addCandidate(p.name, scope);
    }
    if (p.sku.toLowerCase().includes(q)) {
      addCandidate(p.sku, scope, p.name);
    }
    if (p.occasion.toLowerCase().includes(q)) {
      addCandidate(`${p.occasion} Sarees`, scope);
    }
  }

  // If user is scoped to a specific category and matches exist, offer "All Departments" fallback too
  if (scope !== 'All' && pool.size < 3) {
    addCandidate(rawQuery.trim(), 'All', 'Search in All Departments');
  }

  // Natural price suggestion hints
  if (/^\d{3,4}$/.test(q) || q.startsWith('under') || q.startsWith('below')) {
    const numMatch = q.match(/\d{3,4}/);
    const val = numMatch ? numMatch[0] : '1500';
    addCandidate(`Under ₹${val}`, scope, 'Price filter');
  }

  return Array.from(pool.values()).slice(0, 6);
}

/**
 * Splits text into normal and highlighted segments matching query tokens.
 */
export function splitHighlightSegments(
  text: string,
  rawQuery: string
): Array<{ text: string; match: boolean }> {
  const { tokens } = parseSearchQuery(rawQuery);
  if (tokens.length === 0) return [{ text, match: false }];

  const escaped = tokens
    .filter((t) => t.length >= 2)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (escaped.length === 0) return [{ text, match: false }];

  const splitRegex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const exactRegex = new RegExp(`^(?:${escaped.join('|')})$`, 'i');
  const parts = text.split(splitRegex);
  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      match: exactRegex.test(part),
    }));
}
