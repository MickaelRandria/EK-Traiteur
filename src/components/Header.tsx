import React, { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Menu, Search, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onOpenSelection: () => void;
  onBrowse: () => void;
  selectionCount: number;
  bagRef: React.Ref<HTMLButtonElement>;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMenu, onOpenSearch, onOpenSelection, onBrowse, selectionCount, bagRef }) => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, 'change', y => setScrolled(y > 24));
  return (
    <header id="app-top-header" className={`sticky top-0 z-30 border-b transition-colors duration-300 ${scrolled ? 'bg-ivory/95 backdrop-blur-md border-line' : 'bg-ivory border-transparent'}`}>
      <div className="atelier-header">
        <div className="header-left">
          <button type="button" onClick={onOpenMenu} aria-label="Menu" className="icon-btn"><Menu className="w-5 h-5" strokeWidth={1.3} /></button>
          <button type="button" onClick={onBrowse} className="hidden lg:block text-xs ml-3">Les créations</button>
        </div>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Ena's Kitchen — retour en haut" className="text-center">
          <span className="header-wordmark"><em>Ena’s</em> Kitchen</span>
          <span className="header-subtitle">L’atelier du recevoir</span>
        </button>
        <div className="header-right">
          <button type="button" onClick={onOpenSearch} aria-label="Rechercher une création" className="icon-btn"><Search className="w-[18px] h-[18px]" strokeWidth={1.3} /></button>
          <button ref={bagRef} type="button" onClick={onOpenSelection} aria-label={selectionCount > 0 ? `Votre réception, ${selectionCount} pièces` : 'Votre réception'} className="flex items-center relative min-h-11">
            <span className="header-reception">Votre réception</span>
            <span className="icon-btn relative"><ShoppingBag className="w-5 h-5" strokeWidth={1.3} />
              <AnimatePresence>{selectionCount > 0 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-sage text-ivory text-[9px] flex items-center justify-center">{selectionCount > 999 ? '999+' : selectionCount}</motion.span>}</AnimatePresence>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
