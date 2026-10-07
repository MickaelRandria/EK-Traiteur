import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, CategoryType } from '../types';
import { Heart, ShoppingBag, Plus, Sparkles, Check } from 'lucide-react';

interface ProductCarouselPickerProps {
  items: MenuItem[];
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  favorites: MenuItem[];
  onToggleFavorite: (item: MenuItem) => void;
  onSelectItem: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

const CATEGORY_TABS: { id: CategoryType; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'gourmet', label: 'Gourmet & Créations' },
  { id: 'classique', label: 'Plateaux Salés' },
  { id: 'verrines', label: 'Verrines Traiteur' },
];

const VOLUME_OPTIONS = [20, 40, 60];

export const ProductCarouselPicker: React.FC<ProductCarouselPickerProps> = ({
  items,
  selectedCategory,
  onSelectCategory,
  favorites,
  onToggleFavorite,
  onSelectItem,
  onAddToCart,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter((item) => item.category === selectedCategory);

  // Reset scroll and index when category changes
  useEffect(() => {
    setActiveIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedCategory]);

  // Handle scroll events to detect active card for pagination dots
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const cardWidth = carouselRef.current.offsetWidth * 0.82;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < filteredItems.length && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  // Scroll to a specific card when dot clicked
  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.offsetWidth * 0.82;
    carouselRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  // Get active item
  const activeItem = filteredItems[activeIndex] || filteredItems[0];
  const activeItemQuantity = activeItem ? (selectedQuantities[activeItem.id] || 20) : 20;

  const handleSetQuantity = (itemId: string, qty: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedQuantities((prev) => ({
      ...prev,
      [itemId]: qty,
    }));
  };

  const handleAddActiveToPlateau = () => {
    if (!activeItem) return;
    onAddToCart(activeItem, activeItemQuantity);
    setJustAddedId(activeItem.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1200);
  };

  return (
    <section id="product-carousel-picker" className="pt-2 pb-4 flex flex-col">
      {/* 1. Category Filter Tabs above header */}
      <div 
        id="carousel-category-tabs" 
        className="px-5 pt-1 pb-2 overflow-x-auto no-scrollbar flex items-center gap-2"
      >
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 border ${
                isActive
                  ? 'bg-[#141613] text-white border-[#141613] shadow-xs'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-[#141613]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2. En-tête minimaliste : COLLECTIONS 2026 / SÉLECTION COCKTAIL */}
      <div className="px-5 mb-2 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#5B6B54] uppercase">
            Collections 2026
          </span>
          <h1 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#141613] leading-none mt-0.5">
            Sélection Cocktail
          </h1>
        </div>
        <span className="text-[11px] font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-200/80 shadow-2xs">
          Min. 20 pcs
        </span>
      </div>

      {/* 3. Full-Width Horizontal Snap Carousel */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="mt-1 flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-5 pb-2 pt-1 gap-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {filteredItems.map((item, idx) => {
          const isFav = favorites.some((f) => f.id === item.id);
          const currentQty = selectedQuantities[item.id] || 20;
          const isQuote = item.price === 0 || !!item.priceDisplay;
          const totalForQty = isQuote ? 'Sur devis' : `${(item.price * currentQty).toFixed(2)} €`;

          return (
            <div
              key={item.id}
              id={`carousel-card-${item.id}`}
              className="w-[82vw] sm:w-[320px] md:w-[340px] shrink-0 snap-center mx-2 rounded-3xl bg-white border border-gray-150/90 shadow-sm p-3 flex flex-col transition-all duration-300 hover:shadow-md"
            >
              {/* Grande image verticale propre du produit (hauteur ~320px, coins arrondis rounded-3xl) */}
              <div 
                className="relative h-[320px] w-full rounded-3xl overflow-hidden bg-[#F6F4EB]/60 cursor-pointer group"
                onClick={() => onSelectItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105"
                />

                {/* Heart / Favorite Button in Top-Left */}
                <button
                  type="button"
                  aria-label="Ajouter aux favoris"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item);
                  }}
                  className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md transition-all active:scale-90 hover:bg-white z-10"
                >
                  <Heart
                    className={`w-4.5 h-4.5 transition-colors ${
                      isFav ? 'fill-[#E05353] text-[#E05353]' : 'text-[#141613]'
                    }`}
                  />
                </button>

                {/* Badges in Top-Right */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
                  {item.badges?.[0] && (
                    <span className="bg-[#141613]/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      {item.badges[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Détails sous l'image (Reproduction de l'écran de gauche) */}
              <div className="pt-3 flex flex-col gap-2.5">
                {/* Sélecteur de volume par boutons radio/pills : [ 20 pcs ] [ 40 pcs ] [ 60 pcs ] ou devis */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1">
                    {isQuote ? (
                      <div className="w-full py-1.5 px-3 text-xs font-bold rounded-lg bg-gray-100 text-[#5B6B54] text-center border border-gray-200">
                        Pièce personnalisée sur mesure
                      </div>
                    ) : (
                      VOLUME_OPTIONS.map((vol) => {
                        const isSelected = currentQty === vol;
                        return (
                          <button
                            key={vol}
                            type="button"
                            onClick={(e) => handleSetQuantity(item.id, vol, e)}
                            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all border ${
                              isSelected
                                ? 'bg-[#141613] text-white border-[#141613] shadow-xs scale-102'
                                : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 hover:text-black'
                            }`}
                          >
                            {vol} pcs
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Ligne inférieure : À gauche nom en capitales bold, à droite prix unitaire / total */}
                <div className="flex items-end justify-between gap-2 pt-1 border-t border-gray-100">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-anton uppercase text-[#141613] text-lg sm:text-xl leading-none truncate">
                      {item.name}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                      {item.priceDisplay || `${item.price.toFixed(2)} € / pièce`}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-[#5B6B54] leading-none">
                      {totalForQty}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400">
                      {isQuote ? 'Devis immédiat' : `pour ${currentQty} pcs`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Pagination par points en bas */}
      <div className="flex items-center justify-center gap-1.5 py-3">
        {filteredItems.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={item.id}
              onClick={() => scrollToCard(index)}
              aria-label={`Aller au produit ${index + 1}`}
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? 'w-6 h-2 bg-[#141613]'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          );
        })}
      </div>

      {/* 5. Bouton pill blanc/noir "AJOUTER AU PLATEAU" au centre en bas */}
      {activeItem && (
        <div className="px-5 pt-1">
          <button
            type="button"
            id="btn-carousel-add-to-cart"
            onClick={handleAddActiveToPlateau}
            className={`w-full max-w-[280px] mx-auto py-3.5 px-6 rounded-full font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl transition-all duration-200 active:scale-95 ${
              justAddedId === activeItem.id
                ? 'bg-[#5B6B54] text-white shadow-[#5B6B54]/30'
                : 'bg-[#141613] text-white hover:bg-black'
            }`}
          >
            {justAddedId === activeItem.id ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>{activeItem.priceDisplay ? 'Demande ajoutée !' : 'Ajouté au plateau !'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>
                  {activeItem.priceDisplay 
                    ? 'Demander un devis • Sur devis'
                    : `Ajouter au plateau • ${(activeItem.price * activeItemQuantity).toFixed(2)} €`}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
