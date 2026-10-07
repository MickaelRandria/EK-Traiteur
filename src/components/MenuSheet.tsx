import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Sheet } from './ui/Sheet';
import { PWAInstallButton } from './PWAInstallButton';
import { EASE_OUT } from './ui/motion';

interface MenuSheetProps {
  open: boolean;
  onClose: () => void;
  favoritesCount: number;
  onCompose: () => void;
  onBrowse: () => void;
  onOpenFavorites: () => void;
  onOpenContact: () => void;
}

export const MenuSheet: React.FC<MenuSheetProps> = ({
  open,
  onClose,
  favoritesCount,
  onCompose,
  onBrowse,
  onOpenFavorites,
  onOpenContact,
}) => {
  const links = [
    { label: 'Composer ma réception', action: onCompose },
    { label: 'Les créations', action: onBrowse },
    { label: `Mes favoris${favoritesCount ? ` (${favoritesCount})` : ''}`, action: onOpenFavorites },
    { label: 'Nous contacter', action: onOpenContact },
  ];

  return (
    <Sheet open={open} onClose={onClose} title="Ena’s Kitchen" eyebrow="L’atelier du recevoir · Bordeaux">
      <nav className="flex flex-col border-t border-line">
        {links.map((link, i) => (
          <motion.button
            key={link.label}
            type="button"
            onClick={link.action}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: EASE_OUT }}
            className="group flex items-center justify-between py-4 border-b border-line text-left"
          >
            <span className="font-serif text-[26px] leading-none transition-transform duration-300 group-hover:translate-x-1">
              {link.label}
            </span>
            <ArrowRight className="w-4 h-4 text-muted transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.3} />
          </motion.button>
        ))}
      </nav>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex items-center justify-between gap-4"
      >
        <span className="text-xs text-muted">Installez l'application sur votre écran d'accueil</span>
        <PWAInstallButton variant="badge" />
      </motion.div>
    </Sheet>
  );
};
