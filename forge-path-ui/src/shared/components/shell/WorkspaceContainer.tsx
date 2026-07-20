"use client";

import { ReactNode } from "react";

interface WorkspaceContainerProps {
  children?: ReactNode;
}

export default function WorkspaceContainer({ children }: WorkspaceContainerProps) {
  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#0a0a0a] relative">
      {children}
    </main>
  );
}
