import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from './ToastContext';
import type { ToastItem, ToastSeverity } from './types';

const SEVERITY_LABEL: Record<ToastSeverity, string> = {
  success: 'Success',
  info: 'Info',
  warning: 'Warning',
  error: 'Error',
};

function SeverityIcon({ severity }: { severity: ToastSeverity }) {
  switch (severity) {
    case 'success':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="toast__icon-svg">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.7-4.7 1.4 1.4-6.1 6.1Z"
          />
        </svg>
      );
    case 'warning':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="toast__icon-svg">
          <path
            fill="currentColor"
            d="M1.5 20.5h21L12 2.5 1.5 20.5Zm11-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z"
          />
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="toast__icon-svg">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 .01 20.01A10 10 0 0 0 12 2Zm3.5 13.1-1.4 1.4L12 13.4l-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1 1.4-1.4L12 10.6l2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1Z"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="toast__icon-svg">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 .01 20.01A10 10 0 0 0 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z"
          />
        </svg>
      );
  }
}

function ToastCard({
  toast,
  closeLabel,
  onDismiss,
}: {
  toast: ToastItem;
  closeLabel: string;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    if (toast.durationMs <= 0) return;
    const timer = window.setTimeout(() => onDismiss(toast.id), toast.durationMs);
    return () => window.clearTimeout(timer);
  }, [toast.durationMs, toast.id, onDismiss]);

  return (
    <div
      className={`toast toast--${toast.severity}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="toast__icon" aria-hidden="true">
        <SeverityIcon severity={toast.severity} />
      </span>
      <div className="toast__body">
        <span className="visually-hidden">{SEVERITY_LABEL[toast.severity]}: </span>
        <p className="toast__message">{toast.message}</p>
      </div>
      <button
        type="button"
        className="toast__close"
        aria-label={closeLabel}
        onClick={() => onDismiss(toast.id)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="toast__close-svg">
          <path
            fill="currentColor"
            d="M18.3 5.7 13.4 10.6l4.9 4.9-1.4 1.4-4.9-4.9-4.9 4.9-1.4-1.4 4.9-4.9-4.9-4.9 1.4-1.4 4.9 4.9 4.9-4.9z"
          />
        </svg>
      </button>
    </div>
  );
}

export function ToastViewport({ closeLabel }: { closeLabel: string }) {
  const { toasts, dismissToast } = useToast();

  if (typeof document === 'undefined' || toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="toast-viewport" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          closeLabel={closeLabel}
          onDismiss={dismissToast}
        />
      ))}
    </div>,
    document.body,
  );
}
