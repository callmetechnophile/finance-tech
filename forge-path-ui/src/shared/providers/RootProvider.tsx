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
import { useClerkSession } from "@/shared/hooks/useClerkSession";
import { useClerkDevHider } from "@/shared/hooks/useClerkDevHider";

interface RootProviderProps {
  children: ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  // Bind global keyboard shortcuts hook
  useKeyboardNavigation();

  // Sync Clerk session to Zustand session store
  useClerkSession();

  // Active external hider layer for Clerk development mode prefilled OTP & badges
  useClerkDevHider();

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
