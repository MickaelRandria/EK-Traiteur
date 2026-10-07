import { useEffect, type RefObject } from 'react';

/** Garde le clavier dans le panneau actif et restaure le bouton d'ouverture. */
export function useDialogFocus(open: boolean, ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const selector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';
    const frame = requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true }));
    const onKeyDown = (event: KeyboardEvent) => {
      const dialog: HTMLDivElement | null = ref.current;
      if (event.key !== 'Tab' || !dialog || !dialog.contains(document.activeElement)) return;
      const targets = Array.from(dialog.querySelectorAll<HTMLElement>(selector)).filter(element => element.getClientRects().length > 0);
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open, ref]);
}
