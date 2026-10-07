export type CategoryType = 'all' | 'gourmet' | 'classique' | 'verrines' | 'sucre' | 'evenementiel' | 'vegetarien';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryType;
  categoryLabel: string;
  price: number; // in Euros per piece (0 if on quote)
  priceDisplay?: string; // e.g. "Sur devis"
  description: string;
  badges: string[];
  image: string;
  /** Version détourée (fond transparent) : le plat « flotte » en 3D sur la fiche */
  cutout?: string;
  rating: number;
  reviewsCount: number;
  isTopPick?: boolean;
  isChefCollection?: boolean;
  /** Douceur sucrée : proposée en suggestion pour finir la réception */
  isSweet?: boolean;
  ingredients?: string[];
  allergens?: string[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number; // Minimum 20 pieces per variety as per EK Traiteur guidelines
}

export type Occasion = 'mariage' | 'anniversaire' | 'entreprise' | 'aperitif';
export type ReceptionFormat = 'aperitif' | 'dinatoire';

/** Réception décrite par le client dans « Composer ma réception » */
export interface EventPlan {
  occasion: Occasion;
  guests: number;
  format: ReceptionFormat;
}

export interface OrderSubmission {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  eventDate: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress: string;
  notes?: string;
  event?: EventPlan | null;
  items: CartItem[];
  totalPieces: number;
  totalPrice: number;
  submittedAt: string;
}
