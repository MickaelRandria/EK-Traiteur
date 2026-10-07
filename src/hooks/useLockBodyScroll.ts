import { useEffect } from 'react';

// Plusieurs fenêtres peuvent être ouvertes en même temps : on compte les verrous
let locks = 0;

/** Bloque le défilement de la page tant qu'une fenêtre plein écran est ouverte */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    document.body.style.overflow = 'hidden';
    return () => {
      locks -= 1;
      if (locks === 0) document.body.style.overflow = '';
    };
  }, [active]);
}
