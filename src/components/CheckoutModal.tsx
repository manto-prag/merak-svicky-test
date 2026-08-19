import React, { useState } from 'react';
import { CartItem, Language, Order, OrderCustomer, PickupPoint } from '../types';
import { TRANSLATIONS } from '../translations';
import {
  SAMPLE_PACKETA_POINTS,
  FREE_SHIPPING_THRESHOLD_CZK,
  STANDARD_PACKETA_PRICE_CZK,
  HOME_DELIVERY_PRICE_CZK,
  CZK_TO_EUR_RATE
} from '../data/candleData';
import {
  X,
  MapPin,
  QrCode,
  CreditCard,
  Truck,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Building,
  Box
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  lang: Language;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  lang,
  onOrderPlaced,
}) => {
  const t = TRANSLATIONS[lang];

  // Customer state
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [zip, setZip] = useState<string>('');
  const [note, setNote] = useState<string>('');

  // Delivery & Payment
  const [deliveryMethod, setDeliveryMethod] = useState<'packeta_point' | 'packeta_home'>('packeta_point');
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<PickupPoint>(SAMPLE_PACKETA_POINTS[0]);
  const [showPointPicker, setShowPointPicker] = useState<boolean>(false);
  const [pointSearchQuery, setPointSearchQuery] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'qr_transfer' | 'card' | 'cod'>('qr_transfer');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotalCzk = items.reduce((acc, item) => acc + item.totalPriceCzk, 0);
  const isFreeShipping = subtotalCzk >= FREE_SHIPPING_THRESHOLD_CZK;
  const shippingCzk = isFreeShipping
    ? 0
    : deliveryMethod === 'packeta_point'
    ? STANDARD_PACKETA_PRICE_CZK
    : HOME_DELIVERY_PRICE_CZK;
  const paymentFeeCzk = paymentMethod === 'cod' ? 39 : 0;
  const totalCzk = subtotalCzk + shippingCzk + paymentFeeCzk;

  // Filtered Packeta points
  const filteredPoints = SAMPLE_PACKETA_POINTS.filter(
    (p) =>
      p.name.toLowerCase().includes(pointSearchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(pointSearchQuery.toLowerCase()) ||
      p.zip.includes(pointSearchQuery)
  );

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Basic validation
    if (!name.trim()) {
      setValidationError(lang === 'cs' ? 'Zadejte prosím své jméno a příjmení.' : 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError(lang === 'cs' ? 'Zadejte prosím platnou e-mailovou adresu.' : 'Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setValidationError(lang === 'cs' ? 'Zadejte prosím telefonní číslo pro SMS ze Zásilkovny.' : 'Please enter a phone number for delivery SMS.');
      return;
    }
    if (deliveryMethod === 'packeta_home' && (!street.trim() || !city.trim() || !zip.trim())) {
      setValidationError(lang === 'cs' ? 'Vyplňte prosím celou doručovací adresu.' : 'Please fill in the complete delivery address.');
      return;
    }

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `MRK-2026-${randomSuffix}`;
    const createdAt = new Date().toISOString();

    const customer: OrderCustomer = {
      name,
      email,
      phone,
      street: deliveryMethod === 'packeta_home' ? street : undefined,
      city: deliveryMethod === 'packeta_home' ? city : undefined,
      zip: deliveryMethod === 'packeta_home' ? zip : undefined,
      note: note.trim() || undefined,
    };

    const newOrder: Order = {
      id: orderId,
      createdAt,
      status: 'pending_payment',
      customer,
      deliveryMethod,
      pickupPoint: deliveryMethod === 'packeta_point' ? selectedPickupPoint : undefined,
      paymentMethod,
      items,
      subtotalCzk,
      shippingCzk,
      totalCzk,
      emailLogs: [
        {
          id: `em-${Date.now()}`,
          type: 'order_confirmation',
          recipient: email,
          subject:
            lang === 'cs'
              ? `Potvrzení objednávky ${orderId} — MERAK svíčky`
              : `Order Confirmation ${orderId} — MERAK Candles`,
          sentAt: createdAt,
          contentHtml: `Děkujeme za objednávku ${orderId}. Vaše svíčka na míru byla zaevidována a čeká na úhradu.`,
        },
      ],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#E2B1B1', '#C86D51', '#2C2523'],
        });
      } catch (err) {
        // Confetti fallback
      }
      onOrderPlaced(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D2926]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="relative w-full max-w-4xl bg-[#FAF3F0] rounded-sm border border-[#E8D1D1] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E8D1D1] flex items-center justify-between">
          <div>
            <span className="text-[10.5px] font-medium text-[#8B5E3C] uppercase tracking-[0.25em]">
              MERAK svíčky
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial-serif font-light text-[#2D2926]">
              {t.checkout.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5D4037] hover:text-[#2D2926] rounded-sm hover:bg-[#FAF3F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-8">
          {validationError && (
            <div className="p-3 bg-[#FAF3F0] border border-[#D4AF37] rounded-sm flex items-center gap-2 text-xs text-[#8B5E3C] animate-shake">
              <AlertCircle className="w-4 h-4 text-[#8B5E3C] shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Contact & Delivery & Payment */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Customer Information */}
              <div className="bg-white p-5 sm:p-6 rounded-sm border border-[#E8D1D1] space-y-4">
                <h3 className="text-xl font-editorial-serif font-light text-[#2D2926] flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-sm bg-[#2D2926] text-white text-[11px] flex items-center justify-center font-sans font-medium">
                    1
                  </span>
                  {t.checkout.stepContact}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="customer-name-field" className="block text-xs font-medium text-[#2D2926] mb-1">
                      {t.checkout.fullName} *
                    </label>
                    <input
                      id="customer-name-field"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.checkout.fullNamePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D1D1] focus:border-[#2D2926] text-xs bg-[#FAF3F0]/40 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="customer-email-field" className="block text-xs font-medium text-[#2D2926] mb-1">
                        {t.checkout.email} *
                      </label>
                      <input
                        id="customer-email-field"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.checkout.emailPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D1D1] focus:border-[#2D2926] text-xs bg-[#FAF3F0]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="customer-phone-field" className="block text-xs font-medium text-[#2D2926] mb-1">
                        {t.checkout.phone} *
                      </label>
                      <input
                        id="customer-phone-field"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t.checkout.phonePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D1D1] focus:border-[#2D2926] text-xs bg-[#FAF3F0]/40 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Delivery Method */}
              <div className="bg-white p-5 sm:p-6 rounded-sm border border-[#E8D1D1] space-y-4">
                <h3 className="text-xl font-editorial-serif font-light text-[#2D2926] flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-sm bg-[#2D2926] text-white text-[11px] flex items-center justify-center font-sans font-medium">
                    2
                  </span>
                  {t.checkout.stepDelivery}
                </h3>

                <div className="space-y-3">
                  {/* Option 1: Packeta Pickup Point / Z-BOX */}
                  <div
                    onClick={() => setDeliveryMethod('packeta_point')}
                    className={`p-4 rounded-sm border cursor-pointer transition-all ${
                      deliveryMethod === 'packeta_point'
                        ? 'border-[#2D2926] bg-[#FAF3F0] ring-1 ring-[#2D2926]'
                        : 'border-[#E8D1D1] hover:bg-[#FAF3F0]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <Box className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-[#2D2926]">
                            {t.checkout.deliveryPacketaPoint}
                          </div>
                          <div className="text-[11px] text-[#5D4037]">
                            {t.checkout.deliveryPacketaPointDesc}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#2D2926]">
                        {isFreeShipping ? (lang === 'cs' ? 'ZDARMA' : 'FREE') : `${STANDARD_PACKETA_PRICE_CZK} Kč`}
                      </span>
                    </div>

                    {/* Selected Pickup point details & change button */}
                    {deliveryMethod === 'packeta_point' && (
                      <div className="mt-3 pt-3 border-t border-[#E8D1D1] flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-[#2D2926] font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
                          <span className="truncate">{selectedPickupPoint.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPointPicker(true);
                          }}
                          className="px-3 py-1 bg-white hover:bg-[#FAF3F0] border border-[#E8D1D1] rounded-sm text-[10.5px] font-medium uppercase tracking-wider text-[#5D4037] shrink-0 transition-colors"
                        >
                          {t.checkout.changePoint}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Home Delivery */}
                  <div
                    onClick={() => setDeliveryMethod('packeta_home')}
                    className={`p-4 rounded-sm border cursor-pointer transition-all ${
                      deliveryMethod === 'packeta_home'
                        ? 'border-[#2D2926] bg-[#FAF3F0] ring-1 ring-[#2D2926]'
                        : 'border-[#E8D1D1] hover:bg-[#FAF3F0]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-[#2D2926]">
                            {t.checkout.deliveryHome}
                          </div>
                          <div className="text-[11px] text-[#5D4037]">
                            {t.checkout.deliveryHomeDesc}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#2D2926]">
                        {isFreeShipping ? (lang === 'cs' ? 'ZDARMA' : 'FREE') : `${HOME_DELIVERY_PRICE_CZK} Kč`}
                      </span>
                    </div>

                    {deliveryMethod === 'packeta_home' && (
                      <div className="mt-3 pt-3 border-t border-[#E8D1D1] space-y-2">
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder={t.checkout.street}
                          className="w-full px-3 py-2 rounded-sm border border-[#E8D1D1] text-xs bg-[#FAF3F0]/40"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder={t.checkout.city}
                            className="w-full px-3 py-2 rounded-sm border border-[#E8D1D1] text-xs bg-[#FAF3F0]/40"
                          />
                          <input
                            type="text"
                            required
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder={t.checkout.zip}
                            className="w-full px-3 py-2 rounded-sm border border-[#E8D1D1] text-xs bg-[#FAF3F0]/40"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white p-5 sm:p-6 rounded-sm border border-[#E8D1D1] space-y-4">
                <h3 className="text-xl font-editorial-serif font-light text-[#2D2926] flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-sm bg-[#2D2926] text-white text-[11px] flex items-center justify-center font-sans font-medium">
                    3
                  </span>
                  {t.checkout.stepPayment}
                </h3>

                <div className="space-y-3">
                  {/* QR Platba */}
                  <div
                    onClick={() => setPaymentMethod('qr_transfer')}
                    className={`p-4 rounded-sm border cursor-pointer transition-all ${
                      paymentMethod === 'qr_transfer'
                        ? 'border-[#2D2926] bg-[#FAF3F0] ring-1 ring-[#2D2926]'
                        : 'border-[#E8D1D1] hover:bg-[#FAF3F0]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <QrCode className="w-4 h-4 text-[#8B5E3C] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-[#2D2926]">
                          {t.checkout.paymentQr}
                        </div>
                        <div className="text-[11px] text-[#5D4037] mt-0.5">
                          {t.checkout.paymentQrDesc}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#8B5E3C]">0 Kč</span>
                    </div>
                  </div>

                  {/* Card Online */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-sm border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#2D2926] bg-[#FAF3F0] ring-1 ring-[#2D2926]'
                        : 'border-[#E8D1D1] hover:bg-[#FAF3F0]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-4 h-4 text-[#8B5E3C] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-[#2D2926]">
                          {t.checkout.paymentCard}
                        </div>
                        <div className="text-[11px] text-[#5D4037] mt-0.5">
                          {t.checkout.paymentCardDesc}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#8B5E3C]">0 Kč</span>
                    </div>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-sm border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#2D2926] bg-[#FAF3F0] ring-1 ring-[#2D2926]'
                        : 'border-[#E8D1D1] hover:bg-[#FAF3F0]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Building className="w-4 h-4 text-[#8B5E3C] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-[#2D2926]">
                          {t.checkout.paymentCod}
                        </div>
                        <div className="text-[11px] text-[#5D4037] mt-0.5">
                          {t.checkout.paymentCodDesc}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#2D2926]">+39 Kč</span>
                    </div>
                  </div>
                </div>

                {/* Optional note */}
                <div className="pt-2">
                  <label htmlFor="customer-note-field" className="block text-xs font-medium text-[#2D2926] mb-1">
                    {t.checkout.note}
                  </label>
                  <textarea
                    id="customer-note-field"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t.checkout.notePlaceholder}
                    className="w-full px-3 py-2 rounded-sm border border-[#E8D1D1] text-xs bg-[#FAF3F0]/40 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Order Summary & Place Order */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-5 sm:p-6 rounded-sm border border-[#E8D1D1] space-y-4">
                <h3 className="text-xl font-editorial-serif font-light text-[#2D2926]">
                  {t.checkout.orderSummary}
                </h3>

                {/* Compact item list */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="text-xs text-[#5D4037] pb-2 border-b border-[#FAF3F0] flex justify-between">
                      <div>
                        <span className="font-editorial-serif font-medium text-sm text-[#2D2926] block">
                          {lang === 'cs' ? item.scent.nameCs : item.scent.nameEn}
                        </span>
                        <span className="text-[11px] text-[#8C827D]">
                          {item.candle.quantity}× • {lang === 'cs' ? item.packaging.nameCs.split(' (')[0] : item.packaging.nameEn.split(' (')[0]}
                        </span>
                      </div>
                      <span className="font-editorial-serif font-medium text-sm text-[#2D2926]">
                        {item.totalPriceCzk} Kč
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial breakdown */}
                <div className="space-y-1.5 text-xs text-[#5D4037] pt-2">
                  <div className="flex justify-between">
                    <span>{t.checkout.subtotal}</span>
                    <span className="font-medium text-[#2D2926]">{subtotalCzk} Kč</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.checkout.shipping}</span>
                    <span className="font-medium text-[#2D2926]">
                      {shippingCzk === 0 ? (lang === 'cs' ? 'ZDARMA' : 'FREE') : `${shippingCzk} Kč`}
                    </span>
                  </div>
                  {paymentFeeCzk > 0 && (
                    <div className="flex justify-between">
                      <span>{t.checkout.paymentFee}</span>
                      <span className="font-medium text-[#2D2926]">{paymentFeeCzk} Kč</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-editorial-serif font-medium text-[#2D2926] pt-3 border-t border-[#E8D1D1]">
                    <span>{t.checkout.total}</span>
                    <span>
                      {totalCzk} Kč <span className="text-xs font-sans font-normal text-[#8C827D]">(~€{(totalCzk / CZK_TO_EUR_RATE).toFixed(1)})</span>
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="place-order-submit-btn"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#2D2926] text-white hover:bg-[#8B5E3C] disabled:bg-stone-300 rounded-sm font-medium text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  {isSubmitting ? (
                    <span>{t.checkout.placingOrder}</span>
                  ) : (
                    <span>{t.checkout.placeOrder}</span>
                  )}
                </button>

                <p className="text-[10.5px] text-[#8C827D] text-center leading-relaxed">
                  {t.checkout.termsAgreement}
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Modal for Packeta pickup point selection */}
        {showPointPicker && (
          <div className="fixed inset-0 z-60 bg-[#2D2926]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-sm max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#E8D1D1] overflow-hidden font-sans">
              <div className="p-4 border-b border-[#E8D1D1] flex items-center justify-between">
                <h4 className="font-editorial-serif text-lg text-[#2D2926] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8B5E3C]" />
                  {t.checkout.choosePickupPoint}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowPointPicker(false)}
                  className="text-[#8C827D] hover:text-[#2D2926] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-3 border-b border-[#E8D1D1] bg-[#FAF3F0]">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#8B5E3C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={pointSearchQuery}
                    onChange={(e) => setPointSearchQuery(e.target.value)}
                    placeholder={t.checkout.searchPointPlaceholder}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E8D1D1] rounded-sm outline-none focus:border-[#2D2926]"
                  />
                </div>
              </div>

              {/* Points List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredPoints.map((point) => (
                  <div
                    key={point.id}
                    onClick={() => {
                      setSelectedPickupPoint(point);
                      setShowPointPicker(false);
                    }}
                    className={`p-3 rounded-sm border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      selectedPickupPoint.id === point.id
                        ? 'border-[#2D2926] bg-[#FAF3F0] ring-1 ring-[#2D2926]'
                        : 'border-[#E8D1D1] hover:bg-[#FAF3F0]/50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#2D2926] flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded-sm bg-[#FAF3F0] text-[#8B5E3C] border border-[#E8D1D1] text-[10px] uppercase font-bold">
                          {point.type === 'zbox' ? 'Z-BOX' : 'Výdejna'}
                        </span>
                        <span>{point.name}</span>
                      </div>
                      <div className="text-[11px] text-[#5D4037] mt-0.5">
                        {point.address}, {point.city} {point.zip}
                      </div>
                    </div>
                    {selectedPickupPoint.id === point.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#2D2926] shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
