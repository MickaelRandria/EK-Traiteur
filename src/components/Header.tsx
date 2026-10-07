import React from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenSearch,
}) => {
  return (
    <header 
      id="app-top-header"
      className="px-5 pt-4 pb-2 flex items-center justify-between sticky top-0 bg-[#F8F9FA]/90 backdrop-blur-md z-30"
    >
      {/* Left Action: Filters / Preferences */}
      <button
        id="btn-header-filter"
        type="button"
        onClick={onOpenSettings}
        className="w-9 h-9 rounded-full bg-white shadow-xs border border-gray-200/70 flex items-center justify-center text-[#141613] hover:bg-gray-50 active:scale-95 transition-all"
        aria-label="Filtres et préférences traiteur"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>

      {/* Center: Brand Logo from CARTE EK.png */}
      <div 
        className="flex items-center justify-center cursor-pointer select-none py-0.5"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <img
          src="/CARTE EK.png"
          alt="Ena's Kitchen - Crafted With Love"
          referrerPolicy="no-referrer"
          className="h-11 w-auto max-w-[150px] object-contain transition-transform active:scale-95"
        />
      </div>

      {/* Right Action: Search */}
      <button
        id="btn-header-search"
        type="button"
        onClick={onOpenSearch}
        className="w-9 h-9 rounded-full bg-white shadow-xs border border-gray-200/70 flex items-center justify-center text-[#141613] hover:bg-gray-50 active:scale-95 transition-all"
        aria-label="Rechercher une pièce cocktail"
      >
        <Search className="w-4 h-4" />
      </button>
    </header>
  );
};
