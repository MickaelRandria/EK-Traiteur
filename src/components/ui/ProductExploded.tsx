import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Expand, RotateCcw } from 'lucide-react';

const PARTS = [
  { id: 'bao', title: 'Bao vapeur', note: 'Artisanal, ultra-moelleux', x: 42, y: 22, width: 38, angle: -8, labelX: 0, labelY: 5, side: 'left', anchorX: 38, anchorY: 20 },
  { id: 'poulet', title: 'Poulet fermier', note: 'Croustillant & laqué', x: 54, y: 42, width: 39, angle: 6, labelX: 73, labelY: 29, side: 'right', anchorX: 62, anchorY: 40 },
  { id: 'concombre', title: 'Concombre frais', note: 'Tout en fraîcheur', x: 41, y: 59, width: 28, angle: -12, labelX: 0, labelY: 48, side: 'left', anchorX: 37, anchorY: 58 },
  { id: 'carottes', title: 'Carottes marinées', note: 'Croquantes', x: 54, y: 72, width: 29, angle: 8, labelX: 73, labelY: 65, side: 'right', anchorX: 60, anchorY: 73 },
  { id: 'sauce', title: 'Sauce laquée', note: 'Le secret du chef', x: 38, y: 85, width: 20, angle: -8, labelX: 0, labelY: 80, side: 'left', anchorX: 34, anchorY: 86 },
  { id: 'buns', title: 'Mini buns briochés', note: 'Dorés au four · à côté', x: 82, y: 80, width: 23, angle: 0, labelX: 68, labelY: 88, side: 'right', anchorX: 82, anchorY: 81 },
] as const;

export function ProductExploded({ name, imageRef }: {
  name: string;
  imageRef: React.RefObject<HTMLImageElement | null>;
}) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const detailsId = useId();
  const duration = reduceMotion ? 0 : 0.85;

  return <div className={`product-exploded ${expanded ? 'is-expanded' : ''}`}>
    <button type="button" className="product-exploded-surface"
      aria-label={expanded ? `Réassembler ${name}` : `Découvrir les ingrédients de ${name}`}
      aria-expanded={expanded} aria-controls={detailsId}
      onClick={() => setExpanded(value => !value)}>
      <motion.img ref={imageRef} src="/products/cutouts/bao-poulet-isolated.webp"
        alt={name} width="1200" height="1200" draggable={false}
        className="product-exploded-whole" initial={false}
        animate={{ scale: expanded ? 0.55 : 1, opacity: expanded ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1], delay: expanded ? 0 : 0.3 }} />
      <span id={detailsId} className="product-exploded-parts" aria-hidden={!expanded}>
        {PARTS.map((part, index) => <React.Fragment key={part.id}>
          <motion.span className="product-exploded-part" initial={false}
            style={{ width: `${part.width}%` }}
            animate={{ left: `${expanded ? part.x : 50}%`, top: `${expanded ? part.y : 50}%`, x: '-50%', y: '-50%', scale: expanded ? 1 : 0.65, rotate: expanded ? part.angle : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : expanded ? 0.15 + index * 0.065 : 0 }}>
            <img src={`/products/exploded/bao-poulet/${part.id}.webp`} alt="" draggable={false} />
          </motion.span>
          <motion.span className={`ingredient-label ingredient-label-${part.side}`}
            style={{ left: `${part.labelX}%`, top: `${part.labelY}%` }} initial={false}
            animate={{ opacity: expanded ? 1 : 0, y: expanded ? 0 : 6 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : expanded ? 0.65 + index * 0.065 : 0 }}>
            <strong>{part.title}</strong><span>{part.note}</span>
          </motion.span>
        </React.Fragment>)}
        <motion.span className="ingredient-connectors" initial={false}
          animate={{ opacity: expanded ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : expanded ? 0.6 : 0 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {PARTS.map(part => <g key={part.id}>
              <path d={part.id === 'buns' ? 'M 82 81 L 82 87' : `M ${part.side === 'left' ? 25 : 73} ${part.labelY + 5} L ${part.side === 'left' ? 29 : 69} ${part.labelY + 5} L ${part.anchorX} ${part.anchorY}`} />
              <circle cx={part.anchorX} cy={part.anchorY} r="0.55" />
            </g>)}
          </svg>
        </motion.span>
      </span>
    </button>
    <button type="button" className="product-exploded-toggle" aria-expanded={expanded}
      aria-controls={detailsId} onClick={() => setExpanded(value => !value)}>
      {expanded ? <RotateCcw size={14} /> : <Expand size={14} />}
      {expanded ? 'Réassembler le bao' : 'Découvrir les ingrédients'}
    </button>
  </div>;
}
