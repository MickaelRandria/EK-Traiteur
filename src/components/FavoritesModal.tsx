import React from 'react';
import { X, Heart, Plus, Trash2 } from 'lucide-react';
import { MenuItem } from '../types';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: MenuItem[];
  onRemoveFavorite: (item: MenuItem) => void;
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, quantity: number) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectItem,
  onQuickAdd,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom duration-300"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F8F9FA]">
          <div>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
              Mes Sélections
            </span>
            <h2 className="text-base font-bold text-[#141613]">
              Bouchées Favorites ({favorites.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center border border-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100 space-y-3">
          {favorites.length === 0 ? (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-300 flex items-center justify-center mb-3">
                <Heart className="w-7 h-7" />
              </div>
              <p className="text-xs font-semibold text-[#141613]">Aucun favori pour le moment</p>
              <p className="text-[11px] text-gray-400 mt-1 max-w-[220px]">
                Cliquez sur le cœur d'une création pour l'enregistrer dans vos envies.
              </p>
            </div>
          ) : (
            favorites.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="pt-3 first:pt-0 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/80 p-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#141613] truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {item.categoryLabel} • {item.priceDisplay || `${item.price.toFixed(2)} € / pièce`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(item, item.priceDisplay ? 1 : 20);
                    }}
                    className="bg-[#141613] hover:bg-[#5B6B54] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{item.priceDisplay ? 'Devis' : '+20 pcs'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(item);
                    }}
                    className="w-7 h-7 rounded-full text-gray-400 hover:text-rose-500 flex items-center justify-center hover:bg-rose-50 transition-colors"
                    aria-label="Supprimer des favoris"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
