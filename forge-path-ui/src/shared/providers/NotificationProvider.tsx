"use client";

import { ReactNode } from "react";
import ToastContainer from "@/shared/components/shell/ToastContainer";

interface NotificationProviderProps {
  children: ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
