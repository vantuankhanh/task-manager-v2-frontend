import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "rsuite";
import { ensureSessionLoaded } from "@/libs/auth/session-store";
import { useSession } from "@/libs/hooks/use-user";

interface ILoginPrivateRouteProps {
  children: JSX.Element;
}

// The backend is asked who is signed in before anything of the application
// is shown, so no page flashes for a visitor who turns out not to be signed
// in.
const RequireLogin = ({ children }: ILoginPrivateRouteProps) => {
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

export default RequireLogin;
