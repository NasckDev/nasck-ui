import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';
import { IconButton } from '../IconButton/IconButton';
import { useModalFocus } from './useModalFocus';
import './Dialog.css';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Actions area, usually Buttons. */
  footer?: ReactNode;
  /** Element focused on open. Defaults to the first focusable element. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Use `alertdialog` for destructive confirmations that need an explicit answer. */
  role?: 'dialog' | 'alertdialog';
  className?: string;
}

/** Creates the portal container on mount so siblings can be made `inert` while open. */
const usePortalContainer = (open: boolean): HTMLElement | null => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return undefined;
    const element = document.createElement('div');
    element.className = 'nui-portal';
    document.body.appendChild(element);
    setContainer(element);
    return () => {
      element.remove();
      setContainer(null);
    };
  }, [open]);
  return container;
};

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
  </svg>
);

/**
 * Modal dialog: `aria-modal`, labelled by its title, focus trapped inside,
 * Escape or overlay click closes, background is `inert` and focus returns to the trigger.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  initialFocusRef,
  closeLabel = 'Fechar',
  role = 'dialog',
  className,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const portal = usePortalContainer(open);
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useModalFocus({ open, portal, dialogRef, initialFocusRef, onEscape: close });

  if (!open || !portal) return null;

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return createPortal(
    // Pointer-only convenience: keyboard users close with Escape or the close button.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="nui-dialog__overlay" onMouseDown={handleOverlayMouseDown}>
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cx('nui-dialog', className)}
      >
        <header className="nui-dialog__header">
          <h2 id={titleId} className="nui-dialog__title">
            {title}
          </h2>
          <IconButton label={closeLabel} icon={<CloseIcon />} size="sm" onClick={close} />
        </header>
        {description ? (
          <p id={descriptionId} className="nui-dialog__description">
            {description}
          </p>
        ) : null}
        {children ? <div className="nui-dialog__body">{children}</div> : null}
        {footer ? <footer className="nui-dialog__footer">{footer}</footer> : null}
      </div>
    </div>,
    portal,
  );
}
