import { Order, Product, Review, User } from '../types/store';

export type AnalyticsEventType =
  | 'session_start'
  | 'campaign_click'
  | 'product_view'
  | 'add_to_cart'
  | 'wishlist_add'
  | 'compare_add'
  | 'checkout_start'
  | 'purchase_complete'
  | 'review_submit';

export type VisitorType = 'new' | 'returning';

export type AttributionChannel =
  | 'Direct'
  | 'Instagram'
  | 'Facebook'
  | 'WhatsApp'
  | 'Referral';

export interface AttributionState {
  source: AttributionChannel;
  campaign?: string;
  landingHeadline?: string;
  capturedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  visitorType: VisitorType;
  channel: AttributionChannel;
  campaign?: string;
  productId?: string;
  orderId?: string;
  value?: number;
  timestamp: string;
}

export interface ChannelPerformanceRow {
  channel: AttributionChannel;
  visitors: number;
  addToCart: number;
  orders: number;
  revenue: number;
  conversionRate: number;
}

export interface ConversionMetricsSnapshot {
  totalVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  productViews: number;
  addToCartEvents: number;
  wishlistAdds: number;
  compareAdds: number;
  checkoutStarts: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  addToCartRate: number;
  wishlistRate: number;
  checkoutAbandonmentRate: number;
  overallConversionRate: number;
  repeatPurchaseRate: number;
  returnRefundRate: number;
  averageRating: number;
  totalApprovedReviews: number;
  channelBreakdown: ChannelPerformanceRow[];
}

const ANALYTICS_STORAGE_KEY = 'vastra_atelier_analytics_v1';
const VISITOR_FLAG_KEY = 'vastra_atelier_returning_visitor';

export interface StoredAnalyticsState {
  attribution: AttributionState;
  events: AnalyticsEvent[];
}

export function normalizeSourceToChannel(raw?: string | null): AttributionChannel {
  const clean = (raw || '').trim().toLowerCase();
  if (clean.includes('insta') || clean === 'ig') return 'Instagram';
  if (clean.includes('face') || clean === 'fb') return 'Facebook';
  if (clean.includes('whats') || clean === 'wa') return 'WhatsApp';
  if (clean.includes('ref')) return 'Referral';
  return 'Direct';
}

export function detectVisitorType(): VisitorType {
  try {
    const seen = localStorage.getItem(VISITOR_FLAG_KEY);
    if (seen) return 'returning';
    localStorage.setItem(VISITOR_FLAG_KEY, new Date().toISOString());
    return 'new';
  } catch {
    return 'new';
  }
}

export function getInitialAnalyticsState(): StoredAnalyticsState {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredAnalyticsState;
      if (parsed && Array.isArray(parsed.events) && parsed.attribution) {
        return parsed;
      }
    }
  } catch {
    // Fall back to fresh analytics log
  }

  return {
    attribution: {
      source: 'Direct',
      capturedAt: new Date().toISOString(),
    },
    events: [],
  };
}

export function saveAnalyticsState(data: StoredAnalyticsState): void {
  try {
    localStorage.setItem(
      ANALYTICS_STORAGE_KEY,
      JSON.stringify({
        ...data,
        events: data.events.slice(-400),
      })
    );
  } catch {
    // Ignore quota errors
  }
}

export function parseAttributionFromSearch(search: string): AttributionState | null {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const utmSource = params.get('utm_source') || params.get('source');
  const utmCampaign = params.get('utm_campaign') || params.get('campaign');
  if (!utmSource && !utmCampaign) return null;

  return {
    source: normalizeSourceToChannel(utmSource),
    campaign: utmCampaign || undefined,
    capturedAt: new Date().toISOString(),
  };
}

