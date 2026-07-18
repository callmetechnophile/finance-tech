"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import MotionProvider from "./MotionProvider";
import ThemeProvider from "./ThemeProvider";
import useKeyboardNavigation from "@/shared/hooks/useKeyboardNavigation";

interface RootProviderProps {
  children: ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  // Bind global keyboard navigation events
  useKeyboardNavigation();

  return (
    <QueryProvider>
      <MotionProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </MotionProvider>
    </QueryProvider>
  );
}
