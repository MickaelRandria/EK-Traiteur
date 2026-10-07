import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Heart, Plus, SlidersHorizontal } from 'lucide-react';
import { CategoryType, MenuItem } from '../types';
import { MENU_DATA, getAvailableCategories } from '../data/menuData';
import { presentationFor } from '../data/productPresentation';
import { formatPrice, isQuoteItem, MIN_PIECES_PER_VARIETY } from '../utils/order';
import { EASE_OUT } from './ui/motion';

const CATEGORY_TABS = getAvailableCategories(MENU_DATA).map(c => c.id === 'all' ? { ...c, label: 'Toutes les créations' } : c);

interface MenuGridProps {
  items: MenuItem[];
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  filtersActive: boolean;
  onOpenFilters: () => void;
  onResetFilters: () => void;
  favorites: MenuItem[];
  onToggleFavorite: (item: MenuItem) => void;
  onOpenItem: (item: MenuItem) => void;
  onAdd: (item: MenuItem, quantity: number, origin?: HTMLElement | null) => void;
  openItemId: string | null;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items, selectedCategory, onSelectCategory, filtersActive, onOpenFilters, onResetFilters, favorites, onToggleFavorite, onOpenItem, onAdd, openItemId }) => (
  <section id="carte" className="atelier-collection scroll-mt-24">
    <div className="collection-heading">
      <div><span className="eyebrow">01 — Les créations</span><h2 className="section-title">Petites pièces,<br /><em>grandes envies.</em></h2></div>
      <p>Du premier toast à la dernière douceur,<br className="hidden md:block" /> une collection à composer à votre image.<span className="block mt-3 text-xs">À partir de 20 pièces par création.</span></p>
    </div>
    <div className="collection-navigation">
      <nav aria-label="Catégories de créations" className="flex gap-6 overflow-x-auto no-scrollbar">
        {CATEGORY_TABS.map(tab => <button key={tab.id} type="button" aria-pressed={selectedCategory === tab.id} onClick={() => onSelectCategory(tab.id)} className={`collection-tab ${selectedCategory === tab.id ? 'is-active' : ''}`}>{tab.label}</button>)}
      </nav>
      <button type="button" onClick={onOpenFilters} className="collection-filter" aria-label={filtersActive ? 'Filtrer (filtres actifs)' : 'Filtrer'}><SlidersHorizontal className="w-4 h-4" strokeWidth={1.4} /><span className="hidden sm:inline">Affiner</span>{filtersActive && <span className="atelier-dot" />}</button>
    </div>
    {items.length === 0 ? (
      <div className="py-20 text-center"><p className="font-serif text-3xl">Aucune création ne correspond</p><p className="text-sm text-muted mt-3">Essayez une autre catégorie ou retirez les filtres.</p><button type="button" onClick={onResetFilters} className="btn-outline mx-auto mt-6">Réinitialiser les filtres</button></div>
    ) : (
      <div className={`collection-grid ${filtersActive ? 'is-filtered' : ''}`}>
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => <ProductCard key={item.id} item={item} index={index} isFavorite={favorites.some(f => f.id === item.id)} onToggleFavorite={onToggleFavorite} onOpen={onOpenItem} onAdd={onAdd} hideImage={openItemId === item.id} />)}
        </AnimatePresence>
      </div>
    )}
    {!filtersActive && <div className="collection-story">
      <div className="story-photo"><img src="/products/plateau-signature.jpg" alt="Assortiment de navettes et bouchées préparées pour une réception" loading="lazy" width="1170" height="1344" /><span className="story-photo-caption">À partager, tout simplement.</span></div>
      <div className="story-copy"><span className="eyebrow">02 — Vos moments</span><h2 className="section-title">Une belle table.<br /><em>Et vous autour.</em></h2><p>Un anniversaire, un apéritif entre amis, une grande occasion. Choisissez les créations qui vous ressemblent, nous préparons la suite.</p><button type="button" onClick={() => document.getElementById('maison')?.scrollIntoView({ behavior: 'smooth' })} className="text-link">Rencontrer la maison <ArrowRight className="w-4 h-4" strokeWidth={1.4} /></button></div>
    </div>}
  </section>
);

interface ProductCardProps {
  item: MenuItem;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (item: MenuItem) => void;
  onOpen: (item: MenuItem) => void;
  onAdd: (item: MenuItem, quantity: number, origin?: HTMLElement | null) => void;
  hideImage: boolean;
}

const ProductCard = React.forwardRef<HTMLElement, ProductCardProps>(({ item, index, isFavorite, onToggleFavorite, onOpen, onAdd, hideImage }, ref) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const quote = isQuoteItem(item);
  const presentation = presentationFor(item);
  return (
    <motion.article ref={ref} layout initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.5, ease: EASE_OUT }} className={`collection-product collection-product-${index + 1} tone-${presentation.tone}`}>
      <button type="button" onClick={() => onOpen(item)} className="product-stage group" aria-label={`Découvrir ${item.name}`}>
        <span className="product-edition" aria-hidden="true">{String(MENU_DATA.findIndex(p => p.id === item.id) + 1).padStart(2, '0')}</span>
        <span className="product-stage-caption">{item.isSweet ? 'Les douceurs' : 'Les pièces salées'}</span>
        {!hideImage && <motion.img ref={imageRef} layoutId={!item.cutout ? `product-image-${item.id}` : undefined} src={item.cutout ?? item.image} alt="" loading="lazy" width="1200" height="1200" className={`collection-product-image ${item.cutout ? 'is-cutout' : ''}`} />}
        <span className="product-discover"><ArrowRight className="w-5 h-5" strokeWidth={1.3} /></span>
      </button>
      <div className="product-description">
        <div className="flex items-start justify-between gap-3"><button type="button" onClick={() => onOpen(item)} className="text-left"><span className="product-category">{item.categoryLabel}</span><h3>{presentation.title}</h3></button><button type="button" onClick={() => onToggleFavorite(item)} className="icon-btn shrink-0" aria-label={isFavorite ? `Retirer ${item.name} des favoris` : `Enregistrer ${item.name}`} aria-pressed={isFavorite}><Heart className={`w-[18px] h-[18px] ${isFavorite ? 'fill-sage text-sage' : ''}`} strokeWidth={1.3} /></button></div>
        <p>{presentation.note}</p>
        <div className="product-purchase"><span>{quote ? 'Création sur devis' : <><strong>{formatPrice(item.price)}</strong> <span className="text-muted">/ pièce</span></>}</span><button type="button" onClick={() => onAdd(item, MIN_PIECES_PER_VARIETY, imageRef.current)} className="product-add" aria-label={quote ? `Demander un devis : ${item.name}` : `Ajouter 20 pièces : ${item.name}`}>{quote ? 'Sur mesure' : 'Choisir 20 pièces'}<Plus className="w-4 h-4" strokeWidth={1.4} /></button></div>
      </div>
    </motion.article>
  );
});
ProductCard.displayName = 'ProductCard';
