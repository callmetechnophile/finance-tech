"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center">
      <AuthenticateWithRedirectCallback
        signUpForceRedirectUrl="/dashboard"
        signInForceRedirectUrl="/dashboard"
      />
    </div>
  );
}