export function computeConversionMetrics(
  events: AnalyticsEvent[],
  orders: Order[],
  _products: Product[],
  reviews: Review[],
  _users: User[]
): ConversionMetricsSnapshot {
  const sessionEvents = events.filter((e) => e.type === 'session_start');
  const newVisitors = sessionEvents.filter((e) => e.visitorType === 'new').length;
  const returningVisitors = sessionEvents.filter((e) => e.visitorType === 'returning').length;
  const totalVisitors = Math.max(1, sessionEvents.length);

  const productViews = events.filter((e) => e.type === 'product_view').length;
  const addToCartEvents = events.filter((e) => e.type === 'add_to_cart').length;
  const wishlistAdds = events.filter((e) => e.type === 'wishlist_add').length;
  const compareAdds = events.filter((e) => e.type === 'compare_add').length;
  const checkoutStarts = events.filter((e) => e.type === 'checkout_start').length;
  const trackedPurchases = events.filter((e) => e.type === 'purchase_complete').length;

  const validOrders = orders.filter((o) => o.orderStatus !== 'Cancelled');
  const completedOrders = Math.max(validOrders.length, trackedPurchases);
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const averageOrderValue =
    validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  const viewDenominator = Math.max(productViews, 1);
  const addToCartRate =
    productViews > 0 ? Number(((addToCartEvents / viewDenominator) * 100).toFixed(1)) : 0;
  const wishlistRate =
    productViews > 0 ? Number(((wishlistAdds / viewDenominator) * 100).toFixed(1)) : 0;

  const checkoutAbandonmentRate =
    checkoutStarts > 0
      ? Number(
          (
            (Math.max(0, checkoutStarts - trackedPurchases) / checkoutStarts) *
            100
          ).toFixed(1)
        )
      : 0;

  const overallConversionRate = Number(
    ((trackedPurchases / Math.max(totalVisitors, 1)) * 100).toFixed(1)
  );

  // Repeat purchase rate calculated strictly from genuine customer emails/IDs in orders
  const ordersByCustomer = new Map<string, number>();
  for (const ord of validOrders) {
    const key = ord.userId || ord.customerEmail.toLowerCase();
    ordersByCustomer.set(key, (ordersByCustomer.get(key) || 0) + 1);
  }
  const uniqueCustomers = ordersByCustomer.size;
  const repeatCustomers = Array.from(ordersByCustomer.values()).filter((c) => c > 1).length;
  const repeatPurchaseRate =
    uniqueCustomers > 0 ? Number(((repeatCustomers / uniqueCustomers) * 100).toFixed(1)) : 0;

  const returnedOrRefunded = orders.filter(
    (o) => o.orderStatus === 'Return Requested' || o.orderStatus === 'Refunded'
  ).length;
  const returnRefundRate =
    orders.length > 0 ? Number(((returnedOrRefunded / orders.length) * 100).toFixed(1)) : 0;

  const approvedReviews = reviews.filter((r) => r.approved);
  const averageRating =
    approvedReviews.length > 0
      ? Number(
          (
            approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
          ).toFixed(1)
        )
      : 0;

  const channels: AttributionChannel[] = [
    'Instagram',
    'Facebook',
    'WhatsApp',
    'Referral',
    'Direct',
  ];

  const channelBreakdown: ChannelPerformanceRow[] = channels.map((channel) => {
    const visitors = sessionEvents.filter((e) => e.channel === channel).length;
    const addToCart = events.filter(
      (e) => e.channel === channel && e.type === 'add_to_cart'
    ).length;
    const channelOrders = orders.filter(
      (o) => (o.attribution?.source || 'Direct') === channel && o.orderStatus !== 'Cancelled'
    );
    const revenue = channelOrders.reduce((s, o) => s + o.totalAmount, 0);
    const ordCount = channelOrders.length;
    const conversionRate =
      visitors > 0 ? Number(((ordCount / visitors) * 100).toFixed(1)) : 0;

    return {
      channel,
      visitors,
      addToCart,
      orders: ordCount,
      revenue,
      conversionRate,
    };
  });

  return {
    totalVisitors: sessionEvents.length,
    newVisitors,
    returningVisitors,
    productViews,
    addToCartEvents,
    wishlistAdds,
    compareAdds,
    checkoutStarts,
    completedOrders,
    totalRevenue,
    averageOrderValue,
    addToCartRate,
    wishlistRate,
    checkoutAbandonmentRate,
    overallConversionRate,
    repeatPurchaseRate,
    returnRefundRate,
    averageRating,
    totalApprovedReviews: approvedReviews.length,
    channelBreakdown,
  };
}
