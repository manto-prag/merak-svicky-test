import React, { useState, useEffect } from 'react';
import {
  Language,
  NavView,
  CartItem,
  Order,
  OrderStatus,
  CustomCandle,
  GiftSet
} from './types';
import { TRANSLATIONS } from './translations';
import {
  SCENTS_DATA,
  CANDLE_COLORS_DATA,
  PACKAGING_DATA,
  INITIAL_ORDERS,
  BASE_CANDLE_PRICE_CZK,
  CZK_TO_EUR_RATE
} from './data/candleData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Configurator } from './components/Configurator';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { CatalogViews } from './components/CatalogViews';
import { AdminDashboard } from './components/AdminDashboard';
import { LegalModals, CookieBanner, LegalModalType } from './components/LegalModals';
import {
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle,
  Award,
  Heart,
  Droplet,
  Package,
  Layers,
  Clock,
  ShieldCheck,
  Instagram,
  Gift
} from 'lucide-react';

export function App() {
  // 1. Language state (defaults to 'cs', persists in localStorage)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('merak_lang');
    return (saved === 'en' || saved === 'cs') ? saved : 'cs';
  });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    localStorage.setItem('merak_lang', lang);
  }, [lang]);

  // 2. Active View Navigation
  const [currentView, setCurrentView] = useState<NavView>('home');

  // 3. Pre-selected options for Configurator when navigating from catalogs
  const [preselectedScentId, setPreselectedScentId] = useState<string | undefined>(undefined);
  const [preselectedColorId, setPreselectedColorId] = useState<string | undefined>(undefined);
  const [preselectedPackagingId, setPreselectedPackagingId] = useState<string | undefined>(undefined);

  // 4. Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('merak_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('merak_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // 5. Orders & Admin State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('merak_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('merak_orders', JSON.stringify(orders));
  }, [orders]);

  // 6. Raw Material Stock Overrides State
  const [stockState, setStockState] = useState<{
    scents: Record<string, boolean>;
    colors: Record<string, boolean>;
    packaging: Record<string, boolean>;
  }>(() => {
    try {
      const saved = localStorage.getItem('merak_stock_state');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const scentsInit: Record<string, boolean> = {};
    SCENTS_DATA.forEach((s) => (scentsInit[s.id] = s.inStock));
    const colorsInit: Record<string, boolean> = {};
    CANDLE_COLORS_DATA.forEach((c) => (colorsInit[c.id] = c.inStock));
    const packInit: Record<string, boolean> = {};
    PACKAGING_DATA.forEach((p) => (packInit[p.id] = p.inStock));
    return { scents: scentsInit, colors: colorsInit, packaging: packInit };
  });

  useEffect(() => {
    localStorage.setItem('merak_stock_state', JSON.stringify(stockState));
  }, [stockState]);

  const handleToggleStock = (category: 'scents' | 'colors' | 'packaging', id: string) => {
    setStockState((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [id]: !prev[category][id],
      },
    }));
  };

  // 7. Modals State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [item, ...prev]);
    setIsCartOpen(true);
  };

  const handleAddToCartGiftSet = (gift: GiftSet) => {
    // Add curated set as a special bundle item
    const dummyCandle: CustomCandle = {
      packagingId: 'amber-glass-jar',
      scentId: 'sandalwood-amber-calm',
      colorId: 'warm-cream',
      wickType: 'wood',
      labelStyle: 'minimal',
      customMessage: gift.nameCs,
      quantity: 1,
      unitPriceCzk: gift.priceCzk,
    };

    const newItem: CartItem = {
      id: `gift-${Date.now()}`,
      candle: dummyCandle,
      packaging: PACKAGING_DATA[0],
      scent: {
        ...SCENTS_DATA[0],
        nameCs: gift.nameCs,
        nameEn: gift.nameEn,
      },
      color: CANDLE_COLORS_DATA[0],
      totalPriceCzk: gift.priceCzk,
    };

    setCartItems((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((it) => it.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                candle: { ...it.candle, quantity: newQty },
                totalPriceCzk: it.unitPriceCzk * newQty,
              }
            : it
        )
      );
    }
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Checkout & Order completion
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setPlacedOrder(newOrder);
  };

  // Order status updating in admin
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedLogs = [...order.emailLogs];
          if (status === 'paid') {
            updatedLogs.push({
              id: `em-paid-${Date.now()}`,
              type: 'payment_received',
              recipient: order.customer.email,
              subject:
                lang === 'cs'
                  ? `Platba přijata — Zahajujeme výrobu svíčky ${order.id}`
                  : `Payment Received — Crafting candle ${order.id}`,
              sentAt: new Date().toISOString(),
              contentHtml: `Vaše platba ve výši ${order.totalCzk} Kč byla v pořádku spárována. Náš tým začíná s láskou ručně lít vaši svíčku.`,
            });
          } else if (status === 'shipped' && trackingNumber) {
            updatedLogs.push({
              id: `em-ship-${Date.now()}`,
              type: 'shipping_notification',
              recipient: order.customer.email,
              subject:
                lang === 'cs'
                  ? `Vaše svíčka je na cestě! Sledovací číslo ${trackingNumber}`
                  : `Your candle is on its way! Tracking ${trackingNumber}`,
              sentAt: new Date().toISOString(),
              contentHtml: `Balíček pro objednávku ${order.id} jsme předali Zásilkovně. Sledovací číslo: ${trackingNumber}.`,
            });
          }

          return {
            ...order,
            status,
            trackingNumber: trackingNumber || order.trackingNumber,
            emailLogs: updatedLogs,
          };
        }
        return order;
      })
    );
  };

  // Navigation handlers from catalogs with preselected items
  const handleSelectScentForConfigurator = (scentId: string) => {
    setPreselectedScentId(scentId);
    setCurrentView('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectColorForConfigurator = (colorId: string) => {
    setPreselectedColorId(colorId);
    setCurrentView('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPackagingForConfigurator = (packagingId: string) => {
    setPreselectedPackagingId(packagingId);
    setCurrentView('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((sum, it) => sum + it.candle.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C2523] selection:bg-amber-200 selection:text-amber-900 font-sans">
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'cs' ? 'en' : 'cs'))}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. Main Page Views Router */}
      <main className="flex-1">
        {/* HOME VIEW */}
        {currentView === 'home' && (
          <div className="space-y-16 sm:space-y-24">
            {/* Hero Section */}
            <Hero
              lang={lang}
              onNavigate={(v) => {
                setCurrentView(v);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartConfigurator={() => {
                setCurrentView('configurator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Quick Live Configurator Spotlight on Home */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                  {lang === 'cs' ? 'Interaktivní tvorba' : 'Interactive Crafting'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-stone-900">
                  {lang === 'cs' ? 'Vytvořte si svou svíčku krok za krokem' : 'Create Your Candle Step by Step'}
                </h2>
                <p className="text-stone-600 text-sm sm:text-base">
                  {lang === 'cs'
                    ? '10 vůní × 10 barev vosku × 10 designových obalů = 1 000 unikátních možností s okamžitým náhledem a cenou.'
                    : '10 scents × 10 wax colors × 10 packaging vessels = 1,000 unique combinations with live preview and pricing.'}
                </p>
              </div>

              {/* Embed Full Configurator directly */}
              <Configurator
                lang={lang}
                onAddToCart={handleAddToCart}
                preselectedPackagingId={preselectedPackagingId}
                preselectedScentId={preselectedScentId}
                preselectedColorId={preselectedColorId}
              />
            </section>

            {/* Process & Craftsmanship Timeline */}
            <section className="bg-[#F4EFE6] py-16 sm:py-20 border-y border-[#E8DFD3]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                    {lang === 'cs' ? 'Jak vzniká MERAK' : 'How MERAK is Crafted'}
                  </span>
                  <h2 className="text-3xl font-serif-display font-medium text-stone-900">
                    {lang === 'cs' ? 'Od vaší myšlenky po první plamínek' : 'From your idea to the first flame'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-[#E5DACD] space-y-3 relative shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-[#2C2523] text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h3 className="font-semibold text-base text-stone-900">
                      {lang === 'cs' ? 'Vlastní konfigurace' : 'Bespoke Selection'}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {lang === 'cs'
                        ? 'Zvolíte si oblíbenou vůni, barevný tón vosku, obal a vlastní věnování na etiketu.'
                        : 'Choose your preferred scent, wax tone, jar design, and custom label message.'}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#E5DACD] space-y-3 relative shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-[#2C2523] text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h3 className="font-semibold text-base text-stone-900">
                      {lang === 'cs' ? 'Ruční odlévání v Praze' : 'Hand-pouring in Prague'}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {lang === 'cs'
                        ? '100% sójový vosk s esencemi roztavíme a ručně nalijeme do vámi vybraného obalu.'
                        : 'Pure soy wax and fine essences are gently melted and hand-poured into your chosen jar.'}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#E5DACD] space-y-3 relative shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-[#2C2523] text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h3 className="font-semibold text-base text-stone-900">
                      {lang === 'cs' ? 'Zrání & Personalizace' : 'Curing & Personalization'}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {lang === 'cs'
                        ? 'Svíčka zraje 24 hodin a tiskneme vaši originální etiketu na prémiový papír.'
                        : 'The candle cures for 24 hours while your bespoke label is printed on textured paper.'}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#E5DACD] space-y-3 relative shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-[#2C2523] text-white flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <h3 className="font-semibold text-base text-stone-900">
                      {lang === 'cs' ? 'Zásilkovna k vašim dveřím' : 'Packeta Delivery'}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {lang === 'cs'
                        ? 'Pečlivě zabalené v hedvábném papíru a odeslané do Zásilkovny / Z-BOXu.'
                        : 'Carefully wrapped in silk paper and dispatched to your closest Packeta point or home.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Curated Scent Highlights Strip */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                    {lang === 'cs' ? 'Oblíbené kompozice' : 'Popular Fragrances'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif-display font-medium text-stone-900 mt-1">
                    {lang === 'cs' ? 'Objevte naše ikonické vůně' : 'Discover Our Signature Scents'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('scents');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-900 hover:text-stone-900 transition-colors"
                >
                  <span>{lang === 'cs' ? 'Všech 10 vůní' : 'All 10 Scents'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SCENTS_DATA.slice(0, 4).map((scent) => (
                  <div
                    key={scent.id}
                    className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: scent.colorHint }} />
                        <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                          {scent.family}
                        </span>
                      </div>
                      <h3 className="font-serif-display font-semibold text-stone-900 text-lg">
                        {lang === 'cs' ? scent.nameCs : scent.nameEn}
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        {lang === 'cs' ? scent.descriptionCs : scent.descriptionEn}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectScentForConfigurator(scent.id)}
                      className="mt-4 w-full py-2 bg-stone-100 hover:bg-[#2C2523] text-stone-800 hover:text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      {lang === 'cs' ? 'Vybrat tuto vůni' : 'Select this scent'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Instagram / Handmade Community Banner */}
            <section className="bg-gradient-to-r from-[#2C2523] via-[#3B322F] to-[#2C2523] text-white py-16 px-4 sm:px-6 lg:px-8 my-12 rounded-3xl max-w-7xl mx-auto overflow-hidden relative shadow-xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative text-center max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold">
                  <Instagram className="w-4 h-4" />
                  <span>@merak_svicky</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif-display font-medium">
                  {lang === 'cs' ? 'Sdílejte své voňavé chvíle' : 'Share your fragrant moments'}
                </h2>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                  {lang === 'cs'
                    ? 'Označte nás na Instagramu s hashtagem #meraksvicky a získejte 10% slevu na další vlastní svíčku.'
                    : 'Tag us on Instagram with #merakcandles and receive 10% off your next custom candle creation.'}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('configurator');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 bg-white text-[#2C2523] hover:bg-stone-100 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-98"
                  >
                    {t.hero.ctaCreate}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* CONFIGURATOR VIEW */}
        {currentView === 'configurator' && (
          <div className="py-10 md:py-16">
            <Configurator
              lang={lang}
              onAddToCart={handleAddToCart}
              preselectedPackagingId={preselectedPackagingId}
              preselectedScentId={preselectedScentId}
              preselectedColorId={preselectedColorId}
            />
          </div>
        )}

        {/* CATALOG / INFORMATION VIEWS */}
        {(currentView === 'scents' ||
          currentView === 'colors' ||
          currentView === 'packaging' ||
          currentView === 'gifts' ||
          currentView === 'about' ||
          currentView === 'contact') && (
          <CatalogViews
            view={currentView}
            lang={lang}
            onSelectScentForConfigurator={handleSelectScentForConfigurator}
            onSelectColorForConfigurator={handleSelectColorForConfigurator}
            onSelectPackagingForConfigurator={handleSelectPackagingForConfigurator}
            onAddToCartGiftSet={handleAddToCartGiftSet}
            onNavigate={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ADMIN VIEW */}
        {currentView === 'admin' && (
          <AdminDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            lang={lang}
            stockState={stockState}
            onToggleStock={handleToggleStock}
          />
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLegalModal={(modal) => setLegalModal(modal)}
        lang={lang}
      />

      {/* 4. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onStartConfigurator={() => {
          setCurrentView('configurator');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
      />

      {/* 5. Checkout Modal with Packeta Pickup Point Selector & Payment */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        lang={lang}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* 6. Order Placed Success Modal with Live SPAYD QR Code & Automated Email Viewer */}
      {placedOrder && (
        <OrderSuccessModal
          order={placedOrder}
          isOpen={!!placedOrder}
          onClose={() => setPlacedOrder(null)}
          lang={lang}
          onStartNewCandle={() => {
            setPlacedOrder(null);
            setCurrentView('configurator');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* 7. Legal Information Modals */}
      <LegalModals
        activeModal={legalModal}
        onClose={() => setLegalModal(null)}
        lang={lang}
      />

      {/* 8. Cookie Banner */}
      <CookieBanner lang={lang} />
    </div>
  );
}

export default App;
