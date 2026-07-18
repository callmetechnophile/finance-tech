"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavigationStore } from "@/shared/stores/navigation.store";

interface NavigationProviderProps {
  children: ReactNode;
}

export default function NavigationProvider({ children }: NavigationProviderProps) {
  const pathname = usePathname();
  const { pushHistory } = useNavigationStore();

  useEffect(() => {
    if (pathname) {
      pushHistory(pathname);
    }
  }, [pathname, pushHistory]);

  return <>{children}</>;
}
