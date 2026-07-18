import { usePathname } from "next/navigation";

export default function useWorkspaceStatus() {
  const pathname = usePathname();
  return {
    currentWorkspaceName: pathname === "/" ? "Dashboard" : pathname.replace(/\//g, "").toUpperCase(),
    isLocked: false,
    unsavedChanges: false,
    isReadOnly: false,
  };
}
