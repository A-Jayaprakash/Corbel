import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "owner" | "admin" | "tenant";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: Role | null;
  owner: { id: string; email: string } | null;
  setAuth: (access: string, refresh: string, role: Role) => void;
  setOwner: (owner: { id: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      owner: null,
      setAuth: (access, refresh, role) => {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        set({ accessToken: access, refreshToken: refresh, role });
      },
      setOwner: (owner) => set({ owner }),
      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({ accessToken: null, refreshToken: null, role: null, owner: null });
      },
    }),
    { name: "corbel-auth", partialize: (s) => ({ owner: s.owner, role: s.role }) },
  ),
);
