import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { MenuItem } from '../types';
import { presentationFor } from '../data/productPresentation';
import { formatPrice, isQuoteItem } from '../utils/order';
import { Sheet } from './ui/Sheet';
import { EASE_OUT } from './ui/motion';

interface FavoritesSheetProps {
  open: boolean;
  onClose: () => void;
  favorites: MenuItem[];
  onRemoveFavorite: (item: MenuItem) => void;
  onOpenItem: (item: MenuItem) => void;
}

export const FavoritesSheet: React.FC<FavoritesSheetProps> = ({ open, onClose, favorites, onRemoveFavorite, onOpenItem }) => (
  <Sheet open={open} onClose={onClose} title="Mes favoris" eyebrow={`${favorites.length} création${favorites.length > 1 ? 's' : ''}`}>
    {favorites.length === 0 ? (
      <p className="py-10 text-center text-sm text-muted">
        Touchez le cœur d'une création pour la retrouver ici.
      </p>
    ) : (
      <ul className="border-t border-line">
        <AnimatePresence initial={false}>
          {favorites.map((item, i) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.05, duration: 0.5, ease: EASE_OUT } }}
              exit={{ opacity: 0, x: 40, height: 0, transition: { duration: 0.3 } }}
              className="overflow-hidden border-b border-line"
            >
              <div className="flex items-center gap-4 py-3">
                <button type="button" onClick={() => onOpenItem(item)} className="flex items-center gap-4 flex-1 min-w-0 text-left">
                  <img src={item.cutout ?? item.image} alt="" className="w-16 h-20 object-contain rounded-[3px] bg-cream p-1 shrink-0" />
                  <span className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-serif text-[23px] leading-[1.15]">{presentationFor(item).title}</span>
                    <span className="text-xs text-muted">{isQuoteItem(item) ? 'Sur devis' : `${formatPrice(item.price)} la pièce`}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveFavorite(item)}
                  aria-label={`Retirer ${item.name} des favoris`}
                  className="icon-btn shrink-0"
                >
                  <Heart className="w-5 h-5 fill-sage text-sage" strokeWidth={1.3} />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    )}
  </Sheet>
);
