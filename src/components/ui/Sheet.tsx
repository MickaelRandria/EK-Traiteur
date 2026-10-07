import React, { useRef } from 'react';
import { AnimatePresence, motion, useDragControls } from 'motion/react';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { fadeTransition, sheetSpring } from './motion';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  zIndex?: number;
}

/** Panneau qui monte du bas (centré sur ordinateur). On le ferme en le faisant glisser vers le bas. */
export const Sheet: React.FC<SheetProps> = ({ open, onClose, title, eyebrow, children, footer, zIndex = 50 }) => {
  const dragControls = useDragControls();
  useLockBodyScroll(open);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(open, dialogRef);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-6" style={{ zIndex }}>
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
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
            aria-label={title}
            className="atelier-panel relative w-full max-w-lg bg-ivory rounded-t-[12px] sm:rounded-[6px] max-h-[88dvh] flex flex-col shadow-[0_-20px_60px_rgba(35,38,31,0.18)]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={sheetSpring}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            <div
              className="pt-3 pb-4 px-6 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-strong sm:hidden" />
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                  <h2 className="font-serif text-[28px] leading-none font-medium">{title}</h2>
                </div>
                <button type="button" onClick={onClose} aria-label="Fermer" className="icon-btn -mr-2 -mt-1">
                  <X className="w-5 h-5" strokeWidth={1.3} />
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-line">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
