import React, { useState, useMemo } from 'react';
import {
  Packaging,
  Scent,
  CandleColor,
  WickType,
  LabelStyle,
  Language,
  CustomCandle,
  CartItem
} from '../types';
import {
  PACKAGING_DATA,
  SCENTS_DATA,
  CANDLE_COLORS_DATA,
  BASE_CANDLE_PRICE_CZK,
  WOODEN_WICK_PRICE_CZK,
  CZK_TO_EUR_RATE
} from '../data/candleData';
import { CandleVisualizer } from './CandleVisualizer';
import { TRANSLATIONS } from '../translations';
import {
  Sparkles,
  Flame,
  Check,
  Shuffle,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Info,
  Layers,
  Heart,
  Droplet,
  Tag,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

interface ConfiguratorProps {
  lang: Language;
  onAddToCart: (item: CartItem) => void;
  initialPackagingId?: string;
  initialScentId?: string;
  initialColorId?: string;
  stockState?: {
    scents: Record<string, boolean>;
    colors: Record<string, boolean>;
    packaging: Record<string, boolean>;
  };
}

export const Configurator: React.FC<ConfiguratorProps> = ({
  lang,
  onAddToCart,
  initialPackagingId,
  initialScentId,
  initialColorId,
  stockState,
}) => {
  const t = TRANSLATIONS[lang];

  // Active selections
  const [selectedPackagingId, setSelectedPackagingId] = useState<string>(
    initialPackagingId || PACKAGING_DATA[0].id
  );
  const [selectedScentId, setSelectedScentId] = useState<string>(
    initialScentId || SCENTS_DATA[0].id
  );
  const [selectedColorId, setSelectedColorId] = useState<string>(
    initialColorId || CANDLE_COLORS_DATA[0].id
  );
  const [selectedWick, setSelectedWick] = useState<WickType>('cotton');
  const [selectedLabelStyle, setSelectedLabelStyle] = useState<LabelStyle>('minimal');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [scentFamilyFilter, setScentFamilyFilter] = useState<string>('all');
  const [showToast, setShowToast] = useState<boolean>(false);

  // Selected Objects
  const selectedPackaging = useMemo(
    () => PACKAGING_DATA.find((p) => p.id === selectedPackagingId) || PACKAGING_DATA[0],
    [selectedPackagingId]
  );
  const selectedScent = useMemo(
    () => SCENTS_DATA.find((s) => s.id === selectedScentId) || SCENTS_DATA[0],
    [selectedScentId]
  );
  const selectedColor = useMemo(
    () => CANDLE_COLORS_DATA.find((c) => c.id === selectedColorId) || CANDLE_COLORS_DATA[0],
    [selectedColorId]
  );

  // Price Calculation
  const unitPriceCzk = useMemo(() => {
    let price = BASE_CANDLE_PRICE_CZK;
    price += selectedPackaging.priceModifier;
    if (selectedWick === 'wood') {
      price += WOODEN_WICK_PRICE_CZK;
    }
    return price;
  }, [selectedPackaging, selectedWick]);

  const totalPriceCzk = unitPriceCzk * quantity;
  const totalPriceEur = (totalPriceCzk / CZK_TO_EUR_RATE).toFixed(1);

  // Stock check
  const isPackagingInStock = stockState?.packaging[selectedPackaging.id] ?? selectedPackaging.inStock;
  const isScentInStock = stockState?.scents[selectedScent.id] ?? selectedScent.inStock;
  const isColorInStock = stockState?.colors[selectedColor.id] ?? selectedColor.inStock;
  const isAvailable = isPackagingInStock && isScentInStock && isColorInStock;

  // Presets / Inspirations
  const applyPreset = (preset: 'cozy' | 'pure' | 'romantic' | 'forest') => {
    if (preset === 'cozy') {
      setSelectedPackagingId('amber-jar-cork');
      setSelectedScentId('sandalwood-amber');
      setSelectedColorId('honey-gold');
      setSelectedWick('wood');
      setSelectedLabelStyle('minimal');
      setCustomMessage(lang === 'cs' ? 'Klidné chvíle u hořícího krbu' : 'Cozy moments by the hearth');
    } else if (preset === 'pure') {
      setSelectedPackagingId('matte-ceramic-bamboo');
      setSelectedScentId('cotton-white-tea');
      setSelectedColorId('natural-cream');
      setSelectedWick('cotton');
      setSelectedLabelStyle('modern');
      setCustomMessage(lang === 'cs' ? 'Čistá mysl & ranní harmonie' : 'Pure mind & morning calm');
    } else if (preset === 'romantic') {
      setSelectedPackagingId('ribbed-frosted-glass');
      setSelectedScentId('peony-blush-suede');
      setSelectedColorId('dusty-rose');
      setSelectedWick('wood');
      setSelectedLabelStyle('gold-script');
      setCustomMessage(lang === 'cs' ? 'Láska, která hřeje každý den' : 'Love that warms every day');
    } else if (preset === 'forest') {
      setSelectedPackagingId('raw-concrete-pot');
      setSelectedScentId('smoked-cedar-tobacco');
      setSelectedColorId('vintage-olive');
      setSelectedWick('wood');
      setSelectedLabelStyle('botanical');
      setCustomMessage(lang === 'cs' ? 'Vůně lesního ticha & hor' : 'Aroma of mountain forest silence');
    }
  };

  const randomizeCombination = () => {
    const randomPack = PACKAGING_DATA[Math.floor(Math.random() * PACKAGING_DATA.length)];
    const randomScent = SCENTS_DATA[Math.floor(Math.random() * SCENTS_DATA.length)];
    const randomColor = CANDLE_COLORS_DATA[Math.floor(Math.random() * CANDLE_COLORS_DATA.length)];
    const randomWick: WickType = Math.random() > 0.5 ? 'wood' : 'cotton';

    setSelectedPackagingId(randomPack.id);
    setSelectedScentId(randomScent.id);
    setSelectedColorId(randomColor.id);
    setSelectedWick(randomWick);
  };

  const handleAddToCart = () => {
    const customCandle: CustomCandle = {
      packagingId: selectedPackaging.id,
      scentId: selectedScent.id,
      colorId: selectedColor.id,
      wickType: selectedWick,
      labelStyle: selectedLabelStyle,
      customMessage,
      recipientName,
      quantity,
      unitPriceCzk,
    };

    const cartItem: CartItem = {
      id: `item-${Date.now()}`,
      candle: customCandle,
      packaging: selectedPackaging,
      scent: selectedScent,
      color: selectedColor,
      totalPriceCzk,
    };

    onAddToCart(cartItem);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Filtered scents
  const filteredScents = useMemo(() => {
    if (scentFamilyFilter === 'all') return SCENTS_DATA;
    return SCENTS_DATA.filter((s) => s.family === scentFamilyFilter);
  }, [scentFamilyFilter]);

  return (
    <section id="configurator-section" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#8B5E3C] font-sans font-semibold mb-3">
          <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
          <span>{t.configurator.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif font-light text-[#2D2926] mb-3">
          {t.configurator.title}
        </h2>
        <p className="text-[#8B5E3C] font-editorial-serif italic text-base sm:text-lg">
          “{t.configurator.subtitle}”
        </p>

        {/* Quick Inspiration Presets */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-sans">
          <span className="text-[#8B5E3C] text-[11px] uppercase tracking-wider font-medium">{t.configurator.presetInspire}</span>
          <button
            type="button"
            onClick={() => applyPreset('cozy')}
            className="px-3 py-1 bg-[#FAF3F0] hover:bg-[#F5EBEB] border border-[#E8D1D1] hover:border-[#D4AF37] rounded-sm text-[#5D4037] text-[11px] transition-colors"
          >
            🔥 {t.configurator.presetCozy}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('pure')}
            className="px-3 py-1 bg-[#FAF3F0] hover:bg-[#F5EBEB] border border-[#E8D1D1] hover:border-[#D4AF37] rounded-sm text-[#5D4037] text-[11px] transition-colors"
          >
            🌿 {t.configurator.presetPure}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('romantic')}
            className="px-3 py-1 bg-[#FAF3F0] hover:bg-[#F5EBEB] border border-[#E8D1D1] hover:border-[#D4AF37] rounded-sm text-[#5D4037] text-[11px] transition-colors"
          >
            🌸 {t.configurator.presetRomantic}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('forest')}
            className="px-3 py-1 bg-[#FAF3F0] hover:bg-[#F5EBEB] border border-[#E8D1D1] hover:border-[#D4AF37] rounded-sm text-[#5D4037] text-[11px] transition-colors"
          >
            🌲 {t.configurator.presetForest}
          </button>
          <button
            type="button"
            onClick={randomizeCombination}
            className="px-3.5 py-1 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm text-[11px] uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors"
            title="Randomize 1 of 1,000 combinations"
          >
            <Shuffle className="w-3 h-3 text-[#D4AF37]" />
            <span>{lang === 'cs' ? 'Náhodný mix' : 'Surprise me'}</span>
          </button>
        </div>
      </div>

      {/* Main Configurator Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Interactive Candle Visualizer (Sticky on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 bg-[#F5EBEB]/30 backdrop-blur-md rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-[#E8D1D1] text-[11px] font-sans">
            <span className="font-semibold text-[#8B5E3C] uppercase tracking-[0.2em]">
              {t.configurator.livePreview}
            </span>
            <span className="px-2.5 py-0.5 rounded-sm bg-[#FAF3F0] text-[#8B5E3C] border border-[#E8D1D1] text-[10px] uppercase tracking-wider">
              {t.configurator.combinationsBadge}
            </span>
          </div>

          {/* Candle 2.5D Component */}
          <div className="my-2 py-4 w-full flex justify-center">
            <CandleVisualizer
              packaging={selectedPackaging}
              scent={selectedScent}
              color={selectedColor}
              wickType={selectedWick}
              labelStyle={selectedLabelStyle}
              customMessage={customMessage}
              recipientName={recipientName}
              lang={lang}
            />
          </div>

          {/* Summary Box & Add to Cart */}
          <div className="w-full mt-6 pt-5 border-t border-[#E8D1D1] font-sans">
            <div className="space-y-2 text-[12px] text-[#5D4037] mb-4">
              <div className="flex justify-between">
                <span className="text-[#8B5E3C]">{t.cart.packaging}</span>
                <span className="font-medium text-[#2D2926]">
                  {lang === 'cs' ? selectedPackaging.nameCs : selectedPackaging.nameEn}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B5E3C]">{t.cart.scent}</span>
                <span className="font-medium text-[#2D2926]">
                  {lang === 'cs' ? selectedScent.nameCs : selectedScent.nameEn}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B5E3C]">{t.cart.color}</span>
                <span className="font-medium text-[#2D2926]">
                  {lang === 'cs' ? selectedColor.nameCs.split(' (')[0] : selectedColor.nameEn.split(' (')[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B5E3C]">{t.cart.wick}</span>
                <span className="font-medium text-[#2D2926]">
                  {selectedWick === 'wood' ? (lang === 'cs' ? 'Praskající dřevěný (+40 Kč)' : 'Crackling Wood') : (lang === 'cs' ? 'Přírodní bavlna' : 'Pure Cotton')}
                </span>
              </div>
            </div>

            {/* Price & Add to cart button */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E8D1D1] mb-4">
              <div>
                <span className="text-[10px] text-[#8B5E3C] uppercase tracking-widest block font-sans">
                  {t.configurator.priceTotal}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-light font-editorial-serif text-[#2D2926]">
                    {totalPriceCzk} Kč
                  </span>
                  <span className="text-xs text-[#8B5E3C]/70 font-sans">
                    (~€{totalPriceEur})
                  </span>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#E8D1D1] rounded-sm bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#5D4037] hover:text-[#2D2926] font-bold"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-semibold text-[#2D2926]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#5D4037] hover:text-[#2D2926] font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Out of stock warning if applicable */}
            {!isAvailable && (
              <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-sm flex items-center gap-2 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  {lang === 'cs'
                    ? 'Některá ze zvolených surovin je momentálně vyprodána. Zvolte prosím jinou variantu.'
                    : 'One of the selected ingredients is currently out of stock. Please choose another variation.'}
                </span>
              </div>
            )}

            <button
              type="button"
              id="add-custom-candle-btn"
              disabled={!isAvailable}
              onClick={handleAddToCart}
              className={`w-full py-4 px-6 rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-98 ${
                isAvailable
                  ? 'bg-[#2D2926] text-white hover:bg-[#8B5E3C]'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.configurator.addToCart}</span>
            </button>

            {/* Toast notification */}
            {showToast && (
              <div className="mt-3 p-2.5 bg-[#FAF3F0] border border-[#D4AF37] rounded-sm text-center text-xs text-[#8B5E3C] font-sans font-medium flex items-center justify-center gap-1.5 animate-fade-in">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.configurator.addedSuccess}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Step-by-Step Configurator Controls */}
        <div className="lg:col-span-7 space-y-8">
          {/* Steps Progress Tabs */}
          <div className="flex items-center justify-between gap-1 p-1 bg-[#FAF3F0] rounded-sm border border-[#E8D1D1] overflow-x-auto no-scrollbar font-sans">
            {[
              { num: 1, label: t.configurator.step1 },
              { num: 2, label: t.configurator.step2 },
              { num: 3, label: t.configurator.step3 },
              { num: 4, label: t.configurator.step4 },
              { num: 5, label: t.configurator.step5 },
            ].map((step) => {
              const isActive = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex-1 py-2 px-3 rounded-sm text-[10.5px] uppercase tracking-wider font-medium whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${
                    isActive
                      ? 'bg-[#2D2926] text-white shadow-xs'
                      : 'text-[#5D4037] hover:text-[#2D2926] hover:bg-[#F5EBEB]'
                  }`}
                >
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* STEP 1: PACKAGING (10 Options) */}
          {currentStep === 1 && (
            <div className="bg-white rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-xs space-y-6 animate-fade-in">
              <div>
                <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.3em] font-sans">
                  Step 01 / 1. Balení
                </span>
                <h3 className="text-2xl font-editorial-serif font-light text-[#2D2926] mt-1">
                  {t.configurator.stepTitlePackaging}
                </h3>
                <p className="text-[#5D4037]/80 text-[13px] font-sans mt-1">
                  {t.configurator.stepDescPackaging}
                </p>
              </div>

              {/* Grid of 10 packaging styles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PACKAGING_DATA.map((pack) => {
                  const isSelected = selectedPackagingId === pack.id;
                  const inStock = stockState?.packaging[pack.id] ?? pack.inStock;

                  return (
                    <div
                      key={pack.id}
                      onClick={() => inStock && setSelectedPackagingId(pack.id)}
                      className={`relative p-4 rounded-sm border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#FAF3F0] ring-1 ring-[#D4AF37] shadow-xs'
                          : inStock
                          ? 'border-[#E8D1D1] bg-white hover:border-[#D4AF37] hover:bg-[#FAF3F0]/40'
                          : 'border-stone-200 bg-stone-100/70 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-[#2D2926] font-sans">
                            {lang === 'cs' ? pack.nameCs : pack.nameEn}
                          </h4>
                          <span className="text-[10.5px] text-[#8B5E3C] block font-sans">
                            {pack.volume} • {pack.burnTime}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#2D2926] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#D4AF37]" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#5D4037] line-clamp-2 mb-2.5 font-sans leading-relaxed">
                        {lang === 'cs' ? pack.descriptionCs : pack.descriptionEn}
                      </p>

                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#E8D1D1] font-sans">
                        <span className="text-[#8B5E3C]">
                          {pack.lidCs ? (lang === 'cs' ? pack.lidCs : pack.lidEn) : 'Standard lid'}
                        </span>
                        <span className="font-semibold text-[#2D2926]">
                          {pack.priceModifier === 0
                            ? (lang === 'cs' ? 'Základní cena' : 'Standard')
                            : pack.priceModifier > 0
                            ? `+${pack.priceModifier} Kč`
                            : `${pack.priceModifier} Kč`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next Step Button */}
              <div className="flex justify-end pt-4 border-t border-[#E8D1D1]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 transition-colors shadow-xs"
                >
                  <span>{lang === 'cs' ? 'Pokračovat k vůním' : 'Continue to Scents'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCENTS (10 Fragrances with family filter) */}
          {currentStep === 2 && (
            <div className="bg-white rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-xs space-y-6 animate-fade-in">
              <div>
                <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.3em] font-sans">
                  Step 02 / 2. Vůně
                </span>
                <h3 className="text-2xl font-editorial-serif font-light text-[#2D2926] mt-1">
                  {t.configurator.stepTitleScent}
                </h3>
                <p className="text-[#5D4037]/80 text-[13px] font-sans mt-1">
                  {t.configurator.stepDescScent}
                </p>
              </div>

              {/* Scent family filter tabs */}
              <div className="flex flex-wrap gap-1.5 pb-1 font-sans">
                {[
                  { id: 'all', label: lang === 'cs' ? 'Všech 10 vůní' : 'All 10 Scents' },
                  { id: 'floral', label: lang === 'cs' ? 'Květinové' : 'Floral' },
                  { id: 'woody', label: lang === 'cs' ? 'Dřevité' : 'Woody' },
                  { id: 'gourmand', label: lang === 'cs' ? 'Gurmánské' : 'Gourmand' },
                  { id: 'fresh', label: lang === 'cs' ? 'Svěží' : 'Fresh' },
                  { id: 'citrus', label: lang === 'cs' ? 'Citrusové' : 'Citrus' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setScentFamilyFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-sm text-[11px] font-medium transition-colors uppercase tracking-wider ${
                      scentFamilyFilter === cat.id
                        ? 'bg-[#2D2926] text-white'
                        : 'bg-[#FAF3F0] text-[#5D4037] border border-[#E8D1D1] hover:border-[#D4AF37]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid of Scents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredScents.map((scent) => {
                  const isSelected = selectedScentId === scent.id;
                  const inStock = stockState?.scents[scent.id] ?? scent.inStock;

                  return (
                    <div
                      key={scent.id}
                      onClick={() => inStock && setSelectedScentId(scent.id)}
                      className={`relative p-4 rounded-sm border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#FAF3F0] ring-1 ring-[#D4AF37] shadow-xs'
                          : inStock
                          ? 'border-[#E8D1D1] bg-white hover:border-[#D4AF37] hover:bg-[#FAF3F0]/40'
                          : 'border-stone-200 bg-stone-100/70 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: scent.colorHint }}
                          />
                          <h4 className="text-sm font-semibold text-[#2D2926] font-sans">
                            {lang === 'cs' ? scent.nameCs : scent.nameEn}
                          </h4>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#2D2926] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#D4AF37]" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#5D4037] line-clamp-2 mb-2 font-sans leading-relaxed">
                        {lang === 'cs' ? scent.descriptionCs : scent.descriptionEn}
                      </p>

                      {/* Scent notes breakdown */}
                      <div className="space-y-1 text-[10.5px] bg-[#FAF3F0]/70 p-2.5 rounded-sm border border-[#E8D1D1] mb-2 font-sans">
                        <div className="flex gap-1 text-[#2D2926]">
                          <span className="font-semibold text-[#8B5E3C]">{t.configurator.topNotes}</span>
                          <span className="truncate">{lang === 'cs' ? scent.topNotesCs : scent.topNotesEn}</span>
                        </div>
                        <div className="flex gap-1 text-[#2D2926]">
                          <span className="font-semibold text-[#8B5E3C]">{t.configurator.middleNotes}</span>
                          <span className="truncate">{lang === 'cs' ? scent.middleNotesCs : scent.middleNotesEn}</span>
                        </div>
                      </div>

                      {/* Intensity meter */}
                      <div className="flex items-center justify-between text-[11px] pt-1 font-sans">
                        <span className="text-[#8B5E3C]">{t.configurator.intensity}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <span
                              key={lvl}
                              className={`w-1.5 h-3 rounded-xs ${
                                lvl <= scent.intensity ? 'bg-[#8B5E3C]' : 'bg-[#E8D1D1]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step Navigation */}
              <div className="flex justify-between pt-4 border-t border-[#E8D1D1]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-[#E8D1D1] text-[#5D4037] hover:border-[#D4AF37] hover:bg-[#FAF3F0] rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'cs' ? 'Zpět k obalům' : 'Back to Packaging'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{lang === 'cs' ? 'Pokračovat k barvám' : 'Continue to Colors'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CANDLE WAX COLORS (10 Colors) */}
          {currentStep === 3 && (
            <div className="bg-white rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-xs space-y-6 animate-fade-in">
              <div>
                <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.3em] font-sans">
                  Step 03 / 3. Barva vosku
                </span>
                <h3 className="text-2xl font-editorial-serif font-light text-[#2D2926] mt-1">
                  {t.configurator.stepTitleColor}
                </h3>
                <p className="text-[#5D4037]/80 text-[13px] font-sans mt-1">
                  {t.configurator.stepDescColor}
                </p>
              </div>

              {/* Grid of 10 Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CANDLE_COLORS_DATA.map((col) => {
                  const isSelected = selectedColorId === col.id;
                  const inStock = stockState?.colors[col.id] ?? col.inStock;

                  return (
                    <div
                      key={col.id}
                      onClick={() => inStock && setSelectedColorId(col.id)}
                      className={`relative p-4 rounded-sm border text-left cursor-pointer transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#FAF3F0] ring-1 ring-[#D4AF37] shadow-xs'
                          : inStock
                          ? 'border-[#E8D1D1] bg-white hover:border-[#D4AF37] hover:bg-[#FAF3F0]/40'
                          : 'border-stone-200 bg-stone-100/70 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {/* Color swatch circle */}
                      <div
                        className="w-10 h-10 rounded-full border border-[#E8D1D1] shadow-sm shrink-0 flex items-center justify-center transition-transform hover:scale-105"
                        style={{
                          backgroundColor: col.hex,
                        }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-4 h-4 ${
                              ['natural-cream', 'almond-latte', 'oat-linen'].includes(col.id)
                                ? 'text-stone-900'
                                : 'text-white'
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 font-sans">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-[#2D2926] truncate">
                            {lang === 'cs' ? col.nameCs : col.nameEn}
                          </h4>
                        </div>
                        <span className="text-[10.5px] text-[#8B5E3C] font-medium block">
                          {lang === 'cs' ? col.moodCs : col.moodEn}
                        </span>
                        <p className="text-xs text-[#5D4037] mt-1 line-clamp-2 leading-relaxed">
                          {lang === 'cs' ? col.descriptionCs : col.descriptionEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step Navigation */}
              <div className="flex justify-between pt-4 border-t border-[#E8D1D1]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-[#E8D1D1] text-[#5D4037] hover:border-[#D4AF37] hover:bg-[#FAF3F0] rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'cs' ? 'Zpět k vůním' : 'Back to Scents'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-3 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{lang === 'cs' ? 'Pokračovat k věnování' : 'Continue to Label'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOM LABEL & DEDICATION */}
          {currentStep === 4 && (
            <div className="bg-white rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-xs space-y-6 animate-fade-in font-sans">
              <div>
                <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.3em]">
                  Step 04 / 4. Etiketa & Věnování
                </span>
                <h3 className="text-2xl font-editorial-serif font-light text-[#2D2926] mt-1">
                  {t.configurator.stepTitleMessage}
                </h3>
                <p className="text-[#5D4037]/80 text-[13px] mt-1">
                  {t.configurator.stepDescMessage}
                </p>
              </div>

              {/* Label Style Selection */}
              <div>
                <label className="block text-[11px] font-bold text-[#8B5E3C] uppercase tracking-widest mb-2.5">
                  {t.configurator.labelStyle}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'minimal', label: t.configurator.labelStyleMinimal, desc: 'Čistý lněný papír' },
                    { id: 'botanical', label: t.configurator.labelStyleBotanical, desc: 'Jemný bylinkový věneček' },
                    { id: 'modern', label: t.configurator.labelStyleModern, desc: 'Temný elegantní štítek' },
                    { id: 'gold-script', label: t.configurator.labelStyleGold, desc: 'Zlaté kaligrafické písmo' },
                    { id: 'none', label: t.configurator.labelStyleNone, desc: 'Čisté sklo bez potisku' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedLabelStyle(style.id as LabelStyle)}
                      className={`p-3 rounded-sm border text-left transition-all ${
                        selectedLabelStyle === style.id
                          ? 'border-[#D4AF37] bg-[#FAF3F0] ring-1 ring-[#D4AF37]'
                          : 'border-[#E8D1D1] bg-white hover:bg-[#FAF3F0]/50 text-[#5D4037]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#2D2926]">{style.label}</div>
                      <div className="text-[10px] text-[#8B5E3C]">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message Input */}
              {selectedLabelStyle !== 'none' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="custom-message-input" className="text-[11px] font-bold text-[#8B5E3C] uppercase tracking-widest">
                        {lang === 'cs' ? 'Text vašeho věnování na etiketě:' : 'Custom dedication message on label:'}
                      </label>
                      <span className="text-[10.5px] text-[#8B5E3C]/70">
                        {t.configurator.customMessageHint} {60 - customMessage.length}
                      </span>
                    </div>
                    <textarea
                      id="custom-message-input"
                      rows={2}
                      maxLength={60}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder={t.configurator.customMessagePlaceholder}
                      className="w-full px-4 py-3 rounded-sm border border-[#E8D1D1] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-[#2D2926] text-sm bg-[#FAF3F0]/30 outline-none transition-all placeholder:text-stone-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="recipient-name-input" className="block text-[11px] font-bold text-[#8B5E3C] uppercase tracking-widest mb-1.5">
                      {lang === 'cs' ? 'Jméno obdarovaného nebo příležitost (volitelné):' : 'Recipient name or occasion (optional):'}
                    </label>
                    <input
                      id="recipient-name-input"
                      type="text"
                      maxLength={30}
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder={t.configurator.recipientNamePlaceholder}
                      className="w-full px-4 py-2.5 rounded-sm border border-[#E8D1D1] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-[#2D2926] text-sm bg-[#FAF3F0]/30 outline-none transition-all placeholder:text-stone-400"
                    />
                  </div>
                </div>
              )}

              {/* Step Navigation */}
              <div className="flex justify-between pt-4 border-t border-[#E8D1D1]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 border border-[#E8D1D1] text-[#5D4037] hover:border-[#D4AF37] hover:bg-[#FAF3F0] rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'cs' ? 'Zpět k barvám' : 'Back to Colors'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-8 py-3 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{lang === 'cs' ? 'Pokračovat ke knotu' : 'Continue to Wick'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: WICK TYPE & FINAL REVIEW */}
          {currentStep === 5 && (
            <div className="bg-white rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-xs space-y-6 animate-fade-in font-sans">
              <div>
                <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.3em]">
                  Step 05 / 5. Knot & Shrnutí
                </span>
                <h3 className="text-2xl font-editorial-serif font-light text-[#2D2926] mt-1">
                  {t.configurator.stepTitleWickQty}
                </h3>
                <p className="text-[#5D4037]/80 text-[13px] mt-1">
                  {t.configurator.stepDescWickQty}
                </p>
              </div>

              {/* Wick Choice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setSelectedWick('cotton')}
                  className={`p-4 rounded-sm border cursor-pointer transition-all text-left ${
                    selectedWick === 'cotton'
                      ? 'border-[#D4AF37] bg-[#FAF3F0] ring-1 ring-[#D4AF37] shadow-xs'
                      : 'border-[#E8D1D1] bg-white hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#2D2926] flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#8B5E3C]" />
                      {t.configurator.wickCotton}
                    </span>
                    {selectedWick === 'cotton' && (
                      <span className="w-5 h-5 rounded-full bg-[#2D2926] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#D4AF37]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5D4037] mb-2 leading-relaxed">{t.configurator.wickCottonDesc}</p>
                  <span className="text-[11px] font-semibold text-[#8B5E3C]">
                    {lang === 'cs' ? 'V ceně (0 Kč)' : 'Included'}
                  </span>
                </div>

                <div
                  onClick={() => setSelectedWick('wood')}
                  className={`p-4 rounded-sm border cursor-pointer transition-all text-left ${
                    selectedWick === 'wood'
                      ? 'border-[#D4AF37] bg-[#FAF3F0] ring-1 ring-[#D4AF37] shadow-xs'
                      : 'border-[#E8D1D1] bg-white hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#2D2926] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      {t.configurator.wickWood}
                    </span>
                    {selectedWick === 'wood' && (
                      <span className="w-5 h-5 rounded-full bg-[#2D2926] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#D4AF37]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5D4037] mb-2 leading-relaxed">{t.configurator.wickWoodDesc}</p>
                  <span className="text-[11px] font-semibold text-[#8B5E3C]">
                    +40 Kč (~€1.60)
                  </span>
                </div>
              </div>

              {/* Quality & Craftsmanship Assurance */}
              <div className="p-4 bg-[#FAF3F0]/60 rounded-sm border border-[#E8D1D1] text-xs text-[#5D4037] space-y-2">
                <div className="font-semibold text-[#2D2926] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" />
                  <span>{lang === 'cs' ? 'Záruka poctivého řemesla MERAK:' : 'MERAK Artisan Quality Guarantee:'}</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 list-disc list-inside text-[11px]">
                  <li>{lang === 'cs' ? '100% čistý sójový vosk bez ropy' : '100% pure petroleum-free soy wax'}</li>
                  <li>{lang === 'cs' ? 'Netoxické přírodní barvy a esence' : 'Non-toxic botanical dyes & oils'}</li>
                  <li>{lang === 'cs' ? 'Ručně lité a balené v ČR' : 'Hand-poured in the Czech Republic'}</li>
                  <li>{lang === 'cs' ? 'Doba hoření 45 až 55 hodin' : 'Burn time: 45 to 55 clean hours'}</li>
                </ul>
              </div>

              {/* Step Navigation */}
              <div className="flex justify-between pt-4 border-t border-[#E8D1D1]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 border border-[#E8D1D1] text-[#5D4037] hover:border-[#D4AF37] hover:bg-[#FAF3F0] rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'cs' ? 'Zpět k etiketě' : 'Back to Label'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-8 py-3.5 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.configurator.addToCart} ({totalPriceCzk} Kč)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
