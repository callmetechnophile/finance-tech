"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0b0e11] flex items-center justify-center px-4">
      <SignIn />
    </main>
  );
}
