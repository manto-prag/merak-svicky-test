import React, { useState } from 'react';
import { Packaging, Scent, CandleColor, WickType, LabelStyle, Language } from '../types';
import { Flame, Sparkles, Volume2, ShieldCheck, Eye, EyeOff, Clock, Layers } from 'lucide-react';

interface CandleVisualizerProps {
  packaging: Packaging;
  scent: Scent;
  color: CandleColor;
  wickType: WickType;
  labelStyle: LabelStyle;
  customMessage: string;
  recipientName?: string;
  lang: Language;
  interactive?: boolean;
}

export const CandleVisualizer: React.FC<CandleVisualizerProps> = ({
  packaging,
  scent,
  color,
  wickType,
  labelStyle,
  customMessage,
  recipientName,
  lang,
}) => {
  const [isLit, setIsLit] = useState<boolean>(true);
  const [showAura, setShowAura] = useState<boolean>(true);

  // Vessel styling based on packaging style
  const getVesselStyles = () => {
    switch (packaging.vesselStyle) {
      case 'amber-jar':
        return {
          containerClass: 'bg-gradient-to-b from-[#8B4513]/85 via-[#6B3310]/95 to-[#4A2008] border border-[#B8652D]/40 shadow-2xl backdrop-blur-xs',
          lidStyle: 'bg-gradient-to-r from-[#D7A878] via-[#E8C59C] to-[#C29363] border-b-2 border-[#A87948] rounded-t-sm shadow-md',
          glassShine: 'bg-gradient-to-r from-amber-400/25 via-transparent to-amber-900/40',
          textColor: 'text-amber-100',
        };
      case 'matte-ceramic':
        return {
          containerClass: 'bg-gradient-to-b from-[#F7F5F0] via-[#EFECE4] to-[#E4DFD5] border border-[#D9D3C7] shadow-xl',
          lidStyle: 'bg-gradient-to-r from-[#D6B588] via-[#E6C9A2] to-[#C9A475] border-b-2 border-[#A87F52] rounded-t-md shadow-md',
          glassShine: 'bg-gradient-to-r from-white/60 via-transparent to-black/5',
          textColor: 'text-stone-800',
        };
      case 'ribbed-glass':
        return {
          containerClass: 'bg-gradient-to-b from-[#F2F5F8]/80 via-[#E4EAEF]/90 to-[#D5DFE6] border border-white/60 shadow-xl backdrop-blur-sm bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:8px_8px]',
          lidStyle: 'bg-gradient-to-r from-[#DFBA73] via-[#F4D99B] to-[#C9A155] border-b border-[#A67E36] rounded-t-sm shadow-lg',
          glassShine: 'bg-gradient-to-r from-white/70 via-transparent to-amber-100/40',
          textColor: 'text-stone-800',
        };
      case 'concrete-pot':
        return {
          containerClass: 'bg-gradient-to-b from-[#D4D2CD] via-[#C4C1BC] to-[#B3B0AA] border border-[#9E9B95] shadow-2xl bg-[radial-gradient(#78716C_1px,transparent_1px)] [background-size:4px_4px]',
          lidStyle: 'bg-gradient-to-r from-[#BDB9B3] via-[#CECAC4] to-[#A8A59E] border-b-2 border-[#8C8882] rounded-t-sm shadow-md',
          glassShine: 'bg-gradient-to-r from-white/20 via-transparent to-black/15',
          textColor: 'text-stone-900',
        };
      case 'matte-black':
        return {
          containerClass: 'bg-gradient-to-b from-[#2A282A] via-[#1E1D1F] to-[#121113] border border-[#3D3A3E] shadow-2xl',
          lidStyle: 'bg-gradient-to-r from-[#5C3D2E] via-[#7A523E] to-[#4A3023] border-b-2 border-[#382318] rounded-t-sm shadow-md',
          glassShine: 'bg-gradient-to-r from-white/10 via-transparent to-black/60',
          textColor: 'text-amber-50',
        };
      case 'rose-gold-tin':
        return {
          containerClass: 'bg-gradient-to-b from-[#E8A598] via-[#D89386] to-[#BE776A] border border-[#FFD1C9] shadow-xl',
          lidStyle: 'bg-gradient-to-r from-[#F7BEB4] via-[#FFD6CD] to-[#E29D90] border-b-2 border-[#B26B5E] rounded-t-lg shadow-md',
          glassShine: 'bg-gradient-to-r from-white/50 via-transparent to-[#9E5345]/30',
          textColor: 'text-stone-900',
        };
      case 'apothecary-clear':
        return {
          containerClass: 'bg-gradient-to-b from-white/40 via-white/20 to-white/50 border-2 border-white/70 shadow-2xl backdrop-blur-md',
          lidStyle: 'bg-gradient-to-r from-[#D7A878] via-[#E8C59C] to-[#C29363] border-b border-[#A87948] rounded-t-sm shadow-md',
          glassShine: 'bg-gradient-to-r from-white/90 via-transparent to-white/40',
          textColor: 'text-stone-800',
        };
      case 'speckled-clay':
        return {
          containerClass: 'bg-gradient-to-b from-[#EAE2D7] via-[#DCD2C5] to-[#C9BCAD] border border-[#BDB0A0] shadow-xl bg-[radial-gradient(#8C7A6B_1.5px,transparent_1.5px)] [background-size:6px_6px]',
          lidStyle: 'bg-gradient-to-r from-[#C2B29F] via-[#D5C7B6] to-[#AD9D8A] border-b border-[#8C7A67] rounded-t-sm shadow-sm',
          glassShine: 'bg-gradient-to-r from-white/30 via-transparent to-stone-800/10',
          textColor: 'text-stone-900',
        };
      case 'vintage-green':
        return {
          containerClass: 'bg-gradient-to-b from-[#1C3B2B]/90 via-[#132B1F]/95 to-[#0B1A13] border border-[#2D5A42]/50 shadow-2xl',
          lidStyle: 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] border-b-2 border-[#876605] rounded-t-sm shadow-md',
          glassShine: 'bg-gradient-to-r from-emerald-300/30 via-transparent to-black/50',
          textColor: 'text-emerald-100',
        };
      case 'hexagon-wood':
        return {
          containerClass: 'bg-gradient-to-b from-white/50 via-stone-100/40 to-stone-200/60 border border-stone-300/80 shadow-2xl backdrop-blur-sm',
          lidStyle: 'bg-gradient-to-r from-[#D4C3A3] via-[#E6D7BA] to-[#BFAD8B] border-b-2 border-[#9E8B67] rounded-t-sm shadow-md',
          glassShine: 'bg-gradient-to-r from-white/80 via-transparent to-stone-400/30',
          textColor: 'text-stone-800',
        };
      default:
        return {
          containerClass: 'bg-stone-100 border border-stone-300 shadow-xl',
          lidStyle: 'bg-amber-200 rounded-t-sm',
          glassShine: 'bg-transparent',
          textColor: 'text-stone-800',
        };
    }
  };

  const vessel = getVesselStyles();

  return (
    <div id="candle-live-visualizer" className="relative flex flex-col items-center select-none">
      {/* Top Ambient Glow / Scent Aura */}
      {isLit && showAura && (
        <div
          className="absolute -top-12 w-64 h-64 rounded-full pointer-events-none animate-soft-pulse blur-3xl transition-all duration-700"
          style={{
            backgroundColor: scent.colorHint || '#F59E0B',
            opacity: 0.28,
          }}
        />
      )}

      {/* Interactive Controls Bar */}
      <div className="flex items-center justify-between w-full max-w-sm mb-4 px-3 py-1.5 bg-[#FAF3F0]/90 backdrop-blur-xs rounded-sm border border-[#E8D1D1] text-[11px] font-sans text-[#5D4037]">
        <button
          type="button"
          onClick={() => setIsLit(!isLit)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-sm transition-all font-sans font-medium uppercase tracking-wider text-[10px] ${
            isLit
              ? 'bg-[#2D2926] text-white shadow-xs'
              : 'bg-[#FAF3F0] text-[#5D4037] border border-[#E8D1D1] hover:bg-[#F5EBEB]'
          }`}
          title={isLit ? (lang === 'cs' ? 'Zhasnout' : 'Extinguish') : (lang === 'cs' ? 'Zapálit' : 'Light')}
        >
          <Flame className={`w-3.5 h-3.5 ${isLit ? 'text-[#D4AF37] animate-bounce' : ''}`} />
          <span>{isLit ? (lang === 'cs' ? 'Plamen hoří' : 'Lit flame') : (lang === 'cs' ? 'Zhasnuto' : 'Unlit')}</span>
        </button>

        <div className="flex items-center gap-1 text-[11px] text-[#8B5E3C]">
          <Clock className="w-3 h-3 text-[#8B5E3C]" />
          <span>{packaging.burnTime}</span>
        </div>

        <button
          type="button"
          onClick={() => setShowAura(!showAura)}
          className="flex items-center gap-1 text-[#8B5E3C] hover:text-[#2D2926] transition-colors uppercase tracking-wider text-[10px] font-medium"
          title={lang === 'cs' ? 'Přepnout auru vůně' : 'Toggle scent aura'}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="hidden sm:inline">{lang === 'cs' ? 'Aura' : 'Aura'}</span>
        </button>
      </div>

      {/* Main Candle Structure */}
      <div className="relative w-64 sm:w-72 flex flex-col items-center">
        {/* Lid (Resting behind or on top) */}
        <div className={`w-52 h-4.5 ${vessel.lidStyle} mb-1 flex items-center justify-center`}>
          <span className="text-[9px] uppercase tracking-widest font-semibold text-stone-800/60">
            MERAK
          </span>
        </div>

        {/* Flame & Wick Area */}
        <div className="relative w-16 h-20 flex flex-col items-center justify-end -mb-1 z-20">
          {isLit ? (
            <div className="relative flex flex-col items-center">
              {/* Flame Outer Corona */}
              <div className="absolute -top-1 w-10 h-14 bg-amber-400/40 rounded-full blur-md animate-pulse" />
              {/* Inner Flame SVG with dynamic flicker */}
              <div className="relative animate-flame z-10">
                <svg width="28" height="42" viewBox="0 0 28 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer flame (Golden yellow) */}
                  <path
                    d="M14 0C14 0 26 14 26 27C26 34.732 19.732 41 12 41C6.268 41 0 34.732 0 27C0 14 14 0 14 0Z"
                    fill="url(#outerFlameGrad)"
                  />
                  {/* Middle flame (Warm orange) */}
                  <path
                    d="M14 8C14 8 22 18 22 28C22 33.523 17.523 38 12 38C7.477 38 3 33.523 3 28C3 18 14 8 14 8Z"
                    fill="url(#midFlameGrad)"
                  />
                  {/* Inner flame (Bright white-blue core) */}
                  <path
                    d="M14 18C14 18 19 25 19 31C19 34.866 15.866 38 12 38C8.134 38 6 34.866 6 31C6 25 14 18 14 18Z"
                    fill="url(#coreFlameGrad)"
                  />
                  <defs>
                    <linearGradient id="outerFlameGrad" x1="14" y1="0" x2="14" y2="41" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FDE047" />
                      <stop offset="0.6" stopColor="#F59E0B" />
                      <stop offset="1" stopColor="#DC2626" />
                    </linearGradient>
                    <linearGradient id="midFlameGrad" x1="14" y1="8" x2="14" y2="38" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FEF08A" />
                      <stop offset="0.7" stopColor="#F97316" />
                      <stop offset="1" stopColor="#EA580C" />
                    </linearGradient>
                    <linearGradient id="coreFlameGrad" x1="14" y1="18" x2="14" y2="38" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF" />
                      <stop offset="0.6" stopColor="#BAE6FD" />
                      <stop offset="1" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          ) : (
            <div className="w-1.5 h-6 bg-stone-700 rounded-t-sm" />
          )}

          {/* Wick physical base */}
          {wickType === 'wood' ? (
            <div className="w-4 h-3.5 bg-gradient-to-b from-[#3E2723] to-[#5D4037] rounded-t-xs shadow-xs border-t border-amber-950 flex items-center justify-center">
              {isLit && (
                <div className="w-full h-0.5 bg-orange-400 animate-pulse" />
              )}
            </div>
          ) : (
            <div className="w-1 h-3.5 bg-stone-800 rounded-t-xs flex items-center justify-center">
              {isLit && <div className="w-1 h-0.5 bg-amber-400" />}
            </div>
          )}
        </div>

        {/* Jar Vessel Body */}
        <div
          className={`relative w-56 sm:w-64 h-64 sm:h-72 rounded-b-2xl overflow-hidden flex flex-col justify-between p-3.5 ${vessel.containerClass}`}
        >
          {/* Glass shine overlay */}
          <div className={`absolute inset-0 pointer-events-none ${vessel.glassShine}`} />

          {/* Top Wax Surface & Pool */}
          <div className="relative w-full z-10">
            {/* Wax rim / perspective curve */}
            <div
              className="w-full h-8 rounded-full border border-white/20 shadow-inner flex items-center justify-center overflow-hidden transition-colors duration-500"
              style={{
                backgroundColor: color.hex,
                boxShadow: isLit
                  ? `inset 0 0 16px rgba(251, 191, 36, 0.6), 0 2px 8px rgba(0,0,0,0.15)`
                  : `inset 0 0 8px rgba(0,0,0,0.15)`,
              }}
            >
              {/* Molten wax pool glow when lit */}
              {isLit && (
                <div
                  className="w-20 h-4 rounded-full bg-gradient-to-r from-amber-200/60 via-amber-300/80 to-amber-200/60 animate-pulse blur-xs"
                />
              )}
            </div>

            {/* Candle wax fill column (visible through transparent/translucent vessels) */}
            <div
              className="w-full h-12 -mt-4 opacity-75 rounded-b-md transition-colors duration-500"
              style={{
                background: `linear-gradient(to bottom, ${color.hex}, ${color.secondaryHex || color.hex})`,
              }}
            />
          </div>

          {/* Candle Label on the front */}
          {labelStyle !== 'none' && (
            <div className="relative z-10 mx-auto w-44 sm:w-48 my-auto">
              <div
                className={`p-3 rounded-xs border text-center transition-all duration-300 ${
                  labelStyle === 'minimal'
                    ? 'bg-[#FAF3F0] text-[#2D2926] border-[#E8D1D1] shadow-md'
                    : labelStyle === 'botanical'
                    ? 'bg-[#FDFBF7] text-[#2D2926] border-[#D4C3B3] shadow-lg ring-1 ring-[#D4C3B3]/40'
                    : labelStyle === 'modern'
                    ? 'bg-[#2D2926] text-[#FAF3F0] border-[#5D4037] shadow-xl'
                    : 'bg-[#FAF3F0] text-[#2D2926] border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]/50'
                }`}
              >
                {/* Brand Monogram */}
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="h-px w-3 bg-current opacity-30" />
                  <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-[#8B5E3C]">
                    MERAK
                  </span>
                  <div className="h-px w-3 bg-current opacity-30" />
                </div>

                {/* Scent Title */}
                <div className="text-[11px] font-editorial-serif font-medium italic truncate">
                  {lang === 'cs' ? scent.nameCs : scent.nameEn}
                </div>

                {/* Custom Personal Dedication Message */}
                <div className="my-1.5 min-h-6 flex items-center justify-center px-1">
                  <p
                    className={`text-[10px] leading-tight line-clamp-2 ${
                      labelStyle === 'gold-script'
                        ? 'font-editorial-serif italic text-[#8B5E3C] font-normal'
                        : 'font-editorial-serif italic opacity-90'
                    }`}
                  >
                    {customMessage.trim() ||
                      (lang === 'cs'
                        ? 'Ručně odlévaná sójová svíčka'
                        : 'Hand-poured bespoke soy candle')}
                  </p>
                </div>

                {/* Recipient / Date Subtext */}
                {recipientName && (
                  <div className="text-[8.5px] uppercase tracking-widest text-[#8B5E3C] truncate font-sans">
                    {recipientName}
                  </div>
                )}

                {/* Wax / Burn Spec footer on label */}
                <div className="mt-1 pt-1 border-t border-current/15 flex justify-between text-[7.5px] opacity-60 font-sans tracking-wider">
                  <span>100% SOY WAX</span>
                  <span>{packaging.volume.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom base weight */}
          <div className="relative z-10 flex justify-between items-center px-2 py-0.5 text-[9px] font-medium tracking-wider opacity-70">
            <span className={vessel.textColor}>
              {lang === 'cs' ? color.nameCs.split(' (')[0] : color.nameEn.split(' (')[0]}
            </span>
            <span className={vessel.textColor}>
              {wickType === 'wood'
                ? (lang === 'cs' ? 'Dřevěný knot' : 'Wood wick')
                : (lang === 'cs' ? 'Bavlněný knot' : 'Cotton wick')}
            </span>
          </div>
        </div>

        {/* Soft Drop Shadow under Jar */}
        <div className="w-48 sm:w-56 h-3 bg-stone-900/15 rounded-full blur-sm mt-1" />
      </div>

      {/* Fragrance Top Notes Pills underneath */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-xs text-center">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-stone-200/80 text-stone-700">
          <Sparkles className="w-3 h-3 text-amber-600" />
          {lang === 'cs' ? scent.topNotesCs.split(',')[0] : scent.topNotesEn.split(',')[0]}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-stone-200/80 text-stone-700">
          <Layers className="w-3 h-3 text-stone-500" />
          {packaging.volume}
        </span>
      </div>
    </div>
  );
};
