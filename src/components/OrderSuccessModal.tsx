import React, { useEffect, useRef, useState } from 'react';
import { Order, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { CZK_TO_EUR_RATE } from '../data/candleData';
import QRCode from 'qrcode';
import {
  CheckCircle,
  Copy,
  Check,
  Mail,
  QrCode,
  Package,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onStartNewCandle: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  lang,
  onStartNewCandle,
}) => {
  const t = TRANSLATIONS[lang];
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showEmailViewer, setShowEmailViewer] = useState<boolean>(false);

  // Bank details
  const accountNumber = '2401928471 / 2010';
  const iban = 'CZ55 2010 0000 0024 0192 8471';
  const rawIban = 'CZ5520100000002401928471';
  const varSymbol = order.id.replace(/\D/g, '') || '20268492';

  // Standard Czech SPAYD (Short Payment Descriptor) string
  const spaydString = `SPD*1.0*ACC:${rawIban}*AM:${order.totalCzk}.00*CC:CZK*RN:MERAK svíčky*X-VS:${varSymbol}*MSG:Objednávka ${order.id} MERAK*`;

  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        spaydString,
        {
          width: 190,
          margin: 1,
          color: {
            dark: '#2C2523',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('QR generation error:', error);
        }
      );
    }
  }, [spaydString, isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D2926]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="relative w-full max-w-3xl bg-[#FAF3F0] rounded-sm border border-[#E8D1D1] shadow-2xl overflow-hidden my-6 animate-scale-up">
        {/* Top Banner */}
        <div className="bg-[#2D2926] text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="w-12 h-12 bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-sm flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-editorial-serif font-light mb-1">
            {t.orderSuccess.title}
          </h2>
          <p className="text-[#FAF3F0]/80 text-xs sm:text-sm max-w-md mx-auto">
            {t.orderSuccess.orderReceivedDesc} <strong className="text-[#D4AF37]">{order.customer.email}</strong>
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-white/5 border border-white/15 text-xs font-mono">
            <span className="text-[#FAF3F0]/60">{t.orderSuccess.orderNumber}</span>
            <span className="font-bold text-[#D4AF37]">{order.id}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick Action: View automated email */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowEmailViewer(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white hover:bg-[#FAF3F0] text-[#8B5E3C] text-xs font-medium border border-[#E8D1D1] transition-all shadow-xs"
            >
              <Mail className="w-4 h-4 text-[#8B5E3C]" />
              <span>{t.orderSuccess.simulatedInboxBtn}</span>
            </button>
          </div>

          {/* QR Payment Section */}
          <div className="bg-white rounded-sm p-6 border border-[#E8D1D1] shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-4 h-4 text-[#8B5E3C]" />
              <h3 className="font-editorial-serif text-xl font-light text-[#2D2926]">
                {t.orderSuccess.qrHeading}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* QR Code Canvas */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-[#FAF3F0]/40 rounded-sm border border-[#E8D1D1]">
                <canvas ref={qrCanvasRef} className="rounded-sm shadow-xs max-w-full" />
                <span className="text-[10px] text-[#8C827D] font-medium mt-2 text-center">
                  Standard České bankovní asociace (SPAYD)
                </span>
              </div>

              {/* Bank Details Text */}
              <div className="md:col-span-7 space-y-2.5 text-xs text-[#5D4037]">
                <p className="text-[#8C827D] text-[11px] mb-2 leading-relaxed">
                  {t.orderSuccess.qrInstructions}
                </p>

                {/* Amount */}
                <div className="flex items-center justify-between p-2 rounded-sm bg-[#FAF3F0]/60 border border-[#E8D1D1]">
                  <span className="font-medium text-[#5D4037]">{t.orderSuccess.amountToPay}</span>
                  <span className="text-base font-editorial-serif font-medium text-[#2D2926]">
                    {order.totalCzk} Kč <span className="text-xs font-sans font-normal text-[#8C827D]">(~€{(order.totalCzk / CZK_TO_EUR_RATE).toFixed(1)})</span>
                  </span>
                </div>

                {/* Account Number */}
                <div className="flex items-center justify-between p-2 rounded-sm bg-white border border-[#E8D1D1]">
                  <div>
                    <span className="text-[10px] text-[#8C827D] block uppercase tracking-wider">{t.orderSuccess.accountNumber}</span>
                    <span className="font-mono font-semibold text-[#2D2926]">{accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('2401928471/2010', 'account')}
                    className="p-1.5 text-[#8C827D] hover:text-[#2D2926]"
                    title="Kopírovat"
                  >
                    {copiedField === 'account' ? <Check className="w-4 h-4 text-[#8B5E3C]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Variable Symbol */}
                <div className="flex items-center justify-between p-2 rounded-sm bg-white border border-[#E8D1D1]">
                  <div>
                    <span className="text-[10px] text-[#8C827D] block uppercase tracking-wider">{t.orderSuccess.varSymbol}</span>
                    <span className="font-mono font-semibold text-[#2D2926]">{varSymbol}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(varSymbol, 'vs')}
                    className="p-1.5 text-[#8C827D] hover:text-[#2D2926]"
                    title="Kopírovat"
                  >
                    {copiedField === 'vs' ? <Check className="w-4 h-4 text-[#8B5E3C]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* IBAN */}
                <div className="flex items-center justify-between p-2 rounded-sm bg-white border border-[#E8D1D1]">
                  <div>
                    <span className="text-[10px] text-[#8C827D] block uppercase tracking-wider">{t.orderSuccess.iban}</span>
                    <span className="font-mono text-[11px] font-semibold text-[#2D2926]">{iban}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(rawIban, 'iban')}
                    className="p-1.5 text-[#8C827D] hover:text-[#2D2926]"
                    title="Kopírovat"
                  >
                    {copiedField === 'iban' ? <Check className="w-4 h-4 text-[#8B5E3C]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Candle Specifications Breakdown */}
          <div className="bg-white rounded-sm p-6 border border-[#E8D1D1] space-y-3">
            <h4 className="font-editorial-serif text-lg font-light text-[#2D2926]">
              {t.orderSuccess.candleSpecsTitle}
            </h4>

            {order.items.map((item) => (
              <div key={item.id} className="p-3 bg-[#FAF3F0]/50 rounded-sm border border-[#E8D1D1] space-y-1.5 text-xs">
                <div className="flex justify-between font-editorial-serif font-medium text-sm text-[#2D2926]">
                  <span>{item.candle.quantity}× {lang === 'cs' ? item.scent.nameCs : item.scent.nameEn}</span>
                  <span>{item.totalPriceCzk} Kč</span>
                </div>
                <div className="text-[#5D4037] text-[11.5px] space-y-0.5">
                  <div>• {t.cart.packaging} {lang === 'cs' ? item.packaging.nameCs : item.packaging.nameEn}</div>
                  <div>• {t.cart.color} {lang === 'cs' ? item.color.nameCs.split(' (')[0] : item.color.nameEn.split(' (')[0]}</div>
                  <div>• {t.cart.wick} {item.candle.wickType === 'wood' ? (lang === 'cs' ? 'Praskající dřevěný' : 'Crackling Wood') : (lang === 'cs' ? 'Bavlněný' : 'Cotton')}</div>
                  {item.candle.customMessage && (
                    <div className="italic text-[#2D2926] font-editorial-serif pt-1">
                      • {t.cart.message} „{item.candle.customMessage}“
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Delivery point info */}
            {order.pickupPoint && (
              <div className="text-xs text-[#5D4037] pt-2 border-t border-[#E8D1D1] flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                <span>
                  <strong>Zásilkovna:</strong> {order.pickupPoint.name} ({order.pickupPoint.address}, {order.pickupPoint.city})
                </span>
              </div>
            )}
          </div>

          {/* Next Steps Roadmap */}
          <div className="bg-[#FAF3F0] rounded-sm p-5 border border-[#E8D1D1] text-xs space-y-3">
            <h4 className="font-editorial-serif text-lg font-light text-[#2D2926] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8B5E3C]" />
              {t.orderSuccess.nextSteps}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#5D4037]">
              <div className="p-3 bg-white rounded-sm border border-[#E8D1D1]">
                <div className="font-medium text-[#8B5E3C] text-[11px] uppercase tracking-wider mb-1">1. Ruční lití</div>
                <p className="text-[11px] leading-relaxed">{t.orderSuccess.step1Text}</p>
              </div>
              <div className="p-3 bg-white rounded-sm border border-[#E8D1D1]">
                <div className="font-medium text-[#8B5E3C] text-[11px] uppercase tracking-wider mb-1">2. Zrání & Balení</div>
                <p className="text-[11px] leading-relaxed">{t.orderSuccess.step2Text}</p>
              </div>
              <div className="p-3 bg-white rounded-sm border border-[#E8D1D1]">
                <div className="font-medium text-[#8B5E3C] text-[11px] uppercase tracking-wider mb-1">3. Expedice Zásilkovnou</div>
                <p className="text-[11px] leading-relaxed">{t.orderSuccess.step3Text}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-[#E8D1D1] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartNewCandle();
            }}
            className="w-full sm:w-auto px-6 py-3 border border-[#E8D1D1] hover:bg-[#FAF3F0] rounded-sm font-medium text-[11px] uppercase tracking-[0.2em] text-[#2D2926] transition-colors"
          >
            {t.orderSuccess.createAnother}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-3 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm font-medium text-[11px] uppercase tracking-[0.2em] transition-colors shadow-xs"
          >
            {t.orderSuccess.backToHome}
          </button>
        </div>

        {/* Simulated Automated Email Modal */}
        {showEmailViewer && (
          <div className="fixed inset-0 z-70 bg-[#2D2926]/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-sm max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#E8D1D1] overflow-hidden animate-scale-up">
              {/* Email Client Header Bar */}
              <div className="bg-[#2D2926] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-medium">{t.orderSuccess.simulatedInboxTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailViewer(false)}
                  className="text-white/60 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Email Metadata */}
              <div className="p-4 bg-[#FAF3F0] border-b border-[#E8D1D1] text-xs space-y-1 text-[#5D4037] font-mono">
                <div><strong>Od / From:</strong> objednavky@merak-svicky.cz (MERAK svíčky)</div>
                <div><strong>Komu / To:</strong> {order.customer.name} &lt;{order.customer.email}&gt;</div>
                <div><strong>Předmět / Subject:</strong> Potvrzení objednávky {order.id} — MERAK svíčky</div>
                <div><strong>Datum / Date:</strong> {new Date().toLocaleString()}</div>
              </div>

              {/* Email Content HTML simulation */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-[#2D2926] font-sans leading-relaxed bg-[#FAF3F0]/40">
                <div className="text-center pb-4 border-b border-[#E8D1D1]">
                  <span className="font-editorial-serif text-2xl tracking-[0.25em] text-[#2D2926] uppercase block font-normal">
                    MERAK
                  </span>
                  <span className="text-[10px] text-[#8B5E3C] tracking-wider uppercase">
                    Ručně vyráběné sójové svíčky na míru
                  </span>
                </div>

                <p>Milá/milý <strong>{order.customer.name}</strong>,</p>
                <p>
                  Děkujeme vám za důvěru a za vytvoření vlastní unikátní svíčky MERAK! Vaši objednávku <strong>{order.id}</strong> jsme úspěšně přijali do systému naší dílny.
                </p>

                <div className="p-4 bg-white rounded-sm border border-[#E8D1D1] space-y-2">
                  <div className="font-editorial-serif text-sm font-medium text-[#2D2926] border-b border-[#FAF3F0] pb-1">
                    Shrnutí vaší svíčky na míru:
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="font-semibold text-[#8B5E3C]">• {item.scent.nameCs}</div>
                      <div className="text-[#5D4037] pl-3">Obal: {item.packaging.nameCs}</div>
                      <div className="text-[#5D4037] pl-3">Barva vosku: {item.color.nameCs}</div>
                      <div className="text-[#5D4037] pl-3">Knot: {item.candle.wickType === 'wood' ? 'Praskající dřevěný' : 'Bavlněný'}</div>
                      {item.candle.customMessage && (
                        <div className="text-[#2D2926] pl-3 italic font-editorial-serif">Věnování: „{item.candle.customMessage}“</div>
                      )}
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#E8D1D1] flex justify-between font-editorial-serif text-base font-medium text-[#2D2926]">
                    <span>Celková částka k úhradě:</span>
                    <span>{order.totalCzk} Kč</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-sm border border-[#E8D1D1] space-y-1.5">
                  <div className="font-medium text-[#8B5E3C] uppercase text-[11px] tracking-wider">Podklady pro QR platbu / Bankovní převod:</div>
                  <div>Číslo účtu: <strong>2401928471 / 2010</strong> (Fio banka)</div>
                  <div>Variabilní symbol: <strong>{varSymbol}</strong></div>
                  <div>Částka: <strong>{order.totalCzk} Kč</strong></div>
                  <div>IBAN: <strong>{rawIban}</strong></div>
                </div>

                <p className="text-[#5D4037]">
                  Jakmile platbu obdržíme, začneme s láskou tvořit vaši svíčku. O odeslání Zásilkovnou vás budeme informovat dalším e-mailem se sledovacím číslem.
                </p>

                <div className="pt-4 border-t border-[#E8D1D1] text-[#8C827D] text-[11px]">
                  S láskou,<br />
                  <strong>Tým MERAK svíčky</strong><br />
                  Křižíkova 148/34, Praha 8 – Karlín | www.merak-svicky.cz
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
