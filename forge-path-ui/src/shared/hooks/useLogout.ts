"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { authService } from "@/services/auth.service";
import { useSessionStore } from "@/shared/stores/session.store";
import { useAIStore } from "@/shared/stores/ai.store";
import { useNotificationStore } from "@/shared/stores/notification.store";
import { useBackgroundStore } from "@/shared/stores/background.store";
import { useDrawerStore } from "@/shared/stores/drawer.store";

/**
 * useLogout
 *
 * Executes the full authenticated session teardown:
 *   1. Calls backend /auth/logout to invalidate the server-side token
 *   2. Clears localStorage, sessionStorage, and auth cookies
 *   3. Resets every Zustand store that holds session-scoped data
 *   4. Cancels any in-flight polling by removing the axios Authorization header
 *   5. Navigates to /login
 */
export function useLogout() {
  const router = useRouter();
  const clearSession = useSessionStore((s) => s.clearSession);
  const clearAI = useAIStore((s) => s.clearSession);
  const clearNotifications = useNotificationStore((s) => s.clearAll);
  const clearBackgroundJobs = useBackgroundStore((s) => s.clearAll);
  const closeAllDrawers = useDrawerStore((s) => s.closeAll);
  const { signOut } = useClerk();

  const logout = useCallback(async () => {
    try {
      // 1. Notify backend (if still needed) and revoke Clerk session
      await authService.logout().catch(() => {});
      await signOut();
    } finally {
      // 2. Clear all Zustand stores that hold session data
      clearSession();        // Wipes tokens, localStorage, sessionStorage, cookies
      clearAI();             // Clears AI conversation history
      clearNotifications();  // Removes all notification items
      clearBackgroundJobs(); // Cancels displayed background jobs
      closeAllDrawers();     // Closes any open drawers

      // 3. Strip the axios Authorization header immediately so in-flight
      //    requests cannot use the revoked token on retry
      if (typeof window !== "undefined") {
        // Dynamic import avoids circular reference at module load
        import("@/lib/api-client").then(({ default: api }) => {
          delete api.defaults.headers.common["Authorization"];
        });
      }

      // 4. Navigate to login
      router.replace("/login");
    }
  }, [clearSession, clearAI, clearNotifications, clearBackgroundJobs, closeAllDrawers, router]);

  return logout;
}
