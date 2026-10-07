import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/** A photographic turntable: no sensor permission, horizontal drag only. */
export function ProductSpin({ name, imageRef }: {
  name: string;
  imageRef: React.RefObject<HTMLImageElement | null>;
}) {
  const [frame, setFrame] = useState(0);
  const drag = useRef<{ x: number; y: number; frame: number; horizontal: boolean } | null>(null);
  const wrap = (index: number) => (index % ANGLES.length + ANGLES.length) % ANGLES.length;
  const step = (direction: number) => setFrame(current => wrap(current + direction));

  return <div className="product-spin">
    <div className="product-spin-surface" role="group" aria-label={`Vues à 360° : ${name}`} tabIndex={0}
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          step(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
      onPointerDown={event => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        drag.current = { x: event.clientX, y: event.clientY, frame, horizontal: false };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        const start = drag.current;
        if (!start) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (!start.horizontal) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
          if (Math.abs(dy) > Math.abs(dx)) { drag.current = null; return; }
          start.horizontal = true;
        }
        setFrame(wrap(start.frame - Math.round(dx / 34)));
      }}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}
      onLostPointerCapture={() => { drag.current = null; }}>
      {ANGLES.map((angle, index) => <img key={angle}
        ref={index === frame ? imageRef : undefined}
        src={`/products/spins/bao-poulet/angle-${String(angle).padStart(3, '0')}.webp`}
        alt={index === frame ? `${name}, vue ${angle}°` : ''}
        aria-hidden={index !== frame} draggable={false} width="960" height="960"
        className={`product-spin-frame ${index === frame ? 'is-active' : ''}`} />)}
    </div>
    <div className="product-spin-controls">
      <button type="button" className="icon-btn" aria-label="Angle précédent" onClick={() => step(-1)}><ChevronLeft size={16} /></button>
      <span>Glissez pour tourner · {ANGLES[frame]}°</span>
      <button type="button" className="icon-btn" aria-label="Angle suivant" onClick={() => step(1)}><ChevronRight size={16} /></button>
    </div>
  </div>;
}
