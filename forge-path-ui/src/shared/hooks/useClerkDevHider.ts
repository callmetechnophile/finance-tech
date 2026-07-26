"use client";

import { useEffect } from "react";

export function useClerkDevHider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const clearPrefilledOtp = () => {
      // Query any OTP verification inputs rendered by Clerk
      const otpInputs = document.querySelectorAll<HTMLInputElement>(
        'input[autocomplete="one-time-code"], .cl-otpInputBox input, input[name*="code"]'
      );

      otpInputs.forEach((input) => {
        // If Clerk has auto-filled a test code and the user has not manually focused it
        if (input.value && !input.dataset.userTyped && document.activeElement !== input) {
          input.value = "";
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }

        // Mark input when user actually types
        if (!input.dataset.listenerAttached) {
          input.dataset.listenerAttached = "true";
          input.addEventListener("keydown", () => {
            input.dataset.userTyped = "true";
          });
        }
      });
    };

    // Run initial clear
    clearPrefilledOtp();

    // Observe DOM mutations to catch Clerk step transitions
    const observer = new MutationObserver(() => {
      clearPrefilledOtp();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);
}
