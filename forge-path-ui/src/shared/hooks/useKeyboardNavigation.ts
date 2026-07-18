"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDrawerStore } from "@/shared/stores/drawer.store";
import { useNotificationStore } from "@/shared/stores/notification.store";

export default function useKeyboardNavigation() {
  const router = useRouter();
  const { stack, popDrawer, pushDrawer, closeAll } = useDrawerStore();
  const { isCenterOpen, setCenterOpen } = useNotificationStore();

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
        // Esc key should work even inside inputs to close overlays/drawers
        if (e.key === "Escape") {
          e.preventDefault();
          popDrawer();
        }
        return;
      }

      const now = Date.now();

      // Drawer Actions
      // 1. Esc closes top drawer
      if (e.key === "Escape") {
        e.preventDefault();
        popDrawer();
        return;
      }

      // 2. Ctrl + W closes top drawer
      if (e.ctrlKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        popDrawer();
        return;
      }

      // 3. Alt + Left pops top drawer (back navigation)
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        popDrawer();
        return;
      }

      // 4. Ctrl + Shift + D toggles drawer state (opens a sample context if empty, or closes all)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (stack.length > 0) {
          closeAll();
        } else {
          pushDrawer({ id: "demo-drawer", title: "CFO Intelligence Inspector", subtitle: "Hotkey verification trigger." });
        }
        return;
      }

      // 5. Ctrl + Shift + N toggles notification center drawer
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setCenterOpen(!isCenterOpen);
        return;
      }

      // 6. Ctrl + Shift + S opens the DB / Status Health drawer
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        pushDrawer({
          id: "status-panel",
          title: "System Telemetry & Health",
          subtitle: "NeonDB connection • OCR engine • AI panel • API Gateway",
          mode: "normal",
          activeTab: "overview",
        });
        return;
      }
      
      // Ctrl + K triggers search focus (handled by CommandPaletteProvider)
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
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
  }, [router, stack, popDrawer, pushDrawer, closeAll, isCenterOpen, setCenterOpen]);
}
