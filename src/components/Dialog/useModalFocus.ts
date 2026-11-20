import { useEffect, useRef, type RefObject } from 'react';
import { getFocusableElements } from '../../utils/focusable';
import { useLayer } from '../../utils/layers';
import { PERSISTENT_ATTRIBUTE } from '../../utils/portalRoot';
import { lockScroll } from '../../utils/scrollLock';

/** Marks every sibling of `container` (direct children of body) as `inert`; returns the undo. */
const makeSiblingsInert = (container: HTMLElement): (() => void) => {
  const siblings = Array.from(document.body.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement &&
      element !== container &&
      !element.hasAttribute('inert') &&
      !element.hasAttribute(PERSISTENT_ATTRIBUTE),
  );
  siblings.forEach((element) => element.setAttribute('inert', ''));
  return () => siblings.forEach((element) => element.removeAttribute('inert'));
};

/** Keeps Tab / Shift+Tab cycling inside the dialog. */
export const trapTabKey = (event: KeyboardEvent, dialog: HTMLElement): void => {
  if (event.key !== 'Tab') return;
  const focusable = getFocusableElements(dialog);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) {
    event.preventDefault();
    dialog.focus();
    return;
  }
  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === dialog)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};

interface ModalFocusOptions {
  open: boolean;
  portal: HTMLElement | null;
  dialogRef: RefObject<HTMLElement | null>;
  initialFocusRef: RefObject<HTMLElement | null> | undefined;
  onEscape: () => void;
}

/**
 * Modal focus management: moves focus in once on open, traps Tab, closes on Escape (only when it is
 * the top layer), makes the rest of the page `inert`, locks background scroll and restores focus to
 * the trigger on close. Callbacks are read through refs, so inline handlers never re-run the effect.
 */
export const useModalFocus = ({
  open,
  portal,
  dialogRef,
  initialFocusRef,
  onEscape,
}: ModalFocusOptions): void => {
  const initialFocusRefLatest = useRef(initialFocusRef);
  useEffect(() => {
    initialFocusRefLatest.current = initialFocusRef;
  });

  const layer = useLayer({ active: open && portal !== null, onEscape });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !portal || !dialog) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const restoreSiblings = makeSiblingsInert(portal);
    const unlockScroll = lockScroll();
    const target =
      initialFocusRefLatest.current?.current ?? getFocusableElements(dialog)[0] ?? dialog;
    target.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (layer.isTop()) trapTabKey(event, dialog);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unlockScroll();
      restoreSiblings();
      previouslyFocused?.focus();
    };
  }, [open, portal, dialogRef, layer]);
};
