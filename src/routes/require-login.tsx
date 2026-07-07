import { Navigate } from "react-router-dom";
import { clearAllCookie } from "@/libs/utils/cookie-handler";

interface ILoginPrivateRouteProps {
  children: JSX.Element;
}

const RequireLogin = ({ children }: ILoginPrivateRouteProps) => {
  const token = localStorage.getItem("refresh_token");

  if (!token) {
    clearAllCookie();
    localStorage.clear();

    return <Navigate to="/auth/logout" />;
  }

  return <>{children}</>;
};

export default RequireLogin;
