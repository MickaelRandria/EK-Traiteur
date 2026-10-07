import { Transition } from 'motion/react';

/** Courbes partagées : sorties douces et « éditoriales » */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];
export const EASE_DRAWER: [number, number, number, number] = [0.32, 0.72, 0, 1];

export const drawerTransition: Transition = { type: 'tween', ease: EASE_DRAWER, duration: 0.5 };
export const sheetSpring: Transition = { type: 'spring', damping: 32, stiffness: 320, mass: 0.9 };
export const fadeTransition: Transition = { duration: 0.3, ease: 'easeOut' };
