import { Navigate } from "react-router";
import { clearAllCookie } from "../utils/cookieHandler";

interface ILoginPrivateRouteProps {
  children: React.ReactNode;
}

const LoginPrivateRoute = ({ children }: ILoginPrivateRouteProps) => {
  const token = localStorage.getItem("refresh_token");

  if (!token) {
    clearAllCookie();
    localStorage.clear();

    return <Navigate to="/auth/logout" />;
  }

  return <>{children}</>;
};

export default LoginPrivateRoute;
