import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ensureSessionLoaded } from "@/libs/auth/session-store";
import { useSession } from "@/libs/hooks/use-user";
import { IChildrenProps } from "@/libs/types/children-props";

// The sign-in page is shown while the backend is asked, and left for the
// application as soon as it says someone is signed in.
const RedirectIfAuthenticated = ({ children }: IChildrenProps) => {
  const session = useSession();

  useEffect(() => {
    void ensureSessionLoaded();
  }, []);

  if (session.status === "signed-in") {
    return <Navigate to="/" />;
  }
  return <div className="w-screen h-screen">{children}</div>;
};

export default RedirectIfAuthenticated;
