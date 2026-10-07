import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { EventPlan, Occasion, ReceptionFormat } from '../types';
import { getRecommendedPieces, OCCASIONS, RECEPTION_FORMATS } from '../utils/order';
import { Page } from './ui/Page';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { EASE_OUT } from './ui/motion';
import { haptic } from '../utils/haptics';

interface EventComposerProps {
  open: boolean;
  onClose: () => void;
  initialPlan: EventPlan | null;
  onConfirm: (plan: EventPlan) => void;
}

const DEFAULT_PLAN: EventPlan = { occasion: 'anniversaire', guests: 30, format: 'dinatoire' };
const GUEST_STEP = 5;
const MIN_GUESTS = 5;
const MAX_GUESTS = 500;

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.25 + i * 0.08, ease: EASE_OUT },
});

export const EventComposer: React.FC<EventComposerProps> = ({ open, onClose, initialPlan, onConfirm }) => {
  const [plan, setPlan] = useState<EventPlan>(initialPlan ?? DEFAULT_PLAN);
  const [direction, setDirection] = useState(1);

  // Repart de la réception enregistrée à chaque ouverture
  useEffect(() => {
    if (open) setPlan(initialPlan ?? DEFAULT_PLAN);
  }, [open, initialPlan]);

  const setOccasion = (occasion: Occasion) =>
    // Un apéritif entre amis appelle naturellement le format apéritif
    setPlan((p) => ({ ...p, occasion, format: occasion === 'aperitif' ? 'aperitif' : p.format }));
  const setFormat = (format: ReceptionFormat) => setPlan((p) => ({ ...p, format }));
  const changeGuests = (delta: number) => {
    setDirection(delta > 0 ? 1 : -1);
    setPlan((p) => ({ ...p, guests: Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, p.guests + delta)) }));
  };

  const recommended = getRecommendedPieces(plan);
  const format = RECEPTION_FORMATS.find((f) => f.id === plan.format)!;

  return (
    <Page
      open={open}
      onClose={onClose}
      label="Composer ma réception"
      topLabel="Votre moment · 01 / 03"
      step={1}
      from="bottom"
      zIndex={60}
      footer={
        <button type="button" onClick={() => onConfirm(plan)} className="btn-primary w-full group">
          Choisir mes créations
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.4} />
        </button>
      }
    >
      <div className="px-6 pt-6 pb-6 flex flex-col gap-7">
        <motion.div {...stagger(0)}>
          <span className="eyebrow">Tout commence par votre moment</span>
          <h1 className="font-serif font-medium text-[44px] tracking-[-0.03em] leading-[1.05] mt-4">L’occasion de<br /><em>se retrouver.</em></h1>
          <p className="text-sm text-muted leading-relaxed mt-4">Quelques détails pour imaginer une réception à votre mesure.</p>
        </motion.div>

        <motion.fieldset {...stagger(1)} className="flex flex-col gap-3">
          <legend className="field-label mb-3">Quelle est l'occasion ?</legend>
          <div className="grid grid-cols-2 gap-2">
            {OCCASIONS.map((o) => {
              const active = plan.occasion === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => { haptic('tick'); setOccasion(o.id); }}
                  className={`relative h-14 rounded-[2px] border font-serif text-[20px] transition-colors duration-300 ${
                    active ? 'border-sage text-ivory' : 'border-line-strong text-ink hover:border-sage'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="occasion-highlight"
                      className="absolute inset-0 bg-sage rounded-[1px]"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{o.label}</span>
                </button>
              );
            })}
          </div>
        </motion.fieldset>

        <motion.div {...stagger(2)} className="flex items-center justify-between py-3 border-y border-line">
          <span className="field-label" id="guests-label">Nombre d'invités</span>
          <div className="flex items-center gap-1" role="group" aria-labelledby="guests-label">
            <button
              type="button"
              onClick={() => { haptic('tick'); changeGuests(-GUEST_STEP); }}
              disabled={plan.guests <= MIN_GUESTS}
              aria-label="Moins d'invités"
              className="round-btn"
            >
              <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
            <span className="relative w-16 h-9 overflow-hidden text-center font-serif text-[30px] leading-9" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.span
                  key={plan.guests}
                  custom={direction}
                  className="absolute inset-0"
                  initial={{ y: direction > 0 ? '100%' : '-100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: direction > 0 ? '-100%' : '100%', opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                  {plan.guests}
                </motion.span>
              </AnimatePresence>
            </span>
            <button
              type="button"
              onClick={() => { haptic('tick'); changeGuests(GUEST_STEP); }}
              disabled={plan.guests >= MAX_GUESTS}
              aria-label="Plus d'invités"
              className="round-btn"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

        <motion.fieldset {...stagger(3)} className="flex flex-col gap-2">
          <legend className="field-label mb-3">Format</legend>
          {RECEPTION_FORMATS.map((f) => {
            const active = plan.format === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => { haptic('tick'); setFormat(f.id); }}
                className={`flex items-center justify-between h-[52px] px-4 rounded-[2px] border text-sm transition-all duration-300 ${
                  active ? 'border-sage bg-cream font-normal' : 'border-line-strong hover:border-sage'
                }`}
              >
                <span>{f.label}</span>
                <span className={`text-xs ${active ? 'text-sage' : 'text-muted'}`}>{f.hint}</span>
              </button>
            );
          })}
        </motion.fieldset>

        <motion.div {...stagger(4)} className="bg-cream px-5 py-4 rounded-[2px] flex flex-col gap-1">
          <span className="eyebrow">Notre conseil</span>
          <span className="font-serif text-[30px] leading-tight">
            Environ <AnimatedNumber value={recommended} /> pièces
          </span>
          <span className="text-xs text-muted">
            {plan.guests} invités × {format.piecesPerGuest} pièces, à répartir entre vos créations
          </span>
        </motion.div>
      </div>
    </Page>
  );
};
