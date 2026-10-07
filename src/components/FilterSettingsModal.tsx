import React from 'react';
import { X, SlidersHorizontal, Check, Smartphone } from 'lucide-react';
import { CategoryType } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface FilterSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  dietFilter: string;
  setDietFilter: (diet: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc') => void;
}

export const FilterSettingsModal: React.FC<FilterSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  dietFilter,
  setDietFilter,
  sortBy,
  setSortBy,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom duration-300"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#5B6B54]" />
            <h2 className="text-base font-bold text-[#141613]">
              Préférences Traiteur
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center border border-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Categories */}
          <div>
            <h3 className="font-bold text-[#141613] uppercase tracking-wider mb-2">
              Catégorie de Bouchées
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all' as CategoryType, label: 'Toutes les créations' },
                { id: 'gourmet' as CategoryType, label: 'Salé Gourmet (1,60 €)' },
                { id: 'classique' as CategoryType, label: 'Salé Classique (1,50 €)' },
                { id: 'verrines' as CategoryType, label: 'Verrines Traiteur (1,60 €)' },
                { id: 'vegetarien' as CategoryType, label: 'Options Végétariennes (1,50 €)' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.id)}
                  className={`p-2.5 rounded-xl border text-left font-semibold flex items-center justify-between transition-all ${
                    selectedCategory === c.id
                      ? 'bg-[#141613] text-white border-[#141613]'
                      : 'bg-[#F8F9FA] text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">{c.label}</span>
                  {selectedCategory === c.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Preferences */}
          <div>
            <h3 className="font-bold text-[#141613] uppercase tracking-wider mb-2">
              Régimes & Préférences
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'veggie', label: '100% Végétarien' },
                { id: 'fish', label: 'Poissons & Saumon' },
                { id: 'meat', label: 'Volaille & Terroir' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDietFilter(d.id)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                    dietFilter === d.id
                      ? 'bg-[#5B6B54] text-white border-[#5B6B54]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div>
            <h3 className="font-bold text-[#141613] uppercase tracking-wider mb-2">
              Trier Par
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'featured' as const, label: 'Coup de cœur' },
                { id: 'price-asc' as const, label: 'Prix croissant' },
                { id: 'price-desc' as const, label: 'Prix décroissant' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id)}
                  className={`py-2 px-2 rounded-xl border text-center font-semibold text-[11px] transition-all ${
                    sortBy === s.id
                      ? 'bg-[#141613] text-white border-[#141613]'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* PWA App Install Section */}
          <div className="bg-[#181b15] text-white p-3.5 rounded-2xl border border-[#d4af37]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#0f120e] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white text-[11px] truncate">Installer EK Traiteur</p>
                <p className="text-gray-300 text-[10px] truncate">Accès direct hors-ligne (PWA)</p>
              </div>
            </div>
            <PWAInstallButton variant="badge" />
          </div>

          {/* Traiteur Note */}
          <div className="bg-[#F6F4EB] p-3 rounded-xl text-gray-600 text-[11px] leading-relaxed border border-amber-950/5">
            <span className="font-bold text-[#5B6B54]">Note EK Traiteur :</span> Toutes nos pièces sont élaborées avec des matières premières locales et de saison à Bordeaux. Règle minimale de 20 pièces par variété.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-[#F8F9FA] flex gap-2">
          <button
            onClick={() => {
              onSelectCategory('all');
              setDietFilter('all');
              setSortBy('featured');
            }}
            className="w-1/3 py-2.5 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100"
          >
            Réinitialiser
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full bg-[#141613] text-white font-bold hover:bg-[#5B6B54] transition-colors"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>
  );
};
