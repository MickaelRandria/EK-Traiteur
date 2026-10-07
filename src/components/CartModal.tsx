import React from 'react';
import { X, Trash2, Plus, Minus, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  totalPieces: number;
  totalPrice: number;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  totalPieces,
  totalPrice,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom duration-300"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F8F9FA]">
          <div>
            <h2 className="text-base font-bold text-[#141613]">
              Mon Plateau Cocktail
            </h2>
            <p className="text-xs text-[#5B6B54] font-medium">
              {totalPieces} pièce{totalPieces > 1 ? 's' : ''} sélectionnée{totalPieces > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center border border-gray-200 shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rule reminder: Min 20 pieces */}
        <div className="bg-[#F6F4EB] px-5 py-2.5 border-b border-amber-950/5 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#5B6B54] shrink-0" />
          <p className="text-xs text-[#141613]/80 leading-tight">
            <span className="font-bold text-[#5B6B54]">Règle Traiteur EK :</span> Minimum de <strong>20 pièces par variété</strong> pour garantir la fraîcheur et la confection artisanale minute.
          </p>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100 space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-[#141613]">Votre plateau est vide</p>
              <p className="text-xs text-gray-500 mt-1 max-w-[240px]">
                Sélectionnez vos pièces cocktail préférées pour composer votre dégustation traiteur.
              </p>
            </div>
          ) : (
            cartItems.map((entry) => {
              const itemTotal = entry.item.price * entry.quantity;
              const meetsRule = entry.quantity >= 20;

              return (
                <div key={entry.item.id} className="pt-4 first:pt-0 flex items-center gap-3">
                  {/* Thumbnail */}
                  <img
                    src={entry.item.image}
                    alt={entry.item.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#141613] truncate">
                      {entry.item.name}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {entry.item.priceDisplay || `${entry.item.price.toFixed(2)} € / pièce`}
                    </p>

                    {/* Minimum compliance badge */}
                    <div className="flex items-center gap-1 mt-1">
                      {entry.item.priceDisplay ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Création sur mesure
                        </span>
                      ) : meetsRule ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Min. 20 respecté
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Min. 20 pièces requis
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-xs font-black text-[#141613]">
                      {entry.item.priceDisplay ? 'Sur devis' : `${itemTotal.toFixed(2)} €`}
                    </span>

                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                      <button
                        onClick={() => {
                          if (entry.quantity <= 20) {
                            onRemoveItem(entry.item.id);
                          } else {
                            onUpdateQuantity(entry.item.id, entry.quantity - 10);
                          }
                        }}
                        className="w-6 h-6 rounded bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-xs text-xs font-bold"
                        aria-label="Diminuer la quantité"
                      >
                        {entry.quantity <= 20 ? <Trash2 className="w-3 h-3 text-rose-500" /> : <Minus className="w-3 h-3" />}
                      </button>

                      <span className="text-xs font-bold px-1.5 min-w-[28px] text-center">
                        {entry.quantity}
                      </span>

                      <button
                        onClick={() => onUpdateQuantity(entry.item.id, entry.quantity + 10)}
                        className="w-6 h-6 rounded bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-xs text-xs font-bold"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Suggestion calculator */}
        {cartItems.length > 0 && (
          <div className="px-5 py-2 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-600 flex items-center justify-between">
            <span>Guide dégustation :</span>
            <span className="font-semibold text-[#5B6B54]">
              ≈ pour {Math.max(1, Math.round(totalPieces / 14))} convives (dînatoire)
            </span>
          </div>
        )}

        {/* Modal Footer / Summary & Action */}
        <div className="p-5 border-t border-gray-100 bg-[#F8F9FA] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">Total estimé TTC</span>
              <p className="text-xl font-black text-[#141613] tracking-tight">
                {totalPrice.toFixed(2)} €
              </p>
            </div>
            <span className="text-xs font-semibold text-[#5B6B54] bg-[#5B6B54]/10 px-2.5 py-1 rounded-full">
              {totalPieces} bouchées
            </span>
          </div>

          <button
            id="btn-proceed-checkout"
            type="button"
            disabled={cartItems.length === 0}
            onClick={onProceedToCheckout}
            className="w-full py-3 px-4 rounded-full bg-[#141613] hover:bg-[#5B6B54] disabled:bg-gray-300 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Finaliser la commande traiteur</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
