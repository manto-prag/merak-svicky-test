import React from 'react';
import { Language, NavView } from '../types';
import { TRANSLATIONS } from '../translations';
import { Sparkles, ArrowRight, Flame, CheckCircle } from 'lucide-react';

interface HeroProps {
  lang: Language;
  onNavigate: (view: NavView) => void;
  onStartConfigurator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onNavigate, onStartConfigurator }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] pt-12 pb-20 md:py-24 border-b border-[#E8D1D1]">
      {/* Editorial Decorative Blurs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#F5EBEB]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#E8D1D1]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Editorial Eyebrow */}
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#8B5E3C] font-sans font-semibold">
              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
              <span>{t.hero.eyebrow}</span>
            </div>

            {/* Brand Title & Requested Tagline */}
            <div className="space-y-3">
              <span className="block font-editorial-serif text-3xl sm:text-4xl text-[#8B5E3C] tracking-[0.1em] font-light">
                MERAK svíčky
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-editorial-serif font-light text-[#2D2926] leading-[1.08] tracking-tight">
                {t.hero.title}{' '}
                <span className="italic font-normal text-[#8B5E3C] block sm:inline">
                  {t.hero.titleAccent}
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-[#8B5E3C] font-editorial-serif italic text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
              “{t.hero.subtitle}”
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                id="hero-create-candle-btn"
                onClick={onStartConfigurator}
                className="w-full sm:w-auto px-10 py-4 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-colors shadow-xs active:scale-98"
              >
                <span>{t.hero.ctaCreate}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('scents')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#FAF3F0] text-[#2D2926] border border-[#E8D1D1] hover:border-[#D4AF37] rounded-sm font-sans font-medium text-[11px] uppercase tracking-[0.2em] transition-colors"
              >
                {t.hero.ctaExplore}
              </button>
            </div>

            {/* Value Props Strip */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left border-t border-[#E8D1D1] font-sans">
              <div className="flex items-center gap-2 text-[11px] text-[#5D4037]">
                <CheckCircle className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
                <span>{t.hero.feature1}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#5D4037]">
                <CheckCircle className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
                <span>{t.hero.feature2}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#5D4037]">
                <CheckCircle className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
                <span>{t.hero.feature3}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#5D4037]">
                <CheckCircle className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
                <span>{t.hero.feature4}</span>
              </div>
            </div>
          </div>

          {/* Right Visual Composition: Editorial Candle Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Backdrop Card */}
            <div className="relative w-full max-w-md bg-[#FAF3F0]/60 rounded-sm p-6 sm:p-8 border border-[#E8D1D1] shadow-lg overflow-hidden">
              {/* Luxury Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-white/90 text-[#8B5E3C] text-[10px] font-sans font-semibold tracking-widest uppercase border border-[#E8D1D1]">
                  <Flame className="w-3 h-3 text-[#8B5E3C]" />
                  1 000 {lang === 'cs' ? 'kombinací' : 'combinations'}
                </span>
              </div>

              {/* Decorative Candle Art Illustration / Still life */}
              <div className="relative flex flex-col items-center py-8">
                {/* Glowing Aura */}
                <div className="w-48 h-48 bg-[#E8D1D1]/40 rounded-full blur-2xl absolute -top-4 animate-pulse" />

                {/* Simulated Candle Illustration in Amber Jar */}
                <div className="relative flex flex-col items-center z-10">
                  {/* Flickering Flame */}
                  <div className="animate-flame mb-1">
                    <svg width="22" height="34" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C12 0 22 12 22 23C22 29.6274 17.5228 35 12 35C6.47715 35 2 29.6274 2 23C2 12 12 0 12 0Z" fill="url(#heroFlameGrad)" />
                      <defs>
                        <linearGradient id="heroFlameGrad" x1="12" y1="0" x2="12" y2="35" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FDE047" />
                          <stop offset="0.6" stopColor="#F59E0B" />
                          <stop offset="1" stopColor="#8B5E3C" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Vessel */}
                  <div className="w-48 h-56 bg-gradient-to-b from-[#8B4513]/90 via-[#6B3310]/95 to-[#4A2008] rounded-b-sm border border-[#8B5E3C]/40 p-3 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-black/30 pointer-events-none" />

                    {/* Wax Rim */}
                    <div className="w-full h-7 rounded-sm bg-[#FAF3F0] border border-white/20 shadow-inner flex items-center justify-center">
                      <div className="w-16 h-3 rounded-sm bg-[#F2E5D5]" />
                    </div>

                    {/* Custom Label */}
                    <div className="bg-[#FAF3F0] text-[#2D2926] p-3 rounded-xs border border-[#E8D1D1] text-center my-auto shadow-xs">
                      <div className="text-[8.5px] uppercase font-bold tracking-[0.25em] text-[#8B5E3C]">
                        MERAK
                      </div>
                      <div className="text-[11px] font-editorial-serif font-semibold italic text-[#2D2926] mt-0.5">
                        {lang === 'cs' ? 'Santalové dřevo & Jantar' : 'Sandalwood & Amber'}
                      </div>
                      <div className="text-[9px] italic font-editorial-serif text-[#8B5E3C] mt-0.5">
                        {lang === 'cs' ? '„Okamžiky čistého klidu“' : '“Moments of pure calm”'}
                      </div>
                    </div>

                    {/* Spec footer */}
                    <div className="flex justify-between text-[8px] text-amber-200/80 uppercase tracking-widest px-1 font-sans">
                      <span>100% SOY</span>
                      <span>50H BURN</span>
                    </div>
                  </div>

                  {/* Soft Shadow */}
                  <div className="w-44 h-3 bg-stone-900/15 rounded-full blur-sm mt-1" />
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E8D1D1] text-center font-sans">
                <div className="p-2.5 bg-white rounded-sm border border-[#E8D1D1]/60">
                  <div className="text-lg font-light font-editorial-serif text-[#2D2926]">
                    {t.hero.statCombinations}
                  </div>
                  <div className="text-[9.5px] uppercase tracking-wider text-[#8B5E3C] leading-tight mt-0.5">
                    {t.hero.statCombinationsLabel}
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-sm border border-[#E8D1D1]/60">
                  <div className="text-lg font-light font-editorial-serif text-[#2D2926]">
                    {t.hero.statBurnTime}
                  </div>
                  <div className="text-[9.5px] uppercase tracking-wider text-[#8B5E3C] leading-tight mt-0.5">
                    {t.hero.statBurnTimeLabel}
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-sm border border-[#E8D1D1]/60">
                  <div className="text-lg font-light font-editorial-serif text-[#2D2926]">
                    {t.hero.statEco}
                  </div>
                  <div className="text-[9.5px] uppercase tracking-wider text-[#8B5E3C] leading-tight mt-0.5">
                    {t.hero.statEcoLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
