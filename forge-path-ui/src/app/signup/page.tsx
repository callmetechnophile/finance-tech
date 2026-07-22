"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#0b0e11] flex items-center justify-center px-4">
      <SignUp />
    </main>
  );
}
