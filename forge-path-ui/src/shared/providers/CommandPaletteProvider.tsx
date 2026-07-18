"use client";

import { ReactNode, useEffect } from "react";
import { useCommandStore } from "@/shared/stores/command.store";

interface CommandPaletteProviderProps {
  children: ReactNode;
}

export default function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  const { setPaletteOpen } = useCommandStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setPaletteOpen]);

  return <>{children}</>;
}
