"use client";

import React, { useEffect, useState } from "react";
import { create } from "zustand";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration || 5000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  
  return {
    success: (message: string, duration?: number) => addToast({ type: "success", message, duration }),
    error: (message: string, duration?: number) => addToast({ type: "error", message, duration }),
    info: (message: string, duration?: number) => addToast({ type: "info", message, duration }),
    warning: (message: string, duration?: number) => addToast({ type: "warning", message, duration }),
  };
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = toast.duration || 5000;
    const interval = 50;
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement;
        return next <= 0 ? 0 : next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [toast.duration]);

  const colors = {
    success: "from-emerald-500/20 to-green-500/20 border-emerald-500/50",
    error: "from-rose-500/20 to-red-500/20 border-rose-500/50",
    info: "from-cyan-500/20 to-blue-500/20 border-cyan-500/50",
    warning: "from-amber-500/20 to-yellow-500/20 border-amber-500/50",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  const textColors = {
    success: "text-emerald-300",
    error: "text-rose-300",
    info: "text-cyan-300",
    warning: "text-amber-300",
  };

  const progressColors = {
    success: "bg-emerald-500",
    error: "bg-rose-500",
    info: "bg-cyan-500",
    warning: "bg-amber-500",
  };

  return (
    <div className={`bg-gradient-to-r ${colors[toast.type]} border backdrop-blur-xl rounded-xl p-4 shadow-lg shadow-black/30 animate-slide-in-right min-w-[300px] relative overflow-hidden`}>
      <div className="flex items-start gap-3">
        <div className={`text-2xl ${textColors[toast.type]}`}>{icons[toast.type]}</div>
        <div className="flex-1">
          <p className={`font-semibold ${textColors[toast.type]} text-sm`}>
            {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
          </p>
          <p className="text-sm text-slate-200/90 mt-1">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition ml-2"
        >
          ✕
        </button>
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
        <div 
          className={`h-full transition-all duration-50 ${progressColors[toast.type]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}