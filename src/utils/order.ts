import { CartItem, EventPlan, MenuItem, Occasion, OrderSubmission, ReceptionFormat } from '../types';

export const WHATSAPP_NUMBER = '33617960640';
export const MIN_PIECES_PER_VARIETY = 20;
/** Délai minimum (en jours) entre la commande et l'événement, pour laisser le temps de préparer. */
export const MIN_LEAD_DAYS = 3;
/** Nombre moyen de pièces par convive pour un cocktail dînatoire. */
export const PIECES_PER_GUEST = 14;

export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: 'mariage', label: 'Mariage' },
  { id: 'anniversaire', label: 'Anniversaire' },
  { id: 'entreprise', label: 'Entreprise' },
  { id: 'aperitif', label: 'Apéritif' },
];

/** Repères de quantité par invité (apéritif : 6 à 8 pièces, calcul sur 7) */
export const RECEPTION_FORMATS: { id: ReceptionFormat; label: string; hint: string; piecesPerGuest: number }[] = [
  { id: 'aperitif', label: 'Apéritif', hint: '6 à 8 pièces / invité', piecesPerGuest: 7 },
  { id: 'dinatoire', label: 'Cocktail dînatoire', hint: `≈ ${PIECES_PER_GUEST} pièces / invité`, piecesPerGuest: PIECES_PER_GUEST },
];

export const getRecommendedPieces = (plan: EventPlan) => {
  const format = RECEPTION_FORMATS.find((f) => f.id === plan.format) ?? RECEPTION_FORMATS[1];
  return plan.guests * format.piecesPerGuest;
};

export const describeEvent = (plan: EventPlan) => {
  const occasion = OCCASIONS.find((o) => o.id === plan.occasion)?.label ?? '';
  const format = RECEPTION_FORMATS.find((f) => f.id === plan.format)?.label.toLowerCase() ?? '';
  return `${occasion} · ${plan.guests} invités · ${format}`;
};

const priceFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export const formatPrice = (value: number) => priceFormatter.format(value);

/** Créations sur devis (number cake…) : pas de prix unitaire ni de minimum de 20 pièces. */
export const isQuoteItem = (item: MenuItem) => item.price === 0 || !!item.priceDisplay;

export const getPiecesCount = (items: CartItem[]) =>
  items.reduce((sum, entry) => (isQuoteItem(entry.item) ? sum : sum + entry.quantity), 0);

export const getCartTotal = (items: CartItem[]) =>
  items.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);

export const getItemsBelowMinimum = (items: CartItem[]) =>
  items.filter((entry) => !isQuoteItem(entry.item) && entry.quantity < MIN_PIECES_PER_VARIETY);

export const estimateGuests = (pieces: number) => Math.max(1, Math.round(pieces / PIECES_PER_GUEST));

/** Date locale au format YYYY-MM-DD (valeur attendue par <input type="date">). */
export const toDateInputValue = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getMinEventDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + MIN_LEAD_DAYS);
  return toDateInputValue(d);
};

/** "2026-10-14" → "mercredi 14 octobre 2026" */
export const formatEventDate = (isoDate: string) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const generateOrderNumber = () => {
  const now = new Date();
  const datePart = toDateInputValue(now).slice(2).replace(/-/g, '');
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `EK-${datePart}-${suffix}`;
};

export const buildOrderMessage = (order: OrderSubmission) => {
  const quoteItems = order.items.filter((entry) => isQuoteItem(entry.item));
  const lines = [
    `Bonjour Ena's Kitchen ! Voici ma commande :`,
    ``,
    `*Commande ${order.orderNumber}*`,
    `👤 ${order.customerName}`,
    `📞 ${order.customerPhone}`,
    ...(order.customerEmail ? [`✉️ ${order.customerEmail}`] : []),
    `📅 Événement : ${formatEventDate(order.eventDate)}`,
    ...(order.event ? [`🎉 ${describeEvent(order.event)}`] : []),
    order.deliveryType === 'delivery'
      ? `🚚 Livraison : ${order.deliveryAddress}`
      : `🏠 Retrait à l'atelier EK Traiteur`,
    ``,
    `*Pièces cocktail (${order.totalPieces} pcs)*`,
    ...order.items.map((entry) =>
      isQuoteItem(entry.item)
        ? `• ${entry.item.name} — sur devis`
        : `• ${entry.quantity} × ${entry.item.name} — ${formatPrice(entry.item.price * entry.quantity)}`
    ),
    ``,
    `*Total estimé : ${formatPrice(order.totalPrice)} TTC*${quoteItems.length > 0 ? ' (+ créations sur devis)' : ''}`,
    ...(order.notes?.trim() ? [``, `📝 Remarques : ${order.notes.trim()}`] : []),
  ];
  return lines.join('\n');
};

export const getWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
