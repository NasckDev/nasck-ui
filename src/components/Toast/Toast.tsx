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

  useEffect(() => {
    if (duration === null) return undefined;
    const timer = window.setTimeout(() => onDismiss(id), duration);
    return () => window.clearTimeout(timer);
  }, [duration, id, onDismiss]);

  return (
    <li className="nui-toast" data-tone={tone}>
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
  const nextId = useRef(0);

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
      </div>
    </ToastContext.Provider>
  );
}
