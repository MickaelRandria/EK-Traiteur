import React from 'react';
import { X, Phone, MessageSquare, MessageCircle, MapPin, Clock, ShieldCheck, Mail } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
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
          <div>
            <span className="text-[10px] font-bold text-[#5B6B54] uppercase tracking-wider">
              Service Traiteur Événementiel
            </span>
            <h2 className="text-base font-bold text-[#141613]">
              Contacter Ena's Kitchen
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center border border-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Chef Intro Card */}
          <div className="bg-[#F6F4EB] p-4 rounded-2xl border border-amber-950/5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#5B6B54] text-white flex items-center justify-center font-anton text-lg shrink-0">
              EK
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#141613]">
                Atelier Culinaire EK Traiteur
              </h3>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Cocktails dînatoires, réceptions privées, mariages & séminaires d’entreprises à Bordeaux & Gironde.
              </p>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#141613] uppercase tracking-wider">
              Liaison Directe
            </p>

            <a
              href="tel:+33617960640"
              className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-2xl hover:border-[#5B6B54] transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#141613] text-white flex items-center justify-center group-hover:bg-[#5B6B54] transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141613]">Appeler l'Atelier</p>
                  <p className="text-[11px] text-gray-500">06 17 96 06 40</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#5B6B54] bg-[#5B6B54]/10 px-2 py-1 rounded-full">
                Direct
              </span>
            </a>

            <a
              href="sms:+33617960640?body=Bonjour%20EK%20Traiteur,%20je%20souhaite%20des%20renseignements%20pour%20un%20cocktail%20traiteur."
              className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-2xl hover:border-[#5B6B54] transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#5B6B54] text-white flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141613]">Envoyer un SMS</p>
                  <p className="text-[11px] text-gray-500">Réponse rapide sous 1h</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                SMS
              </span>
            </a>

            <a
              href="https://wa.me/33617960640?text=Bonjour%20Ena%27s%20Kitchen%20Traiteur%20Bordeaux,%20je%20souhaite%20commander%20des%20pi%C3%A8ces%20cocktails."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-2xl hover:border-emerald-600 transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141613]">Échanger sur WhatsApp</p>
                  <p className="text-[11px] text-gray-500">Conseils personnalisés du chef</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                WhatsApp
              </span>
            </a>

            <a
              href="mailto:contact@enaskitchen.fr"
              className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-2xl hover:border-gray-400 transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141613]">Email Traiteur</p>
                  <p className="text-[11px] text-gray-500">contact@enaskitchen.fr</p>
                </div>
              </div>
            </a>
          </div>

          {/* Practical Info */}
          <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-gray-200/80 space-y-2.5 text-xs text-gray-600">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#5B6B54] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#141613]">Zone de Desserte</p>
                <p className="text-[11px]">Bordeaux Métropole, Mérignac, Pessac, Talence, Le Bouscat, Rive Droite et Gironde.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#5B6B54] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#141613]">Délai de Commande</p>
                <p className="text-[11px]">Idéalement 48h à 72h à l’avance pour garantir l’approvisionnement frais chez nos producteurs locaux.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#5B6B54] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#141613]">Hygiène & Chaîne du Froid</p>
                <p className="text-[11px]">Livraison en caissons isothermes réfrigérés conformes aux normes sanitaires HACCP.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#141613] text-white font-bold text-xs hover:bg-[#5B6B54] transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
