import { useWorkspaceStore } from "@/shared/stores/workspace.store";
export default function useWorkspace() {
  const store = useWorkspaceStore();
  return {
    density: store.density,
    setDensity: store.setDensity,
  };
}
