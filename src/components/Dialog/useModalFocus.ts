import { useEffect, type RefObject } from 'react';
import { getFocusableElements } from '../../utils/focusable';

/** Marks every sibling of `container` (direct children of body) as `inert`; returns the undo. */
const makeSiblingsInert = (container: HTMLElement): (() => void) => {
  const siblings = Array.from(document.body.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element !== container && !element.hasAttribute('inert'),
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
 * Modal focus management: moves focus in on open, traps Tab, closes on Escape,
 * makes the rest of the page `inert` and restores focus to the trigger on close.
 */
export const useModalFocus = ({
  open,
  portal,
  dialogRef,
  initialFocusRef,
  onEscape,
}: ModalFocusOptions): void => {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !portal || !dialog) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const restoreSiblings = makeSiblingsInert(portal);
    const target = initialFocusRef?.current ?? getFocusableElements(dialog)[0] ?? dialog;
    target.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onEscape();
        return;
      }
      trapTabKey(event, dialog);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      restoreSiblings();
      previouslyFocused?.focus();
    };
  }, [open, portal, dialogRef, initialFocusRef, onEscape]);
};
