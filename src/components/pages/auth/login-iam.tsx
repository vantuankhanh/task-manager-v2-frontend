import {
  AuthHeader,
  AuthSubmitButton,
} from "@/components/pages/auth/auth-ui";
import { signInUrl } from "@/libs/auth/session-store";

// The sign-in page when VTK IAM signs people in: one button that leaves for
// the IAM, which asks for the password or offers Google, and comes back.
const LoginIam = () => (
  <div className="box-center flex-col bg-white min-h-full min-w-full overflow-hidden px-4">
    <div
      className="bg-white py-20 px-8 sm:px-20 shadow-xl rounded-xl relative "
      style={{ maxWidth: "26rem" }}
    >
      <AuthHeader
        title="Task Manager"
        subtitle="Sign in with the email address your account was created for."
      />
      <AuthSubmitButton onClick={() => window.location.assign(signInUrl())}>
        Sign in
      </AuthSubmitButton>
    </div>
  </div>
);

export default LoginIam;
