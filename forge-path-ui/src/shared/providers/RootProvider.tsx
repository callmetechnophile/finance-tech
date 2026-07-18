"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import MotionProvider from "./MotionProvider";
import ThemeProvider from "./ThemeProvider";

interface RootProviderProps {
  children: ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
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
