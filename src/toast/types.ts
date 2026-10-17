export type ToastSeverity = 'success' | 'info' | 'warning' | 'error';

export interface ToastOptions {
  message: string;
  severity?: ToastSeverity;
  /** Auto-dismiss delay in ms. Pass `0` to keep until closed. Default 5000. */
  durationMs?: number;
}

export interface ToastItem {
  id: string;
  message: string;
  severity: ToastSeverity;
  durationMs: number;
}
