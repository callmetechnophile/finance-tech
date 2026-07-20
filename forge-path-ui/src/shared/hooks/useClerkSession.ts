"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSessionStore } from "@/shared/stores/session.store";
import type { UserProfile } from "@/shared/stores/session.store";

/**
 * useClerkSession
 *
 * Bridges Clerk's authenticated user into the FORGE-PATH Zustand session store.
 * Mount this hook once high in the component tree (e.g., RootProvider or AppShell).
 *
 * - When Clerk has a signed-in user → populates useSessionStore with real identity
 * - When Clerk has no user (signed out) → clears useSessionStore
 * - Never reads from localStorage cache — always derives from Clerk's live session
 */
export function useClerkSession() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { setSession, clearSession, isAuthenticated } = useSessionStore();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      // Map Clerk user → FORGE-PATH UserProfile
      const fullName = user.fullName ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
      const email = user.primaryEmailAddress?.emailAddress ?? "";
      const role = (user.publicMetadata?.role as UserProfile["role"]) ?? "Finance Manager";
      const orgId = user.organizationMemberships?.[0]?.organization?.id ?? "default";
      const orgName = user.organizationMemberships?.[0]?.organization?.name ?? undefined;

      const profile: UserProfile = {
        id: user.id,
        name: fullName || "User",
        email,
        role,
        avatar: user.imageUrl ?? undefined,
        organization: orgName,
        permissions: (user.publicMetadata?.permissions as string[]) ?? ["read"],
      };

      // Only call setSession if identity has actually changed
      // (avoids infinite re-render loop)
      setSession(profile, orgId, "clerk-managed");
    } else if (!isSignedIn && isAuthenticated) {
      // Clerk signed out → clear FORGE-PATH session
      clearSession();
    }
  }, [isLoaded, isSignedIn, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps
}
