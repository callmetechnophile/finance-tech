import "@/app/globals.css";
import RootProvider from "@/shared/providers/RootProvider";
import AppShell from "@/shared/components/shell/AppShell";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

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
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: "#0f0f0f",
          colorPrimary: "#faff69",
          colorDanger: "#ef4444",
          borderRadius: "0.5rem",
          fontFamily: "var(--font-inter), sans-serif",
        },
        elements: {
          card: "bg-[#111111] border border-[#2a2a2a] shadow-2xl shadow-black/80",
          headerTitle: "text-white",
          headerSubtitle: "text-[#888888]",
          formButtonPrimary: "bg-[#faff69] text-black hover:bg-[#f0f560] font-bold",
          formFieldInput: "bg-[#1a1a1a] border-[#2a2a2a] text-white",
          footerActionLink: "text-[#faff69]",
        },
      }}
    >
      <html lang="en" className={`${inter.variable} dark`}>
        <body className="antialiased min-h-screen bg-[#0a0a0a] text-white">
          <RootProvider>
            <AppShell>
              {children}
            </AppShell>
          </RootProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

