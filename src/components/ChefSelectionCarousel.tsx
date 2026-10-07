import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types';

interface ChefSelectionCarouselProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, quantity: number) => void;
  onViewAll: () => void;
}

export const ChefSelectionCarousel: React.FC<ChefSelectionCarouselProps> = ({
  items,
  onSelectItem,
  onQuickAdd,
  onViewAll,
}) => {
  return (
    <section id="section-chef-selection" className="pt-3 pb-4">
      {/* Section Header with "Sélection du moment" and "Voir tout" */}
      <div className="flex items-center justify-between px-5 mb-2.5">
        <h2 className="text-base font-bold text-[#141613] tracking-tight">
          Sélection du moment
        </h2>
        <button
          id="btn-view-all-chef-selection"
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-[#5B6B54] hover:text-[#141613] transition-colors"
        >
          Voir tout
        </button>
      </div>

      {/* Horizontal Carousel (Compact white cards with subtle shadow) */}
      <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar px-5 py-1">
        {items.map((item, idx) => (
          <div
            key={item.id}
            id={`chef-card-${item.id}`}
            onClick={() => onSelectItem(item)}
            className="w-36 sm:w-40 shrink-0 bg-white rounded-2xl p-3 shadow-xs border border-gray-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-200 group"
          >
            {/* Top: Product Name and Category Badge */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-[#5B6B54] uppercase tracking-wider truncate max-w-[70px]">
                  {item.categoryLabel || item.category}
                </span>
                <span className="text-[10px] font-extrabold text-[#141613] bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                  {item.priceDisplay || `${item.price.toFixed(2)} €`}
                </span>
              </div>
              <h3 className="text-xs font-bold text-[#141613] leading-tight line-clamp-2 min-h-[32px] group-hover:text-[#5B6B54] transition-colors">
                {item.name}
              </h3>
            </div>

            {/* Middle: Food Photograph */}
            <div className="my-2 h-24 w-full flex items-center justify-center relative overflow-hidden rounded-xl bg-[#F6F4EB]/50">
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Bottom: Quick Add Button (+20 pcs) */}
            <button
              type="button"
              id={`quick-add-${item.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(item, item.priceDisplay ? 1 : 20);
              }}
              className="w-full flex items-center justify-center gap-1 py-1.5 px-2 bg-[#F8F9FA] hover:bg-[#141613] text-[#141613] hover:text-white rounded-lg text-[11px] font-bold transition-all border border-gray-200/80 active:scale-95"
            >
              <Plus className="w-3 h-3" />
              <span>{item.priceDisplay ? 'Devis' : '+20 pcs'}</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
