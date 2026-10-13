import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isIamMode } from "@/libs/auth/auth-mode";
import { ensureSessionLoaded } from "@/libs/auth/session-store";
import { useSession } from "@/libs/hooks/use-user";
import { IChildrenProps } from "@/libs/types/children-props";

const RedirectIfLegacyAuthenticated = ({ children }: IChildrenProps) => {
  const data = localStorage.getItem("refresh_token");

  if (data) {
    return <Navigate to="/" />;
  }
  return <div className="w-screen h-screen">{children}</div>;
};

// Sign-in through VTK IAM: the sign-in page is shown while the backend is
// asked, and left for the application as soon as it says someone is signed in.
const RedirectIfIamAuthenticated = ({ children }: IChildrenProps) => {
  const session = useSession();

  useEffect(() => {
    void ensureSessionLoaded();
  }, []);

  if (session.status === "signed-in") {
    return <Navigate to="/" />;
  }
  return <div className="w-screen h-screen">{children}</div>;
};

const RedirectIfAuthenticated = isIamMode
  ? RedirectIfIamAuthenticated
  : RedirectIfLegacyAuthenticated;

export default RedirectIfAuthenticated;
