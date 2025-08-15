"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
  isExiting?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  success: (message: string) => void;
  error: (message: string) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  isExiting?: boolean;
}

function ToastComponent({
  message,
  type,
  onClose,
  isExiting,
  index,
}: ToastProps & { index: number }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  const icon = type === "success" ? "✓" : "✕";
  const topPosition = 24 + index * 80; // Stagger toasts vertically

  return (
    <div
      className={`fixed right-6 z-[9999] ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px] transform transition-all duration-300 ease-out ${
        isExiting ? "animate-slide-out" : "animate-slide-in"
      }`}
      style={{ top: `${topPosition}px` }}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 text-lg font-bold ml-2 transition-all duration-200 hover:scale-110 active:scale-95"
      >
        ×
      </button>
    </div>
  );
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isExiting: true } : toast
      )
    );

    // Remove from DOM after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  };

  const success = (message: string) => addToast(message, "success");
  const error = (message: string) => addToast(message, "error");

  return (
    <ToastContext.Provider value={{ toasts, success, error, removeToast }}>
      {children}
      {toasts.map((toast, index) => (
        <ToastComponent
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          isExiting={toast.isExiting}
          index={index}
        />
      ))}
    </ToastContext.Provider>
  );
}
