import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { formatPrice } from '../utils/order';
import { sheetSpring } from './ui/motion';

interface SelectionBarProps {
  visible: boolean;
  pieces: number;
  total: number;
  /** Pièces conseillées pour la réception composée, si elle existe */
  recommended: number | null;
  guests?: number;
  onOpen: () => void;
}

/** Barre « Ma sélection » qui monte dès que la sélection n'est plus vide */
export const SelectionBar: React.FC<SelectionBarProps> = ({ visible, pieces, total, recommended, guests, onOpen }) => {
  const progress = recommended ? Math.min(1, pieces / recommended) : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="reception-bar fixed bottom-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={sheetSpring}
        >
          <button
            type="button"
            onClick={onOpen}
            className="pointer-events-auto relative w-full max-w-lg min-h-[72px] bg-sage text-ivory rounded-[6px] flex items-center justify-between px-5 py-3 overflow-hidden shadow-[0_14px_40px_rgba(35,38,31,0.22)] group"
          >
            {recommended && (
              <motion.span
                className="absolute left-0 top-0 h-[2px] bg-[#C9B98F] origin-left w-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                aria-hidden="true"
              />
            )}
            <span className="flex flex-col items-start gap-0.5">
              <span className="text-[10px] tracking-[0.16em] uppercase text-[#D3DCCB]">Votre réception{guests ? ` · ${guests} invités` : ''}</span>
              <span className="text-sm font-normal">
                <AnimatedNumber value={pieces} />
                {recommended ? ` / ${recommended}` : ''} pièces ·{' '}
                <AnimatedNumber value={total} format={formatPrice} />
              </span>
            </span>
            <span className="flex items-center gap-2 text-[13px] tracking-[0.06em]">
              Découvrir
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.4} />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
