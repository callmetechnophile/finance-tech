"use client";

import { ReactNode, useEffect } from "react";
import { useApplicationStore } from "@/shared/stores/application.store";

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  const { setReady } = useApplicationStore();

  useEffect(() => {
    setReady(true);
  }, [setReady]);

  return <>{children}</>;
}
