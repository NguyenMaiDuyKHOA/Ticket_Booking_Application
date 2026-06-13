"use client";

import { CheckCircle2, X, XCircle } from "lucide-react";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Date.now();

      setToasts((currentToasts) => [...currentToasts, { ...toast, id }]);
      window.setTimeout(() => removeToast(id), 3500);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed right-4 top-4 z-[100] grid w-[calc(100vw-2rem)] max-w-sm gap-3"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}

function ToastItem({ onClose, toast }: { onClose: () => void; toast: Toast }) {
  const isSuccess = toast.type === "success";
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-md border bg-white p-4 shadow-lg ${
        isSuccess ? "border-emerald-200" : "border-red-200"
      }`}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${isSuccess ? "text-emerald-600" : "text-red-600"}`}
        aria-hidden="true"
      />
      <p className="min-w-0 flex-1 text-sm font-semibold leading-6 text-neutral-800">
        {toast.message}
      </p>
      <button
        type="button"
        aria-label="Close notification"
        onClick={onClose}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
