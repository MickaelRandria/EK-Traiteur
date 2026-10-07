import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle, Copy, Check } from 'lucide-react';
import { OrderSubmission } from '../types';
import { buildOrderMessage, describeEvent, formatEventDate, formatPrice, getWhatsAppUrl, isQuoteItem } from '../utils/order';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { EASE_OUT } from './ui/motion';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  order: OrderSubmission | null;
  onClose: () => void;
}

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE_OUT },
});

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ isOpen, order, onClose }) => {
  const [copied, setCopied] = useState(false);
  useLockBodyScroll(isOpen);

  const message = order ? buildOrderMessage(order) : '';
  const hasQuoteItems = order?.items.some((entry) => isQuoteItem(entry.item)) ?? false;
  const firstName = order?.customerName.split(' ')[0] ?? '';

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // presse-papiers indisponible : le bouton WhatsApp reste la voie principale
    }
  };

  return (
    <AnimatePresence>
      {isOpen && order && (
        <motion.div
          id="order-confirmation-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-confirmation-title"
          className="fixed inset-0 z-[70] bg-ivory overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md mx-auto px-6 pt-16 pb-10 flex flex-col items-center text-center gap-5">
            {/* Coche qui se dessine */}
            <svg width="76" height="76" viewBox="0 0 76 76" fill="none" aria-hidden="true">
              <motion.circle
                cx="38" cy="38" r="36" stroke="#3F4B39" strokeWidth="1.2"
                initial={{ pathLength: 0, rotate: -90 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: EASE_OUT }}
                style={{ originX: '50%', originY: '50%' }}
              />
              <motion.path
                d="M25 39.5l9 9 17-19" stroke="#3F4B39" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.75, ease: EASE_OUT }}
              />
            </svg>

            <motion.span {...reveal(0.6)} className="eyebrow">Commande {order.orderNumber}</motion.span>
            <motion.h2 {...reveal(0.7)} id="order-confirmation-title" className="font-serif font-medium text-[38px] leading-[1.05]">
              Merci{firstName ? ` ${firstName}` : ''}.
            </motion.h2>
            <motion.p {...reveal(0.8)} className="text-[15px] text-ink-soft leading-relaxed">
              Votre récapitulatif est prêt dans WhatsApp. Envoyez le message pour transmettre la commande : Ena's Kitchen
              vous répondra pour la confirmer{hasQuoteItems ? ' et chiffrer les créations sur devis' : ''}.
            </motion.p>

            <motion.div {...reveal(0.95)} className="w-full mt-2 text-left border-y border-line divide-y divide-line">
              <Row label="Événement">
                <span className="inline-block first-letter:uppercase">{formatEventDate(order.eventDate)}</span>
              </Row>
              {order.event && <Row label="Réception">{describeEvent(order.event)}</Row>}
              <Row label={order.deliveryType === 'delivery' ? 'Livraison' : 'Retrait'}>
                {order.deliveryType === 'delivery' ? order.deliveryAddress : "À l'atelier"}
              </Row>
              <Row label="Sélection">
                {order.totalPieces} pièces · {formatPrice(order.totalPrice)}
                {hasQuoteItems ? ' + devis' : ''}
              </Row>
            </motion.div>

            <motion.div {...reveal(1.1)} className="w-full flex flex-col gap-3 pt-2">
              <a href={getWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                <MessageCircle className="w-4 h-4" strokeWidth={1.4} />
                Rouvrir WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={handleCopySummary} className="btn-outline">
                  {copied ? <Check className="w-4 h-4 text-sage" strokeWidth={1.5} /> : <Copy className="w-4 h-4" strokeWidth={1.3} />}
                  {copied ? 'Copié' : 'Copier le récap'}
                </button>
                <button type="button" onClick={onClose} className="btn-outline">
                  Retour à l'accueil
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex justify-between gap-4 py-3 text-sm">
    <span className="text-muted shrink-0">{label}</span>
    <span className="text-right">{children}</span>
  </div>
);
