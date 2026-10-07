import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CartItem } from '../types';
import { isQuoteItem } from '../utils/order';

interface LivingTrayProps {
  cartItems: CartItem[];
  pieces: number;
  recommended: number | null;
}

const MAX_TOKENS = 48;
const BASE_UNIT = 10;
/** Au-delà, les emplacements restants sont résumés par une pastille « +N » */
const MAX_GHOSTS = 9;

/** Angle « aléatoire » mais stable pour chaque pastille */
const angleFor = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return (h % 40) - 20;
};

/**
 * Plateau vivant : chaque pastille représente un lot de pièces. Les pastilles tombent
 * sur le plateau à l'ajout, s'envolent au retrait, et des emplacements en pointillé
 * montrent ce qu'il reste à choisir pour la réception.
 */
export const LivingTray: React.FC<LivingTrayProps> = ({ cartItems, pieces, recommended }) => {
  // Une pastille = 10 pièces, ou davantage pour les grosses réceptions afin de rester lisible
  const target = Math.max(pieces, recommended ?? 0);
  const unit = Math.max(BASE_UNIT, Math.ceil(target / MAX_TOKENS / BASE_UNIT) * BASE_UNIT);

  const tokens = cartItems.flatMap((entry) => {
    const count = isQuoteItem(entry.item) ? 1 : Math.max(1, Math.round(entry.quantity / unit));
    return Array.from({ length: count }, (_, i) => ({
      key: `${entry.item.id}-${i}`,
      src: entry.item.cutout ?? entry.item.image,
      name: entry.item.name,
      special: isQuoteItem(entry.item),
    }));
  });
  const remaining = recommended ? Math.max(0, Math.ceil((recommended - pieces) / unit)) : 0;
  const ghosts = Math.min(remaining, MAX_GHOSTS);
  const overflow = remaining - ghosts;

  return (
    <div className="living-tray" role="img" aria-label={`Plateau : ${pieces} pièces${recommended ? ` sur ${recommended} conseillées` : ''}`}>
      <div className="living-tray-surface">
        <AnimatePresence mode="popLayout" initial={false}>
          {tokens.map((token, i) => (
            <motion.span
              key={token.key}
              layout
              className={`living-tray-token ${token.special ? 'is-special' : ''}`}
              initial={{ y: -46, scale: 0.3, opacity: 0, rotate: angleFor(token.key) - 30 }}
              animate={{ y: 0, scale: 1, opacity: 1, rotate: angleFor(token.key) }}
              exit={{ scale: 0, opacity: 0, y: -18, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 18, delay: Math.min(i, 12) * 0.018 }}
            >
              <img src={token.src} alt="" draggable={false} />
            </motion.span>
          ))}
          {Array.from({ length: ghosts }, (_, i) => (
            <motion.span
              key={`ghost-${i}`}
              layout
              className="living-tray-token is-ghost"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3 }}
            />
          ))}
          {overflow > 0 && (
            <motion.span
              key="ghost-more"
              layout
              className="living-tray-token is-ghost is-more"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              +{overflow}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <p className="living-tray-legend">
        1 pastille = {unit} pièces{recommended ? ' · les pointillés montrent ce qu’il reste à choisir' : ''}
      </p>
    </div>
  );
};
