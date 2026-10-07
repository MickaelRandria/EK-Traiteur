import React, { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { MenuItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, quantity: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onQuickAdd,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
    item.badges.some((b) => b.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-top duration-300 mt-8"
      >
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-[#F8F9FA]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher saumon, burger, chèvre, verrine..."
              className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-white rounded-full border border-gray-200 focus:outline-hidden focus:border-[#5B6B54]"
            />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-black flex items-center justify-center border border-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="text-xs font-semibold text-[#141613]">Aucune pièce cocktail trouvée</p>
              <p className="text-[11px] text-gray-400 mt-1">Essayez un autre mot clé comme "saumon", "foie gras" ou "verrine".</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="pt-3 first:pt-0 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/80 p-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#141613] truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {item.categoryLabel} • {item.priceDisplay || `${item.price.toFixed(2)} € / pc`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(item, item.priceDisplay ? 1 : 20);
                  }}
                  className="shrink-0 bg-[#141613] hover:bg-[#5B6B54] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>{item.priceDisplay ? 'Devis' : '+20 pcs'}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
