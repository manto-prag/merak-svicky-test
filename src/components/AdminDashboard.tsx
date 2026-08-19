import React, { useState } from 'react';
import { Order, OrderStatus, Language, Scent, CandleColor, Packaging } from '../types';
import { TRANSLATIONS } from '../translations';
import { SCENTS_DATA, CANDLE_COLORS_DATA, PACKAGING_DATA } from '../data/candleData';
import {
  Package,
  CheckCircle,
  Truck,
  Clock,
  Mail,
  Sliders,
  DollarSign,
  AlertCircle,
  Search,
  ExternalLink,
  Send,
  Eye,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  lang: Language;
  stockState: {
    scents: Record<string, boolean>;
    colors: Record<string, boolean>;
    packaging: Record<string, boolean>;
  };
  onToggleStock: (category: 'scents' | 'colors' | 'packaging', id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  lang,
  stockState,
  onToggleStock,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'orders' | 'stock' | 'stats'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [shippingModalOrderId, setShippingModalOrderId] = useState<string | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>('');
  const [viewEmailLogOrder, setViewEmailLogOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleMarkPaid = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'paid');
  };

  const handleOpenShippingModal = (order: Order) => {
    const randomTracking = `Z${Math.floor(1000000000 + Math.random() * 9000000000)}CZ`;
    setTrackingNumberInput(order.trackingNumber || randomTracking);
    setShippingModalOrderId(order.id);
  };

  const handleConfirmShipping = () => {
    if (shippingModalOrderId && trackingNumberInput.trim()) {
      onUpdateOrderStatus(shippingModalOrderId, 'shipped', trackingNumberInput.trim());
      setShippingModalOrderId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lang === 'cs' ? 'Čeká na platbu' : 'Pending Payment'}
          </span>
        );
      case 'paid':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {lang === 'cs' ? 'Zaplaceno (K výrobě)' : 'Paid (In Production)'}
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-semibold flex items-center gap-1">
            <Truck className="w-3 h-3" />
            {lang === 'cs' ? 'Odesláno' : 'Shipped'}
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" />
            {lang === 'cs' ? 'Doručeno' : 'Delivered'}
          </span>
        );
      default:
        return null;
    }
  };

  const totalRevenueCzk = orders.reduce((sum, o) => (o.status !== 'pending_payment' ? sum + o.totalCzk : sum), 0);
  const paidOrdersCount = orders.filter((o) => o.status !== 'pending_payment').length;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="bg-[#FAF3F0] rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-medium text-[#8B5E3C] uppercase tracking-[0.25em]">
            {t.admin.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-editorial-serif font-light text-[#2D2926] mt-1">
            {t.admin.title}
          </h2>
          <p className="text-[#8C827D] text-xs sm:text-sm mt-0.5">
            {t.admin.subtitle}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-white p-1 rounded-sm border border-[#E8D1D1] text-[11px] font-medium uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-sm transition-all ${
              activeTab === 'orders' ? 'bg-[#2D2926] text-white shadow-xs' : 'text-[#5D4037] hover:text-[#2D2926]'
            }`}
          >
            {t.admin.tabOrders} ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-sm transition-all ${
              activeTab === 'stock' ? 'bg-[#2D2926] text-white shadow-xs' : 'text-[#5D4037] hover:text-[#2D2926]'
            }`}
          >
            {t.admin.tabStock}
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            {/* Search */}
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-[#8C827D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'cs' ? 'Hledat číslo objednávky, zákazníka...' : 'Search order #, customer...'}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-sm border border-[#E8D1D1] text-xs text-[#2D2926] outline-none focus:border-[#8B5E3C]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: t.admin.filterAll },
                { id: 'pending_payment', label: t.admin.filterPending },
                { id: 'paid', label: t.admin.filterPaid },
                { id: 'shipped', label: t.admin.filterShipped },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-sm text-[11px] font-medium tracking-wider uppercase transition-all ${
                    statusFilter === f.id
                      ? 'bg-[#2D2926] text-white'
                      : 'bg-white text-[#5D4037] border border-[#E8D1D1] hover:bg-[#FAF3F0]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table / Cards */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 rounded-sm border border-[#E8D1D1] text-center text-xs text-[#8C827D]">
                {t.admin.noOrders}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-sm p-6 border border-[#E8D1D1] shadow-xs space-y-4 transition-all"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#FAF3F0]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#2D2926]">
                        {order.id}
                      </span>
                      {getStatusBadge(order.status)}
                      <span className="text-[11px] text-[#8C827D]">
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-editorial-serif font-medium text-[#2D2926]">
                        {order.totalCzk} Kč
                      </span>
                      <button
                        type="button"
                        onClick={() => setViewEmailLogOrder(order)}
                        className="px-2.5 py-1 bg-[#FAF3F0] hover:bg-[#E8D1D1]/50 text-[#8B5E3C] border border-[#E8D1D1] rounded-sm text-xs font-medium flex items-center gap-1"
                        title="Zobrazit odeslané e-maily"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{order.emailLogs.length} e-maily</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer & Delivery & Candle Details */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-[#5D4037]">
                    {/* Customer */}
                    <div className="md:col-span-4 space-y-1">
                      <div className="font-semibold text-[#2D2926]">{order.customer.name}</div>
                      <div>{order.customer.email}</div>
                      <div>{order.customer.phone}</div>
                      <div className="text-[#8C827D] pt-1">
                        <strong>Doručení:</strong>{' '}
                        {order.pickupPoint ? `Zásilkovna: ${order.pickupPoint.name}` : `${order.customer.street}, ${order.customer.city}`}
                      </div>
                      {order.trackingNumber && (
                        <div className="p-1.5 bg-[#FAF3F0] rounded-sm border border-[#E8D1D1] text-[#8B5E3C] font-mono text-[11px]">
                          Sledování: {order.trackingNumber}
                        </div>
                      )}
                    </div>

                    {/* Candle Items */}
                    <div className="md:col-span-5 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-[#FAF3F0]/50 rounded-sm border border-[#E8D1D1] space-y-1">
                          <div className="font-editorial-serif font-medium text-[#2D2926] flex justify-between">
                            <span>{item.candle.quantity}× {item.scent.nameCs}</span>
                            <span>{item.totalPriceCzk} Kč</span>
                          </div>
                          <div className="text-[11px] text-[#5D4037]">
                            • Obal: {item.packaging.nameCs}<br />
                            • Barva vosku: {item.color.nameCs}<br />
                            • Knot: {item.candle.wickType === 'wood' ? 'Praskající dřevěný' : 'Bavlněný'}
                            {item.candle.customMessage && (
                              <div className="italic text-[#2D2926] font-editorial-serif mt-0.5">
                                • Věnování: „{item.candle.customMessage}“
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="md:col-span-3 flex flex-col justify-center gap-2">
                      {order.status === 'pending_payment' && (
                        <button
                          type="button"
                          onClick={() => handleMarkPaid(order.id)}
                          className="w-full py-2.5 px-3 bg-[#2D2926] hover:bg-[#8B5E3C] text-white rounded-sm text-[11px] font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{t.admin.markPaid}</span>
                        </button>
                      )}

                      {order.status === 'paid' && (
                        <button
                          type="button"
                          onClick={() => handleOpenShippingModal(order)}
                          className="w-full py-2.5 px-3 bg-[#8B5E3C] hover:bg-[#2D2926] text-white rounded-sm text-[11px] font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{t.admin.markShipped}</span>
                        </button>
                      )}

                      {order.status === 'shipped' && (
                        <button
                          type="button"
                          onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                          className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-sm text-[11px] font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Označit jako DORUČENO</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RAW MATERIAL STOCK MANAGEMENT */}
      {activeTab === 'stock' && (
        <div className="space-y-8">
          {/* Packaging Stock */}
          <div className="bg-white rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-xs space-y-4">
            <h3 className="text-xl font-editorial-serif font-light text-[#2D2926] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#8B5E3C]" />
              <span>{t.admin.stockPackaging}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PACKAGING_DATA.map((pack) => {
                const inStock = stockState.packaging[pack.id] ?? pack.inStock;
                return (
                  <div
                    key={pack.id}
                    className="p-3.5 rounded-sm border border-[#E8D1D1] bg-[#FAF3F0]/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-[#2D2926] truncate">
                        {lang === 'cs' ? pack.nameCs : pack.nameEn}
                      </div>
                      <div className="text-[11px] text-[#8C827D]">{pack.volume}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleStock('packaging', pack.id)}
                      className={`px-3 py-1 rounded-sm text-[10.5px] font-medium tracking-wider uppercase shrink-0 transition-colors ${
                        inStock
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {inStock ? t.admin.inStockToggle : t.admin.outOfStockToggle}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scents Stock */}
          <div className="bg-white rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-xs space-y-4">
            <h3 className="text-xl font-editorial-serif font-light text-[#2D2926] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#8B5E3C]" />
              <span>{t.admin.stockScents}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SCENTS_DATA.map((scent) => {
                const inStock = stockState.scents[scent.id] ?? scent.inStock;
                return (
                  <div
                    key={scent.id}
                    className="p-3.5 rounded-sm border border-[#E8D1D1] bg-[#FAF3F0]/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: scent.colorHint }} />
                      <div className="font-medium text-[#2D2926] truncate">
                        {lang === 'cs' ? scent.nameCs : scent.nameEn}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleStock('scents', scent.id)}
                      className={`px-3 py-1 rounded-sm text-[10.5px] font-medium tracking-wider uppercase shrink-0 transition-colors ${
                        inStock
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {inStock ? t.admin.inStockToggle : t.admin.outOfStockToggle}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colors Stock */}
          <div className="bg-white rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-xs space-y-4">
            <h3 className="text-xl font-editorial-serif font-light text-[#2D2926] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#8B5E3C]" />
              <span>{t.admin.stockColors}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CANDLE_COLORS_DATA.map((col) => {
                const inStock = stockState.colors[col.id] ?? col.inStock;
                return (
                  <div
                    key={col.id}
                    className="p-3.5 rounded-sm border border-[#E8D1D1] bg-[#FAF3F0]/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full shrink-0 border border-stone-300" style={{ backgroundColor: col.hex }} />
                      <div className="font-medium text-[#2D2926] truncate">
                        {lang === 'cs' ? col.nameCs : col.nameEn}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleStock('colors', col.id)}
                      className={`px-3 py-1 rounded-sm text-[10.5px] font-medium tracking-wider uppercase shrink-0 transition-colors ${
                        inStock
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {inStock ? t.admin.inStockToggle : t.admin.outOfStockToggle}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Shipping Modal */}
      {shippingModalOrderId && (
        <div className="fixed inset-0 z-60 bg-[#2D2926]/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-sm max-w-md w-full p-6 shadow-2xl border border-[#E8D1D1] space-y-4 animate-scale-up">
            <h3 className="font-editorial-serif text-xl font-light text-[#2D2926] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8B5E3C]" />
              <span>Expedovat objednávku {shippingModalOrderId}</span>
            </h3>
            <p className="text-xs text-[#5D4037] leading-relaxed">
              Zadejte sledovací číslo Zásilkovny. Po potvrzení bude zákazníkovi automaticky odeslán e-mail s odkazem na sledování.
            </p>

            <div>
              <label htmlFor="tracking-code-input" className="block text-xs font-medium text-[#2D2926] mb-1">
                Sledovací číslo zásilky:
              </label>
              <input
                id="tracking-code-input"
                type="text"
                value={trackingNumberInput}
                onChange={(e) => setTrackingNumberInput(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8D1D1] rounded-sm text-xs font-mono bg-[#FAF3F0]/40 focus:border-[#8B5E3C] outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#FAF3F0]">
              <button
                type="button"
                onClick={() => setShippingModalOrderId(null)}
                className="px-4 py-2 rounded-sm text-[11px] uppercase tracking-wider font-medium text-[#5D4037] hover:bg-[#FAF3F0]"
              >
                Zrušit
              </button>
              <button
                type="button"
                onClick={handleConfirmShipping}
                className="px-5 py-2 rounded-sm text-[11px] uppercase tracking-wider font-medium bg-[#2D2926] text-white hover:bg-[#8B5E3C] shadow-xs"
              >
                Odeslat & Poslat e-mail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Logs Viewer Modal */}
      {viewEmailLogOrder && (
        <div className="fixed inset-0 z-60 bg-[#2D2926]/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-sm max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl border border-[#E8D1D1] overflow-hidden">
            <div className="p-4 bg-[#FAF3F0] border-b border-[#E8D1D1] flex items-center justify-between">
              <h4 className="font-editorial-serif text-lg font-light text-[#2D2926] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8B5E3C]" />
                <span>Odeslané e-maily pro {viewEmailLogOrder.id}</span>
              </h4>
              <button
                type="button"
                onClick={() => setViewEmailLogOrder(null)}
                className="text-[#8C827D] hover:text-[#2D2926]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {viewEmailLogOrder.emailLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#FAF3F0]/50 rounded-sm border border-[#E8D1D1] space-y-1">
                  <div className="font-medium text-[#2D2926]">{log.subject}</div>
                  <div className="text-[11px] text-[#8C827D]">
                    Odesláno na: {log.recipient} • {new Date(log.sentAt).toLocaleString()}
                  </div>
                  <div className="text-[#5D4037] pt-1 border-t border-[#E8D1D1]">
                    {log.contentHtml}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
