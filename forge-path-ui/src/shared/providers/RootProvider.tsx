"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import MotionProvider from "./MotionProvider";
import ThemeProvider from "./ThemeProvider";
import AppProvider from "./AppProvider";
import WorkspaceProvider from "./WorkspaceProvider";
import NavigationProvider from "./NavigationProvider";
import NotificationProvider from "./NotificationProvider";
import CommandPaletteProvider from "./CommandPaletteProvider";
import useKeyboardNavigation from "@/shared/hooks/useKeyboardNavigation";

interface RootProviderProps {
  children: ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  // Bind global keyboard shortcuts hook
  useKeyboardNavigation();

  return (
    <QueryProvider>
      <MotionProvider>
        <ThemeProvider>
          <AppProvider>
            <WorkspaceProvider>
              <NavigationProvider>
                <NotificationProvider>
                  <CommandPaletteProvider>
                    {children}
                  </CommandPaletteProvider>
                </NotificationProvider>
              </NavigationProvider>
            </WorkspaceProvider>
          </AppProvider>
        </ThemeProvider>
      </MotionProvider>
    </QueryProvider>
  );
}
