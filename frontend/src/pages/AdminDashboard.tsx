import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Download,
  FolderKanban,
  Image as ImageIcon,
  MessageSquare,
  Package,
  Plus,
  Send,
  ShieldAlert,
  Tag,
  Trash2,
  Users,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SOCIAL_CAMPAIGN_PRESETS } from '../data/conversionData';
import { IMG_HERO_SILK } from '../data/seedCatalog';
import { OrderStatus, Product, UnitType } from '../types/store';
import { formatINR } from '../utils/commerce';

type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'banners'
  | 'reviews'
  | 'marketing';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    products,
    categories,
    orders,
    users,
    coupons,
    banners,
    reviews,
    campaigns,
    newsletterSubscribers,
    conversionMetrics,
    analyticsEvents,
    attribution,
    applyCampaignAttribution,
    navigate,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    updateOrderStatus,
    refundOrder,
    saveCoupon,
    toggleCouponActive,
    updateBanner,
    toggleReviewApproval,
    sendCampaign,
    switchDemoRole,
  } = useStore();

  const [tab, setTab] = useState<AdminTab>('overview');

  // Product Form State
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [pName, setPName] = useState('');
  const [pSku, setPSku] = useState('');
  const [pCategoryId, setPCategoryId] = useState(categories[0]?.id || 'cat-sarees');
  const [pFabric, setPFabric] = useState('Pure Silk');
  const [pOrigin, setPOrigin] = useState('Varanasi, Uttar Pradesh');
  const [pPrice, setPPrice] = useState(12500);
  const [pOriginal, setPOriginal] = useState(15000);
  const [pStock, setPStock] = useState(8);
  const [pUnit, setPUnit] = useState<UnitType>('piece');
  const [pImage, setPImage] = useState(IMG_HERO_SILK);
  const [pVideo, setPVideo] = useState('');
  const [pNew, setPNew] = useState(true);
  const [pBest, setPBest] = useState(false);
  const [pLimited, setPLimited] = useState(false);

  // Category Form State
  const [cName, setCName] = useState('');
  const [cGroup, setCGroup] = useState('Sarees');
  const [cDesc, setCDesc] = useState('');

  // Coupon Form State
  const [cpCode, setCpCode] = useState('');
  const [cpDesc, setCpDesc] = useState('');
  const [cpType, setCpType] = useState<'percent' | 'flat'>('percent');
  const [cpVal, setCpVal] = useState(10);
  const [cpMin, setCpMin] = useState(3000);

  // Marketing Campaign State
  const [campTitle, setCampTitle] = useState('Festive Loom Archive Preview');
  const [campChannel, setCampChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [campSegment, setCampSegment] = useState('WhatsApp Opt-In Patrons');
  const [campMessage, setCampMessage] = useState(
    'New handwoven Banarasi & Kanjivaram weaves have arrived at Vastra Atelier. Enjoy 10% off with ATELIER10.'
  );

  const isAdmin = currentUser?.role === 'admin';
  const isStaff = currentUser?.role === 'staff';

  const revenueStats = useMemo(() => {
    const validOrders = orders.filter((o) => o.orderStatus !== 'Cancelled');
    const totalRevenue = validOrders.reduce((s, o) => s + o.totalAmount, 0);
    const lowStock = products.filter((p) => p.stockCount <= 3);
    const customerCount = users.filter((u) => u.role === 'customer').length;
    return {
      totalRevenue,
      totalOrders: orders.length,
      lowStockCount: lowStock.length,
      customerCount,
    };
  }, [orders, products, users]);

  const categoryRevenue = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((ord) => {
      ord.items.forEach((it) => {
        const prod = products.find((p) => p.id === it.productId);
        const cat = categories.find((c) => c.id === prod?.categoryId)?.name || 'Other';
        map.set(cat, (map.get(cat) || 0) + it.lineTotal);
      });
    });
    const entries = Array.from(map.entries()).slice(0, 5);
    const maxVal = Math.max(1, ...entries.map(([, v]) => v));
    return entries.map(([name, value]) => ({
      name,
      value,
      pct: Math.round((value / maxVal) * 100),
    }));
  }, [orders, products, categories]);

  if (!currentUser || (!isAdmin && !isStaff)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)]">
          Atelier Admin Access Required
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          This portal enforces Role-Based Access Control (Admin &amp; Merchandising Staff). Switch
          to an Admin or Staff role to inspect analytics and operations.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => switchDemoRole('admin')}
            className="px-5 py-2.5 bg-[var(--text-primary)] text-[var(--bg-surface)] text-xs font-semibold rounded-md cursor-pointer"
          >
            Sign In as Atelier Admin
          </button>
          <button
            type="button"
            onClick={() => switchDemoRole('staff')}
            className="px-5 py-2.5 border border-[var(--border-color)] text-xs font-semibold rounded-md cursor-pointer"
          >
            Sign In as Staff
          </button>
          <button
            type="button"
            onClick={() => navigate({ page: 'home' })}
            className="px-4 py-2.5 text-xs text-[var(--text-secondary)] cursor-pointer"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  const exportCsv = (type: 'sales' | 'inventory') => {
    const rows =
      type === 'sales'
        ? [
            ['OrderNumber', 'Date', 'Customer', 'Status', 'Payment', 'TotalINR'],
            ...orders.map((o) => [
              o.orderNumber,
              o.createdAt,
              o.customerName,
              o.orderStatus,
              o.paymentStatus,
              String(o.totalAmount),
            ]),
          ]
        : [
            ['SKU', 'Name', 'Fabric', 'PriceINR', 'Stock', 'UnitType'],
            ...products.map((p) => [
              p.sku,
              `"${p.name}"`,
              p.fabricType,
              String(p.price),
              String(p.stockCount),
              p.unitType,
            ]),
          ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VastraAtelier-${type}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setPImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = pName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const discount =
      pOriginal > pPrice ? Math.round(((pOriginal - pPrice) / pOriginal) * 100) : 0;

    const payload: Product = editingProd
      ? {
          ...editingProd,
          name: pName,
          sku: pSku,
          categoryId: pCategoryId,
          fabricType: pFabric,
          weaveOrigin: pOrigin,
          price: pPrice,
          originalPrice: pOriginal,
          discountPercent: discount,
          stockCount: pStock,
          unitType: pUnit,
          images: [pImage, ...editingProd.images.slice(1)],
          videoUrl: pVideo || undefined,
          isNewArrival: pNew,
          isBestSeller: pBest,
          isLimitedEdition: pLimited,
        }
      : {
          id: `prod-${Date.now()}`,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          sku: pSku || `VA-${Math.floor(100 + Math.random() * 899)}`,
          name: pName,
          subtitle: `${pFabric} · Atelier Curated`,
          categoryId: pCategoryId,
          subcategory: pFabric,
          description: `Artisanal ${pFabric} piece crafted in ${pOrigin}.`,
          fabricType: pFabric,
          materialComposition: `100% ${pFabric}`,
          weaveOrigin: pOrigin,
          careInstructions: 'Dry clean recommended. Store wrapped in unbleached muslin.',
          dimensions: pUnit === 'piece' ? 'Standard Boutique Cut' : 'Width 44–58 inches · Cut to order',
          price: pPrice,
          originalPrice: pOriginal,
          discountPercent: discount,
          stockCount: pStock,
          unitType: pUnit,
          minMeasure: 1,
          maxMeasure: pUnit === 'piece' ? 1 : 12,
          colors: [{ name: 'Signature Loom', hex: '#1E2B4F', image: pImage }],
          sizes: [pUnit === 'piece' ? 'Free Size' : 'Width Cut'],
          occasion: 'Festive',
          images: [pImage],
          videoUrl: pVideo || undefined,
          isNewArrival: pNew,
          isBestSeller: pBest,
          isLimitedEdition: pLimited,
          rating: 5.0,
          reviewCount: 0,
          backInStockSubscribers: [],
          createdAt: new Date().toISOString(),
        };

    saveProduct(payload);
    setEditingProd(null);
    setPName('');
    setPSku('');
  };

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
    { id: 'overview', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'products', label: 'Products & Inventory', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderKanban, adminOnly: true },
    { id: 'orders', label: 'Orders & Refunds', icon: Tag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons & Offers', icon: Tag, adminOnly: true },
    { id: 'banners', label: 'Homepage Banners', icon: ImageIcon, adminOnly: true },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'marketing', label: 'WhatsApp Campaigns', icon: Send, adminOnly: true },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--accent-gold)] font-semibold">
            Role: {currentUser.role.toUpperCase()} · RBAC Enforced
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-0.5">
            Vastra Atelier Operations Console
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => exportCsv('sales')}
            className="px-3.5 py-2 border border-[var(--border-color)] rounded-md inline-flex items-center gap-1.5 hover:border-[var(--text-primary)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Sales CSV
          </button>
          <button
            type="button"
            onClick={() => exportCsv('inventory')}
            className="px-3.5 py-2 border border-[var(--border-color)] rounded-md inline-flex items-center gap-1.5 hover:border-[var(--text-primary)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Inventory CSV
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <aside className="lg:col-span-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-2 sm:p-3 flex lg:flex-col gap-1.5 overflow-x-auto max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const locked = item.adminOnly && !isAdmin;
            return (
              <button
                key={item.id}
                type="button"
                disabled={locked}
                onClick={() => setTab(item.id)}
                className={`w-auto lg:w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  locked ? 'opacity-45 cursor-not-allowed' : ''
                } ${
                  tab === item.id
                    ? 'bg-[var(--accent)] text-white dark:text-[#141416]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </span>
                {locked && <span className="text-[10px]">Admin</span>}
              </button>
            );
          })}
        </aside>

        <div className="lg:col-span-9 min-w-0 space-y-6">
          {/* OVERVIEW & ANALYTICS */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Gross Revenue', value: formatINR(revenueStats.totalRevenue) },
                  { label: 'Average Order Value (AOV)', value: formatINR(conversionMetrics.averageOrderValue) },
                  { label: 'Total Orders', value: String(revenueStats.totalOrders) },
                  { label: 'Low Stock SKUs (≤3)', value: String(revenueStats.lowStockCount) },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5"
                  >
                    <p className="text-xs text-[var(--text-secondary)]">{kpi.label}</p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1 tabular-nums">
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Customer Psychology & Funnel Conversion Metrics (Live Telemetry + Orders) */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                      Customer Buying Funnel &amp; Retention Metrics
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Computed strictly from {analyticsEvents.length} recorded session events, verified orders, and approved reviews.
                    </p>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] tabular-nums">
                    Active Source: <strong className="text-[var(--text-primary)]">{attribution.source}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs tabular-nums">
                  {[
                    {
                      label: 'Sessions (New / Returning)',
                      value: `${conversionMetrics.totalVisitors}`,
                      sub: `${conversionMetrics.newVisitors} new · ${conversionMetrics.returningVisitors} returning`,
                    },
                    {
                      label: 'Product Views → Bag Rate',
                      value: `${conversionMetrics.addToCartRate}%`,
                      sub: `${conversionMetrics.addToCartEvents} adds / ${conversionMetrics.productViews} views`,
                    },
                    {
                      label: 'Wishlist Engagement',
                      value: `${conversionMetrics.wishlistRate}%`,
                      sub: `${conversionMetrics.wishlistAdds} saved · ${conversionMetrics.compareAdds} compared`,
                    },
                    {
                      label: 'Checkout Abandonment',
                      value: `${conversionMetrics.checkoutAbandonmentRate}%`,
                      sub: `${conversionMetrics.checkoutStarts} started checkout`,
                    },
                    {
                      label: 'Purchase Conversion',
                      value: `${conversionMetrics.overallConversionRate}%`,
                      sub: `${conversionMetrics.completedOrders} completed orders`,
                    },
                    {
                      label: 'Repeat Purchase Rate',
                      value: `${conversionMetrics.repeatPurchaseRate}%`,
                      sub: `${revenueStats.customerCount} registered patrons`,
                    },
                    {
                      label: 'Return & Refund Rate',
                      value: `${conversionMetrics.returnRefundRate}%`,
                      sub: 'Lower indicates accurate expectation setting',
                    },
                    {
                      label: 'Verified Rating Avg',
                      value: `${conversionMetrics.averageRating} ★`,
                      sub: `${conversionMetrics.totalApprovedReviews} approved reviews`,
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1"
                    >
                      <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{m.label}</p>
                      <p className="text-lg font-semibold text-[var(--text-primary)]">{m.value}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-tight">{m.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Attribution Breakdown (Followers-to-Customers) */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 space-y-4 overflow-x-auto">
                <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                  Social &amp; Direct Channel Attribution
                </h2>
                <table className="w-full min-w-[540px] text-left text-xs tabular-nums">
                  <thead className="border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                    <tr>
                      <th className="py-2 pr-4">Acquisition Channel</th>
                      <th className="py-2 px-3">Sessions</th>
                      <th className="py-2 px-3">Add to Bag</th>
                      <th className="py-2 px-3">Orders</th>
                      <th className="py-2 px-3">Conversion</th>
                      <th className="py-2 pl-3 text-right">Attributed Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {conversionMetrics.channelBreakdown.map((row) => (
                      <tr key={row.channel}>
                        <td className="py-2.5 pr-4 font-semibold text-[var(--text-primary)]">{row.channel}</td>
                        <td className="py-2.5 px-3">{row.visitors}</td>
                        <td className="py-2.5 px-3">{row.addToCart}</td>
                        <td className="py-2.5 px-3">{row.orders}</td>
                        <td className="py-2.5 px-3">{row.conversionRate}%</td>
                        <td className="py-2.5 pl-3 text-right font-semibold">{formatINR(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 space-y-4">
                <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                  Revenue by Textile Category
                </h2>
                <div className="space-y-3">
                  {categoryRevenue.map((row) => (
                    <div key={row.name} className="space-y-1 text-xs">
                      <div className="flex justify-between gap-2">
                        <span className="font-medium text-[var(--text-primary)]">{row.name}</span>
                        <span className="tabular-nums font-semibold">{formatINR(row.value)}</span>
                      </div>
                      <div className="h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--accent)] rounded-full"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS & INVENTORY */}
          {tab === 'products' && (
            <div className="space-y-6">
              {isAdmin && (
                <form
                  onSubmit={handleSaveProduct}
                  className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 space-y-4 text-xs"
                >
                  <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                    {editingProd ? `Edit: ${editingProd.name}` : 'Add New Textile Product'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      placeholder="Product Name"
                      className="sm:col-span-2 px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                    />
                    <input
                      type="text"
                      value={pSku}
                      onChange={(e) => setPSku(e.target.value)}
                      placeholder="SKU (e.g. VA-SLK-88)"
                      className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded uppercase"
                    />
                    <select
                      value={pCategoryId}
                      onChange={(e) => setPCategoryId(e.target.value)}
                      className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={pFabric}
                      onChange={(e) => setPFabric(e.target.value)}
                      placeholder="Fabric Type"
                      className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                    />
                    <input
                      type="text"
                      value={pOrigin}
                      onChange={(e) => setPOrigin(e.target.value)}
                      placeholder="Weaving Origin"
                      className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                    />
                    <input
                      type="number"
                      required
                      value={pPrice}
                      onChange={(e) => setPPrice(Number(e.target.value))}
                      placeholder="Selling Price ₹"
                      className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded tabular-nums"
                    />
                    <input
                      type="number"
                      required
                      value={pOriginal}
                      onChange={(e) => setPOriginal(Number(e.target.value))}
                      placeholder="MRP ₹"
                      className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded tabular-nums"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        value={pStock}
                        onChange={(e) => setPStock(Number(e.target.value))}
                        placeholder="Stock"
                        className="w-24 px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded tabular-nums"
                      />
                      <select
                        value={pUnit}
                        onChange={(e) => setPUnit(e.target.value as UnitType)}
                        className="min-w-0 flex-1 px-2 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                      >
                        <option value="piece">Per Piece</option>
                        <option value="metre">Per Metre</option>
                        <option value="yard">Per Yard</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pImage}
                        onChange={(e) => setPImage(e.target.value)}
                        placeholder="Image URL"
                        className="min-w-0 flex-1 px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                      />
                      <label className="px-3 py-2 border border-[var(--border-color)] rounded cursor-pointer hover:bg-[var(--bg-subtle)] whitespace-nowrap shrink-0">
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={pVideo}
                      onChange={(e) => setPVideo(e.target.value)}
                      placeholder="Optional Drape Video URL (.mp4)"
                      className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pNew}
                        onChange={(e) => setPNew(e.target.checked)}
                      />
                      New Arrival
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pBest}
                        onChange={(e) => setPBest(e.target.checked)}
                      />
                      Best Seller
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pLimited}
                        onChange={(e) => setPLimited(e.target.checked)}
                      />
                      Limited Edition
                    </label>
                    <button
                      type="submit"
                      className="ml-auto px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] font-semibold rounded cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {editingProd ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Waitlist</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)] tabular-nums">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 px-4 font-medium text-[var(--text-primary)] max-w-[240px] truncate">
                          {p.name}
                        </td>
                        <td className="py-3 px-4 text-[var(--text-secondary)]">{p.sku}</td>
                        <td className="py-3 px-4 font-semibold">{formatINR(p.price)}</td>
                        <td className="py-3 px-4">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                saveProduct({ ...p, stockCount: Math.max(0, p.stockCount - 1) })
                              }
                              className="px-2 py-0.5 border border-[var(--border-color)] rounded cursor-pointer"
                            >
                              -
                            </button>
                            <span
                              className={`w-7 text-center font-semibold ${
                                p.stockCount <= 2 ? 'text-rose-600' : ''
                              }`}
                            >
                              {p.stockCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => saveProduct({ ...p, stockCount: p.stockCount + 1 })}
                              className="px-2 py-0.5 border border-[var(--border-color)] rounded cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[var(--text-secondary)]">
                          {p.backInStockSubscribers.length}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          {isAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProd(p);
                                  setPName(p.name);
                                  setPSku(p.sku);
                                  setPCategoryId(p.categoryId);
                                  setPFabric(p.fabricType);
                                  setPOrigin(p.weaveOrigin);
                                  setPPrice(p.price);
                                  setPOriginal(p.originalPrice);
                                  setPStock(p.stockCount);
                                  setPUnit(p.unitType);
                                  setPImage(p.images[0] || IMG_HERO_SILK);
                                  setPVideo(p.videoUrl || '');
                                  setPNew(p.isNewArrival);
                                  setPBest(p.isBestSeller);
                                  setPLimited(p.isLimitedEdition);
                                }}
                                className="text-[var(--accent)] hover:underline cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteProduct(p.id)}
                                className="text-rose-600 hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORIES */}
          {tab === 'categories' && isAdmin && (
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!cName.trim()) return;
                  saveCategory({
                    id: `cat-${Date.now()}`,
                    slug: cName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    name: cName.trim(),
                    parentGroup: cGroup,
                    description: cDesc.trim() || 'Curated boutique category.',
                    image: IMG_HERO_SILK,
                    featured: true,
                    sortOrder: categories.length + 1,
                  });
                  setCName('');
                  setCDesc('');
                }}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
              >
                <input
                  type="text"
                  required
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="New Category Name"
                  className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                />
                <input
                  type="text"
                  value={cGroup}
                  onChange={(e) => setCGroup(e.target.value)}
                  placeholder="Parent Group (e.g. Sarees)"
                  className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] font-semibold rounded cursor-pointer"
                >
                  Add Category
                </button>
                <input
                  type="text"
                  value={cDesc}
                  onChange={(e) => setCDesc(e.target.value)}
                  placeholder="Short description"
                  className="sm:col-span-3 px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                />
              </form>

              <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl divide-y divide-[var(--border-color)]">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{cat.name}</p>
                      <p className="text-[var(--text-secondary)]">
                        {cat.parentGroup} · {cat.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteCategory(cat.id)}
                      aria-label="Delete category"
                      className="text-[var(--text-secondary)] hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS & REFUNDS */}
          {tab === 'orders' && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl divide-y divide-[var(--border-color)]">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {ord.orderNumber} · {ord.customerName}
                    </p>
                    <p className="text-[var(--text-secondary)]">
                      {formatINR(ord.totalAmount)} · Payment:{' '}
                      <strong className="uppercase">{ord.paymentStatus}</strong>
                      {ord.returnReason ? ` · Return: ${ord.returnReason}` : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="px-2.5 py-1.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                    >
                      {[
                        'Confirmed',
                        'Weaving & QC',
                        'Dispatched',
                        'In Transit',
                        'Delivered',
                        'Cancelled',
                        'Return Requested',
                        'Refunded',
                      ].map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {ord.paymentStatus === 'paid' && (
                      <button
                        type="button"
                        onClick={() => refundOrder(ord.id)}
                        className="px-3 py-1.5 border border-rose-300 text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                      >
                        Issue Razorpay Refund
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CUSTOMERS */}
          {tab === 'customers' && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-xs">
                <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                  <tr>
                    <th className="py-3 px-4">Patron</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">WhatsApp Opt-In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{u.name}</td>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">
                        {u.email} · {u.phone}
                      </td>
                      <td className="py-3 px-4 uppercase font-medium">{u.role}</td>
                      <td className="py-3 px-4">
                        {u.marketingOptIn.whatsapp ? 'Opted In' : 'Not Subscribed'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* COUPONS */}
          {tab === 'coupons' && isAdmin && (
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!cpCode.trim()) return;
                  saveCoupon({
                    code: cpCode.trim().toUpperCase(),
                    description: cpDesc.trim() || `${cpVal}% discount`,
                    discountType: cpType,
                    value: cpVal,
                    minOrder: cpMin,
                    active: true,
                  });
                  setCpCode('');
                  setCpDesc('');
                }}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs"
              >
                <input
                  type="text"
                  required
                  value={cpCode}
                  onChange={(e) => setCpCode(e.target.value)}
                  placeholder="CODE (DIWALI20)"
                  className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded uppercase"
                />
                <select
                  value={cpType}
                  onChange={(e) => setCpType(e.target.value as 'percent' | 'flat')}
                  className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                >
                  <option value="percent">% Off</option>
                  <option value="flat">Flat ₹ Off</option>
                </select>
                <input
                  type="number"
                  value={cpVal}
                  onChange={(e) => setCpVal(Number(e.target.value))}
                  placeholder="Value"
                  className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                />
                <input
                  type="number"
                  value={cpMin}
                  onChange={(e) => setCpMin(Number(e.target.value))}
                  placeholder="Min Order ₹"
                  className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] font-semibold rounded cursor-pointer sm:col-span-2 lg:col-span-1"
                >
                  Create Offer
                </button>
                <input
                  type="text"
                  value={cpDesc}
                  onChange={(e) => setCpDesc(e.target.value)}
                  placeholder="Offer description"
                  className="sm:col-span-2 lg:col-span-5 px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                />
              </form>

              <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl divide-y divide-[var(--border-color)]">
                {coupons.map((c) => (
                  <div key={c.code} className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{c.code}</p>
                      <p className="text-[var(--text-secondary)]">
                        {c.description} · Min {formatINR(c.minOrder)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCouponActive(c.code)}
                      className={`px-3 py-1.5 rounded border cursor-pointer ${
                        c.active
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                          : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {c.active ? 'Active' : 'Paused'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BANNERS */}
          {tab === 'banners' && isAdmin && (
            <div className="space-y-4">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 space-y-3 text-xs"
                >
                  <p className="font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    {b.kind} Banner
                  </p>
                  <input
                    type="text"
                    value={b.title}
                    onChange={(e) => updateBanner({ ...b, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded font-medium"
                  />
                  <input
                    type="text"
                    value={b.subtitle}
                    onChange={(e) => updateBanner({ ...b, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                  />
                </div>
              ))}
            </div>
          )}

          {/* REVIEWS */}
          {tab === 'reviews' && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl divide-y divide-[var(--border-color)]">
              {reviews.map((r) => {
                const prod = products.find((p) => p.id === r.productId);
                const thumb = r.photoUrl || prod?.images[0];
                return (
                  <div key={r.id} className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {thumb && (
                        <img
                          src={thumb}
                          alt={prod?.name || r.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded object-cover border border-[var(--border-color)] shrink-0 bg-[var(--bg-subtle)]"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--text-primary)]">
                          {r.userName} ({r.rating}★) — {r.title}
                        </p>
                        {prod && (
                          <p className="text-[11px] text-[var(--accent)] mt-0.5">
                            Purchased: {prod.name}
                            {r.purchasedVariant ? ` (${r.purchasedVariant})` : ''}
                          </p>
                        )}
                        <p className="text-[var(--text-secondary)] mt-0.5">{r.comment}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleReviewApproval(r.id)}
                      className={`px-3 py-1.5 rounded border shrink-0 cursor-pointer ${
                        r.approved
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                          : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {r.approved ? 'Published' : 'Hidden'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* WHATSAPP & MARKETING AUTOMATION */}
          {tab === 'marketing' && isAdmin && (
            <div className="space-y-6">
              {/* Followers-to-Customers Campaign Landing Launcher */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 space-y-4 text-xs">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                    Social Followers-to-Customers Landing Links
                  </h2>
                  <p className="text-[var(--text-secondary)] mt-1">
                    Simulate or verify landing directly from Instagram, Facebook, or WhatsApp campaigns to test end-to-end collection continuity and order attribution.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SOCIAL_CAMPAIGN_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-[var(--accent)]">{preset.source}</p>
                        <p className="font-semibold text-[var(--text-primary)]">{preset.headline}</p>
                        <p className="text-[var(--text-secondary)] leading-relaxed">{preset.subline}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          applyCampaignAttribution({
                            channel: preset.source,
                            campaign: preset.campaignName,
                            headline: preset.headline,
                            targetCategory: preset.category,
                            audience: preset.audience,
                          })
                        }
                        className="w-full py-2 px-3 bg-[var(--text-primary)] text-[var(--bg-surface)] font-medium rounded cursor-pointer"
                      >
                        Open {preset.source} Landing Flow →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const optInCount =
                    users.filter((u) => u.marketingOptIn.whatsapp).length +
                    newsletterSubscribers.length;
                  sendCampaign({
                    channel: campChannel,
                    title: campTitle,
                    message: campMessage,
                    segment: campSegment,
                    recipientsCount: Math.max(1, optInCount),
                  });
                }}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 space-y-4 text-xs"
              >
                <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                  WhatsApp Business &amp; Email Automation
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={campTitle}
                    onChange={(e) => setCampTitle(e.target.value)}
                    placeholder="Campaign Title"
                    className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                  />
                  <select
                    value={campChannel}
                    onChange={(e) => setCampChannel(e.target.value as 'whatsapp' | 'email')}
                    className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                  >
                    <option value="whatsapp">WhatsApp Business API</option>
                    <option value="email">Email Dispatch</option>
                  </select>
                  <select
                    value={campSegment}
                    onChange={(e) => setCampSegment(e.target.value)}
                    className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                  >
                    <option>WhatsApp Opt-In Patrons</option>
                    <option>Abandoned Bag Recovery</option>
                    <option>New Bridal Collection Launch</option>
                    <option>Celebration Month Patrons (Consented)</option>
                  </select>
                </div>
                <textarea
                  rows={3}
                  required
                  value={campMessage}
                  onChange={(e) => setCampMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] font-semibold rounded inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Campaign to Opted-In Audience
                </button>
              </form>

              <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl divide-y divide-[var(--border-color)]">
                {campaigns.map((c) => (
                  <div key={c.id} className="p-4 text-xs space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {c.title} ({c.channel.toUpperCase()})
                      </span>
                      <span className="text-[var(--text-secondary)] tabular-nums">
                        {c.recipientsCount} recipients · {new Date(c.sentAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)]">{c.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
