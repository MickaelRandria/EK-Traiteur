import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { MenuItem, CartItem, CategoryType, EventPlan, OrderSubmission } from './types';
import { MENU_DATA, DIET_FILTERS, DietFilter } from './data/menuData';
export { MENU_DATA };
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuGrid } from './components/MenuGrid';
import { SelectionBar } from './components/SelectionBar';
import { SelectionPage } from './components/SelectionPage';
import { EventComposer } from './components/EventComposer';
import { OrderCheckoutModal } from './components/OrderCheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { ProductDetail } from './components/ProductDetail';
import { MenuSheet } from './components/MenuSheet';
import { FavoritesSheet } from './components/FavoritesSheet';
import { ContactSheet } from './components/ContactSheet';
import { FilterSheet } from './components/FilterSheet';
import { SearchOverlay } from './components/SearchOverlay';
import { SplashIntro, useSplash, SPLASH_DURATION } from './components/SplashIntro';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { usePersistentState } from './hooks/usePersistentState';
import { EASE_OUT } from './components/ui/motion';
import {
  describeEvent,
  getCartTotal,
  getPiecesCount,
  getRecommendedPieces,
  isQuoteItem,
  MIN_PIECES_PER_VARIETY,
} from './utils/order';

type StoredCartEntry = { id: string; quantity: number };
type SortBy = 'featured' | 'price-asc' | 'price-desc';

/** Vignette qui « vole » de la création jusqu'au sac lors d'un ajout */
interface Flyer {
  id: number;
  src: string;
  from: { x: number; y: number; w: number; h: number };
  to: { x: number; y: number };
}

const findMenuItem = (id: string) => MENU_DATA.find((item) => item.id === id);

