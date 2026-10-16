import { useEffect } from "react";
import { Loader } from "rsuite";
import { signOut } from "@/libs/auth/session-store";

// Signing out ends the session at VTK IAM too, so the browser leaves for the
// IAM's sign-out page and comes back from there.
const Logout = () => {
  useEffect(() => {
    void signOut();
  }, []);

  return (
    <div className="w-screen h-screen box-center">
      <Loader size="md" content="Signing you out..." vertical />
    </div>
  );
};

export default Logout;
