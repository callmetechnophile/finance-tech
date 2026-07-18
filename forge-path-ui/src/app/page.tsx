"use client";

import { useEffect } from "react";

export default function RootIndexPage() {
  useEffect(() => {
    // Standard redirection to dashboard
    window.location.href = "/dashboard";
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#faff69]/30 border-t-[#faff69] rounded-full animate-spin" />
    </div>
  );
}
