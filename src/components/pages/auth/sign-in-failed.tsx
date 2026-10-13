import { useSearchParams } from "react-router-dom";
import { Button } from "rsuite";
import { AuthHeader } from "@/components/pages/auth/auth-ui";
import { signInUrl, signOut } from "@/libs/auth/session-store";

// Where a sign-in ends when it did not lead into the application. The
// reason comes from the backend, as one of a few fixed words; anything else
// gets the general text.
const explanations: Record<string, { title: string; text: string }> = {
  not_an_employee: {
    title: "No access yet",
    text: "The account you signed in with is not an employee of this workspace. Ask an owner to add your email address, or sign in with another account.",
  },
  email_not_verified: {
    title: "Verify your email first",
    text: "Your account's email address has not been verified. Open the verification email you received, then sign in again.",
  },
  account_disabled: {
    title: "Account disabled",
    text: "Your account in this workspace has been disabled. Ask an owner if you think this is a mistake.",
  },
  account_conflict: {
    title: "Another account uses this email",
    text: "This email address already belongs to an employee who signs in with a different account. Ask an owner for help.",
  },
  access_denied: {
    title: "No access",
    text: "You do not have access to this application.",
  },
};

const generalExplanation = {
  title: "Sign-in did not work",
  text: "Something went wrong while signing you in. Please try again.",
};

const SignInFailed = () => {
  const [searchParams] = useSearchParams();
  const explanation =
    explanations[searchParams.get("reason") ?? ""] ?? generalExplanation;

  return (
    <div className="w-screen h-screen">
      <div className="box-center flex-col bg-white min-h-full min-w-full overflow-hidden px-4">
        <div
          className="bg-white py-20 px-8 sm:px-20 shadow-xl rounded-xl relative "
          style={{ maxWidth: "26rem" }}
        >
          <AuthHeader title={explanation.title} subtitle={explanation.text} />
          <div className="flex flex-col gap-3">
            <Button
              color="blue"
              appearance="primary"
              block
              onClick={() => window.location.assign(signInUrl())}
            >
              Try again
            </Button>
            {/* Signing out at the IAM is what lets someone pick another account. */}
            <Button appearance="ghost" color="blue" block onClick={signOut}>
              Sign out and use another account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInFailed;
