import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, CategoryType, OrderSubmission } from './types';
import { MENU_DATA } from './data/menuData';
export { MENU_DATA };
import { Header } from './components/Header';
import { ProductCarouselPicker } from './components/ProductCarouselPicker';
import { ChefSelectionCarousel } from './components/ChefSelectionCarousel';
import { BottomBar } from './components/BottomBar';
import { CartModal } from './components/CartModal';
import { OrderCheckoutModal } from './components/OrderCheckoutModal';
import { EmailConfirmationModal } from './components/EmailConfirmationModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FavoritesModal } from './components/FavoritesModal';
import { ContactModal } from './components/ContactModal';
import { SearchModal } from './components/SearchModal';
import { FilterSettingsModal } from './components/FilterSettingsModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Plus, Check, Sparkles, ChefHat } from 'lucide-react';

export default function App() {
  // Navigation & Category States
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'favorites' | 'contact'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [dietFilter, setDietFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Interactive Cart & Orders State (Initial state with 20 pieces default to showcase tray)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      item: MENU_DATA[0], // Mini burger top pick
      quantity: 20
    }
  ]);
  const [favorites, setFavorites] = useState<MenuItem[]>([
    MENU_DATA[0],
    MENU_DATA[1],
  ]);

  // Modal Dialogs
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isEmailConfirmationOpen, setIsEmailConfirmationOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderSubmission | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterSettingsOpen, setIsFilterSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered Items Logic
  const filteredItems = useMemo(() => {
    let list = MENU_DATA;

    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    if (dietFilter === 'veggie') {
      list = list.filter((item) => item.category === 'vegetarien' || item.badges.includes('Végétarien'));
    } else if (dietFilter === 'fish') {
      list = list.filter((item) => item.allergens?.includes('Poisson'));
    } else if (dietFilter === 'meat') {
      list = list.filter((item) => item.ingredients?.some(i => i.toLowerCase().includes('bœuf') || i.toLowerCase().includes('poulet') || i.toLowerCase().includes('canard')));
    }

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [selectedCategory, dietFilter, sortBy]);

  // Totals calculations
  const totalPieces = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  }, [cartItems]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart operations (respecting minimum 20 pieces)
  const handleQuickAdd = (item: MenuItem, quantity: number = 20) => {
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.item.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.item.id === item.id
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [...prev, { item, quantity }];
    });
    showToast(`+${quantity} ${item.name} ajoutés au plateau`);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((entry) =>
        entry.item.id === id ? { ...entry, quantity: newQty } : entry
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((entry) => entry.item.id !== id));
  };

  // Favorites toggle
  const handleToggleFavorite = (item: MenuItem) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === item.id);
      if (exists) {
        showToast(`Retiré des favoris`);
        return prev.filter((fav) => fav.id !== item.id);
      }
      showToast(`Ajouté aux favoris ❤️`);
      return [...prev, item];
    });
  };

  // Open item details
  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  // Order confirmation flow
  const handleOrderConfirmed = (order: OrderSubmission) => {
    setLastOrder(order);
    setIsCheckoutOpen(false);
    setIsEmailConfirmationOpen(true);
    // Clear or reset cart after validated order
    setCartItems([]);
  };

  // Chef Selection items
  const chefSelectionItems = useMemo(() => {
    return MENU_DATA.filter((i) => i.isChefCollection);
  }, []);

  const topPickItem = MENU_DATA[0]; // Mini burger

  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto min-h-screen bg-[#F8F9FA] relative flex flex-col transition-all duration-300">
      {/* Offline Status */}
      <OfflineIndicator />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-0 right-0 max-w-md md:max-w-xl mx-auto px-4 z-50 flex items-center justify-center pointer-events-none animate-in fade-in slide-in-from-top duration-300">
          <div className="bg-[#141613] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 pointer-events-auto">
            <Check className="w-3.5 h-3.5 text-[#5B6B54]" />
            <span className="truncate">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header
        onOpenSettings={() => setIsFilterSettingsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* PWA Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* Main Scrollable App Content */}
      <main className="flex-1 pb-28 select-none">
        {/* Immersive Product Carousel Picker (Inspiré de l'écran de référence) */}
        <ProductCarouselPicker
          items={MENU_DATA}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onSelectItem={handleSelectItem}
          onAddToCart={handleQuickAdd}
        />

        {/* Chef Selection Carousel (Sélection du moment) */}
        <ChefSelectionCarousel
          items={chefSelectionItems}
          onSelectItem={handleSelectItem}
          onQuickAdd={handleQuickAdd}
          onViewAll={() => setSelectedCategory('all')}
        />

        {/* Filtered / Full Menu Section if a specific filter is clicked */}
        {selectedCategory !== 'all' && (
          <section className="px-5 pt-2 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#141613] tracking-tight">
                Créations {selectedCategory.toUpperCase()} ({filteredItems.length})
              </h2>
              <span className="text-[10px] text-gray-500">Min. 20 pcs / variété</span>
            </div>

            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className="bg-white p-3.5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between gap-3 cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-[#141613] truncate">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-[#5B6B54]">
                          {item.priceDisplay || `${item.price.toFixed(2)} € / pc`}
                        </span>
                        <span className="text-[9px] font-semibold bg-[#F6F4EB] text-[#5B6B54] px-1.5 py-0.5 rounded">
                          {item.categoryLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAdd(item, item.priceDisplay ? 1 : 20);
                    }}
                    className="shrink-0 bg-[#141613] hover:bg-[#5B6B54] text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{item.priceDisplay ? 'Devis' : '+20 pcs'}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating Bottom Navigation Bar (Home, Cart, Favorites, Contact) */}
      <BottomBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        totalPieces={totalPieces}
        favoritesCount={favorites.length}
      />

      {/* Cart Modal / Drawer */}
      <CartModal
        isOpen={activeTab === 'cart'}
        onClose={() => setActiveTab('home')}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCheckoutOpen(true);
        }}
        totalPieces={totalPieces}
        totalPrice={totalPrice}
      />

      {/* Checkout Form Modal */}
      <OrderCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalPieces={totalPieces}
        totalPrice={totalPrice}
        onOrderConfirmed={handleOrderConfirmed}
      />

      {/* Email Confirmation Modal */}
      <EmailConfirmationModal
        isOpen={isEmailConfirmationOpen}
        order={lastOrder}
        onClose={() => {
          setIsEmailConfirmationOpen(false);
          setActiveTab('home');
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        item={selectedItem}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isFavorite={selectedItem ? favorites.some((f) => f.id === selectedItem.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleQuickAdd}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={activeTab === 'favorites'}
        onClose={() => setActiveTab('home')}
        favorites={favorites}
        onRemoveFavorite={handleToggleFavorite}
        onSelectItem={handleSelectItem}
        onQuickAdd={handleQuickAdd}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={activeTab === 'contact'}
        onClose={() => setActiveTab('home')}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={MENU_DATA}
        onSelectItem={handleSelectItem}
        onQuickAdd={handleQuickAdd}
      />

      {/* Filter Settings Modal */}
      <FilterSettingsModal
        isOpen={isFilterSettingsOpen}
        onClose={() => setIsFilterSettingsOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        dietFilter={dietFilter}
        setDietFilter={setDietFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </div>
  );
}
