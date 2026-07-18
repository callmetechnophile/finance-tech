"use client";

import { ReactNode } from "react";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";

interface WorkspaceProviderProps {
  children: ReactNode;
}

export default function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const { density } = useWorkspaceStore();

  return (
    <div className={density === "compact" ? "text-compact" : "text-loose"}>
      {children}
    </div>
  );
}
