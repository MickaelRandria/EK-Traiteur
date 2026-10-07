import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { EASE_OUT } from './ui/motion';

/** Durée totale avant que le rideau ne se lève (le hero démarre juste après) */
export const SPLASH_DURATION = 0.65;

const shouldShowSplash = () => {
  try {
    if (sessionStorage.getItem('ek_intro_seen')) return false;
    sessionStorage.setItem('ek_intro_seen', 'true');
  } catch {
    // stockage indisponible : on montre l'intro
  }
  return true;
};

/** Rideau d'ouverture : le logo apparaît, un trait se dessine, puis le rideau se lève. Une fois par session. */
export const useSplash = () => {
  const [show] = useState(shouldShowSplash);
  const reduceMotion = useReducedMotion();
  return show && !reduceMotion;
};

export const SplashIntro: React.FC<{ show: boolean }> = ({ show }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setVisible(false), SPLASH_DURATION * 1000);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-ivory flex flex-col items-center justify-center gap-5"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          aria-hidden="true"
        >
          <motion.img
            src="/carte-ek.png"
            alt=""
            className="h-20 w-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          />
          <motion.span
            className="h-px w-24 bg-sage origin-center"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: EASE_OUT }}
          />
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15, ease: EASE_OUT }}
          >
            Traiteur · Bordeaux
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
