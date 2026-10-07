import React, { useState } from 'react';
import { CheckCircle, Mail, Download, Share2, MessageCircle, X, Copy, Check } from 'lucide-react';
import { OrderSubmission } from '../types';

interface EmailConfirmationModalProps {
  isOpen: boolean;
  order: OrderSubmission | null;
  onClose: () => void;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopySummary = () => {
    const text = `🍽️ COMMANDE EK TRAITEUR BORDEAUX #${order.orderNumber}
Client : ${order.customerName}
Email : ${order.customerEmail}
Téléphone : ${order.customerPhone}
Date événement : ${order.eventDate}
Lieu : ${order.deliveryAddress}

Détail des pièces cocktails (${order.totalPieces} pcs) :
${order.items.map(it => it.item.priceDisplay ? `• ${it.quantity}x ${it.item.name} (${it.item.priceDisplay})` : `• ${it.quantity}x ${it.item.name} (${(it.item.price * it.quantity).toFixed(2)} €)`).join('\n')}

Total TTC : ${order.totalPrice.toFixed(2)} €
Règle : Min. 20 pièces par variété respecté.
Ena's Kitchen - Traiteur Événementiel Bordeaux`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour Ena's Kitchen ! Je viens de réserver ma dégustation cocktail #${order.orderNumber} pour le ${order.eventDate} (${order.totalPieces} pièces - ${order.totalPrice.toFixed(2)} €).`
  );

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="email-confirmation-modal"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
      >
        {/* Top Success Header */}
        <div className="bg-[#141613] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#5B6B54] flex items-center justify-center text-white">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Email de confirmation envoyé
              </h2>
              <p className="text-[11px] text-gray-300">
                Commande confirmée #{order.orderNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Email Preview Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8F9FA]">
          {/* Email Notification Pill */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900">
              <p className="font-bold">E-mail officiel transmis avec succès</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Une copie complète avec bon de commande a été envoyée à <span className="font-semibold underline">{order.customerEmail}</span>.
              </p>
            </div>
          </div>

          {/* Simulated Email Card Paper */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-200 space-y-4 font-sans">
            {/* Email Header Paper */}
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <img
                  src="/CARTE EK.png"
                  alt="Ena's Kitchen"
                  referrerPolicy="no-referrer"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <span className="text-[10px] font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-semibold">
                {order.orderNumber}
              </span>
            </div>

            {/* Greeting & Message */}
            <div className="text-xs text-gray-700 space-y-1.5">
              <p className="font-bold text-[#141613]">
                Bonjour {order.customerName},
              </p>
              <p className="leading-relaxed text-[11px] text-gray-600">
                Nous accusons bonne réception de votre commande de pièces cocktail. Notre chef commence la préparation de votre sélection pour votre événement du <strong>{order.eventDate}</strong>.
              </p>
            </div>

            {/* Delivery / Pickup Info */}
            <div className="bg-[#F6F4EB] p-3 rounded-xl text-xs space-y-1 text-[#141613]">
              <div className="flex justify-between">
                <span className="text-gray-500 text-[11px]">Mode :</span>
                <span className="font-semibold">{order.deliveryType === 'delivery' ? 'Livraison Bordeaux & CUB' : 'Retrait Atelier'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-[11px]">Destination :</span>
                <span className="font-semibold truncate max-w-[200px] text-right">{order.deliveryAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-[11px]">Téléphone :</span>
                <span className="font-semibold">{order.customerPhone}</span>
              </div>
            </div>

            {/* Order Items List Table */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-[#141613] uppercase tracking-wider">
                Sélection des Pièces ({order.totalPieces} bouchées)
              </p>
              <div className="divide-y divide-gray-100 text-xs">
                {order.items.map((it) => (
                  <div key={it.item.id} className="py-2 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#141613] text-xs leading-tight">
                        {it.item.name}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {it.item.priceDisplay ? `${it.quantity}x • ${it.item.priceDisplay}` : `${it.quantity} pièces × ${it.item.price.toFixed(2)} €`}
                      </p>
                    </div>
                    <span className="font-black text-xs text-[#141613] shrink-0">
                      {it.item.priceDisplay ? 'Sur devis' : `${(it.item.price * it.quantity).toFixed(2)} €`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Total Net TTC</span>
                <p className="text-[10px] text-gray-400">Règle min. 20 pcs par variété incluse</p>
              </div>
              <span className="text-xl font-black text-[#5B6B54]">
                {order.totalPrice.toFixed(2)} €
              </span>
            </div>

            {/* Quality Commitment Footer */}
            <div className="text-[10px] text-gray-500 border-t border-gray-100 pt-2 text-center">
              🌿 Confection 100% fait maison le matin de l’événement • Ingrédients du Sud-Ouest
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopySummary}
              className="py-2 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#141613] hover:bg-gray-50 flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
              <span>{copied ? 'Copié !' : 'Copier l’email'}</span>
            </button>

            <a
              href={`https://wa.me/33617960640?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Chef</span>
            </a>
          </div>
        </div>

        {/* Modal Close Button */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#141613] text-white font-bold text-xs hover:bg-[#5B6B54] transition-colors"
          >
            Retourner au menu cocktail
          </button>
        </div>
      </div>
    </div>
  );
};
