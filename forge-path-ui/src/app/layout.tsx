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
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorBackground: "#111111",
          colorPrimary: "#faff69",
          colorDanger: "#ef4444",
          borderRadius: "0.5rem",
          fontFamily: "var(--font-inter), sans-serif",
        },
        elements: {
          card: "bg-[#111111] border border-[#2a2a2a] shadow-2xl shadow-black/80",
          headerTitle: "text-white text-lg font-bold",
          headerSubtitle: "text-[#888888] text-xs",
          formButtonPrimary: "bg-[#faff69] text-black hover:bg-[#f0f560] font-bold",
          formFieldInput: "bg-[#1a1a1a] border-[#2a2a2a] text-white",
          footerActionLink: "text-[#faff69] font-bold hover:underline",
          socialButtonsBlockButton: "text-white border border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#222] transition-colors",
          socialButtonsBlockButtonText: "text-white font-bold",
          dividerText: "text-[#666666]",
          dividerLine: "bg-[#2a2a2a]",
          formFieldLabel: "text-[#888888] text-xs font-semibold uppercase tracking-wider",
          footerActionText: "text-[#666666] text-xs",
          identityPreviewText: "text-white font-medium",
          identityPreviewEditButton: "text-[#faff69] hover:underline",
          formFieldInputShowPasswordButton: "text-[#888888] hover:text-white",
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

