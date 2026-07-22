import { ReactNode } from "react";
import AppShell from "@/shared/components/shell/AppShell";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
