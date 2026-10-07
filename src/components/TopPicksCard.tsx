import React from 'react';
import { Heart, Plus, Star } from 'lucide-react';
import { MenuItem } from '../types';

interface TopPicksCardProps {
  item: MenuItem;
  isFavorite: boolean;
  onToggleFavorite: (item: MenuItem) => void;
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, quantity: number) => void;
}

export const TopPicksCard: React.FC<TopPicksCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onSelectItem,
  onQuickAdd,
}) => {
  return (
    <section id="section-top-picks" className="px-5 pt-3 pb-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-base font-bold text-[#141613] tracking-tight">
          Coup de Cœur
        </h2>
        <span className="text-[11px] font-semibold text-[#5B6B54] uppercase tracking-wider">
          Top Picks Traiteur
        </span>
      </div>

      {/* Main Card with Vanilla Cream background #F6F4EB */}
      <div 
        id="card-top-pick"
        onClick={() => onSelectItem(item)}
        className="relative bg-[#F6F4EB] rounded-3xl p-4 sm:p-5 shadow-sm border border-amber-950/5 cursor-pointer hover:shadow-md transition-all duration-300 group overflow-hidden"
      >
        {/* Floating Heart Favorite Button */}
        <button
          id="btn-favorite-top-pick"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item);
          }}
          className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-200 active:scale-90 ${
            isFavorite ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
          }`}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : ''
            }`} 
          />
        </button>

        {/* Product Visual */}
        <div className="relative h-44 sm:h-48 w-full flex items-center justify-center my-1">
          {/* Subtle soft backdrop radial lighting */}
          <div className="absolute w-40 h-24 bg-amber-100/60 rounded-full blur-xl transform translate-y-3" />
          
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="relative max-h-40 sm:max-h-44 w-auto object-contain drop-shadow-lg rounded-2xl transform transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badge: Minimum 20 pièces */}
          <div className="absolute bottom-1 left-1 bg-white/90 backdrop-blur-xs text-[#5B6B54] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-[#5B6B54]/20">
            Min. 20 pièces
          </div>
        </div>

        {/* Bottom Details (Exact layout as Nike reference) */}
        <div className="mt-2 pt-2 border-t border-black/5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#141613] leading-snug line-clamp-1">
                {item.name}
              </h3>
              
              {/* Customer avatars + rating */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <img
                    className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                    alt="Client avis"
                  />
                  <img
                    className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                    alt="Client avis"
                  />
                  <img
                    className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                    alt="Client avis"
                  />
                </div>
                <div className="flex items-center gap-1 text-xs text-[#141613]/70 font-medium">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>4.9 ★ (120+ avis)</span>
                </div>
              </div>
            </div>

            {/* Price & Quick Add Button */}
            <div className="text-right flex flex-col items-end shrink-0">
              <span className="text-lg sm:text-xl font-extrabold text-[#141613] tracking-tight">
                {item.price.toFixed(2)} €
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                / pièce
              </span>
              
              <button
                id="btn-add-top-pick"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd(item, 20);
                }}
                className="mt-1 inline-flex items-center gap-1 bg-[#141613] hover:bg-[#5B6B54] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>+20 pcs</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
