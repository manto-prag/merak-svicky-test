import React, { useState } from 'react';
import { Language, NavView } from '../types';
import { TRANSLATIONS } from '../translations';
import {
  ShoppingBag,
  Flame,
  Menu,
  X,
  Sparkles,
  Globe,
  SlidersHorizontal,
  Gift,
  Heart,
  Palette,
  Package,
  Layers
} from 'lucide-react';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  lang: Language;
  onToggleLang: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  lang,
  onToggleLang,
  cartCount,
  onOpenCart,
}) => {
  const t = TRANSLATIONS[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavView; label: string; icon?: React.ReactNode }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'configurator', label: t.nav.createCandle },
    { id: 'scents', label: t.nav.scents },
    { id: 'colors', label: t.nav.colors },
    { id: 'packaging', label: t.nav.packaging },
    { id: 'gifts', label: t.nav.gifts },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact },
    { id: 'admin', label: t.nav.admin },
  ];

  const handleNavClick = (view: NavView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E8D1D1] transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-[#2D2926] text-[#FAF3F0] text-[10.5px] py-2 px-4 text-center tracking-[0.2em] uppercase font-sans flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
        <span>{t.nav.announcement}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 rounded-sm bg-[#FAF3F0] border border-[#E8D1D1] text-[#8B5E3C] flex items-center justify-center transition-all group-hover:border-[#D4AF37]">
              <Flame className="w-4 h-4 text-[#8B5E3C]" />
            </div>
            <div>
              <span className="font-editorial-serif text-2xl tracking-[0.25em] font-light text-[#8B5E3C] uppercase block leading-none">
                MERAK
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#8B5E3C]/70 font-sans block mt-1">
                {lang === 'cs' ? 'Dílna Praha' : 'Prague Atelier'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[11px] uppercase tracking-widest font-sans text-[#5D4037]">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              const isConfigurator = link.id === 'configurator';

              if (isConfigurator) {
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleNavClick(link.id)}
                    className="px-4 py-2 bg-[#2D2926] text-white hover:bg-[#8B5E3C] rounded-sm font-sans font-medium text-[11px] tracking-[0.2em] transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-colors relative pb-1 ${
                    isActive
                      ? 'text-[#2D2926] border-b border-[#D4AF37] font-semibold'
                      : 'hover:text-[#D4AF37]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Actions: Language switcher & Cart button */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={onToggleLang}
              className="px-2.5 py-1.5 rounded-sm border border-[#E8D1D1] bg-[#FAF3F0]/60 hover:bg-[#FAF3F0] text-[10px] font-sans font-semibold tracking-widest text-[#5D4037] hover:text-[#2D2926] flex items-center gap-1.5 transition-colors"
              title={lang === 'cs' ? 'Přepnout do angličtiny' : 'Switch to Czech'}
            >
              <Globe className="w-3 h-3 text-[#8B5E3C]" />
              <span className="uppercase">{lang === 'cs' ? 'CZ | EN' : 'EN | CZ'}</span>
            </button>

            {/* Cart Button */}
            <button
              type="button"
              id="header-cart-button"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-sm bg-[#FAF3F0]/60 hover:bg-[#FAF3F0] border border-[#E8D1D1] text-[#2D2926] transition-colors"
              aria-label="Nákupní košík"
            >
              <ShoppingBag className="w-4 h-4 text-[#5D4037]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E8D1D1] text-[#2D2926] text-[9.5px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2.5 rounded-sm bg-[#FAF3F0]/60 border border-[#E8D1D1] text-[#2D2926] hover:bg-[#FAF3F0] transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-b border-[#E8D1D1] px-6 pt-3 pb-6 space-y-2 animate-fade-in shadow-lg">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            const isConfigurator = link.id === 'configurator';

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-3 rounded-sm text-xs uppercase tracking-widest transition-all flex items-center justify-between font-sans ${
                  isConfigurator
                    ? 'bg-[#2D2926] text-white'
                    : isActive
                    ? 'bg-[#FAF3F0] text-[#2D2926] border-l-2 border-[#D4AF37] font-semibold'
                    : 'text-[#5D4037] hover:bg-[#FAF3F0]'
                }`}
              >
                <span>{link.label}</span>
                {isConfigurator && <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
