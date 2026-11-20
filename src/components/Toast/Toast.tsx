import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useLayer } from '../../utils/layers';
import { getPersistentRoot } from '../../utils/portalRoot';
import { IconButton } from '../IconButton/IconButton';
import './Toast.css';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Auto-dismiss delay in ms. `null` keeps the toast until dismissed. */
  duration?: number | null;
}

interface ToastRecord extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

export const DEFAULT_TOAST_DURATION = 5000;

const ToastContext = createContext<ToastContextValue | null>(null);

/** Returns `toast()` and `dismiss()`. Must be used inside `<ToastProvider>`. */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>.');
  return context;
};

interface ToastItemProps {
  record: ToastRecord;
  dismissLabel: string;
  onDismiss: (id: number) => void;
}

function ToastItem({ record, dismissLabel, onDismiss }: ToastItemProps) {
  const { id, title, description, tone = 'neutral', duration = DEFAULT_TOAST_DURATION } = record;
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration ?? 0);
  const startedAt = useRef(0);

  // Pause on hover or focus (WCAG 2.2.1): the remaining time resumes when the pointer leaves.
  useEffect(() => {
    if (duration === null || paused) return undefined;
    startedAt.current = Date.now();
    const timer = window.setTimeout(() => onDismiss(id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(remaining.current - (Date.now() - startedAt.current), 1000);
    };
  }, [duration, id, onDismiss, paused]);

  // While the pointer or focus is on a toast, Escape dismisses it (and not a dialog behind it).
  useLayer({ active: paused, onEscape: () => onDismiss(id) });

  return (
    // The wrapper only tracks hover and focus to pause the timer; the dismiss button is the control.
    <li
      className="nui-toast"
      data-tone={tone}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="nui-toast__content">
        <p className="nui-toast__title">{title}</p>
        {description ? <p className="nui-toast__description">{description}</p> : null}
      </div>
      <IconButton label={dismissLabel} icon="✕" size="sm" onClick={() => onDismiss(id)} />
    </li>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Accessible name of the notifications region. */
  label?: string;
  dismissLabel?: string;
}

/**
 * Hosts toasts in a polite live region (`role="status"`), so screen readers announce them
 * without stealing focus. The region is always mounted so announcements are not lost.
 */
export function ToastProvider({
  children,
  label = 'Notificações',
  dismissLabel = 'Dispensar notificação',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const nextId = useRef(0);

  // The region lives in a body-level container that stays outside a modal's `inert` subtree.
  useEffect(() => {
    setHost(getPersistentRoot());
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts((current) => [...current, { ...options, id }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {host
        ? createPortal(
            <div role="status" aria-live="polite" aria-label={label} className="nui-toast-region">
              <ol className="nui-toast-list">
                {toasts.map((record) => (
                  <ToastItem
                    key={record.id}
                    record={record}
                    dismissLabel={dismissLabel}
                    onDismiss={dismiss}
                  />
                ))}
              </ol>
            </div>,
            host,
          )
        : null}
    </ToastContext.Provider>
  );
}
