import { useNavigationStore } from "@/shared/stores/navigation.store";
export default function useNavigation() {
  const store = useNavigationStore();
  return {
    pinnedWorkspaces: store.pinnedWorkspaces,
    favorites: store.favorites,
    history: store.history,
    navigationItems: store.navigationItems,
    addPinned: store.addPinned,
    removePinned: store.removePinned,
    addFavorite: store.addFavorite,
    removeFavorite: store.removeFavorite,
    pushHistory: store.pushHistory,
  };
}
