import React from 'react';
import { Home, ShoppingBag, Heart, Phone } from 'lucide-react';

interface BottomBarProps {
  activeTab: 'home' | 'cart' | 'favorites' | 'contact';
  setActiveTab: (tab: 'home' | 'cart' | 'favorites' | 'contact') => void;
  totalPieces: number;
  favoritesCount: number;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  activeTab,
  setActiveTab,
  totalPieces,
  favoritesCount,
}) => {
  return (
    <nav 
      aria-label="Navigation principale"
      className="fixed bottom-4 left-0 right-0 max-w-md md:max-w-lg mx-auto px-4 z-50 pointer-events-none"
    >
      <div 
        id="floating-bottom-nav"
        className="pointer-events-auto bg-[#141613]/95 backdrop-blur-md text-white rounded-full px-4 py-2.5 shadow-2xl flex items-center justify-between border border-white/10"
      >
        {/* Home Tab */}
        <button
          id="nav-home-btn"
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full transition-all duration-200 ${
            activeTab === 'home'
              ? 'bg-white text-[#141613] font-semibold shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
          aria-label="Accueil"
        >
          <Home className="w-4 h-4" />
          {activeTab === 'home' && (
            <span className="text-xs tracking-tight font-bold">Accueil</span>
          )}
        </button>

        {/* Cart / Plateau Tab */}
        <button
          id="nav-cart-btn"
          onClick={() => setActiveTab('cart')}
          className={`relative flex items-center gap-1.5 p-2 rounded-full transition-all duration-200 ${
            activeTab === 'cart'
              ? 'bg-[#5B6B54] text-white shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
          aria-label="Plateau Cocktail"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalPieces > 0 && (
            <span 
              id="cart-badge-count"
              className="absolute -top-1.5 -right-1.5 bg-[#5B6B54] border-2 border-[#141613] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse"
            >
              {totalPieces > 99 ? '99+' : totalPieces}
            </span>
          )}
        </button>

        {/* Favorites Tab */}
        <button
          id="nav-favorites-btn"
          onClick={() => setActiveTab('favorites')}
          className={`relative flex items-center gap-1.5 p-2 rounded-full transition-all duration-200 ${
            activeTab === 'favorites'
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white'
          }`}
          aria-label="Favoris"
        >
          <Heart className="w-5 h-5" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Contact Tab */}
        <button
          id="nav-contact-btn"
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-1.5 p-2 rounded-full transition-all duration-200 ${
            activeTab === 'contact'
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white'
          }`}
          aria-label="Contact et Devis Traiteur"
        >
          <Phone className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};
