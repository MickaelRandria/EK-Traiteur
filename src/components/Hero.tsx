import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { EASE_OUT } from './ui/motion';

interface HeroProps {
  delay: number;
  onCompose: () => void;
  onBrowse: () => void;
  eventSummary?: string | null;
}

export const Hero: React.FC<HeroProps> = ({ delay, onCompose, onBrowse, eventSummary }) => (
  <section className="atelier-hero">
    <motion.div className="hero-copy" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay, ease: EASE_OUT }}>
      <span className="eyebrow hero-eyebrow"><span className="atelier-dot" /> Atelier culinaire · Bordeaux</span>
      <h1 className="hero-title">L’art de<br /><em>recevoir.</em></h1>
      <p className="hero-introduction">De petites créations.<br />De grands moments à partager.</p>
      <div className="hero-actions">
        <button type="button" onClick={onCompose} className="btn-primary group">
          {eventSummary ? 'Modifier ma réception' : 'Composer ma réception'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
        </button>
        <button type="button" onClick={onBrowse} className="text-link">Explorer les créations <ArrowDown className="w-4 h-4" strokeWidth={1.4} /></button>
      </div>
      {eventSummary && <p className="mt-4 text-sm text-muted">{eventSummary}</p>}
    </motion.div>
    <motion.div className="hero-stage" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: delay + 0.15, ease: EASE_OUT }}>
      <div className="hero-orbit" aria-hidden="true" />
      <span className="hero-stage-label">La collection Ena’s Kitchen</span>
      <span className="hero-watermark" aria-hidden="true">ek.</span>
      <img src="/products/cutouts/bao-poulet-isolated.webp" alt="Bao vapeur au poulet laqué, concombre et carottes" className="hero-product" fetchPriority="high" width="1200" height="1200" />
      <div className="hero-caption"><span className="eyebrow">La pièce coup de cœur</span><span className="font-serif text-[30px]">Le bao laqué</span></div>
      <span className="hero-index" aria-hidden="true">01 / 06</span>
    </motion.div>
    <div className="hero-footnote"><span>Fait maison. Pensé pour vos moments.</span><span>Bordeaux & CUB <span aria-hidden="true">↗</span></span></div>
  </section>
);
