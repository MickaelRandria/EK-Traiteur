import React from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';

/** Ingrédients présentés pendant la visite guidée, dans l'ordre */
export const INGREDIENTS = [
  { id: 'bao', title: 'Bao vapeur', note: 'Pétri à l’atelier, cuit à la vapeur : ultra-moelleux.' },
  { id: 'sauce', title: 'Sauce laquée', note: 'La recette secrète du chef, sucrée-salée.' },
  { id: 'poulet', title: 'Poulet fermier', note: 'Croustillant, laqué juste avant le service.' },
  { id: 'carottes', title: 'Carottes marinées', note: 'Taillées fines, pour le croquant.' },
  { id: 'concombre', title: 'Concombre frais', note: 'Une touche de fraîcheur.' },
  { id: 'buns', title: 'Mini buns briochés', note: 'Dorés au four, servis à côté.' },
] as const;

type IngredientId = (typeof INGREDIENTS)[number]['id'];

/**
 * Les morceaux, du haut vers le bas, sur un axe vertical unique.
 * Positions en % de la scène : `closed` reconstitue le bao, `open` l'éclate.
 */
export const PARTS: {
  id: string;
  ingredient: IngredientId;
  width: number;
  closedY: number;
  openY: number;
  x?: { closed: number; open: number };
  tilt: number;
}[] = [
  { id: 'bao-top', ingredient: 'bao', width: 54, closedY: 38, openY: 12, tilt: -3 },
  { id: 'sauce', ingredient: 'sauce', width: 25, closedY: 47, openY: 27, tilt: 4 },
  { id: 'poulet', ingredient: 'poulet', width: 44, closedY: 50, openY: 42, tilt: -2 },
  { id: 'carottes', ingredient: 'carottes', width: 34, closedY: 52, openY: 57, tilt: 3 },
  { id: 'concombre', ingredient: 'concombre', width: 36, closedY: 56, openY: 70, tilt: -3 },
  { id: 'bao-bottom', ingredient: 'bao', width: 54, closedY: 62, openY: 85, tilt: 2 },
  { id: 'buns', ingredient: 'buns', width: 24, closedY: 66, openY: 80, x: { closed: 62, open: 86 }, tilt: -4 },
];

const STACK_CENTER = 2.5;

export interface ExplodedPartProps {
  part: (typeof PARTS)[number];
  index: number;
  progress: MotionValue<number>;
  shadow: MotionValue<string>;
  expanded: boolean;
  highlighted: boolean;
  dimmed: boolean;
  /** Le repère lumineux n'apparaît que sur une couche (le bao a deux moitiés) */
  showPin: boolean;
  /** Identifiant d'animation du repère (distinct par éclaté affiché) */
  pinId?: string;
  onSelect: () => void;
}

export const ExplodedPart: React.FC<ExplodedPartProps> = ({ part, index, progress, shadow, expanded, highlighted, dimmed, showPin, pinId = 'bao-pin', onSelect }) => {
  // Les couches s'écartent du centre vers l'extérieur : les plus éloignées partent un peu plus tard
  const distance = part.id === 'buns' ? 1 : Math.abs(index - STACK_CENTER) / STACK_CENTER;
  const local = (v: number) => (v >= 1 ? v : Math.max(0, Math.min(1, (v - distance * 0.18) / 0.82)));
  const top = useTransform(progress, (v: number) => `${part.closedY + (part.openY - part.closedY) * local(v)}%`);
  const left = useTransform(progress, (v: number) =>
    part.x ? `${part.x.closed + (part.x.open - part.x.closed) * local(v)}%` : '50%'
  );
  const rotate = useTransform(progress, (v: number) => part.tilt * Math.max(0, local(v)));

  return (
    <motion.div
      className="bao-exploded-part"
      data-part={part.id}
      style={{ top, left, rotate, width: `${part.width}%`, filter: shadow, zIndex: highlighted ? 5 : 1 }}
    >
      <motion.button
        type="button"
        className="bao-exploded-part-button"
        tabIndex={expanded ? 0 : -1}
        aria-label={`Mettre en lumière : ${part.ingredient}`}
        onClick={onSelect}
        animate={{
          scale: highlighted ? 1.1 : dimmed ? 0.96 : 1,
          opacity: dimmed ? 0.5 : 1,
          filter: dimmed ? 'blur(1px) saturate(0.75)' : 'blur(0px) saturate(1)',
          y: highlighted ? -6 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 22,
          // pas de ressort sur le flou et l'opacité : un dépassement donnerait un flou négatif
          filter: { duration: 0.35, ease: 'easeOut' },
          opacity: { duration: 0.35, ease: 'easeOut' },
        }}
      >
        <img src={`/products/exploded/bao-poulet/${part.id}.webp`} alt="" draggable={false} />
        {showPin && (
          <motion.span
            className="bao-exploded-pin"
            layoutId={pinId}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          />
        )}
      </motion.button>
    </motion.div>
  );
};
