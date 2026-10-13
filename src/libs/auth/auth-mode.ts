// How people sign in, fixed when the site is built:
//   legacy (default)  the pages of this site ask for a password or a code
//   iam               VTK IAM signs people in; set VITE_AUTH_MODE to "iam".
//                     It has to match AUTH_MODE of the backend.
export const isIamMode = import.meta.env.VITE_AUTH_MODE === "iam";
