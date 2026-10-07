import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { CartItem, EventPlan, OrderSubmission } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import {
  buildOrderMessage,
  describeEvent,
  formatPrice,
  generateOrderNumber,
  getItemsBelowMinimum,
  getMinEventDate,
  getWhatsAppUrl,
  MIN_LEAD_DAYS,
  MIN_PIECES_PER_VARIETY,
} from '../utils/order';
import { Page } from './ui/Page';
import { EASE_OUT } from './ui/motion';

interface OrderCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalPieces: number;
  totalPrice: number;
  event: EventPlan | null;
  onOrderConfirmed: (order: OrderSubmission) => void;
}

/** Coordonnées mémorisées sur l'appareil pour pré-remplir la prochaine commande */
interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const EMPTY_CUSTOMER: CustomerDetails = { name: '', email: '', phone: '', address: '' };

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.2 + i * 0.07, ease: EASE_OUT },
});

export const OrderCheckoutModal: React.FC<OrderCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalPieces,
  totalPrice,
  event,
  onOrderConfirmed,
}) => {
  const [customer, setCustomer] = usePersistentState<CustomerDetails>('ek_customer', EMPTY_CUSTOMER);
  const [eventDate, setEventDate] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const minDate = getMinEventDate();
  const updateCustomer = (field: keyof CustomerDetails) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomer((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cartItems.length === 0) {
      setError('Votre sélection est vide.');
      return;
    }
    if (getItemsBelowMinimum(cartItems).length > 0) {
      setError(`Minimum ${MIN_PIECES_PER_VARIETY} pièces par création : ajustez votre sélection.`);
      return;
    }
    if (eventDate < minDate) {
      setError(`Merci de choisir une date à au moins ${MIN_LEAD_DAYS} jours, le temps de préparer votre commande.`);
      return;
    }

    const newOrder: OrderSubmission = {
      orderNumber: generateOrderNumber(),
      customerName: customer.name.trim(),
      customerEmail: customer.email.trim() || undefined,
      customerPhone: customer.phone.trim(),
      eventDate,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? customer.address.trim() : 'Retrait à l’Atelier EK Traiteur (Bordeaux)',
      notes,
      event,
      items: [...cartItems],
      totalPieces,
      totalPrice,
      submittedAt: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Ouverture synchrone (dans le geste utilisateur) pour éviter le blocage des pop-ups
    window.open(getWhatsAppUrl(buildOrderMessage(newOrder)), '_blank', 'noopener,noreferrer');
    setNotes('');
    setEventDate('');
    onOrderConfirmed(newOrder);
  };

  return (
    <Page
      open={isOpen}
      onClose={onClose}
      label="Finaliser ma commande"
      topLabel="Les derniers détails · 03 / 03"
      step={3}
      zIndex={50}
      footer={
        <div className="flex flex-col gap-3">
          {error && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[#9B3B2E]"
            >
              {error}
            </motion.p>
          )}
          <button type="submit" form="checkout-form" className="btn-primary w-full">
            <MessageCircle className="w-4 h-4" strokeWidth={1.4} />
            Envoyer sur WhatsApp
          </button>
          <p className="text-[11px] text-muted text-center">
            Le récapitulatif s'ouvre dans WhatsApp : envoyez-le pour transmettre votre commande.
          </p>
        </div>
      }
    >
      <form id="checkout-form" onSubmit={handleSubmit} className="px-6 pt-4 pb-6 flex flex-col gap-7" noValidate={false}>
        <motion.div {...stagger(0)} className="flex flex-col gap-1">
          <span className="eyebrow mb-3">À nous de préparer la suite</span>
          <h1 className="font-serif font-medium text-[42px] tracking-[-0.03em] leading-[1.05]">Votre moment<br /><em>prend forme.</em></h1>
          <p className="text-[13px] text-muted">
            {event ? `${describeEvent(event)} · ` : ''}
            {totalPieces} pièces · {formatPrice(totalPrice)}
          </p>
        </motion.div>

        <motion.div {...stagger(1)} className="flex flex-col gap-5">
          <div>
            <label htmlFor="checkout-name" className="field-label">Nom complet ou société</label>
            <input id="checkout-name" type="text" required autoComplete="name" value={customer.name} onChange={updateCustomer('name')} placeholder="Prénom Nom" className="field" />
          </div>
          <div>
            <label htmlFor="checkout-phone" className="field-label">Téléphone</label>
            <input
              id="checkout-phone"
              type="tel"
              required
              autoComplete="tel"
              pattern="[0-9+ .\-\(\)]{10,}"
              title="Numéro de téléphone (10 chiffres minimum)"
              value={customer.phone}
              onChange={updateCustomer('phone')}
              placeholder="06 12 34 56 78"
              className="field"
            />
          </div>
          <div>
            <label htmlFor="checkout-email" className="field-label">
              E-mail <span className="text-[#A19D90]">(facultatif)</span>
            </label>
            <input id="checkout-email" type="email" autoComplete="email" value={customer.email} onChange={updateCustomer('email')} placeholder="vous@exemple.fr" className="field" />
          </div>
        </motion.div>

        <motion.div {...stagger(2)} className="flex flex-col gap-5">
          <h2 className="eyebrow">Votre réception</h2>
          <div>
            <label htmlFor="checkout-date" className="field-label">Date de l'événement</label>
            <input id="checkout-date" type="date" required min={minDate} value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="field" />
            <p className="text-[11px] text-muted mt-1.5">Au minimum {MIN_LEAD_DAYS} jours avant l'événement.</p>
          </div>

          <div role="radiogroup" aria-label="Service souhaité" className="grid grid-cols-2 gap-2">
            {([
              ['delivery', 'Livraison', 'Bordeaux & CUB'],
              ['pickup', 'Retrait', "À l'atelier"],
            ] as const).map(([value, label, hint]) => {
              const active = deliveryType === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setDeliveryType(value)}
                  className={`relative h-16 rounded-[2px] border flex flex-col items-center justify-center gap-0.5 transition-colors duration-300 ${
                    active ? 'border-sage text-ivory' : 'border-line-strong hover:border-sage'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="delivery-highlight"
                      className="absolute inset-0 bg-sage rounded-[1px]"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative font-serif text-[19px] leading-none">{label}</span>
                  <span className={`relative text-[11px] ${active ? 'text-ivory/75' : 'text-muted'}`}>{hint}</span>
                </button>
              );
            })}
          </div>

          <motion.div
            initial={false}
            animate={{ height: deliveryType === 'delivery' ? 'auto' : 0, opacity: deliveryType === 'delivery' ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <label htmlFor="checkout-address" className="field-label">Adresse de livraison</label>
            <input
              id="checkout-address"
              type="text"
              required={deliveryType === 'delivery'}
              disabled={deliveryType !== 'delivery'}
              autoComplete="street-address"
              value={customer.address}
              onChange={updateCustomer('address')}
              placeholder="N°, rue, code postal, ville"
              className="field"
            />
          </motion.div>

          <div>
            <label htmlFor="checkout-notes" className="field-label">Précisions (allergies, horaires…)</label>
            <textarea
              id="checkout-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ex : cocktail prévu à 19h30, un plateau végétarien à part."
              className="field resize-none"
            />
          </div>
        </motion.div>
      </form>
    </Page>
  );
};
