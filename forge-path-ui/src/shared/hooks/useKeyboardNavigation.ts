"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useKeyboardNavigation() {
  const router = useRouter();

  useEffect(() => {
    let lastKey = "";
    let lastTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if typing inside input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const now = Date.now();
      
      // Ctrl + K triggers search focus (global hook placeholder)
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        console.log("Search command shortcut triggered");
        return;
      }

      // Detect two-key shortcuts: 'g' then <key>
      if (lastKey === "g" && now - lastTime < 1000) {
        const key = e.key.toLowerCase();
        let path = "";
        
        switch (key) {
          case "d":
            path = "/dashboard";
            break;
          case "o":
            path = "/documents";
            break;
          case "f":
            path = "/forecast";
            break;
          case "l":
            path = "/liquidity";
            break;
          case "c":
            path = "/collections";
            break;
          case "t":
            path = "/treasury";
            break;
          case "p":
            path = "/copilot";
            break;
          case "r":
            path = "/reports";
            break;
        }

        if (path) {
          e.preventDefault();
          router.push(path);
        }
        
        lastKey = "";
        lastTime = 0;
        return;
      }

      if (e.key.toLowerCase() === "g") {
        lastKey = "g";
        lastTime = now;
      } else {
        lastKey = "";
        lastTime = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);
}
