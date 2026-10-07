import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ExplodedPart, INGREDIENTS, PARTS } from './ui/BaoStoryParts';
import { EASE_OUT } from './ui/motion';

interface BaoStoryProps {
  onOpenBao: () => void;
}

/** Fenêtres de défilement (0 → 1 sur toute la section) */
const EXPLODE = [0.06, 0.22];
const TOUR = [0.26, 0.82];
const ASSEMBLE = [0.86, 0.96];

/**
 * Récit au défilement : le bao reste à l'écran pendant que l'on fait défiler la page.
 * Il s'ouvre, chaque ingrédient est raconté à son tour, puis il se réassemble.
 */
export const BaoStory: React.FC<BaoStoryProps> = ({ onOpenBao }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // Lissage léger pour que les couches « glissent » au lieu de suivre la molette au pixel près
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  const explode = useTransform(smooth, [EXPLODE[0], EXPLODE[1], ASSEMBLE[0], ASSEMBLE[1]], [0, 1, 1, 0]);
  const wholeOpacity = useTransform(explode, [0, 0.07], [1, 0]);
  const partsOpacity = useTransform(explode, [0, 0.05], [0, 1]);
  const shadow = useTransform(
    explode,
    (v: number) => `drop-shadow(0 ${6 + 12 * v}px ${8 + 10 * v}px rgba(35,38,31,${0.12 + 0.08 * v}))`
  );
  const rail = useTransform(smooth, [0, 1], [0, 1]);
  const haloScale = useTransform(explode, [0, 1], [0.8, 1.15]);

  const [active, setActive] = useState<number | null>(null);
  const [phase, setPhase] = useState<'intro' | 'tour' | 'outro'>('intro');

  useMotionValueEvent(smooth, 'change', (v) => {
    if (v < TOUR[0]) {
      setPhase('intro');
      setActive(null);
    } else if (v > TOUR[1]) {
      setPhase('outro');
      setActive(null);
    } else {
      setPhase('tour');
      const span = (TOUR[1] - TOUR[0]) / INGREDIENTS.length;
      setActive(Math.min(INGREDIENTS.length - 1, Math.floor((v - TOUR[0]) / span)));
    }
  });

  const current = active != null ? INGREDIENTS[active] : null;

  return (
    <section ref={sectionRef} className="bao-story" aria-label="L'histoire du bao, ingrédient par ingrédient">
      <div className="bao-story-sticky">
        <div className="bao-story-copy">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={phase === 'tour' ? current?.id : phase}
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="bao-story-text"
            >
              {phase === 'intro' && (
                <>
                  <span className="eyebrow">La pièce signature</span>
                  <h2>
                    Un bao.
                    <br />
                    <em>Six secrets.</em>
                  </h2>
                  <p>Faites défiler : on vous ouvre la recette.</p>
                </>
              )}
              {phase === 'tour' && current && (
                <>
                  <span className="eyebrow">
                    {String((active ?? 0) + 1).padStart(2, '0')} / {String(INGREDIENTS.length).padStart(2, '0')}
                  </span>
                  <h2>{current.title}</h2>
                  <p>{current.note}</p>
                </>
              )}
              {phase === 'outro' && (
                <>
                  <span className="eyebrow">Réassemblé à la main</span>
                  <h2>
                    Prêt pour
                    <br />
                    <em>vos invités.</em>
                  </h2>
                  <button type="button" onClick={onOpenBao} className="btn-primary group mt-2">
                    Découvrir le bao
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.4} />
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="bao-story-stage" aria-hidden="true">
          <motion.span className="bao-exploded-halo" style={{ scale: haloScale }} />
          <motion.img
            src="/products/cutouts/bao-poulet-isolated.webp"
            alt=""
            className="bao-story-whole"
            style={{ opacity: wholeOpacity }}
            draggable={false}
          />
          <motion.div className="bao-exploded-parts" style={{ opacity: partsOpacity }}>
            {PARTS.map((part, index) => (
              <ExplodedPart
                key={part.id}
                part={part}
                index={index}
                progress={explode}
                shadow={shadow}
                expanded={false}
                highlighted={current?.id === part.ingredient}
                dimmed={current != null && current.id !== part.ingredient}
                showPin={current?.id === part.ingredient && PARTS.findIndex((p) => p.ingredient === part.ingredient) === index}
                pinId="bao-story-pin"
                onSelect={() => undefined}
              />
            ))}
          </motion.div>
        </div>

        {/* Progression du récit */}
        <div className="bao-story-rail" aria-hidden="true">
          <motion.span style={{ scaleY: rail }} />
        </div>
      </div>
    </section>
  );
};
