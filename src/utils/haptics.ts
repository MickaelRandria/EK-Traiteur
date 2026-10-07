/**
 * Retours tactiles discrets (Android ; iOS Safari ne propose pas l'API de vibration).
 * Désactivés si l'utilisateur a demandé à réduire les animations.
 */
const PATTERNS = {
  /** Toucher léger : sélection, quantité */
  tick: 6,
  /** Confirmation : ajout à la sélection, favori */
  tap: 12,
  /** Moment fort : commande envoyée */
  success: [14, 60, 22],
} as const;

export type HapticKind = keyof typeof PATTERNS;

export const haptic = (kind: HapticKind = 'tap') => {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    navigator.vibrate?.(PATTERNS[kind] as number | number[]);
  } catch {
    // vibration indisponible
  }
};
