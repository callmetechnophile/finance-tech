"use client";

import { ReactNode } from "react";
import AppHeaderContainer from "./AppHeaderContainer";
import AppSidebarContainer from "./AppSidebarContainer";
import WorkspaceContainer from "./WorkspaceContainer";
import AIPanelContainer from "./AIPanelContainer";
import StatusBarContainer from "./StatusBarContainer";
import DrawerContainer from "./DrawerContainer";
import ModalContainer from "./ModalContainer";
import ToastContainer from "./ToastContainer";

interface AppShellProps {
  children?: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
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
      <DrawerContainer>
        <p className="text-[11px] text-[#cccccc]">Active details drawer. Content will plug-in during later milestones.</p>
      </DrawerContainer>
      
      <ModalContainer>
        <p className="text-[11px] text-[#cccccc]">Confirm action triggers will launch here.</p>
      </ModalContainer>
      
      <ToastContainer />
    </div>
  );
}
