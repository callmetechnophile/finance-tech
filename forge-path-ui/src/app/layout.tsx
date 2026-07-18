import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "FORGE-PATH | AI Financial Copilot",
    template: "%s | FORGE-PATH",
  },
  description: "AI Financial Copilot for Manufacturing SMEs — Cash Flow, Liquidity, Collections, Payments Intelligence powered by Gemma 4 & NVIDIA NIM.",
  keywords: ["financial copilot", "manufacturing SME", "cash flow", "invoice collections", "AI finance"],
  authors: [{ name: "FORGE-PATH" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1220",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111827",
              border: "1px solid #1f2d44",
              color: "#F9FAFB",
              borderRadius: "12px",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
