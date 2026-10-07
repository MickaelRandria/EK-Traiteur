import React from 'react';
import { motion } from 'motion/react';
import { CategoryType, MenuItem } from '../types';
import { DietFilter, getAvailableCategories, getAvailableDietFilters } from '../data/menuData';
import { Sheet } from './ui/Sheet';

type SortBy = 'featured' | 'price-asc' | 'price-desc';

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  /** Catalogue complet : seules les options ayant au moins une création sont proposées */
  items: MenuItem[];
  resultsCount: number;
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  dietFilter: DietFilter;
  setDietFilter: (diet: DietFilter) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  onReset: () => void;
}

const SORTS: { id: SortBy; label: string }[] = [
  { id: 'featured', label: 'Sélection du chef' },
  { id: 'price-asc', label: 'Prix croissant' },
  { id: 'price-desc', label: 'Prix décroissant' },
];

interface ChoiceGroupProps<T extends string> {
  name: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function ChoiceGroup<T extends string>({ name, options, value, onChange }: ChoiceGroupProps<T>) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="eyebrow mb-3">{name}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.id)}
              className={`relative h-11 px-4 rounded-full border text-[13px] transition-colors duration-300 ${
                active ? 'border-sage text-ivory' : 'border-line-strong hover:border-sage'
              }`}
            >
              {active && (
                <motion.span
                  layoutId={`filter-${name}`}
                  className="absolute inset-0 rounded-full bg-sage"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">{o.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  open,
  onClose,
  items,
  resultsCount,
  selectedCategory,
  onSelectCategory,
  dietFilter,
  setDietFilter,
  sortBy,
  setSortBy,
  onReset,
}) => (
  <Sheet
    open={open}
    onClose={onClose}
    title="Vos envies, en détail"
    eyebrow="Filtres"
    footer={
      <div className="flex gap-2">
        <button type="button" onClick={onReset} className="btn-outline h-[54px] px-5">
          Réinitialiser
        </button>
        <button type="button" onClick={onClose} className="btn-primary flex-1">
          {resultsCount === 0 ? 'Aucun résultat' : `Voir ${resultsCount} création${resultsCount > 1 ? 's' : ''}`}
        </button>
      </div>
    }
  >
    <div className="flex flex-col gap-7 pt-1">
      <ChoiceGroup
        name="Catégorie"
        options={getAvailableCategories(items).map((c) => (c.id === 'all' ? { ...c, label: 'Toutes' } : c))}
        value={selectedCategory}
        onChange={onSelectCategory}
      />
      <ChoiceGroup name="Régime" options={getAvailableDietFilters(items)} value={dietFilter} onChange={setDietFilter} />
      <ChoiceGroup name="Trier par" options={SORTS} value={sortBy} onChange={setSortBy} />
    </div>
  </Sheet>
);
