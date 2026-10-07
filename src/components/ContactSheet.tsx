import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Sheet } from './ui/Sheet';
import { EASE_OUT } from './ui/motion';

interface ContactSheetProps {
  open: boolean;
  onClose: () => void;
}

const CHANNELS = [
  { label: 'Appeler', detail: '06 17 96 06 40', href: 'tel:+33617960640' },
  {
    label: 'WhatsApp',
    detail: 'Conseils personnalisés',
    href: 'https://wa.me/33617960640?text=Bonjour%20Ena%27s%20Kitchen%2C%20je%20souhaite%20des%20renseignements%20pour%20une%20r%C3%A9ception.',
    external: true,
  },
  {
    label: 'SMS',
    detail: 'Un message rapide',
    href: 'sms:+33617960640?body=Bonjour%20Ena%27s%20Kitchen%2C%20je%20souhaite%20des%20renseignements%20pour%20une%20r%C3%A9ception.',
  },
  { label: 'E-mail', detail: 'contact@enaskitchen.fr', href: 'mailto:contact@enaskitchen.fr' },
];

const INFOS = [
  { title: 'Zone de livraison', text: 'Bordeaux Métropole, Mérignac, Pessac, Talence, Le Bouscat, Rive Droite et Gironde.' },
  { title: 'Délai de commande', text: 'Idéalement 48 h à 72 h à l’avance pour garantir des produits frais.' },
  { title: 'Hygiène & chaîne du froid', text: 'Livraison en caissons isothermes réfrigérés, conformes aux normes HACCP.' },
];

export const ContactSheet: React.FC<ContactSheetProps> = ({ open, onClose }) => (
  <Sheet open={open} onClose={onClose} title="Nous contacter" eyebrow="Ena's Kitchen">
    <p className="text-sm text-ink-soft leading-relaxed mb-5">
      Cocktails dînatoires, réceptions privées, mariages et séminaires à Bordeaux et en Gironde.
    </p>
    <div className="flex flex-col border-t border-line">
      {CHANNELS.map((c, i) => (
        <motion.a
          key={c.label}
          href={c.href}
          target={c.external ? '_blank' : undefined}
          rel={c.external ? 'noopener noreferrer' : undefined}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: EASE_OUT }}
          className="group flex items-center justify-between py-4 border-b border-line"
        >
          <span className="flex flex-col gap-0.5">
            <span className="font-serif text-[24px] leading-none">{c.label}</span>
            <span className="text-xs text-muted">{c.detail}</span>
          </span>
          <ArrowUpRight className="w-4 h-4 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.3} />
        </motion.a>
      ))}
    </div>
    <div className="mt-6 flex flex-col gap-4">
      {INFOS.map((info) => (
        <div key={info.title} className="flex flex-col gap-1">
          <span className="eyebrow">{info.title}</span>
          <span className="text-sm text-ink-soft leading-relaxed">{info.text}</span>
        </div>
      ))}
    </div>
  </Sheet>
);
