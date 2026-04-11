import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  owner: { id: string; email: string } | null;
  setTokens: (access: string, refresh: string) => void;
  setOwner: (owner: { id: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      owner: null,
      setTokens: (access, refresh) => {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        set({ accessToken: access, refreshToken: refresh });
      },
      setOwner: (owner) => set({ owner }),
      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({ accessToken: null, refreshToken: null, owner: null });
      },
    }),
    { name: "corbel-auth", partialize: (s) => ({ owner: s.owner }) },
  ),
);
