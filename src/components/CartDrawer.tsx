import React from 'react';
import { CartItem, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { FREE_SHIPPING_THRESHOLD_CZK, CZK_TO_EUR_RATE } from '../data/candleData';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onStartConfigurator: () => void;
  lang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onStartConfigurator,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const subtotalCzk = items.reduce((acc, item) => acc + item.totalPriceCzk, 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_CZK - subtotalCzk);
  const progressPercent = Math.min(100, (subtotalCzk / FREE_SHIPPING_THRESHOLD_CZK) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2D2926]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF3F0] border-l border-[#E8D1D1] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#E8D1D1] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#8B5E3C]" />
              <h2 className="text-2xl font-editorial-serif font-light text-[#2D2926]">
                {t.cart.title}
              </h2>
              <span className="px-2 py-0.5 rounded-sm bg-[#FAF3F0] border border-[#E8D1D1] text-[#8B5E3C] text-[10.5px] font-medium">
                {items.reduce((sum, item) => sum + item.candle.quantity, 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#5D4037] hover:text-[#2D2926] rounded-sm hover:bg-[#FAF3F0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress bar */}
          <div className="px-5 py-3 bg-[#FAF3F0] border-b border-[#E8D1D1] text-xs text-[#5D4037]">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium text-[11px]">
                  <span>{t.cart.freeShippingProgress(remainingForFreeShipping)}</span>
                  <span className="font-semibold text-[#8B5E3C]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#E8D1D1] rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-[#8B5E3C] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 font-medium text-[#8B5E3C] text-xs">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.cart.freeShippingUnlocked}</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-[#E8D1D1] flex items-center justify-center text-[#8B5E3C]">
                  <ShoppingBag className="w-7 h-7 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-editorial-serif text-2xl font-light text-[#2D2926]">
                    {t.cart.empty}
                  </h3>
                  <p className="text-xs text-[#5D4037] max-w-xs mx-auto">
                    {t.cart.emptySub}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartConfigurator();
                  }}
                  className="px-6 py-3 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] transition-colors shadow-xs"
                >
                  {t.cart.startCreating}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-sm border border-[#E8D1D1] shadow-xs space-y-3 relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-medium text-[#8B5E3C] tracking-[0.15em] block">
                        {t.cart.customCandleLabel}
                      </span>
                      <h4 className="text-base font-editorial-serif font-medium text-[#2D2926] truncate">
                        {lang === 'cs' ? item.scent.nameCs : item.scent.nameEn}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#8C827D] hover:text-[#8B5E3C] p-1 transition-colors"
                      title={t.cart.remove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Specs Pill list */}
                  <div className="space-y-1 text-xs text-[#5D4037] bg-[#FAF3F0]/60 p-2.5 rounded-sm border border-[#E8D1D1]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#8C827D]">{t.cart.packaging}:</span>
                      <span className="font-medium text-[#2D2926]">
                        {lang === 'cs' ? item.packaging.nameCs : item.packaging.nameEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#8C827D]">{t.cart.color}:</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block shrink-0 border border-black/10 shadow-xs"
                        style={{ backgroundColor: item.color.hex }}
                      />
                      <span className="font-medium text-[#2D2926]">
                        {lang === 'cs' ? item.color.nameCs.split(' (')[0] : item.color.nameEn.split(' (')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#8C827D]">{t.cart.wick}:</span>
                      <span className="font-medium text-[#2D2926]">
                        {item.candle.wickType === 'wood' ? (lang === 'cs' ? 'Praskající dřevěný' : 'Crackling Wood') : (lang === 'cs' ? 'Bavlněný' : 'Cotton')}
                      </span>
                    </div>
                    {item.candle.customMessage && (
                      <div className="flex items-start gap-1.5 pt-1 border-t border-[#E8D1D1]">
                        <span className="text-[#8C827D] shrink-0">{t.cart.message}:</span>
                        <span className="italic font-editorial-serif text-[#2D2926] line-clamp-2">
                          „{item.candle.customMessage}“
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-[#E8D1D1] rounded-sm bg-white">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.candle.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#5D4037] hover:text-[#2D2926] hover:bg-[#FAF3F0] text-xs font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-[#2D2926]">
                        {item.candle.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.candle.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#5D4037] hover:text-[#2D2926] hover:bg-[#FAF3F0] text-xs font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-editorial-serif font-medium text-[#2D2926]">
                        {item.totalPriceCzk} Kč
                      </span>
                      <span className="text-[10px] text-[#8C827D] block">
                        (~€{(item.totalPriceCzk / CZK_TO_EUR_RATE).toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-[#E8D1D1] space-y-4">
              <div className="space-y-1.5 text-xs text-[#5D4037]">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold text-[#2D2926]">{subtotalCzk} Kč</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.cart.shippingEst}</span>
                  <span className="text-[#8C827D]">
                    {subtotalCzk >= FREE_SHIPPING_THRESHOLD_CZK
                      ? (lang === 'cs' ? 'ZDARMA' : 'FREE')
                      : (lang === 'cs' ? 'od 79 Kč' : 'from 79 CZK')}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-editorial-serif font-medium text-[#2D2926] pt-2 border-t border-[#E8D1D1]">
                  <span>{t.cart.total}</span>
                  <span>{subtotalCzk} Kč <span className="text-xs font-sans font-normal text-[#8C827D]">(~€{(subtotalCzk / CZK_TO_EUR_RATE).toFixed(1)})</span></span>
                </div>
              </div>

              <button
                type="button"
                id="cart-proceed-checkout-btn"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-6 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm font-medium text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>{t.cart.checkoutButton}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8C827D]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <span>{t.cart.secureCheckout}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
