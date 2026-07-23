"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sign-up");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#fcd535]/30 border-t-[#fcd535] rounded-full animate-spin" />
    </div>
  );
}
