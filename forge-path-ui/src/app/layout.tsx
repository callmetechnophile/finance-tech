import "@/app/globals.css";
import RootProvider from "@/shared/providers/RootProvider";
import AppShell from "@/shared/components/shell/AppShell";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FORGE-PATH | AI Financial Operating System",
  description: "Enterprise Financial Ingestion, Forecasting, and Solvency Workspace.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="antialiased min-h-screen bg-[#0a0a0a] text-white">
        <RootProvider>
          <AppShell>
            {children}
          </AppShell>
        </RootProvider>
      </body>
    </html>
  );
}
