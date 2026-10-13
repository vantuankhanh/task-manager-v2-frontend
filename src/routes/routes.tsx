import { lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import LayoutMain from "@/components/layouts/main-layout";
import { isIamMode } from "@/libs/auth/auth-mode";
import RedirectIfAuthenticated from "@/routes/redirect-if-authenticated";
import RequireLogin from "@/routes/require-login";

/* -----------------------------AUTH--------------------------------- */

const AccessDeniedPage = lazy(() => import("@/components/pages/auth/access"));
// With VTK IAM the sign-in page is one button; the forms for passwords and
// codes are not even downloaded.
const Login = lazy(() =>
  isIamMode
    ? import("@/components/pages/auth/login-iam")
    : import("@/components/pages/auth/login"),
);
const Logout = lazy(() => import("@/components/pages/auth/logout"));
const NotFound = lazy(() => import("@/components/pages/auth/not-found"));
const SignupEmail = lazy(() => import("@/components/pages/auth/signup-email"));
const SignInFailed = lazy(
  () => import("@/components/pages/auth/sign-in-failed"),
);

/* ----------------------------PAGE--------------------------------- */

const Homepage = lazy(() => import("@/components/pages/homepage/homepage"));
const Employee = lazy(() => import("@/components/pages/employee/employee"));
const Tasks = lazy(() => import("@/components/pages/tasks/tasks"));
const Messages = lazy(() => import("@/components/pages/messages/messages"));

/* ------------------------------------------------------------------ */

const Router = () => {
  const routes = useRoutes([
    {
      element: (
        <RequireLogin>
          <LayoutMain>
            <Outlet />
          </LayoutMain>
        </RequireLogin>
      ),
      children: [
        { path: "", element: <Homepage /> },
        { path: "employee", element: <Employee /> },
        { path: "tasks", element: <Tasks /> },
        { path: "messages", element: <Messages /> },
      ],
    },
    {
      path: "auth",
      element: <Outlet />,
      children: [
        {
          path: "login",
          element: (
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          ),
        },
        { path: "logout", element: <Logout /> },
        // Passwords are set at the IAM when it signs people in.
        {
          path: "signup-email",
          element: isIamMode ? <Navigate to="/auth/login" replace /> : <SignupEmail />,
        },
        { path: "sign-in-failed", element: <SignInFailed /> },
        { path: "403", element: <AccessDeniedPage /> },
        { path: "404", element: <NotFound /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/auth/404" replace />,
    },
  ]);

  return routes;
};

export default Router;
