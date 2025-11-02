"use client";

import { create } from "zustand";

export type ToastKind = "success" | "error";

interface ToastState {
  message: string | null;
  type: ToastKind | null;
  showToast: (msg: string, type: ToastKind) => void;
  clearToast: () => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  message: null,
  type: null,
  showToast: (msg, type) => set({ message: msg, type }),
  clearToast: () => set({ message: null, type: null }),
}));
