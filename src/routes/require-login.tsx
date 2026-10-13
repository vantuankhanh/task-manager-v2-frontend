import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "rsuite";
import { isIamMode } from "@/libs/auth/auth-mode";
import { ensureSessionLoaded } from "@/libs/auth/session-store";
import { useSession } from "@/libs/hooks/use-user";
import { clearAllCookie } from "@/libs/utils/cookie-handler";

interface ILoginPrivateRouteProps {
  children: JSX.Element;
}

const RequireLegacyLogin = ({ children }: ILoginPrivateRouteProps) => {
  const token = localStorage.getItem("refresh_token");

  if (!token) {
    clearAllCookie();
    localStorage.clear();

    return <Navigate to="/auth/logout" />;
  }

  return <>{children}</>;
};

// Sign-in through VTK IAM: the backend is asked who is signed in before
// anything of the application is shown, so no page flashes for a visitor
// who turns out not to be signed in.
const RequireIamLogin = ({ children }: ILoginPrivateRouteProps) => {
  const session = useSession();

  useEffect(() => {
    void ensureSessionLoaded();
  }, []);

  if (session.status === "loading") {
    return (
      <div className="w-screen h-screen box-center">
        <Loader size="md" content="Signing you in..." vertical />
      </div>
    );
  }
  if (session.status === "refused") {
    return <Navigate to={`/auth/sign-in-failed?reason=${session.reason}`} />;
  }
  if (session.status === "signed-out") {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
};

const RequireLogin = isIamMode ? RequireIamLogin : RequireLegacyLogin;

export default RequireLogin;
