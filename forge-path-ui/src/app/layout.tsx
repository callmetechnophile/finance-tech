import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "FORGE-PATH | AI Financial Operating System",
    template: "%s | FORGE-PATH",
  },
  description: "AI Financial Operating System for Manufacturing SMEs — Cash Flow, Liquidity, Collections, Payments Intelligence powered by Gemma 4 & NVIDIA NIM.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#0a0a0a] text-[#cccccc]">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#ffffff",
              borderRadius: "8px",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
