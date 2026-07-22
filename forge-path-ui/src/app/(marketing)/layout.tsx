import { ReactNode } from "react";
import Navbar from "@/components/marketing/Navbar/Navbar";
import Footer from "@/components/marketing/Footer/Footer";

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-white selection:bg-[#fcd535] selection:text-black overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
}
