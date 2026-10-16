import { useMemo, useSyncExternalStore } from "react";
import {
  getSessionState,
  subscribeToSession,
} from "@/libs/auth/session-store";

/** The session: loading, signed in, signed out or refused. */
export const useSession = () =>
  useSyncExternalStore(subscribeToSession, getSessionState);

// The user is what the backend answered.
export const useUser = () => {
  const session = useSession();

  return session.status === "signed-in" ? session.user : null;
};

export const useRole = () => {
  const user = useUser();

  return useMemo(() => (user ? user.role : 0), [user]);
};
