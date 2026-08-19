import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { X, ShieldCheck, FileText, RefreshCw, Cookie } from 'lucide-react';

export type LegalModalType = 'terms' | 'privacy' | 'returns' | 'cookies' | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
  lang: Language;
}

export const LegalModals: React.FC<LegalModalsProps> = ({
  activeModal,
  onClose,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-[#2D2926]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="relative w-full max-w-3xl bg-white rounded-sm border border-[#E8D1D1] shadow-2xl overflow-hidden my-6 max-h-[85vh] flex flex-col animate-scale-up">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8D1D1] flex items-center justify-between bg-[#FAF3F0]">
          <div className="flex items-center gap-2.5">
            {activeModal === 'terms' && <FileText className="w-4 h-4 text-[#8B5E3C]" />}
            {activeModal === 'privacy' && <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" />}
            {activeModal === 'returns' && <RefreshCw className="w-4 h-4 text-[#8B5E3C]" />}
            {activeModal === 'cookies' && <Cookie className="w-4 h-4 text-[#8B5E3C]" />}
            <h2 className="text-xl sm:text-2xl font-editorial-serif font-light text-[#2D2926]">
              {activeModal === 'terms' && t.legal.termsTitle}
              {activeModal === 'privacy' && t.legal.privacyTitle}
              {activeModal === 'returns' && t.legal.returnsTitle}
              {activeModal === 'cookies' && t.legal.cookiesTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8C827D] hover:text-[#2D2926] rounded-sm hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#5D4037] leading-relaxed font-sans">
          {activeModal === 'terms' && (
            <div className="space-y-4">
              <p className="font-semibold text-[#2D2926]">
                1. Úvodní ustanovení a identifikace provozovatele
              </p>
              <p>
                Tyto obchodní podmínky platí pro nákup v internetovém obchodě MERAK svíčky provozovaném společností MERAK svíčky s.r.o., IČO: 19482012, se sídlem Křižíkova 148/34, 186 00 Praha 8. Podmínky blíže vymezují a upřesňují práva a povinnosti prodávajícího a kupujícího v souladu se zákonem č. 89/2012 Sb., občanský zákoník.
              </p>
              <p className="font-semibold text-[#2D2926]">
                2. Objednávka a uzavření kupní smlouvy
              </p>
              <p>
                Kupující si prostřednictvím online konfigurátoru navolí specifikace své svíčky (vůně, barva vosku, obal, typ knotu a volitelný text na etiketě). Odesláním objednávky vzniká závazná kupní smlouva. Prodávající neprodleně potvrdí přijetí objednávky automatickým e-mailem s platebními údaji.
              </p>
              <p className="font-semibold text-[#2D2926]">
                3. Platební podmínky a dodání
              </p>
              <p>
                Platbu lze provést okamžitou QR platbou (převodem na bankovní účet 2401928471/2010), platební kartou online nebo na dobírku. Zboží je doručováno prostřednictvím sítě Zásilkovna / Packeta (výdejní místa, Z-BOXy) nebo kurýrem na adresu. Při objednávce nad 1 200 Kč je doprava do Zásilkovny zdarma.
              </p>
              <p className="font-semibold text-[#2D2926]">
                4. Zboží upravené na míru (Zakázková výroba)
              </p>
              <p>
                U svíček opatřených individuálním personalizovaným textem na etiketě na přání zákazníka nelze v souladu s § 1837 písm. d) občanského zákoníku uplatnit odstoupení od smlouvy bez udání důvodu do 14 dnů, s výjimkou vadného plnění či poškození při přepravě.
              </p>
            </div>
          )}

          {activeModal === 'privacy' && (
            <div className="space-y-4">
              <p className="font-semibold text-[#2D2926]">
                1. Správce osobních údajů
              </p>
              <p>
                Správcem osobních údajů je MERAK svíčky s.r.o. (info@merak-svicky.cz). Vaše osobní údaje zpracováváme v souladu s Nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR).
              </p>
              <p className="font-semibold text-[#2D2926]">
                2. Účel zpracování údajů
              </p>
              <p>
                Zpracováváme vaše jméno, e-mail, telefon a doručovací adresu za účelem vyřízení objednávky, expedice přes přepravce Zásilkovna s.r.o. a vystavení daňového dokladu.
              </p>
              <p className="font-semibold text-[#2D2926]">
                3. Práva subjektu údajů
              </p>
              <p>
                Máte právo na přístup ke svým osobním údajům, jejich opravu, výmaz či omezení zpracování, a to kontaktováním na e-mail info@merak-svicky.cz.
              </p>
            </div>
          )}

          {activeModal === 'returns' && (
            <div className="space-y-4">
              <p className="font-semibold text-[#2D2926]">
                1. Reklamace vadného zboží
              </p>
              <p>
                Pokud vám svíčka dorazí poškozená (např. prasklé sklo při přepravě) nebo neodpovídá zvolené konfiguraci, pošlete nám fotografii na info@merak-svicky.cz. Obratem vám zdarma vyrobíme a zašleme nový kus.
              </p>
              <p className="font-semibold text-[#2D2926]">
                2. Postup vrácení standardního zboží
              </p>
              <p>
                Standardní dárkové sety a svíčky bez individuálního potisku můžete vrátit nepoškozené a nepoužité do 14 dnů od převzetí. Náklady na vrácení hradí kupující.
              </p>
            </div>
          )}

          {activeModal === 'cookies' && (
            <div className="space-y-4">
              <p className="font-semibold text-[#2D2926]">
                Informace o souborech cookies
              </p>
              <p>
                Používáme nezbytné technické cookies pro uložení stavu nákupního košíku a zvoleného jazyka (čeština/angličtina). Žádné osobní údaje nepředáváme třetím stranám k reklamním účelům.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF3F0] border-t border-[#E8D1D1] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] transition-colors"
          >
            {lang === 'cs' ? 'Zavřít' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CookieBanner: React.FC<{ lang: Language }> = ({ lang }) => {
  const [accepted, setAccepted] = useState<boolean>(true);

  useEffect(() => {
    const isConsent = localStorage.getItem('merak_cookie_consent');
    if (!isConsent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('merak_cookie_consent', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#2D2926] text-white p-4 sm:p-5 rounded-sm shadow-2xl border border-[#FAF3F0]/20 space-y-3 animate-fade-in text-xs font-sans">
      <div className="flex items-start gap-3">
        <Cookie className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
        <p className="text-[#FAF3F0]/80 leading-relaxed text-[11.5px]">
          {lang === 'cs'
            ? 'Tento web používá nezbytné soubory cookies pro správné fungování konfigurátoru a ukládání košíku.'
            : 'This website uses essential cookies for the custom candle configurator and cart state.'}
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={handleAccept}
          className="px-4 py-2 bg-white hover:bg-[#FAF3F0] text-[#2D2926] rounded-sm font-medium text-[11px] uppercase tracking-[0.15em] transition-colors shadow-xs"
        >
          {lang === 'cs' ? 'Rozumím a přijímám' : 'Accept & Continue'}
        </button>
      </div>
    </div>
  );
};
