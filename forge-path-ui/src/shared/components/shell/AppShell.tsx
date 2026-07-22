"use client";

import { ReactNode } from "react";
import AppHeaderContainer from "./AppHeaderContainer";
import AppSidebarContainer from "./AppSidebarContainer";
import WorkspaceContainer from "./WorkspaceContainer";
import AIPanelContainer from "./AIPanelContainer";
import StatusBarContainer from "./StatusBarContainer";
import DrawerManager from "@/features/drawer/components/DrawerManager";
import ModalContainer from "./ModalContainer";
import ToastContainer from "./ToastContainer";
import CommandPaletteOverlay from "@/features/command-palette/CommandPaletteOverlay";
import NotificationCenterDrawer from "@/features/notifications/components/NotificationCenterDrawer";

import { usePathname } from "next/navigation";

interface AppShellProps {
  children?: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // Check if current route is a public route
  const isPublicRoute =
    pathname === "/" ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/sign-up") ||
    pathname?.startsWith("/features") ||
    pathname?.startsWith("/architecture") ||
    pathname?.startsWith("/technology") ||
    pathname?.startsWith("/docs") ||
    pathname?.startsWith("/about") ||
    pathname?.startsWith("/contact");

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0a0a0a]">
      {/* Top Header */}
      <AppHeaderContainer />

      {/* Main Layout Grid */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Sidebar Left */}
        <AppSidebarContainer />

        {/* Dynamic Workspace Center */}
        <WorkspaceContainer>
          {children}
        </WorkspaceContainer>

        {/* AI Assistant Right */}
        <AIPanelContainer />
      </div>

      {/* Bottom Status bar */}
      <StatusBarContainer />

      {/* Global Overlay Layers */}
      <DrawerManager />
      
      <ModalContainer>
        <p className="text-[11px] text-[#cccccc]">Confirm action triggers will launch here.</p>
      </ModalContainer>
      
      <ToastContainer />

      {/* Universal Command Palette & Search Overlay */}
      <CommandPaletteOverlay />

      {/* Enterprise Notification Center & Activity Feed Drawer */}
      <NotificationCenterDrawer />
    </div>
  );
}
