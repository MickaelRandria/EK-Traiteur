import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, Heart, Minus, Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_DATA } from '../data/menuData';
import { presentationFor } from '../data/productPresentation';
import { formatPrice, isQuoteItem, MIN_PIECES_PER_VARIETY } from '../utils/order';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { EASE_OUT, fadeTransition } from './ui/motion';
import { TiltCard } from './ui/TiltCard';
import { ProductExploded } from './ui/ProductExploded';
import { EXPLODED_RECIPES } from '../data/productIngredients';

interface ProductDetailProps {
  item: MenuItem | null;
  open: boolean;
  sharedImage: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (item: MenuItem) => void;
  onAdd: (item: MenuItem, quantity: number, origin?: HTMLElement | null) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ item, open, sharedImage, onClose, isFavorite, onToggleFavorite, onAdd }) => {
  const [quantity, setQuantity] = useState(MIN_PIECES_PER_VARIETY);
  const imageRef = useRef<HTMLImageElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);
  useDialogFocus(open, dialogRef);
  const presentation = item ? presentationFor(item) : null;
  const handleAdd = () => {
    if (!item) return;
    onAdd(item, quantity, imageRef.current);
    onClose();
  };

  return <AnimatePresence>{open && item && presentation && (
    <div className="fixed inset-0 z-[55] flex justify-center md:items-center md:p-6">
      <motion.div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fadeTransition} onClick={onClose} />
      <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-label={item.name} className="atelier-panel product-dialog relative w-full h-[100dvh] md:h-auto md:max-h-[calc(100dvh-48px)] md:max-w-[1040px] bg-ivory flex flex-col md:rounded-[6px] overflow-hidden" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="detail-layout">
            <div className={`detail-stage tone-${presentation.tone} relative flex items-center justify-center overflow-hidden`}>
              <span className="detail-collection-label">La collection Ena’s Kitchen</span>
              <span className="detail-number" aria-hidden="true">{String(MENU_DATA.findIndex(p => p.id === item.id) + 1).padStart(2, '0')}</span>
              <button type="button" onClick={onClose} aria-label="Retour aux créations" className="absolute z-10 top-4 left-4 icon-btn bg-ivory/80"><ChevronLeft className="w-5 h-5" strokeWidth={1.3} /></button>
              <button type="button" onClick={() => onToggleFavorite(item)} aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} aria-pressed={isFavorite} className="absolute z-10 top-4 right-4 icon-btn bg-ivory/80"><Heart className={`w-[18px] h-[18px] ${isFavorite ? 'fill-sage text-sage' : ''}`} strokeWidth={1.3} /></button>
              <div className="detail-product-wrap">
                {EXPLODED_RECIPES[item.id] && item.cutout ? <ProductExploded name={item.name} imageRef={imageRef} productId={item.id} imageSrc={item.cutout} /> : item.cutout ? <TiltCard variant="object" maskSrc={item.cutout} className="w-full h-full"><img ref={imageRef} src={item.cutout} alt={item.name} width="1200" height="1200" className="w-full h-full object-contain drop-shadow-[0_20px_22px_rgba(35,38,31,0.16)]" /></TiltCard> :
                <motion.img ref={imageRef} layoutId={sharedImage ? `product-image-${item.id}` : undefined} src={item.image} alt={item.name} className="w-full h-full object-contain" />}
              </div>
              <span className="detail-stage-price">{isQuoteItem(item) ? 'Création sur mesure' : `${formatPrice(item.price)} / pièce`}</span>
            </div>
            <div className="detail-content flex flex-col gap-4">
              <span className="eyebrow">{item.categoryLabel}</span>
              <h1 className="font-serif font-medium text-[42px] md:text-[48px] leading-[1.02] tracking-[-0.035em]">{presentation.title}</h1>
              <p className="detail-note">{presentation.note}</p>
              <p className="text-sm leading-[1.85] text-ink-soft">{item.description}</p>
              {item.ingredients && item.ingredients.length > 0 && <div className="pt-2"><h2 className="eyebrow mb-3">Dans cette création</h2><ul className="border-t border-line">{item.ingredients.map(ingredient => <li key={ingredient} className="py-2.5 text-[13px] text-ink-soft border-b border-line">{ingredient}</li>)}</ul></div>}
              {item.allergens && item.allergens.length > 0 && <p className="text-xs leading-relaxed text-muted">Allergènes : {item.allergens.join(', ').toLowerCase()}.</p>}
              <div className="detail-gallery"><span className="eyebrow">À votre table</span><img src={item.image} alt={`Présentation originale : ${item.name}`} loading="lazy" /><p className="text-[11px] text-muted leading-relaxed mt-2">Le plaisir d’une collection à partager.</p></div>
            </div>
          </div>
        </div>
        <div className="panel-footer detail-footer px-6 pt-4 border-t border-line bg-ivory flex flex-col gap-4">
          {isQuoteItem(item) ? <p className="text-sm text-muted leading-relaxed">Imaginons votre gâteau : chiffre, parfums et décor selon vos envies.</p> : (
            <div className="flex items-center justify-between gap-4">
              <div><span className="text-[11px] text-muted block mb-1">Dès 20 pièces · {formatPrice(item.price)} / pièce</span><AnimatedNumber value={item.price * quantity} format={formatPrice} className="font-serif text-[30px] leading-none" /></div>
              <div className="flex items-center gap-1" role="group" aria-label="Quantité de pièces">
                <button type="button" onClick={() => setQuantity(q => Math.max(MIN_PIECES_PER_VARIETY, q - 10))} disabled={quantity <= MIN_PIECES_PER_VARIETY} aria-label="Retirer 10 pièces" className="round-btn"><Minus className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                <span className="w-12 text-center text-xl font-serif" aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity(q => q + 10)} aria-label="Ajouter 10 pièces" className="round-btn"><Plus className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
              </div>
            </div>
          )}
          <button type="button" onClick={handleAdd} className="btn-primary w-full">{isQuoteItem(item) ? 'Ajouter une demande sur mesure' : 'Choisir pour ma réception'}</button>
        </div>
      </motion.div>
    </div>
  )}</AnimatePresence>;
};
