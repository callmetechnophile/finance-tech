import { create } from "zustand";

export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}

interface NavigationState {
  pinnedWorkspaces: string[];
  favorites: string[];
  history: string[];
  navigationItems: NavigationItem[];
  addPinned: (path: string) => void;
  removePinned: (path: string) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  pushHistory: (path: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  pinnedWorkspaces: ["/dashboard", "/collections"],
  favorites: [],
  history: [],
  navigationItems: [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Documents", path: "/documents", icon: "FileText" },
    { label: "Cash Flow", path: "/forecast", icon: "TrendingUp" },
    { label: "Liquidity", path: "/liquidity", icon: "Shield" },
    { label: "Collections", path: "/collections", icon: "Inbox" },
    { label: "Treasury", path: "/treasury", icon: "DollarSign" },
    { label: "Copilot", path: "/copilot", icon: "Bot" },
    { label: "Reports", path: "/reports", icon: "BarChart" },
    { label: "Analytics", path: "/analytics", icon: "Activity" },
    { label: "Admin Console", path: "/admin", icon: "Sliders" },
    { label: "Settings", path: "/settings", icon: "Settings" },
  ],
  addPinned: (p) => set((s) => ({ pinnedWorkspaces: s.pinnedWorkspaces.includes(p) ? s.pinnedWorkspaces : [...s.pinnedWorkspaces, p] })),
  removePinned: (p) => set((s) => ({ pinnedWorkspaces: s.pinnedWorkspaces.filter((x) => x !== p) })),
  addFavorite: (f) => set((s) => ({ favorites: s.favorites.includes(f) ? s.favorites : [...s.favorites, f] })),
  removeFavorite: (f) => set((s) => ({ favorites: s.favorites.filter((x) => x !== f) })),
  pushHistory: (p) => set((s) => ({ history: [p, ...s.history.filter((x) => x !== p)].slice(0, 10) })),
}));
