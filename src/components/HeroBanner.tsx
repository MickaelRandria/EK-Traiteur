import React from 'react';
import { Plus, Sparkles, ChefHat } from 'lucide-react';
import { MenuItem } from '../types';

interface HeroBannerProps {
  heroItem: MenuItem;
  onSelectHero: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, quantity: number) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  heroItem,
  onSelectHero,
  onQuickAdd,
}) => {
  return (
    <section 
      id="editorial-hero-banner"
      className="relative px-5 pt-3 pb-5 overflow-visible select-none"
    >
      {/* Editorial Giant Typography Container */}
      <div className="relative flex items-center justify-between min-h-[148px]">
        {/* Unobstructed, high-impact typography */}
        <div className="flex flex-col justify-start z-0">
          {/* Word 1: PURE in deep carbon black */}
          <h1 
            id="hero-title-pure"
            className="font-anton uppercase text-[#141613] text-[68px] sm:text-[76px] leading-[0.88] tracking-tight m-0"
          >
            PURE
          </h1>

          {/* Word 2: SAVEURS in official EK Sage Green */}
          <h2 
            id="hero-title-saveurs"
            className="font-anton uppercase text-[#5B6B54] text-[68px] sm:text-[76px] leading-[0.88] tracking-tight m-0 mt-0.5"
          >
            SAVEURS
          </h2>
        </div>

        {/* Floating Signature Cocktail Piece overlapping the typography (Nike "We Rise" style, NO round frame) */}
        <div 
          id="floating-signature-piece"
          className="absolute -top-1 -right-2 sm:right-0 w-44 sm:w-48 pointer-events-auto cursor-pointer z-10 group"
          onClick={() => onSelectHero(heroItem)}
        >
          {/* Main Tilted Image with -12deg rotation and soft realistic drop shadow (NO ROUND CIRCLE/FRAME) */}
          <div 
            className="relative transform rotate-[-12deg] transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-105"
            style={{ filter: 'drop-shadow(0 20px 20px rgba(0, 0, 0, 0.18))' }}
          >
            <img
              src={heroItem.image}
              alt={heroItem.name}
              referrerPolicy="no-referrer"
              className="w-40 h-40 sm:w-44 sm:h-44 object-cover rounded-2xl"
            />
            
            {/* Subtle Signature Badge */}
            <div className="absolute -bottom-1.5 right-2 bg-[#141613] text-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-white/20">
              <ChefHat className="w-2.5 h-2.5 text-[#5B6B54]" />
              <span>Signature</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-bar / Editorial Micro Info */}
      <div className="mt-3 flex items-center justify-between z-0 relative pr-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5B6B54] bg-[#5B6B54]/10 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            Atelier Bordeaux • Fait maison
          </span>
        </div>

        <button
          id="hero-quick-add-btn"
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(heroItem, 20);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#141613] hover:bg-[#5B6B54] px-3.5 py-1.5 rounded-full transition-all shadow-md active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+20 pcs ({((heroItem.price * 20)).toFixed(2)} €)</span>
        </button>
      </div>
    </section>
  );
};
