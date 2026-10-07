import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import { MenuItem } from '../types';
import { presentationFor } from '../data/productPresentation';
import { formatPrice, isQuoteItem } from '../utils/order';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { EASE_OUT } from './ui/motion';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  onOpenItem: (item: MenuItem) => void;
}

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ open, onClose, items, onOpenItem }) => {
  const [query, setQuery] = useState('');
  useLockBodyScroll(open);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(open, dialogRef);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const q = normalize(query.trim());
  const results = q
    ? items.filter((item) =>
        [item.name, item.description, item.categoryLabel, ...(item.ingredients ?? [])].some((text) =>
          normalize(text).includes(q)
        )
      )
    : items;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Rechercher une création"
          className="fixed inset-0 z-[52] bg-ivory/97 backdrop-blur-md overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="max-w-xl mx-auto px-6 pt-6 pb-10">
            <span className="eyebrow">Explorez la collection</span>
            <h1 className="font-serif text-[42px] tracking-[-0.03em] leading-tight mt-4 mb-6">Votre prochaine <em>envie.</em></h1>
            <div className="flex items-center gap-3 border-b border-ink pb-3">
              <Search className="w-5 h-5 shrink-0" strokeWidth={1.2} />
              <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }}
                type="search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Poulet, verrine, sucré…"
                aria-label="Rechercher"
                className="flex-1 min-w-0 bg-transparent outline-none font-serif text-[25px] placeholder:text-muted"
              />
              <button type="button" onClick={onClose} aria-label="Fermer la recherche" className="icon-btn -mr-2">
                <X className="w-5 h-5" strokeWidth={1.3} />
              </button>
            </div>

            <p className="eyebrow mt-6 mb-2">
              {results.length} création{results.length > 1 ? 's' : ''}
            </p>
            {results.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted">Aucune création ne correspond à « {query} ».</p>
            ) : (
              <ul>
                <AnimatePresence mode="popLayout">
                  {results.map((item, i) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.04, duration: 0.5, ease: EASE_OUT } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      className="border-b border-line"
                    >
                      <button type="button" onClick={() => onOpenItem(item)} className="w-full flex items-center gap-4 py-3 text-left group">
                        <img src={item.cutout ?? item.image} alt="" className="w-16 h-20 object-contain rounded-[3px] bg-cream p-1 shrink-0" />
                        <span className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-serif text-[20px] leading-[1.15] transition-transform duration-300 group-hover:translate-x-1">
                            {presentationFor(item).title}
                          </span>
                          <span className="text-xs text-muted">
                            {item.categoryLabel} · {isQuoteItem(item) ? 'sur devis' : `${formatPrice(item.price)} la pièce`}
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
