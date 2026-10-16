import axios, { AxiosError } from "axios";
import { IRefreshTokenDecodeModel } from "@/libs/types/refresh-token-decode-model";

// Who is signed in. VTK IAM signs people in.
//
// The tokens are in cookies the page cannot read, so the page asks the
// backend who it is. The answer is kept here, outside React, because the
// HTTP client needs it too: it marks the session as ended when a refresh
// fails.

// Why someone who is signed in at the IAM may not use this application.
export const refusalReasons = [
  "not_an_employee",
  "email_not_verified",
  "account_disabled",
  "account_conflict",
] as const;
export type RefusalReason = (typeof refusalReasons)[number];

export type SessionState =
  | { status: "loading" }
  | { status: "signed-in"; user: IRefreshTokenDecodeModel }
  | { status: "signed-out" }
  | { status: "refused"; reason: RefusalReason };

const apiBaseUrl = import.meta.env.VITE_BASE_URL;

let sessionState: SessionState = { status: "loading" };
const listeners = new Set<() => void>();

const setSessionState = (nextState: SessionState) => {
  sessionState = nextState;
  listeners.forEach((listener) => listener());
};

export const subscribeToSession = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getSessionState = () => sessionState;

export const isRefusalReason = (value: unknown): value is RefusalReason =>
  refusalReasons.includes(value as RefusalReason);

/** The reason in a 403 answer of the backend, if it is one of the known ones. */
export const refusalReasonOf = (error: unknown): RefusalReason | null => {
  const answer = (error as AxiosError<{ data?: { error?: unknown } }>).response;
  const reason = answer?.status === 403 ? answer.data?.data?.error : undefined;
  return isRefusalReason(reason) ? reason : null;
};

export const markSignedOut = () => setSessionState({ status: "signed-out" });
export const markRefused = (reason: RefusalReason) =>
  setSessionState({ status: "refused", reason });

// One refresh at a time: a burst of requests that all find the access token
// expired share it.
let refreshInProgress: Promise<void> | null = null;

/** Asks the backend for a new access token cookie. Rejects when the session is over. */
export const refreshSession = (): Promise<void> => {
  refreshInProgress ??= axios
    .post(`${apiBaseUrl}/auth/refresh`, null, { withCredentials: true })
    .then(() => undefined)
    .finally(() => {
      refreshInProgress = null;
    });
  return refreshInProgress;
};

const fetchCurrentUser = async (): Promise<IRefreshTokenDecodeModel> => {
  const answer = await axios.get(`${apiBaseUrl}/auth/me`, {
    withCredentials: true,
  });
  return answer.data.data;
};

let loadInProgress: Promise<void> | null = null;

const loadSession = async () => {
  try {
    let user: IRefreshTokenDecodeModel;
    try {
      user = await fetchCurrentUser();
    } catch (error) {
      if ((error as AxiosError).response?.status !== 401) throw error;
      // The access token has expired or was never there: one refresh, then
      // the same question again.
      await refreshSession();
      user = await fetchCurrentUser();
    }
    setSessionState({ status: "signed-in", user });
  } catch (error) {
    const reason = refusalReasonOf(error);
    if (reason) markRefused(reason);
    else markSignedOut();
  }
};

/** Finds out who is signed in, once; later calls wait for the same answer. */
export const ensureSessionLoaded = (): Promise<void> => {
  loadInProgress ??= loadSession();
  return loadInProgress;
};

/** Where to send the browser to sign in. The backend answers with a redirect to the IAM. */
export const signInUrl = (
  options: { returnToPath?: string; switchAccount?: boolean } = {},
): string => {
  const url = new URL(`${apiBaseUrl}/auth/login`);
  url.searchParams.set("returnTo", options.returnToPath ?? "/");
  // Show the IAM's sign-in form even to a browser that is still signed in there.
  if (options.switchAccount) url.searchParams.set("prompt", "login");
  return url.toString();
};

/**
 * Signs out here and at the IAM: the backend clears its cookies and names
 * the IAM's sign-out address, which ends the session for every application.
 */
export const signOut = async () => {
  let redirectUrl = "/auth/login";
  try {
    const answer = await axios.post(`${apiBaseUrl}/auth/logout`, null, {
      withCredentials: true,
    });
    if (typeof answer.data?.redirectUrl === "string") {
      redirectUrl = answer.data.redirectUrl;
    }
  } catch {
    // Nothing to sign out of, or the backend is away: the sign-in page it is.
  }
  markSignedOut();
  window.location.assign(redirectUrl);
};
