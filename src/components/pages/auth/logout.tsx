import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "rsuite";
import { isIamMode } from "@/libs/auth/auth-mode";
import { signOut } from "@/libs/auth/session-store";

const LegacyLogout = () => {
  localStorage.clear();

  return <Navigate to="/auth/login" state={{}} />;
};

// Sign-in through VTK IAM: signing out ends the session at the IAM too, so
// the browser leaves for the IAM's sign-out page and comes back from there.
const IamLogout = () => {
  useEffect(() => {
    void signOut();
  }, []);

  return (
    <div className="w-screen h-screen box-center">
      <Loader size="md" content="Signing you out..." vertical />
    </div>
  );
};

const Logout = isIamMode ? IamLogout : LegacyLogout;

export default Logout;
