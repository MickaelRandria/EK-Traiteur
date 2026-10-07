import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem, EventPlan, MenuItem } from '../types';
import { MENU_DATA } from '../data/menuData';
import { presentationFor } from '../data/productPresentation';
import {
  describeEvent,
  formatPrice,
  getItemsBelowMinimum,
  isQuoteItem,
  MIN_PIECES_PER_VARIETY,
} from '../utils/order';
import { Page } from './ui/Page';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { EASE_OUT } from './ui/motion';

interface SelectionPageProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  pieces: number;
  total: number;
  event: EventPlan | null;
  recommended: number | null;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onAdd: (item: MenuItem, quantity: number, origin?: HTMLElement | null) => void;
  onCompose: () => void;
  onBrowse: () => void;
  onCheckout: () => void;
}

export const SelectionPage: React.FC<SelectionPageProps> = ({
  open,
  onClose,
  cartItems,
  pieces,
  total,
  event,
  recommended,
  onUpdateQuantity,
  onRemove,
  onAdd,
  onCompose,
  onBrowse,
  onCheckout,
}) => {
  const suggestionImage = useRef<HTMLImageElement>(null);
  const belowMinimum = getItemsBelowMinimum(cartItems);
  const canContinue = cartItems.length > 0 && belowMinimum.length === 0;
  const hasSweet = cartItems.some((entry) => entry.item.isSweet);
  const missing = recommended ? Math.max(0, recommended - pieces) : 0;
  const progress = recommended ? Math.min(100, Math.round((pieces / recommended) * 100)) : 0;

  // Suggestion : une douceur sucrée si la sélection n'en contient pas encore
  const suggestion = !hasSweet
    ? MENU_DATA.find((item) => item.isSweet && !isQuoteItem(item) && !cartItems.some((e) => e.item.id === item.id))
    : undefined;

  const advice = !recommended
    ? null
    : missing > 0
      ? `Il manque environ ${missing} pièces.${!hasSweet ? ' Pensez à une touche sucrée pour finir la soirée.' : ''}`
      : 'Quantité idéale atteinte pour vos invités.';

  return (
    <Page
      open={open}
      onClose={onClose}
      label="Votre réception"
      topLabel={event ? 'Votre sélection · 02 / 03' : 'Votre réception'}
      step={event ? 2 : undefined}
      footer={
        cartItems.length > 0 ? (
          <div className="flex flex-col gap-4">
            {belowMinimum.length > 0 && (
              <p role="alert" className="text-xs text-[#8A5A1F]">
                Minimum {MIN_PIECES_PER_VARIETY} pièces par création : ajustez{' '}
                {belowMinimum.map((e) => e.item.name).join(', ')}.
              </p>
            )}
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-muted">Total estimé TTC</span>
              <AnimatedNumber value={total} format={formatPrice} className="font-serif text-[30px] leading-none" />
            </div>
            <button type="button" onClick={onCheckout} disabled={!canContinue} className="btn-primary w-full group">
              Préparer ma demande
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.4} />
            </button>
          </div>
        ) : undefined
      }
    >
      <div className="px-6 pt-4 pb-6 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT }}
          className="flex flex-col gap-1"
        >
          <span className="eyebrow mb-3">Une table à votre image</span>
          <h1 className="font-serif font-medium text-[42px] leading-[1.05] tracking-[-0.03em]">Votre réception.</h1>
          {event ? (
            <p className="text-[13px] text-muted">
              {describeEvent(event)} ·{' '}
              <button type="button" onClick={onCompose} className="underline underline-offset-4 decoration-line-strong hover:text-ink">
                modifier
              </button>
            </p>
          ) : null}
        </motion.div>

        <div className="reception-summary">
          <span className="eyebrow">Les beaux moments se préparent ici</span>
          <div className="reception-metrics">
            <div><strong>{event?.guests ?? '—'}</strong><span>invités</span></div>
            <div><strong>{pieces}</strong><span>pièces choisies</span></div>
            <div><strong>{cartItems.length}</strong><span>créations</span></div>
          </div>
        </div>

        {recommended ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
            className="mt-5 bg-cream px-5 py-4 rounded-[2px] flex flex-col gap-3"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-[24px]">
                <AnimatedNumber value={pieces} />{' '}
                <span className="text-[17px] text-muted">/ {recommended} pièces conseillées</span>
              </span>
              <span className="text-xs text-sage">{progress} %</span>
            </div>
            <div className="h-[3px] bg-line-strong overflow-hidden">
              <motion.div
                className="h-full bg-sage origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 1, delay: 0.5, ease: EASE_OUT }}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={advice}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-xs text-ink-soft"
              >
                {advice}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.button
            type="button"
            onClick={onCompose}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
            className="mt-5 text-left bg-cream px-5 py-4 rounded-[2px] flex items-center justify-between gap-4 group"
          >
            <span className="flex flex-col gap-1">
              <span className="eyebrow">Combien d'invités ?</span>
              <span className="text-sm text-ink-soft">Composez votre réception pour un conseil de quantité.</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.4} />
          </motion.button>
        )}

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="py-14 flex flex-col items-center gap-3 text-center"
          >
            <p className="font-serif text-[28px]">Tout commence par une envie.</p>
            <p className="text-sm text-muted max-w-[260px]">Parcourez la carte et choisissez vos créations, à partir de 20 pièces.</p>
            <button type="button" onClick={onBrowse} className="btn-outline mt-3">
              Découvrir la carte
            </button>
          </motion.div>
        ) : (
          <ul className="mt-3">
            <AnimatePresence>
              {cartItems.map((entry, index) => {
                const quote = isQuoteItem(entry.item);
                const atMinimum = entry.quantity <= MIN_PIECES_PER_VARIETY;
                return (
                  <motion.li
                    key={entry.item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto', transition: { duration: 0.5, delay: 0.25 + index * 0.06, ease: EASE_OUT } }}
                    exit={{ opacity: 0, x: 40, height: 0, transition: { duration: 0.35, ease: EASE_OUT } }}
                    className="overflow-hidden border-b border-line"
                  >
                    <div className="reception-item py-5">
                      <img src={entry.item.cutout ?? entry.item.image} alt="" className="w-[68px] h-[76px] object-contain rounded-[3px] bg-cream p-1 shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <span className="font-serif text-[23px] leading-[1.15]">{presentationFor(entry.item).title}</span>
                        <span className="text-xs text-muted">
                          {quote ? (
                            'Création sur mesure · sur devis'
                          ) : (
                            <>
                              {entry.quantity} pièces ·{' '}
                              <AnimatedNumber value={entry.item.price * entry.quantity} format={formatPrice} />
                            </>
                          )}
                        </span>
                      </div>
                      {quote ? (
                        <button
                          type="button"
                          onClick={() => onRemove(entry.item.id)}
                          aria-label={`Retirer ${entry.item.name}`}
                          className="round-btn reception-controls"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.3} />
                        </button>
                      ) : (
                        <div className="reception-controls flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              atMinimum ? onRemove(entry.item.id) : onUpdateQuantity(entry.item.id, entry.quantity - 10)
                            }
                            aria-label={atMinimum ? `Retirer ${entry.item.name}` : 'Retirer 10 pièces'}
                            className="round-btn"
                          >
                            {atMinimum ? (
                              <Trash2 className="w-4 h-4" strokeWidth={1.3} />
                            ) : (
                              <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(entry.item.id, entry.quantity + 10)}
                            aria-label="Ajouter 10 pièces"
                            className="round-btn"
                          >
                            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}

        <AnimatePresence>
          {cartItems.length > 0 && suggestion && (
            <motion.div
              key={suggestion.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6, ease: EASE_OUT } }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-4 py-4"
            >
              <img ref={suggestionImage} src={suggestion.cutout ?? suggestion.image} alt="" className="w-16 h-20 object-contain rounded-[3px] bg-cream p-1 shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="eyebrow">La touche finale</span>
                <span className="font-serif text-[23px] leading-[1.15]">{presentationFor(suggestion).title}</span>
              </div>
              <button
                type="button"
                onClick={() => onAdd(suggestion, MIN_PIECES_PER_VARIETY, suggestionImage.current)}
                className="btn-outline border-sage text-sage shrink-0"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> 20
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Page>
  );
};
