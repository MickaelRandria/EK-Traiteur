import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Expand, RotateCcw } from 'lucide-react';
import { EXPLODED_RECIPES } from '../../data/productIngredients';

export function ProductExploded({ name, imageRef, productId = 'bao-poulet', imageSrc = '/products/cutouts/bao-poulet-isolated.webp' }: {
  name: string;
  imageRef: React.RefObject<HTMLImageElement | null>;
  productId?: string;
  imageSrc?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const detailsId = useId();
  const duration = reduceMotion ? 0 : 0.85;
  const recipe = EXPLODED_RECIPES[productId];
  const parts = recipe.parts;

  return <div data-product-id={productId} className={`product-exploded ${expanded ? 'is-expanded' : ''}`}>
    <button type="button" className="product-exploded-surface"
      aria-label={expanded ? `Réassembler ${name}` : `Découvrir les ingrédients de ${name}`}
      aria-expanded={expanded} aria-controls={detailsId}
      onClick={() => setExpanded(value => !value)}>
      <motion.img ref={imageRef} src={imageSrc}
        alt={name} width="1200" height="1200" draggable={false}
        className="product-exploded-whole" initial={false}
        animate={{ scale: expanded ? 0.55 : 1, opacity: expanded ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1], delay: expanded ? 0 : 0.3 }} />
      <span id={detailsId} className="product-exploded-parts" aria-hidden={!expanded}>
        {parts.map((part, index) => <React.Fragment key={part.id}>
          <motion.span className="product-exploded-part" initial={false}
            style={{ width: `${part.width}%` }}
            animate={{ left: `${expanded ? part.x : 50}%`, top: `${expanded ? part.y : 50}%`, x: '-50%', y: '-50%', scale: expanded ? 1 : 0.65, rotate: expanded ? part.angle : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : expanded ? 0.15 + index * 0.065 : 0 }}>
            <img src={`/products/exploded/${productId}/${part.id}.webp`} alt="" draggable={false} />
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
            {parts.map(part => <g key={part.id}>
              <path d={productId === 'bao-poulet' && part.id === 'buns' ? 'M 82 81 L 82 87' : `M ${part.side === 'left' ? 25 : 73} ${part.labelY + 5} L ${part.side === 'left' ? 29 : 69} ${part.labelY + 5} L ${part.anchorX} ${part.anchorY}`} />
              <circle cx={part.anchorX} cy={part.anchorY} r="0.55" />
            </g>)}
          </svg>
        </motion.span>
      </span>
    </button>
    <button type="button" className="product-exploded-toggle" aria-expanded={expanded}
      aria-controls={detailsId} onClick={() => setExpanded(value => !value)}>
      {expanded ? <RotateCcw size={14} /> : <Expand size={14} />}
      {expanded ? recipe.resetLabel : 'Découvrir les ingrédients'}
    </button>
  </div>;
}
