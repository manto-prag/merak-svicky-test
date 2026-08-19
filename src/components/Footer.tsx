import React from 'react';
import { Language, NavView } from '../types';
import { TRANSLATIONS } from '../translations';
import { LegalModalType } from './LegalModals';
import { Flame, Instagram, Facebook, Mail, MapPin, Phone, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: NavView) => void;
  onOpenLegalModal: (modal: LegalModalType) => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenLegalModal,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="bg-[#1E1B18] text-[#D8CFCA] pt-16 pb-12 border-t border-[#332D29] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-editorial-serif text-2xl font-light tracking-[0.25em] text-white uppercase">
                MERAK
              </span>
            </div>

            <p className="text-xs text-[#A89F9A] max-w-sm leading-relaxed font-sans">
              {t.footer.story}
            </p>

            <div className="flex items-center gap-3 pt-2 text-[#A89F9A]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-sm bg-white/5 hover:bg-[#D4AF37]/20 hover:text-white flex items-center justify-center transition-colors border border-white/5 hover:border-[#D4AF37]/40"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-sm bg-white/5 hover:bg-[#D4AF37]/20 hover:text-white flex items-center justify-center transition-colors border border-white/5 hover:border-[#D4AF37]/40"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="mailto:info@merak-svicky.cz"
                className="w-8 h-8 rounded-sm bg-white/5 hover:bg-[#D4AF37]/20 hover:text-white flex items-center justify-center transition-colors border border-white/5 hover:border-[#D4AF37]/40"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-[0.2em] text-[10.5px]">
              {t.footer.colExplore}
            </h4>
            <ul className="space-y-2 text-[#A89F9A]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('configurator')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.nav.createCandle}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('scents')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.nav.scents}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('colors')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.nav.colors}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('packaging')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.nav.packaging}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('gifts')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.nav.gifts}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: About & Contact */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-[0.2em] text-[10.5px]">
              {t.footer.colAbout}
            </h4>
            <ul className="space-y-2 text-[#A89F9A]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.nav.contact}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="hover:text-[#D4AF37] transition-colors font-medium text-[#C49A74]"
                >
                  {t.nav.admin}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal Information */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-[0.2em] text-[10.5px]">
              {t.footer.colLegal}
            </h4>
            <ul className="space-y-2 text-[#A89F9A]">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('terms')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  {t.legal.termsTitle}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  {t.legal.privacyTitle}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('returns')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  {t.legal.returnsTitle}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('cookies')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  {t.legal.cookiesTitle}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#332D29] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C827D]">
          <div>
            © {new Date().getFullYear()} MERAK svíčky. {t.footer.allRightsReserved}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#A89F9A]">
            <span>{lang === 'cs' ? 'Ručně vyrobeno v České republice' : 'Handmade with love in Czech Republic'}</span>
            <Heart className="w-3 h-3 text-[#D4AF37] inline fill-[#D4AF37]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
