import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ToastItem, ToastOptions, ToastSeverity } from './types';

const DEFAULT_DURATION_MS = 5000;

interface ToastContextValue {
  toasts: ToastItem[];
  pushToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastSeq = 0;

function nextId(): string {
  toastSeq += 1;
  return `toast-${toastSeq}-${Date.now()}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((options: ToastOptions) => {
    const id = nextId();
    const severity: ToastSeverity = options.severity ?? 'info';
    const durationMs =
      options.durationMs === undefined ? DEFAULT_DURATION_MS : options.durationMs;

    setToasts((current) => [
      ...current,
      {
        id,
        message: options.message,
        severity,
        durationMs,
      },
    ]);

    return id;
  }, []);

  const value = useMemo(
    () => ({ toasts, pushToast, dismissToast }),
    [toasts, pushToast, dismissToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
