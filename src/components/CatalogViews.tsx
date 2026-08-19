import React, { useState } from 'react';
import { Language, NavView, Scent, CandleColor, Packaging, GiftSet, Review } from '../types';
import { TRANSLATIONS } from '../translations';
import {
  SCENTS_DATA,
  CANDLE_COLORS_DATA,
  PACKAGING_DATA,
  GIFT_SETS_DATA,
  REVIEWS_DATA,
  BASE_CANDLE_PRICE_CZK
} from '../data/candleData';
import {
  Sparkles,
  Flame,
  Layers,
  Heart,
  Droplet,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Gift,
  Award,
  Leaf,
  Clock,
  ArrowRight
} from 'lucide-react';

interface CatalogViewsProps {
  view: NavView;
  lang: Language;
  onSelectScentForConfigurator: (scentId: string) => void;
  onSelectColorForConfigurator: (colorId: string) => void;
  onSelectPackagingForConfigurator: (packagingId: string) => void;
  onAddToCartGiftSet: (gift: GiftSet) => void;
  onNavigate: (view: NavView) => void;
}

export const CatalogViews: React.FC<CatalogViewsProps> = ({
  view,
  lang,
  onSelectScentForConfigurator,
  onSelectColorForConfigurator,
  onSelectPackagingForConfigurator,
  onAddToCartGiftSet,
  onNavigate,
}) => {
  const t = TRANSLATIONS[lang];

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Scent filter
  const [scentFilter, setScentFilter] = useState('all');

  const faqs = [
    {
      qCs: 'Z jakého vosku jsou svíčky MERAK vyráběny?',
      qEn: 'What wax is used in MERAK candles?',
      aCs: 'Používáme výhradně 100% čistý sójový vosk z obnovitelných zdrojů. Na rozdíl od parafínu neobsahuje ropné deriváty, hoří až o 50 % déle a nevylučuje karcinogenní látky.',
      aEn: 'We use exclusively 100% natural soy wax from renewable sources. Unlike paraffin, it contains zero petroleum distillates, burns up to 50% longer, and produces no toxic soot.'
    },
    {
      qCs: 'Jak funguje dřevěný knot?',
      qEn: 'How does the wooden wick work?',
      aCs: 'Dřevěný knot je vyroben z netoxického udržitelného tvrdého dřeva. Při hoření vydává jemný a uklidňující zvuk praskajícího krbu a zajišťuje rovnoměrné tání voskového jezírka.',
      aEn: 'Our wooden wick is crafted from untreated sustainable hardwood. When lit, it produces a soothing crackling fireplace sound and ensures optimal wax melting.'
    },
    {
      qCs: 'Jak dlouho trvá výroba a doručení?',
      qEn: 'How long does production and delivery take?',
      aCs: 'Jelikož každou svíčku odléváme na míru podle vaší konfigurace, výroba a vyzrání trvá 1–2 pracovní dny. Poté balíček předáváme Zásilkovně (doručení do 24–48 hodin).',
      aEn: 'Since every candle is poured bespoke to your exact combination, handcrafting and curing takes 1–2 business days, followed by Packeta delivery (1–2 days).'
    },
    {
      qCs: 'Mohu si obal po vyhoření svíčky nechat a znovu použít?',
      qEn: 'Can I repurpose the jar after burning?',
      aCs: 'Určitě! Všechny naše keramické, skleněné i betonové obaly jsou navrženy pro druhý život – stačí vymýt zbytek sójového vosku teplou mýdlovou vodou a obal můžete použít jako šálek, květináč nebo dózu.',
      aEn: 'Absolutely! All our ceramic, glass, and concrete vessels are circular by design — just wash the soy residue with warm soapy water and repurpose as an espresso cup, planter, or catchall.'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
    setTimeout(() => setContactSent(false), 5000);
  };

  // 1. SCENTS VIEW
  if (view === 'scents') {
    const filteredScents =
      scentFilter === 'all'
        ? SCENTS_DATA
        : SCENTS_DATA.filter((s) => s.family === scentFilter);

    return (
      <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in font-sans">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-medium text-[#8B5E3C] uppercase tracking-[0.25em]">
            {lang === 'cs' ? 'Aromaterapie & Parfémy' : 'Aromatherapy & Botanical Perfumes'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif font-light text-[#2D2926]">
            {t.scentsPage.title}
          </h2>
          <p className="text-[#5D4037] text-sm sm:text-base leading-relaxed">
            {t.scentsPage.subtitle}
          </p>

          {/* Scent family filter */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {[
              { id: 'all', label: t.scentsPage.filterAll },
              { id: 'floral', label: t.scentsPage.filterFloral },
              { id: 'woody', label: t.scentsPage.filterWoody },
              { id: 'citrus', label: t.scentsPage.filterCitrus },
              { id: 'gourmand', label: t.scentsPage.filterGourmand },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setScentFilter(f.id)}
                className={`px-4 py-1.5 rounded-sm text-[11px] font-medium uppercase tracking-[0.15em] transition-all ${
                  scentFilter === f.id
                    ? 'bg-[#2D2926] text-white shadow-xs'
                    : 'bg-white hover:bg-[#FAF3F0] text-[#5D4037] border border-[#E8D1D1]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScents.map((scent) => (
            <div
              key={scent.id}
              className="bg-white rounded-sm p-6 sm:p-7 border border-[#E8D1D1] shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: scent.colorHint }}
                  />
                  <span className="text-[10px] font-medium text-[#8B5E3C] uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-sm bg-[#FAF3F0] border border-[#E8D1D1]">
                    {scent.family}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-editorial-serif font-light text-[#2D2926]">
                    {lang === 'cs' ? scent.nameCs : scent.nameEn}
                  </h3>
                  <p className="text-xs text-[#8B5E3C] italic font-editorial-serif mt-0.5">
                    „{lang === 'cs' ? scent.moodCs : scent.moodEn}“
                  </p>
                </div>

                <p className="text-xs text-[#5D4037] leading-relaxed">
                  {lang === 'cs' ? scent.descriptionCs : scent.descriptionEn}
                </p>

                {/* Fragrance pyramid breakdown */}
                <div className="p-3.5 bg-[#FAF3F0]/60 rounded-sm border border-[#E8D1D1] text-xs space-y-1.5 text-[#5D4037]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-[#8B5E3C] text-[10.5px] uppercase tracking-wider">Hlava / Top:</span>
                    <span className="truncate">{lang === 'cs' ? scent.topNotesCs : scent.topNotesEn}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-[#8B5E3C] text-[10.5px] uppercase tracking-wider">Srdce / Heart:</span>
                    <span className="truncate">{lang === 'cs' ? scent.middleNotesCs : scent.middleNotesEn}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-[#8B5E3C] text-[10.5px] uppercase tracking-wider">Základ / Base:</span>
                    <span className="truncate">{lang === 'cs' ? scent.baseNotesCs : scent.baseNotesEn}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectScentForConfigurator(scent.id)}
                className="mt-6 w-full py-2.5 px-4 bg-[#FAF3F0] hover:bg-[#2D2926] text-[#5D4037] hover:text-white border border-[#E8D1D1] hover:border-[#2D2926] rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-1.5"
              >
                <span>{t.scentsPage.createWithThis}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. COLORS VIEW
  if (view === 'colors') {
    return (
      <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in font-sans">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-medium text-[#8B5E3C] uppercase tracking-[0.25em]">
            {lang === 'cs' ? 'Přírodní pigmenty' : 'Natural Botanical Pigments'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif font-light text-[#2D2926]">
            {t.colorsPage.title}
          </h2>
          <p className="text-[#5D4037] text-sm sm:text-base leading-relaxed">
            {t.colorsPage.subtitle}
          </p>
        </div>

        {/* Colors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CANDLE_COLORS_DATA.map((col) => (
            <div
              key={col.id}
              className="bg-white rounded-sm p-6 sm:p-7 border border-[#E8D1D1] shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Color swatch */}
                <div
                  className="w-full h-32 rounded-sm flex items-center justify-center relative overflow-hidden border border-[#E8D1D1]"
                  style={{
                    background: `linear-gradient(135deg, ${col.hex}, ${col.secondaryHex || col.hex})`,
                  }}
                >
                  <div className="px-3 py-1 bg-white/90 backdrop-blur-xs rounded-sm text-[11px] font-mono font-medium text-[#2D2926] shadow-xs border border-[#E8D1D1]">
                    {col.hex}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-editorial-serif font-light text-[#2D2926]">
                    {lang === 'cs' ? col.nameCs : col.nameEn}
                  </h3>
                  <span className="text-xs text-[#8B5E3C] font-editorial-serif italic block mt-0.5">
                    „{lang === 'cs' ? col.moodCs : col.moodEn}“
                  </span>
                </div>

                <p className="text-xs text-[#5D4037] leading-relaxed">
                  {lang === 'cs' ? col.descriptionCs : col.descriptionEn}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectColorForConfigurator(col.id)}
                className="mt-6 w-full py-2.5 px-4 bg-[#FAF3F0] hover:bg-[#2D2926] text-[#5D4037] hover:text-white border border-[#E8D1D1] hover:border-[#2D2926] rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-1.5"
              >
                <span>{t.colorsPage.createWithThis}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. PACKAGING VIEW
  if (view === 'packaging') {
    return (
      <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in font-sans">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-medium text-[#8B5E3C] uppercase tracking-[0.25em]">
            {lang === 'cs' ? 'Designové sklo & keramika' : 'Artisan Glass & Ceramic Vessels'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif font-light text-[#2D2926]">
            {t.packagingPage.title}
          </h2>
          <p className="text-[#5D4037] text-sm sm:text-base leading-relaxed">
            {t.packagingPage.subtitle}
          </p>
        </div>

        {/* Packaging Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGING_DATA.map((pack) => (
            <div
              key={pack.id}
              className="bg-white rounded-sm p-6 sm:p-7 border border-[#E8D1D1] shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-sm bg-[#FAF3F0] border border-[#E8D1D1] text-[#8B5E3C] uppercase tracking-wider">
                    {pack.volume}
                  </span>
                  <span className="text-xs font-medium text-[#5D4037] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    {pack.burnTime}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-editorial-serif font-light text-[#2D2926]">
                    {lang === 'cs' ? pack.nameCs : pack.nameEn}
                  </h3>
                  <span className="text-xs text-[#8B5E3C] block mt-0.5">
                    {lang === 'cs' ? pack.materialCs : pack.materialEn}
                  </span>
                </div>

                <p className="text-xs text-[#5D4037] leading-relaxed">
                  {lang === 'cs' ? pack.descriptionCs : pack.descriptionEn}
                </p>

                <div className="p-3.5 bg-[#FAF3F0]/60 rounded-sm border border-[#E8D1D1] text-xs space-y-1 text-[#5D4037]">
                  <div>
                    <strong className="text-[#2D2926]">Víčko / Lid:</strong> {lang === 'cs' ? pack.lidCs : pack.lidEn}
                  </div>
                  <div>
                    <strong className="text-[#2D2926]">{lang === 'cs' ? 'Příplatek k základu:' : 'Price modifier:'}</strong>{' '}
                    {pack.priceModifier === 0 ? (lang === 'cs' ? 'Základní cena (490 Kč)' : 'Base 490 CZK') : `+${pack.priceModifier} Kč`}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPackagingForConfigurator(pack.id)}
                className="mt-6 w-full py-2.5 px-4 bg-[#FAF3F0] hover:bg-[#2D2926] text-[#5D4037] hover:text-white border border-[#E8D1D1] hover:border-[#2D2926] rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-1.5"
              >
                <span>{t.packagingPage.createWithThis}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. GIFTS VIEW
  if (view === 'gifts') {
    return (
      <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in font-sans">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-medium text-[#8B5E3C] uppercase tracking-[0.25em]">
            {lang === 'cs' ? 'Dárky s duší' : 'Curated Gift Sets'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif font-light text-[#2D2926]">
            {t.giftsPage.title}
          </h2>
          <p className="text-[#5D4037] text-sm sm:text-base leading-relaxed">
            {t.giftsPage.subtitle}
          </p>
        </div>

        {/* Gift sets grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GIFT_SETS_DATA.map((gift) => (
            <div
              key={gift.id}
              className="bg-white rounded-sm p-6 sm:p-7 border border-[#E8D1D1] shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-0.5 rounded-sm bg-[#FAF3F0] text-[#8B5E3C] border border-[#E8D1D1] text-[10.5px] font-medium uppercase tracking-wider">
                  {lang === 'cs' ? gift.tagCs : gift.tagEn}
                </span>

                <div>
                  <h3 className="text-2xl font-editorial-serif font-light text-[#2D2926]">
                    {lang === 'cs' ? gift.nameCs : gift.nameEn}
                  </h3>
                  <div className="text-2xl font-editorial-serif font-medium text-[#2D2926] mt-1">
                    {gift.priceCzk} Kč
                  </div>
                </div>

                <p className="text-xs text-[#5D4037] leading-relaxed">
                  {lang === 'cs' ? gift.descriptionCs : gift.descriptionEn}
                </p>

                <div className="p-3.5 bg-[#FAF3F0]/60 rounded-sm border border-[#E8D1D1] text-xs space-y-1.5">
                  <div className="font-semibold text-[#2D2926] mb-1">
                    {lang === 'cs' ? 'Obsah dárkového balení:' : 'Gift box contents:'}
                  </div>
                  {(lang === 'cs' ? gift.itemsCs : gift.itemsEn).map((it, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[#5D4037]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onAddToCartGiftSet(gift)}
                className="mt-6 w-full py-3 px-4 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Gift className="w-4 h-4" />
                <span>{t.giftsPage.addToCart}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Corporate / Wedding Inquiries Banner */}
        <div className="bg-[#FAF3F0] rounded-sm p-8 sm:p-10 border border-[#E8D1D1] text-center space-y-4 max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-editorial-serif font-light text-[#2D2926]">
            {t.giftsPage.customCorporate}
          </h3>
          <p className="text-[#5D4037] text-sm max-w-xl mx-auto leading-relaxed">
            {t.giftsPage.customCorporateDesc}
          </p>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] transition-colors shadow-xs"
          >
            {t.giftsPage.contactUs}
          </button>
        </div>
      </div>
    );
  }

  // 5. ABOUT US VIEW
  if (view === 'about') {
    return (
      <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 animate-fade-in font-sans">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-medium text-[#8B5E3C] uppercase tracking-[0.25em]">
            {lang === 'cs' ? 'Poctivé řemeslo' : 'Artisan Handcraft & Slow Living'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif font-light text-[#2D2926]">
            {t.aboutPage.title}
          </h2>
          <p className="text-[#5D4037] text-base sm:text-lg font-editorial-serif italic max-w-2xl mx-auto">
            {t.aboutPage.subtitle}
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-sm p-8 sm:p-12 border border-[#E8D1D1] shadow-xs space-y-6 text-[#5D4037] text-sm sm:text-base leading-relaxed font-sans">
          <p>{t.aboutPage.storyP1}</p>
          <p>{t.aboutPage.storyP2}</p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl sm:text-3xl font-editorial-serif font-light text-[#2D2926] text-center">
            {t.aboutPage.valuesTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-sm border border-[#E8D1D1] shadow-xs space-y-2.5">
              <Leaf className="w-5 h-5 text-[#8B5E3C]" />
              <h4 className="font-editorial-serif text-xl text-[#2D2926]">{t.aboutPage.val1Title}</h4>
              <p className="text-xs text-[#5D4037] leading-relaxed">{t.aboutPage.val1Desc}</p>
            </div>
            <div className="p-6 bg-white rounded-sm border border-[#E8D1D1] shadow-xs space-y-2.5">
              <Award className="w-5 h-5 text-[#8B5E3C]" />
              <h4 className="font-editorial-serif text-xl text-[#2D2926]">{t.aboutPage.val2Title}</h4>
              <p className="text-xs text-[#5D4037] leading-relaxed">{t.aboutPage.val2Desc}</p>
            </div>
            <div className="p-6 bg-white rounded-sm border border-[#E8D1D1] shadow-xs space-y-2.5">
              <Layers className="w-5 h-5 text-[#8B5E3C]" />
              <h4 className="font-editorial-serif text-xl text-[#2D2926]">{t.aboutPage.val3Title}</h4>
              <p className="text-xs text-[#5D4037] leading-relaxed">{t.aboutPage.val3Desc}</p>
            </div>
            <div className="p-6 bg-white rounded-sm border border-[#E8D1D1] shadow-xs space-y-2.5">
              <Sparkles className="w-5 h-5 text-[#8B5E3C]" />
              <h4 className="font-editorial-serif text-xl text-[#2D2926]">{t.aboutPage.val4Title}</h4>
              <p className="text-xs text-[#5D4037] leading-relaxed">{t.aboutPage.val4Desc}</p>
            </div>
          </div>
        </div>

        {/* Reviews Carousel/Grid */}
        <div className="space-y-6 pt-6 border-t border-[#E8D1D1]">
          <h3 className="text-2xl sm:text-3xl font-editorial-serif font-light text-[#2D2926] text-center">
            {lang === 'cs' ? 'Co o nás říkají zákazníci' : 'What Our Customers Say'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS_DATA.map((rev) => (
              <div key={rev.id} className="p-6 bg-white rounded-sm border border-[#E8D1D1] shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex text-[#D4AF37] text-sm tracking-wider">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p className="text-xs text-[#5D4037] italic font-editorial-serif leading-relaxed text-[13px]">
                    „{lang === 'cs' ? rev.textCs : rev.textEn}“
                  </p>
                </div>
                <div className="pt-3 border-t border-[#FAF3F0] text-[11px]">
                  <div className="font-semibold text-[#2D2926]">{rev.author}, {rev.city}</div>
                  <div className="text-[#8B5E3C]">{lang === 'cs' ? rev.candleComboCs : rev.candleComboEn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 6. CONTACT VIEW
  if (view === 'contact') {
    return (
      <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-fade-in font-sans">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-medium text-[#8B5E3C] uppercase tracking-[0.25em]">
            {lang === 'cs' ? 'Jsme tu pro vás' : 'We are here for you'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif font-light text-[#2D2926]">
            {t.contactPage.title}
          </h2>
          <p className="text-[#5D4037] text-sm sm:text-base leading-relaxed">
            {t.contactPage.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 bg-white rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-xs space-y-6">
            <h3 className="text-2xl font-editorial-serif font-light text-[#2D2926]">
              {t.contactPage.workshopAddressTitle}
            </h3>

            <div className="space-y-4 text-xs text-[#5D4037]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#8B5E3C] shrink-0 mt-0.5" />
                <span>{t.contactPage.workshopAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                <a href="mailto:info@merak-svicky.cz" className="hover:text-[#8B5E3C] underline font-medium">
                  {t.contactPage.emailValue}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                <span>{t.contactPage.phoneValue}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D1D1] text-xs text-[#8C827D]">
              <p className="leading-relaxed">
                {lang === 'cs'
                  ? 'Osobní odběry a konzultace vůní v dílně jsou možné po předchozí domluvě.'
                  : 'Studio pickups and bespoke scent consultations are available by prior appointment.'}
              </p>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-white rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-xs">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              {contactSent && (
                <div className="p-3 bg-[#FAF3F0] border border-[#D4AF37] rounded-sm text-xs text-[#8B5E3C] font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                  <span>{t.contactPage.formSent}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-form-name" className="block text-xs font-medium text-[#2D2926] mb-1">
                    {t.contactPage.formName} *
                  </label>
                  <input
                    id="contact-form-name"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D1D1] text-xs bg-[#FAF3F0]/40 outline-none focus:border-[#2D2926]"
                  />
                </div>
                <div>
                  <label htmlFor="contact-form-email" className="block text-xs font-medium text-[#2D2926] mb-1">
                    {t.contactPage.formEmail} *
                  </label>
                  <input
                    id="contact-form-email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D1D1] text-xs bg-[#FAF3F0]/40 outline-none focus:border-[#2D2926]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-form-subject" className="block text-xs font-medium text-[#2D2926] mb-1">
                  {t.contactPage.formSubject}
                </label>
                <input
                  id="contact-form-subject"
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D1D1] text-xs bg-[#FAF3F0]/40 outline-none focus:border-[#2D2926]"
                />
              </div>

              <div>
                <label htmlFor="contact-form-message" className="block text-xs font-medium text-[#2D2926] mb-1">
                  {t.contactPage.formMessage} *
                </label>
                <textarea
                  id="contact-form-message"
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D1D1] text-xs bg-[#FAF3F0]/40 outline-none focus:border-[#2D2926]"
                />
              </div>

              <button
                type="submit"
                id="contact-submit-btn"
                className="w-full py-3.5 px-6 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.contactPage.formSubmit}</span>
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-6 pt-6">
          <h3 className="text-2xl sm:text-3xl font-editorial-serif font-light text-[#2D2926] text-center">
            {t.contactPage.faqTitle}
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-sm border border-[#E8D1D1] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-medium text-xs text-[#2D2926] hover:bg-[#FAF3F0]/50"
                  >
                    <span>{lang === 'cs' ? faq.qCs : faq.qEn}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8B5E3C] transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#5D4037] leading-relaxed border-t border-[#E8D1D1] bg-[#FAF3F0]/20">
                      {lang === 'cs' ? faq.aCs : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
