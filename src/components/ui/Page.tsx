import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { drawerTransition, fadeTransition } from './motion';

interface PageProps {
  open: boolean;
  onClose: () => void;
  /** Libellé accessible de la fenêtre */
  label: string;
  /** Texte centré dans la barre du haut (ex. « Étape 2 sur 3 ») */
  topLabel?: React.ReactNode;
  /** Progression 1..3 du parcours de commande, affichée en fins traits */
  step?: number;
  from?: 'right' | 'bottom';
  zIndex?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Écran plein format qui glisse depuis la droite (ou le bas).
 * Sur ordinateur, il s'ouvre en panneau latéral au-dessus de la page assombrie.
 */
export const Page: React.FC<PageProps> = ({
  open,
  onClose,
  label,
  topLabel,
  step,
  from = 'right',
  zIndex = 45,
  children,
  footer,
}) => {
  useLockBodyScroll(open);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(open, dialogRef);
  const offscreen = from === 'right' ? { x: '100%' } : { y: '100%' };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 flex justify-end" style={{ zIndex }}>
          <motion.div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
            onClick={onClose}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="atelier-panel relative w-full md:max-w-[520px] h-[100dvh] bg-ivory flex flex-col shadow-[-30px_0_80px_rgba(35,38,31,0.18)]"
            initial={offscreen}
            animate={{ x: 0, y: 0 }}
            exit={offscreen}
            transition={drawerTransition}
          >
            <header className="panel-top flex items-center justify-between px-4 pt-3">
              <button type="button" onClick={onClose} aria-label="Retour" className="icon-btn">
                <ChevronLeft className="w-6 h-6" strokeWidth={1.2} />
              </button>
              <span className="eyebrow">{topLabel}</span>
              <span className="w-11" />
            </header>
            {step && (
              <div className="grid grid-cols-3 gap-1.5 px-6 pt-2" aria-hidden="true">
                {[1, 2, 3].map((s) => (
                  <span key={s} className="h-[2px] bg-line overflow-hidden">
                    <motion.span
                      className="block h-full bg-sage origin-left"
                      initial={{ scaleX: s < step ? 1 : 0 }}
                      animate={{ scaleX: s <= step ? 1 : 0 }}
                      transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
                    />
                  </span>
                ))}
              </div>
            )}
            <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
            {footer && <div className="panel-footer px-6 pt-4 border-t border-line bg-ivory">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
