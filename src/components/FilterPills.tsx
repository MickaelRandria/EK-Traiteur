import React from 'react';
import { CategoryType } from '../types';

interface FilterPillsProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

const FILTER_ITEMS: { id: CategoryType; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'gourmet', label: 'Gourmet (1,60 €)' },
  { id: 'classique', label: 'Classique (1,50 €)' },
  { id: 'verrines', label: 'Verrines (1,60 €)' },
  { id: 'vegetarien', label: 'Végétarien (1,50 €)' },
];

export const FilterPills: React.FC<FilterPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section 
      id="category-filters-container"
      className="px-5 py-2"
      aria-label="Filtres des pièces cocktails"
    >
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {FILTER_ITEMS.map((filter) => {
          const isActive = selectedCategory === filter.id;
          return (
            <button
              key={filter.id}
              id={`filter-pill-${filter.id}`}
              onClick={() => onSelectCategory(filter.id)}
              className={`shrink-0 px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 border ${
                isActive
                  ? 'bg-[#141613] text-white border-[#141613] shadow-sm'
                  : 'bg-white/80 text-[#141613]/70 border-gray-200/80 hover:bg-white hover:text-[#141613] hover:border-gray-300'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
