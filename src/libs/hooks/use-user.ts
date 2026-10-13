import { jwtDecode } from "jwt-decode";
import { useMemo, useSyncExternalStore } from "react";
import { isIamMode } from "@/libs/auth/auth-mode";
import {
  getSessionState,
  subscribeToSession,
} from "@/libs/auth/session-store";
import { IRefreshTokenDecodeModel } from "@/libs/types/refresh-token-decode-model";

// Legacy sign-in: the user is what the refresh token in localStorage says.
const useLegacyUser = () => {
  const token = localStorage.getItem("refresh_token");

  return useMemo<IRefreshTokenDecodeModel | null>(
    () => (token ? jwtDecode(token) : null),
    [token]
  );
};

/** The session when VTK IAM signs people in: loading, signed in, signed out or refused. */
export const useSession = () =>
  useSyncExternalStore(subscribeToSession, getSessionState);

// Sign-in through VTK IAM: the user is what the backend answered.
const useIamUser = () => {
  const session = useSession();

  return session.status === "signed-in" ? session.user : null;
};

// The mode is fixed when the site is built, so the same hook runs at every
// render.
export const useUser = isIamMode ? useIamUser : useLegacyUser;

export const useRole = () => {
  const user = useUser();

  return useMemo(() => (user ? user.role : 0), [user]);
};
