"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";

const LoginPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#0b0e11] flex items-center justify-center px-4">
      <SignIn />
    </main>
  );
};

export default LoginPage;
