import React, { useState } from 'react';
import { X, Mail, Phone, Calendar, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CartItem, OrderSubmission } from '../types';

interface OrderCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalPieces: number;
  totalPrice: number;
  onOrderConfirmed: (order: OrderSubmission) => void;
}

export const OrderCheckoutModal: React.FC<OrderCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalPieces,
  totalPrice,
  onOrderConfirmed,
}) => {
  const [customerName, setCustomerName] = useState('Micka Randrianan');
  const [customerEmail, setCustomerEmail] = useState('mickarandrianan@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('06 52 48 19 02');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('14 Quai des Chartrons, 33000 Bordeaux');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderSubmission = {
      orderNumber: `EK-BDX-${randomSuffix}`,
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : 'Retrait à l’Atelier EK Traiteur (Bordeaux)',
      notes,
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

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderConfirmed(newOrder);
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="checkout-drawer"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom duration-300"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F8F9FA]">
          <div>
            <span className="text-[10px] font-bold text-[#5B6B54] uppercase tracking-wider">
              Étape finale • Validation
            </span>
            <h2 className="text-base font-bold text-[#141613]">
              Confirmation de Commande
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center border border-gray-200 shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Quick Summary Strip */}
          <div className="bg-[#F6F4EB] p-3 rounded-2xl flex items-center justify-between border border-amber-950/5">
            <div>
              <p className="text-xs font-bold text-[#141613]">Dégustation {totalPieces} pièces</p>
              <p className="text-[11px] text-gray-500">EK Traiteur Bordeaux</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-[#141613]">{totalPrice.toFixed(2)} €</span>
              <p className="text-[10px] text-[#5B6B54] font-semibold">TTC</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#141613] uppercase tracking-wider">
              1. Coordonnées & Contact
            </h3>
            
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Nom complet / Société
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Micka Randrianan"
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#5B6B54] bg-[#F8F9FA]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Email de confirmation (Envoi automatique)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="votre.email@domaine.com"
                  className="w-full text-xs font-medium pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#5B6B54] bg-[#F8F9FA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Téléphone de contact
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="06 XX XX XX XX"
                  className="w-full text-xs font-medium pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#5B6B54] bg-[#F8F9FA]"
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-[#141613] uppercase tracking-wider">
              2. Modalités de la Dégustation
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Date de l'événement à Bordeaux
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-xs font-medium pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#5B6B54] bg-[#F8F9FA]"
                />
              </div>
            </div>

            {/* Delivery Type */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                Service souhaité
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    deliveryType === 'delivery'
                      ? 'bg-[#141613] text-white border-[#141613]'
                      : 'bg-[#F8F9FA] text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Livraison Bordeaux & CUB
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    deliveryType === 'pickup'
                      ? 'bg-[#141613] text-white border-[#141613]'
                      : 'bg-[#F8F9FA] text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Retrait Atelier EK
                </button>
              </div>
            </div>

            {deliveryType === 'delivery' && (
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Adresse de livraison (Bordeaux / Gironde)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Adresse complète"
                    className="w-full text-xs font-medium pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#5B6B54] bg-[#F8F9FA]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Remarques ou précisions (allergies, horaires...)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ex: Cocktail dînatoire prévu pour 19h30, prévoir 1 plateau végétarien à part."
                className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#5B6B54] bg-[#F8F9FA] resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#5B6B54] bg-[#5B6B54]/10 p-2.5 rounded-xl font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Votre réservation déclenchera un e-mail officiel de confirmation avec récapitulatif détaillé.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-full bg-[#5B6B54] hover:bg-[#4E5F48] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
          >
            {isSubmitting ? (
              <span>Génération de l’e-mail de confirmation...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmer et recevoir l'email</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
