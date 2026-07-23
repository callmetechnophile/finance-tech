import "@/app/globals.css";
import RootProvider from "@/shared/providers/RootProvider";
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
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#0a0a0a] text-white">
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_dHJ1c3R5LWJhZGdlci02MC5jbGVyay5hY2NvdW50cy5kZXYk"}
          appearance={{
            variables: {
              colorBackground: "#181A20",
              colorPrimary: "#FCD535",
              colorDanger: "#FF8080",
              borderRadius: "16px",
              fontFamily: "var(--font-inter), sans-serif",
            },
            elements: {
              card: {
                backgroundColor: "#181A20",
                border: "1px solid #2B3139",
                borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
                opacity: "1",
                backdropFilter: "none",
              },
              cardBox: {
                backgroundColor: "#181A20",
                border: "1px solid #2B3139",
                borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
                opacity: "1",
                backdropFilter: "none",
              },
              rootBox: {
                opacity: "1",
              },
              main: {
                backgroundColor: "transparent",
              },
              modalBackdrop: {
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "none",
              },
              userButtonPopoverCard: {
                backgroundColor: "#181A20",
                border: "1px solid #2B3139",
                borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
                opacity: "1",
                backdropFilter: "none",
              },
              userButtonPopoverContainer: {
                backgroundColor: "#181A20",
                opacity: "1",
                backdropFilter: "none",
              },
              userButtonPopoverFooter: {
                backgroundColor: "#111216",
                borderTop: "1px solid #2B3139",
                opacity: "1",
              },
              userProfileKeepCard: {
                backgroundColor: "#181A20",
                border: "1px solid #2B3139",
                borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
                opacity: "1",
                backdropFilter: "none",
              },
              navbar: {
                borderRight: "1px solid #2B3139",
              },
              developmentBadge: "bg-[#FCD535]/12 border border-[#FCD535] text-[#FCD535] rounded-full px-[14px] py-[6px] text-[10px] font-bold uppercase tracking-wider no-underline",
              developmentBadgeLink: "bg-[#FCD535]/12 border border-[#FCD535] text-[#FCD535] rounded-full px-[14px] py-[6px] text-[10px] font-bold uppercase tracking-wider no-underline",
              badge: "bg-[#FCD535]/12 border border-[#FCD535] text-[#FCD535] rounded-full px-[14px] py-[6px] text-[10px] font-bold uppercase tracking-wider no-underline",
            },
          }}
        >
          <RootProvider>
            {children}
          </RootProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