const scrollToMenu = () => {
  document.getElementById('carte')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function App() {
  const showSplash = useSplash();
  const heroDelay = showSplash ? SPLASH_DURATION + 0.15 : 0.15;

  // Filtres de la carte
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('featured');

  // Sélection, favoris et réception sauvegardés sur l'appareil (identifiants réhydratés depuis le catalogue)
  const [cartItems, setCartItems] = usePersistentState<CartItem[], StoredCartEntry[]>(
    'ek_cart',
    [],
    (items) => items.map((entry) => ({ id: entry.item.id, quantity: entry.quantity })),
    (stored) =>
      stored.flatMap((entry) => {
        const item = findMenuItem(entry.id);
        return item ? [{ item, quantity: entry.quantity }] : [];
      })
  );
  const [favorites, setFavorites] = usePersistentState<MenuItem[], string[]>(
    'ek_favorites',
    [],
    (items) => items.map((item) => item.id),
    (ids) => ids.flatMap((id) => findMenuItem(id) ?? [])
  );
  const [eventPlan, setEventPlan] = usePersistentState<EventPlan | null>('ek_event', null);

  // Écrans et panneaux
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [detail, setDetail] = useState<{ item: MenuItem; shared: boolean } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderSubmission | null>(null);

  // Retours visuels
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const bagRef = useRef<HTMLButtonElement>(null);

  const filteredItems = useMemo(() => {
    let list = MENU_DATA;
    if (selectedCategory !== 'all') list = list.filter((item) => item.category === selectedCategory);
    const diet = DIET_FILTERS.find((d) => d.id === dietFilter);
    if (diet) list = list.filter(diet.matches);
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [selectedCategory, dietFilter, sortBy]);

  const filtersActive = selectedCategory !== 'all' || dietFilter !== 'all' || sortBy !== 'featured';
  const resetFilters = () => {
    setSelectedCategory('all');
    setDietFilter('all');
    setSortBy('featured');
  };

  // Les créations sur devis ne comptent ni en pièces ni dans le total
  const totalPieces = useMemo(() => getPiecesCount(cartItems), [cartItems]);
  const totalPrice = useMemo(() => getCartTotal(cartItems), [cartItems]);
  const recommended = eventPlan ? getRecommendedPieces(eventPlan) : null;

  const showToast = (message: string) => {
    clearTimeout(toastTimeout.current);
    setToastMessage(message);
    toastTimeout.current = setTimeout(() => setToastMessage(null), 2800);
  };

  const launchFlyer = useCallback((src: string, origin?: HTMLElement | null) => {
    const bag = bagRef.current?.getBoundingClientRect();
    const start = origin?.getBoundingClientRect();
    if (!bag || !start || start.width === 0) {
      return;
    }
    setFlyers((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        src,
        from: { x: start.left, y: start.top, w: start.width, h: start.height },
        to: { x: bag.left + bag.width / 2, y: bag.top + bag.height / 2 },
      },
    ]);
  }, []);

  const handleAdd = (item: MenuItem, quantity: number = MIN_PIECES_PER_VARIETY, origin?: HTMLElement | null) => {
    const isQuote = isQuoteItem(item);
    const alreadyRequested = isQuote && cartItems.some((entry) => entry.item.id === item.id);
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.item.id === item.id);
      if (existing) {
        // Une création sur devis n'est demandée qu'une fois
        if (isQuote) return prev;
        return prev.map((entry) =>
          entry.item.id === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry
        );
      }
      return [...prev, { item, quantity: isQuote ? 1 : quantity }];
    });
    // Un retour discret suffit : le produit reste visible pendant la sélection.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      launchFlyer(item.cutout ?? item.image, origin);
    }
    showToast(
      alreadyRequested
        ? 'Cette création est déjà dans votre demande'
        : isQuote
          ? `Demande de devis ajoutée`
          : `${quantity} pièces ajoutées à votre sélection`
    );
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemove(id);
      return;
    }
    setCartItems((prev) => prev.map((entry) => (entry.item.id === id ? { ...entry, quantity } : entry)));
  };

  const handleRemove = (id: string) => setCartItems((prev) => prev.filter((entry) => entry.item.id !== id));

  const handleToggleFavorite = (item: MenuItem) => {
    const exists = favorites.some((fav) => fav.id === item.id);
    setFavorites((prev) => (exists ? prev.filter((fav) => fav.id !== item.id) : [...prev, item]));
    showToast(exists ? 'Retiré de vos favoris' : 'Ajouté à vos favoris');
  };

  const openItem = (item: MenuItem, shared: boolean) => {
    setDetail({ item, shared });
    setIsDetailOpen(true);
  };

  const closeAllPanels = () => {
    setIsMenuOpen(false);
    setIsFavoritesOpen(false);
    setIsContactOpen(false);
    setIsSearchOpen(false);
    setIsSelectionOpen(false);
  };

  const browseMenu = () => {
    closeAllPanels();
    // laisse les panneaux se refermer avant de défiler
    setTimeout(scrollToMenu, 350);
  };

  const handleEventConfirmed = (plan: EventPlan) => {
    setEventPlan(plan);
    setIsComposerOpen(false);
    showToast(`Réception enregistrée : environ ${getRecommendedPieces(plan)} pièces conseillées`);
    if (!isSelectionOpen) setTimeout(scrollToMenu, 450);
  };

  const handleOrderConfirmed = (order: OrderSubmission) => {
    setLastOrder(order);
    setIsCheckoutOpen(false);
    setIsSelectionOpen(false);
    setIsConfirmationOpen(true);
    // Le récapitulatif est parti sur WhatsApp : on vide la sélection
    setCartItems([]);
  };

  // Touche Échap : ferme l'écran du dessus
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isConfirmationOpen) setIsConfirmationOpen(false);
      else if (isComposerOpen) setIsComposerOpen(false);
      else if (isCheckoutOpen) setIsCheckoutOpen(false);
      else if (isDetailOpen) setIsDetailOpen(false);
      else if (isSearchOpen) setIsSearchOpen(false);
      else if (isFilterOpen) setIsFilterOpen(false);
      else if (isMenuOpen) setIsMenuOpen(false);
      else if (isFavoritesOpen) setIsFavoritesOpen(false);
      else if (isContactOpen) setIsContactOpen(false);
      else if (isSelectionOpen) setIsSelectionOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    isConfirmationOpen,
    isComposerOpen,
    isCheckoutOpen,
    isDetailOpen,
    isSearchOpen,
    isFilterOpen,
    isMenuOpen,
    isFavoritesOpen,
    isContactOpen,
    isSelectionOpen,
  ]);

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <SplashIntro show={showSplash} />
        <OfflineIndicator />

        <a href="#carte" className="skip-link">Aller aux créations</a>
        <div className="atelier-shell min-h-screen bg-ivory relative flex flex-col">
          <Header
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenSelection={() => setIsSelectionOpen(true)}
            selectionCount={totalPieces || cartItems.length}
            onBrowse={scrollToMenu}
            bagRef={bagRef}
          />

          <PWAInstallButton variant="banner" />

          <main className="flex-1 pb-32">
            <Hero
              delay={heroDelay}
              onCompose={() => setIsComposerOpen(true)}
              onBrowse={scrollToMenu}
              eventSummary={eventPlan ? describeEvent(eventPlan) : null}
            />

            <MenuGrid
              items={filteredItems}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              filtersActive={filtersActive}
              onOpenFilters={() => setIsFilterOpen(true)}
              onResetFilters={resetFilters}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onOpenItem={(item) => openItem(item, true)}
              onAdd={handleAdd}
              openItemId={isDetailOpen && detail?.shared && !detail.item.cutout ? detail.item.id : null}
            />

            <MaisonSection onCompose={() => setIsComposerOpen(true)} onContact={() => setIsContactOpen(true)} />
          </main>
        </div>

        <SelectionBar
          visible={cartItems.length > 0 && !isSelectionOpen && !isCheckoutOpen && !isDetailOpen}
          pieces={totalPieces}
          total={totalPrice}
          recommended={recommended}
          guests={eventPlan?.guests}
          onOpen={() => setIsSelectionOpen(true)}
        />

        <SelectionPage
          open={isSelectionOpen}
          onClose={() => setIsSelectionOpen(false)}
          cartItems={cartItems}
          pieces={totalPieces}
          total={totalPrice}
          event={eventPlan}
          recommended={recommended}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
          onAdd={handleAdd}
          onCompose={() => setIsComposerOpen(true)}
          onBrowse={browseMenu}
          onCheckout={() => setIsCheckoutOpen(true)}
        />

        <EventComposer
          open={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
          initialPlan={eventPlan}
          onConfirm={handleEventConfirmed}
        />

        <OrderCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          totalPieces={totalPieces}
          totalPrice={totalPrice}
          event={eventPlan}
          onOrderConfirmed={handleOrderConfirmed}
        />

        <OrderConfirmationModal
          isOpen={isConfirmationOpen}
          order={lastOrder}
          onClose={() => {
            setIsConfirmationOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <ProductDetail
          key={detail?.item.id}
          item={detail?.item ?? null}
          open={isDetailOpen}
          sharedImage={detail?.shared ?? false}
          onClose={() => setIsDetailOpen(false)}
          isFavorite={detail ? favorites.some((f) => f.id === detail.item.id) : false}
          onToggleFavorite={handleToggleFavorite}
          onAdd={handleAdd}
        />

        <MenuSheet
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          favoritesCount={favorites.length}
          onCompose={() => {
            setIsMenuOpen(false);
            setIsComposerOpen(true);
          }}
          onBrowse={browseMenu}
          onOpenFavorites={() => {
            setIsMenuOpen(false);
            setIsFavoritesOpen(true);
          }}
          onOpenContact={() => {
            setIsMenuOpen(false);
            setIsContactOpen(true);
          }}
        />

        <FavoritesSheet
          open={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
          favorites={favorites}
          onRemoveFavorite={handleToggleFavorite}
          onOpenItem={(item) => openItem(item, false)}
        />

        <ContactSheet open={isContactOpen} onClose={() => setIsContactOpen(false)} />

        <SearchOverlay
          open={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          items={MENU_DATA}
          onOpenItem={(item) => openItem(item, false)}
        />

        <FilterSheet
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          items={MENU_DATA}
          resultsCount={filteredItems.length}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          dietFilter={dietFilter}
          setDietFilter={setDietFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReset={resetFilters}
        />

        {/* Vignettes en vol vers le sac */}
        <div className="fixed inset-0 z-[85] pointer-events-none" aria-hidden="true">
          <AnimatePresence>
            {flyers.map((f) => {
              const size = 28;
              const endX = f.to.x - size / 2;
              const endY = f.to.y - size / 2;
              // L'image s'élève d'abord au-dessus de son point de départ, puis plonge vers le sac
              const midX = f.from.x + (endX - f.from.x) * 0.3;
              const midY = Math.max(12, f.from.y - 120);
              return (
                <motion.img
                  key={f.id}
                  src={f.src}
                  alt=""
                  className="absolute top-0 left-0 object-cover rounded-[2px] shadow-xl"
                  initial={{ x: f.from.x, y: f.from.y, width: f.from.w, height: f.from.h, opacity: 1, borderRadius: 2 }}
                  animate={{
                    x: [f.from.x, midX, endX],
                    y: [f.from.y, midY, endY],
                    width: [f.from.w, f.from.w * 0.45, size],
                    height: [f.from.h, f.from.h * 0.45, size],
                    borderRadius: [2, 12, size / 2],
                    opacity: [1, 1, 0.4],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.85, ease: [0.55, 0, 0.3, 1], times: [0, 0.45, 1] }}
                  onAnimationComplete={() => {
                    setFlyers((prev) => prev.filter((x) => x.id !== f.id));
                  }}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Notification */}
        <div className="fixed top-3 left-0 right-0 z-[90] flex justify-center px-14 pointer-events-none">
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                key={toastMessage}
                role="status"
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="bg-ink text-ivory text-[13px] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 max-w-full"
              >
                <Check className="w-4 h-4 text-[#C9B98F] shrink-0" strokeWidth={1.6} />
                <span className="truncate">{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}

const MAISON_FACTS = ['Fait maison', 'Bordeaux & CUB', 'Livraison ou retrait', 'Dès 20 pièces par création'];

const MaisonSection: React.FC<{ onCompose: () => void; onContact: () => void }> = ({ onCompose, onContact }) => (
  <>
    <section id="maison" className="maison-section scroll-mt-24">
      <span className="eyebrow">03 — La maison</span>
      <h2 className="maison-quote">Le goût du fait maison.<br />Le plaisir de <em>faire plaisir.</em></h2>
      <p className="text-sm leading-relaxed max-w-lg text-[#D3DCCB] mb-7">Chez Ena’s Kitchen, chaque pièce se prépare avec soin. Des recettes généreuses, des détails qui comptent et l’envie de rendre vos moments encore plus beaux.</p>
      <ul className="maison-facts">{MAISON_FACTS.map(fact => <li key={fact}>{fact}</li>)}</ul>
      <div className="maison-contact">
        <button type="button" onClick={onCompose} className="text-link">Imaginons votre réception <ArrowRight className="w-4 h-4" strokeWidth={1.4} /></button>
        <button type="button" onClick={onContact} className="text-link">Une envie particulière ? Écrivez-nous <ArrowRight className="w-4 h-4" strokeWidth={1.4} /></button>
      </div>
    </section>
    <footer className="atelier-footer"><span>© Ena’s Kitchen · Bordeaux</span><span>De petites créations. De grands moments.</span></footer>
  </>
);
