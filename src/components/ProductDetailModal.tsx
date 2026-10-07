import React, { useState } from 'react';
import { X, Heart, Plus, Minus, AlertCircle, Sparkles, ChefHat, Check } from 'lucide-react';
import { MenuItem } from '../types';

interface ProductDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(20);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!isOpen || !item) return null;

  const handleAdd = () => {
    onAddToCart(item, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom duration-300"
      >
        {/* Top Image Container with floating action icons */}
        <div className="relative h-60 w-full bg-[#F6F4EB] flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-gray-700 hover:text-black flex items-center justify-center shadow-xs border border-gray-200"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite(item)}
            className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs border border-gray-200 ${
              isFavorite ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Main Visual */}
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-56 object-cover rounded-2xl shadow-sm"
          />

          {/* Category Pill */}
          <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-xs text-[#5B6B54] text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-gray-100">
            {item.categoryLabel}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Title and Price */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#141613] leading-snug">
                {item.name}
              </h2>
              <p className="text-xs text-[#5B6B54] font-semibold mt-0.5">
                EK Traiteur • Dégustation Cocktail Bordeaux
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xl font-black text-[#141613]">
                {item.priceDisplay || `${item.price.toFixed(2)} €`}
              </span>
              {!item.priceDisplay && <span className="block text-[10px] text-gray-500">/ pièce</span>}
            </div>
          </div>

          {/* Rule banner: Minimum 20 pieces */}
          <div className="bg-[#F6F4EB] border border-amber-950/5 rounded-2xl p-3 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#5B6B54] shrink-0 mt-0.5" />
            <div className="text-xs text-[#141613]/80">
              <p className="font-bold text-[#5B6B54]">
                {item.priceDisplay ? "Création exclusive sur mesure" : "Règle minimale traiteur : 20 pièces"}
              </p>
              <p className="text-[11px] mt-0.5">
                {item.priceDisplay 
                  ? "Confectionnée entièrement selon vos envies (chiffre, parfums, thématique événementielle). Devis personnalisé instantané."
                  : "Pour préserver l'excellence gustative et les cuissons minutes de notre atelier, chaque variété est confectionnée à partir de 20 bouchées."}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-[#141613] uppercase tracking-wider mb-1">
              Description du Chef
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Ingredients list */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#141613] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-[#5B6B54]" />
                Ingrédients & Élaboration
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map((ing, i) => (
                  <span key={i} className="text-[11px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-gray-500">Allergènes : </span>
              <span className="text-[11px] text-gray-700">{item.allergens.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Bottom Selector & Add Button */}
        <div className="p-4 border-t border-gray-100 bg-[#F8F9FA] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">
                {item.priceDisplay ? 'Commande sur mesure' : 'Quantité (Min. 20)'}
              </span>
              <p className="text-sm font-black text-[#141613]">
                {item.priceDisplay ? 'Tarif : Sur devis personnalisé' : `Total: ${(item.price * quantity).toFixed(2)} €`}
              </p>
            </div>

            {/* Stepper with minimum 20 pieces (or 1 for custom creation) */}
            {!item.priceDisplay && (
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(20, quantity - 10))}
                  disabled={quantity <= 20}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-[#141613] flex items-center justify-center font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="text-xs font-black w-8 text-center">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 10)}
                  className="w-7 h-7 rounded-full bg-[#141613] text-white hover:bg-[#5B6B54] flex items-center justify-center font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-3 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 ${
              addedNotice
                ? 'bg-emerald-600 text-white'
                : 'bg-[#141613] hover:bg-[#5B6B54] text-white'
            }`}
          >
            {addedNotice ? (
              <>
                <Check className="w-4 h-4" />
                <span>Ajouté au plateau !</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>
                  {item.priceDisplay 
                    ? 'Ajouter la demande de Number Cake au devis'
                    : `Ajouter ${quantity} pièces au plateau (${(item.price * quantity).toFixed(2)} €)`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
