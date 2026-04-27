import { create } from "zustand";
import type { AppUser } from "@/lib/types";

type AuthStatus = "idle" | "loading" | "ready" | "error";

type AuthState = {
  status: AuthStatus;
  isBootstrapped: boolean;
  user: AppUser | null;
  error: string | null;

  setLoading: () => void;
  setUser: (user: AppUser | null) => void;
  setError: (message: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: "idle",
  isBootstrapped: false,
  user: null,
  error: null,

  setLoading: () => set({ status: "loading", error: null }),
  setUser: (user) =>
    set({ user, status: "ready", error: null, isBootstrapped: true }),
  setError: (message) =>
    set({ error: message, status: "error", isBootstrapped: true }),
  clearAuth: () =>
    set({ user: null, status: "ready", error: null, isBootstrapped: true }),
}));
