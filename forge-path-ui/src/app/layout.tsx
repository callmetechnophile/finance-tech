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
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_dHJ1c3R5LWJhZGdlci02MC5jbGVyay5hY2NvdW50cy5kZXYk"}
      appearance={{
        variables: {
          colorBackground: "transparent",
          colorPrimary: "#F7F15A",
          colorDanger: "#FF8080",
          borderRadius: "14px",
          fontFamily: "var(--font-inter), sans-serif",
        },
        elements: {
          card: "bg-transparent border-none shadow-none p-0 w-full max-w-full",
          cardBox: "bg-transparent border-none shadow-none p-0 w-full max-w-full",
          main: "bg-transparent w-full",
          rootBox: "w-full bg-transparent border-none shadow-none",
          developmentBadge: "bg-[#F7F15A]/12 border border-[#F7F15A] text-[#F7F15A] rounded-full px-[14px] py-[6px] text-[10px] font-bold uppercase tracking-wider no-underline",
          developmentBadgeLink: "bg-[#F7F15A]/12 border border-[#F7F15A] text-[#F7F15A] rounded-full px-[14px] py-[6px] text-[10px] font-bold uppercase tracking-wider no-underline",
          badge: "bg-[#F7F15A]/12 border border-[#F7F15A] text-[#F7F15A] rounded-full px-[14px] py-[6px] text-[10px] font-bold uppercase tracking-wider no-underline",
        },
      }}
    >
      <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
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

